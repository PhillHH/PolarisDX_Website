import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { type Service } from '../../types/models'
import { cn } from '../../lib/utils'

interface ServiceCardProps {
  service: Service
  className?: string
}

const ServiceCard = ({ service, className }: ServiceCardProps) => {
  const { t } = useTranslation('common')

  return (
    <Link
      to={`/diagnostics/${service.id}`}
      className={cn(
        // SC-006 (2026-10-16): die Glasflaeche (Weichzeichner-Schicht aus der
        // Zeit vor der Papierflaeche) wich dem einen Kartenrezept der Sales-Machine.
        'group flex flex-col rounded-card border border-paper-line bg-white p-6 shadow-card transition duration-300',
        'hover:-translate-y-1 hover:border-accent-border motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className,
      )}
    >
      <div className="icon-tile mb-6 h-14 w-14 rounded-2xl [&>svg]:h-6 [&>svg]:w-6">
        {service.icon}
      </div>
      <h3 className="mb-3 text-xl font-medium tracking-tight text-heading group-hover:text-brand-deep transition-colors">
        {service.title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-gray-600">{service.description}</p>
      <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-primary group-hover:text-brand-deep transition-colors">
        {t('read_more', 'Read More')}
        <span className="transition group-hover:translate-x-1">→</span>
      </div>
    </Link>
  )
}

export default ServiceCard
