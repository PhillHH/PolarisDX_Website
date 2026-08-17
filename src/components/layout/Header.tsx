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
  /** Zweite Zeile im Dropdown — nur dort gesetzt, wo sie etwas erklaert. */
  description?: string
  /** i18n-Key fuer ein kleines Label, z. B. "Neu". */
  badge?: string
}

/**
 * Gruppe im Dropdown. Wird `groups` gesetzt, rendert das Menue zweispaltig
 * mit Ueberschriften statt als flache Liste.
 *
 * Hintergrund: Das Diagnostik-Menue mischte zwei grundverschiedene
 * Liefermodelle — die Anwendungsbereiche am Igloo-Reader (Geraet in der
 * Praxis) und das Epigenetik-Programm (Laborleistung mit eigenem Probenweg).
 * Die Zweiteilung macht das sichtbar, statt den Laborteil in der POC-Liste
 * zu verstecken.
 */
interface NavGroup {
  /** i18n-Key der Spaltenueberschrift. */
  heading: string
  items: NavChild[]
}

interface NavItem {
  label: string
  route?: string
  children?: NavChild[]
  groups?: NavGroup[]
}

const navItems: NavItem[] = [
  { label: 'home', route: '/' },
  { label: 'events', route: '/events' },
  {
    label: 'about',
    route: '/about',
    children: [{ label: 'terms', route: '/terms' }],
  },
  {
    label: 'service',
    route: '/diagnostics',
    groups: [
      {
        heading: 'group_poc',
        items: [
          { label: 'dental', route: '/diagnostics/dental' },
          { label: 'beauty', route: '/diagnostics/beauty' },
          { label: 'longevity', route: '/diagnostics/longevity' },
          { label: 'pocSystems', route: '/diagnostics/poc-systemloesungen' },
        ],
      },
      {
        heading: 'group_lab',
        items: [
          {
            label: 'epigenetics',
            route: '/epigenetics',
            description: 'epigenetics_desc',
            badge: 'badge_new',
          },
          {
            label: 'musterbefunde',
            route: '/epigenetics#musterbefunde',
            description: 'musterbefunde_desc',
          },
        ],
      },
    ],
  },
  // { label: 'casestudies', route: '/casestudys/32reasons' }, // temporarily disabled
  // { label: 'shop', route: '/shop' }, // Shop disabled
  { label: 'blog', route: '/articles' },
  { label: 'support', route: '/support' },
]

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
  return Boolean(item.groups?.some((g) => g.items.some((c) => isPathActive(c.route, pathname))))
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
          <Link to="/" className="flex min-h-[44px] shrink-0 items-center gap-3">
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
            className={`hidden flex-wrap items-center gap-8 text-sm font-medium tracking-wide md:flex xl:gap-8 text-white`}
          >
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.children || item.groups ? (
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Link
                      to={item.route!}
                      aria-current={
                        item.route && isExactPage(item.route, location.pathname)
                          ? 'page'
                          : isItemActive(item, location.pathname)
                            ? 'true'
                            : undefined
                      }
                      className={`flex items-center gap-1 transition-all duration-300 text-white ${
                        isItemActive(item, location.pathname) ? '' : 'hover:opacity-70'
                      }`}
                    >
                      <span
                        className={`relative after:content-[''] after:absolute after:w-full after:h-px after:bottom-0 after:left-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${
                          isItemActive(item, location.pathname)
                            ? 'after:scale-x-100 after:origin-bottom-left'
                            : 'after:scale-x-0 after:origin-bottom-right'
                        }`}
                      >
                        {t(`nav.${item.label}`)}
                      </span>
                    </Link>
                    {/* Hover trigger for submenu */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-6 hidden group-hover:block ${
                        item.groups ? 'w-[600px]' : 'min-w-[180px]'
                      }`}
                    >
                      <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-xl py-3 border border-white/20 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                        {item.groups ? (
                          <div className="grid grid-cols-2 gap-x-2 divide-x divide-slate-200/70 px-2">
                            {item.groups.map((group) => (
                              <div key={group.heading} className="px-4 py-2">
                                <p className="mb-2 px-2 text-[11px] font-medium text-gray-500">
                                  {t(`nav.${group.heading}`)}
                                </p>
                                {group.items.map((child) => (
                                  <Link
                                    key={child.label}
                                    to={child.route}
                                    aria-current={
                                      isExactPage(child.route, location.pathname)
                                        ? 'page'
                                        : undefined
                                    }
                                    className={`block rounded-lg px-2 py-2 transition-colors hover:bg-slate-100 ${
                                      isPathActive(child.route, location.pathname)
                                        ? 'bg-slate-100'
                                        : ''
                                    }`}
                                  >
                                    <span className="flex items-center gap-2 text-sm font-medium text-heading">
                                      {t(`nav.${child.label}`)}
                                      {child.badge && (
                                        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-strong">
                                          {t(`nav.${child.badge}`)}
                                        </span>
                                      )}
                                    </span>
                                    {child.description && (
                                      <span className="mt-0.5 block text-xs leading-5 text-gray-600">
                                        {t(`nav.${child.description}`)}
                                      </span>
                                    )}
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>
                        ) : (
                          item.children?.map((child) => (
                            <Link
                              key={child.label}
                              to={child.route}
                              className="block px-6 py-3 text-sm text-gray-600 hover:bg-brand-primary/5 hover:text-brand-primary transition-colors font-normal"
                            >
                              {t(`nav.${child.label}`)}
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.route!}
                    aria-current={
                      item.route && isExactPage(item.route, location.pathname) ? 'page' : undefined
                    }
                    className={`flex items-center gap-1 transition-all duration-300 text-white ${
                      isItemActive(item, location.pathname) ? '' : 'hover:opacity-70'
                    }`}
                  >
                    <span
                      className={`relative after:content-[''] after:absolute after:w-full after:h-px after:bottom-0 after:left-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${
                        isItemActive(item, location.pathname)
                          ? 'after:scale-x-100 after:origin-bottom-left'
                          : 'after:scale-x-0 after:origin-bottom-right'
                      }`}
                    >
                      {t(`nav.${item.label}`)}
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* Search Trigger Desktop */}
            <button
              onClick={searchModal.onOpen}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 text-white hover:bg-white/10`}
              aria-label={t('a11y.search', 'Suche öffnen')}
            >
              <Search className="h-4 w-4" />
            </button>

            <LanguageSwitcher className="text-white" />

            <div className="rounded-full">
              <Button
                to="/contact"
                variant="secondary"
                className="!bg-accent-strong !text-white !shadow-accent/20 hover:!brightness-110 focus-visible:!ring-accent"
              >
                {t('nav.contact')}
              </Button>
            </div>
          </div>

          {/* Mobile Nav Toggle & Search */}
          <div className="md:hidden flex items-center gap-2">
            {/* Search Trigger Mobile */}
            <button
              onClick={searchModal.onOpen}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-white`}
              aria-label={t('a11y.search', 'Suche öffnen')}
            >
              <Search className="h-5 w-5" />
            </button>

            <LanguageSwitcher className="text-white" isMobile />

            <button
              type="button"
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 border-white/20 text-white bg-white/5`}
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
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="border-b border-white/5 pb-2 last:border-0 last:pb-0"
                >
                  {item.children || item.groups ? (
                    <div>
                      {/* Ein button, kein div mit onClick: der Aufklapper war
                          mit der Maus bedienbar und mit der Tastatur nicht -
                          das gesamte Untermenue war damit fuer
                          Tastaturnutzer unerreichbar. */}
                      <button
                        type="button"
                        className={`flex min-h-[44px] w-full items-center justify-between text-left text-lg font-normal tracking-wide text-white`}
                        onClick={() =>
                          setOpenSubmenu(openSubmenu === item.label ? null : item.label)
                        }
                        aria-expanded={openSubmenu === item.label}
                      >
                        <span>{t(`nav.${item.label}`)}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${openSubmenu === item.label ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                      {/* Submenu */}
                      {openSubmenu === item.label && (
                        <div className={`pl-4 mt-3 space-y-3 border-l-2 border-white/20`}>
                          <Link
                            to={item.route!}
                            className={`block py-2.5 text-base font-normal text-white/70`}
                            onClick={mobileMenu.onClose}
                          >
                            {t(`nav.${item.label}`)}
                          </Link>
                          {/* Ueberschrift je Block, damit die Trennung
                              POC / Labor auch mobil sichtbar bleibt. */}
                          {item.groups?.map((group) => (
                            <div key={group.heading} className="space-y-3 pt-1">
                              <p className="text-[11px] font-medium text-white/40">
                                {t(`nav.${group.heading}`)}
                              </p>
                              {group.items.map((child) => (
                                <Link
                                  key={child.label}
                                  to={child.route}
                                  className="flex min-h-[44px] items-center gap-2 text-base font-normal text-white/70"
                                  onClick={mobileMenu.onClose}
                                >
                                  {t(`nav.${child.label}`)}
                                  {child.badge && (
                                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-strong">
                                      {t(`nav.${child.badge}`)}
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          ))}
                          {item.children?.map((child) => (
                            <Link
                              key={child.label}
                              to={child.route}
                              className={`block py-2.5 text-base font-normal text-white/70`}
                              onClick={mobileMenu.onClose}
                            >
                              {t(`nav.${child.label}`)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.route!}
                      className={`block py-2 text-lg font-normal tracking-wide text-white`}
                      onClick={mobileMenu.onClose}
                    >
                      {t(`nav.${item.label}`)}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4">
                <Button
                  to="/contact"
                  className="w-full justify-center shadow-lg !bg-accent-strong !text-white hover:!brightness-110 focus-visible:!ring-accent"
                  onClick={mobileMenu.onClose}
                  variant="secondary"
                >
                  {t('nav.contact')}
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
