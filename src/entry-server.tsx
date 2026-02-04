/**
 * Server Entry Point
 *
 * Dieser Entry Point wird auf dem Server ausgeführt und rendert
 * die React-App zu einem HTML-String.
 *
 * WICHTIG:
 * - Kein CSS-Import hier (wird vom Client geladen)
 * - Verwendet StaticRouter statt BrowserRouter
 * - Erstellt pro Request eine neue i18n-Instanz
 */

import { Suspense } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'

import { createI18nInstance } from './i18n.server'
import App from './App'

import type { HelmetServerState } from 'react-helmet-async'

// =============================================================================
// TYPES
// =============================================================================

export interface RenderResult {
  /** The rendered HTML string */
  html: string
  /** Helmet data for head tags */
  helmet: HelmetServerState
}

// =============================================================================
// RENDER FUNCTION
// =============================================================================

/**
 * Rendert die App für eine gegebene URL und Sprache
 *
 * @param url - Die Request-URL (z.B. '/about' oder '/articles/my-article')
 * @param lang - Die Sprache für i18n (z.B. 'de', 'en')
 * @returns Das gerenderte HTML und Helmet-Daten für Head-Tags
 *
 * @example
 * const { html, helmet } = await render('/about', 'de')
 * const fullHtml = template
 *   .replace('<!--ssr-outlet-->', html)
 *   .replace('<!--helmet-head-->', helmet.title.toString() + helmet.meta.toString())
 */
export async function render(url: string, lang: string): Promise<RenderResult> {
  // Erstelle eine neue i18n-Instanz für diesen Request
  const { instance: i18n } = await createI18nInstance(lang)

  // Helmet Context für Server-seitiges Head-Management
  const helmetContext: { helmet?: HelmetServerState } = {}

  // Rendere die App zu HTML
  const html = renderToString(
    <I18nextProvider i18n={i18n}>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
            <App />
          </Suspense>
        </StaticRouter>
      </HelmetProvider>
    </I18nextProvider>
  )

  // Extrahiere Helmet-Daten (helmet wird nach dem Render befüllt)
  const helmet = helmetContext.helmet!

  return { html, helmet }
}

// =============================================================================
// EXPORTS
// =============================================================================

export { preloadAllTranslations } from './i18n.server'
