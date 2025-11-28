import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SectionHeader from '../components/ui/SectionHeader'
import PrimaryButton from '../components/ui/PrimaryButton'
import { articles, getArticleBySlug } from '../data/articles'

type ArticleSection = {
  heading?: string
  paragraphs: string[]
  listItems?: string[]
  image?: string
}

const ArticlePage = () => {
  const { t } = useTranslation(['articles', 'shop', 'common'])
  const { slug } = useParams<{ slug: string }>()
  const fallbackArticle = articles[0]
  const foundArticle = slug ? getArticleBySlug(slug) : undefined
  const article = foundArticle ?? fallbackArticle
  const otherArticles = articles.filter((a) => a.slug !== article.slug)

  // Get translated content
  const title = t(`articles:${article.id}.title`)
  const excerpt = t(`articles:${article.id}.excerpt`)
  // Get sections from translation. Since sections in translation match structure of data sections (minus image),
  // we need to merge them or iterate carefully.
  // The translation `sections` is an array of objects.
  const translatedSections = t(`articles:${article.id}.sections`, { returnObjects: true }) as ArticleSection[]

  // We need images from the original data
  const dataSections = article.sections || []

  // Find the main image (first image found in sections)
  const articleImage = dataSections.find((s) => s.image)?.image

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

        <div className="relative mx-auto flex min-h-[420px] max-w-[1440px] flex-col justify-end px-4 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
          <div className="max-w-container">
            <div className="mb-4 text-sm text-white/70">
              <Link to="/" className="hover:text-secondary">
                {t('shop:shop.home', 'Home')}
              </Link>{' '}
              / <span>{t('shop:shop.article', 'Article')}</span>
            </div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accentBlue">
              {t(`common:category.${article.category}`, article.category)}
            </p>
            <h1 className="mb-4 text-[40px] leading-[47px] font-medium tracking-[-0.02em] sm:text-[48px] sm:leading-[58px] lg:text-[58px] lg:leading-[69px]">
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
        </div>
      </section>

      <main className="mx-auto flex max-w-container flex-col gap-10 px-4 py-12 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(0,1.4fr)] lg:items-start lg:gap-12 lg:px-0 lg:py-16">
        <article className="space-y-8 text-gray-700">
          <SectionHeader
            caption={t('shop:shop.article', 'Article')}
            title={excerpt}
            align="left"
          />

          <div className="w-full overflow-hidden rounded-lg aspect-[8/3] bg-slate-200">
            {articleImage && (
              <img
                src={new URL(`../assets/${articleImage}`, import.meta.url).href}
                alt={title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {Array.isArray(translatedSections) && translatedSections.map((section, index) => (
            <section key={index} className="space-y-4">
              {section.heading && (
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                  {section.heading}
                </h2>
              )}
              {section.paragraphs && section.paragraphs.map((paragraph, pIndex) => (
                <p
                  key={pIndex}
                  className="text-sm leading-[32px] text-gray-500 sm:text-base"
                >
                  {paragraph}
                </p>
              ))}
              {section.listItems && (
                <ul className="list-disc space-y-2 pl-5 text-sm leading-[28px] text-gray-500 sm:text-base">
                  {section.listItems.map((item, lIndex) => (
                    <li key={lIndex}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div className="rounded-2xl bg-primary/5 p-6 text-sm leading-[28px] text-gray-600 sm:text-base">
            {t('shop:shop.articleDisclaimer', "Regular check-ups and proactive care are the foundation of long-term health. If you have questions, don't hesitate to reach out to a medical professional.")}
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <span>{t('shop:shop.shareArticle', 'Liked this article? Share it with your friends and family.')}</span>
            <PrimaryButton as={Link} to="/" variant="secondary">
              {t('shop:shop.backToHome', 'Back to Home')}
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
        </article>

        {/* Sidebar for desktop */}
        <aside className="space-y-8 lg:sticky lg:top-32">
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

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold tracking-tight text-gray-900">
              {t('shop:shop.needHelp', 'Need help right now?')}
            </h3>
            <p className="mb-3 text-xs leading-relaxed text-gray-500">
              {t('shop:shop.contactText', 'Our medical team is available 24/7 to answer urgent questions and help you decide what to do next.')}
            </p>
            <p className="text-sm font-semibold text-primary">+123 456 789</p>
          </section>
        </aside>
      </main>
    </div>
  )
}

export default ArticlePage
