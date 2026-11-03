import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronRight, Droplet, Menu, Search, ShoppingBag, X } from 'lucide-react'
import IglooProImage from '../../assets/home/Igloo-pro-frontal-320w.webp'
import reportImage from '../../assets/home/report-preview-400w.webp'
// SC-021 (Owner 2026-11-02, Kopfzeile 13A-4): die Kopfzeile ist weiss, das Logo farbig.
// 272 px = 2x der Darstellung; die 400-px-Datei zaehlte im Perf-Budget als "oversized".
import logo from '../../assets/polarisdx_logo-272w.webp'
import { getNextHomeEvent } from '../../data/events'
import { useDisclosure } from '../../hooks/useDisclosure'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import SearchModal from '../ui/SearchModal'
import { formatEventRange } from '../../lib/eventDates'
import { panelsUrl, shopUrl } from '../../lib/shop'

interface NavChild {
  /** i18n-Key unter `nav.` */
  label: string
  route: string
}

/** Eine fachlich begruendete Spalte der Inhaltsuebersicht. */
interface NavGroup {
  heading: string
  items: NavChild[]
  /** Link auf die Bereichsseite, als eigene Zeile unter der Spalte. */
  hub?: NavChild
}

/**
 * Die neun kanonischen Diagnostik-Services (`src/data/services.tsx`) in drei fachlich
 * begruendeten Spalten (IA-INVENTORY §10.4). Die Trennlinie ist die FRAGE, die ein
 * Interessent stellt: Praxisfeld (Zielgruppe), Analysebereich (Fragestellung), System
 * (Plattform). Epigenetik ist keine Service-Untergruppe (§10.4) und steht als abgesetzter
 * Querverweis (§10.5) — siehe CROSSLINKS.
 */
const DIAGNOSTICS_GROUPS: NavGroup[] = [
  {
    heading: 'group_fields',
    items: [
      { label: 'dental', route: '/diagnostics/dental' },
      { label: 'beauty', route: '/diagnostics/beauty' },
      { label: 'longevity', route: '/diagnostics/longevity' },
    ],
    hub: { label: 'diagnostics_all', route: '/diagnostics' },
  },
  {
    heading: 'group_analysis',
    items: [
      { label: 'praeventionsChecks', route: '/diagnostics/praeventions-checks' },
      { label: 'infektionEntzuendung', route: '/diagnostics/infektion-entzuendung' },
      { label: 'stoffwechselHerz', route: '/diagnostics/stoffwechsel-herz' },
      { label: 'hormonTests', route: '/diagnostics/hormon-tests' },
    ],
  },
  {
    heading: 'group_system',
    items: [
      { label: 'pocSystems', route: '/diagnostics/poc-systemloesungen' },
      { label: 'kompatibilitaetIntegration', route: '/diagnostics/kompatibilitaet-integration' },
    ],
  },
]

/** Fachlicher Querverweis unter der System-Spalte — bewusst keine Diagnostik-Gruppe. */
const CROSSLINKS: NavChild[] = [
  { label: 'epigenetics', route: '/epigenetics' },
  { label: 'musterbefunde', route: '/epigenetics#musterbefunde' },
]

/**
 * SC-021 (Owner 2026-11-02, Entwurf 13A-4): vier Woerter in der Leiste — die drei Saeulen
 * (IA §10.3) und die Termine, solange die MEDICA-Saison laeuft. Blog, Support und Kontakt
 * stehen in der Service-Zeile darueber, alles Weitere in der Inhaltsuebersicht.
 */
const PRIMARY: NavChild[] = [
  { label: 'service', route: '/diagnostics' },
  { label: 'epigenetics', route: '/epigenetics' },
  { label: 'iglooPro', route: '/igloo-pro' },
  { label: 'events', route: '/events' },
]

/** Service-Zeile ueber dem Raster (ab xl); unter xl stehen dieselben Ziele in der Uebersicht. */
const SERVICE_LINKS: NavChild[] = [
  { label: 'blog', route: '/articles' },
  { label: 'support', route: '/support' },
  { label: 'contact', route: '/contact' },
]

