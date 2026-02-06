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
 * @param url - Die gestrippte Request-URL ohne Sprach-Prefix (z.B. '/about')
 * @param lang - Die Sprache aus dem URL-Prefix (z.B. 'de', 'en')
 * @returns Das gerenderte HTML und Helmet-Daten für Head-Tags
 *
 * WICHTIG: Der Express-Server strippt den Sprach-Prefix und übergibt:
 *   /en/about → url='/about', lang='en'
 *   /de/      → url='/',     lang='de'
 *
 * StaticRouter bekommt basename=/${lang} damit gerenderte <Link>-Tags
 * den Prefix enthalten (z.B. <a href="/en/about">) — konsistent mit
 * dem BrowserRouter basename im Client.
 */
export async function render(url: string, lang: string): Promise<RenderResult> {
  // Erstelle eine neue i18n-Instanz für diesen Request
  const { instance: i18n } = await createI18nInstance(lang)

  // Helmet Context für Server-seitiges Head-Management
  const helmetContext: { helmet?: HelmetServerState } = {}

  // Rendere die App zu HTML
  // basename=/${lang} sorgt dafür, dass alle <Link to="/about">
  // als <a href="/${lang}/about"> gerendert werden.
  const html = renderToString(
    <I18nextProvider i18n={i18n}>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url} basename={`/${lang}`}>
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
