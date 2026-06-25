import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card } from '~/design-system'

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
    <Card as="article" interactive padding="none" className="flex h-full flex-col overflow-hidden">
      <div className="relative h-64 w-full bg-bg-subtle overflow-hidden">
        {imageUrl && (
          <>
            <img
              src={imageUrl}
              alt={title}
              width={400}
              height={256}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-brand-deep/20 mix-blend-overlay" />
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-base font-semibold tracking-tight text-fg-heading">{title}</h3>
        <p className="text-sm leading-relaxed text-fg">{excerpt}</p>
        {to && (
          <Link
            to={to}
            className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-deep transition-colors"
          >
            {t('shop:shop.readMore', 'Read More')}
            <span className="transition group-hover:translate-x-1">→</span>
          </Link>
        )}
      </div>
    </Card>
  )
}

export default BlogCard
