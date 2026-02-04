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
// LANGUAGE DETECTION
// =============================================================================

/**
 * Erkennt die Sprache aus der URL oder dem Accept-Language Header
 */
function detectLanguage(req: Request): string {
  // 1. URL-Prefix prüfen (z.B. /en/about, /it/contact)
  const urlMatch = req.url.match(/^\/([a-z]{2})(\/|$)/)
  if (urlMatch) {
    const urlLang = urlMatch[1]
    if (SUPPORTED_LANGUAGES.includes(urlLang as typeof SUPPORTED_LANGUAGES[number])) {
      return urlLang
    }
  }

  // 2. Accept-Language Header parsen
  const acceptLanguage = req.headers['accept-language']
  if (acceptLanguage) {
    // Parse "de-DE,de;q=0.9,en;q=0.8" format
    const languages = acceptLanguage
      .split(',')
      .map(lang => {
        const [code, qValue] = lang.trim().split(';q=')
        return {
          code: code.split('-')[0].toLowerCase(),
          quality: qValue ? parseFloat(qValue) : 1.0
        }
      })
      .sort((a, b) => b.quality - a.quality)

    for (const { code } of languages) {
      if (SUPPORTED_LANGUAGES.includes(code as typeof SUPPORTED_LANGUAGES[number])) {
        return code
      }
    }
  }

  // 3. Fallback
  return DEFAULT_LANGUAGE
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
    // Statische Assets aus dist/client
    app.use(
      express.static(path.resolve(__dirname, 'dist/client'), {
        index: false, // Kein automatisches index.html serving
      })
    )
  }

  // ---------------------------------------------------------------------------
  // API PROXY
  // ---------------------------------------------------------------------------
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  )

  // ---------------------------------------------------------------------------
  // SSR HANDLER (Express 5 Wildcard Syntax)
  // ---------------------------------------------------------------------------
  app.get('/{*path}', async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl

    try {
      // Template laden
      let template: string
      let render: RenderModule['render']

      if (!isProduction && vite) {
        // -----------------------------------------------------------------------
        // DEVELOPMENT
        // -----------------------------------------------------------------------
        // Template aus Filesystem lesen und durch Vite transformieren
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)

        // Entry-Server-Modul laden (mit HMR-Support)
        const ssrModule = await vite.ssrLoadModule('/src/entry-server.tsx') as RenderModule

        // Optional: Translations vorladen
        if (ssrModule.preloadAllTranslations) {
          ssrModule.preloadAllTranslations()
        }

        render = ssrModule.render
      } else {
        // -----------------------------------------------------------------------
        // PRODUCTION
        // -----------------------------------------------------------------------
        // Template aus dist/client
        template = fs.readFileSync(
          path.resolve(__dirname, 'dist/client/index.html'),
          'utf-8'
        )

        // Server-Bundle importieren (dynamischer Pfad um TypeScript-Prüfung zu umgehen)
        const serverEntryPath = path.resolve(__dirname, 'dist/server/entry-server.js')
        const ssrModule = await import(/* @vite-ignore */ serverEntryPath) as RenderModule

        render = ssrModule.render
      }

      // Sprache erkennen
      const lang = detectLanguage(req)

      // App rendern
      const { html: appHtml, helmet } = await render(url, lang)

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
        // HTML lang-Attribut setzen
        .replace('<html lang="de">', `<html lang="${lang}">`)

      // Response senden
      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml)

    } catch (error) {
      // Error Handling
      if (!isProduction && vite) {
        // In Development: Stack Trace für besseres Debugging
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
