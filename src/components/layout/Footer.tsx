import { Link } from 'react-router-dom'
import logo from '../../assets/polarisdx_logo.webp'
import { Linkedin, Instagram } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation('common')

  return (
    <footer className="bg-brand-deep text-white">
      <div className="relative">
        {/* Footer-Inhalte */}
        <div className="mx-auto flex max-w-container flex-col gap-8 px-4 pb-12 lg:pb-16 pt-12 lg:pt-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="PolarisDX — POC-Diagnostik für Arztpraxen"
                  width={136}
                  height={40}
                  className="h-10 w-auto sm:h-12"
                />
              </div>
              <p className="max-w-sm text-sm text-white/70">
                {t(
                  'footer.description',
                  'Umfassende Betreuung und Fürsorge. Moderne Gesundheitsdienste für Sie und Ihre Familie, rund um die Uhr.',
                )}
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.linkedin.com/company/polarisdx/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white hover:text-accent-on-dark transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href="https://www.instagram.com/polaris_diagnostix/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white hover:text-accent-on-dark transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-8 text-sm lg:grid-cols-4">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-tight">
                  {t('footer.links', 'Links')}
                </h3>
                <ul className="space-y-2 text-white/70">
                  <li>
                    <Link
                      to="/"
                      className="text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('nav.home')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('nav.about')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/igloo-pro"
                      className="text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      IglooPro
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/articles"
                      className="text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('nav.blog')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/events"
                      className="text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('nav.events', 'Events')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/downloads"
                      className="text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('nav.downloads', 'Downloads')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('nav.contact')}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-tight">
                  {t('footer.diagnostics', 'Diagnostik')}
                </h3>
                <ul className="space-y-2 text-white/70">
                  <li>
                    <Link
                      to="/diagnostics"
                      className="text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('footer.allServices', 'Alle Services')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/diagnostics/dental"
                      className="text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      Dental
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/diagnostics/beauty"
                      className="text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      Beauty
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/diagnostics/longevity"
                      className="text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      Longevity
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/diagnostics/poc-systemloesungen"
                      className="text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('footer.pocSystems', 'POC-Systeme')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/diagnostics/praeventions-checks"
                      className="text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('footer.preventionChecks', 'Präventions-Checks')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/diagnostics/hormon-tests"
                      className="text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('footer.hormonTests', 'Hormon-Tests')}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-tight">
                  {t('footer.london', 'London')}
                </h3>
                <div className="space-y-1 text-white/70">
                  <p className="font-semibold">PolarisDX LTD</p>
                  <p>262A Fulham Road</p>
                  <p>London SW10 9EL</p>
                  <p>+44 7879 433019</p>
                  <p>contact@polarisdx.net</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-tight">
                  {t('footer.hamburg', 'Hamburg')}
                </h3>
                <div className="space-y-1 text-white/70">
                  <p className="font-semibold">PolarisDX Europe GmbH</p>
                  <p>Große Bleichen 1 - 3</p>
                  <p>20354 Hamburg</p>
                  <p>contact@polarisdx.net</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-8 flex flex-col items-center gap-4 text-lg text-white/60 md:flex-row md:justify-center md:gap-8">
            <p>
              {t('footer.copyright', {
                year: new Date().getFullYear(),
                defaultValue: 'Copyright ©PolarisDX {{year}} All Rights Reserved.',
              })}
            </p>
            <div className="flex gap-4 md:gap-8">
              <Link to="/imprint" className="text-white/60 transition-colors hover:text-white">
                {t('footer.imprint', 'Impressum')}
              </Link>
              <Link to="/privacy" className="text-white/60 transition-colors hover:text-white">
                {t('footer.privacy', 'Datenschutzerklärung')}
              </Link>
              <Link to="/terms" className="text-white/60 transition-colors hover:text-white">
                {t('nav.terms')}
              </Link>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-white/40">
            IglooPro ist ein Produkt der DX365 GmbH
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
