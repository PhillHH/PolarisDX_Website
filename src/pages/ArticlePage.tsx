import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEOHead, createArticleSchema, createBreadcrumbSchema } from '../components/seo'
import { Button } from '../components/ui/Button'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import { useArticles } from '../hooks/useArticles'
import { articleDateIso, calculateArticleReadMinutes, formatArticleDate } from '../lib/articleMeta'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Alert } from '../components/ui/Alert'
import { getArticleImageAsset, getArticleImageUrl } from '../assets/articleImages'
import { ResponsivePicture } from '../components/ui/ResponsivePicture'
import {
  getRelatedArticles,
  getRelatedEpigeneticsRoute,
  getRelatedServiceEntries,
} from '../data/articleRelations'
import { serviceDetailGeneralSalesTarget } from '../data/serviceDetail'
import { normalizeLanguage } from '../i18n'
import type {
  ArticleContentByLocale,
  ArticleContentSection,
  ArticleInfoboxSection,
  ArticleKeyPointsSection,
  ArticleTableSection,
  ArticleTextSection,
} from '../content/articles/model'

// Local UI types for the discriminated-union section rendering.
type BaseSection = ArticleContentSection
type TextSection = ArticleTextSection
type TableSection = ArticleTableSection
type InfoboxSection = ArticleInfoboxSection
type KeyPointsSection = ArticleKeyPointsSection
type ArticleSection = ArticleContentSection

type KeyStat = { value: string; label: string }

/** Split"Term: rest" so the lead term can be emphasised in bullet lists. */
const splitLeadTerm = (item: string): [string | null, string] => {
  const idx = item.indexOf(': ')
  if (idx > 0 && idx < 42) return [item.slice(0, idx), item.slice(idx + 2)]
  return [null, item]
}

interface ArticlePageProps {
  articleId?: string
  articleSlug?: string
  contentByLocale?: ArticleContentByLocale
}

