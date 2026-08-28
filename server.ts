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

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { DEFAULT_LANGUAGE, getLanguageFromPathname, type SupportedLanguage } from './src/i18n'
import { generateSitemapXml, getSitemapRouteFamilies } from './src/components/seo/sitemap'

import type { Request, Response, NextFunction } from 'express'
import type { ViteDevServer } from 'vite'

// =============================================================================
// CONSTANTS
// =============================================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000'

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
      const assetDir = path.resolve(__dirname, 'dist/client/assets')
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
  }>
  preloadAllTranslations?: () => void
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
// LEGACY PATHS AND ROUTE KNOWLEDGE
// =============================================================================

/**
 * Old / mistyped URLs that must 301 onto their canonical counterpart.
 * Keys and values are written WITHOUT language prefix; the supported prefix
 * of the request is reused.
 *
 *   /agb           the German terms page used to live here and is still linked
 *   /s3-leitlinie  hyphen spelling; the route is /s3_leitlinie (underscore)
 *
 * Without these both paths fall through to the catch-all and render the 404
 * page under a URL that looks perfectly valid.
 */
const LEGACY_PATH_REDIRECTS: Record<string, string> = {
  '/agb': '/terms',
  '/s3-leitlinie': '/s3_leitlinie',
}

/**
 * Routes that exist but are deliberately not in the sitemap source.
 * Everything else is derived from the sitemap, so a new sitemap entry is known
 * automatically. MIRRORS src/App.tsx: a <Route> added there without an entry
 * here renders fine but answers 404.
 */
const EXTRA_KNOWN_PATHS: string[] = [
  '/support', // reachable from the header, intentionally unlisted
  '/services', // client-side redirect to /diagnostics
  '/privacy', // noindex legal route; excluded from sitemap
  '/imprint', // noindex legal route; excluded from sitemap
  '/terms', // noindex legal route; excluded from sitemap
]

const KNOWN_PATHS = new Set<string>([
  ...getSitemapRouteFamilies().map((route) => route.path),
  ...EXTRA_KNOWN_PATHS,
])

/**
 * True when the path (WITHOUT language prefix) matches a route of the React
 * app. Used to answer a real 404 instead of 200 for unknown URLs.
 *
 * /services/:slug is matched by pattern because it only renders a redirect to
 * /diagnostics/:slug — the target then decides whether it is a 404.
 */
function isKnownPath(pathWithoutLangPrefix: string): boolean {
  const p = pathWithoutLangPrefix.replace(/\/+$/, '') || '/'
  if (KNOWN_PATHS.has(p)) {
    return true
  }
  return p.startsWith('/services/') && p.split('/').length === 3
}

/**
 * The app flags a soft 404 (catch-all route, unknown article slug) by emitting
 * <meta name="prerender-status-code" content="404"> via <SEOHead notFound>.
 * That covers the dynamic cases the path table above cannot know.
 */
const NOT_FOUND_MARKER = /name="prerender-status-code"[^>]*content="404"/i

// =============================================================================
// SERVER SETUP
// =============================================================================

