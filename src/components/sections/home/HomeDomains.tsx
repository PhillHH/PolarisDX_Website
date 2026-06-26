import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sparkles, Infinity as InfinityIcon, ArrowRight } from 'lucide-react'
import { Tooth } from '../../ui/icons/Tooth'
import SectionIntro from './SectionIntro'

/**
 * HomeDomains — Anwendungsbereiche Dental/Beauty/Longevity (§NEWLOOK-HOME §4.4).
 *
 * Drei große, ruhige Karten (Icon-Tile + Titel + Text + Link) auf hellem Grund.
 * Nimmt die früheren Hero-Slides (Beauty/Longevity) als vollwertige Inhalte auf —
 * Inhalt aus `services.*`, Links in die jeweiligen Diagnostik-Bereiche.
 */
const HomeDomains = () => {
  const { t } = useTranslation('home')

  const iconClass = 'h-7 w-7'
  const domains = [
    {
      id: 'dental',
      to: '/diagnostics/dental',
      icon: <Tooth className={iconClass} strokeWidth={1.5} aria-hidden="true" />,
      title: t('services.dental.title', 'Dental'),
      description: t(
        'services.dental.description',
        'Optimierte Implantologie. Sofortige Analyse von Vitamin D für bessere Wundheilung und Entzündungsmarkern zur Risikominimierung direkt am Behandlungsstuhl.',
      ),
    },
    {
      id: 'beauty',
      to: '/diagnostics/beauty',
      icon: <Sparkles className={iconClass} strokeWidth={1.5} aria-hidden="true" />,
      title: t('services.beauty.title', 'Beauty & Ästhetik'),
      description: t(
        'services.beauty.description',
        'Schönheit von innen. Wissenschaftlich fundierte Ästhetik durch Analyse von Hautgesundheit, Hormonstatus und Mikronährstoffen für sichtbare Ergebnisse.',
      ),
    },
    {
      id: 'longevity',
      to: '/diagnostics/longevity',
      icon: <InfinityIcon className={iconClass} strokeWidth={1.5} aria-hidden="true" />,
      title: t('services.longevity.title', 'Longevity'),
      description: t(
        'services.longevity.description',
        'Proaktives Alternsmanagement. Monitoring essenzieller Biomarker wie HbA1c, Lipide und Entzündungswerte für ein längeres, gesünderes Leben.',
      ),
    },
  ]

  return (
    <section id="domains" className="bg-bg">
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0 lg:py-32">
        <SectionIntro
          align="center"
          eyebrow={t('domains.caption', 'Anwendungsbereiche')}
          title={t('domains.title', 'Point-of-Care-Diagnostik für Ihr Fachgebiet')}
          subtitle={t(
            'domains.subtitle',
            'Ein System, drei Schwerpunkte — laborgenaue Biomarker direkt am Ort der Behandlung.',
          )}
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {domains.map(({ id, to, icon, title, description }) => (
            <Link
              key={id}
              to={to}
              className="group flex flex-col rounded-3xl border border-border bg-surface p-8 shadow-1 transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus-ring)]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy/5 text-brand-blue transition-colors group-hover:bg-brand-navy group-hover:text-fg-on-dark">
                {icon}
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-fg-heading">{title}</h3>
              <p className="mt-3 flex-1 text-base leading-relaxed text-fg-muted">{description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
                {t('common:read_more', 'Mehr erfahren')}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/diagnostics"
            className="inline-flex min-h-[var(--tap-target-min)] items-center gap-2 rounded-md px-2 text-sm font-semibold text-fg-heading transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
          >
            {t('igloo_widget.all_services', 'Alle Diagnostik-Services entdecken')}
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HomeDomains