const ArticlePage = ({ articleId, articleSlug, contentByLocale }: ArticlePageProps) => {
  const { t, i18n } = useTranslation(['articles', 'common', 'home'])
  const { slug: routeSlug } = useParams<{ slug: string }>()
  const slug = articleSlug ?? routeSlug

  const { article, loading, error } = useArticles(slug)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const localizedContent = contentByLocale?.[normalizeLanguage(i18n.resolvedLanguage)]

  if (error || !article || (articleId && article.id !== articleId) || !localizedContent) {
    return (
      <>
        {/* Ohne eigenen Head lieferte dieser Zweig einen LEEREN Helmet-Titel.
            Damit gewann der statische Fallback aus index.html: ein unbekannter
            Slug kam als "IglooPro POC-Reader | …" mit dem IglooPro-Verkaufstext
            als Description und robots "index, follow" zurueck. notFound setzt
            eigenen Titel, robots noindex, follow, unterdrueckt canonical und
            hreflang und laesst server.ts einen echten 404 senden. */}
        <SEOHead
          title={t('articles:ui.articleNotFound')}
          description={t(
            'common:notFound.seo.description',
            'Die angeforderte Seite konnte nicht gefunden werden.',
          )}
          notFound
        />
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-4">
          {error ? (
            <div className="w-full max-w-md">
              <Alert variant="destructive" title={t('common:errors.root.title')}>
                {error.message || t('articles:ui.articleNotFound')}
              </Alert>
              <div className="mt-6 flex justify-center">
                <Button to="/articles">{t('articles:ui.backToArticles')}</Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-heading">
                {t('articles:ui.articleNotFound')}
              </h1>
              <Button to="/articles">{t('articles:ui.backToArticles')}</Button>
            </>
          )}
        </div>
      </>
    )
  }

  // (b) Sichtbare Breadcrumb und BreadcrumbList aus derselben Quelle speisen.
  const crumbHome = t('common:nav.home', 'Startseite')
  const crumbArticles = t('articles:ui.articles')

  const publishedIso = articleDateIso(article.datePublished)

  const title = t(`articles:${article.id}.title`)
  // Die lange Headline bleibt H1 und JSON-LD-headline; nur der <title> wird
  // gekuerzt, sonst stehen bis zu 121 Zeichen in der Suchergebnisliste.
  const seoTitle = t(`articles:${article.id}.seo.title`, title)
  const excerpt = t(`articles:${article.id}.excerpt`)
  const category = t(`common:category.${article.category}`, article.category)
  const translatedSections = localizedContent.sections
  const keyStats: KeyStat[] = localizedContent.keyStats ?? []
  const readMinutes = calculateArticleReadMinutes(excerpt, translatedSections)
  const readTimeLabel = t('articles:detail.read_time', { minutes: readMinutes })
  const relatedArticles = getRelatedArticles(article)
  const relatedServices = getRelatedServiceEntries(article)
  const relatedEpigeneticsRoute = getRelatedEpigeneticsRoute(article)
  const articleImage = getArticleImageAsset(article.sections[0]?.image)

  const renderSectionImage = (section: BaseSection) => {
    const image = getArticleImageAsset(section.image)
    if (!image) return null
    return (
      <figure className="space-y-3">
        {/* AP24 PT24.5 — das leere `alt` ist eine Entscheidung, kein Versaeumnis.
            Die Abschnittsbilder sind Stimmungsbilder zur Ueberschrift, die
            direkt daneben steht; sie tragen keine Information, die nicht schon
            im Text steht. `imageAlt` (x10 lokalisiert, siehe
            `src/content/articles/model.ts`) ist da, sobald ein Artikel ein
            Bild MIT eigener Aussage bekommt — dann gehoert dort ein Text hin,
            und `imageCaption` daneben. */}
        {/* AP25 PT25.3: Abschnittsbilder liegen unter dem Falz — lazy, responsive. */}
        <ResponsivePicture
          image={image}
          alt={section.imageAlt ?? ''}
          sizes="(min-width: 768px) 68ch, calc(100vw - 2rem)"
          className="h-auto w-full rounded-2xl object-cover"
        />
        {section.imageCaption ? (
          <figcaption className="text-sm leading-relaxed text-gray-700">
            {section.imageCaption}
          </figcaption>
        ) : null}
      </figure>
    )
  }

  const renderSection = (section: ArticleSection, index: number) => {
    const sType = section.type || 'text'

    switch (sType) {
      case 'table':
        return (
          <section key={index} className="scroll-mt-28 space-y-4">
            {section.heading && (
              <h2 className="text-2xl font-medium tracking-tight text-heading">
                {section.heading}
              </h2>
            )}
            {/* Der Scroll-Container umschliesst nur noch die Tabelle, nicht mehr
                die ganze Section samt Ueberschrift. .table-scroll blendet den
                Rand-Fade und die Hinweiszeile (duenne Scrollleiste) ein, solange
                seitlich noch Inhalt folgt — bei 375px waren 217px der dritten
                Spalte verdeckt, ohne jede Andeutung. Siehe src/index.css. */}
            <div className="table-scroll">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm text-gray-700 sm:text-base">
                <caption className="sr-only">{section.heading || title}</caption>
                <thead>
                  <tr>
                    {(section as TableSection).headers.map((header, i) => (
                      <th
                        key={i}
                        scope="col"
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
            </div>
            {renderSectionImage(section)}
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
            {renderSectionImage(section)}
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
                  <p className="t-small">{point.description}</p>
                </div>
              ))}
            </div>
            {renderSectionImage(section)}
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
            {renderSectionImage(section)}
          </section>
        )
      }
    }
  }

  return (
    <PageTransition>
      <SEOHead
        title={seoTitle}
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
            image: getArticleImageUrl(article.sections[0]?.image),
            url: `/articles/${slug}`,
            datePublished: publishedIso,
            authorName: article.author,
            language: i18n.language,
          }),
          createBreadcrumbSchema(
            [
              { name: crumbHome, url: '/' },
              { name: crumbArticles, url: '/articles' },
              { name: title, url: `/articles/${slug}` },
            ],
            i18n.language,
          ),
        ]}
      />

      <article data-article-template={article.slug}>
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
            <div
              className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-white/80"
              aria-label={t('articles:detail.vc_date_label', 'Veröffentlicht')}
            >
              <span>{article.author}</span>
              <span aria-hidden>·</span>
              <time dateTime={publishedIso}>
                {formatArticleDate(article.datePublished, i18n.language)}
              </time>
              <span aria-hidden>·</span>
              <span data-reading-minutes={readMinutes}>{readTimeLabel}</span>
            </div>
          </div>
        </section>

        {/* ===================== BODY (zentriert, ohne Sidebar) ===================== */}
        <div className="bg-white">
          <div className="mx-auto max-w-[68ch] px-4 py-14 lg:py-24">
            <Reveal width="100%">
              {/* Lead */}
              <p className="text-xl font-medium leading-[1.7] text-gray-800">{excerpt}</p>

              {articleImage ? (
                <figure className="mt-10 space-y-3">
                  {/* Leeres `alt` bewusst — siehe `renderSectionImage`. */}
                  {/* AP25 PT25.3 (PERF-B04): gemessenes LCP-Element bei 390, 768 und 1440 px —
                      daher nicht lazy, sondern mit Vorrang. Nur dieses eine Bild der Seite. */}
                  <ResponsivePicture
                    image={articleImage}
                    alt={article.imageAlt ?? ''}
                    sizes="(min-width: 768px) 68ch, calc(100vw - 2rem)"
                    className="h-auto w-full rounded-2xl object-cover"
                    priority
                  />
                  {article.imageCaption ? (
                    <figcaption className="text-sm leading-relaxed text-gray-700">
                      {article.imageCaption}
                    </figcaption>
                  ) : null}
                </figure>
              ) : null}

              {/* Key-Stat-Karten (falls vorhanden) */}
              {keyStats.length > 0 && (
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {keyStats.slice(0, 3).map((s) => (
                    <div
                      key={s.label}
                      className="rounded-2xl bg-brand-deep p-7 text-center text-white"
                    >
                      <div className="text-2xl font-semibold">{s.value}</div>
                      <div className="mt-1 text-xs text-white/80">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Fließtext-Sektionen */}
              <div className="mt-12 space-y-8">
                {Array.isArray(translatedSections) && translatedSections.map(renderSection)}
              </div>

              {article.sources?.length ? (
                <section className="mt-14 border-t border-slate-200 pt-10">
                  <h2 className="text-2xl font-medium tracking-tight text-heading">
                    {t('articles:detail.sources')}
                  </h2>
                  <ol className="mt-5 list-decimal space-y-3 pl-5 text-gray-700">
                    {article.sources.map((source) => (
                      <li key={`${source.title}:${source.url ?? ''}`}>
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-accent-strong underline underline-offset-4"
                          >
                            {source.title}
                          </a>
                        ) : (
                          source.title
                        )}
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}

              {relatedArticles.length > 0 && (
                <section className="mt-14 border-t border-slate-200 pt-10">
                  <h2 className="text-2xl font-medium tracking-tight text-heading">
                    {t('articles:ui.articles')}
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.id}
                        to={`/articles/${related.slug}`}
                        className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-accent/40 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                      >
                        <span className="font-medium text-heading group-hover:text-accent-strong">
                          {t(`articles:${related.id}.title`)}
                        </span>
                        <span className="mt-2 block text-sm leading-relaxed text-gray-700">
                          {t(`articles:${related.id}.excerpt`)}
                        </span>
                        <span className="mt-4 inline-flex text-sm font-semibold text-accent-strong">
                          {t('articles:ui.readMore')} →
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {relatedServices.length > 0 && (
                <section className="mt-14 border-t border-slate-200 pt-10">
                  <h2 className="text-2xl font-medium tracking-tight text-heading">
                    {t('articles:detail.related_services', 'Passende Diagnostik')}
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {relatedServices.map(({ service, route }) => (
                      <Link
                        key={service.id}
                        to={route.path}
                        className="group rounded-xl border border-slate-200 bg-slate-50 p-5 transition-colors hover:border-accent/40 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                      >
                        <span className="font-medium text-heading group-hover:text-accent-strong">
                          {t(`home:services.${service.translationKey}.title`, service.title)}
                        </span>
                        <span className="mt-2 block text-sm leading-relaxed text-gray-600">
                          {t(`home:services.${service.translationKey}.description`, '')}
                        </span>
                        <span className="mt-4 inline-flex text-sm font-semibold text-accent-strong">
                          {t('articles:detail.primary_cta', 'Passende Leistung ansehen')} →
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {relatedEpigeneticsRoute ? (
                <section className="mt-10 rounded-2xl border border-accent-border bg-accent-soft p-7">
                  <h2 className="text-2xl font-medium tracking-tight text-heading">
                    {t('common:nav.epigenetics')}
                  </h2>
                  <p className="mt-2 text-gray-700">
                    {t('home:business_pillars.pillars.epigenetics.text')}
                  </p>
                  <Link
                    to={relatedEpigeneticsRoute.path}
                    className="mt-5 inline-flex min-h-11 items-center rounded-md font-semibold text-accent-strong underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    {t('home:business_pillars.pillars.epigenetics.cta')}
                  </Link>
                </section>
              ) : null}

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
                    to={serviceDetailGeneralSalesTarget}
                    className="inline-flex items-center justify-center rounded-md bg-accent-strong px-6 py-3 text-sm font-medium text-white transition hover:brightness-110"
                  >
                    {t('common:nav.cta_quote', 'Angebot anfragen')}
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
              </div>
            </Reveal>
          </div>
        </div>
      </article>
    </PageTransition>
  )
}

export default ArticlePage
