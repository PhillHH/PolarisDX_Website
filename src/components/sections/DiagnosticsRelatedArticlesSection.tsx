import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getArticleImageAsset } from '../../assets/articleImages'
import { ResponsivePicture } from '../ui/ResponsivePicture'
import { diagnosticsContextTargets, diagnosticsRelatedArticles } from '../../data/diagnosticsHub'
import Eyebrow from '../ui/Eyebrow'

const DiagnosticsRelatedArticlesSection = () => {
  const { t } = useTranslation(['articles', 'services'])

  return (
    <section
      aria-labelledby="diagnostics-related-title"
      data-diagnostics-related-articles
      className="border-t border-slate-200 bg-slate-50"
    >
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0 lg:py-28">
        <div className="max-w-3xl">
          <Eyebrow>{t('services:overview.related.eyebrow')}</Eyebrow>
          <h2 id="diagnostics-related-title" className="mt-3 t-h2">
            {t('services:overview.related.title')}
          </h2>
          <p className="mt-4 text-gray-700">{t('services:overview.related.intro')}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {diagnosticsRelatedArticles.map(({ article, route }) => {
            const title = t(`articles:${article.id}.title`)
            const image = article.sections?.[0]?.image
            const imageAsset = image ? getArticleImageAsset(image) : undefined

            return (
              <article
                key={article.id}
                data-diagnostics-related-article={article.id}
                className="flex min-h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                {imageAsset && (
                  /* AP25 PT25.3: dieselben Artikelbilder wie in der Artikelliste — responsive,
                     unter dem Falz lazy; feste Hoehe (h-48) + object-cover wie zuvor. */
                  <ResponsivePicture
                    image={imageAsset}
                    alt=""
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 46vw, calc(100vw - 2rem)"
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-medium leading-snug text-heading">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-700">
                    {t(`articles:${article.id}.excerpt`)}
                  </p>
                  <Link
                    to={route.path}
                    data-related-article-link
                    data-route-id={route.id}
                    className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-semibold text-accent-strong underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                  >
                    {t('articles:ui.readMore')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>

        <Link
          to={diagnosticsContextTargets.articles.path}
          data-diagnostics-knowledge-link
          data-route-id={diagnosticsContextTargets.articles.id}
          className="mt-10 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-accent-strong underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          {t('services:overview.related.all_articles')}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}

export default DiagnosticsRelatedArticlesSection
