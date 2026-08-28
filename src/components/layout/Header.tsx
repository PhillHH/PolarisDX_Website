import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Search } from 'lucide-react'
import { Button } from '../ui/Button'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import SearchModal from '../ui/SearchModal'
import logo from '../../assets/polaris_white.webp'
import { useDisclosure } from '../../hooks/useDisclosure'
import { useScrollPosition } from '../../hooks/useScrollPosition'

interface NavChild {
  label: string
  route: string
}

/** Eine fachlich begruendete Spalte im Mega-Menue. */
interface NavGroup {
  /** i18n-Key der Spaltenueberschrift. */
  heading: string
  items: NavChild[]
}

interface NavItem {
  label: string
  route: string
  /** Flaches Untermenue. */
  children?: NavChild[]
  /** Mega-Menue mit Spalten. Schliesst `children` aus. */
  groups?: NavGroup[]
  /** Link auf die Bereichsseite, im Mega-Menue als eigene Zeile. */
  hubLabel?: string
  /**
   * Fachlicher Querverweis — bewusst KEINE Untergruppe des Bereichs.
   * Steht optisch abgesetzt und traegt eine eigene Ueberschrift.
   */
  crosslinks?: NavChild[]
}

/**
 * Die neun kanonischen Diagnostik-Services (`src/data/services.tsx`) in drei
 * fachlich begruendeten Spalten. IA-INVENTORY §10.4 verlangt eine fachliche
 * Begruendung der Gruppierung und laesst die Spaltenform AP06.
 *
 * Die Trennlinie ist die FRAGE, die ein Interessent stellt:
 *   - Praxisfelder      — "Ich bin Zahnarzt/Aesthetik/Longevity" (Zielgruppe)
 *   - Analysebereiche   — "Ich will Marker X messen"             (Fragestellung)
 *   - System & Integration — "Passt das zu meinem Bestand?"      (Plattform)
 *
 * Die frueher hier verwendete POC/Labor-Zweiteilung ist bewusst NICHT
 * uebernommen: sie existierte nur, um Epigenetik als "Laborteil" der
 * Diagnostik unterzubringen — genau die Fehlklassifikation, die IA §10.4
 * ("Epigenetik nicht als Service-Untergruppe modellieren") untersagt.
 * Epigenetik steht seit PT06.1 als eigene Saeule und erscheint hier nur noch
 * als abgesetzter Querverweis (§10.5 erlaubt ihn ausdruecklich).
 */
