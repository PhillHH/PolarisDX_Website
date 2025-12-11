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
    <Link to={to} className="group flex flex-col rounded-xl glass-panel p-6 transition duration-300 hover:-translate-y-1 hover:shadow-card hover:bg-white/80">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-white text-primary shadow-inner border border-white">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-medium tracking-tight text-gray-900 group-hover:text-primary-deep transition-colors">
        {title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-gray-600">
        {description}
      </p>
      <div
        className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:text-primary-deep transition-colors"
      >
        {t('read_more', 'Read More')}
        <span className="transition group-hover:translate-x-1">→</span>
      </div>
    </Link>
  )
}

export default ServiceCard
