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
        'group flex flex-col rounded-xl glass-panel p-6 transition duration-300',
        'hover:-translate-y-1 hover:shadow-card hover:bg-surface-raised/90',
        className,
      )}
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-surface-overlay to-surface-raised text-brand-sky shadow-inner border border-line">
        {service.icon}
      </div>
      <h3 className="mb-3 text-xl font-medium tracking-tight text-ink group-hover:text-brand-sky transition-colors">
        {service.title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-ink-muted">{service.description}</p>
      <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-sky group-hover:text-white transition-colors">
        {t('read_more', 'Read More')}
        <span className="transition group-hover:translate-x-1">→</span>
      </div>
    </Link>
  )
}

export default ServiceCard
