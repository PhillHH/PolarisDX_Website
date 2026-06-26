import { Link, useLocation } from 'react-router-dom'
import { Container } from '~/design-system'
import logo from '../../assets/polarisdx_logo.webp'
import CtaSection from '../sections/CtaSection'
import { Linkedin, Instagram } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const location = useLocation()
  // CtaSection is the generic B2B "contact us" card. Hide it where a second dark
  // band would stack up (§Konzept 5 „ein dunkles Schluss-Band pro Seite", [FRO]):
  // on contact/support (self-referential), the unlisted /consumer/* landing pages
  // (own product FinalCTA), and on pages that already render their own page-level
  // dark closing band (Home → FinalCtaSection, /igloo-pro → CtaBand,
  // /s3_leitlinie → eigener Navy-Gradient-Abschluss-CTA).
  const hideCtaCard =
    location.pathname === '/contact' ||
    location.pathname === '/support' ||
    location.pathname === '/' ||
    location.pathname === '/igloo-pro' ||
    location.pathname === '/s3_leitlinie' ||
    location.pathname.startsWith('/consumer/')
  const { t } = useTranslation('common')

  return (
    <footer className="mt-24 bg-brand-primary text-fg-on-dark lg:mt-32">
      <div className="relative">
        {/* CTA-Karte in Content-Breite, die in den Footer hineinragt */}
        {!hideCtaCard && (
          <Container>
            <div className="-translate-y-1/2">
              <CtaSection />
            </div>
          </Container>
        )}

        {/* Footer-Inhalte, mit zusätzlichem Padding oben für die überlagernde Karte */}
        <div
          className="mx-auto flex max-w-container flex-col gap-10 px-4 pb-12 pt-12 lg:pb-16 lg:pt-16"
        >
          <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
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
              <p className="max-w-sm text-sm text-fg-on-dark/70">
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
                  className="rounded-sm text-fg-on-dark hover:text-brand-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href="https://www.instagram.com/polaris_diagnostix/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-sm text-fg-on-dark hover:text-brand-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]"
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
                <ul className="space-y-2 text-fg-on-dark/70">
                  <li>
                    <Link to="/" className="rounded-sm transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
                      {t('nav.home')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="rounded-sm transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
                      {t('nav.about')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/igloo-pro" className="rounded-sm transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
                      IglooPro
                    </Link>
                  </li>
                  <li>
                    <Link to="/articles" className="rounded-sm transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
                      {t('nav.blog')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/events" className="rounded-sm transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
                      {t('nav.events', 'Events')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/downloads" className="rounded-sm transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
                      {t('nav.downloads', 'Downloads')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="rounded-sm transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
                      {t('nav.contact')}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-tight">
                  {t('footer.diagnostics', 'Diagnostik')}
                </h3>
                <ul className="space-y-2 text-fg-on-dark/70">
                  <li>
                    <Link to="/diagnostics" className="rounded-sm transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
                      {t('footer.allServices', 'Alle Services')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/diagnostics/dental" className="rounded-sm transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
                      Dental
                    </Link>
                  </li>
                  <li>
                    <Link to="/diagnostics/beauty" className="rounded-sm transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
                      Beauty
                    </Link>
                  </li>
                  <li>
                    <Link to="/diagnostics/longevity" className="rounded-sm transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
                      Longevity
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/diagnostics/poc-systemloesungen"
                      className="rounded-sm transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]"
                    >
                      {t('footer.pocSystems', 'POC-Systeme')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/diagnostics/praeventions-checks"
                      className="rounded-sm transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]"
                    >
                      {t('footer.preventionChecks', 'Präventions-Checks')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/diagnostics/hormon-tests" className="rounded-sm transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
                      {t('footer.hormonTests', 'Hormon-Tests')}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-tight">
                  {t('footer.london', 'London')}
                </h3>
                <div className="space-y-1 text-fg-on-dark/70">
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
                <div className="space-y-1 text-fg-on-dark/70">
                  <p className="font-semibold">PolarisDX Europe GmbH</p>
                  <p>Große Bleichen 1 - 3</p>
                  <p>20354 Hamburg</p>
                  <p>contact@polarisdx.net</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-fg-on-dark/10 pt-8 flex flex-col items-center gap-4 text-lg text-fg-on-dark/80 md:flex-row md:justify-center md:gap-8">
            <p>
              {t('footer.copyright', {
                year: new Date().getFullYear(),
                defaultValue: 'Copyright ©PolarisDX {{year}} All Rights Reserved.',
              })}
            </p>
            <div className="flex gap-4 md:gap-8">
              <Link to="/imprint" className="rounded-sm hover:text-fg-on-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
                {t('footer.imprint', 'Impressum')}
              </Link>
              <Link to="/privacy" className="rounded-sm hover:text-fg-on-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
                {t('footer.privacy', 'Datenschutzerklärung')}
              </Link>
              <Link to="/terms" className="rounded-sm hover:text-fg-on-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
                {t('nav.terms')}
              </Link>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-fg-on-dark/80">
            IglooPro ist ein Produkt der DX365 GmbH
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
