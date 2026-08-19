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

import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, Outlet, useParams, useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout'
import GtmPageview from './components/analytics/GtmPageview'

// =============================================================================
// EAGER IMPORTS - Werden sofort geladen
// =============================================================================

// HomePage ist die Hauptseite - wird fast immer zuerst besucht
import HomePage from './pages/HomePage'

// Layout-Komponenten bleiben eager (werden auf allen Seiten gebraucht)
import { CookieBanner } from './components/ui/CookieBanner'
import MobileCallButton from './components/ui/MobileCallButton'

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
const EpigeneticsPage = lazy(() => import('./pages/EpigeneticsPage'))
// Vertiefungsseiten der Epigenetik-Strecke. Sie tragen die Kapitel, die auf der
// Programmseite keine Auswahlfrage beantworten: Grundlagen, Studienlage,
// Unterlagen. Siehe src/components/epigenetics/EpiSubpage.tsx.
const EpigeneticsBasicsPage = lazy(() => import('./pages/EpigeneticsBasicsPage'))
const EpigeneticsEvidencePage = lazy(() => import('./pages/EpigeneticsEvidencePage'))
const EpigeneticsDocsPage = lazy(() => import('./pages/EpigeneticsDocsPage'))
// Musterbefunde: je Slug ein eigenes Routenmodul, damit Vite pro Befund
// splittet. Ein gemeinsames Modul zog alle sechs Panels in beiden Sprachen in
// einen 287-KB-Chunk, um 24 KB anzuzeigen.
const MusterbefundMetabolicHealth = lazy(() => import('./pages/musterbefund/metabolic-health'))
const MusterbefundHealthyAging = lazy(() => import('./pages/musterbefund/healthy-aging'))
const MusterbefundAltersuhr = lazy(() => import('./pages/musterbefund/biologische-altersuhr'))
const MusterbefundTelomer = lazy(() => import('./pages/musterbefund/telomer-analyse'))
const MusterbefundStress = lazy(() => import('./pages/musterbefund/stress-monitor'))
const MusterbefundHealthySport = lazy(() => import('./pages/musterbefund/healthy-sport'))
// Ohne passenden Slug rendert die Seite ihren Nicht-gefunden-Zweig (HTTP 404).
const MusterbefundPage = lazy(() => import('./pages/MusterbefundPage'))
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

/**
 * Scrollt nach einer Navigation zum Ziel von location.hash.
 *
 * Warum das eine eigene Komponente braucht:
 *   1. React Router stellt bei clientseitiger Navigation KEIN Hash-Ziel her.
 *      Ein Klick auf "/contact#kontaktformular" aenderte nur die URL,
 *      window.scrollY blieb bei 0.
 *   2. <ScrollToTop> im Layout springt bei jedem Pfadwechsel nach oben, und
 *      der Zielabschnitt wird lazy gerendert. Deshalb laeuft das Scrollen in
 *      requestAnimationFrame und versucht es ueber mehrere Frames erneut,
 *      statt einmalig im Effect zu feuern.
 *
 * SSR-sicher: greift nur im Effect auf document/window zu.
 */
function ScrollToHash() {
  // Das ganze location-Objekt als Dependency: es wechselt die Identitaet bei
  // JEDER Navigation, auch beim zweiten Klick auf denselben Link.
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const id = decodeURIComponent(location.hash.slice(1))
    if (!id) return

    // ~1s bei 60fps - genug Zeit fuer den Lazy-Chunk der Zielsektion.
    const MAX_FRAMES = 60
    let frames = 0
    let raf = 0

    const scrollToTarget = () => {
      const target = document.getElementById(id)
      if (!target) {
        if (frames++ < MAX_FRAMES) raf = requestAnimationFrame(scrollToTarget)
        return
      }
      // Der Header ist position:fixed - ohne Offset schoebe sich der Abschnitt
      // darunter. Hoehe messen statt hartkodieren (Header schrumpft beim Scroll).
      //
      // Auf Seiten mit Kapitelleiste steht unter dem Header noch eine zweite
      // klebende Zeile. Sie schreibt ihre Gesamthoehe als --chapterbar-offset
      // ans Wurzelelement; ohne sie landete jedes angesprungene Kapitel rund
      // 40 px hinter der Leiste. Wo es die Variable nicht gibt, bleibt es beim
      // Header allein.
      const header = document.querySelector('header')
      const leiste = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--chapterbar-offset'),
      )
      const leisteBereit = Number.isFinite(leiste) && leiste > 0

      // Die Kapitelleiste misst ihre eigene Hoehe erst in einem
      // requestAnimationFrame und schreibt sie dann nach --chapterbar-offset.
      // Beim DIREKTAUFRUF einer URL mit Anker kann dieser Frame nach dem hier
      // liegen — dann rechnete der Sprung mit dem Header allein, und das
      // Kapitel landete exakt um die Leistenhoehe zu weit oben, also dahinter.
      //
      // Gemessen auf /de/epigenetics/grundlagen#prinzip: Abschnitt bei 106px
      // statt 161px, also 55px hinter der Leiste. Auf der Live-Seite trifft es
      // /de/epigenetics#vergleich genauso — und damit jeden Anker, der in den
      // ausgelieferten PDFs steht. Beim KLICK auf einen Kapitel-Chip trat der
      // Fehler nie auf, weil die Leiste da laengst gemessen hatte.
      //
      // Deshalb: steht eine Leiste im Dokument, hat aber noch keinen Wert
      // geschrieben, auf den naechsten Frame warten statt falsch zu springen.
      // Seiten ohne Leiste laufen unveraendert sofort durch.
      if (document.querySelector('[data-chapterbar]') && !leisteBereit && frames++ < MAX_FRAMES) {
        raf = requestAnimationFrame(scrollToTarget)
        return
      }

      const offset = leisteBereit ? leiste : (header?.getBoundingClientRect().height ?? 0) + 16
      const top = target.getBoundingClientRect().top + window.scrollY - offset
      // Kein Smooth-Scroll, wenn der Nutzer reduzierte Bewegung eingestellt hat.
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? 'auto' : 'smooth' })
    }

    raf = requestAnimationFrame(scrollToTarget)
    return () => cancelAnimationFrame(raf)
  }, [location])

  return null
}