/** Epigenetik-Spalte der Hover-Uebersicht (Ziele der Bereichsleiste, Labels aus `footer.epi_*`). */
const EPIGENETICS_LINKS: { key: string; route: string }[] = [
  { key: 'area.overview', route: '/epigenetics' },
  { key: 'footer.epi_basics', route: '/epigenetics/grundlagen' },
  { key: 'footer.epi_samples', route: '/epigenetics#musterbefunde' },
  { key: 'footer.epi_evidence', route: '/epigenetics/studienlage' },
  { key: 'footer.epi_docs', route: '/epigenetics/unterlagen' },
]

/** IglooPro-Spalte der Hover-Uebersicht. */
const IGLOO_LINKS: NavChild[] = [
  { label: 'iglooPro', route: '/igloo-pro' },
  { label: 'diagnostics_all', route: '/diagnostics' },
  { label: 'downloads', route: '/downloads' },
  { label: 'support', route: '/support' },
]

/**
 * Was unter dem Raster aufklappt: `menu` = Gesamtuebersicht (Menue-Knopf, alle Breiten),
 * sonst der Hauptpunkt, ueber dem der Zeiger steht bzw. dessen Aufklapper gedrueckt wurde
 * (SC-021 Nachtrag, Owner 2026-11-02: „beim Hovern ueber die Menuepunkte").
 */
type Panel = 'menu' | 'service' | 'epigenetics' | 'iglooPro' | 'events'

/** Fusszeile der Inhaltsuebersicht. */
const MORE_LINKS: NavChild[] = [
  { label: 'downloads', route: '/downloads' },
  { label: 'about', route: '/about' },
]

/** Fokusring innerhalb der Zellen — auf Weiss und auf den getoenten Flaechen gleich. */
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary'
/** Eine Zelle des Rasters: volle Hoehe, Haarlinie rechts. */
const CELL = `flex h-full items-center border-r border-ui-border transition-colors motion-reduce:transition-none ${FOCUS}`
/** Rundes Symbol-Abzeichen in den Shop-Zellen. */
const BADGE = 'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full'
/** Eintrag in der Inhaltsuebersicht. */
const MENU_LINK = `flex min-h-[44px] items-center rounded-lg px-2 py-2 text-[15px] font-medium text-heading transition-colors hover:bg-paper-deep motion-reduce:transition-none ${FOCUS}`
/** Shop-Pille in der Fusszeile der Uebersicht. */
const SHOP_PILL = `inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${FOCUS}`

/**
 * Ist dieser Pfad der aktuelle Bereich? Ein Anker hinter der Route zaehlt nicht mit —
 * /epigenetics#musterbefunde und /epigenetics sind dieselbe Seite.
 */
function isPathActive(route: string, pathname: string): boolean {
  const clean = route.split('#')[0]
  if (clean === '/') return pathname === '/'
  return pathname === clean || pathname.startsWith(clean + '/')
}

/** Genau die Seite, auf der man steht — Ankereintraege zaehlen nicht. */
function isExactPage(route: string, pathname: string): boolean {
  return !route.includes('#') && pathname === route
}

/** Ein Hauptpunkt ist aktiv, wenn er selbst oder eine seiner Unterseiten aktiv ist. */
function isPrimaryActive(item: NavChild, pathname: string): boolean {
  if (isPathActive(item.route, pathname)) return true
  // Querverweise zaehlen BEWUSST nicht: sonst faerbte /epigenetics die Diagnostik aktiv.
  return (
    item.label === 'service' &&
    DIAGNOSTICS_GROUPS.some((g) => g.items.some((c) => isPathActive(c.route, pathname)))
  )
}

const Header = () => {
  const { t, i18n } = useTranslation(['common', 'events'])
  const scrollY = useScrollPosition()
  const isScrolled = scrollY > 24
  const searchModal = useDisclosure()
  const location = useLocation()
  const navRef = useRef<HTMLElement>(null)
  // Das offene Panel ist an die Navigation gebunden (`location.key`): nach einem Seitenwechsel
  // ist es von selbst zu — kein Effekt, der im Nachlauf setState ruft.
  const [panelState, setPanelState] = useState<{ panel: Panel; key: string } | null>(null)
  const open = panelState && panelState.key === location.key ? panelState.panel : null
  const setOpen = useCallback(
    (next: Panel | null | ((current: Panel | null) => Panel | null)) =>
      setPanelState((state) => {
        const current = state && state.key === location.key ? state.panel : null
        const panel = typeof next === 'function' ? next(current) : next
        return panel ? { panel, key: location.key } : null
      }),
    [location.key],
  )
  const closeMenu = useCallback(() => setOpen(null), [setOpen])
  const toggle = (panel: Panel) => () => setOpen((current) => (current === panel ? null : panel))
  // SC-021: Messe-Zeile — der naechste belegte Termin (SC-019), sonst nur Service-Links.
  const event = getNextHomeEvent()

  // Escape schliesst die Uebersicht und gibt den Fokus an den ausloesenden Knopf zurueck; wandert
  // der Fokus aus der Hauptnavigation hinaus, schliesst sie ebenfalls (AP24 PT24.2). Bewusst OHNE
  // Fokusfalle: nicht modal.
  useEffect(() => {
    if (!open) return
    const trigger = () =>
      navRef.current?.querySelector<HTMLElement>(`[data-submenu-trigger="${open}"]`)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      closeMenu()
      trigger()?.focus()
    }
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as Node | null
      if (!target || navRef.current?.contains(target)) return
      closeMenu()
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [open, closeMenu])

  const navLink = (item: NavChild, className: string) => {
    const active = isPrimaryActive(item, location.pathname)
    const exact = isExactPage(item.route, location.pathname)
    return (
      <Link
        key={item.label}
        to={item.route}
        aria-current={exact ? 'page' : active ? 'true' : undefined}
        data-active={active || undefined}
        className={className}
      >
        {t(`nav.${item.label}`)}
      </Link>
    )
  }

  /**
   * Beide Online-Shops: in der Leiste als getoente Zellen mit Symbol-Abzeichen (13A-4),
   * in der Uebersicht als Pillen mit Unterzeile. Fremde Domains, daher <a> in neuem Fenster
   * (Owner 2026-11-03: externe Links immer in neuem Fenster); Klickzaehlung ueber OUTBOUND_DOMAINS.
   */
  const shopLinks = (variant: 'cell' | 'pill', only?: 'practice' | 'panels') => {
    const cell = variant === 'cell'
    const base = cell
      ? `${CELL} hidden shrink-0 gap-2 px-3 text-[13px] font-semibold xl:flex 2xl:gap-2.5 2xl:px-4 2xl:text-sm`
      : SHOP_PILL
    const sub = (key: string) =>
      cell ? null : <span className="text-xs font-medium opacity-80">{t(key)}</span>
    return (
      <>
        {only !== 'panels' && (
          <a
            href={shopUrl(i18n.language)}
            data-shop="practice"
            target="_blank"
            rel="noopener noreferrer"
            className={`${base} ${
              cell
                ? 'bg-brand-soft text-heading hover:bg-accent-soft'
                : 'bg-brand-deep text-white hover:bg-brand-navy-hover'
            }`}
          >
            <span
              className={`${BADGE} ${cell ? 'bg-brand-deep text-white' : 'bg-white/20 text-white'}`}
            >
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            {t('nav.shop_practice')}
            {sub('nav.shop_practice_sub')}
          </a>
        )}
        {only !== 'practice' && (
          <a
            href={panelsUrl(i18n.language)}
            data-shop="panels"
            target="_blank"
            rel="noopener noreferrer"
            className={`${base} bg-accent-soft text-heading hover:bg-accent-border`}
          >
            <span className={`${BADGE} bg-accent-line text-brand-deep`}>
              <Droplet className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            {t('nav.shop_epigenetics')}
            {sub('nav.shop_epigenetics_sub')}
          </a>
        )}
      </>
    )
  }

  /** Vorschau: das Geraet — Bild und zwei Zeilen, ein Ziel. */
  const deviceCard = (
    <Link
      to="/igloo-pro"
      className={`flex flex-col rounded-card bg-paper p-4 ring-1 ring-paper-line transition-colors hover:bg-paper-deep motion-reduce:transition-none ${FOCUS}`}
    >
      <img
        src={IglooProImage}
        alt=""
        width={320}
        height={320}
        loading="lazy"
        className="mx-auto h-28 w-auto"
      />
      <span className="mt-3 font-semibold">{t('nav.iglooPro')}</span>
      <span className="mt-1 text-sm text-gray-700">{t('nav.iglooPro_desc')}</span>
      <span className="t-link-cta mt-2 inline-flex items-center gap-1 text-sm">
        {t('nav.iglooPro_more')}
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  )

  return (
    <>
      {/* Abdunkelung der Seite hinter der offenen Uebersicht (SC-021: Menue klappt von oben auf). */}
      {open && (
        <div
          aria-hidden="true"
          onClick={closeMenu}
          className="fixed inset-0 z-20 bg-brand-deep/40 backdrop-blur-sm"
        />
      )}
      {/*
        SC-021 (Owner 2026-11-02, Entwurf 13A-4 „Raster"): weisse Kopfzeile ueber die volle
        Breite, jeder Punkt in seiner Zelle, getrennt durch Haarlinien (`ui.border`); der aktive
        Punkt traegt eine Oberkante im Signet-Cyan. Darueber die Messe-/Service-Zeile
        (`accent.soft`, 44 px). Beide Shops sind getoente Zellen mit Symbol (`brand.soft` / `accent.soft`),
        der General-Sales-Knopf eine Navy-Zelle. Zeile und Raster sind auf `max-w-page` (1440 px)
        begrenzt (Owner 2026-11-02: „der Content in der Top Bar ist zu breit"). Gescrollt bleibt die Zeile stehen, das Raster
        wird kompakter (`header-bar-compact`); die Seite darunter bewegt sich nicht (fixed).
        Hoehen: `spacing.header-*`, Seitenabstand `pt-page-top xl:pt-page-top-xl` (tailwind.config.js,
        DESIGN-SYSTEM-CONTRACT §6.11/§7.1).
      */}
      <header
        className={`fixed inset-x-0 top-0 z-30 border-b border-ui-border bg-white text-heading ${
          isScrolled ? 'shadow-dialog' : ''
        }`}
      >
        <div
          data-event-strip
          // Bleibt auch gescrollt stehen: Sprachumschalter und Standtermin muessen jederzeit
          // erreichbar sein (AP12-Closure klickt „Sprache waehlen" nach dem Scrollen).
          className="border-b border-ui-border bg-accent-soft text-sm"
        >
          <div className="mx-auto flex h-header-strip max-w-page items-center gap-2.5 px-4 sm:px-6 xl:px-10">
            {event && (
              <p className="flex min-w-0 items-center gap-2.5 whitespace-nowrap">
                {/* aria-label ist auf <p> nicht erlaubt (ARIA 1.2) — die Zeile bekommt einen sr-only-Vorsatz. */}
                <span className="sr-only">{t('a11y.event_strip')}: </span>
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-line"
                />
                <Link
                  to="/events"
                  className={`flex min-h-[44px] items-center truncate rounded-sm font-semibold ${FOCUS}`}
                >
                  {t(`events:items.${event.id}.title`)}
                </Link>
                <span className="hidden truncate text-heading/80 sm:inline">
                  {formatEventRange(i18n.language, event.date, event.endDate)} · {event.location}
                  {t(`events:items.${event.id}.short`, '') &&
                    ` · ${t(`events:items.${event.id}.short`, '')}`}
                </span>
                <Link
                  to="/contact"
                  className={`hidden min-h-[44px] items-center gap-0.5 rounded-sm font-semibold text-accent-strong md:inline-flex ${FOCUS}`}
                >
                  {t('event_popup.meet')}
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </p>
            )}
            <nav
              aria-label={t('a11y.secondary_nav')}
              className="ml-auto flex shrink-0 items-center gap-4"
            >
              {SERVICE_LINKS.map((item) => (
                <Link
                  key={item.label}
                  to={item.route}
                  aria-current={isExactPage(item.route, location.pathname) ? 'page' : undefined}
                  className={`hidden min-h-[44px] items-center rounded-sm font-medium text-heading/80 hover:text-heading xl:inline-flex ${FOCUS}`}
                >
                  {t(`nav.${item.label}`)}
                </Link>
              ))}
              <LanguageSwitcher compact />
            </nav>
          </div>
        </div>

        <nav
          ref={navRef}
          aria-label={t('a11y.main_nav')}
          className="relative"
          // Verlaesst der Zeiger Raster und Uebersicht, schliesst ein per Hover geoeffnetes Panel;
          // die per Knopf geoeffnete Gesamtuebersicht bleibt stehen.
          onMouseLeave={() => setOpen((current) => (current === 'menu' ? current : null))}
        >
          <div
            className={`mx-auto flex h-header-bar-sm max-w-page items-stretch border-ui-border transition-[height] duration-300 motion-reduce:transition-none min-[1441px]:border-x ${
              isScrolled ? 'xl:h-header-bar-compact' : 'xl:h-header-bar'
            }`}
          >
            <Link to="/" className={`${CELL} shrink-0 px-4 sm:px-6 2xl:px-8`}>
              <img
                src={logo}
                alt={t('logo.alt', 'PolarisDX — POC-Diagnostik für Arztpraxen')}
                width={272}
                height={80}
                // `low`: kein eigener Preload im <head> — der Platz gehoert dem Buehnenfoto.
                fetchPriority="low"
                className={`w-auto transition-[height] duration-300 motion-reduce:transition-none ${
                  isScrolled ? 'h-7' : 'h-8 xl:h-9'
                }`}
              />
            </Link>

            {PRIMARY.map((item) => {
              const panel = item.label as Panel
              const active = isPrimaryActive(item, location.pathname)
              return (
                <div
                  key={item.label}
                  data-submenu-scope={item.label}
                  data-active={active || undefined}
                  onMouseEnter={() => setOpen(panel)}
                  className={`relative hidden shrink-0 items-stretch border-r border-ui-border transition-colors hover:bg-brand-soft motion-reduce:transition-none xl:flex ${
                    open === panel ? 'bg-brand-soft' : ''
                  } data-[active]:after:absolute data-[active]:after:inset-x-0 data-[active]:after:top-0 data-[active]:after:h-[3px] data-[active]:after:bg-accent-line`}
                >
                  {navLink(
                    item,
                    `flex items-center pl-4 pr-1 text-[15px] font-medium 2xl:pl-6 2xl:text-base ${FOCUS} ` +
                      'data-[active]:font-semibold',
                  )}
                  {/* Der Aufklapper ist ein eigener Knopf — das Panel ist nicht hover-only (AP06, AP24). */}
                  <button
                    type="button"
                    data-submenu-trigger={item.label}
                    aria-expanded={open === panel}
                    aria-label={t('a11y.toggle_submenu', {
                      name: t(`nav.${item.label}`),
                      defaultValue: `${t(`nav.${item.label}`)} — Untermenü`,
                    })}
                    onClick={toggle(panel)}
                    className={`flex items-center pl-1 pr-3 text-heading/70 2xl:pr-4 ${FOCUS}`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open === panel ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )
            })}

            <span aria-hidden="true" className="min-w-0 flex-1 border-r border-ui-border" />

            {shopLinks('cell')}
            {/* SC-023 (Owner 2026-11-03): Navy-Zelle „Angebot anfragen“ entfernt. */}

            <button
              type="button"
              onClick={searchModal.onOpen}
              aria-label={t('a11y.search', 'Suche öffnen')}
              className={`${CELL} w-14 shrink-0 justify-center hover:bg-brand-soft 2xl:w-16`}
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              data-submenu-trigger="menu"
              aria-expanded={open === 'menu'}
              aria-label={t('a11y.toggle_nav', 'Navigation umschalten')}
              onClick={toggle('menu')}
              className={`flex h-full w-14 shrink-0 items-center justify-center gap-2 px-2 transition-colors hover:bg-brand-soft motion-reduce:transition-none 2xl:w-auto 2xl:px-6 ${FOCUS}`}
            >
              <span className="hidden text-base font-semibold 2xl:inline">{t('nav.menu')}</span>
              {open === 'menu' ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Inhaltsuebersicht — klappt unter dem Raster auf; mobil als Liste. */}
          {open && (
            <div
              id="site-menu"
              data-panel={open}
              className="absolute inset-x-0 top-full max-h-[calc(100vh-8rem)] overflow-y-auto border-b border-ui-border bg-white shadow-dialog xl:bg-white/95 xl:backdrop-blur-md"
            >
              <div className="mx-auto max-w-container px-4 py-6 sm:px-6 xl:px-0 xl:py-7">
                {open === 'menu' && (
                  <ul className="mb-6 grid gap-1 border-b border-ui-border pb-5 xl:hidden">
                    {PRIMARY.map((item) => (
                      <li key={item.label}>
                        {navLink(item, `${MENU_LINK} text-lg font-semibold`)}
                      </li>
                    ))}
                  </ul>
                )}

                {open === 'epigenetics' && (
                  <div className="grid gap-8 md:grid-cols-[1fr_1fr_1.15fr] xl:gap-9">
                    <div>
                      <p className="t-h6 mb-2 px-2">{t('nav.epigenetics')}</p>
                      {EPIGENETICS_LINKS.map((link) => (
                        <Link
                          key={link.key}
                          to={link.route}
                          aria-current={
                            isExactPage(link.route, location.pathname) ? 'page' : undefined
                          }
                          className={MENU_LINK}
                        >
                          {t(link.key)}
                        </Link>
                      ))}
                    </div>
                    <div>
                      <p className="t-h6 mb-2 px-2">{t('nav.shop_epigenetics_sub')}</p>
                      <p className="px-2 text-sm text-gray-700">{t('nav.epigenetics_desc')}</p>
                      <div className="mt-4 px-2">{shopLinks('pill', 'panels')}</div>
                    </div>
                    <Link
                      to="/epigenetics#musterbefunde"
                      className={`flex flex-col rounded-card bg-paper p-4 ring-1 ring-paper-line transition-colors hover:bg-paper-deep motion-reduce:transition-none ${FOCUS}`}
                    >
                      <img
                        src={reportImage}
                        alt=""
                        width={400}
                        height={566}
                        loading="lazy"
                        className="mx-auto h-32 w-auto rounded-md shadow-card"
                      />
                      <span className="mt-3 font-semibold">{t('nav.musterbefunde')}</span>
                      <span className="mt-1 text-sm text-gray-700">
                        {t('nav.musterbefunde_desc')}
                      </span>
                    </Link>
                  </div>
                )}

                {open === 'iglooPro' && (
                  <div className="grid gap-8 md:grid-cols-[1fr_1fr_1.15fr] xl:gap-9">
                    <div>
                      <p className="t-h6 mb-2 px-2">{t('nav.iglooPro')}</p>
                      {IGLOO_LINKS.map((link) => (
                        <Link
                          key={link.label}
                          to={link.route}
                          aria-current={
                            isExactPage(link.route, location.pathname) ? 'page' : undefined
                          }
                          className={MENU_LINK}
                        >
                          {t(`nav.${link.label}`)}
                        </Link>
                      ))}
                    </div>
                    <div>
                      <p className="t-h6 mb-2 px-2">{t('nav.shop_practice_sub')}</p>
                      <p className="px-2 text-sm text-gray-700">{t('nav.iglooPro_desc')}</p>
                      <div className="mt-4 px-2">{shopLinks('pill', 'practice')}</div>
                    </div>
                    {deviceCard}
                  </div>
                )}

                {open === 'events' && (
                  <div className="grid gap-8 md:grid-cols-[1.15fr_1fr] xl:gap-9">
                    {event ? (
                      <div className="rounded-card bg-brand-deep p-5 text-white">
                        <p className="t-eyebrow-dark">
                          {t('event_band.eyebrow')} · {t(`events:items.${event.id}.tag`, '')}
                        </p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight">
                          {t(`events:items.${event.id}.title`)}
                        </p>
                        <p className="mt-1 text-white/85">
                          {formatEventRange(i18n.language, event.date, event.endDate)} ·{' '}
                          {event.location}
                          {t(`events:items.${event.id}.short`, '') &&
                            ` · ${t(`events:items.${event.id}.short`, '')}`}
                        </p>
                        <p className="mt-3 text-sm text-white/80">
                          {t(`events:items.${event.id}.description`, '')}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <Link
                            to="/contact"
                            className="inline-flex min-h-[44px] items-center rounded-full bg-white px-5 text-sm font-semibold text-brand-deep hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          >
                            {t('event_popup.meet')}
                          </Link>
                          <Link
                            to="/events"
                            className="inline-flex min-h-[44px] items-center rounded-full px-5 text-sm font-semibold text-accent-on-dark hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          >
                            {t('event_band.all')}
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <Link to="/events" className={MENU_LINK}>
                        {t('nav.events')}
                      </Link>
                    )}
                    <div>
                      <p className="t-h6 mb-2 px-2">{t('a11y.secondary_nav')}</p>
                      {[{ label: 'events', route: '/events' }, ...SERVICE_LINKS].map((link) => (
                        <Link key={link.label} to={link.route} className={MENU_LINK}>
                          {t(`nav.${link.label}`)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {(open === 'menu' || open === 'service') && (
                  <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.15fr] xl:gap-9">
                    {DIAGNOSTICS_GROUPS.map((group) => (
                      <div key={group.heading}>
                        <p className="t-h6 mb-2 px-2">{t(`nav.${group.heading}`)}</p>
                        {group.items.map((child) => (
                          <Link
                            key={child.label}
                            to={child.route}
                            aria-current={
                              isExactPage(child.route, location.pathname) ? 'page' : undefined
                            }
                            className={`${MENU_LINK} ${
                              isPathActive(child.route, location.pathname) ? 'bg-paper-deep' : ''
                            }`}
                          >
                            {t(`nav.${child.label}`)}
                          </Link>
                        ))}
                        {group.hub && (
                          <Link
                            to={group.hub.route}
                            className={`t-link-cta mt-1 inline-flex min-h-[44px] items-center gap-1 rounded-sm px-2 ${FOCUS}`}
                          >
                            {t(`nav.${group.hub.label}`)}
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        )}
                        {/* Querverweis UNTER der System-Spalte, mit eigener Ueberschrift — sichtbar
                          keine neunte Leistung und keine Untergruppe (IA §10.4/§10.5). */}
                        {group.heading === 'group_system' && (
                          <div className="mt-5 border-t border-ui-border pt-4">
                            <p className="t-caption mb-1 px-2">{t('nav.group_crosslink')}</p>
                            {CROSSLINKS.map((cross) => (
                              <Link
                                key={cross.label}
                                to={cross.route}
                                className={`${MENU_LINK} text-accent-strong underline decoration-from-font underline-offset-2`}
                              >
                                {t(`nav.${cross.label}`)}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {deviceCard}
                  </div>
                )}

                {open === 'menu' && (
                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-ui-border pt-5">
                    {shopLinks('pill')}
                    <span className="flex flex-wrap items-center gap-x-5 gap-y-2 md:ml-auto">
                      {MORE_LINKS.map((item) => (
                        <Link
                          key={item.label}
                          to={item.route}
                          className={`inline-flex min-h-[44px] items-center rounded-sm text-sm font-medium text-heading hover:text-accent-strong ${FOCUS}`}
                        >
                          {t(`nav.${item.label}`)}
                        </Link>
                      ))}
                      {SERVICE_LINKS.map((item) => (
                        <Link
                          key={item.label}
                          to={item.route}
                          className={`inline-flex min-h-[44px] items-center rounded-sm text-sm font-medium text-heading hover:text-accent-strong xl:hidden ${FOCUS}`}
                        >
                          {t(`nav.${item.label}`)}
                        </Link>
                      ))}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchModal.isOpen} onClose={searchModal.onClose} />
    </>
  )
}

export default Header
