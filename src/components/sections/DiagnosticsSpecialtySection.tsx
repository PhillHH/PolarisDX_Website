import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Sparkles, Infinity as InfinityIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Tooth } from '../ui/icons/Tooth'
import Eyebrow from '../ui/Eyebrow'

type SpecialtyTone = 'navy' | 'teal'

interface SpecialtyCard {
  key: string
  id: string
  tone: SpecialtyTone
  icon: ReactNode
}

const CARDS: SpecialtyCard[] = [
  { key: 'dental', id: 'dental', tone: 'navy', icon: <Tooth className="h-6 w-6" /> },
  { key: 'beauty', id: 'beauty', tone: 'teal', icon: <Sparkles className="h-6 w-6" /> },
  { key: 'longevity', id: 'longevity', tone: 'navy', icon: <InfinityIcon className="h-6 w-6" /> },
]

const DiagnosticsSpecialtySection = ({
  eyebrow,
  title,
  subtitle,
  sectionClassName,
}: {
  eyebrow?: string
  title?: string
  subtitle?: string
  sectionClassName?: string
} = {}) => {
  const { t } = useTranslation('services')

  return (
    <section className={sectionClassName ?? 'bg-white'}>
      <div className="mx-auto max-w-container px-4 lg:px-0 py-24 lg:py-28">
        <div className="text-center mb-14">
          <Eyebrow>{eyebrow ?? t('overview.specialty.eyebrow', 'IHRE FACHRICHTUNG')}</Eyebrow>
          <h2 className="mt-3 text-3xl lg:text-[42px] font-medium tracking-tight text-heading">
            {title ?? t('overview.specialty.title')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-700">
            {subtitle ?? t('overview.specialty.subtitle')}
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-3">
          {CARDS.map(({ key, id, tone, icon }) => {
            const rawTags = t(`overview.specialty.${key}.tags`, { returnObjects: true })
            const tags = Array.isArray(rawTags) ? rawTags : []
            const isTeal = tone === 'teal'

            return (
              <div
                key={key}
                className={`rounded-2xl p-7 flex flex-col text-white ${
                  isTeal ? 'bg-accent-strong' : 'bg-brand-deep'
                }`}
              >
                <div className="rounded-lg bg-white/10 p-2 w-fit">{icon}</div>
                <h3 className="mt-5 text-xl font-medium">{t(`overview.specialty.${key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white">
                  {t(`overview.specialty.${key}.desc`)}
                </p>
                {tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  to={`/diagnostics/${id}`}
                  className={`mt-6 mt-auto inline-flex items-center gap-1 text-sm font-semibold ${
                    isTeal ? 'text-white hover:underline' : 'text-accent-line hover:text-white'
                  }`}
                >
                  {t(`overview.specialty.${key}.cta`)} {'→'}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default DiagnosticsSpecialtySection
