import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PrimaryButton from '../ui/PrimaryButton'
import logo from '../../assets/polaris_white.png'
import scrolledLogo from '../../assets/PolarisDX_Logo_main.png'

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Service', href: '#services' },
  { label: 'Shop', route: '/shop' as const },
  { label: 'Blog', href: '#blog' },
]

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handler = () => {
      setIsScrolled(window.scrollY > 24)
    }
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

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

        <nav
          className={`hidden items-center gap-10 text-sm font-normal tracking-tight lg:flex ${
            isScrolled ? 'text-primary' : 'text-white'
          }`}
        >
          {navItems.map((item) =>
            item.route ? (
              <Link
                key={item.label}
                to={item.route}
                className="flex items-center gap-1 transition-colors hover:text-secondary"
              >
                <span>{item.label}</span>
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1 transition-colors ${
                  item.label === 'Home' ? 'text-secondary' : 'hover:text-secondary'
                }`}
              >
                <span>{item.label}</span>
              </a>
            ),
          )}
        </nav>

        <div className="hidden lg:block">
          <PrimaryButton
            as={Link}
            to="/contact"
            variant={isScrolled ? 'primary' : 'outline-light'}
          >
            Contact Us
          </PrimaryButton>
        </div>

        <button
          type="button"
          className={`flex h-10 w-10 items-center justify-center rounded-full border lg:hidden ${
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

      {isOpen && (
        <div
          className={`lg:hidden ${
            isScrolled
              ? 'bg-white/95 border-t border-gray-200'
              : 'bg-primary/98 border-t border-white/10'
          }`}
        >
          <div className="mx-auto flex max-w-container flex-col gap-4 px-4 py-4">
            {navItems.map((item) =>
              item.route ? (
                <Link
                  key={item.label}
                  to={item.route}
                  className={`text-base font-normal tracking-tight ${
                    isScrolled ? 'text-primary' : 'text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className={`text-base font-normal tracking-tight ${
                    isScrolled ? 'text-primary' : 'text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ),
            )}
            <PrimaryButton
              as={Link}
              to="/contact"
              className="w-full justify-center"
              onClick={() => setIsOpen(false)}
              variant={isScrolled ? 'primary' : 'outline-light'}
            >
              Contact Us
            </PrimaryButton>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header


