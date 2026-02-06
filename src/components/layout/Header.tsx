import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Search } from 'lucide-react'
import PrimaryButton from '../ui/PrimaryButton'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import SearchModal from '../ui/SearchModal'
import logo from '../../assets/polaris_white.webp'
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
    children: [
      { label: 'terms', route: '/terms' }
    ]
  },
  {
    label: 'service',
    route: '/diagnostics',
    children: [
      { label: 'dental', route: '/diagnostics/dental' },
      { label: 'beauty', route: '/diagnostics/beauty' },
      { label: 'longevity', route: '/diagnostics/longevity' },
      { label: 'pocSystems', route: '/diagnostics/poc-systemloesungen' },
    ]
  },
  // { label: 'casestudies', route: '/casestudys/32reasons' }, // temporarily disabled
  // { label: 'shop', route: '/shop' }, // Shop disabled
  { label: 'blog', route: '/articles' },
]

const Header = () => {
  const { t } = useTranslation('common')
  const scrollY = useScrollPosition()
  const isScrolled = scrollY > 24

  // Using generic hooks for state
  const mobileMenu = useDisclosure()
  const searchModal = useDisclosure()

  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    mobileMenu.onClose()
    setOpenSubmenu(null)
  }, [location, mobileMenu.onClose])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'bg-[#083358]/85 shadow-[0_4px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-container items-center justify-between px-4 py-3 sm:px-6 lg:px-0 lg:py-4">
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <img
              src={logo} // Always use white logo as background is always dark (either hero or dark header)
              alt="PolarisDX logo"
              width={136}
              height={40}
              className="h-10 w-auto sm:h-12 transition-all duration-300"
            />
            <span className="sr-only">PolarisDX</span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className={`hidden flex-wrap items-center gap-8 text-sm font-medium tracking-wide md:flex xl:gap-12 text-white`}
          >
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {item.children ? (
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Link
                        to={item.route!}
                        className={`flex items-center gap-1 transition-all duration-300 hover:opacity-70 text-white`}
                      >
                        <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px after:bottom-0 after:left-0 after:bg-current after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                          {t(`nav.${item.label}`)}
                        </span>
                      </Link>
                      {/* Hover trigger for submenu */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-6 hidden group-hover:block min-w-[180px]">
                        <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-xl py-3 border border-white/20 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                            {item.children.map(child => (
                              <Link
                                key={child.label}
                                to={child.route}
                                className="block px-6 py-2.5 text-sm text-gray-600 hover:bg-blue-50/50 hover:text-brand-primary transition-colors font-normal"
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
                    className={`flex items-center gap-1 transition-all duration-300 hover:opacity-70 text-white`}
                  >
                    <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-px after:bottom-0 after:left-0 after:bg-current after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
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
              className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 text-white hover:bg-white/10`}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <LanguageSwitcher className="text-white" />

            <div className={`${isScrolled ? '' : 'shadow-lg shadow-blue-900/20'} rounded-full`}>
                <PrimaryButton
                as={Link}
                to="/contact"
                variant={isScrolled ? 'primary' : 'outline-light'}
                className={isScrolled ? 'shadow-lg shadow-blue-500/25' : 'border-white/40 hover:bg-white/10 hover:border-white'}
                >
                {t('nav.contact')}
                </PrimaryButton>
            </div>
          </div>

          {/* Mobile Nav Toggle & Search */}
          <div className="md:hidden flex items-center gap-2">
            {/* Search Trigger Mobile */}
            <button
              onClick={searchModal.onOpen}
              className={`p-2 mr-1 rounded-full text-white`}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <LanguageSwitcher className="text-white" isMobile />

              <button
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 border-white/20 text-white bg-white/5`}
              onClick={mobileMenu.onToggle}
              aria-label="Toggle navigation"
              aria-expanded={mobileMenu.isOpen}
              >
              <span className="sr-only">Toggle navigation</span>
              <div className="space-y-1.5">
                  <span
                  className={`block h-0.5 w-5 transition-colors duration-300 bg-white`}
                  />
                  <span
                  className={`block h-0.5 w-5 transition-colors duration-300 bg-white`}
                  />
                  <span
                  className={`block h-0.5 w-5 transition-colors duration-300 bg-white`}
                  />
              </div>
              </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu.isOpen && (
          <div
            className={`md:hidden overflow-y-auto max-h-[80vh] backdrop-blur-xl transition-all duration-300 ${
              isScrolled
                ? 'bg-[#083358]/95 border-t border-white/10 shadow-xl'
                : 'bg-[#083358]/95 border-t border-white/10 shadow-xl shadow-black/10'
            }`}
          >
            <div className="mx-auto flex max-w-container flex-col gap-6 px-6 py-8">
              {navItems.map((item) => (
                <div key={item.label} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
                  {item.children ? (
                    <div>
                      <div
                        className={`flex items-center justify-between text-lg font-light tracking-wide cursor-pointer text-white`}
                        onClick={() => setOpenSubmenu(openSubmenu === item.label ? null : item.label)}
                      >
                        <span>{t(`nav.${item.label}`)}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openSubmenu === item.label ? 'rotate-180' : ''}`} />
                      </div>
                      {/* Submenu */}
                      {openSubmenu === item.label && (
                        <div
                          className={`pl-4 mt-3 space-y-3 border-l-2 border-white/20`}
                        >
                            <Link
                              to={item.route!}
                              className={`block text-base font-light text-white/70`}
                              onClick={mobileMenu.onClose}
                            >
                              {t(`nav.${item.label}`)}
                            </Link>
                            {item.children.map(child => (
                              <Link
                                key={child.label}
                                to={child.route}
                                className={`block text-base font-light text-white/70`}
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
                      className={`block text-lg font-light tracking-wide text-white`}
                      onClick={mobileMenu.onClose}
                    >
                        {t(`nav.${item.label}`)}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4">
                <PrimaryButton
                    as={Link}
                    to="/contact"
                    className="w-full justify-center shadow-lg"
                    onClick={mobileMenu.onClose}
                    variant={isScrolled ? 'primary' : 'outline-light'}
                >
                    {t('nav.contact')}
                </PrimaryButton>
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
