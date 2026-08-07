import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sparkles, Infinity as InfinityIcon } from 'lucide-react'
import { Tooth } from '../ui/icons/Tooth'

/**
 * IglooWidgetSection — Segment-Auswahl der Fachrichtung.
 * Saubere 3-Karten-Reihe (Pattern wie WhyPocSection): zentrierter Kopf +
 * grid md:grid-cols-3 mit gleich hohen, flachen Karten (Teal-Icon-Badge,
 * Navy-Titel, Nutzen-Text, Biomarker-Zeile, Teal-Link).
 * i18n-Namespace 'home'. SSR-sicher (kein window/localStorage).
 */
type Segment = {
  id: 'dental' | 'beauty' | 'longevity'
  icon: ReactNode
  title: string
  benefit: string
  bio: string
  cta: string
}

const IglooWidgetSection = () => {
  const { t } = useTranslation('home')

  const segments: Segment[] = [
    {
      id: 'dental',
      icon: <Tooth className="h-6 w-6" />,
      title: t('segments.dental.title', 'Zahnarztpraxis'),
      benefit: t(
        'segments.dental.benefit',
        'Entzündung, Vitalstatus und Stoffwechsel direkt am Behandlungsstuhl bewerten — und die Therapie im selben Termin begründen.',
      ),
      bio: t('segments.dental.bio', 'Vitamin D · CRP · HbA1c'),
      cta: t('segments.dental.cta', 'Dental-Diagnostik ansehen'),
    },
    {
      id: 'beauty',
      icon: <Sparkles className="h-6 w-6" />,
      title: t('segments.beauty.title', 'Ästhetik & Beauty'),
      benefit: t(
        'segments.beauty.benefit',
        'Hormon- und Nährstoffstatus als Grundlage für Haut-, Haar- und Anti-Aging-Behandlungen — messbar statt geschätzt.',
      ),
      bio: t('segments.beauty.bio', 'Hormone · Mikronährstoffe'),
      cta: t('segments.beauty.cta', 'Beauty-Diagnostik ansehen'),
    },
    {
      id: 'longevity',
      icon: <InfinityIcon className="h-6 w-6" />,
      title: t('segments.longevity.title', 'Longevity & Prävention'),
      benefit: t(
        'segments.longevity.benefit',
        'Stoffwechsel-, Herz-Kreislauf- und Risikomarker für datenbasierte Präventions- und Longevity-Programme.',
      ),
      bio: t('segments.longevity.bio', 'HbA1c · Lipide · D-Dimer'),
      cta: t('segments.longevity.cta', 'Longevity-Diagnostik ansehen'),
    },
  ]

  return (
    <section id="fachrichtung" className="bg-slate-50">
      <div className="mx-auto max-w-container px-4 lg:px-0 py-24 lg:py-24">
        {/* Kopf */}
        <div className="mx-auto max-w-2xl text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
            {t('igloo_widget.eyebrow', 'Ihre Fachrichtung')}
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-heading sm:text-4xl lg:text-[42px]">
            {t('igloo_widget.title', 'Welche Praxis führen Sie?')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-700">
            {t(
              'igloo_widget.subtitle',
              'Wählen Sie Ihren Bereich — wir zeigen die passenden Biomarker-Panels und Anwendungen für Ihre Fachrichtung.',
            )}
          </p>
        </div>

        {/* Karten */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-7"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                {segment.icon}
              </span>
              <h3 className="mt-5 text-lg font-medium text-heading">{segment.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{segment.benefit}</p>
              <p className="mt-4 text-sm font-medium text-gray-700">{segment.bio}</p>
              <Link
                to={`/diagnostics/${segment.id}`}
                className="mt-6 inline-flex items-center gap-1 self-start text-sm font-semibold text-accent hover:text-accent-strong"
              >
                {segment.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Hilfeband */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-accent-strong p-7 text-white md:flex-row md:items-center md:justify-between lg:p-7">
          <div>
            <p className="font-medium">
              {t('igloo_widget.help_title', 'Nicht sicher, welches Panel zu Ihrer Praxis passt?')}
            </p>
            <p className="text-sm text-white">
              {t(
                'igloo_widget.help_text',
                '15 Minuten mit einem POC-Spezialisten – eine konkrete Empfehlung für Ihre Fachrichtung, keine Verkaufsshow.',
              )}
            </p>
          </div>
          <Link
            to="/contact"
            className="whitespace-nowrap rounded-md bg-white px-5 py-3 font-medium text-brand-deep transition hover:bg-white/90"
          >
            {t('igloo_widget.help_cta', 'Beratung buchen')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default IglooWidgetSection
