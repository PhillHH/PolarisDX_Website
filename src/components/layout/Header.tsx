import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import PrimaryButton from '../ui/PrimaryButton'
import LanguageSwitcher from '../ui/LanguageSwitcher'
import logo from '../../assets/polaris_white.png'
import scrolledLogo from '../../assets/PolarisDX_Logo_main.png'

interface NavItem {
  label: string
  route?: string
  children?: { label: string; route: string }[]
}

const navItems: NavItem[] = [
  { label: 'home', route: '/' },
  {
    label: 'about',
    route: '/about',
    children: [
      { label: 'terms', route: '/terms' }
    ]
  },
  { label: 'service', route: '/services' },
  // { label: 'shop', route: '/shop' }, // Shop disabled
  { label: 'blog', route: '/articles' },
]

const Header = () => {
  const { t } = useTranslation('common')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    const handler = () => {
      setIsScrolled(window.scrollY > 24)
    }
    // Check initial scroll position
    handler()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
    setOpenSubmenu(null)
  }, [location])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-all ${
        isScrolled ? 'bg-white/95 shadow-lg backdrop-blur' : 'bg-primary'
      }`}
    >
      <div className="mx-auto flex max-w-container items-center justify-between px-4 py-4 lg:px-0">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={isScrolled ? scrolledLogo : logo}
            alt="PolarisDX logo"
            className="h-10 w-auto sm:h-12"
          />
          <span className="sr-only">PolarisDX</span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className={`hidden items-center gap-10 text-sm font-normal tracking-tight lg:flex ${
            isScrolled ? 'text-primary' : 'text-white'
          }`}
        >
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              {item.children ? (
                 <div className="flex items-center gap-1">
                   <Link
                      to={item.route!}
                      className={`flex items-center gap-1 transition-colors hover:text-secondary ${
                        isScrolled ? 'text-primary' : 'text-white'
                      }`}
                    >
                      <span>{t(`nav.${item.label}`)}</span>
                    </Link>
                    {/* Hover trigger for submenu */}
                    <div className="absolute top-full left-0 pt-4 hidden group-hover:block min-w-[150px]">
                      <div className="bg-white shadow-lg rounded-lg py-2 border border-gray-100 overflow-hidden">
                          {item.children.map(child => (
                             <Link
                               key={child.label}
                               to={child.route}
                               className="block px-4 py-2 text-primary hover:bg-gray-50 hover:text-secondary transition-colors"
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
                  className={`flex items-center gap-1 transition-colors hover:text-secondary ${
                    isScrolled ? 'text-primary' : 'text-white'
                  }`}
                >
                  <span>{t(`nav.${item.label}`)}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher className={isScrolled ? 'text-primary' : 'text-white'} />
          <PrimaryButton
            as={Link}
            to="/contact"
            variant={isScrolled ? 'primary' : 'outline-light'}
          >
             {t('nav.contact')}
          </PrimaryButton>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="lg:hidden flex items-center gap-2">
           <LanguageSwitcher className={isScrolled ? 'text-primary' : 'text-white'} isMobile />

            <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                isScrolled
                ? 'border-primary/20 text-primary'
                : 'border-white/20 text-white'
            }`}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            >
            <span className="sr-only">Toggle navigation</span>
            <div className="space-y-1.5">
                <span
                className={`block h-0.5 w-5 ${
                    isScrolled ? 'bg-primary' : 'bg-white'
                }`}
                />
                <span
                className={`block h-0.5 w-5 ${
                    isScrolled ? 'bg-primary' : 'bg-white'
                }`}
                />
                <span
                className={`block h-0.5 w-5 ${
                    isScrolled ? 'bg-primary' : 'bg-white'
                }`}
                />
            </div>
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`lg:hidden overflow-y-auto max-h-[80vh] ${
            isScrolled
              ? 'bg-white/95 border-t border-gray-200'
              : 'bg-primary/98 border-t border-white/10'
          }`}
        >
          <div className="mx-auto flex max-w-container flex-col gap-4 px-4 py-4">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div>
                    <div
                      className={`flex items-center justify-between text-base font-normal tracking-tight cursor-pointer ${
                        isScrolled ? 'text-primary' : 'text-white'
                      }`}
                      onClick={() => setOpenSubmenu(openSubmenu === item.label ? null : item.label)}
                    >
                      <span>{t(`nav.${item.label}`)}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${openSubmenu === item.label ? 'rotate-180' : ''}`} />
                    </div>
                    {/* Submenu */}
                    {openSubmenu === item.label && (
                      <div className="pl-4 mt-2 space-y-2 border-l border-white/20">
                         {/* Include parent link as well in mobile menu? Usually yes or just rely on the main item.
                             The user said "Link under über uns". So 'About' is clickable, 'AGB' is under it.
                             In mobile, usually top item is toggle.
                             I will add the parent link as a sub-item for clarity if the top is just a toggle,
                             BUT here I made the top item a toggle.
                             To keep 'About' accessible, I should add it to the submenu or make the text clickable and the arrow toggle.
                             Let's make it simple: Text links to page, Arrow toggles menu.
                          */}
                          <Link
                            to={item.route!}
                            className={`block text-sm ${isScrolled ? 'text-primary/80' : 'text-white/80'}`}
                            onClick={() => setIsOpen(false)}
                          >
                             {t(`nav.${item.label}`)}
                          </Link>
                          {item.children.map(child => (
                            <Link
                               key={child.label}
                               to={child.route}
                               className={`block text-sm ${isScrolled ? 'text-primary/80' : 'text-white/80'}`}
                               onClick={() => setIsOpen(false)}
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
                    className={`text-base font-normal tracking-tight ${
                      isScrolled ? 'text-primary' : 'text-white'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                      {t(`nav.${item.label}`)}
                  </Link>
                )}
              </div>
            ))}
            <PrimaryButton
              as={Link}
              to="/contact"
              className="w-full justify-center"
              onClick={() => setIsOpen(false)}
              variant={isScrolled ? 'primary' : 'outline-light'}
            >
               {t('nav.contact')}
            </PrimaryButton>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
