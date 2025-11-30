import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Typdefinition für die Props der BlogCard
type BlogCardProps = {
  id: string // Artikel-ID zur Auflösung der Übersetzungen
  imageUrl?: string // URL des Vorschaubildes
  to?: string // Ziel-Link (optional)
}

/**
 * BlogCard Komponente.
 * Zeigt eine Vorschau eines Blog-Artikels mit Bild, Titel, Auszug und "Weiterlesen"-Link an.
 */
const BlogCard = ({ id, imageUrl, to }: BlogCardProps) => {
  const { t } = useTranslation(['articles', 'shop'])

  // Auflösen der lokalisierten Texte
  const title = t(`articles:${id}.title`)
  const excerpt = t(`articles:${id}.excerpt`)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-card">
      {/* Bildbereich */}
      <div className="aspect-[3/2] w-full bg-gray-100">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      {/* Inhalt: Titel, Auszug, Link */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-xl font-medium tracking-tight text-gray-900">
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
