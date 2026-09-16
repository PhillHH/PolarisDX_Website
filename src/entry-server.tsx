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

import { createI18nInstance, getFallbackDelta } from './i18n.server'
import {
  DEFAULT_NS,
  extractLanguageFromPathname,
  FALLBACK_NS,
  NAMESPACES,
  normalizeLanguage,
  type Namespace,
  type SsrI18nState,
} from './i18n'
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
  /** AP25 PT25.2: beim Render benutzte Namespaces + Fallback-Delta fuer die Hydration */
  i18nState: SsrI18nState
}

// =============================================================================
// RENDER FUNCTION
// =============================================================================

/**
 * Rendert die App für eine gegebene URL und Sprache
 *
 * @param url - Die volle Request-URL MIT Sprach-Prefix (z.B. '/de/about', '/en/')
 * @param lang - Die Sprache aus dem URL-Prefix (z.B. 'de', 'en')
 * @returns Das gerenderte HTML und Helmet-Daten für Head-Tags
 *
 * Der Express-Server übergibt die URL MIT Prefix:
 *   /en/about → url='/en/about', lang='en'
 *   /de/      → url='/de/',      lang='de'
 *
 * StaticRouter mit basename=/${lang} strippt den Prefix selbst für
 * Route-Matching und fügt ihn bei <Link>-Tags wieder hinzu.
 * So bleibt es konsistent mit BrowserRouter basename im Client.
 */
export async function render(url: string, lang: string): Promise<RenderResult> {
  // Die Request-URL ist die primäre Locale-Wahrheit. Das vom Express-Layer
  // übergebene Argument bleibt als Vertragskontrolle erhalten, darf die URL
  // aber niemals überschreiben.
  const urlLanguage = extractLanguageFromPathname(url)
  const suppliedLanguage = normalizeLanguage(lang)
  if (suppliedLanguage !== urlLanguage) {
    console.warn(
      `[i18n-ssr] Ignoring locale ${suppliedLanguage}; request URL requires ${urlLanguage}`,
    )
  }

  // Erstelle eine neue i18n-Instanz für diesen Request.
  const { instance: i18n } = await createI18nInstance(urlLanguage)

  // Helmet Context für Server-seitiges Head-Management
  const helmetContext: { helmet?: HelmetServerState } = {}

  // Rendere die App zu HTML
  // basename=/${lang} sorgt dafür, dass alle <Link to="/about">
  // als <a href="/${lang}/about"> gerendert werden.
  const html = renderToString(
    <I18nextProvider i18n={i18n}>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url} basename={`/${urlLanguage}`}>
          <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
            <App />
          </Suspense>
        </StaticRouter>
      </HelmetProvider>
    </I18nextProvider>,
  )

  // Extrahiere Helmet-Daten (helmet wird nach dem Render befüllt)
  const helmet = helmetContext.helmet!

  // AP25 PT25.2 (PERF-B01): react-i18next meldet jeden per useTranslation
  // benutzten Namespace. Nur diese braucht der Client vor der Hydration.
  // Default- und Fallback-NS immer dazu: i18next schlaegt in ihnen nach, ohne
  // dass eine Komponente sie explizit anfordert.
  // `reportNamespaces` setzt initReactI18next zur Laufzeit; der i18next-Typ kennt
  // das Feld nur mit der react-i18next-Augmentation, die tsconfig.server nicht laedt.
  const { reportNamespaces } = i18n as typeof i18n & {
    reportNamespaces?: { getUsedNamespaces(): string[] }
  }
  const reported = reportNamespaces?.getUsedNamespaces() ?? []
  const ns = [DEFAULT_NS, FALLBACK_NS, ...reported].filter(
    (name, index, all): name is Namespace =>
      (NAMESPACES as readonly string[]).includes(name) && all.indexOf(name) === index,
  )
  const i18nState: SsrI18nState = {
    lng: urlLanguage,
    ns,
    fallback: getFallbackDelta(urlLanguage),
  }

  return { html, helmet, i18nState }
}

// =============================================================================
// EXPORTS
// =============================================================================

export { preloadAllTranslations } from './i18n.server'
