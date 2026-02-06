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

import type { Request, Response, NextFunction } from 'express'
import type { ViteDevServer } from 'vite'

// =============================================================================
// CONSTANTS
// =============================================================================

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000'

// Unterstützte Sprachen (muss mit i18n.ts übereinstimmen)
const SUPPORTED_LANGUAGES = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const
const DEFAULT_LANGUAGE = 'de'

// =============================================================================
// TYPES
// =============================================================================

interface RenderModule {
  render: (url: string, lang: string) => Promise<{
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

type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]

/**
 * Prüft ob ein Sprachcode unterstützt wird
 */
function isSupportedLanguage(code: string): code is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(code as SupportedLanguage)
}

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
  const match = pathname.match(/^\/([a-z]{2})(\/|$)/)
  if (match && isSupportedLanguage(match[1])) {
    return match[1]
  }
  return null
}

/**
 * Entfernt den Sprach-Prefix aus der URL, damit React Router
 * die Route ohne Prefix sieht.
 *
 * Beispiele:
 *   /en/about           → /about
 *   /de/                 → /
 *   /de/diagnostics/dental → /diagnostics/dental
 *   /fr                  → /
 */
function stripLanguagePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')
  return stripped || '/'
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
  return /\.(js|css|map|ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2|ttf|eot|json|txt|xml|webmanifest)$/.test(pathname)
}

// =============================================================================
// SERVER SETUP
// =============================================================================

async function createServer() {
  const app = express()

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
      })
    )

    // Andere statische Assets aus dist/client
    app.use(
      express.static(path.resolve(__dirname, 'dist/client'), {
        index: false, // Kein automatisches index.html serving
        maxAge: '1h', // Kürzeres Caching für nicht-gehashte Assets
      })
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
    next()
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
    })
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

    // URL hat bereits ein gültiges Sprach-Prefix → kein Redirect nötig
    if (extractLanguageFromUrl(pathname) !== null) {
      return next()
    }

    // Kein gültiges Prefix → 301 Redirect auf /de{path}
    const query = req.originalUrl.includes('?')
      ? req.originalUrl.substring(req.originalUrl.indexOf('?'))
      : ''
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
      const query = originalUrl.includes('?')
        ? originalUrl.substring(originalUrl.indexOf('?'))
        : ''
      res.redirect(301, `/${DEFAULT_LANGUAGE}${pathname}${query}`)
      return
    }

    // URL für React Router: Sprach-Prefix entfernen
    // /en/about         → /about
    // /de/              → /
    // /fr/articles?q=x  → /articles?q=x
    const strippedPath = stripLanguagePrefix(pathname)
    const query = originalUrl.includes('?')
      ? originalUrl.substring(originalUrl.indexOf('?'))
      : ''
    const routerUrl = strippedPath + query

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

        const ssrModule = await vite.ssrLoadModule('/src/entry-server.tsx') as RenderModule

        if (ssrModule.preloadAllTranslations) {
          ssrModule.preloadAllTranslations()
        }

        render = ssrModule.render
      } else {
        // -----------------------------------------------------------------------
        // PRODUCTION
        // -----------------------------------------------------------------------
        template = fs.readFileSync(
          path.resolve(__dirname, 'dist/client/index.html'),
          'utf-8'
        )

        const serverEntryPath = path.resolve(__dirname, 'dist/server/entry-server.js')
        const ssrModule = await import(/* @vite-ignore */ serverEntryPath) as RenderModule

        render = ssrModule.render
      }

      // App rendern mit gestrippter URL und erkannter Sprache
      const { html: appHtml, helmet } = await render(routerUrl, lang)

      // Helmet Tags zusammenbauen
      const helmetTags = [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ].filter(Boolean).join('\n    ')

      // Template mit gerendertem HTML und Helmet-Tags füllen
      const finalHtml = template
        .replace('<!--ssr-outlet-->', appHtml)
        .replace('<!--helmet-head-->', helmetTags)
        .replace('<html lang="de">', `<html lang="${lang}">`)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml)

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
  app.listen(PORT, () => {
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
