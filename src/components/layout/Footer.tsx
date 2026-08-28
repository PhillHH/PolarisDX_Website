import { Link } from 'react-router-dom'
// Weisse Variante wie im Header: der Footer ist immer dunkelblau, die dunkle
// Logo-Datei kam dort nur auf 1,53:1 Kontrast — "POLARIS" war unlesbar.
import logo from '../../assets/polaris_white.webp'
import { Linkedin, Instagram } from 'lucide-react'
import { useTranslation } from 'react-i18next'

/**
 * Footer — der zweite globale Findability-Kanal (IA-INVENTORY §10.7).
 *
 * Er traegt bewusst mehr Breite als der Header. Drei Luecken aus der
 * AP03-Erhebung sind hier geschlossen:
 *
 * 1. `IAD-16` — Epigenetik und Support fehlten **vollstaendig**. Epigenetik ist
 *    eine eigene Geschaeftssaeule (`DEC-RL-005`) und hat jetzt eine eigene
 *    Spalte samt Vertiefungen und Musterbefunden; Support steht bei den
 *    Unternehmenslinks und ist damit nicht mehr hinter Sales versteckt.
 * 2. `IAD-16` — Consumer war in keinem Kanal ausser Direkteinstieg vertreten.
 *    IA §10.8 sieht fuer den Footer `INDIRECT` vor: ein dezenter Produkt-
 *    einstieg, kein Hauptbereich. Genau das ist die letzte Spalte.
 * 3. `IAD-17` — der Footer fuehrte **6 von 9** Services. Eine unvollstaendige
 *    Liste, die wie eine vollstaendige aussieht, ist schlechter als beides:
 *    jetzt stehen alle **neun** darin (IA §10.7 ueberlaesst diese
 *    Umfangsentscheidung ausdruecklich AP06).
 *
 * Ausgeschlossen und per Test abgesichert: kein Chat (`DEC-RL-007`), kein
 * Garantie-/Performance-Band (`DEC-RL-012`), keine Backlog-Bereiche
 * (Deal/Voucher/Case Studies/Shop, `DEC-RL-015`), keine `/services*`-Ziele.
 */

type FooterLink = { label: string; to: string }
type FooterColumn = { heading: string; links: FooterLink[] }

/**
 * Die Spalten. `heading` und `label` sind i18n-Keys im Namespace `common` —
 * im Footer steht kein sichtbarer Text ohne Key.
 */
const COLUMNS: FooterColumn[] = [
  {
    heading: 'footer.col_company',
    links: [
      { label: 'nav.about', to: '/about' },
      { label: 'nav.contact', to: '/contact' },
      { label: 'nav.support', to: '/support' },
      { label: 'nav.events', to: '/events' },
    ],
  },
  {
    heading: 'footer.diagnostics',
    links: [
      { label: 'footer.allServices', to: '/diagnostics' },
      { label: 'nav.dental', to: '/diagnostics/dental' },
      { label: 'nav.beauty', to: '/diagnostics/beauty' },
      { label: 'nav.longevity', to: '/diagnostics/longevity' },
      { label: 'nav.praeventionsChecks', to: '/diagnostics/praeventions-checks' },
      { label: 'nav.infektionEntzuendung', to: '/diagnostics/infektion-entzuendung' },
      { label: 'nav.stoffwechselHerz', to: '/diagnostics/stoffwechsel-herz' },
      { label: 'nav.hormonTests', to: '/diagnostics/hormon-tests' },
      { label: 'nav.pocSystems', to: '/diagnostics/poc-systemloesungen' },
      { label: 'nav.kompatibilitaetIntegration', to: '/diagnostics/kompatibilitaet-integration' },
    ],
  },
  {
    // Eigene Saeule, nicht unter Diagnostik (DEC-RL-005, IA §10.5).
    heading: 'nav.epigenetics',
    links: [
      { label: 'footer.allServices', to: '/epigenetics' },
      { label: 'footer.epi_basics', to: '/epigenetics/grundlagen' },
      { label: 'footer.epi_evidence', to: '/epigenetics/studienlage' },
      { label: 'footer.epi_docs', to: '/epigenetics/unterlagen' },
      { label: 'footer.epi_samples', to: '/epigenetics#musterbefunde' },
    ],
  },
  {
    heading: 'footer.col_product',
    links: [
      { label: 'nav.iglooPro', to: '/igloo-pro' },
      { label: 'nav.blog', to: '/articles' },
      { label: 'nav.downloads', to: '/downloads' },
    ],
  },
]

