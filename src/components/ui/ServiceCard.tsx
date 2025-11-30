import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type ServiceCardProps = {
  icon?: React.ReactNode // Optionales Icon (wird aktuell als Platzhalter gerendert wenn fehlt)
  title: string
  description: string
  to: string // Link-Ziel
}

/**
 * ServiceCard Komponente.
 * Zeigt eine Karte für eine Dienstleistung an, die als Link zur Detailseite fungiert.
 */
const ServiceCard = ({ icon, title, description, to }: ServiceCardProps) => {
  const { t } = useTranslation('shop') // Nutze 'shop' oder 'common' für 'Read More', falls nötig

  return (
    <Link to={to} className="group flex flex-col rounded-xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card">
      {/* Icon-Platzhalter - in Zukunft durch echte Icons ersetzen */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-primary">
        {icon || <div className="h-8 w-8 bg-current opacity-20" />}
      </div>

      <h3 className="mb-3 text-xl font-medium tracking-tight text-gray-900">
        {title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-gray-500">
        {description}
      </p>

      <div
        className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-secondary"
      >
        {t('shop.readMore', 'Read More')}
        <span className="transition group-hover:translate-x-1">→</span>
      </div>
    </Link>
  )
}

export default ServiceCard