async function createServer() {
  const app = express()

  // Entferne den X-Powered-By: Express Header (Informations-Leak vermeiden).
  app.disable('x-powered-by')

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
      express.static(path.resolve(__dirname, 'dist/client/assets'), {
        maxAge: '1y',
        immutable: true,
      }),
    )

    // Andere statische Assets aus dist/client
    app.use(
      express.static(path.resolve(__dirname, 'dist/client'), {
        index: false, // Kein automatisches index.html serving
        maxAge: '1h', // Kürzeres Caching für nicht-gehashte Assets
      }),
    )
  }

  // ---------------------------------------------------------------------------
  // SECURITY HEADERS
  // ---------------------------------------------------------------------------
  app.use((_req, res, next) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Schränke sensible Browser-Features ein (Site braucht keine davon).
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    // Content-Security-Policy im REPORT-ONLY Modus: bricht die Live-Seite NICHT,
    // protokolliert nur Verstöße. Erlaubt self + die tatsächlich genutzten
    // Drittanbieter: Google Tag Manager, Google Analytics, HiHuman Chat-Widget
    // und Google Fonts. Bewusst permissiv (https:/data: für Bilder/Styles/Fonts).
    const cspReportOnly = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://widget.hihuman.co.uk https:",
      "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://widget.hihuman.co.uk https://*.hihuman.co.uk https:",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https:",
      "font-src 'self' data: https://fonts.gstatic.com https:",
      "frame-src 'self' https://www.googletagmanager.com https://widget.hihuman.co.uk https:",
    ].join('; ')
    res.setHeader('Content-Security-Policy-Report-Only', cspReportOnly)

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
    // Nur GET-Requests redirecten (POST, PUT etc. durchlassen)
    if (req.method !== 'GET') {
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
    // Legacy paths (/agb, /s3-leitlinie) for every language prefix, resolved in
    // one hop while preserving the requested supported locale.
    // /en/s3-leitlinie -> /en/s3_leitlinie, /agb -> /de/terms.
    // -------------------------------------------------------------------------
    const pathWithoutLang = langPrefix ? pathname.slice(3) || '/' : pathname
    const legacyTarget = LEGACY_PATH_REDIRECTS[pathWithoutLang.replace(/\/$/, '')]
    if (legacyTarget) {
      const targetLang = langPrefix || DEFAULT_LANGUAGE
      res.redirect(301, `/${targetLang}${legacyTarget}${query}`)
      return
    }

    // URL hat bereits ein gültiges Sprach-Prefix → kein Redirect nötig
    if (langPrefix !== null) {
      return next()
    }

    // Kein gültiges Prefix → 301 Redirect auf /de{path}
    const redirectPath = `/${DEFAULT_LANGUAGE}${pathname === '/' ? '/' : pathname}${query}`
    res.redirect(301, redirectPath)
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
        template = fs.readFileSync(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8')
        template = template.replace('</head>', `${getFontPreloadTag()}</head>`)

        const serverEntryPath = path.resolve(__dirname, 'dist/server/entry-server.js')
        const ssrModule = (await import(/* @vite-ignore */ serverEntryPath)) as RenderModule

        render = ssrModule.render
      }

      // App rendern mit voller URL (inkl. Sprach-Prefix) und erkannter Sprache
      let { html: appHtml, helmet } = await render(routerUrl, lang)

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
      for (
        let headRenderAttempt = 0;
        headRenderAttempt < 5 && !hasRealHelmetTitle(helmet.title.toString());
        headRenderAttempt += 1
      ) {
        await new Promise<void>((resolve) => setTimeout(resolve, 10))
        ;({ html: appHtml, helmet } = await render(routerUrl, lang))
      }

      // -----------------------------------------------------------------------
      // STATUS CODE
      // -----------------------------------------------------------------------
      // Unbekannte Pfade rendern die 404-Seite, wurden aber mit 200 ausgeliefert
      // — fuer Crawler war die Fehlerseite damit eine gueltige Seite. Zwei
      // unabhaengige Signale entscheiden jetzt:
      //   1. der Pfad passt auf keine Route (isKnownPath)
      //   2. die App selbst meldet einen Soft-404 (Marker-Meta aus <SEOHead
      //      notFound>) — deckt unbekannte Artikel-Slugs ab, die die Pfadliste
      //      nicht kennen kann
      const pathWithoutLang = pathname.slice(3) || '/'
      const isNotFound =
        !isKnownPath(pathWithoutLang) || NOT_FOUND_MARKER.test(helmet.meta.toString())

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

      // HTML NIE cachen: die Seite referenziert content-gehashte Assets, die sich
      // bei jedem Deploy ändern. Ohne no-store zeigen Browser (heuristisch gecachte)
      // ALTE HTML → alte Asset-Hashes → alte Seite. Assets selbst bleiben langzeit-
      // cachebar (immutable, s. express.static oben).
      res
        .status(isNotFound ? 404 : 200)
        .set({
          'Content-Type': 'text/html',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
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
      res.status(500).send('Internal Server Error')
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
