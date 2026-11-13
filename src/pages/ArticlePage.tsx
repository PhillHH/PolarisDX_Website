import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEOHead, createArticleSchema, createBreadcrumbSchema } from '../components/seo'
import { Button } from '../components/ui/Button'
import PageTransition from '../components/ui/PageTransition'
import SubPage from '../components/sub/SubPage'
import SubStage from '../components/sub/SubStage'
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
// SC-015: Tabellen-Stylesheet nur hier statt inline auf jeder Seite.
import tableScrollHref from '../styles/table-scroll.css?url'

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
      <div className="flex h-screen items-center justify-center bg-paper">
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
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-paper p-4">
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
            <link rel="stylesheet" href={tableScrollHref} />
            <div className="table-scroll">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm text-gray-700 sm:text-base">
                <caption className="sr-only">{section.heading || title}</caption>
                <thead>
                  <tr>
                    {(section as TableSection).headers.map((header, i) => (
                      <th
                        key={i}
                        scope="col"
                        className="border-b border-paper-line py-3 font-semibold text-heading"
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
                <div key={pIndex} className="rounded-xl border border-paper-line bg-white p-7">
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

      <SubPage page="articles">
        <article data-article-template={article.slug}>
          {/* Bühne: kompakt, damit das Artikelbild direkt darunter im ersten Bildschirm steht
              (gemessenes LCP-Element, PT25.3). */}
          <SubStage
            className="sc028-stage-article"
            breadcrumbs={[
              { label: crumbHome, href: '/' },
              { label: crumbArticles, href: '/articles' },
              { label: title },
            ]}
            eyebrow={`${category} · ${t('articles:detail.longread', 'Long-Read')}`}
            title={title}
            note={
              <div
                className="sc028-mag-meta"
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
            }
          />

          {/* Lesespalte */}
          <div className="sc028-read-wrap">
            <div className="sc025-inner sc028-read">
              {articleImage ? (
                <figure className="sc028-read-cover">
                  {/* Leeres `alt` bewusst — siehe `renderSectionImage`. */}
                  {/* AP25 PT25.3 (PERF-B04): gemessenes LCP-Element bei 390, 768 und 1440 px —
                      daher nicht lazy, sondern mit Vorrang. Nur dieses eine Bild der Seite. */}
                  <ResponsivePicture
                    image={articleImage}
                    alt={article.imageAlt ?? ''}
                    sizes="(min-width: 900px) 800px, calc(100vw - 2.5rem)"
                    className="h-auto w-full object-cover"
                    priority
                  />
                  {article.imageCaption ? <figcaption>{article.imageCaption}</figcaption> : null}
                </figure>
              ) : null}

              {/* Lead */}
              <p className="sc028-read-lead">{excerpt}</p>

              {/* Kennzahlen (falls vorhanden) */}
              {keyStats.length > 0 && (
                <div className="sc028-keystats">
                  {keyStats.slice(0, 3).map((s) => (
                    <div key={s.label}>
                      <b>{s.value}</b>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Fließtext-Sektionen */}
              <div className="sc028-read-body mt-12 space-y-8">
                {Array.isArray(translatedSections) && translatedSections.map(renderSection)}
              </div>

              {article.sources?.length ? (
                <section className="sc028-read-block">
                  <h2>{t('articles:detail.sources')}</h2>
                  <ol className="sc028-sources">
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
                <section className="sc028-read-block">
                  <h2>{t('articles:ui.articles')}</h2>
                  <div className="sc028-rel">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.id}
                        to={`/articles/${related.slug}`}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                      >
                        {t(`articles:${related.id}.title`)}
                        <span className="sc025-text">{t(`articles:${related.id}.excerpt`)}</span>
                        <span className="sc028-rel-go">{t('articles:ui.readMore')} →</span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {relatedServices.length > 0 && (
                <section className="sc028-read-block">
                  <h2>{t('articles:detail.related_services', 'Passende Diagnostik')}</h2>
                  <div className="sc028-rel">
                    {relatedServices.map(({ service, route }) => (
                      <Link
                        key={service.id}
                        to={route.path}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                      >
                        {t(`home:services.${service.translationKey}.title`, service.title)}
                        <span className="sc025-text">
                          {t(`home:services.${service.translationKey}.description`, '')}
                        </span>
                        <span className="sc028-rel-go">
                          {t('articles:detail.primary_cta', 'Passende Leistung ansehen')} →
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {relatedEpigeneticsRoute ? (
                <section className="sc028-read-block">
                  <h2>{t('common:nav.epigenetics')}</h2>
                  <p className="sc028-lead">
                    {t('home:business_pillars.pillars.epigenetics.text')}
                  </p>
                  <div className="sc028-links">
                    <Link
                      to={relatedEpigeneticsRoute.path}
                      className="sc025-underlink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                    >
                      <span>{t('home:business_pillars.pillars.epigenetics.cta')}</span>
                    </Link>
                  </div>
                </section>
              ) : null}

              {/* Schluss: eine Aufforderung auf Nacht-Navy */}
              <div className="sc028-sales">
                <div>
                  <h2>
                    {t('articles:detail.cta_title', 'Lassen Sie uns über Ihre Praxis sprechen.')}
                  </h2>
                  <p>
                    {t(
                      'articles:detail.cta_subtitle',
                      'Persönliche Beratung — in unter einer Minute angefragt.',
                    )}
                  </p>
                </div>
                <Link
                  to={serviceDetailGeneralSalesTarget}
                  className="sc025-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-dark focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
                >
                  {t('common:nav.cta_quote', 'Angebot anfragen')}
                </Link>
                {/* SC-023 (Owner 2026-11-03): ROI-Rechner-Link entfernt. */}
              </div>
            </div>
          </div>
        </article>
      </SubPage>
    </PageTransition>
  )
}

export default ArticlePage
