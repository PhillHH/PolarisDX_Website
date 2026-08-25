import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Newspaper,
  Leaf,
  Radio,
  TrendingUp,
  Activity,
  FileText,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import SectionHeader from '../components/ui/SectionHeader'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import SubpageHero from '../components/sections/SubpageHero'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import { Tooth } from '../components/ui/icons/Tooth'
import { articles } from '../data/articles'
import { formatArticleDate, parseReadMinutes } from '../lib/articleMeta'

// Map article category → topical icon for the card icon-tile (FileText fallback).
const categoryIcon: Record<string, LucideIcon> = {
  Sustainability: Leaf,
  Telemedicine: Radio,
  Economics: TrendingUp,
  'Health Article': Activity,
}

const ArticlesIndexPage = () => {
  const { t, i18n } = useTranslation(['articles', 'shop', 'common'])

  // Derive live values for the hero + topics row from the real article set.
  const categories = Array.from(new Set(articles.map((a) => a.category)))
  const articleCount = articles.length

  // (b) Sichtbare Breadcrumb und BreadcrumbList aus derselben Quelle speisen.
  const crumbHome = t('shop:shop.home', 'Startseite')
  const crumbArticles = t('shop:shop.articles', 'Artikel')

  // (d) Lesezeit steht englisch in den Rohdaten ('6 min read').
  const readTimeLabel = (raw: string) => {
    const minutes = parseReadMinutes(raw)
    return minutes === null ? raw : t('articles:detail.read_time', { minutes, defaultValue: raw })
  }

  // Localised proof tags for the featured tile (returnObjects → string[]).
  const featuredTagsRaw = t('articles:index.featured_tags', { returnObjects: true })
  const featuredTags = Array.isArray(featuredTagsRaw) ? (featuredTagsRaw as string[]) : []

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
          to: '/contact',
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
          { value: 'CV < 2 %', label: t('articles:index.vc_precision_label', 'Präzision') },
        ]}
      />

      <div className="bg-slate-50">
        <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
          {/* Featured article — bold navy tile */}
          <Reveal width="100%">
            <Link
              to="/vitamin-d3-implantologie"
              className="group relative mb-14 block overflow-hidden rounded-2xl bg-brand-deep p-7 text-white transition hover:-translate-y-1 lg:mb-16 lg:p-12"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/10 blur-2xl"
              />
              <div className="relative grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    {t('articles:index.featured', 'Empfohlen')}
                  </span>
                  <h2 className="mt-5 text-2xl font-medium tracking-tight lg:text-4xl">
                    {t(
                      'articles:index.featured_title',
                      'Vitamin D3 und Implantologie — Evidenz und Praxisleitfaden',
                    )}
                  </h2>
                  <p className="mt-4 max-w-2xl leading-relaxed text-white/80">
                    {t(
                      'articles:index.featured_excerpt',
                      'Wie ein optimaler Vitamin-D-Spiegel die Osseointegration fördert und Implantatverluste reduziert. Wissenschaftlich fundiert mit praktischen Handlungsempfehlungen.',
                    )}
                  </p>
                  {featuredTags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {featuredTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-on-dark transition-all group-hover:gap-2.5">
                    {t('articles:index.featured_cta', 'Fachartikel lesen')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>

                {/* Icon spotlight visual */}
                <div className="hidden lg:block" aria-hidden="true">
                  <div className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                    <span className="absolute inset-0 m-auto h-32 w-32 rounded-full bg-accent/10 blur-xl" />
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl bg-accent/15 text-accent-on-dark [&>svg]:h-14 [&>svg]:w-14">
                      <Tooth />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>

          <Reveal width="100%" delay={0.15}>
            <SectionHeader
              caption={t('articles:index.caption', 'Latest Posts')}
              title={t('articles:index.heading', 'Explore Our Articles')}
              align="left"
            />

            {/* Topics covered — visual legend */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium text-gray-500">
                {t('articles:index.browse_caption', 'Themen im Magazin')}
              </span>
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                >
                  {t(`common:category.${category}`, category)}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((post) => {
                const Icon = categoryIcon[post.category] ?? FileText
                return (
                  <Link
                    key={post.id}
                    to={`/articles/${post.slug}`}
                    className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="inline-flex w-fit rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        {t(`common:category.${post.category}`, post.category)}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-medium text-heading transition-colors group-hover:text-accent">
                      {t(`articles:${post.id}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-700">
                      {t(`articles:${post.id}.excerpt`)}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                      <span>{readTimeLabel(post.readTime)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatArticleDate(post.date, i18n.language)}</span>
                    </div>
                    <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-accent transition-all group-hover:gap-2 group-hover:text-accent-strong">
                      {t('shop:shop.readMore', 'Weiterlesen')}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
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
