import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEOHead, createArticleSchema, createBreadcrumbSchema } from '../components/seo'
import { Button } from '../components/ui/Button'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import { useArticles } from '../hooks/useArticles'
import { articleDateIso, formatArticleDate, parseReadMinutes } from '../lib/articleMeta'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Alert } from '../components/ui/Alert'

// Local UI types for the discriminated-union section rendering.
type BaseSection = { heading?: string; image?: string }
type TextSection = BaseSection & { type?: 'text'; paragraphs?: string[]; listItems?: string[] }
type TableSection = BaseSection & { type: 'table'; headers: string[]; rows: string[][] }
type InfoboxSection = BaseSection & { type: 'infobox'; content: string }
type KeyPointsSection = BaseSection & {
  type: 'key_points'
  points: { title: string; description: string }[]
}
type ArticleSection = TextSection | TableSection | InfoboxSection | KeyPointsSection

type KeyStat = { value: string; label: string }

/** Split"Term: rest" so the lead term can be emphasised in bullet lists. */
const splitLeadTerm = (item: string): [string | null, string] => {
  const idx = item.indexOf(': ')
  if (idx > 0 && idx < 42) return [item.slice(0, idx), item.slice(idx + 2)]
  return [null, item]
}

const ArticlePage = () => {
  const { t, i18n } = useTranslation(['articles', 'shop', 'common', 'home'])
  const { slug } = useParams<{ slug: string }>()

  const { article, loading, error } = useArticles(slug)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <>
        {/* Ohne eigenen Head lieferte dieser Zweig einen LEEREN Helmet-Titel.
            Damit gewann der statische Fallback aus index.html: ein unbekannter
            Slug kam als "IglooPro POC-Reader | …" mit dem IglooPro-Verkaufstext
            als Description und robots "index, follow" zurueck. notFound setzt
            eigenen Titel, robots noindex, follow, unterdrueckt canonical und
            hreflang und laesst server.ts einen echten 404 senden. */}
        <SEOHead
          title={t('shop:shop.articleNotFound', 'Article not found')}
          description={t(
            'common:notFound.seo.description',
            'Die angeforderte Seite konnte nicht gefunden werden.',
          )}
          notFound
        />
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
              <h1 className="text-2xl font-semibold text-heading">
                {t('shop:shop.articleNotFound', 'Article not found')}
              </h1>
              <Button to="/articles">{t('shop:shop.backToArticles', 'Back to Overview')}</Button>
            </>
          )}
        </div>
      </>
    )
  }

  // (b) Sichtbare Breadcrumb und BreadcrumbList aus derselben Quelle speisen.
  const crumbHome = t('common:nav.home', 'Startseite')
  const crumbArticles = t('shop:shop.articles', 'Artikel')

  // (d) Datum und Lesezeit stehen englisch in den Rohdaten. Sichtbar wird in
  //     der aktiven Locale formatiert, maschinenlesbar bleibt ISO-8601.
  const readMinutes = parseReadMinutes(article.readTime)
  const readTimeLabel =
    readMinutes === null
      ? article.readTime
      : t('articles:detail.read_time', { minutes: readMinutes, defaultValue: article.readTime })
  const publishedIso = articleDateIso(article.date)

  const title = t(`articles:${article.id}.title`)
  const excerpt = t(`articles:${article.id}.excerpt`)
  const category = t(`common:category.${article.category}`, article.category)
  const translatedSections = t(`articles:${article.id}.sections`, {
    returnObjects: true,
  }) as ArticleSection[]

  const keyStatsRaw = t(`articles:${article.id}.keyStats`, {
    returnObjects: true,
    defaultValue: [],
  })
  const keyStats: KeyStat[] = Array.isArray(keyStatsRaw) ? (keyStatsRaw as KeyStat[]) : []

  const renderSection = (section: ArticleSection, index: number) => {
    const sType = section.type || 'text'

    switch (sType) {
      case 'table':
        return (
          <section key={index} className="scroll-mt-28 space-y-4 overflow-x-auto">
            {section.heading && (
              <h2 className="text-2xl font-medium tracking-tight text-heading">
                {section.heading}
              </h2>
            )}
            <table className="w-full min-w-[560px] border-collapse text-left text-sm text-gray-700 sm:text-base">
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
        // Teal left-border callout (no box) — matches the reading-focused layout.
        return (
          <section key={index} className="my-9 border-l-[3px] border-accent pl-6">
            {section.heading && (
              <span className="font-semibold text-heading">{section.heading}: </span>
            )}
            <span className="text-[17px] leading-[1.8] text-gray-700">
              {(section as InfoboxSection).content}
            </span>
          </section>
        )
      case 'key_points':
        return (
          <section key={index} className="scroll-mt-28 space-y-6">
            {section.heading && (
              <h2 className="text-2xl font-medium tracking-tight text-heading">
                {section.heading}
              </h2>
            )}
            <div className="grid gap-6 sm:grid-cols-3">
              {(section as KeyPointsSection).points.map((point, pIndex) => (
                <div key={pIndex} className="rounded-xl border border-slate-200 bg-white p-7">
                  <h3 className="mb-2 font-medium text-heading">{point.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-700">{point.description}</p>
                </div>
              ))}
            </div>
          </section>
        )
      case 'text':
      default: {
        const textSection = section as TextSection
        return (
          <section key={index} className="scroll-mt-28 space-y-5">
            {textSection.heading && (
              <h2 className="text-2xl font-medium tracking-tight text-heading">
                {textSection.heading}
              </h2>
            )}
            {textSection.paragraphs?.map((paragraph, pIndex) => (
              <p key={pIndex} className="text-[17px] leading-[1.8] text-gray-700">
                {paragraph}
              </p>
            ))}
            {textSection.listItems && (
              <ul className="space-y-3">
                {textSection.listItems.map((item, lIndex) => {
                  const [term, rest] = splitLeadTerm(item)
                  return (
                    <li key={lIndex} className="flex gap-3 text-[17px] leading-[1.8] text-gray-700">
                      <span
                        aria-hidden="true"
                        className="mt-[0.85em] h-px w-4 flex-shrink-0 bg-accent"
                      />
                      <span>
                        {term && <strong className="font-semibold text-heading">{term}: </strong>}
                        {rest}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )
      }
    }
  }

  return (
    <PageTransition>
      <SEOHead
        title={title}
        description={excerpt}
        ogType="article"
        article={{
          publishedTime: publishedIso,
          author: article.author,
          section: article.category,
        }}
        structuredData={[
          createArticleSchema({
            headline: title,
            description: excerpt,
            image: '/og-image.jpg',
            url: `/articles/${slug}`,
            datePublished: publishedIso,
            authorName: article.author,
            language: i18n.language,
          }),
          createBreadcrumbSchema([
            { name: crumbHome, url: '/' },
            { name: crumbArticles, url: '/articles' },
            { name: title, url: `/articles/${slug}` },
          ]),
        ]}
      />

      {/* ===================== HERO (Navy, zentriert) ===================== */}
      <section className="relative overflow-hidden bg-brand-deep text-white">
        <div className="mx-auto max-w-3xl px-4 pt-24 pb-16 text-center lg:pt-28">
          <div className="mb-6 flex justify-center">
            <Breadcrumbs
              variant="dark"
              items={[
                { label: crumbHome, href: '/' },
                { label: crumbArticles, href: '/articles' },
                { label: title },
              ]}
            />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
            {category} · {t('articles:detail.longread', 'Long-Read')}
          </span>
          <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-medium tracking-tight lg:text-[42px] lg:leading-[1.15]">
            {title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-white/70">
            <span>{article.author}</span>
            <span aria-hidden>·</span>
            <span>{formatArticleDate(article.date, i18n.language)}</span>
            <span aria-hidden>·</span>
            <span>{readTimeLabel}</span>
          </div>
        </div>
      </section>

      {/* ===================== BODY (zentriert, ohne Sidebar) ===================== */}
      <div className="bg-white">
        <div className="mx-auto max-w-[68ch] px-4 py-14 lg:py-24">
          <Reveal width="100%">
            {/* Lead */}
            <p className="text-xl font-medium leading-[1.7] text-gray-800">{excerpt}</p>

            {/* Key-Stat-Karten (falls vorhanden) */}
            {keyStats.length > 0 && (
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {keyStats.slice(0, 3).map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl bg-brand-deep p-7 text-center text-white"
                  >
                    <div className="text-2xl font-semibold">{s.value}</div>
                    <div className="mt-1 text-xs text-white/70">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Fließtext-Sektionen */}
            <div className="mt-12 space-y-8">
              {Array.isArray(translatedSections) && translatedSections.map(renderSection)}
            </div>

            {/* Navy Schluss-CTA-Karte */}
            <div className="mt-14 rounded-2xl bg-brand-deep p-7 text-center text-white lg:p-7">
              <h2 className="text-2xl font-medium tracking-tight">
                {t('articles:detail.cta_title', 'Rechnen Sie Ihr Einsparpotenzial durch.')}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-white/75">
                {t(
                  'articles:detail.cta_subtitle',
                  'ROI-Rechner oder Beratung — in unter einer Minute.',
                )}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-md bg-accent-strong px-6 py-3 text-sm font-medium text-white transition hover:brightness-110"
                >
                  {t('articles:detail.primary_cta', 'Beratung buchen')}
                </Link>
                {/* <Link> statt <a href="/#roi-rechner">: der rohe Anchor kannte
                    den Sprach-Prefix nicht und landete immer auf /de/. Der
                    Router haengt den Basename an; das Scrollen zum Anker
                    uebernimmt ScrollToHash in App.tsx. */}
                <Link
                  to="/#roi-rechner"
                  className="inline-flex items-center justify-center rounded-md border border-white/25 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  {t('articles:detail.cta_secondary', 'ROI-Rechner')}
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {[
                  t('home:final_cta.chips.free', 'Kostenlos & unverbindlich'),
                  t('home:final_cta.chips.reply', 'Antwort < 24 h'),
                  t('home:final_cta.chips.delivery', 'Lieferung in 3–5 Werktagen'),
                ].map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white ring-1 ring-white/15"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  )
}

export default ArticlePage
