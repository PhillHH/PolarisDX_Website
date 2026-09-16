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
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout'
import RouteAnnouncer from './components/layout/RouteAnnouncer'
import GtmPageview from './components/analytics/GtmPageview'
import {
  getArticleRouteEntries,
  getBefundRouteEntries,
  getDynamicAppRoutes,
  getStaticAppRoutes,
  type BefundSlug,
  type DynamicRouteId,
  type StaticRouteId,
} from './routing/routeRegistry'

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
const ArticleGreenPractice = lazy(() => import('./pages/articles/die-gruene-praxis'))
const ArticleInvisiblePatient = lazy(() => import('./pages/articles/der-unsichtbare-patient'))
const ArticleFiveMinute = lazy(() => import('./pages/articles/die-5-minuten-diagnose'))
const ArticleEcosystem = lazy(
  () => import('./pages/articles/the-ecosystem-of-rapid-tests-why-compatibility-creates-safety'),
)
const ArticleRapidSetup = lazy(
  () => import('./pages/articles/die-performance-formel-effizienz-in-der-poc-diagnostik'),
)
const ArticlePrecision = lazy(
  () => import('./pages/articles/precision-in-point-of-care-the-key-to-patient-safety'),
)

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
// Sprachfassungen in denselben Chunk ziehen. AP25 PT25.2: `loadRoute` laedt
// zusaetzlich nur die Sprachfassung der URL (siehe src/pages/musterbefund/*.tsx).
const MusterbefundMetabolicHealth = lazy(() =>
  import('./pages/musterbefund/metabolic-health').then((route) => route.loadRoute()),
)
const MusterbefundHealthyAging = lazy(() =>
  import('./pages/musterbefund/healthy-aging').then((route) => route.loadRoute()),
)
const MusterbefundAltersuhr = lazy(() =>
  import('./pages/musterbefund/biologische-altersuhr').then((route) => route.loadRoute()),
)
const MusterbefundTelomer = lazy(() =>
  import('./pages/musterbefund/telomer-analyse').then((route) => route.loadRoute()),
)
const MusterbefundStress = lazy(() =>
  import('./pages/musterbefund/stress-monitor').then((route) => route.loadRoute()),
)
const MusterbefundHealthySport = lazy(() =>
  import('./pages/musterbefund/healthy-sport').then((route) => route.loadRoute()),
)
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
// AP25 PT25.2 (PERF-B02): frueher eager importiert, damit Titel/Meta/OG schon
// bei der allerersten SSR-Anfrage im HTML stehen. Das sichert heute die
// head-gated Retry-Schleife in server.ts (rendert erneut, bis Helmet einen
// echten Titel hat) — geprueft in e2e/pt25.2.spec.ts gegen einen frisch
// gestarteten Server. Eager kosteten die drei Seiten samt Shell, Bestellformular
// und Preis-Badge rund 50 KB im Entry-Chunk JEDER B2B-Route.
const ConsumerSprayPage = lazy(() => import('./pages/consumer/SprayPage'))
const ConsumerMaskPage = lazy(() => import('./pages/consumer/MaskPage'))
const ConsumerDuoPage = lazy(() => import('./pages/consumer/DuoPage'))
import { useOutboundTracking } from './lib/useOutboundTracking'

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

const lazyElement = (page: React.ReactNode) => <LazyRoute>{page}</LazyRoute>

/**
 * React components remain separate from route metadata so code splitting stays
 * local to the UI. The Record types make missing or stale component bindings a
 * compile-time failure while paths and policies come only from routeRegistry.
 */
const STATIC_ROUTE_ELEMENTS: Record<StaticRouteId, React.ReactNode> = {
  home: <HomePage />,
  about: lazyElement(<AboutPage />),
  articles: lazyElement(<ArticlesIndexPage />),
  diagnostics: lazyElement(<ServicesOverviewPage />),
  contact: lazyElement(<ContactPage />),
  support: lazyElement(<SupportPage />),
  privacy: lazyElement(<PrivacyPage />),
  imprint: lazyElement(<ImprintPage />),
  terms: lazyElement(<TermsPage />),
  events: lazyElement(<EventsPage />),
  'igloo-pro': lazyElement(<IglooProPage />),
  implantology: lazyElement(<VitaminD3ImplantologyPage />),
  's3-guideline': lazyElement(<S3LeitliniePage />),
  'vitamin-d3-spray': lazyElement(<VitaminD3SprayPage />),
  epigenetics: lazyElement(<EpigeneticsPage />),
  'epigenetics-grundlagen': lazyElement(<EpigeneticsBasicsPage />),
  'epigenetics-studienlage': lazyElement(<EpigeneticsEvidencePage />),
  'epigenetics-unterlagen': lazyElement(<EpigeneticsDocsPage />),
  downloads: lazyElement(<DownloadsPage />),
  'consumer-vitamin-d3-spray': lazyElement(<ConsumerSprayPage />),
  'consumer-hydrating-masks': lazyElement(<ConsumerMaskPage />),
  'consumer-inside-out-duo': lazyElement(<ConsumerDuoPage />),
}

const DYNAMIC_ROUTE_ELEMENTS: Record<DynamicRouteId, React.ReactNode> = {
  'service-detail': lazyElement(<ServicePage />),
  'article-detail': lazyElement(<ArticlePage />),
  'report-detail': lazyElement(<MusterbefundPage />),
}

