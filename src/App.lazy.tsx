/**
 * App.lazy.tsx - Client-Version mit Route-based Code-Splitting
 *
 * Diese Version verwendet React.lazy() für alle Seiten außer HomePage.
 * Wird NUR im Client verwendet (entry-client.tsx).
 *
 * Der Server verwendet weiterhin App.tsx mit eager imports für vollständiges SSR.
 *
 * React 19 + hydrateRoot garantiert:
 * - Server-HTML bleibt sichtbar bis der Chunk geladen ist
 * - Kein Flash of Unstyled Content
 * - Keine Hydration Mismatches
 */

import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import Layout from './components/layout/Layout'

// =============================================================================
// EAGER IMPORTS - Werden sofort geladen
// =============================================================================

// HomePage ist die Hauptseite - wird fast immer zuerst besucht
import HomePage from './routes/HomePage'

// Layout-Komponenten bleiben eager (werden auf allen Seiten gebraucht)
import { CookieBanner } from './components/ui/CookieBanner'
import MobileCallButton from './components/ui/MobileCallButton'
import ChatWidget from './components/ui/ChatWidget'

// =============================================================================
// LAZY IMPORTS - Werden erst bei Bedarf geladen
// =============================================================================

// Informationsseiten
const AboutPage = lazy(() => import('./routes/AboutPage'))
const ContactPage = lazy(() => import('./routes/ContactPage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))

// Artikel/Blog
const ArticlesIndexPage = lazy(() => import('./routes/ArticlesIndexPage'))
const ArticlePage = lazy(() => import('./routes/ArticlePage'))

// Services
const ServicesOverviewPage = lazy(() => import('./routes/ServicesOverviewPage'))
const ServicePage = lazy(() => import('./routes/ServicePage'))

// Produkt-Seiten (große Komponenten)
const IglooProPage = lazy(() => import('./pages/IglooProPage'))
const VitaminD3ImplantologyPage = lazy(() => import('./pages/VitaminD3ImplantologyPage'))

// Rechtliches
const TermsPage = lazy(() => import('./routes/TermsPage'))
const PrivacyPage = lazy(() => import('./routes/PrivacyPage'))
const ImprintPage = lazy(() => import('./routes/ImprintPage'))

// Sonstiges
const DownloadsPage = lazy(() => import('./routes/DownloadsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// =============================================================================
// SUSPENSE WRAPPER
// =============================================================================

/**
 * Wrapper für lazy-geladene Routen.
 * fallback={null} ist korrekt weil:
 * - SSR hat bereits den Content gerendert
 * - React 19 behält das Server-HTML bis der Chunk geladen ist
 * - Kein visueller Flash
 */
function LazyRoute({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>
}

// Redirect helper for /services/:slug → /diagnostics/:slug
function ServicesRedirect() {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate to={`/diagnostics/${slug}`} replace />
}

// =============================================================================
// APP COMPONENT
// =============================================================================

function App() {
  return (
    <Layout>
      <MobileCallButton />
      <ChatWidget />
      <Routes>
        {/* EAGER: Homepage */}
        <Route path="/" element={<HomePage />} />

        {/* LAZY: Alle anderen Seiten */}
        <Route
          path="/about"
          element={
            <LazyRoute>
              <AboutPage />
            </LazyRoute>
          }
        />
        <Route
          path="/articles"
          element={
            <LazyRoute>
              <ArticlesIndexPage />
            </LazyRoute>
          }
        />
        <Route
          path="/articles/:slug"
          element={
            <LazyRoute>
              <ArticlePage />
            </LazyRoute>
          }
        />
        <Route
          path="/diagnostics"
          element={
            <LazyRoute>
              <ServicesOverviewPage />
            </LazyRoute>
          }
        />
        <Route
          path="/diagnostics/:slug"
          element={
            <LazyRoute>
              <ServicePage />
            </LazyRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <LazyRoute>
              <ContactPage />
            </LazyRoute>
          }
        />
        <Route
          path="/privacy"
          element={
            <LazyRoute>
              <PrivacyPage />
            </LazyRoute>
          }
        />
        <Route
          path="/imprint"
          element={
            <LazyRoute>
              <ImprintPage />
            </LazyRoute>
          }
        />
        <Route
          path="/terms"
          element={
            <LazyRoute>
              <TermsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/events"
          element={
            <LazyRoute>
              <EventsPage />
            </LazyRoute>
          }
        />
        <Route
          path="/igloo-pro"
          element={
            <LazyRoute>
              <IglooProPage />
            </LazyRoute>
          }
        />
        <Route
          path="/vitamin-d3-implantologie"
          element={
            <LazyRoute>
              <VitaminD3ImplantologyPage />
            </LazyRoute>
          }
        />
        <Route
          path="/downloads"
          element={
            <LazyRoute>
              <DownloadsPage />
            </LazyRoute>
          }
        />

        {/* 301 Redirects: /services → /diagnostics */}
        <Route path="/services" element={<Navigate to="/diagnostics" replace />} />
        <Route path="/services/:slug" element={<ServicesRedirect />} />

        {/* Catch-all 404 route - must be last */}
        <Route
          path="*"
          element={
            <LazyRoute>
              <NotFoundPage />
            </LazyRoute>
          }
        />
      </Routes>
      <CookieBanner />
    </Layout>
  )
}

export default App
