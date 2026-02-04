/**
 * Client Entry Point
 *
 * Dieser Entry Point wird im Browser ausgeführt und hydratisiert
 * das vom Server vorgerenderte HTML.
 *
 * WICHTIG: Verwendet hydrateRoot statt createRoot für SSR-Hydration.
 */

import { StrictMode, Suspense } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

// Side-effect imports
import './index.css'
import './i18n.client'

// App
import App from './App'

// =============================================================================
// HYDRATION
// =============================================================================

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a <div id="root"> in your HTML.')
}

hydrateRoot(
  rootElement,
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
          <App />
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
)
