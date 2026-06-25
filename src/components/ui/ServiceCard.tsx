import { useTranslation } from 'react-i18next'
import { Card } from '~/design-system'
import { type Service } from '../../types/models'
import { cn } from '../../lib/utils'

interface ServiceCardProps {
  service: Service
  className?: string
}

const ServiceCard = ({ service, className }: ServiceCardProps) => {
  const { t } = useTranslation('common')

  return (
    <Card
      to={`/diagnostics/${service.id}`}
      interactive
      className={cn('group flex flex-col', className)}
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-bg-subtle to-surface text-brand-primary shadow-inset border border-[var(--color-surface)]">
        {service.icon}
      </div>
      <h3 className="mb-3 text-xl font-medium tracking-tight text-fg-heading group-hover:text-brand-deep transition-colors">
        {service.title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-fg">{service.description}</p>
      <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-primary group-hover:text-brand-deep transition-colors">
        {t('read_more', 'Read More')}
        <span className="transition group-hover:translate-x-1">→</span>
      </div>
    </Card>
  )
}

export default ServiceCard