const DIAGNOSTICS_GROUPS: NavGroup[] = [
  {
    heading: 'group_fields',
    items: [
      { label: 'dental', route: '/diagnostics/dental' },
      { label: 'beauty', route: '/diagnostics/beauty' },
      { label: 'longevity', route: '/diagnostics/longevity' },
    ],
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

/**
 * Hauptnavigation nach AP03 IA-INVENTORY §10.3 ("Header-IA (Zielbild)").
 *
 * Die Saeulen sind bewusst wenige und klar unterscheidbar — der Header bildet
 * nicht jede Route ab (IA §10.1: "Nicht jede Route gehoert ins Menue").
 *
 * ZWEI AENDERUNGEN GEGENUEBER DEM IST-ZUSTAND, beide von der IA gefordert:
 *
 * 1. EPIGENETIK IST EINE EIGENE SAEULE (`IA-09`, `DEC-RL-005`).
 *    Vorher erschien sie ausschliesslich als Kind des Diagnostik-Menuepunkts,
 *    in der Gruppe `group_lab`. Eine eigenstaendige Geschaeftssaeule, die man
 *    nur ueber ein fremdes Aufklappmenue erreicht, ist keine eigenstaendige
 *    Saeule. Sie steht jetzt als eigener Punkt in der Hauptnavigation und ist
 *    aus dem Diagnostik-Menue entfernt (AP06.md §6.5).
 *
 * 2. IGLOOPRO IST SICHTBAR (IA §10.3 "Produktstrecke sichtbar, nicht in
 *    Diagnostik versteckt"). Vorher fuehrte kein Header-Weg zum Produkt.
 *
 * Ebenfalls IA-konform entfernt: `home` (das Logo ist der Heimweg) und der
 * `terms`-Unterpunkt unter About (Legal gehoert in den Footer, IA §10.3).
 *
 * Die fachliche Mega-Menue-Struktur der Diagnostik gehoert **PT06.2**; hier
 * steht bewusst nur der Parent mit seinen vorhandenen POC-Zielen.
 */
const navItems: NavItem[] = [
  {
    label: 'service',
    route: '/diagnostics',
    groups: DIAGNOSTICS_GROUPS,
    hubLabel: 'diagnostics_all',
    crosslinks: [{ label: 'epigenetics', route: '/epigenetics' }],
  },
  { label: 'epigenetics', route: '/epigenetics' },
  { label: 'iglooPro', route: '/igloo-pro' },
  { label: 'blog', route: '/articles' },
  { label: 'events', route: '/events' },
  { label: 'about', route: '/about' },
  { label: 'support', route: '/support' },
]

/**
 * Gemeinsamer Stil der Header-Links.
 *
 * FOKUSRING: Die Header-Navigationslinks hatten bis AP06 PT06.1 **keinen**
 * sichtbaren Fokusindikator — in der AP05-Closure gemessen (7 von 16
 * Tab-Zielen auf /de/contact ohne Ring) und dort als AP06-Item registriert.
 * Der Ring ist weiss mit navy Offset, weil der Header sowohl transparent
 * ueber dem Navy-Hero als auch als Navy-Flaeche auftritt.
 */
const NAV_LINK =
  'flex min-h-[44px] items-center gap-1 rounded-sm text-white transition-all duration-300 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep motion-reduce:transition-none'

/** Eintrag in einem geoeffneten Menue — hell, mit eigenem Fokusring. */
const MENU_LINK =
  'flex min-h-[44px] items-center rounded-lg px-2 py-2 text-sm font-medium text-heading ' +
  'transition-colors hover:bg-slate-100 motion-reduce:transition-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset'

/** Mobiler Navigationslink: 44px Trefferflaeche plus sichtbarer Fokusring. */
const MOBILE_LINK =
  'flex min-h-[44px] items-center rounded-sm font-normal tracking-wide text-white ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep'

/** Die Sales-Machine-Unterstreichung: aktiv ausgefahren, sonst auf Hover. */
const underline = (active: boolean) =>
  `relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-current ` +
  `after:transition-transform after:duration-300 after:content-[''] ` +
  `hover:after:origin-bottom-left hover:after:scale-x-100 motion-reduce:after:transition-none ` +
  (active
    ? 'after:origin-bottom-left after:scale-x-100'
    : 'after:origin-bottom-right after:scale-x-0')

/**
 * Ist dieser Pfad der aktuelle Bereich? Ein Anker hinter der Route zaehlt
 * nicht mit — /epigenetics#musterbefunde und /epigenetics sind dieselbe Seite.
 */
function isPathActive(route: string | undefined, pathname: string): boolean {
  if (!route) return false
  const clean = route.split('#')[0]
  if (clean === '/') return pathname === '/'
  return pathname === clean || pathname.startsWith(clean + '/')
}

/** Genau die Seite, auf der man steht — Ankereintraege zaehlen nicht. */
function isExactPage(route: string, pathname: string): boolean {
  return !route.includes('#') && pathname === route
}

/** Ein Menuepunkt ist aktiv, wenn er selbst oder eines seiner Ziele aktiv ist. */
function isItemActive(item: NavItem, pathname: string): boolean {
  if (isPathActive(item.route, pathname)) return true
  if (item.children?.some((c) => isPathActive(c.route, pathname))) return true
  // Crosslinks zaehlen BEWUSST nicht: sonst faerbte /epigenetics die
  // Diagnostik aktiv und die eigene Saeule verloere ihre Kennzeichnung.
  return Boolean(item.groups?.some((g) => g.items.some((c) => isPathActive(c.route, pathname))))
}

/** Hat der Punkt ueberhaupt ein Untermenue? */
function hasSubmenu(item: NavItem): boolean {
  return Boolean(item.children || item.groups)
}

const Header = () => {
  const { t } = useTranslation('common')
  const scrollY = useScrollPosition()
  const isScrolled = scrollY > 24

  // Using generic hooks for state
  const mobileMenu = useDisclosure()
  const searchModal = useDisclosure()

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const location = useLocation()

  // Beim Seitenwechsel schliesst das mobile Menue. Das aufgeklappte
  // Untermenue wird hier NICHT mehr zurueckgesetzt: es ist nur innerhalb des
  // geoeffneten Menues ueberhaupt sichtbar, und ein setState im Effekt laeuft
  // eine Runde zu spaet - React raet davon ab. Zurueckgesetzt wird beim
  // Oeffnen, also dort, wo es jemand zu sehen bekommt.
  useEffect(() => {
    mobileMenu.onClose()
  }, [location, mobileMenu.onClose])

  // Escape schliesst das offene Mega-/Untermenue und gibt den Fokus an den
  // ausloesenden Knopf zurueck. Ohne die Rueckgabe landet der Fokus auf
  // <body> und der Nutzer faengt die Navigation von vorn an.
  useEffect(() => {
    if (!openSubmenu) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      const trigger = document.querySelector<HTMLElement>(`[data-submenu-trigger="${openSubmenu}"]`)
      setOpenSubmenu(null)
      trigger?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openSubmenu])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'bg-brand-navy/85 shadow-[0_4px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-container items-center justify-between px-4 py-3 sm:px-6 lg:px-0 lg:py-4">
          {/* min-h-[44px]: Trefferflaeche des Logo-Links auf WCAG-2.5.5-Mindestmass.
              Das Bild bleibt h-10/h-12, nur die Klickflaeche waechst. */}
          <Link
            to="/"
            aria-label={t('logo.alt', 'PolarisDX — POC-Diagnostik für Arztpraxen')}
            className="flex min-h-[44px] shrink-0 items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
          >
            <img
              src={logo} // Always use white logo as background is always dark (either hero or dark header)
              alt={t('logo.alt', 'PolarisDX — POC-Diagnostik für Arztpraxen')}
              width={136}
              height={40}
              className="h-10 w-auto sm:h-12 transition-all duration-300"
            />
            <span className="sr-only">PolarisDX</span>
          </Link>

          {/* Desktop Nav */}
          <nav
            aria-label={t('a11y.main_nav', 'Hauptnavigation')}
            className={`hidden flex-wrap items-center gap-8 text-sm font-medium tracking-wide md:flex xl:gap-8 text-white`}
          >
            {navItems.map((item) => {
              const active = isItemActive(item, location.pathname)
              const exact = isExactPage(item.route, location.pathname)
              const expanded = openSubmenu === item.label
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenSubmenu(item.label)}
                  onMouseLeave={() => item.children && setOpenSubmenu(null)}
                >
                  <div className="flex items-center gap-1">
                    <Link
                      to={item.route}
                      aria-current={exact ? 'page' : active ? 'true' : undefined}
                      className={`${NAV_LINK} ${active ? '' : 'hover:opacity-70'}`}
                    >
                      <span className={underline(active)}>{t(`nav.${item.label}`)}</span>
                    </Link>

                    {/* Der Aufklapper ist ein eigener Knopf, kein Hover-Bereich.
                        Vorher oeffnete das Untermenue ausschliesslich per
                        `group-hover` — mit der Tastatur war es damit nicht zu
                        erreichen, und die Diagnostik-Unterseiten waren aus dem
                        Header heraus nur mit der Maus zugaenglich. Hover
                        funktioniert weiterhin (onMouseEnter oben), ist aber
                        nicht mehr der einzige Weg. */}
                    {hasSubmenu(item) && (
                      <button
                        type="button"
                        aria-expanded={expanded}
                        data-submenu-trigger={item.label}
                        aria-label={t('a11y.toggle_submenu', {
                          name: t(`nav.${item.label}`),
                          defaultValue: `${t(`nav.${item.label}`)} — Untermenü`,
                        })}
                        onClick={() => setOpenSubmenu(expanded ? null : item.label)}
                        className="inline-flex h-11 w-6 items-center justify-center rounded text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </div>

                  {hasSubmenu(item) && expanded && (
                    <div
                      className={`absolute left-1/2 top-full -translate-x-1/2 pt-6 ${
                        item.groups ? 'w-[720px]' : 'min-w-[220px]'
                      }`}
                    >
                      <div className="overflow-hidden rounded-xl border border-white/20 bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl">
                        {item.groups ? (
                          <>
                            <div className="grid grid-cols-3 gap-x-2 divide-x divide-ui-border px-2 py-3">
                              {item.groups.map((group) => (
                                <div key={group.heading} className="px-4">
                                  <p className="t-h6 mb-2 px-2">{t(`nav.${group.heading}`)}</p>
                                  {group.items.map((child) => (
                                    <Link
                                      key={child.label}
                                      to={child.route}
                                      aria-current={
                                        isExactPage(child.route, location.pathname)
                                          ? 'page'
                                          : undefined
                                      }
                                      onClick={() => setOpenSubmenu(null)}
                                      className={`${MENU_LINK} ${
                                        isPathActive(child.route, location.pathname)
                                          ? 'bg-slate-100'
                                          : ''
                                      }`}
                                    >
                                      {t(`nav.${child.label}`)}
                                    </Link>
                                  ))}
                                </div>
                              ))}
                            </div>

                            {/* Bereichsseite und Querverweis stehen UNTER den
                                Spalten und ausserhalb der Gruppen — der
                                Querverweis ist damit sichtbar kein neunter
                                Service und keine Untergruppe (IA §10.4/§10.5). */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ui-border bg-slate-50 px-6 py-3">
                              {item.hubLabel && (
                                <Link
                                  to={item.route}
                                  onClick={() => setOpenSubmenu(null)}
                                  aria-current={
                                    isExactPage(item.route, location.pathname) ? 'page' : undefined
                                  }
                                  className="t-link-cta inline-flex min-h-[44px] items-center gap-1"
                                >
                                  {t(`nav.${item.hubLabel}`)}
                                  <span aria-hidden="true">→</span>
                                </Link>
                              )}
                              {item.crosslinks && (
                                <p className="flex items-center gap-2 text-sm">
                                  <span className="t-caption">{t('nav.group_crosslink')}:</span>
                                  {item.crosslinks.map((cross) => (
                                    <Link
                                      key={cross.label}
                                      to={cross.route}
                                      onClick={() => setOpenSubmenu(null)}
                                      className="rounded-sm font-semibold text-brand-primary underline decoration-from-font underline-offset-2 hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                                    >
                                      {t(`nav.${cross.label}`)}
                                    </Link>
                                  ))}
                                </p>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="py-2">
                            {item.children?.map((child) => (
                              <Link
                                key={child.label}
                                to={child.route}
                                aria-current={
                                  isExactPage(child.route, location.pathname) ? 'page' : undefined
                                }
                                onClick={() => setOpenSubmenu(null)}
                                className={`${MENU_LINK} ${
                                  isPathActive(child.route, location.pathname) ? 'bg-slate-100' : ''
                                }`}
                              >
                                {t(`nav.${child.label}`)}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* Search Trigger Desktop */}
            <button
              onClick={searchModal.onOpen}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 hover:bg-white/10 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep`}
              aria-label={t('a11y.search', 'Suche öffnen')}
            >
              <Search className="h-4 w-4" />
            </button>

            <LanguageSwitcher className="text-white" />

            {/* GENERAL_SALES — der eine allgemeine Anfrageweg (DEC-RL-013).
                Vorher stand hier `nav.contact` ("Kontakt"): eine
                Navigations-Beschriftung, keine Handlungsaufforderung. Der
                CTA-Vertrag verlangt "Angebot anfragen", lokalisiert in allen
                zehn Sprachen. Support, Consumer-Bestellung und die
                Epigenetik-Anfrage sind eigene Wege und bleiben getrennt. */}
            <div className="rounded-full">
              <Button
                to="/contact"
                data-cta-role="GENERAL_SALES"
                variant="secondary"
                className="!bg-accent-strong !text-white !shadow-accent/20 hover:!brightness-110 focus-visible:!ring-accent"
              >
                {t('nav.cta_quote')}
              </Button>
            </div>
          </div>

          {/* Mobile Nav Toggle & Search */}
          <div className="md:hidden flex items-center gap-2">
            {/* Search Trigger Mobile */}
            <button
              onClick={searchModal.onOpen}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep`}
              aria-label={t('a11y.search', 'Suche öffnen')}
            >
              <Search className="h-5 w-5" />
            </button>

            <LanguageSwitcher className="text-white" isMobile />

            <button
              type="button"
              className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep`}
              onClick={() => {
                if (!mobileMenu.isOpen) setOpenSubmenu(null)
                mobileMenu.onToggle()
              }}
              aria-label={t('a11y.toggle_nav', 'Navigation umschalten')}
              aria-expanded={mobileMenu.isOpen}
            >
              <span className="sr-only">{t('a11y.toggle_nav', 'Navigation umschalten')}</span>
              <div className="space-y-1.5">
                <span className={`block h-0.5 w-5 transition-colors duration-300 bg-white`} />
                <span className={`block h-0.5 w-5 transition-colors duration-300 bg-white`} />
                <span className={`block h-0.5 w-5 transition-colors duration-300 bg-white`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu.isOpen && (
          <div
            className={`md:hidden overflow-y-auto max-h-[80vh] backdrop-blur-xl transition-all duration-300 ${
              isScrolled
                ? 'bg-brand-navy/95 border-t border-white/10 shadow-xl'
                : 'bg-brand-navy/95 border-t border-white/10 shadow-xl shadow-black/10'
            }`}
          >
            <div className="mx-auto flex max-w-container flex-col gap-6 px-6 py-8">
              {navItems.map((item) => {
                const expanded = openSubmenu === item.label
                const active = isItemActive(item, location.pathname)
                return (
                  <div
                    key={item.label}
                    className="border-b border-white/5 pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-2">
                      {/* Der Punkt selbst ist IMMER ein Link — auch wenn er
                          Kinder hat. Vorher fuehrte der Elternpunkt mobil nur
                          zum Aufklappen; die Bereichsseite war ein Klick
                          tiefer versteckt. */}
                      <Link
                        to={item.route}
                        aria-current={
                          isExactPage(item.route, location.pathname)
                            ? 'page'
                            : active
                              ? 'true'
                              : undefined
                        }
                        onClick={mobileMenu.onClose}
                        className={`${MOBILE_LINK} flex-1 text-lg`}
                      >
                        {t(`nav.${item.label}`)}
                      </Link>

                      {hasSubmenu(item) && (
                        <button
                          type="button"
                          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
                          onClick={() => setOpenSubmenu(expanded ? null : item.label)}
                          aria-expanded={expanded}
                          data-submenu-trigger={item.label}
                          aria-label={t('a11y.toggle_submenu', {
                            name: t(`nav.${item.label}`),
                            defaultValue: `${t(`nav.${item.label}`)} — Untermenü`,
                          })}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-300 motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                          />
                        </button>
                      )}
                    </div>

                    {/* Mobil wird das Mega-Menue zum Akkordeon: dieselben
                        Gruppen, untereinander statt nebeneinander. Keine
                        Spalten und keine feste Breite — genau daraus entsteht
                        sonst horizontaler Ueberlauf auf schmalen Geraeten. */}
                    {hasSubmenu(item) && expanded && (
                      <div className="mt-3 space-y-3 border-l-2 border-white/20 pl-4">
                        {item.groups?.map((group) => (
                          <div key={group.heading} className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                              {t(`nav.${group.heading}`)}
                            </p>
                            {group.items.map((child) => (
                              <Link
                                key={child.label}
                                to={child.route}
                                aria-current={
                                  isExactPage(child.route, location.pathname) ? 'page' : undefined
                                }
                                className={`${MOBILE_LINK} text-base text-white/70`}
                                onClick={mobileMenu.onClose}
                              >
                                {t(`nav.${child.label}`)}
                              </Link>
                            ))}
                          </div>
                        ))}

                        {item.children?.map((child) => (
                          <Link
                            key={child.label}
                            to={child.route}
                            aria-current={
                              isExactPage(child.route, location.pathname) ? 'page' : undefined
                            }
                            className={`${MOBILE_LINK} text-base text-white/70`}
                            onClick={mobileMenu.onClose}
                          >
                            {t(`nav.${child.label}`)}
                          </Link>
                        ))}

                        {item.hubLabel && (
                          <Link
                            to={item.route}
                            onClick={mobileMenu.onClose}
                            className={`${MOBILE_LINK} text-base font-semibold text-accent-on-dark`}
                          >
                            {t(`nav.${item.hubLabel}`)} <span aria-hidden="true">→</span>
                          </Link>
                        )}

                        {item.crosslinks && (
                          <div className="space-y-1 pt-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                              {t('nav.group_crosslink')}
                            </p>
                            {item.crosslinks.map((cross) => (
                              <Link
                                key={cross.label}
                                to={cross.route}
                                onClick={mobileMenu.onClose}
                                className={`${MOBILE_LINK} text-base text-white/70 underline decoration-from-font underline-offset-2`}
                              >
                                {t(`nav.${cross.label}`)}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="pt-4">
                <Button
                  to="/contact"
                  data-cta-role="GENERAL_SALES"
                  className="w-full justify-center shadow-lg !bg-accent-strong !text-white hover:!brightness-110 focus-visible:!ring-accent"
                  onClick={mobileMenu.onClose}
                  variant="secondary"
                >
                  {t('nav.cta_quote')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchModal.isOpen} onClose={searchModal.onClose} />
    </>
  )
}

export default Header
