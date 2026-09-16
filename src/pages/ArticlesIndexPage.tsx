import type { LucideIcon } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { useTranslation } from 'react-i18next'
import { Newspaper, Leaf, Radio, TrendingUp, Activity, FileText, ArrowRight } from 'lucide-react'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import SectionHeader from '../components/ui/SectionHeader'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import SubpageHero from '../components/sections/SubpageHero'
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
        keywords={[
          'POC Fachartikel',
          'Diagnostik Wissen',
          'Schnelltest Artikel',
          'Medizintechnik Blog',
          'POCT Fachbeiträge',
        ]}
        structuredData={createBreadcrumbSchema(
          [
            { name: crumbHome, url: '/' },
            { name: crumbArticles, url: '/articles' },
          ],
          i18n.language,
        )}
      />

      <SubpageHero
        breadcrumbs={[{ label: crumbHome, href: '/' }, { label: crumbArticles }]}
        eyebrow={t('articles:index.eyebrow', 'Fachwissen')}
        title={t('articles:index.title', 'Our Magazine')}
        subtitle={t(
          'articles:index.subtitle',
          'Insights, news, and expert knowledge on modern diagnostics and health.',
        )}
        primaryCta={{
          label: t('articles:index.hero_primary_cta', 'Fachartikel lesen'),
          href: '#article-list',
        }}
        secondaryCta={{
          label: t('articles:index.hero_secondary_cta', 'Diagnostik entdecken'),
          to: '/diagnostics',
        }}
        stats={[
          {
            value: `${articleCount}`,
            label: t('articles:index.stat_articles_label', 'Fachbeiträge'),
          },
          {
            value: `${categories.length}`,
            label: t('articles:index.stat_topics_label', 'Themenfelder'),
          },
          { value: '10', label: t('articles:index.stat_languages_label', 'Sprachen') },
        ]}
        icon={<Newspaper />}
        valueChips={[
          { value: 'CRP · TSH', label: t('articles:index.vc_biomarker_label', 'Biomarker') },
          { value: '3–15 Min', label: t('articles:index.vc_time_label', 'bis Ergebnis') },
        ]}
      />

      <div className="bg-slate-50">
        <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
          <Reveal width="100%">
            <SectionHeader
              caption={t('articles:index.caption', 'Latest Posts')}
              title={t('articles:index.heading', 'Explore Our Articles')}
              align="left"
            />

            {/* Topics covered — visual legend */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium text-gray-700">
                {t('articles:index.browse_caption', 'Themen im Magazin')}
              </span>
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-strong"
                >
                  {t(`common:category.${category}`, category)}
                </span>
              ))}
            </div>

            <div
              id="article-list"
              className="mt-10 scroll-mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {articles.map((post, index) => {
                const Icon = categoryIcon[post.category] ?? FileText
                const image = getArticleImageAsset(post.sections[0]?.image)
                const title = t(`articles:${post.id}.title`)
                return (
                  <article key={post.id} data-article-card={post.slug}>
                    <Card to={`/articles/${post.slug}`} padding="none" aria-label={title}>
                      {image ? (
                        /* AP24 PT24.5: leeres `alt` ist richtig — die Karte
                           traegt ihren Namen ueber `aria-label={title}`, und
                           der Titel steht darunter noch einmal als Text. */
                        /* AP25 PT25.3 (PERF-B04/B10): die erste Karte ist ab 768 px das gemessene
                           LCP-Element und bei 390 px 29 px unter dem Falz — nur sie mit Vorrang,
                           alle weiteren lazy. `sizes` aus der gemessenen Kartenbreite
                           (377 / 350 / 356 px bei 1440 / 768 / 390). */
                        <ResponsivePicture
                          image={image}
                          alt=""
                          sizes="(min-width: 1024px) 380px, (min-width: 768px) 46vw, calc(100vw - 2rem)"
                          className="aspect-video w-full rounded-t-xl object-cover"
                          priority={index === 0}
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="flex aspect-video w-full items-center justify-center rounded-t-xl bg-brand-deep text-accent-on-dark"
                        >
                          <Icon className="h-12 w-12" />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-7">
                        <span className="inline-flex w-fit rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent-strong">
                          {t(`common:category.${post.category}`, post.category)}
                        </span>
                        <h2 className="mt-5 text-lg font-medium text-heading transition-colors group-hover:text-accent">
                          {title}
                        </h2>
                        <p className="mt-2 t-small">{t(`articles:${post.id}.excerpt`)}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-700">
                          <span>{post.author}</span>
                          <span aria-hidden="true">·</span>
                          <time dateTime={articleDateIso(post.datePublished)}>
                            {formatArticleDate(post.datePublished, i18n.language)}
                          </time>
                          <span aria-hidden="true">·</span>
                          <span>{readTimeLabel(post.readTime)}</span>
                        </div>
                        <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-accent-strong transition-all group-hover:gap-2 group-hover:text-brand-deep">
                          {t('articles:ui.readMore')}
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                    </Card>
                  </article>
                )
              })}
            </div>
          </Reveal>
        </div>
      </div>

      <FinalCtaSection roiHref="/#roi-rechner" />
    </PageTransition>
  )
}

export default ArticlesIndexPage
