type ServiceCardProps = {
  icon?: React.ReactNode
  title: string
  description: string
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => {
  return (
    <article className="group flex flex-col rounded-xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-card">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-primary">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-medium tracking-tight text-gray-900">
        {title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-gray-500">
        {description}
      </p>
      <button
        type="button"
        className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-secondary"
      >
        Read More
        <span className="transition group-hover:translate-x-1">→</span>
      </button>
    </article>
  )
}

export default ServiceCard


