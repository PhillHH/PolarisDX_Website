import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ArticleImageAsset } from '../../assets/articleImages'
import { ResponsivePicture } from './ResponsivePicture'

type BlogCardProps = {
  id: string
  image?: ArticleImageAsset
  to?: string
}

const BlogCard = ({ id, image, to }: BlogCardProps) => {
  const { t } = useTranslation('articles')
  const title = t(`articles:${id}.title`)
  const excerpt = t(`articles:${id}.excerpt`)

  return (
    <article className="glass-panel flex h-full flex-col overflow-hidden rounded-xl transition duration-300 hover:-translate-y-1 hover:bg-white/80">
      <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
        {image && (
          <>
            {/* AP24 PT24.5: leeres `alt` — das Bild illustriert die Ueberschrift darunter.
                AP25 PT25.3: responsive AVIF/WebP statt einer 1024–1200-px-Datei fuer eine
                ~380 px breite Karte; unter dem Falz, daher lazy. Die Karte hat eine feste
                Hoehe (h-64), `object-cover` fuellt sie wie zuvor. */}
            <ResponsivePicture
              image={image}
              alt=""
              sizes="(min-width: 1024px) 380px, (min-width: 768px) 46vw, calc(100vw - 2rem)"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-brand-deep/20 mix-blend-overlay" />
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-base font-semibold tracking-tight text-heading">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-600">{excerpt}</p>
        {to && (
          <Link
            to={to}
            className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-deep transition-colors"
          >
            {t('ui.readMore')}
            <span className="transition group-hover:translate-x-1">→</span>
          </Link>
        )}
      </div>
    </article>
  )
}

export default BlogCard
