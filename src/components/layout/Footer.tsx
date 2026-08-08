import { Link } from 'react-router-dom'
// Weisse Variante wie im Header: der Footer ist immer dunkelblau, die dunkle
// Logo-Datei kam dort nur auf 1,53:1 Kontrast — "POLARIS" war unlesbar.
import logo from '../../assets/polaris_white.webp'
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
                <img src={logo} alt="" width={136} height={40} className="h-10 w-auto sm:h-12" />
              </div>
              <p className="max-w-sm text-sm text-white/70">
                {t(
                  'footer.description',
                  'Umfassende Betreuung und Fürsorge. Moderne Gesundheitsdienste für Sie und Ihre Familie, rund um die Uhr.',
                )}
              </p>
              {/* h-11/w-11: 44px Trefferflaeche (WCAG 2.5.5); die Icons bleiben 24px.
                  -ml-2.5 gleicht den neuen Innenabstand des ersten Icons aus, damit
                  die Icon-Reihe buendig unter dem Text startet. */}
              <div className="-ml-2.5 flex gap-1">
                <a
                  href="https://www.linkedin.com/company/polarisdx/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center text-white hover:text-accent-on-dark transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href="https://www.instagram.com/polaris_diagnostix/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center text-white hover:text-accent-on-dark transition-colors"
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
                {/* Ohne space-y: die Zeilenabstaende stecken jetzt im py der Links
                    (44px Trefferflaeche auf Touch, ab lg wieder kompakt). Dadurch
                    liegen die Flaechen luecken- und ueberlappungsfrei aneinander. */}
                <ul className="text-white/70">
                  <li>
                    <Link
                      to="/"
                      className="block py-3 lg:py-1 text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('nav.home')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="block py-3 lg:py-1 text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('nav.about')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/igloo-pro"
                      className="block py-3 lg:py-1 text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      IglooPro
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/articles"
                      className="block py-3 lg:py-1 text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('nav.blog')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/events"
                      className="block py-3 lg:py-1 text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('nav.events', 'Events')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/downloads"
                      className="block py-3 lg:py-1 text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('nav.downloads', 'Downloads')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="block py-3 lg:py-1 text-white/70 transition-colors hover:text-accent-on-dark"
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
                {/* Ohne space-y: die Zeilenabstaende stecken jetzt im py der Links
                    (44px Trefferflaeche auf Touch, ab lg wieder kompakt). Dadurch
                    liegen die Flaechen luecken- und ueberlappungsfrei aneinander. */}
                <ul className="text-white/70">
                  <li>
                    <Link
                      to="/diagnostics"
                      className="block py-3 lg:py-1 text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('footer.allServices', 'Alle Services')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/diagnostics/dental"
                      className="block py-3 lg:py-1 text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      Dental
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/diagnostics/beauty"
                      className="block py-3 lg:py-1 text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      Beauty
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/diagnostics/longevity"
                      className="block py-3 lg:py-1 text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      Longevity
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/diagnostics/poc-systemloesungen"
                      className="block py-3 lg:py-1 text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('footer.pocSystems', 'POC-Systeme')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/diagnostics/praeventions-checks"
                      className="block py-3 lg:py-1 text-white/70 transition-colors hover:text-accent-on-dark"
                    >
                      {t('footer.preventionChecks', 'Präventions-Checks')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/diagnostics/hormon-tests"
                      className="block py-3 lg:py-1 text-white/70 transition-colors hover:text-accent-on-dark"
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
            {/* flex-wrap: die drei Rechtslinks belegen bei 390px zusammen ~356 von
                358 verfuegbaren Pixeln — ohne Umbruchmoeglichkeit reisst die Zeile
                in Sprachen mit laengeren Woertern aus dem Container. */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 md:gap-x-8">
              <Link
                to="/imprint"
                className="inline-flex min-h-[44px] items-center text-white/60 transition-colors hover:text-white"
              >
                {t('footer.imprint', 'Impressum')}
              </Link>
              <Link
                to="/privacy"
                className="inline-flex min-h-[44px] items-center text-white/60 transition-colors hover:text-white"
              >
                {t('footer.privacy', 'Datenschutzerklärung')}
              </Link>
              <Link
                to="/terms"
                className="inline-flex min-h-[44px] items-center text-white/60 transition-colors hover:text-white"
              >
                {t('nav.terms')}
              </Link>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-white/40">
            {t('footer.product_note', 'IglooPro ist ein Produkt der DX365 GmbH')}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
