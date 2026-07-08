import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Newspaper } from 'lucide-react'
import { SEOHead, createArticleSchema, createBreadcrumbSchema } from '../components/seo'
import { Button } from '../components/ui/Button'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import PageSidebar, { type SidebarWidget } from '../components/sections/PageSidebar'
import SubpageHero from '../components/sections/SubpageHero'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import { services } from '../data/services'
import { useArticles } from '../hooks/useArticles'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Alert } from '../components/ui/Alert'
import { getArticleImageUrl } from '../assets/articleImages'

// Local types for UI rendering logic which involves Discriminated Unions
// that are not part of the simpler data model in types/models.ts
type BaseSection = {
  heading?: string
  image?: string
}

type TextSection = BaseSection & {
  type?: 'text' // default
  paragraphs?: string[]
  listItems?: string[]
}

type TableSection = BaseSection & {
  type: 'table'
  headers: string[]
  rows: string[][]
}

type InfoboxSection = BaseSection & {
  type: 'infobox'
  content: string
}

type KeyPointsSection = BaseSection & {
  type: 'key_points'
  points: { title: string; description: string }[]
}

type ArticleSection = TextSection | TableSection | InfoboxSection | KeyPointsSection

const ArticlePage = () => {
  const { t } = useTranslation(['articles', 'shop', 'common', 'home'])
  const { slug } = useParams<{ slug: string }>()

  // Use data fetching hook
  const { article, articles: otherArticles, loading, error } = useArticles(slug)

  // Handle Loading
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Handle Error or Not Found
  if (error || !article) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-4">
        {error ? (
          <div className="w-full max-w-md">
            <Alert variant="destructive" title={t('common:error', 'Error')}>
              {error.message || t('shop:shop.articleNotFound', 'Article not found')}
            </Alert>
            <div className="mt-6 flex justify-center">
              <Button to="/articles">{t('shop:shop.backToArticles', 'Back to Overview')}</Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('shop:shop.articleNotFound', 'Article not found')}
            </h1>
            <Button to="/articles">{t('shop:shop.backToArticles', 'Back to Overview')}</Button>
          </>
        )}
      </div>
    )
  }

  // Get translated content
  const title = t(`articles:${article.id}.title`)
  const excerpt = t(`articles:${article.id}.excerpt`)
  // Get sections from translation
  // This casting uses the LOCAL ArticleSection type which is a union
  const translatedSections = t(`articles:${article.id}.sections`, {
    returnObjects: true,
  }) as ArticleSection[]

  // We need images from the original data
  const dataSections = article.sections || []

  // Find the main image (first image found in sections)
  const articleImage = dataSections.find((s) => s.image)?.image

  // Resolve related services from the bidirectional mapping
  const relatedServices = article.relatedServiceIds?.length
    ? services.filter((s) => article.relatedServiceIds!.includes(s.id))
    : []

  const renderSection = (section: ArticleSection, index: number) => {
    // Safety check for type
    const sType = section.type || 'text'

    switch (sType) {
      case 'table':
        return (
          <section key={index} className="scroll-mt-28 space-y-4 overflow-x-auto">
            {section.heading && (
              <h2 className="text-2xl font-medium tracking-tight text-heading lg:text-3xl">
                {section.heading}
              </h2>
            )}
            <table className="w-full min-w-[600px] border-collapse text-left text-sm text-gray-700 sm:text-base">
              <thead>
                <tr>
                  {(section as TableSection).headers.map((header, i) => (
                    <th
                      key={i}
                      className="border-b border-slate-200 py-3 font-semibold text-heading"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(section as TableSection).rows.map((row, rIndex) => (
                  <tr key={rIndex} className="border-b border-gray-100 last:border-0">
                    {row.map((cell, cIndex) => (
                      <td key={cIndex} className="py-3 pr-4 align-top">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )
      case 'infobox':
        return (
          <section
            key={index}
            className="my-8 rounded-2xl border border-accent/15 bg-accent/5 p-6 text-gray-700"
          >
            {section.heading && (
              <h3 className="mb-2 text-lg font-semibold text-heading">{section.heading}</h3>
            )}
            <p className="text-sm leading-relaxed sm:text-base">
              {(section as InfoboxSection).content}
            </p>
          </section>
        )
      case 'key_points':
        return (
          <section key={index} className="scroll-mt-28 space-y-6">
            {section.heading && (
              <h2 className="text-2xl font-medium tracking-tight text-heading lg:text-3xl">
                {section.heading}
              </h2>
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(section as KeyPointsSection).points.map((point, pIndex) => (
                <div
                  key={pIndex}
                  className="rounded-xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-card"
                >
                  <h4 className="mb-2 font-medium text-heading">{point.title}</h4>
                  <p className="text-sm leading-relaxed text-gray-700">{point.description}</p>
                </div>
              ))}
            </div>
          </section>
        )
      case 'text':
      default:
        // Default text rendering
        const textSection = section as TextSection
        return (
          <section key={index} className="scroll-mt-28 space-y-5">
            {textSection.heading && (
              <h2 className="text-2xl font-medium tracking-tight text-heading lg:text-3xl">
                {textSection.heading}
              </h2>
            )}
            {textSection.paragraphs &&
              textSection.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex} className="text-[17px] leading-[1.8] text-gray-700">
                  {paragraph}
                </p>
              ))}
            {textSection.listItems && (
              <ul className="space-y-2.5">
                {textSection.listItems.map((item, lIndex) => (
                  <li
                    key={lIndex}
                    className="flex gap-3 text-[17px] leading-[1.8] text-gray-700"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.7em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
    }
  }

  // Build OG image URL from article image
  const ogImageUrl = articleImage ? `https://polarisdx.net/assets/${articleImage}` : undefined

  return (
    <PageTransition>
      <SEOHead
        title={title}
        description={excerpt}
        ogType="article"
        ogImage={ogImageUrl}
        article={{
          publishedTime: article.date,
          author: article.author,
          section: article.category,
        }}
        structuredData={[
          createArticleSchema({
            headline: title,
            description: excerpt,
            image: ogImageUrl || '/og-image.jpg',
            url: `/articles/${slug}`,
            datePublished: article.date,
            authorName: article.author,
          }),
          createBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Artikel', url: '/articles' },
            { name: title, url: `/articles/${slug}` },
          ]),
        ]}
      />
      <SubpageHero
        breadcrumbs={[
          { label: t('shop:shop.home', 'Home'), href: '/' },
          { label: t('shop:shop.articles', 'Articles'), href: '/articles' },
          { label: title },
        ]}
        eyebrow={t(`common:category.${article.category}`, article.category)}
        title={title}
        subtitle={excerpt}
        primaryCta={{ label: t('articles:detail.primary_cta', 'Beratung buchen'), to: '/contact' }}
        chips={[article.author]}
        icon={<Newspaper />}
        valueChips={[
          { value: article.readTime, label: t('articles:detail.vc_readtime_label', 'Lesezeit') },
          {
            value: t(`common:category.${article.category}`, article.category),
            label: t('articles:detail.vc_category_label', 'Kategorie'),
          },
          { value: article.date, label: t('articles:detail.vc_date_label', 'Veröffentlicht') },
        ]}
      />
      <div className="bg-slate-50">
        <div className="mx-auto flex max-w-container flex-col gap-10 px-4 py-12 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)] lg:items-start lg:gap-12 lg:px-0 lg:py-16">
          <article className="space-y-8 text-gray-700">
            <Reveal width="100%">
              {articleImage && getArticleImageUrl(articleImage) && (
                <div className="relative mb-8 w-full overflow-hidden rounded-2xl aspect-[8/3] bg-slate-100">
                  <img
                    src={getArticleImageUrl(articleImage)}
                    alt={title}
                    width={800}
                    height={300}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-brand-primary/20 mix-blend-multiply"
                  />
                </div>
              )}

              <div className="space-y-6">
                {Array.isArray(translatedSections) && translatedSections.map(renderSection)}
              </div>

              <div className="mt-8 rounded-2xl bg-brand-primary/5 p-6 text-sm leading-relaxed text-gray-700 sm:text-base">
                {t(
                  'shop:shop.articleDisclaimer',
                  "Regular check-ups and proactive care are the foundation of long-term health. If you have questions, don't hesitate to reach out to a medical professional.",
                )}
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  {t(
                    'shop:shop.shareArticle',
                    'Liked this article? Share it with your friends and family.',
                  )}
                </span>
                <Button to="/articles" variant="secondary">
                  {t('shop:shop.backToArticles', 'Back to Overview')}
                </Button>
              </div>

              {/* Suggested articles for mobile / small screens */}
              {otherArticles.length > 0 && (
                <section className="mt-10 space-y-4 lg:hidden">
                  <h2 className="text-xl font-medium tracking-tight text-heading">
                    {t('shop:shop.suggestedArticles', 'Suggested articles')}
                  </h2>
                  <div className="grid gap-4">
                    {otherArticles.slice(0, 3).map((suggested) => (
                      <Link
                        key={suggested.id}
                        to={`/articles/${suggested.slug}`}
                        className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                          {t(`common:category.${suggested.category}`, suggested.category)}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-heading">
                          {t(`articles:${suggested.id}.title`)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {suggested.readTime} · {suggested.date}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Related services for mobile */}
              {relatedServices.length > 0 && (
                <section className="mt-10 space-y-4 lg:hidden">
                  <h2 className="text-xl font-medium tracking-tight text-heading">
                    {t('home:services.caption', 'Passende Diagnostik')}
                  </h2>
                  <div className="grid gap-4">
                    {relatedServices.map((s) => (
                      <Link
                        key={s.id}
                        to={`/diagnostics/${s.id}`}
                        className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
                      >
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-secondary transition-colors">
                          {t(`home:services.${s.translationKey}.title`, s.title)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {t(`home:services.${s.translationKey}.description`, s.description)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </Reveal>
          </article>

          {/* Sidebar for desktop */}
          <PageSidebar
            widgets={
              [
                ...(otherArticles.length > 0
                  ? [
                      {
                        kind: 'articles',
                        titleKey: 'shop:shop.moreArticles',
                        titleFallback: 'More articles',
                        variant: 'card',
                        limit: 4,
                        hideOnMobile: true,
                        items: otherArticles.map((suggested) => ({
                          id: suggested.id,
                          slug: suggested.slug,
                          category: suggested.category,
                          readTime: suggested.readTime,
                          date: suggested.date,
                        })),
                      },
                    ]
                  : []),
                ...(relatedServices.length > 0
                  ? [
                      {
                        kind: 'services',
                        titleKey: 'home:services.caption',
                        titleFallback: 'Passende Diagnostik',
                        items: relatedServices.map((s) => ({
                          id: s.id,
                          translationKey: s.translationKey,
                          title: s.title,
                          icon: s.icon,
                        })),
                      },
                    ]
                  : []),
                { kind: 'contact' },
              ] as SidebarWidget[]
            }
          />
        </div>
      </div>

      <FinalCtaSection roiHref="/#roi-rechner" />
    </PageTransition>
  )
}

export default ArticlePage
