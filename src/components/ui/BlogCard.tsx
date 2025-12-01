import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type BlogCardProps = {
  id: string
  imageUrl?: string
  to?: string
}

const BlogCard = ({ id, imageUrl, to }: BlogCardProps) => {
  const { t } = useTranslation(['articles', 'shop'])
  const title = t(`articles:${id}.title`)
  const excerpt = t(`articles:${id}.excerpt`)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-card">
      <div className="aspect-video w-full bg-gray-100">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-base font-semibold tracking-tight text-gray-900">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-gray-500">{excerpt}</p>
        {to && (
          <Link
            to={to}
            className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-secondary"
          >
            {t('shop:shop.readMore', 'Read More')}
            <span className="transition group-hover:translate-x-1">→</span>
          </Link>
        )}
      </div>
    </article>
  )
}

export default BlogCard
