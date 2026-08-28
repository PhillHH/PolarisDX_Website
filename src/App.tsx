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
 *   sondern ihre eigene schlanke Consumer-Chrome. PT08.4 routet sie in allen
 *   zehn Locales; globale IA und die finale Sitemap bleiben spaetere Owner.
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
// splittet. Ein gemeinsames Inhaltsmodul wuerde alle sechs Panels und alle
// Sprachfassungen in denselben Chunk ziehen.
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

// Consumer-Landingpages (eigene Chrome, kein B2B-Layout)
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
 *      Ein Klick auf "/#roi-rechner" aenderte nur die URL, window.scrollY
 *      blieb bei 0.
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

    // ~3s bei 60fps. Der Wert ist eine OBERGRENZE, kein Wartezeitraum: der
    // Loop hoert auf, sobald die Position stimmt und der Offset steht (meist
    // nach wenigen Frames), und bricht bei jeder Nutzereingabe sofort ab.
    // 60 Frames waren zu knapp — auf tief liegenden Ankern montierte die
    // Kapitelleiste je nach Viewport erst danach, und der Sprung blieb beim
    // Header-Rueckfall stehen (gemessen: 1280x720 #analysen).
    const MAX_FRAMES = 180
    /** So viele Frames muss der Offset unveraendert sein, bevor wir loslassen. */
    const STABLE_FRAMES = 10

    let frames = 0
    let raf = 0
    let lastScrollY = -1
    let lastOffset = -1
    let stable = 0
    let didInitialScroll = false
    let aborted = false

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /**
     * Abstand, den das Ziel von der Oberkante haben soll.
     *
     * Auf Seiten mit Kapitelleiste steht unter dem Header noch eine zweite
     * klebende Zeile. Sie schreibt ihre Gesamthoehe als --chapterbar-offset
     * ans Wurzelelement. Wo es die Variable nicht gibt, bleibt es beim Header.
     */
    const wantedOffset = () => {
      const leiste = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--chapterbar-offset'),
      )
      if (Number.isFinite(leiste) && leiste > 0) return leiste
      const header = document.querySelector('header')
      return (header?.getBoundingClientRect().height ?? 0) + 16
    }

    /**
     * NACHFUEHREN, BIS DER OFFSET STEHT — nicht nur bis er einmal passt.
     *
     * Beim Direktaufruf von `/epigenetics#analysen` ist die Kapitelleiste im
     * Moment des Scrollens noch nicht montiert; `--chapterbar-offset` fehlt,
     * und der Sprung nutzt den Header-Rueckfall (88 + 16 = 104px). Ein Loop,
     * der aufhoert, sobald der AKTUELLE Offset erfuellt ist, hoert genau dort
     * auf — und wenn die Leiste danach erscheint, liegt die Ueberschrift 39px
     * dahinter. Genau das war in PT06.4 noch der Fall und ist erst bei einem
     * zweiten Viewport aufgefallen: bei 1280x720 montierte die Leiste frueh
     * genug, bei 1440x900 nicht. Ein Timing-Fehler, der sich als
     * "funktioniert" tarnt.
     *
     * Deshalb wird erst losgelassen, wenn der Offset ueber mehrere Frames
     * KONSTANT ist und die Position stimmt.
     *
     * Greift der Nutzer selbst ein (Rad, Wisch, Taste), brechen wir ab —
     * niemand soll gegen die Seite anscrollen muessen.
     */
    const stopOnUserInput = () => {
      aborted = true
    }
    window.addEventListener('wheel', stopOnUserInput, { passive: true, once: true })
    window.addEventListener('touchstart', stopOnUserInput, { passive: true, once: true })
    window.addEventListener('keydown', stopOnUserInput, { once: true })

    const scrollToTarget = () => {
      if (aborted) return

      const target = document.getElementById(id)
      if (!target) {
        if (frames++ < MAX_FRAMES) raf = requestAnimationFrame(scrollToTarget)
        return
      }

      const offset = wantedOffset()

      if (!didInitialScroll) {
        didInitialScroll = true
        lastOffset = offset
        const top = target.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? 'auto' : 'smooth' })
        raf = requestAnimationFrame(scrollToTarget)
        return
      }

      // Erst wenn die Seite steht, ist ein Messwert belastbar.
      const settled = Math.abs(window.scrollY - lastScrollY) < 1
      lastScrollY = window.scrollY

      stable = offset === lastOffset ? stable + 1 : 0
      lastOffset = offset

      if (settled) {
        const delta = target.getBoundingClientRect().top - offset
        if (Math.abs(delta) > 2) {
          // Korrektur ohne Animation — sie soll nicht gegen den laufenden
          // Smooth-Scroll arbeiten.
          window.scrollTo({ top: Math.max(window.scrollY + delta, 0), behavior: 'auto' })
          stable = 0
        } else if (stable >= STABLE_FRAMES) {
          return // Position stimmt und der Offset hat sich beruhigt.
        }
      }

      if (frames++ < MAX_FRAMES) raf = requestAnimationFrame(scrollToTarget)
    }

    raf = requestAnimationFrame(scrollToTarget)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('wheel', stopOnUserInput)
      window.removeEventListener('touchstart', stopOnUserInput)
      window.removeEventListener('keydown', stopOnUserInput)
    }
  }, [location])

  return null
}

// =============================================================================
// LAYOUT ROUTE
// =============================================================================

/**
 * Layout-Route für die reguläre B2B-Website: rendert die PolarisDX-Shell
 * (Header/Footer) und den Mobile-Call-Button. Die einzelnen Seiten erscheinen
 * über <Outlet />; der Cookie-Banner haengt global unter <Routes>.
 *
 * KEIN CHAT (`DEC-RL-007`): Hier stand bis AP06 PT06.4 ein <ChatWidget />, das
 * auf JEDER B2B-Seite unbedingt `https://widget.hihuman.co.uk/bundle.js`
 * nachlud — ohne Bedingung, ohne Consent. Frontend-Rendering und Loader sind
 * entfernt, die Datei geloescht.
 *
 * Ownership-Grenze, bewusst NICHT hier erledigt:
 *   - `POST /api/chat` im Backend  -> AP22 PT22.7
 *   - HiHuman-Domains in der CSP   -> AP26 PT26.2
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
          CONSUMER-LANDINGPAGES
          Eigene schlanke Consumer-Chrome (NICHT die B2B-Shell), locale-aware.
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
