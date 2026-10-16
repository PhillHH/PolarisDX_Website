import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ArticleImageAsset } from '../../assets/articleImages'
import { ResponsivePicture } from './ResponsivePicture'

type BlogCardProps = {
  id: string
  image?: ArticleImageAsset
  to?: string
}

/**
 * BlogCard — Artikel-Teaser mit Foto, Titel und Auszug.
 *
 * SC-006 (Editorial Motion): die Karte folgt der Startseiten-Kartensprache. Mit
 * `to` ist die GANZE Karte ein Link (`group`) und antwortet auf den Zeiger —
 * Lift, Akzentrand, sanfter Bildzoom, der Pfeil rutscht; ohne `to` ist sie eine
 * ruhige Flaeche ohne Hover (Hover nur auf Interaktivem). Der Eintritt (`rv`)
 * liegt auf dem <article>, damit der Lift des Links nicht mit der
 * Scroll-Animation um `transform` konkurriert.
 */
const surface =
  'flex h-full w-full flex-col overflow-hidden rounded-card border border-paper-line bg-white shadow-card'
const interactive =
  'group transition hover:-translate-y-1 hover:border-accent-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0'

const BlogCard = ({ id, image, to }: BlogCardProps) => {
  const { t } = useTranslation('articles')
  const title = t(`articles:${id}.title`)
  const excerpt = t(`articles:${id}.excerpt`)

  const body = (
    <>
      <div className="relative h-56 w-full overflow-hidden bg-paper-deep">
        {image && (
          <>
            {/* AP24 PT24.5: leeres `alt` — das Bild illustriert die Ueberschrift darunter.
                AP25 PT25.3: responsive AVIF/WebP statt einer 1024–1200-px-Datei fuer eine
                ~380 px breite Karte; unter dem Falz, daher lazy. Die Karte hat eine feste
                Hoehe (h-56), `object-cover` fuellt sie wie zuvor.
                2026-10-16: `lean` (nur AVIF-srcset) wie die Saeulenkarten — seit alle sechs
                Artikel ein Foto tragen, kostete die dritte Karte sonst ~100 B ueber dem
                htmlBytes-Budget der Startseite. */}
            <ResponsivePicture
              image={image}
              alt=""
              lean
              sizes="(min-width: 1024px) 380px, (min-width: 768px) 46vw, calc(100vw - 2rem)"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-brand-deep/20 mix-blend-overlay" />
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-base font-semibold tracking-tight text-heading">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-600">{excerpt}</p>
        {to && (
          <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition-colors group-hover:text-brand-deep">
            {t('ui.readMore')}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        )}
      </div>
    </>
  )

  return (
    <article className="rv flex h-full">
      {to ? (
        <Link to={to} aria-label={title} className={`${surface} ${interactive}`}>
          {body}
        </Link>
      ) : (
        <div className={surface}>{body}</div>
      )}
    </article>
  )
}

export default BlogCard
