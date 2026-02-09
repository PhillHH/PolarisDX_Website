import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEOHead, createArticleSchema, createBreadcrumbSchema } from '../components/seo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import SectionHeader from '../components/ui/SectionHeader'
import PrimaryButton from '../components/ui/PrimaryButton'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
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
              <PrimaryButton as={Link} to="/articles">
                {t('shop:shop.backToArticles', 'Back to Overview')}
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900">{t('shop:shop.articleNotFound', 'Article not found')}</h1>
            <PrimaryButton as={Link} to="/articles">
              {t('shop:shop.backToArticles', 'Back to Overview')}
            </PrimaryButton>
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
  const translatedSections = t(`articles:${article.id}.sections`, { returnObjects: true }) as ArticleSection[]

  // We need images from the original data
  const dataSections = article.sections || []

  // Find the main image (first image found in sections)
  const articleImage = dataSections.find((s) => s.image)?.image

  // Resolve related services from the bidirectional mapping
  const relatedServices = article.relatedServiceIds?.length
    ? services.filter(s => article.relatedServiceIds!.includes(s.id))
    : []

  const renderSection = (section: ArticleSection, index: number) => {
    // Safety check for type
    const sType = section.type || 'text'

    switch (sType) {
      case 'table':
        return (
          <section key={index} className="space-y-4 overflow-x-auto">
             {section.heading && (
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                {section.heading}
              </h2>
            )}
            <table className="w-full min-w-[600px] border-collapse text-left text-sm text-gray-600 sm:text-base">
              <thead>
                <tr>
                  {(section as TableSection).headers.map((header, i) => (
                    <th key={i} className="border-b border-gray-200 py-3 font-semibold text-gray-900">
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
          <section key={index} className="my-8 rounded-lg border-l-4 border-accentBlue bg-blue-50/50 p-6 text-gray-700">
             {section.heading && (
              <h3 className="mb-2 text-lg font-semibold text-accentBlue">
                {section.heading}
              </h3>
            )}
            <p className="text-sm leading-relaxed sm:text-base">
              {(section as InfoboxSection).content}
            </p>
          </section>
        )
      case 'key_points':
        return (
          <section key={index} className="space-y-6">
            {section.heading && (
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                {section.heading}
              </h2>
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(section as KeyPointsSection).points.map((point, pIndex) => (
                <div key={pIndex} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h4 className="mb-2 font-semibold text-gray-900">{point.title}</h4>
                  <p className="text-sm text-gray-500">{point.description}</p>
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
          <section key={index} className="space-y-4">
            {textSection.heading && (
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                {textSection.heading}
              </h2>
            )}
            {textSection.paragraphs && textSection.paragraphs.map((paragraph, pIndex) => (
              <p
                key={pIndex}
                className="text-sm leading-[32px] text-gray-500 sm:text-base"
              >
                {paragraph}
              </p>
            ))}
            {textSection.listItems && (
              <ul className="list-disc space-y-2 pl-5 text-sm leading-[28px] text-gray-500 sm:text-base">
                {textSection.listItems.map((item, lIndex) => (
                  <li key={lIndex}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        )
    }
  }

  // Build OG image URL from article image
  const ogImageUrl = articleImage
    ? `https://polarisdx.net/assets/${articleImage}`
    : undefined

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
      <div className="bg-slate-50">
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-deep to-gray-900 text-white">
          <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

          <div className="relative mx-auto flex min-h-[420px] max-w-page flex-col justify-end px-4 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <div className="max-w-container">
                <Breadcrumbs
                  variant="dark"
                  className="mb-4"
                  items={[
                    { label: t('shop:shop.home', 'Home'), href: '/' },
                    { label: t('shop:shop.articles', 'Articles'), href: '/articles' },
                    { label: title },
                  ]}
                />

                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accentBlue">
                  {t(`common:category.${article.category}`, article.category)}
                </p>
                <h1 className="mb-4 text-2xl font-medium tracking-tight sm:text-3xl lg:text-3xl">
                  {title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/80 sm:text-sm">
                  <span>{article.author}</span>
                  <span className="h-1 w-1 rounded-full bg-white/60" />
                  <span>{article.date}</span>
                  <span className="h-1 w-1 rounded-full bg-white/60" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="mx-auto flex max-w-container flex-col gap-10 px-4 py-12 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)] lg:items-start lg:gap-12 lg:px-0 lg:py-16">
          <article className="space-y-8 text-gray-700">
            <Reveal width="100%">
              <SectionHeader
                caption={t('shop:shop.article', 'Article')}
                title={excerpt}
                align="left"
                titleClassName="text-2xl sm:text-3xl lg:text-3xl"
              />

              <div className="relative w-full overflow-hidden rounded-lg aspect-[8/3] bg-slate-200 mt-6">
                {articleImage && getArticleImageUrl(articleImage) && (
                  <>
                    <img
                      src={getArticleImageUrl(articleImage)}
                      alt={title}
                      width={800}
                      height={300}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-brand-primary/20 mix-blend-multiply" />
                  </>
                )}
              </div>

              <div className="space-y-6 mt-8">
                {Array.isArray(translatedSections) && translatedSections.map(renderSection)}
              </div>

              <div className="rounded-2xl bg-brand-primary/5 p-6 text-sm leading-[28px] text-gray-600 sm:text-base mt-8">
                {t('shop:shop.articleDisclaimer', "Regular check-ups and proactive care are the foundation of long-term health. If you have questions, don't hesitate to reach out to a medical professional.")}
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                <span>{t('shop:shop.shareArticle', 'Liked this article? Share it with your friends and family.')}</span>
                <PrimaryButton as={Link} to="/articles" variant="brand-secondary">
                  {t('shop:shop.backToArticles', 'Back to Overview')}
                </PrimaryButton>
              </div>

              {/* Suggested articles for mobile / small screens */}
              {otherArticles.length > 0 && (
                <section className="mt-10 space-y-4 lg:hidden">
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                    {t('shop:shop.suggestedArticles', 'Suggested articles')}
                  </h2>
                  <div className="grid gap-4">
                    {otherArticles.slice(0, 3).map((suggested) => (
                      <Link
                        key={suggested.id}
                        to={`/articles/${suggested.slug}`}
                        className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accentBlue">
                          {t(`common:category.${suggested.category}`, suggested.category)}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-gray-900">
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
                  <h2 className="text-lg font-semibold tracking-tight text-gray-900">
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
          <aside className="space-y-8 lg:sticky lg:top-32">
            <Reveal width="100%" delay={0.2}>
              {otherArticles.length > 0 && (
                <section className="hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:block">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                    {t('shop:shop.moreArticles', 'More articles')}
                  </h2>
                  <div className="space-y-4">
                    {otherArticles.slice(0, 4).map((suggested) => (
                      <Link
                        key={suggested.id}
                        to={`/articles/${suggested.slug}`}
                        className="block rounded-lg p-3 transition hover:bg-slate-50"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accentBlue">
                          {t(`common:category.${suggested.category}`, suggested.category)}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
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

              {/* Related Services Widget */}
              {relatedServices.length > 0 && (
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm mt-8">
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                    {t('home:services.caption', 'Passende Diagnostik')}
                  </h2>
                  <div className="space-y-3">
                    {relatedServices.map((s) => (
                      <Link
                        key={s.id}
                        to={`/diagnostics/${s.id}`}
                        className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-md hover:scale-[1.02]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-brand-secondary transition-colors group-hover:bg-brand-secondary group-hover:text-white">
                            {s.icon}
                          </div>
                          <span className="font-medium text-gray-900 group-hover:text-brand-secondary">
                            {t(`home:services.${s.translationKey}.title`, s.title)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Contact Widget */}
              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm mt-8">
                <h3 className="mb-2 text-sm font-semibold tracking-tight text-gray-900">
                  {t('shop:shop.needHelp', 'Need help right now?')}
                </h3>
                <p className="mb-3 text-xs leading-relaxed text-gray-500">
                  {t('shop:shop.contactText', 'Our medical team is available 24/7 to answer urgent questions and help you decide what to do next.')}
                </p>
                <PrimaryButton as={Link} to="/contact" variant="brand-secondary" className="w-full justify-center">
                  {t('common:nav.contact', 'Kontakt aufnehmen')}
                </PrimaryButton>
              </section>
            </Reveal>
          </aside>
        </div>
      </div>
    </PageTransition>
  )
}

export default ArticlePage
