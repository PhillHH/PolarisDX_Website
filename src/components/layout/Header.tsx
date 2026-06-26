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

interface NavItem {
  label: string
  route?: string
  children?: { label: string; route: string }[]
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
    children: [
      { label: 'dental', route: '/diagnostics/dental' },
      { label: 'beauty', route: '/diagnostics/beauty' },
      { label: 'longevity', route: '/diagnostics/longevity' },
      { label: 'pocSystems', route: '/diagnostics/poc-systemloesungen' },
    ],
  },
  { label: 'blog', route: '/articles' },
  { label: 'support', route: '/support' },
]

// NEWLOOK: heller Header (§NEWLOOK-HOME §5). Sichtbarer Tastatur-Fokus auf hellem
// Grund = Navy-Ring (§2 WCAG 2.4.7).
const focusRing =
  'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]'

const Header = () => {
  const { t } = useTranslation('common')
  const scrollY = useScrollPosition()
  const isScrolled = scrollY > 24

  const mobileMenu = useDisclosure()
  const searchModal = useDisclosure()

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const location = useLocation()

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
        <div className="mx-auto flex max-w-container items-center justify-between px-4 py-3 sm:px-6 lg:px-0 lg:py-4">
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

          {/* Desktop Nav */}
          <nav className="hidden flex-wrap items-center gap-8 text-sm font-medium md:flex xl:gap-10 text-fg">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.children ? (
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Link
                      to={item.route!}
                      className={`flex items-center gap-1 text-fg transition-colors hover:text-brand-blue ${focusRing}`}
                    >
                      <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-brand-blue after:transition-transform after:duration-300 after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100">
                        {t(`nav.${item.label}`)}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-fg-muted" aria-hidden="true" />
                    </Link>
                    {/* Hover trigger for submenu */}
                    <div className="absolute left-1/2 top-full hidden min-w-[200px] -translate-x-1/2 pt-5 group-hover:block group-focus-within:block">
                      <div className="overflow-hidden rounded-2xl border border-border bg-surface py-2 shadow-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.route}
                            className="flex min-h-[var(--tap-target-min)] items-center px-5 py-2.5 text-sm font-normal text-fg transition-colors hover:bg-bg-subtle hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus-ring)]"
                          >
                            {t(`nav.${child.label}`)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.route!}
                    className={`flex items-center gap-1 text-fg transition-colors hover:text-brand-blue ${focusRing}`}
                  >
                    <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-brand-blue after:transition-transform after:duration-300 after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100">
                      {t(`nav.${item.label}`)}
                    </span>
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
                        <span>{t(`nav.${item.label}`)}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-300 ${openSubmenu === item.label ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {openSubmenu === item.label && (
                        <div className="mt-3 space-y-2 border-l-2 border-border pl-4">
                          <Link
                            to={item.route!}
                            className={`flex min-h-[var(--tap-target-min)] items-center text-base font-normal text-fg-muted ${focusRing}`}
                            onClick={mobileMenu.onClose}
                          >
                            {t(`nav.${item.label}`)}
                          </Link>
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.route}
                              className={`flex min-h-[var(--tap-target-min)] items-center text-base font-normal text-fg-muted ${focusRing}`}
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
                      className={`flex min-h-[var(--tap-target-min)] items-center text-lg font-medium text-fg-heading ${focusRing}`}
                      onClick={mobileMenu.onClose}
                    >
                      {t(`nav.${item.label}`)}
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
