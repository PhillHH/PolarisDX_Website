import { Link, useLocation } from 'react-router-dom'
import logo from '../../assets/polarisdx_logo.webp'
import CtaSection from '../sections/CtaSection'
import { Linkedin, Instagram } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const location = useLocation()
  const isContactPage = location.pathname === '/contact'
  const { t } = useTranslation('common')

  return (
    <footer className="mt-24 bg-brand-primary text-white lg:mt-32">
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
          className={`mx-auto flex max-w-container flex-col gap-10 px-4 pb-12 lg:pb-16 ${
            isContactPage ? 'pt-12 lg:pt-16' : 'pt-12 lg:pt-16'
          }`}
        >
          <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="PolarisDX logo"
                  width={136}
                  height={40}
                  className="h-10 w-auto sm:h-12"
                />
              </div>
              <p className="max-w-sm text-sm text-white/70">
                {t('footer.description', 'Umfassende Betreuung und Fürsorge. Moderne Gesundheitsdienste für Sie und Ihre Familie, rund um die Uhr.')}
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.linkedin.com/company/polarisdx/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white hover:text-brand-secondary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href="https://www.instagram.com/polaris_diagnostix/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white hover:text-brand-secondary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-8 text-sm lg:grid-cols-3">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-tight">{t('footer.links', 'Links')}</h3>
                <ul className="space-y-2 text-white/70">
                  <li><Link to="/" className="hover:text-brand-secondary">{t('nav.home')}</Link></li>
                  <li><Link to="/about" className="hover:text-brand-secondary">{t('nav.about')}</Link></li>
                  <li><Link to="/diagnostics" className="hover:text-brand-secondary">{t('nav.service')}</Link></li>
                  <li><Link to="/articles" className="hover:text-brand-secondary">{t('nav.blog')}</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-tight">{t('footer.london', 'London')}</h3>
                <div className="space-y-1 text-white/70">
                  <p className="font-semibold">PolarisDX LTD</p>
                  <p>262A Fulham Road</p>
                  <p>London SW10 9EL</p>
                  <p>+44 7879 433019</p>
                  <p>hello@polarisdx.net</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-tight">{t('footer.hamburg', 'Hamburg')}</h3>
                <div className="space-y-1 text-white/70">
                  <p className="font-semibold">PolarisDX Europe UG</p>
                  <p>Große Bleichen 1 - 3</p>
                  <p>20354 Hamburg</p>
                  <p>contact@polarisdx.net</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-8 flex flex-col items-center gap-4 text-lg text-white/60 md:flex-row md:justify-center md:gap-8">
            <p>{t('footer.copyright', 'Copyright ©PolarisDX 2025 All Rights Reserved.')}</p>
            <div className="flex gap-4 md:gap-8">
              <Link to="/imprint" className="hover:text-white transition-colors">{t('footer.imprint', 'Impressum')}</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacy', 'Datenschutzerklärung')}</Link>
              <Link to="/terms" className="hover:text-white transition-colors">{t('nav.terms')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
