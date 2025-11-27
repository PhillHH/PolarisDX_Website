import { useLocation } from 'react-router-dom'
import logo from '../../assets/polarisdx_logo.png'
import CtaSection from '../sections/CtaSection'
import { Linkedin, Instagram } from 'lucide-react'

const Footer = () => {
  const location = useLocation()
  const isContactPage = location.pathname === '/contact'

  return (
    <footer className="mt-24 bg-primary text-white lg:mt-32">
      <div className="relative">
        {/* CTA-Karte in Content-Breite, die in den Footer hineinragt */}
        {!isContactPage && (
          <div className="mx-auto max-w-container px-4 lg:px-0">
            <div className="-translate-y-1/2">
              <CtaSection />
            </div>
          </div>
        )}

        {/* Footer-Inhalte, mit zusätzlichem Padding oben für die überlagernde Karte */}
        <div
          className={`mx-auto flex max-w-container flex-col gap-10 px-4 pb-12 lg:flex-row lg:justify-between lg:px-0 lg:pb-16 ${
            isContactPage ? 'pt-12 lg:pt-16' : 'pt-20 lg:pt-24'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="PolarisDX logo"
                className="h-10 w-auto sm:h-12"
              />
            </div>
            <p className="max-w-sm text-sm text-white/70">
              Umfassende Betreuung und Fürsorge. Moderne Gesundheitsdienste für Sie und Ihre Familie, rund um die Uhr.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/polarisdx/"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/polaris_diagnostix/"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
            <p className="text-sm text-white/60">
              Copyright ©PolarisDX 2025 All Rights Reserved.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-8 text-sm lg:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-tight">Links</h3>
              <ul className="space-y-2 text-white/70">
                <li><a href="#hero" className="hover:text-secondary">Startseite</a></li>
                <li><a href="#about" className="hover:text-secondary">Über uns</a></li>
                <li><a href="#services" className="hover:text-secondary">Leistungen</a></li>
                <li><a href="#blog" className="hover:text-secondary">Blog</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-tight">London</h3>
              <div className="space-y-1 text-white/70">
                <p className="font-semibold">PolarisDX LTD</p>
                <p>262A Fulham Road</p>
                <p>London SW10 9EL</p>
                <p>+44 7879 433019</p>
                <p>hello@polarisdx.net</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-tight">Hamburg</h3>
              <div className="space-y-1 text-white/70">
                <p className="font-semibold">PolarisDX Europe UG</p>
                <p>Große Bleichen 1 - 3</p>
                <p>20097 Hamburg</p>
                <p>kontakt@polarisdx.net</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
