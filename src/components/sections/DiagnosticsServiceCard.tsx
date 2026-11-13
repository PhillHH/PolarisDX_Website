import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { DiagnosticsHubService } from '../../data/diagnosticsHub'
import { Card } from '../ui/Card'

// SC-006 (Editorial Motion): Lift (Card mit `to`), der Pfeil rutscht; Eintritt per `rv`.
// SC-028: die Karte bleibt ein `Card`-Link mit ihrer Akzentlinie oben (Klassen sind im Vertrag
// geprüft); Rahmen, Rundung, Fläche und Schatten nimmt sub.css auf den Unterseiten zurück.
const priorityStyles = {
  PRIMARY: { card: 'border-t-accent' },
  STANDARD: { card: 'border-t-slate-300' },
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
      className={`rv min-h-[280px] border-t-4 p-7 ${styles.card}`}
    >
      <span className="sc028-tile-icon" aria-hidden="true">
        {service.icon}
      </span>
      <span className="sc028-label">{categoryLabel}</span>
      <h3>{title}</h3>
      <p className="sc025-text">{t(`services:overview.ia.cards.${service.translationKey}`)}</p>
      <span className="sc025-underlink">
        <span>{cta}</span>
        <ArrowRight aria-hidden="true" />
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
  <div
    data-diagnostics-card-grid
    className="sc028-cards grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-3"
  >
    {entries.map((entry) => (
      <DiagnosticsServiceCard key={entry.service.id} entry={entry} categoryLabel={categoryLabel} />
    ))}
  </div>
)
