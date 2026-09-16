/**
 * Express SSR Server
 *
 * Dieser Server rendert die React-App serverseitig und liefert
 * vollständiges HTML an den Client.
 *
 * Modi:
 * - Development: Verwendet Vite Middleware für HMR und schnelle Rebuilds
 * - Production: Lädt statische Assets aus dist/client
 */

import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import {
  DEFAULT_LANGUAGE,
  getLanguageFromPathname,
  SSR_I18N_STATE_ID,
  type SsrI18nState,
  type SupportedLanguage,
} from './src/i18n'
import { generateSitemapXml } from './src/components/seo/sitemap'
import {
  getCanonicalRouteEntries,
  getRegistryRedirectTarget,
  isKnownCanonicalPath,
  normalizeRoutePath,
} from './src/routing/routeRegistry'
import {
  buildContentSecurityPolicy,
  cspHeaderName,
  resolveCspMode,
} from './src/security/contentSecurityPolicy'

import type { Request, Response, NextFunction } from 'express'
import type { ViteDevServer } from 'vite'

// =============================================================================
// CONSTANTS
// =============================================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000'
const CLIENT_DIST_DIR = process.env.POLARIS_CLIENT_DIST_DIR
  ? path.resolve(process.env.POLARIS_CLIENT_DIST_DIR)
  : path.resolve(__dirname, 'dist/client')
const SERVER_DIST_DIR = process.env.POLARIS_SERVER_DIST_DIR
  ? path.resolve(process.env.POLARIS_SERVER_DIST_DIR)
  : path.resolve(__dirname, 'dist/server')

/**
 * Preload-Tag fuer den Latin-Subset von Inter.
 *
 * Ohne Preload findet der Browser die woff2 erst, nachdem er das CSS
 * geparst hat — ein zusaetzlicher Roundtrip, in dem die Seite im Fallback
 * steht und danach sichtbar umspringt. Der Dateiname ist gehasht, also
 * einmalig aus dem Build-Verzeichnis lesen und cachen.
 */
let fontPreloadTag: string | undefined
function getFontPreloadTag(): string {
  if (fontPreloadTag === undefined) {
    try {
      const assetDir = path.resolve(CLIENT_DIST_DIR, 'assets')
      const file = fs
        .readdirSync(assetDir)
        .find((f) => /^inter-latin-wght-normal-.*\.woff2$/.test(f))
      fontPreloadTag = file
        ? `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${file}">`
        : ''
    } catch {
      fontPreloadTag = ''
    }
  }
  return fontPreloadTag
}

// =============================================================================
// TYPES
// =============================================================================

interface RenderModule {
  render: (
    url: string,
    lang: string,
  ) => Promise<{
    html: string
    helmet: {
      title: { toString: () => string }
      meta: { toString: () => string }
      link: { toString: () => string }
      script: { toString: () => string }
    }
    i18nState?: SsrI18nState
  }>
  preloadAllTranslations?: () => void
}

// =============================================================================
// SSR-I18N-UEBERGABE (AP25 PT25.2, PERF-B01)
// =============================================================================

/**
 * Kopf-Tag fuer die Hydration: der i18n-Zustand als JSON-Datenblock.
 * `type="application/json"` wird nie ausgefuehrt; `<` wird escaped, damit kein
 * Inhalt den Block beenden kann. `lng` und `ns` stammen aus der Sprach-/
 * Namespace-Whitelist in src/i18n.ts.
 *
 * Bewusst OHNE `<link rel="preload" as="fetch">` fuer die Namespaces (gemessen in
 * PT25.2, siehe PERFORMANCE-CONTRACT §26): Preloads mit Standardprioritaet
 * verschoben FCP/LCP auf Mobil und liessen die Schrift nach dem ersten Paint
 * tauschen (/de/contact CLS 0,161); mit `fetchpriority="low"` trat derselbe
 * Shift noch sporadisch auf. Ohne Preload laden die SSR-Namespaces nach dem
 * Entry-JS — trotzdem ~0,8 s frueher hydriert als mit allen 30 Dateien.
 */
function i18nHeadTags(state: SsrI18nState | undefined): string {
  if (!state) return ''
  const json = JSON.stringify(state).replace(/</g, '\\u003c')
  return `<script type="application/json" id="${SSR_I18N_STATE_ID}">${json}</script>`
}

