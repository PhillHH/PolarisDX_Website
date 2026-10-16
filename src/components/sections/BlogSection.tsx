import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Eyebrow from '../ui/Eyebrow'
import { ResponsivePicture } from '../ui/ResponsivePicture'
import { blogPosts } from '../../data/blogPosts'
import { getArticleImageAsset } from '../../assets/articleImages'
import { getCanonicalRouteEntries } from '../../routing'

const registryEntries = getCanonicalRouteEntries()

function requireArticleTarget(routeId: string): string {
  const target = registryEntries.find((entry) => entry.id === routeId)
  if (!target) throw new Error(`Homepage knowledge target is missing from the Registry: ${routeId}`)
  return target.path
}

const articlesTarget = requireArticleTarget('articles')

/**
 * Knowledge teasers from the real Article source (PT11.5).
 *
 * SC-005 (2026-10-16): one featured article carries the photograph, the two
 * following articles are a numbered reading list. Three photos of the same
 * size in a row were the loudest repetition on the page; one strong picture
 * and a list read faster and cost less HTML than three cards.
 */
const BlogSection = () => {
  const { t } = useTranslation(['home', 'articles'])
  const [featured, ...more] = blogPosts.slice(0, 3)
  if (!featured) return null
  const featuredImage = getArticleImageAsset(featured.image)
  const readMore = t('articles:ui.readMore')

  return (
    <section id="blog" aria-labelledby="homepage-knowledge-title">
      <div className="rv grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-12">
        <div>
          <Eyebrow>{t('blog.caption', 'Blog & News')}</Eyebrow>
          <h2 id="homepage-knowledge-title" className="mt-3 t-display">
            {t('blog.title')}
          </h2>
        </div>
        <p className="max-w-xl text-base leading-7 text-gray-700">{t('blog.eeat_text')}</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-stretch lg:gap-12">
        <article className="rv flex">
          <Link
            to={requireArticleTarget(`article-detail:${featured.id}`)}
            data-home-knowledge="featured"
            className="group flex w-full flex-col overflow-hidden rounded-card border border-paper-line bg-white shadow-card transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <div className="aspect-[16/9] w-full overflow-hidden bg-paper-deep">
              {featuredImage && (
                <ResponsivePicture
                  image={featuredImage}
                  alt=""
                  lean
                  sizes="(min-width: 1024px) 640px, calc(100vw - 2rem)"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col p-7 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
                {t('blog.featured')}
              </p>
              <h3 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-heading">
                {t(`articles:${featured.id}.title`)}
              </h3>
              <p className="mt-3 text-base leading-7 text-gray-700">
                {t(`articles:${featured.id}.excerpt`)}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-strong group-hover:text-brand-deep">
                {readMore}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </article>

        <div className="lg:self-center">
          <ol className="rv divide-y divide-paper-line border-y border-paper-line">
            {more.map((post, index) => (
              <li key={post.id}>
                <article>
                  <Link
                    to={requireArticleTarget(`article-detail:${post.id}`)}
                    className="group flex gap-5 py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                  >
                    <span className="pt-1 text-sm font-semibold tabular-nums text-accent-strong">
                      0{index + 2}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-semibold leading-snug tracking-tight text-heading group-hover:text-brand-deep">
                        {t(`articles:${post.id}.title`)}
                      </span>
                      <span className="mt-2 line-clamp-2 block text-sm leading-relaxed text-gray-600">
                        {t(`articles:${post.id}.excerpt`)}
                      </span>
                    </span>
                    <ArrowRight
                      className="mt-1.5 h-5 w-5 shrink-0 text-accent-strong transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </Link>
                </article>
              </li>
            ))}
          </ol>
          {/* SC-006: der Handlungslink schliesst die Leseliste ab statt allein unter dem Raster
              zu schweben — dieselbe Linkrolle wie "Weiterlesen" in der Karte. */}
          <Link
            to={articlesTarget}
            data-home-secondary-conversion="knowledge"
            data-route-id="articles"
            className="t-link-cta mt-8 inline-block"
          >
            {t('blog.all_articles', 'Alle Fachartikel anzeigen')} →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogSection
