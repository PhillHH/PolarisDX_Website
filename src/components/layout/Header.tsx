import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Droplet,
  Menu,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react'
import IglooProImage from '../../assets/home/Igloo-pro-frontal-320w.webp'
import reportImage from '../../assets/home/report-preview-400w.webp'
// SC-027 (Owner 2026-11-13, „Service oben“): die Kopfzeile ist Nacht-Navy, das Logo steht weiss —
// per Filter auf der farbigen Datei, ohne zweite Bilddatei.
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

/** Fokusring auf der Nacht-Navy: `accent.on-dark` (8,2:1 auf `night`). */
const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-on-dark'
/** Rundes Symbol-Abzeichen der Shops. */
const BADGE = 'inline-flex shrink-0 items-center justify-center rounded-full'
/** Eintrag in der Menueflaeche. */
const MENU_LINK = `flex min-h-[44px] items-center rounded-sm px-2 py-2 text-[15px] font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-accent-on-dark motion-reduce:transition-none ${FOCUS}`
/** Spaltenkopf in der Menueflaeche. */
const MENU_HEAD =
  'mb-2 border-b border-white/10 px-2 pb-3 text-xs font-medium uppercase tracking-[0.16em] text-night-dim'
/** Verweis mit Pfeil in der Menueflaeche. */
const MENU_MORE = `inline-flex min-h-[44px] items-center gap-1 rounded-sm px-2 text-sm font-medium text-accent-on-dark transition-colors hover:text-white motion-reduce:transition-none ${FOCUS}`
/** Vorschaukarte in der Menueflaeche. */
const MENU_CARD = `flex flex-col bg-night-raised p-4 ring-1 ring-white/10 transition-colors hover:bg-night-panel motion-reduce:transition-none ${FOCUS}`
/** Shop als Pille: in der Leiste (ab xl) und in der Uebersicht. */
const SHOP_PILL = `items-center rounded-full border border-accent-on-dark/30 bg-white/5 py-1.5 pl-2 font-medium transition-colors hover:border-accent-on-dark/70 hover:bg-white/10 motion-reduce:transition-none ${FOCUS}`
/** Hauptknopf „Infotermin buchen“: Akzentflaeche, eckig wie die Knoepfe der Startseite. */
const CTA = `shrink-0 items-center gap-2 bg-accent px-4 text-sm font-medium leading-tight text-white transition-colors hover:bg-accent-strong motion-reduce:transition-none ${FOCUS}`

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

  // SC-027: Die Lichtlinie unter der Leiste zeigt den Lesefortschritt. Sie wird am Element gesetzt,
  // nicht ueber den React-Zustand; mit reduzierter Bewegung bleibt sie aus (`.hdr-progress`, index.css).
  const progressRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const line = progressRef.current
    if (!line) return
    let frame = 0
    const update = () => {
      frame = 0
      const range = document.documentElement.scrollHeight - window.innerHeight
      line.style.transform = `scaleX(${range > 0 ? Math.min(1, window.scrollY / range) : 0})`
    }
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    request()
    return () => {
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      window.cancelAnimationFrame(frame)
    }
  }, [location.key])

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
   * Beide Online-Shops (SC-027): unter xl als Textlinks mit Abzeichen in der oberen Zeile, ab xl als
   * Pillen in der Leiste, in der Uebersicht als Pillen mit Unterzeile. Fremde Domains, daher <a> in
   * neuem Fenster (Owner 2026-11-03: externe Links immer in neuem Fenster); Klickzaehlung ueber
   * OUTBOUND_DOMAINS.
   */
  const shopLinks = (variant: 'strip' | 'bar' | 'menu', only?: 'practice' | 'panels') => {
    const base =
      variant === 'strip'
        ? `inline-flex min-h-[44px] min-w-0 items-center gap-1.5 rounded-sm font-medium ${FOCUS}`
        : variant === 'bar'
          ? `hidden h-10 min-w-0 text-[13px] xl:inline-flex ${isScrolled ? 'shrink-0 pr-2' : 'gap-1.5 pr-3 2xl:gap-2 2xl:pr-4'} ${SHOP_PILL}`
          : `inline-flex min-h-[44px] gap-2 pr-4 text-sm ${SHOP_PILL}`
    const badge = variant === 'strip' ? `${BADGE} h-5 w-5` : `${BADGE} h-6 w-6`
    const icon = variant === 'strip' ? 'h-3 w-3' : 'h-3.5 w-3.5'
    // Gescrollt steht die Sprachwahl mit in der Leiste: die Pillen tragen dann nur ihr Abzeichen,
    // der Name bleibt als `aria-label` erhalten. Die Breite ist fuer die laengste der zehn Sprachen
    // bemessen; reicht sie doch nicht, kuerzt die Beschriftung, statt die Leiste zu sprengen.
    const compact = variant === 'bar' && isScrolled
    const label = (key: string) => <span className={compact ? 'hidden' : 'truncate'}>{t(key)}</span>
    const sub = (key: string) =>
      variant === 'menu' ? (
        <span className="text-xs font-normal text-night-dim">{t(key)}</span>
      ) : null
    return (
      <>
        {only !== 'panels' && (
          <a
            href={shopUrl(i18n.language)}
            data-shop="practice"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={compact ? t('nav.shop_practice') : undefined}
            className={base}
          >
            <span className={`${badge} bg-white text-night`}>
              <ShoppingBag className={icon} aria-hidden="true" />
            </span>
            {label('nav.shop_practice')}
            {sub('nav.shop_practice_sub')}
          </a>
        )}
        {only !== 'practice' && (
          <a
            href={panelsUrl(i18n.language)}
            data-shop="panels"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={compact ? t('nav.shop_epigenetics') : undefined}
            className={base}
          >
            <span className={`${badge} bg-accent-line text-night`}>
              <Droplet className={icon} aria-hidden="true" />
            </span>
            {label('nav.shop_epigenetics')}
            {sub('nav.shop_epigenetics_sub')}
          </a>
        )}
      </>
    )
  }

  /** Vorschau: das Geraet — Bild und zwei Zeilen, ein Ziel. */
  const deviceCard = (
    <Link to="/igloo-pro" className={MENU_CARD}>
      <img
        src={IglooProImage}
        alt=""
        width={320}
        height={320}
        loading="lazy"
        className="mx-auto h-28 w-auto"
      />
      <span className="mt-3 font-medium">{t('nav.iglooPro')}</span>
      <span className="mt-1 text-sm text-night-dim">{t('nav.iglooPro_desc')}</span>
      <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent-on-dark">
        {t('nav.iglooPro_more')}
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  )

  /** Der naechste belegte Termin als Karte: im Termine-Panel und unter xl in der Uebersicht. */
  const eventCard = event && (
    <div className="bg-night-panel p-5">
      <p className="t-eyebrow-dark">
        {t('event_band.eyebrow')} · {t(`events:items.${event.id}.tag`, '')}
      </p>
      <p className="mt-2 text-2xl font-light tracking-tight">
        {t(`events:items.${event.id}.title`)}
      </p>
      <p className="mt-1 text-white/90">
        {formatEventRange(i18n.language, event.date, event.endDate)} · {event.location}
        {t(`events:items.${event.id}.short`, '') && ` · ${t(`events:items.${event.id}.short`, '')}`}
      </p>
      <p className="mt-3 text-sm text-night-dim">{t(`events:items.${event.id}.description`, '')}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Link to="/contact" className={`inline-flex min-h-[44px] ${CTA}`}>
          {t('event_popup.meet')}
        </Link>
        <Link to="/events" className={MENU_MORE}>
          {t('event_band.all')}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Abdunkelung der Seite hinter der offenen Uebersicht (SC-021: Menue klappt von oben auf). */}
      {open && (
        <div
          aria-hidden="true"
          onClick={closeMenu}
          className="fixed inset-0 z-20 bg-night/60 backdrop-blur-sm"
        />
      )}
      {/*
        SC-027 (Owner 2026-11-13, Entwurf „Lichtleiste · Service oben“): Kopfzeile in Nacht-Navy ueber
        die volle Breite. Oben die schmale Service-Zeile (44 px): ab xl Messe-Hinweis links und Blog,
        Support, Kontakt, Sprachwahl rechts; unter xl beide Shops links und die Sprachwahl rechts.
        Darunter die Hauptleiste: Logo, vier Hauptpunkte (Link + eigener Aufklapper), beide Shops als
        Pillen, Suche, „Infotermin buchen“, Menue-Knopf. Ab xl klappt die Service-Zeile beim Scrollen
        ein und die Sprachwahl steht in der Leiste (AP12: jederzeit erreichbar); unter xl bleiben
        beide Zeilen stehen. Die Unterkante ist die Lichtlinie mit Lesefortschritt. Hoehen:
        `spacing.header-*`, Seitenabstand `pt-page-top xl:pt-page-top-xl`, klebende Leisten
        `top-header-stuck xl:top-header-stuck-xl` (tailwind.config.js).
      */}
      <header className="fixed inset-x-0 top-0 z-30 bg-night text-white">
        <div
          data-event-strip
          className={`border-b border-white/10 text-xs transition-all duration-300 motion-reduce:transition-none sm:text-[13px] ${
            isScrolled ? 'xl:invisible xl:-mt-header-strip-row' : ''
          }`}
        >
          <div className="mx-auto flex h-header-strip max-w-page items-center gap-2 px-4 sm:px-6 xl:gap-2.5 xl:px-10">
            <div className="flex min-w-0 items-center gap-3 xl:hidden">{shopLinks('strip')}</div>
            {event && (
              <p className="hidden min-w-0 items-center gap-2.5 whitespace-nowrap xl:flex">
                {/* aria-label ist auf <p> nicht erlaubt (ARIA 1.2) — die Zeile bekommt einen sr-only-Vorsatz. */}
                <span className="sr-only">{t('a11y.event_strip')}: </span>
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-line"
                />
                <Link
                  to="/events"
                  className={`flex min-h-[44px] items-center truncate rounded-sm font-medium ${FOCUS}`}
                >
                  {t(`events:items.${event.id}.title`)}
                </Link>
                <span className="truncate text-night-dim">
                  {formatEventRange(i18n.language, event.date, event.endDate)} · {event.location}
                  {t(`events:items.${event.id}.short`, '') &&
                    ` · ${t(`events:items.${event.id}.short`, '')}`}
                </span>
                <Link
                  to="/contact"
                  className={`inline-flex min-h-[44px] items-center gap-0.5 rounded-sm font-medium text-accent-on-dark transition-colors hover:text-white motion-reduce:transition-none ${FOCUS}`}
                >
                  {t('event_popup.meet')}
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </p>
            )}
            <nav
              aria-label={t('a11y.secondary_nav')}
              className="ml-auto flex shrink-0 items-center gap-5"
            >
              {SERVICE_LINKS.map((item) => (
                <Link
                  key={item.label}
                  to={item.route}
                  aria-current={isExactPage(item.route, location.pathname) ? 'page' : undefined}
                  className={`hidden min-h-[44px] items-center rounded-sm text-white/80 transition-colors hover:text-white motion-reduce:transition-none xl:inline-flex ${FOCUS}`}
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
          // Verlaesst der Zeiger Leiste und Menueflaeche, schliesst ein per Hover geoeffnetes Panel;
          // die per Knopf geoeffnete Gesamtuebersicht bleibt stehen.
          onMouseLeave={() => setOpen((current) => (current === 'menu' ? current : null))}
        >
          <div
            className={`mx-auto flex h-header-bar-sm max-w-page items-center gap-1 px-4 transition-[height] duration-300 motion-reduce:transition-none sm:px-6 xl:px-10 2xl:gap-2 ${
              isScrolled ? 'xl:h-header-bar-compact' : 'xl:h-header-bar'
            }`}
          >
            <Link to="/" className={`flex h-full shrink-0 items-center pr-3 2xl:pr-5 ${FOCUS}`}>
              <img
                src={logo}
                alt={t('logo.alt', 'PolarisDX — POC-Diagnostik für Arztpraxen')}
                width={272}
                height={80}
                // `low`: kein eigener Preload im <head> — der Platz gehoert dem Buehnenfoto.
                fetchPriority="low"
                className="hdr-logo h-8 w-auto"
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
                  // Lichtmarke auf der Unterkante (`.hdr-mark`): aktiver Bereich und offenes Panel.
                  data-open={open === panel || undefined}
                  onMouseEnter={() => setOpen(panel)}
                  className="hdr-mark relative hidden h-full shrink-0 items-center xl:flex"
                >
                  {navLink(
                    item,
                    `flex min-h-[44px] items-center rounded-sm pl-2.5 text-[15px] font-medium text-white/90 transition-colors hover:text-white motion-reduce:transition-none ${FOCUS}`,
                  )}
                  {/* Der Aufklapper ist ein eigener Knopf — das Panel ist nicht hover-only (AP06, AP24).
                      24 px breit: Mindest-Trefferflaeche nach WCAG 2.5.8 (axe `target-size`). */}
                  <button
                    type="button"
                    data-submenu-trigger={item.label}
                    aria-expanded={open === panel}
                    aria-label={t('a11y.toggle_submenu', {
                      name: t(`nav.${item.label}`),
                      defaultValue: `${t(`nav.${item.label}`)} — Untermenü`,
                    })}
                    onClick={toggle(panel)}
                    className={`flex min-h-[44px] w-6 items-center justify-center rounded-sm text-white/70 transition-colors hover:text-white motion-reduce:transition-none ${FOCUS}`}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open === panel ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )
            })}

            <span aria-hidden="true" className="min-w-0 flex-1" />

            {shopLinks('bar')}

            {/*
              SC-027: „Infotermin buchen“ wie in der Startseiten-Buehne (SC-023) — schlichter Weg zur
              Kontaktseite, ohne Verkaufs-Attribution; „Angebot anfragen“ bleibt aus der Kopfzeile.
              Der Knopf steht VOR Suche und Menue: die Sprachliste der Service-Zeile klappt ueber das
              rechte Ende der Leiste und darf kein Ziel auf einen Rest unter 24 px zuschneiden
              (axe `target-size`, Zustand „Sprachdropdown offen“).
            */}
            <Link
              to="/contact"
              data-header-cta
              className={`ml-1 hidden h-11 max-w-[11rem] xl:inline-flex ${CTA}`}
            >
              {t('nav.cta_appointment')}
              <ArrowRight className="hidden h-4 w-4 shrink-0 2xl:block" aria-hidden="true" />
            </Link>

            <button
              type="button"
              onClick={searchModal.onOpen}
              aria-label={t('a11y.search', 'Suche öffnen')}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/10 motion-reduce:transition-none ${FOCUS}`}
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* AP12: Ab xl ist die Service-Zeile gescrollt eingeklappt — die Sprachwahl steht dann hier. */}
            {isScrolled && <LanguageSwitcher compact className="hidden xl:block" />}

            <button
              type="button"
              data-submenu-trigger="menu"
              aria-expanded={open === 'menu'}
              aria-label={t('a11y.toggle_nav', 'Navigation umschalten')}
              onClick={toggle('menu')}
              className={`flex h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-full transition-colors hover:bg-white/10 motion-reduce:transition-none 2xl:w-auto 2xl:px-4 ${FOCUS}`}
            >
              <span className="hidden text-sm font-medium 2xl:inline">{t('nav.menu')}</span>
              {open === 'menu' ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Menueflaeche — klappt unter der Leiste auf; unter xl als Blatt mit der Gesamtuebersicht. */}
          {open && (
            <div
              id="site-menu"
              data-panel={open}
              className="absolute inset-x-0 top-full max-h-[calc(100vh-8rem)] overflow-y-auto border-t border-white/10 bg-night shadow-dialog xl:bg-night/95 xl:backdrop-blur-md"
            >
              <div className="mx-auto max-w-container px-4 py-6 sm:px-6 xl:px-0 xl:py-8">
                {open === 'menu' && (
                  <ul className="mb-6 grid border-b border-white/10 pb-4 xl:hidden">
                    {PRIMARY.map((item) => (
                      <li key={item.label}>
                        {navLink(
                          item,
                          `flex min-h-[52px] items-center rounded-sm px-2 text-2xl font-light tracking-tight transition-colors hover:text-accent-on-dark motion-reduce:transition-none ${FOCUS}`,
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {open === 'epigenetics' && (
                  <div className="grid gap-8 md:grid-cols-[1fr_1fr_1.15fr] xl:gap-9">
                    <div>
                      <p className={MENU_HEAD}>{t('nav.epigenetics')}</p>
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
                      <p className={MENU_HEAD}>{t('nav.shop_epigenetics_sub')}</p>
                      <p className="px-2 text-sm text-night-dim">{t('nav.epigenetics_desc')}</p>
                      <div className="mt-4 px-2">{shopLinks('menu', 'panels')}</div>
                    </div>
                    <Link to="/epigenetics#musterbefunde" className={MENU_CARD}>
                      <img
                        src={reportImage}
                        alt=""
                        width={400}
                        height={566}
                        loading="lazy"
                        className="mx-auto h-32 w-auto shadow-card"
                      />
                      <span className="mt-3 font-medium">{t('nav.musterbefunde')}</span>
                      <span className="mt-1 text-sm text-night-dim">
                        {t('nav.musterbefunde_desc')}
                      </span>
                    </Link>
                  </div>
                )}

                {open === 'iglooPro' && (
                  <div className="grid gap-8 md:grid-cols-[1fr_1fr_1.15fr] xl:gap-9">
                    <div>
                      <p className={MENU_HEAD}>{t('nav.iglooPro')}</p>
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
                      <p className={MENU_HEAD}>{t('nav.shop_practice_sub')}</p>
                      <p className="px-2 text-sm text-night-dim">{t('nav.iglooPro_desc')}</p>
                      <div className="mt-4 px-2">{shopLinks('menu', 'practice')}</div>
                    </div>
                    {deviceCard}
                  </div>
                )}

                {open === 'events' && (
                  <div className="grid gap-8 md:grid-cols-[1.15fr_1fr] xl:gap-9">
                    {eventCard || (
                      <Link to="/events" className={MENU_LINK}>
                        {t('nav.events')}
                      </Link>
                    )}
                    <div>
                      <p className={MENU_HEAD}>{t('a11y.secondary_nav')}</p>
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
                        <p className={MENU_HEAD}>{t(`nav.${group.heading}`)}</p>
                        {group.items.map((child) => (
                          <Link
                            key={child.label}
                            to={child.route}
                            aria-current={
                              isExactPage(child.route, location.pathname) ? 'page' : undefined
                            }
                            className={`${MENU_LINK} ${
                              isPathActive(child.route, location.pathname) ? 'bg-white/5' : ''
                            }`}
                          >
                            {t(`nav.${child.label}`)}
                          </Link>
                        ))}
                        {group.hub && (
                          <Link to={group.hub.route} className={`mt-1 ${MENU_MORE}`}>
                            {t(`nav.${group.hub.label}`)}
                            <ChevronRight className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        )}
                        {/* Querverweis UNTER der System-Spalte, mit eigener Ueberschrift — sichtbar
                          keine neunte Leistung und keine Untergruppe (IA §10.4/§10.5). */}
                        {group.heading === 'group_system' && (
                          <div className="mt-5 border-t border-white/10 pt-4">
                            <p className="mb-1 px-2 text-xs text-night-dim">
                              {t('nav.group_crosslink')}
                            </p>
                            {CROSSLINKS.map((cross) => (
                              <Link
                                key={cross.label}
                                to={cross.route}
                                className={`${MENU_LINK} underline decoration-from-font underline-offset-2`}
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
                  <>
                    {/* Unter xl stehen Messe-Hinweis und Hauptknopf nicht in der Leiste — hier sind sie. */}
                    {eventCard && <div className="mt-6 xl:hidden">{eventCard}</div>}
                    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                      {shopLinks('menu')}
                      <span className="flex flex-wrap items-center gap-x-5 gap-y-2 md:ml-auto">
                        {MORE_LINKS.map((item) => (
                          <Link
                            key={item.label}
                            to={item.route}
                            className={`inline-flex min-h-[44px] items-center rounded-sm text-sm font-medium text-white/80 transition-colors hover:text-white motion-reduce:transition-none ${FOCUS}`}
                          >
                            {t(`nav.${item.label}`)}
                          </Link>
                        ))}
                        {SERVICE_LINKS.map((item) => (
                          <Link
                            key={item.label}
                            to={item.route}
                            className={`inline-flex min-h-[44px] items-center rounded-sm text-sm font-medium text-white/80 transition-colors hover:text-white motion-reduce:transition-none xl:hidden ${FOCUS}`}
                          >
                            {t(`nav.${item.label}`)}
                          </Link>
                        ))}
                      </span>
                    </div>
                    <Link
                      to="/contact"
                      data-header-cta
                      className={`mt-5 flex min-h-[52px] justify-between xl:hidden ${CTA}`}
                    >
                      {t('nav.cta_appointment')}
                      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Unterkante: Haarlinie, darauf die Lichtlinie mit dem Lesefortschritt. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10"
        />
        <span ref={progressRef} aria-hidden="true" className="hdr-progress" />
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchModal.isOpen} onClose={searchModal.onClose} />
    </>
  )
}

export default Header