// =============================================================================
// LAYOUT ROUTE
// =============================================================================

/**
 * Layout-Route für die reguläre B2B-Website: rendert die PolarisDX-Shell
 * (Header/Footer), Mobile-Call-Button und Cookie-Banner.
 * Die einzelnen Seiten erscheinen über <Outlet />.
 */
function MainLayout() {
  return (
    <Layout>
      <MobileCallButton />
      <Outlet />
    </Layout>
  )
}

// =============================================================================
// APP COMPONENT
// =============================================================================

function App() {
  return (
    <>
      {/* Sendet bei jedem clientseitigen Routenwechsel einen GA4 page_view
          (SPA-Tracking, site-weit, alle Sprachen). */}
      <GtmPageview />
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
            path="/epigenetics"
            element={
              <LazyRoute>
                <EpigeneticsPage />
              </LazyRoute>
            }
          />
          <Route
            path="/epigenetics/grundlagen"
            element={
              <LazyRoute>
                <EpigeneticsBasicsPage />
              </LazyRoute>
            }
          />
          <Route
            path="/epigenetics/studienlage"
            element={
              <LazyRoute>
                <EpigeneticsEvidencePage />
              </LazyRoute>
            }
          />
          <Route
            path="/epigenetics/unterlagen"
            element={
              <LazyRoute>
                <EpigeneticsDocsPage />
              </LazyRoute>
            }
          />
          <Route
            path="/epigenetics/musterbefund/metabolic-health"
            element={
              <LazyRoute>
                <MusterbefundMetabolicHealth />
              </LazyRoute>
            }
          />
          <Route
            path="/epigenetics/musterbefund/healthy-aging"
            element={
              <LazyRoute>
                <MusterbefundHealthyAging />
              </LazyRoute>
            }
          />
          <Route
            path="/epigenetics/musterbefund/biologische-altersuhr"
            element={
              <LazyRoute>
                <MusterbefundAltersuhr />
              </LazyRoute>
            }
          />
          <Route
            path="/epigenetics/musterbefund/telomer-analyse"
            element={
              <LazyRoute>
                <MusterbefundTelomer />
              </LazyRoute>
            }
          />
          <Route
            path="/epigenetics/musterbefund/stress-monitor"
            element={
              <LazyRoute>
                <MusterbefundStress />
              </LazyRoute>
            }
          />
          <Route
            path="/epigenetics/musterbefund/healthy-sport"
            element={
              <LazyRoute>
                <MusterbefundHealthySport />
              </LazyRoute>
            }
          />
          {/* Muss NACH den sechs stehen: faengt unbekannte Slugs ab. */}
          <Route
            path="/epigenetics/musterbefund/:slug"
            element={
              <LazyRoute>
                <MusterbefundPage />
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
      {/* Nach <Routes> gerendert: der Effect von <ScrollToTop> im Layout laeuft
          damit zuerst, das rAF-Scrollen hier gewinnt. */}
      <ScrollToHash />
      {/* Cookie consent — site-wide so the consumer landing pages get it too (GTM/Consent Mode). */}
      <CookieBanner />
    </>
  )
}

export default App