/**
 * CONSUMER IST HIER BEWUSST NICHT VERLINKT.
 *
 * IA §10.8 sieht fuer den Footer `INDIRECT` vor — ein dezenter Produkteinstieg.
 * PT08.4 hat die Locale-Weiche geschlossen; die Seiten sind ueber Suche und
 * bestehende kontextuelle Einstiege erreichbar. Ein globaler Footer-Einstieg
 * bleibt eine bewusste IA-/Consumer-Journey-Entscheidung spaeterer Owner und
 * wird durch das reine Locale-Routing nicht vorgezogen.
 */

const LEGAL_LINKS: FooterLink[] = [
  { label: 'footer.imprint', to: '/imprint' },
  { label: 'footer.privacy', to: '/privacy' },
  { label: 'nav.terms', to: '/terms' },
]

/** Fusszeilen-Link: 44px Trefferflaeche und sichtbarer Fokusring auf Navy. */
const FOOTER_LINK =
  'inline-flex min-h-[44px] items-center rounded-sm text-white/70 transition-colors ' +
  'hover:text-white motion-reduce:transition-none focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-brand-deep'

const Footer = () => {
  const { t } = useTranslation('common')

  return (
    <footer className="bg-brand-deep text-white">
      <div className="mx-auto flex max-w-container flex-col gap-8 px-4 pb-12 pt-12 lg:pb-16 lg:pt-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="space-y-4">
            <img src={logo} alt="" width={136} height={40} className="h-10 w-auto sm:h-12" />
            <p className="max-w-sm text-sm text-white/70">{t('footer.description')}</p>

            {/* h-11/w-11: 44px Trefferflaeche (WCAG 2.5.5); die Icons bleiben 24px.
                Beide Ziele sind reine <a>-Links auf die Profile — kein
                eingebettetes Widget, kein Drittanbieter-Skript und damit auch
                kein Tracker, der vor dem Consent laedt. */}
            <div className="-ml-2.5 flex gap-1">
              <a
                href="https://www.linkedin.com/company/polarisdx/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex h-11 w-11 items-center justify-center rounded-sm text-white transition-colors hover:text-accent-on-dark motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep`}
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" aria-hidden="true" />
              </a>
              <a
                href="https://www.instagram.com/polaris_diagnostix/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex h-11 w-11 items-center justify-center rounded-sm text-white transition-colors hover:text-accent-on-dark motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep`}
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" aria-hidden="true" />
              </a>
            </div>
          </div>

          <nav
            aria-label={t('footer.nav_label', 'Fußzeilen-Navigation')}
            className="grid flex-1 grid-cols-2 gap-8 text-sm md:grid-cols-3 lg:grid-cols-4"
          >
            {COLUMNS.map((column) => (
              <div key={column.heading} className="space-y-1">
                <h3 className="mb-2 text-sm font-semibold tracking-tight">{t(column.heading)}</h3>
                <ul className="list-none space-y-1 p-0">
                  {column.links.map((link) => (
                    <li key={`${column.heading}-${link.to}`}>
                      <Link to={link.to} className={FOOTER_LINK}>
                        {t(link.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Standorte stehen in der Navigationsflaeche, tragen aber keine
                Links — sie sind Information, kein Ziel. */}
            <div className="space-y-1">
              <h3 className="mb-2 text-sm font-semibold tracking-tight">{t('footer.locations')}</h3>
              <p className="text-sm text-white/70">{t('footer.london')}</p>
              <p className="text-sm text-white/70">{t('footer.hamburg')}</p>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>

          <ul
            aria-label={t('footer.legal', 'Rechtliches')}
            className="flex list-none flex-wrap items-center gap-x-6 gap-y-1 p-0"
          >
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className={FOOTER_LINK}>
                  {t(link.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/40">{t('footer.product_note')}</p>
      </div>
    </footer>
  )
}

export default Footer
