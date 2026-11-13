import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getArticleImageAsset } from '../../assets/articleImages'
import { ResponsivePicture } from '../ui/ResponsivePicture'
import { diagnosticsContextTargets, diagnosticsRelatedArticles } from '../../data/diagnosticsHub'
import SubHead from '../sub/SubHead'

const DiagnosticsRelatedArticlesSection = () => {
  const { t } = useTranslation(['articles', 'services'])

  return (
    <section
      aria-labelledby="diagnostics-related-title"
      data-diagnostics-related-articles
      data-sub-section
      className="sc025-s sc025-tint"
    >
      <div className="sc025-inner">
        <SubHead
          kicker={t('services:overview.related.eyebrow')}
          title={t('services:overview.related.title')}
          titleId="diagnostics-related-title"
          lead={t('services:overview.related.intro')}
        />

        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {diagnosticsRelatedArticles.map(({ article, route }) => {
            const title = t(`articles:${article.id}.title`)
            const image = article.sections?.[0]?.image
            const imageAsset = image ? getArticleImageAsset(image) : undefined

            return (
              <article
                key={article.id}
                data-diagnostics-related-article={article.id}
                className="sc028-mag"
              >
                {imageAsset && (
                  /* AP25 PT25.3: dieselben Artikelbilder wie in der Artikelliste — responsive,
                     unter dem Falz lazy; festes Seitenverhältnis mit object-cover. */
                  <ResponsivePicture
                    image={imageAsset}
                    alt=""
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 46vw, calc(100vw - 2rem)"
                  />
                )}
                <h3>{title}</h3>
                <p className="sc025-text">{t(`articles:${article.id}.excerpt`)}</p>
                <Link
                  to={route.path}
                  data-related-article-link
                  data-route-id={route.id}
                  className="sc025-underlink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                >
                  <span>{t('articles:ui.readMore')}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </article>
            )
          })}
        </div>

        <div className="sc028-links">
          <Link
            to={diagnosticsContextTargets.articles.path}
            data-diagnostics-knowledge-link
            data-route-id={diagnosticsContextTargets.articles.id}
            className="sc025-underlink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            <span>{t('services:overview.related.all_articles')}</span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default DiagnosticsRelatedArticlesSection