// =============================================================================
// STYLESHEET INLINE (AP25 PT25.4)
// =============================================================================

/**
 * Liefert das (einzige) App-Stylesheet als `<style>` im Kopf statt als `<link>`.
 *
 * Gemessen (PT25.4, mobil gedrosselt hinter gzip, verschraenkt je 5–7 Laeufe): die CSS-Datei
 * brauchte eine eigene Rundreise und endete bei ~770 ms; inline sinkt FCP um ~490–550 ms
 * (z. B. /de/contact 1.096 → 544 ms). Das CSS ist unveraendert, synchron und vor dem Inhalt
 * verfuegbar: kein FOUC, Fokus-Stile ab dem ersten Frame, kein Async-CSS.
 * Preis: rund 17 KB gzip mehr HTML je Voll-Navigation, weil das CSS nicht mehr separat
 * gecacht wird (clientseitige Navigation laedt kein HTML nach). Ohne die gemessenen
 * Fallback-Metriken in index.css brachte inline Font-Swap-CLS bis 0,161 — beides gehoert
 * zusammen. Faellt das Lesen der Datei aus, bleibt der `<link>` unveraendert stehen.
 */
let inlineStylesheetCache: { href: string; tag: string; hash: string } | null = null
function inlineStylesheet(template: string): { html: string; styleHashes: string[] } {
  const match = template.match(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/)
  if (!match) return { html: template, styleHashes: [] }
  try {
    if (!inlineStylesheetCache || inlineStylesheetCache.href !== match[1]) {
      const css = fs
        .readFileSync(path.resolve(CLIENT_DIST_DIR, match[1].slice(1)), 'utf-8')
        .replace(/<\/style/gi, '<\\/style')
      inlineStylesheetCache = {
        href: match[1],
        tag: `<style data-inline-stylesheet="${match[1]}">${css}</style>`,
        // AP26 PT26.2: die CSP gibt genau diesen Inhalt per Hash frei statt `'unsafe-inline'`.
        hash: createHash('sha256').update(css, 'utf8').digest('base64'),
      }
    }
    const { tag, hash } = inlineStylesheetCache
    return { html: template.replace(match[0], () => tag), styleHashes: [hash] }
  } catch {
    return { html: template, styleHashes: [] }
  }
}

// =============================================================================
// SSR-WARM-UP (AP25 PT25.2)
// =============================================================================

/**
 * Rendert nach dem Start jede kanonische Route einmal in der Default-Sprache.
 *
 * Grund (gemessen in PT25.2): der ERSTE Request je Route nach einem Deploy
 * zahlt den Lazy-Import des Routenchunks plus die head-gated Retry-Schleife
 * (Startseite ~200 ms, Musterbefund ~100 ms, lazy Consumer-Seiten ~40 ms statt
 * ~10 ms warm). Der Warm-up zieht diese Importe vor den ersten Besucher. Er
 * laeuft nach `listen`, blockiert keinen Request, gibt zwischen den Routen die
 * Event-Loop frei und darf den Start nie verhindern: Fehler werden nur geloggt.
 * Die Chunks sind sprachunabhaengig; Befund-Routen laden serverseitig ohnehin
 * alle zehn Fassungen.
 */
async function warmUpSsrRoutes(render: RenderModule['render']): Promise<void> {
  const started = performance.now()
  const paths = [...new Set(getCanonicalRouteEntries().map((entry) => entry.path))]
  let failed = 0
  for (const routePath of paths) {
    try {
      await render(`/${DEFAULT_LANGUAGE}${routePath === '/' ? '/' : routePath}`, DEFAULT_LANGUAGE)
    } catch {
      failed += 1
    }
    await new Promise<void>((resolve) => setImmediate(resolve))
  }
  console.log(
    `[ssr-warmup] ${paths.length - failed}/${paths.length} Routen in ${Math.round(performance.now() - started)} ms vorgewaermt`,
  )
}

// =============================================================================
// LANGUAGE URL HELPERS
// =============================================================================

