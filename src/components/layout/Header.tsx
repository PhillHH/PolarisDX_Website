import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Search } from 'lucide-react'
import { Button } from '~/design-system'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import SearchModal from '../ui/SearchModal'
import logo from '../../assets/polarisdx_logo.webp'
import { useDisclosure } from '../../hooks/useDisclosure'
import { useScrollPosition } from '../../hooks/useScrollPosition'

interface NavChild {
  label: string
  route: string
  /** Optionaler Default-Text, wenn der Locale-Key (noch) fehlt. */
  fallback?: string
}

interface NavItem {
  label: string
  fallback?: string
  route?: string
  /** Untertitel des Segments im Dropdown-Kopf (Philips-Zielgruppen-Logik). */
  caption?: string
  children?: NavChild[]
}

// NEWLOOK §5: Nav NACH ZIELGRUPPE gegliedert (Philips-Segment-Logik) — zwei klare
// Stränge „Für Praxen & Fachkreise" (B2B) vs „Privatkunden" (Consumer). Routen
// sind real (siehe App.tsx); Consumer-Strang führt auf die /consumer/*-Pages.
const navItems: NavItem[] = [
  {
    label: 'forProfessionals',
    fallback: 'Für Praxen & Fachkreise',
    caption: 'B2B · Diagnostik & System',
    children: [
      { label: 'service', route: '/diagnostics', fallback: 'Diagnostik – Überblick' },
      { label: 'dental', route: '/diagnostics/dental', fallback: 'Dental-Diagnostik' },
      { label: 'beauty', route: '/diagnostics/beauty', fallback: 'Beauty-Diagnostik' },
      { label: 'longevity', route: '/diagnostics/longevity', fallback: 'Longevity-Diagnostik' },
      { label: 'pocSystems', route: '/diagnostics/poc-systemloesungen', fallback: 'POC-Systemlösungen' },
      { label: 'igloo', route: '/igloo-pro', fallback: 'IglooPro System' },
      { label: 'about', route: '/about', fallback: 'Über uns' },
      { label: 'support', route: '/support', fallback: 'Support' },
    ],
  },
  {
    label: 'forConsumers',
    fallback: 'Privatkunden',
    caption: 'Produkte für zuhause',
    children: [
      { label: 'consumerSpray', route: '/consumer/vitamin-d3-spray', fallback: 'Vitamin-D3-Spray' },
      { label: 'consumerMasks', route: '/consumer/hydrating-masks', fallback: 'Hydrating Masks' },
      { label: 'consumerDuo', route: '/consumer/inside-out-duo', fallback: 'Inside-Out Duo' },
    ],
  },
  { label: 'blog', route: '/articles' },
  { label: 'events', route: '/events' },
]

// NEWLOOK: heller Header (§NEWLOOK-HOME §5). Sichtbarer Tastatur-Fokus auf hellem
// Grund = Navy-Ring (§2 WCAG 2.4.7).
const focusRing =
  'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]'

const linkUnderline =
  "relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-brand-blue after:transition-transform after:duration-300 after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100"

