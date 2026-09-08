import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { DiagnosticsHubService } from '../../data/diagnosticsHub'
import { Card } from '../ui/Card'

const priorityStyles = {
  PRIMARY: {
    card: 'border-t-accent hover:border-accent/60 hover:shadow-card',
    badge: 'bg-accent/10 text-accent-strong',
  },
  STANDARD: {
    card: 'border-t-slate-300 hover:border-accent/50 hover:shadow-card',
    badge: 'bg-slate-100 text-slate-700',
  },
} as const

export const DiagnosticsServiceCard = ({
  entry,
  categoryLabel,
}: {
  entry: DiagnosticsHubService
  categoryLabel: string
}) => {
  const { t } = useTranslation(['home', 'services'])
  const { service, route } = entry
  const title = t(`home:services.${service.translationKey}.title`)
  const cta = t('services:overview.ia.card_cta')
  const styles = priorityStyles[service.hubPriority]

  return (
    <Card
      to={route.path}
      aria-label={`${title}: ${cta}`}
      data-diagnostics-card
      data-diagnostics-service={service.id}
      data-route-id={route.id}
      data-hub-priority={service.hubPriority}
      data-card-category={service.hubCategory}
      className={`min-h-[280px] border-t-4 p-7 ${styles.card}`}
    >
      <span
        className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent [&>svg]:h-6 [&>svg]:w-6"
        aria-hidden="true"
      >
        {service.icon}
      </span>
      <span className={`mt-5 w-fit rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}>
        {categoryLabel}
      </span>
      <h3 className="mt-4 text-xl font-medium leading-snug text-heading">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-700">
        {t(`services:overview.ia.cards.${service.translationKey}`)}
      </p>
      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-accent-strong group-hover:text-brand-deep">
        {cta}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Card>
  )
}

export const DiagnosticsServiceGrid = ({
  entries,
  categoryLabel,
}: {
  entries: DiagnosticsHubService[]
  categoryLabel: string
}) => (
  <div data-diagnostics-card-grid className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {entries.map((entry) => (
      <DiagnosticsServiceCard key={entry.service.id} entry={entry} categoryLabel={categoryLabel} />
    ))}
  </div>
)