/**
 * Extrahiert die Sprache aus dem URL-Prefix.
 *
 * @returns Das Sprach-Kürzel wenn ein gültiger Prefix vorliegt, sonst null.
 *
 * Beispiele:
 *   /en/about  → 'en'
 *   /de/       → 'de'
 *   /about     → null
 *   /xx/about  → null  (ungültiger Code)
 */
function extractLanguageFromUrl(pathname: string): SupportedLanguage | null {
  return getLanguageFromPathname(pathname)
}

/**
 * Prüft ob eine URL auf eine statische Ressource zeigt,
 * die NICHT redirected werden soll.
 *
 * Erfasst: /assets/*, /locales/*, favicon.*, robots.txt,
 *          sitemap.xml, *.js, *.css, *.map, Bilder, Fonts
 */
function isStaticAsset(pathname: string): boolean {
  // Bekannte statische Pfad-Prefixe
  if (pathname.startsWith('/assets/') || pathname.startsWith('/locales/')) {
    return true
  }

  // Bekannte statische Dateien und Datei-Endungen
  return /\.(js|css|map|ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2|ttf|eot|json|txt|xml|webmanifest)$/.test(
    pathname,
  )
}

// =============================================================================
// ROUTE KNOWLEDGE
// =============================================================================

/**
 * The app flags a soft 404 (catch-all route, unknown article slug) by emitting
 * <meta name="prerender-status-code" content="404"> via <SEOHead notFound>.
 * That covers the dynamic cases the path table above cannot know.
 */
const NOT_FOUND_MARKER = /name="prerender-status-code"[^>]*content="404"/i

// =============================================================================
// SECURITY BASELINE HEADERS (AP26 PT26.1)
// =============================================================================

/**
 * Security-Baseline, von der App auf JEDE Antwort gesetzt (SECURITY-CONTRACT §4).
 *
 * Die App ist alleiniger Owner dieser Header; der Reverse Proxy besitzt TLS und
 * HSTS (DEP-32). Zwei Setzer fuer denselben Header erzeugten auf der Preview
 * doppelte `X-Content-Type-Options`-Zeilen (gemessen PT26.1).
 */
const SECURITY_BASELINE_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  // Frame-Schutz fuer Browser ohne CSP-`frame-ancestors`; in Produktion setzt die CSP
  // `frame-ancestors 'self'` seit AP26 PT26.2 zusaetzlich durch.
  'X-Frame-Options': 'SAMEORIGIN',
  // Den XSS-Auditor alter Browser ausdruecklich abschalten: der Filter war selbst ein
  // Seitenkanal, aktuelle Browser haben ihn entfernt (vorher `1; mode=block`).
  'X-XSS-Protection': '0',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Keine dieser Schnittstellen hat einen Verwender in src/ (Code-Suche PT26.1).
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
} as const

// =============================================================================
// SERVER SETUP
// =============================================================================