const BEFUND_ROUTE_ELEMENTS: Record<BefundSlug, React.ReactNode> = {
  'metabolic-health': lazyElement(<MusterbefundMetabolicHealth />),
  'healthy-aging': lazyElement(<MusterbefundHealthyAging />),
  'biologische-altersuhr': lazyElement(<MusterbefundAltersuhr />),
  'telomer-analyse': lazyElement(<MusterbefundTelomer />),
  'stress-monitor': lazyElement(<MusterbefundStress />),
  'healthy-sport': lazyElement(<MusterbefundHealthySport />),
}

const ARTICLE_ROUTE_ELEMENTS: Record<string, React.ReactNode> = {
  green_practice: lazyElement(<ArticleGreenPractice />),
  invisible_patient: lazyElement(<ArticleInvisiblePatient />),
  five_minute_diagnosis: lazyElement(<ArticleFiveMinute />),
  ecosystem_of_rapid_tests: lazyElement(<ArticleEcosystem />),
  rapid_setup_formula: lazyElement(<ArticleRapidSetup />),
  precision_point_of_care: lazyElement(<ArticlePrecision />),
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

    /**
     * AP24 PT24.3 — den Fokus mitnehmen.
     *
     * Gemessen war: nach `Enter` auf einem Kapitellink scrollt die Seite
     * korrekt, `document.activeElement` ist danach aber `<body>`. Chromium
     * setzt zwar den Startpunkt fuer die naechste Tabulatortaste an das Ziel —
     * eine Assistenztechnik folgt dem jedoch nicht, und angesagt wird nichts.
     * Wer nicht sieht, dass gescrollt wurde, bleibt ohne Rueckmeldung.
     *
     * Deshalb bekommt das Ziel den Fokus. `tabindex="-1"` nur, wenn es nicht
     * ohnehin fokussierbar ist: es soll ein Sprungziel werden, kein neuer
     * Tabstop. `preventScroll` ist Pflicht — ohne das scrollt der Browser
     * selbst und arbeitet gegen die Feinkorrektur dieser Schleife.
     *
     * `outline: none` am programmatisch fokussierten Abschnitt ist dieselbe
     * bewusste Ausnahme wie am `<main>` in `Layout.tsx`: hier ist niemand
     * hingetabbt, ein Rahmen um einen ganzen Abschnitt waere Rauschen. Die
     * Bedienelemente IM Abschnitt behalten ihren Ring vollstaendig.
     */
    const focusTarget = (target: HTMLElement) => {
      if (aborted || document.activeElement === target) return
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1')
        target.dataset.hashFocusTarget = 'true'
      }
      target.style.outline = 'none'
      target.focus({ preventScroll: true })
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
          focusTarget(target)
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
      // Das geliehene `tabindex` wieder abgeben: der Abschnitt soll kein
      // dauerhafter Tabstop werden, nur ein Sprungziel gewesen sein.
      document.querySelectorAll<HTMLElement>('[data-hash-focus-target]').forEach((el) => {
        el.removeAttribute('tabindex')
        el.style.removeProperty('outline')
        delete el.dataset.hashFocusTarget
      })
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
 * KEIN CHAT (`DEC-RL-007`): Hier stand bis AP06 PT06.4 ein Chat-Widget, das
 * auf JEDER B2B-Seite unbedingt ein Drittanbieter-Bundle nachlud — ohne
 * Bedingung, ohne Consent. Frontend-Rendering und Loader sind entfernt, die
 * Datei geloescht.
 *
 * Mit AP22 PT22.7 ist auch der Rest weg: der Mock-Endpunkt im Backend
 * (POST auf die Chat-Route antwortet jetzt 404) und die Chat-Domains in der
 * CSP. Es gibt keinen produktiven Chat-Rest mehr, den ein spaeteres AP noch
 * aufraeumen muesste.
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
  // AP23 PT23.3 — ein Listener fuer alle externen Links (siehe
  // `useOutboundTracking`). Ohne Einwilligung ist `track` eine leere Funktion.
  useOutboundTracking()

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
        {getStaticAppRoutes('CONSUMER').map((route) => (
          <Route
            key={route.id}
            path={route.pathPattern}
            element={STATIC_ROUTE_ELEMENTS[route.id]}
          />
        ))}

        {/* ---------------------------------------------------------------------
          REGULÄRE WEBSITE — alle Seiten in der B2B-PolarisDX-Shell
      --------------------------------------------------------------------- */}
        <Route element={<MainLayout />}>
          {getStaticAppRoutes('B2B').map((route) => (
            <Route
              key={route.id}
              path={route.pathPattern}
              element={STATIC_ROUTE_ELEMENTS[route.id]}
            />
          ))}

          {/* Keep one chunk per real report; the family fallback catches unknown slugs. */}
          {getBefundRouteEntries().map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={BEFUND_ROUTE_ELEMENTS[route.sourceId]}
            />
          ))}
          {getArticleRouteEntries().map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={ARTICLE_ROUTE_ELEMENTS[route.sourceId]}
            />
          ))}
          {getDynamicAppRoutes().map((route) => (
            <Route
              key={route.id}
              path={route.pathPattern}
              element={DYNAMIC_ROUTE_ELEMENTS[route.id]}
            />
          ))}

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
      {/* AP24 PT24.3: Ein Routenwechsel tauscht den ganzen Inhalt aus, ohne
          dass eine Assistenztechnik davon erfaehrt. Diese Region sagt den
          neuen Titel an — hoeflich, und ohne den Fokus anzufassen. */}
      <RouteAnnouncer />
      {/* Cookie consent — site-wide so the consumer landing pages get it too (GTM/Consent Mode). */}
      <CookieBanner />
    </>
  )
}

export default App
