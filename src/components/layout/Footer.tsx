import { Link, useLocation } from 'react-router-dom'
import { Container } from '~/design-system'
import logo from '../../assets/polaris_white.webp'
import CtaSection from '../sections/CtaSection'
import { Linkedin, Instagram } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/**
 * Footer — NEWLOOK premium-dunkler Navy-Anker (§NEWLOOK-HOME §5).
 *
 * Aufgeräumter, dunkler Abschluss gegenüber der hellen Seite: weißes Logo für
 * Kontrast, klare Spalten (Links / Diagnostik / Standorte), Social, feine
 * On-Dark-Divider. Inhalte/Links unverändert. Die generische CTA-Karte wird
 * weiterhin dort eingeblendet, wo kein eigenes Schluss-Band existiert.
 */
const linkClass =
  'rounded-sm text-fg-on-dark/70 transition-colors hover:text-fg-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]'

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
    <footer className="relative mt-24 overflow-hidden bg-gradient-to-br from-brand-navy via-brand-deep to-brand-heading text-fg-on-dark lg:mt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-noise opacity-[0.06] mix-blend-overlay"
      />
      <div className="relative">
        {/* CTA-Karte in Content-Breite, die in den Footer hineinragt */}
        {!hideCtaCard && (
          <Container>
            <div className="-translate-y-1/2">
              <CtaSection />
            </div>
          </Container>
        )}

        <div className="mx-auto flex max-w-container flex-col gap-12 px-4 pb-12 pt-12 lg:pb-16 lg:pt-16">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
            <div className="max-w-sm space-y-5">
              <img
                src={logo}
                alt="PolarisDX — POC-Diagnostik für Arztpraxen"
                width={136}
                height={40}
                className="h-10 w-auto sm:h-11"
              />
              <p className="text-sm leading-relaxed text-fg-on-dark/70">
                {t(
                  'footer.description',
                  'Umfassende Betreuung und Fürsorge. Moderne Gesundheitsdienste für Sie und Ihre Familie, rund um die Uhr.',
                )}
              </p>
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/company/polarisdx/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-fg-on-dark/15 text-fg-on-dark/80 transition-colors hover:border-fg-on-dark/40 hover:text-fg-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/polaris_diagnostix/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-fg-on-dark/15 text-fg-on-dark/80 transition-colors hover:border-fg-on-dark/40 hover:text-fg-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-8 text-sm lg:max-w-2xl lg:grid-cols-4">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-overline text-fg-on-dark/50">
                  {t('footer.links', 'Links')}
                </h3>
                <ul className="space-y-2.5">
                  <li>
                    <Link to="/" className={linkClass}>
                      {t('nav.home')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className={linkClass}>
                      {t('nav.about')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/igloo-pro" className={linkClass}>
                      IglooPro
                    </Link>
                  </li>
                  <li>
                    <Link to="/articles" className={linkClass}>
                      {t('nav.blog')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/events" className={linkClass}>
                      {t('nav.events', 'Events')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/downloads" className={linkClass}>
                      {t('nav.downloads', 'Downloads')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className={linkClass}>
                      {t('nav.contact')}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-overline text-fg-on-dark/50">
                  {t('footer.diagnostics', 'Diagnostik')}
                </h3>
                <ul className="space-y-2.5">
                  <li>
                    <Link to="/diagnostics" className={linkClass}>
                      {t('footer.allServices', 'Alle Services')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/diagnostics/dental" className={linkClass}>
                      Dental
                    </Link>
                  </li>
                  <li>
                    <Link to="/diagnostics/beauty" className={linkClass}>
                      Beauty
                    </Link>
                  </li>
                  <li>
                    <Link to="/diagnostics/longevity" className={linkClass}>
                      Longevity
                    </Link>
                  </li>
                  <li>
                    <Link to="/diagnostics/poc-systemloesungen" className={linkClass}>
                      {t('footer.pocSystems', 'POC-Systeme')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/diagnostics/praeventions-checks" className={linkClass}>
                      {t('footer.preventionChecks', 'Präventions-Checks')}
                    </Link>
                  </li>
                  <li>
                    <Link to="/diagnostics/hormon-tests" className={linkClass}>
                      {t('footer.hormonTests', 'Hormon-Tests')}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-overline text-fg-on-dark/50">
                  {t('footer.london', 'London')}
                </h3>
                <div className="space-y-1 text-fg-on-dark/70">
                  <p className="font-semibold text-fg-on-dark">PolarisDX LTD</p>
                  <p>262A Fulham Road</p>
                  <p>London SW10 9EL</p>
                  <p>+44 7879 433019</p>
                  <p>contact@polarisdx.net</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-overline text-fg-on-dark/50">
                  {t('footer.hamburg', 'Hamburg')}
                </h3>
                <div className="space-y-1 text-fg-on-dark/70">
                  <p className="font-semibold text-fg-on-dark">PolarisDX Europe GmbH</p>
                  <p>Große Bleichen 1 - 3</p>
                  <p>20354 Hamburg</p>
                  <p>contact@polarisdx.net</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 border-t border-fg-on-dark/10 pt-8 text-sm text-fg-on-dark/70 md:flex-row md:justify-between md:gap-8">
            <p>
              {t('footer.copyright', {
                year: new Date().getFullYear(),
                defaultValue: 'Copyright ©PolarisDX {{year}} All Rights Reserved.',
              })}
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <Link to="/imprint" className={linkClass}>
                {t('footer.imprint', 'Impressum')}
              </Link>
              <Link to="/privacy" className={linkClass}>
                {t('footer.privacy', 'Datenschutzerklärung')}
              </Link>
              <Link to="/terms" className={linkClass}>
                {t('nav.terms')}
              </Link>
            </div>
          </div>
          <p className="text-center text-xs text-fg-on-dark/50">
            IglooPro ist ein Produkt der DX365 GmbH
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
