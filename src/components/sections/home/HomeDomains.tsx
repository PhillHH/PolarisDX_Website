import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sparkles, Infinity as InfinityIcon, ArrowRight } from 'lucide-react'
import { Tooth } from '../../ui/icons/Tooth'
import SectionIntro from './SectionIntro'

/**
 * HomeDomains — Anwendungsbereiche Dental/Beauty/Longevity (§NEWLOOK-HOME §4.4).
 *
 * Einheitliche, BILD-OBEN-Karten nach Philips-Vorbild: großes Dokumentarfoto je
 * Fachgebiet, darüber ein ruhiges Icon-Tile, darunter Titel/Text/Link. 2/3-Spalten-
 * Grid, dünne 1px-Ränder. Inhalt aus `services.*`.
 *
 * Die Fotos sind lizenzfreie Stock-Bilder (Unsplash) — ASSUMPTION: needs owned
 * photography. Geräte-/Personen-Slots der Seite nutzen bereits EIGENE Assets.
 */
const STOCK = '?w=1200&q=80&auto=format&fit=crop'

const HomeDomains = () => {
  const { t } = useTranslation('home')

  const iconClass = 'h-6 w-6'
  const domains = [
    {
      id: 'dental',
      to: '/diagnostics/dental',
      icon: <Tooth className={iconClass} strokeWidth={1.5} aria-hidden="true" />,
      image: `https://images.unsplash.com/photo-1581595219315-a187dd40c322${STOCK}`,
      imageAlt: 'Zahnärztliche Behandlung in einer modernen Praxis',
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
      image: `https://images.unsplash.com/photo-1559757148-5c350d0d3c56${STOCK}`,
      imageAlt: 'Ästhetische Beratung im Beauty- und Anti-Aging-Bereich',
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
      image: `https://images.unsplash.com/photo-1530026405186-ed1f139313f8${STOCK}`,
      imageAlt: 'Aktiver, gesunder Lebensstil als Sinnbild für Longevity',
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
          {domains.map(({ id, to, icon, image, imageAlt, title, description }) => (
            <Link
              key={id}
              to={to}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-1 transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus-ring)]"
            >
              {/* Bild oben */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg-subtle">
                <img
                  src={image}
                  alt={imageAlt}
                  width={1200}
                  height={750}
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-brand-navy/20 to-transparent"
                />
                <span className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface/95 text-brand-blue shadow-1 backdrop-blur">
                  {icon}
                </span>
              </div>

              {/* Inhalt */}
              <div className="flex flex-1 flex-col p-7">
                <h3 className="text-xl font-semibold tracking-tight text-fg-heading">{title}</h3>
                <p className="mt-3 flex-1 text-base leading-relaxed text-fg-muted">{description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
                  {t('common:read_more', 'Mehr erfahren')}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>
              </div>
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
