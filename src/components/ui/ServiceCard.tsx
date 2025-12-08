import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type ServiceCardProps = {
  icon?: React.ReactNode
  title: string
  description: string
  to: string
}

const ServiceCard = ({ icon, title, description, to }: ServiceCardProps) => {
  const { t } = useTranslation('common')

  return (
    <Link to={to} className="group flex flex-col rounded-xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-primary">
        {icon}
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
        {t('read_more', 'Read More')}
        <span className="transition group-hover:translate-x-1">→</span>
      </div>
    </Link>
  )
}

export default ServiceCard