const Header = () => {
  const { t } = useTranslation('common')
  const scrollY = useScrollPosition()
  const isScrolled = scrollY > 24

  const mobileMenu = useDisclosure()
  const searchModal = useDisclosure()

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const location = useLocation()

  // Label-Helfer: Locale-Key mit robustem Fallback (manche Segment-Labels sind neu).
  const label = (key: string, fallback?: string) => t(`nav.${key}`, fallback ?? key)

  // Close mobile menu on route change
  useEffect(() => {
    mobileMenu.onClose()
    setOpenSubmenu(null)
  }, [location, mobileMenu.onClose])

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!mobileMenu.isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') mobileMenu.onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileMenu.isOpen, mobileMenu.onClose])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 border-b transition-all duration-300 ${
          isScrolled
            ? 'border-border bg-surface/90 shadow-1 backdrop-blur-xl'
            : 'border-transparent bg-surface/80 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex max-w-container items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-0 lg:py-4">
          <Link to="/" className={`flex shrink-0 items-center gap-3 ${focusRing}`}>
            <img
              src={logo}
              alt="PolarisDX — POC-Diagnostik für Arztpraxen"
              width={136}
              height={40}
              className="h-9 w-auto sm:h-10"
            />
            <span className="sr-only">PolarisDX</span>
          </Link>

          {/* Desktop Nav — zwei Zielgruppen-Stränge + flache Einträge */}
          <nav className="hidden flex-wrap items-center gap-7 text-sm font-medium md:flex lg:gap-9 text-fg">
            {navItems.map((item) => (
              <div key={item.label} className="group relative">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      aria-haspopup="true"
                      className={`flex items-center gap-1 text-fg transition-colors hover:text-brand-blue group-focus-within:text-brand-blue ${focusRing}`}
                    >
                      <span className={linkUnderline}>{label(item.label, item.fallback)}</span>
                      <ChevronDown
                        className="h-3.5 w-3.5 text-fg-muted transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                        aria-hidden="true"
                      />
                    </button>
                    {/* Dropdown (hell, Surface) — sichtbar via hover/focus-within */}
                    <div className="invisible absolute left-1/2 top-full z-10 min-w-[260px] -translate-x-1/2 pt-5 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <div className="overflow-hidden rounded-2xl border border-border bg-surface py-3 shadow-2">
                        {item.caption && (
                          <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-overline text-brand-blue-bright">
                            {item.caption}
                          </p>
                        )}
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.route}
                            className="flex min-h-[var(--tap-target-min)] items-center px-5 py-2 text-sm font-normal text-fg transition-colors hover:bg-bg-subtle hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus-ring)]"
                          >
                            {label(child.label, child.fallback)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.route!}
                    className={`flex items-center text-fg transition-colors hover:text-brand-blue ${focusRing}`}
                  >
                    <span className={linkUnderline}>{label(item.label, item.fallback)}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex lg:gap-4">
            {/* Search Trigger Desktop */}
            <button
              onClick={searchModal.onOpen}
              className={`flex h-[var(--tap-target-min)] w-[var(--tap-target-min)] items-center justify-center rounded-full text-fg transition-colors hover:bg-bg-subtle ${focusRing}`}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <LanguageSwitcher className="text-fg" />

            <Button to="/contact" variant="primary" size="sm">
              {t('nav.contact')}
            </Button>
          </div>

          {/* Mobile Nav Toggle & Search */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Search Trigger Mobile */}
            <button
              onClick={searchModal.onOpen}
              className={`flex h-[var(--tap-target-min)] w-[var(--tap-target-min)] items-center justify-center rounded-full text-fg ${focusRing}`}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <LanguageSwitcher className="text-fg" isMobile />

            <button
              type="button"
              className={`flex h-[var(--tap-target-min)] w-[var(--tap-target-min)] items-center justify-center rounded-full border border-border bg-bg-subtle text-fg ${focusRing}`}
              onClick={mobileMenu.onToggle}
              aria-label="Toggle navigation"
              aria-expanded={mobileMenu.isOpen}
            >
              <span className="sr-only">Toggle navigation</span>
              <div className="space-y-1.5">
                <span className="block h-0.5 w-5 bg-fg" />
                <span className="block h-0.5 w-5 bg-fg" />
                <span className="block h-0.5 w-5 bg-fg" />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu.isOpen && (
          <div className="max-h-[80vh] overflow-y-auto border-t border-border bg-surface/95 shadow-2 backdrop-blur-xl md:hidden">
            <div className="mx-auto flex max-w-container flex-col gap-5 px-6 py-8">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  {item.children ? (
                    <div>
                      <button
                        type="button"
                        aria-expanded={openSubmenu === item.label}
                        className={`flex w-full min-h-[var(--tap-target-min)] items-center justify-between text-left text-lg font-medium text-fg-heading ${focusRing}`}
                        onClick={() =>
                          setOpenSubmenu(openSubmenu === item.label ? null : item.label)
                        }
                      >
                        <span>{label(item.label, item.fallback)}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${openSubmenu === item.label ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {openSubmenu === item.label && (
                        <div className="mt-3 space-y-2 border-l-2 border-border pl-4">
                          {item.caption && (
                            <p className="text-xs font-semibold uppercase tracking-overline text-brand-blue-bright">
                              {item.caption}
                            </p>
                          )}
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.route}
                              className={`flex min-h-[var(--tap-target-min)] items-center text-base font-normal text-fg-muted ${focusRing}`}
                              onClick={mobileMenu.onClose}
                            >
                              {label(child.label, child.fallback)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.route!}
                      className={`flex min-h-[var(--tap-target-min)] items-center text-lg font-medium text-fg-heading ${focusRing}`}
                      onClick={mobileMenu.onClose}
                    >
                      {label(item.label, item.fallback)}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-2">
                <Button
                  to="/contact"
                  variant="primary"
                  className="w-full justify-center"
                  onClick={mobileMenu.onClose}
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
