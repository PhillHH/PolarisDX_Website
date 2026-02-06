/**
 * Client Entry Point
 *
 * Dieser Entry Point wird im Browser ausgeführt und hydratisiert
 * das vom Server vorgerenderte HTML.
 *
 * WICHTIG:
 * - Wartet auf i18n.init() bevor hydrateRoot() aufgerufen wird
 * - BrowserRouter bekommt basename=/${lang} für Sprach-Prefixe
 * - Sprache wird aus URL extrahiert (Source of Truth)
 */

import { StrictMode, Suspense } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

import { extractLanguageFromPathname } from './i18n'

// Side-effect imports
import './index.css'

// i18n init — exportiert ein Promise das resolvet wenn Translations geladen sind
import { i18nReady } from './i18n.client'

// App - Client-Version mit lazy loading für Code-Splitting
import App from './App.lazy'

// =============================================================================
// LANGUAGE FROM URL
// =============================================================================

// Sprache aus URL-Prefix extrahieren: /en/about → 'en'
const lang = extractLanguageFromPathname(window.location.pathname)

// =============================================================================
// HYDRATION (nach i18n init)
// =============================================================================

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a <div id="root"> in your HTML.')
}

// Warten bis Translations geladen sind BEVOR hydratisiert wird.
// Ohne dieses await würde useTranslation() bei Suspense eine
// Fallback-Komponente rendern wo der Server echten Content hat → Mismatch.
i18nReady.then(() => {
  hydrateRoot(
    rootElement,
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter basename={`/${lang}`}>
          <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
            <App />
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>
  )
})