async function createServer() {
  const app = express()

  // Entferne den X-Powered-By: Express Header (Informations-Leak vermeiden).
  app.disable('x-powered-by')

  const cspHeader = cspHeaderName(resolveCspMode(process.env))

  // AP26 PT26.1: vor den statischen Middlewares registriert. Vorher liefen die Header erst
  // danach, und `express.static` beantwortete /assets, /locales, robots.txt und favicon ohne
  // jeden Security-Header (gemessen lokal und live). Antworten des API-Proxys ueberschreiben
  // gleichnamige Header mit den Backend-Werten (etwa `Referrer-Policy: no-referrer` auf
  // geschuetzten Downloads) — `setHeader` ersetzt, es entsteht keine Doppelung.
  app.use((_req, res, next) => {
    for (const [name, value] of Object.entries(SECURITY_BASELINE_HEADERS)) {
      res.setHeader(name, value)
    }
    next()
  })

  let vite: ViteDevServer | undefined

  // ---------------------------------------------------------------------------
  // DEVELOPMENT: Vite Middleware
  // ---------------------------------------------------------------------------
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite')

    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    })

    // Vite Middleware für HMR und Asset-Transformation
    app.use(vite.middlewares)
  }

  // ---------------------------------------------------------------------------
  // PRODUCTION: Statische Assets
  // ---------------------------------------------------------------------------
  if (isProduction) {
    // Hashed Assets (mit Content-Hash im Dateinamen) - langfristiges Caching
    app.use(
      '/assets',
      express.static(path.resolve(CLIENT_DIST_DIR, 'assets'), {
        maxAge: '1y',
        immutable: true,
      }),
    )

    // Andere statische Assets aus dist/client
    app.use(
      express.static(CLIENT_DIST_DIR, {
        index: false, // Kein automatisches index.html serving
        // Public asset directories may share a name with an application route
        // (currently /downloads). Express' default directory redirect would
        // otherwise run before the locale middleware and create
        // /downloads -> /downloads/ -> /de/downloads/. Real files below the
        // directory are still served normally with this disabled.
        redirect: false,
        maxAge: '1h', // Kürzeres Caching für nicht-gehashte Assets
      }),
    )
  }

  // ---------------------------------------------------------------------------
  // CONTENT SECURITY POLICY (AP26 PT26.2)
  // ---------------------------------------------------------------------------
  // Inhalt und Modus kommen aus src/security/contentSecurityPolicy.ts (SECURITY-CONTRACT §8).
  // Produktion setzt durch; ohne Report-Empfaenger gibt es kein `report-uri`. Diese Middleware
  // deckt Redirects, API-Proxy und Fehler ab; der SSR-Handler ersetzt den Header durch die
  // Fassung mit dem Hash des inline ausgelieferten Stylesheets.
  app.use((_req, res, next) => {
    res.setHeader(cspHeader, buildContentSecurityPolicy())
    next()
  })

  // ---------------------------------------------------------------------------
  // DYNAMIC SITEMAP ENDPOINT
  // ---------------------------------------------------------------------------
  // Serves before static assets and language redirects.
  // 39 real indexable route families × 10 locales, validated by Guard G3.
  // ---------------------------------------------------------------------------
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    const xml = generateSitemapXml()
    res
      .set({
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      })
      .send(xml)
  })

  // ---------------------------------------------------------------------------
  // API PROXY
  // ---------------------------------------------------------------------------
  app.use(
    '/api',
    createProxyMiddleware({
      target: BACKEND_URL,
      changeOrigin: true,
      // Express strips mount path, so we need to add /api back
      pathRewrite: (path) => '/api' + path,
    }),
  )

  // ---------------------------------------------------------------------------
  // LANGUAGE REDIRECT MIDDLEWARE
  // ---------------------------------------------------------------------------
  // Leitet alle Seiten-URLs ohne gültiges Sprach-Prefix per 301 auf /de/ um.
  //
  // Regeln:
  //   /about             → 301 → /de/about
  //   /                  → 301 → /de/
  //   /diagnostics/dental→ 301 → /de/diagnostics/dental
  //   /xx/about          → 301 → /de/xx/about   (ungültiger Prefix, wird als Pfad behandelt)
  //
  // NICHT redirected: /assets/*, /locales/*, /api/*, statische Dateien
  // ---------------------------------------------------------------------------
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Nur sichere Seitenabrufe redirecten (POST, PUT etc. durchlassen).
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next()
    }

    const pathname = req.path

    // Statische Assets nie redirecten
    if (isStaticAsset(pathname)) {
      return next()
    }

    // API-Requests nie redirecten (wird vom Proxy behandelt)
    if (pathname.startsWith('/api/') || pathname === '/api') {
      return next()
    }

    const query = req.originalUrl.includes('?')
      ? req.originalUrl.substring(req.originalUrl.indexOf('?'))
      : ''

    const langPrefix = extractLanguageFromUrl(pathname)

    // -------------------------------------------------------------------------
    // Repository-known legacy paths for every language prefix, resolved in one
    // hop while preserving the requested supported locale. The map includes
    // primary aliases, old article IDs and old underscore service slugs.
    // /en/s3-leitlinie -> /en/s3_leitlinie, /agb -> /de/terms.
    // -------------------------------------------------------------------------
    const pathWithoutLang = langPrefix ? pathname.slice(3) || '/' : pathname
    const normalizedPathWithoutLang = normalizeRoutePath(pathWithoutLang)
    const legacyTarget = getRegistryRedirectTarget(normalizedPathWithoutLang)
    if (legacyTarget) {
      const targetLang = langPrefix || DEFAULT_LANGUAGE
      res.redirect(301, `/${targetLang}${legacyTarget}${query}`)
      return
    }

    // URL hat bereits ein gültiges Sprach-Prefix → kein Redirect nötig
    if (langPrefix !== null) {
      return next()
    }

    // Only known public pages are canonicalized to DE. Unknown paths are
    // internally rendered in the default locale so their original URL answers
    // 404 directly instead of becoming a 301 -> 404 soft migration.
    if (isKnownCanonicalPath(normalizedPathWithoutLang)) {
      const redirectPath = `/${DEFAULT_LANGUAGE}${pathname === '/' ? '/' : pathname}${query}`
      res.redirect(301, redirectPath)
      return
    }

    req.url = `/${DEFAULT_LANGUAGE}${pathname}${query}`
    next()
  })

  // ---------------------------------------------------------------------------
  // SSR HANDLER (Express 5 Wildcard Syntax)
  // ---------------------------------------------------------------------------
  // Alle Requests kommen hier mit gültigem Sprach-Prefix an (z.B. /en/about).
  // Der Prefix wird gestripped und die saubere URL an React Router übergeben.
  // ---------------------------------------------------------------------------
  app.get('/{*path}', async (req: Request, res: Response, next: NextFunction) => {
    const originalUrl = req.originalUrl
    const pathname = req.path

    // Sprache aus URL-Prefix extrahieren
    const lang = extractLanguageFromUrl(pathname)

    // Sicherheitsnetz: Ohne gültiges Prefix hätte die Redirect-Middleware
    // bereits redirected. Hier als Fallback.
    if (!lang) {
      const query = originalUrl.includes('?') ? originalUrl.substring(originalUrl.indexOf('?')) : ''
      res.redirect(301, `/${DEFAULT_LANGUAGE}${pathname}${query}`)
      return
    }

    // URL für React Router: Sprach-Prefix BEIBEHALTEN
    // StaticRouter basename=/${lang} strippt den Prefix selbst.
    // /en/about         → StaticRouter sieht /en/about, strippt /en → matched /about
    // /de/              → StaticRouter sieht /de/, strippt /de → matched /
    const query = originalUrl.includes('?') ? originalUrl.substring(originalUrl.indexOf('?')) : ''
    const routerUrl = pathname + query

    try {
      // Template laden
      let template: string
      let render: RenderModule['render']
      let styleHashes: string[] = []

      if (!isProduction && vite) {
        // -----------------------------------------------------------------------
        // DEVELOPMENT
        // -----------------------------------------------------------------------
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
        template = await vite.transformIndexHtml(originalUrl, template)

        const ssrModule = (await vite.ssrLoadModule('/src/entry-server.tsx')) as RenderModule

        if (ssrModule.preloadAllTranslations) {
          ssrModule.preloadAllTranslations()
        }

        render = ssrModule.render
      } else {
        // -----------------------------------------------------------------------
        // PRODUCTION
        // -----------------------------------------------------------------------
        template = fs.readFileSync(path.resolve(CLIENT_DIST_DIR, 'index.html'), 'utf-8')
        template = template.replace('</head>', `${getFontPreloadTag()}</head>`)
        ;({ html: template, styleHashes } = inlineStylesheet(template))

        const serverEntryPath = path.resolve(SERVER_DIST_DIR, 'entry-server.js')
        const ssrModule = (await import(/* @vite-ignore */ serverEntryPath)) as RenderModule

        render = ssrModule.render
      }

      // App rendern mit voller URL (inkl. Sprach-Prefix) und erkannter Sprache
      let { html: appHtml, helmet, i18nState } = await render(routerUrl, lang)

      // React 19 renderToString returns the Suspense fallback while the first
      // lazy route import is still resolving. A response must not leave with
      // the static root SEO defaults in that state: it would create two title
      // elements and, on a real 404, leak index/follow plus a root canonical.
      // Yield briefly so the already-started route import can settle, then
      // render the same request again. The bounded loop is deliberately
      // head-gated and does not introduce route knowledge or a second
      // meta-output implementation.
      const hasRealHelmetTitle = (titleHtml: string) => {
        const titleInner = titleHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
        return !!titleInner && titleInner[1].trim().length > 0
      }
      // A production cold start can resolve several AP15 route chunks in
      // parallel (Hub + deep pages + report entries). The former 50 ms budget
      // was shorter than that real import window and could still emit the
      // shell-only fallback. Keep the established bounded retry and extend it
      // only for the current Epigenetics family; the global lazy-SSR debt stays
      // with its existing rendering owner.
      const isEpigeneticsRequest =
        pathname === `/${lang}/epigenetics` || pathname.startsWith(`/${lang}/epigenetics/`)
      const maxHeadRenderAttempts = isEpigeneticsRequest ? 80 : 5
      for (
        let headRenderAttempt = 0;
        headRenderAttempt < maxHeadRenderAttempts && !hasRealHelmetTitle(helmet.title.toString());
        headRenderAttempt += 1
      ) {
        await new Promise<void>((resolve) => setTimeout(resolve, 25))
        ;({ html: appHtml, helmet, i18nState } = await render(routerUrl, lang))
      }

      // -----------------------------------------------------------------------
      // STATUS CODE
      // -----------------------------------------------------------------------
      // Unbekannte Pfade rendern die 404-Seite, wurden aber mit 200 ausgeliefert
      // — fuer Crawler war die Fehlerseite damit eine gueltige Seite. Zwei
      // unabhaengige Signale entscheiden jetzt:
      //   1. der Pfad ist kein konkreter Registry-Known-Path
      //   2. die App selbst meldet einen Soft-404 (Marker-Meta aus <SEOHead
      //      notFound>) — deckt unbekannte Artikel-Slugs ab, die die Pfadliste
      //      nicht kennen kann
      const pathWithoutLang = pathname.slice(3) || '/'
      const isNotFound =
        !isKnownCanonicalPath(pathWithoutLang) || NOT_FOUND_MARKER.test(helmet.meta.toString())

      // React 19 "Float": renderToString() emits <link rel="preload"> hints
      // at the beginning of the output for images encountered during render.
      // These cause hydration mismatches because hydrateRoot() doesn't expect
      // them inline. Strip them and move to <head> where they belong.
      const floatLinkPattern = /^(<link\s[^>]*\/>)+/
      const floatMatch = appHtml.match(floatLinkPattern)
      const floatLinks = floatMatch ? floatMatch[0] : ''
      const cleanAppHtml = floatLinks ? appHtml.substring(floatLinks.length) : appHtml

      // Helmet Tags zusammenbauen
      const helmetTags = [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
        floatLinks,
      ]
        .filter(Boolean)
        .join('\n    ')

      // Template mit gerendertem HTML und Helmet-Tags füllen.
      //
      // index.html ships a static <title> + <meta name="description"> as a
      // fallback (IglooPro defaults). Helmet then injects its own copies at
      // <!--helmet-head-->. The result is a page with TWO titles — scrapers
      // and link unfurlers can grab the stale fallback instead of the
      // page-specific value set via <SEOHead>.
      //
      // We strip the static <title>/<meta> ONLY when Helmet actually
      // rendered a non-empty title (i.e. the lazy page chunk loaded and
      // SEOHead ran during SSR). On a lazy-chunk fallback Helmet emits
      // <title data-rh="true"></title>; in that case we keep the static
      // tags so the page is not left title-less.
      const helmetTitleHtml = helmet.title.toString()
      const helmetHasRealTitle = hasRealHelmetTitle(helmetTitleHtml)
      let prepared = template
      if (helmetHasRealTitle) {
        prepared = prepared
          .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
          .replace(/<meta\s+name="title"[^>]*>\s*/i, '')
          .replace(/<meta\s+name="description"[^>]*>\s*/i, '')
          // Statisches Root-Canonical entfernen — Helmet liefert das korrekte
          // per-Seite-Canonical. Sonst hat jede Seite ZWEI Canonicals und
          // Google kann alle Sprach-/Seitenvarianten auf '/' kollabieren.
          .replace(/<link\s+rel="canonical"[^>]*>\s*/i, '')
          // Veraltetes de_DE / English-Alternate og:locale entfernen — Helmet
          // setzt das korrekte per-Sprache og:locale.
          // ALLE statischen og:/twitter:-Tags entfernen. Helmet liefert fuer
          // jeden davon eine seiten-spezifische Fassung; ohne das Strippen
          // steht die veraltete Variante VOR der richtigen, und Unfurler
          // (LinkedIn, WhatsApp, Slack) nehmen die erste. Konkret gewinnt
          // sonst nie ein seiten-eigenes og:image.
          .replace(/<meta[^>]*property="og:[^>]*>\s*/gi, '')
          .replace(/<meta[^>]*name="twitter:[^>]*>\s*/gi, '')
          // Veraltetes 'German' Sprach-Meta entfernen (gilt sonst für alle Sprachen).
          .replace(/<meta\s+name="language"[^>]*>\s*/i, '')
          // Statische robots-/googlebot-Direktive entfernen, sobald Helmet
          // eigene liefert. Sonst tragen /imprint, /privacy und /terms ZWEI
          // widersprüchliche Angaben: statisch "index, follow, …" und per
          // Helmet "noindex, nofollow" — Suchmaschinen nehmen die
          // restriktivste. Hier verschwindet nur die Doppelung, kein Wert
          // wird geändert. Ohne echten Helmet-Titel (Lazy-Chunk-Fallback)
          // bleibt die statische Angabe als Default stehen.
          .replace(/<meta\s+name="robots"[\s\S]*?>\s*/i, '')
          .replace(/<meta\s+name="googlebot"[^>]*>\s*/i, '')
      }
      const finalHtml = prepared
        .replace('<!--ssr-outlet-->', cleanAppHtml)
        .replace('<!--helmet-head-->', helmetTags)
        .replace('<html lang="de">', `<html lang="${lang}">`)
        // AP25 PT25.2: i18n-Zustand ans Ende des Kopfes. Funktionsersatz statt
        // Ersatzstring, damit `$` in Uebersetzungen nie als Muster wirkt.
        .replace('</head>', () => `${i18nHeadTags(i18nState)}</head>`)

      // HTML NIE cachen: die Seite referenziert content-gehashte Assets, die sich
      // bei jedem Deploy ändern. Ohne no-store zeigen Browser (heuristisch gecachte)
      // ALTE HTML → alte Asset-Hashes → alte Seite. Assets selbst bleiben langzeit-
      // cachebar (immutable, s. express.static oben).
      res
        .status(isNotFound ? 404 : 200)
        .set({
          'Content-Type': 'text/html',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          [cspHeader]: buildContentSecurityPolicy({ styleHashes }),
        })
        .end(finalHtml)
    } catch (error) {
      if (!isProduction && vite) {
        vite.ssrFixStacktrace(error as Error)
      }

      console.error('SSR Error:', error)
      next(error)
    }
  })

  // ---------------------------------------------------------------------------
  // ERROR HANDLER
  // ---------------------------------------------------------------------------
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    // Express erkennt Error-Middleware an vier Parametern; `_next` muss daher
    // trotz des terminalen Response-Zweigs Teil der Signatur bleiben.
    void _next
    console.error('Server Error:', err.stack)

    if (isProduction) {
      // AP26 PT26.1: eine Fehlerseite darf in keinem Cache landen.
      res.status(500).set('Cache-Control', 'no-store').send('Internal Server Error')
    } else {
      res.status(500).send(`
        <html>
          <head><title>SSR Error</title></head>
          <body>
            <h1>SSR Error</h1>
            <pre style="background:#f5f5f5;padding:20px;overflow:auto;">${err.stack}</pre>
          </body>
        </html>
      `)
    }
  })

  // ---------------------------------------------------------------------------
  // START SERVER
  // ---------------------------------------------------------------------------
  app.listen(PORT, '127.0.0.1', () => {
    if (isProduction) {
      const serverEntryPath = path.resolve(SERVER_DIST_DIR, 'entry-server.js')
      import(/* @vite-ignore */ serverEntryPath)
        .then((ssrModule: RenderModule) => warmUpSsrRoutes(ssrModule.render))
        .catch((error) => console.warn('[ssr-warmup] uebersprungen:', error))
    }
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   PolarisDX SSR Server                                     ║
║                                                            ║
║   Mode: ${isProduction ? 'Production' : 'Development'}                                      ║
║   URL:  http://localhost:${PORT}                              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `)
  })
}

// =============================================================================
// START
// =============================================================================

createServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
