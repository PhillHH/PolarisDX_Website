import EventBand from '../components/events/EventBand'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Leaf, Radio, TrendingUp, Activity, FileText, ArrowRight } from 'lucide-react'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import SubPage from '../components/sub/SubPage'
import SubStage from '../components/sub/SubStage'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import { articles } from '../data/articles'
import { articleDateIso, formatArticleDate, parseReadMinutes } from '../lib/articleMeta'
import { getArticleImageAsset } from '../assets/articleImages'
import { ResponsivePicture } from '../components/ui/ResponsivePicture'

// Map article category → topical icon for the card icon-tile (FileText fallback).
const categoryIcon: Record<string, LucideIcon> = {
  Sustainability: Leaf,
  Telemedicine: Radio,
  Economics: TrendingUp,
  'Health Article': Activity,
}

const ArticlesIndexPage = () => {
  const { t, i18n } = useTranslation(['articles', 'common'])

  // Derive live values for the hero + topics row from the real article set.
  const categories = Array.from(new Set(articles.map((a) => a.category)))
  const articleCount = articles.length

  // (b) Sichtbare Breadcrumb und BreadcrumbList aus derselben Quelle speisen.
  const crumbHome = t('articles:ui.home')
  const crumbArticles = t('articles:ui.articles')

  // (d) Lesezeit steht englisch in den Rohdaten ('6 min read').
  const readTimeLabel = (raw: string) => {
    const minutes = parseReadMinutes(raw)
    return minutes === null ? raw : t('articles:detail.read_time', { minutes, defaultValue: raw })
  }

  return (
    <PageTransition>
      <SEOHead
        title={t(
          'articles:seo.index_title',
          'Fachartikel: POC-Diagnostik & Praxislabor Wissen | PolarisDX',
        )}
        description={t(
          'articles:seo.index_description',
          'Expertenwissen zu POCT, Chairside Diagnostik und Praxislabor. Praxisnahe Artikel für Zahnärzte, Ärzte und medizinisches Fachpersonal.',
        )}
        structuredData={createBreadcrumbSchema(
          [
            { name: crumbHome, url: '/' },
            { name: crumbArticles, url: '/articles' },
          ],
          i18n.language,
        )}
      />

      <SubPage page="articles">
        {/* Bühne: drei Kennzahlen des Magazins als Eckdaten, die beiden Beispielwerte rechts */}
        <SubStage
          breadcrumbs={[{ label: crumbHome, href: '/' }, { label: crumbArticles }]}
          eyebrow={t('articles:index.eyebrow', 'Fachwissen')}
          title={t('articles:index.title', 'Our Magazine')}
          lead={
            <p>
              {t(
                'articles:index.subtitle',
                'Insights, news, and expert knowledge on modern diagnostics and health.',
              )}
            </p>
          }
          fold
          actions={
            <>
              <a href="#article-list" className="sc025-button">
                {t('articles:index.hero_primary_cta', 'Fachartikel lesen')}
                <ArrowRight aria-hidden="true" />
              </a>
              <Link to="/diagnostics" className="sc025-underlink">
                <span>{t('articles:index.hero_secondary_cta', 'Diagnostik entdecken')}</span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </>
          }
          aside={
            <dl className="sc028-aside-list">
              <div>
                <dt>{t('articles:index.vc_biomarker_label', 'Biomarker')}</dt>
                <dd>CRP · TSH</dd>
              </div>
              <div>
                <dt>{t('articles:index.vc_time_label', 'bis Ergebnis')}</dt>
                <dd>3–15 Min</dd>
              </div>
            </dl>
          }
          facts={[
            {
              label: t('articles:index.stat_articles_label', 'Fachbeiträge'),
              value: `${articleCount}`,
            },
            {
              label: t('articles:index.stat_topics_label', 'Themenfelder'),
              value: `${categories.length}`,
            },
            { label: t('articles:index.stat_languages_label', 'Sprachen'), value: '10' },
          ]}
        />

        <div className="sc025-s sc025-tint" data-sub-section>
          <div className="sc025-inner">
            <Reveal width="100%">
              <div className="sc025-head">
                <span className="sc025-kicker">{t('articles:index.caption', 'Latest Posts')}</span>
                <h2 className="sc025-h2">{t('articles:index.heading', 'Explore Our Articles')}</h2>
              </div>

              {/* Themen im Magazin — Legende, keine Filter */}
              <div className="sc028-topics">
                <span>{t('articles:index.browse_caption', 'Themen im Magazin')}</span>
                <ul className="sc028-chips sc028-chips-light">
                  {categories.map((category) => (
                    <li key={category}>{t(`common:category.${category}`, category)}</li>
                  ))}
                </ul>
              </div>

              <div
                id="article-list"
                className="scroll-mt-24 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3"
              >
                {articles.map((post) => {
                  const Icon = categoryIcon[post.category] ?? FileText
                  const image = getArticleImageAsset(post.sections[0]?.image)
                  const title = t(`articles:${post.id}.title`)
                  return (
                    <article key={post.id} data-article-card={post.slug}>
                      <Link
                        to={`/articles/${post.slug}`}
                        aria-label={title}
                        className="sc028-mag focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                      >
                        {image ? (
                          /* AP24 PT24.5: leeres `alt` ist richtig — die Karte
                             traegt ihren Namen ueber `aria-label={title}`, und
                             der Titel steht darunter noch einmal als Text. */
                          /* AP25 PT25.3 / SC-021 Nachtrag: alle Kartenbilder liegen unter dem Falz
                             und laden lazy. `sizes` aus der gemessenen Kartenbreite. */
                          <ResponsivePicture
                            image={image}
                            alt=""
                            sizes="(min-width: 1024px) 380px, (min-width: 768px) 46vw, calc(100vw - 2rem)"
                            priority={false}
                          />
                        ) : (
                          <div aria-hidden="true" className="sc028-mag-blank">
                            <Icon />
                          </div>
                        )}
                        <span className="sc028-label">
                          {t(`common:category.${post.category}`, post.category)}
                        </span>
                        <h2>{title}</h2>
                        <p className="sc025-text">{t(`articles:${post.id}.excerpt`)}</p>
                        <div className="sc028-mag-meta">
                          <span>{post.author}</span>
                          <span aria-hidden="true">·</span>
                          <time dateTime={articleDateIso(post.datePublished)}>
                            {formatArticleDate(post.datePublished, i18n.language)}
                          </time>
                          <span aria-hidden="true">·</span>
                          <span>{readTimeLabel(post.readTime)}</span>
                        </div>
                        <span className="sc025-underlink">
                          <span>{t('articles:ui.readMore')}</span>
                          <ArrowRight aria-hidden="true" />
                        </span>
                      </Link>
                    </article>
                  )
                })}
              </div>
            </Reveal>
          </div>
        </div>

        {/* SC-021 Nachtrag: am Seitenende — direkt unter der Buehne wurde das Band-Foto zum LCP-Bild. */}
        <EventBand />
        <FinalCtaSection />
      </SubPage>
    </PageTransition>
  )
}

export default ArticlesIndexPage
