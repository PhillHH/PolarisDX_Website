/**
 * App.tsx - Client-Version mit Route-based Code-Splitting
 *
 * Diese Version verwendet React.lazy() für alle Seiten außer HomePage.
 *
 * React 19 + hydrateRoot garantiert:
 * - Server-HTML bleibt sichtbar bis der Chunk geladen ist
 * - Kein Flash of Unstyled Content
 * - Keine Hydration Mismatches
 *
 * ROUTING-AUFBAU:
 * - Die meisten Seiten laufen in der B2B-PolarisDX-Shell (<MainLayout>).
 * - Die Consumer-Landingpages unter /consumer/* haben bewusst KEINE B2B-Shell,
 *   sondern ihre eigene schlanke Consumer-Chrome. Sie sind "unlisted":
 *   nicht in der Navigation, nicht in der sitemap.xml, noindex und
 *   server-seitig per Passwort (Basic Auth) geschützt.
 */

import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom'
import Layout from './components/layout/Layout'

// =============================================================================
// EAGER IMPORTS - Werden sofort geladen
// =============================================================================

// HomePage ist die Hauptseite - wird fast immer zuerst besucht
import HomePage from './pages/HomePage'

// Layout-Komponenten bleiben eager (werden auf allen Seiten gebraucht)
import { CookieBanner } from './components/ui/CookieBanner'
import MobileCallButton from './components/ui/MobileCallButton'
import ChatWidget from './components/ui/ChatWidget'

// =============================================================================
// LAZY IMPORTS - Werden erst bei Bedarf geladen
// =============================================================================

// Informationsseiten
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const SupportPage = lazy(() => import('./pages/SupportPage'))
const EventsPage = lazy(() => import('./pages/EventsPage'))

// Artikel/Blog
const ArticlesIndexPage = lazy(() => import('./pages/ArticlesIndexPage'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))

// Services
const ServicesOverviewPage = lazy(() => import('./pages/ServicesOverviewPage'))
const ServicePage = lazy(() => import('./pages/ServicePage'))

// Produkt-Seiten (große Komponenten)
const IglooProPage = lazy(() => import('./pages/IglooProPage'))
const VitaminD3ImplantologyPage = lazy(() => import('./pages/VitaminD3ImplantologyPage'))
const S3LeitliniePage = lazy(() => import('./pages/S3LeitliniePage'))
const VitaminD3SprayPage = lazy(() => import('./pages/VitaminD3SprayPage'))

// Rechtliches
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const ImprintPage = lazy(() => import('./pages/ImprintPage'))

// Sonstiges
const DownloadsPage = lazy(() => import('./pages/DownloadsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Consumer-Landingpages (unlisted — eigene Chrome, kein B2B-Layout)
// Eager imports for the consumer landing pages (not lazy).
// Why: these are paid-traffic landing pages from Instagram/LinkedIn. The
// page <title>, meta description and OG tags are SEO/share-preview-critical
// and must be in the SSR HTML on the very first request — otherwise the
// React.lazy() fallback gets served and the head ends up with the static
// IglooPro defaults from index.html.
import ConsumerSprayPage from './pages/consumer/SprayPage'
import ConsumerMaskPage from './pages/consumer/MaskPage'
import ConsumerDuoPage from './pages/consumer/DuoPage'

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
// LAYOUT ROUTE
// =============================================================================

/**
 * Layout-Route für die reguläre B2B-Website: rendert die PolarisDX-Shell
 * (Header/Footer), Mobile-Call-Button, Chat-Widget und Cookie-Banner.
 * Die einzelnen Seiten erscheinen über <Outlet />.
 */
function MainLayout() {
  return (
    <Layout>
      <MobileCallButton />
      <ChatWidget />
      <Outlet />
      <CookieBanner />
    </Layout>
  )
}

// =============================================================================
// APP COMPONENT
// =============================================================================

function App() {
  return (
    <Routes>
      {/* ---------------------------------------------------------------------
          UNLISTED CONSUMER-LANDINGPAGES
          Eigene schlanke Consumer-Chrome (NICHT die B2B-Shell).
          Nicht in Navigation/Sitemap, noindex, server-seitig passwortgeschützt.
      --------------------------------------------------------------------- */}
      <Route
        path="/consumer/vitamin-d3-spray"
        element={
          <LazyRoute>
            <ConsumerSprayPage />
          </LazyRoute>
        }
      />
      <Route
        path="/consumer/hydrating-masks"
        element={
          <LazyRoute>
            <ConsumerMaskPage />
          </LazyRoute>
        }
      />
      <Route
        path="/consumer/inside-out-duo"
        element={
          <LazyRoute>
            <ConsumerDuoPage />
          </LazyRoute>
        }
      />

      {/* ---------------------------------------------------------------------
          REGULÄRE WEBSITE — alle Seiten in der B2B-PolarisDX-Shell
      --------------------------------------------------------------------- */}
      <Route element={<MainLayout />}>
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
          path="/support"
          element={
            <LazyRoute>
              <SupportPage />
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
          path="/s3_leitlinie"
          element={
            <LazyRoute>
              <S3LeitliniePage />
            </LazyRoute>
          }
        />
        <Route
          path="/vitamin-d3-spray"
          element={
            <LazyRoute>
              <VitaminD3SprayPage />
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
      </Route>
    </Routes>
  )
}

export default App
