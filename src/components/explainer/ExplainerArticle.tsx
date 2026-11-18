import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEOHead, createArticleSchema, createBreadcrumbSchema } from '../seo'
import PageTransition from '../ui/PageTransition'
import SubPage from '../sub/SubPage'
import type { SubSheet } from '../sub/styles'
import explainerCss from '../sub/pages/explainer.css?url'
import ExplainerStage from './ExplainerStage'
import { Mechanisms, Pult } from './widgetsRegulation'
import { Cause, Chain, Exerkines, Muscle, Ring, Sorter, Trend } from './widgetsContext'
import {
  EXPLAINER_CHAPTER_IDS,
  fill,
  type ExplainerContentByLocale,
} from '../../content/articles/was-ist-epigenetik'
import { articles } from '../../data/articles'
import {
  getRelatedArticles,
  getRelatedEpigeneticsRoute,
  getRelatedServiceEntries,
} from '../../data/articleRelations'
import { serviceDetailGeneralSalesTarget } from '../../data/serviceDetail'
import { normalizeLanguage } from '../../i18n'
import {
  articleDateIso,
  calculateArticleReadMinutes,
  formatArticleDate,
} from '../../lib/articleMeta'

const ARTICLE_ID = 'what_is_epigenetics'
/** Das Stylesheet dieser einen Seite; es setzt `--sc028-explainer` als Kennung auf `:root`. */
const EXPLAINER_SHEET: SubSheet = { href: explainerCss, mark: '--sc028-explainer' }
const BODY_ID = 'xp-body'
const LINK_FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2'

/**
 * SC-031 (Owner 2026-11-18: „Setze das mal mehrsprachig in Preview um", Entwurf „Reise ins
 * Innere"): der interaktive Artikel „Was ist Epigenetik?". Eigener Seitenaufbau statt der
 * gemeinsamen Artikelvorlage — große Zoom-Bühne, darunter je Kapitel ein helles Textband (Frage,
 * kurze Antwort, drei Merksätze, ausführlicher Text zum Aufklappen) und ein dunkles Labor-Band mit
 * Bausteinen zum Ausprobieren. Eintrag im Artikel-Verzeichnis, Kopfdaten, Pfad und Verweise folgen
 * der Artikelvorlage; die Texte liegen x10 in `content/articles/was-ist-epigenetik/` und kommen
 * über das Routenmodul `pages/articles/was-ist-epigenetik.tsx` (im Browser nur die eigene Sprache).
 */
const ExplainerArticle = ({ contentByLocale }: { contentByLocale: ExplainerContentByLocale }) => {
  const { t, i18n } = useTranslation(['articles', 'common', 'home'])
  const article = articles.find((candidate) => candidate.id === ARTICLE_ID)
  if (!article) throw new Error(`${ARTICLE_ID}: published article inventory entry missing`)

  // Im Browser ist genau die Sprache aus der URL geladen (siehe `loadExplainerContent`).
  const content =
    contentByLocale[normalizeLanguage(i18n.resolvedLanguage)] ?? Object.values(contentByLocale)[0]
  if (!content) throw new Error(`${ARTICLE_ID}: article content missing`)
  const { ui, widgets } = content
  const title = t(`articles:${ARTICLE_ID}.title`)
  const seoTitle = t(`articles:${ARTICLE_ID}.seo.title`, title)
  const excerpt = t(`articles:${ARTICLE_ID}.excerpt`)
  const crumbHome = t('common:nav.home', 'Startseite')
  const crumbArticles = t('articles:ui.articles')
  const publishedIso = articleDateIso(article.datePublished)
  const readMinutes = calculateArticleReadMinutes(content.intro, content.chapters, content.closing)
  const relatedArticles = getRelatedArticles(article)
  const relatedServices = getRelatedServiceEntries(article)
  const epigeneticsRoute = getRelatedEpigeneticsRoute(article)
  const url = `/articles/${article.slug}`

  const labs: ReactNode[][] = [
    [<Pult key="pult" texts={widgets} ui={ui} />],
    [<Mechanisms key="mechanisms" texts={widgets} ui={ui} />],
    [<Ring key="ring" texts={widgets} ui={ui} />, <Cause key="cause" texts={widgets} ui={ui} />],
    [<Chain key="psy" texts={widgets} ui={ui} chain="chainPsy" />],
    [
      <Muscle key="muscle" texts={widgets} ui={ui} />,
      <Chain key="train" texts={widgets} ui={ui} chain="chainTrain" />,
    ],
    [<Trend key="trend" texts={widgets} ui={ui} />],
    [<Exerkines key="exer" texts={widgets} ui={ui} />],
    [<Sorter key="sort" texts={widgets} ui={ui} />],
  ]

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
            url,
            datePublished: publishedIso,
            authorName: article.author,
            language: i18n.language,
          }),
          createBreadcrumbSchema(
            [
              { name: crumbHome, url: '/' },
              { name: crumbArticles, url: '/articles' },
              { name: title, url },
            ],
            i18n.language,
          ),
        ]}
      />

      <SubPage sheet={EXPLAINER_SHEET}>
        <article className="xp" data-article-template={article.slug}>
          <ExplainerStage
            title={title}
            stage={content.stage}
            bodyId={BODY_ID}
            breadcrumbs={[
              { label: crumbHome, href: '/' },
              { label: crumbArticles, href: '/articles' },
              { label: title },
            ]}
          />

          {/* `data-sub-section`: Die Lichtlinie der Unterseiten bleibt je Abschnitt im Rand. Ein
              Kapitel (Textband und Labor) zählt als ein Abschnitt — die Linie wechselt die Seite
              nur im freien Raum zwischen zwei Kapiteln. */}
          <div id={BODY_ID} className="xp-body">
            <section className="sc025-s" data-sub-section>
              <div className="sc025-inner">
                <div className="sc025-head">
                  <span className="sc025-kicker">{content.intro.eyebrow}</span>
                  <h2 className="sc025-h2">{content.intro.title}</h2>
                  <p>{content.intro.lead}</p>
                </div>
                <div className="sc025-cols3">
                  {content.intro.steps.map((step, index) => (
                    <div key={step.title}>
                      <span className="xp-n" aria-hidden="true">
                        0{index + 1}
                      </span>
                      <h3>{step.title}</h3>
                      <p className="sc025-text">{step.text}</p>
                    </div>
                  ))}
                </div>
                <p
                  className="sc028-mag-meta"
                  aria-label={t('articles:detail.vc_date_label', 'Veröffentlicht')}
                >
                  <span>{article.author}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={publishedIso}>
                    {formatArticleDate(article.datePublished, i18n.language)}
                  </time>
                  <span aria-hidden="true">·</span>
                  <span data-reading-minutes={readMinutes}>
                    {t('articles:detail.read_time', { minutes: readMinutes })}
                  </span>
                </p>
              </div>
            </section>

            {content.chapters.map((chapter, index) => (
              <div
                key={EXPLAINER_CHAPTER_IDS[index]}
                data-explainer-chapter={index + 1}
                data-sub-section
              >
                <section className="xp-tx" id={EXPLAINER_CHAPTER_IDS[index]}>
                  <div className="sc025-inner xp-tx-g">
                    <div>
                      <p className="sc025-kicker">
                        {ui.chapter} 0{index + 1} · {chapter.nav}
                      </p>
                      <h2 className="sc025-mid">{chapter.question}</h2>
                    </div>
                    <div>
                      <p className="xp-a">{chapter.answer}</p>
                      <ul className="xp-bul">
                        {chapter.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                      <details className="xp-more">
                        <summary>{ui.more}</summary>
                        {chapter.long.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </details>
                    </div>
                  </div>
                </section>
                <section
                  className="sc025-dark xp-lab"
                  aria-label={fill(ui.labAria, { n: index + 1 })}
                >
                  <div className="sc025-inner">
                    <p className="xp-lab-k">
                      {ui.lab} 0{index + 1} · {ui.labHint}
                    </p>
                    <div className={labs[index].length > 1 ? 'xp-lab-l is-two' : 'xp-lab-l'}>
                      {labs[index]}
                    </div>
                  </div>
                </section>
              </div>
            ))}

            {/* Schluss, Quellen und Verweise zählen für die Lichtlinie als ein Abschnitt. */}
            <div data-sub-section>
              <section className="sc025-s xp-end">
                <div className="sc025-inner">
                  <p className="sc025-kicker">{content.closing.eyebrow}</p>
                  <blockquote className="sc025-h2">{content.closing.quote}</blockquote>
                  <p className="sc025-text">{content.closing.text}</p>
                </div>
              </section>

              <section className="xp-src">
                <div className="sc025-inner">
                  <div className="xp-blk xp-blk-src">
                    {article.sources?.length ? (
                      <>
                        <h2>{t('articles:detail.sources')}</h2>
                        <p>{content.sources.intro}</p>
                        <ol data-article-sources>
                          {article.sources.map((source) => (
                            <li key={source.title}>{source.title}</li>
                          ))}
                        </ol>
                      </>
                    ) : null}
                    <p>{content.sources.note}</p>
                  </div>

                  {relatedServices.length > 0 || epigeneticsRoute ? (
                    <div className="xp-blk">
                      <h2>{t('articles:detail.related_services', 'Passende Diagnostik')}</h2>
                      <div className="sc028-rel">
                        {epigeneticsRoute ? (
                          <Link to={epigeneticsRoute.path} className={LINK_FOCUS}>
                            {t('common:nav.epigenetics')}
                            <span className="sc025-text">
                              {t('home:business_pillars.pillars.epigenetics.text')}
                            </span>
                            <span className="sc028-rel-go">
                              {t('home:business_pillars.pillars.epigenetics.cta')} →
                            </span>
                          </Link>
                        ) : null}
                        {relatedServices.map(({ service, route }) => (
                          <Link key={service.id} to={route.path} className={LINK_FOCUS}>
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
                    </div>
                  ) : null}

                  {relatedArticles.length > 0 ? (
                    <div className="xp-blk">
                      <h2>{t('articles:ui.articles')}</h2>
                      <div className="sc028-rel">
                        {relatedArticles.map((related) => (
                          <Link
                            key={related.id}
                            to={`/articles/${related.slug}`}
                            className={LINK_FOCUS}
                          >
                            {t(`articles:${related.id}.title`)}
                            <span className="sc025-text">
                              {t(`articles:${related.id}.excerpt`)}
                            </span>
                            <span className="sc028-rel-go">{t('articles:ui.readMore')} →</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="sc028-sales">
                    <div>
                      <h2>
                        {t(
                          'articles:detail.cta_title',
                          'Lassen Sie uns über Ihre Praxis sprechen.',
                        )}
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
                  </div>
                </div>
              </section>
            </div>
          </div>
        </article>
      </SubPage>
    </PageTransition>
  )
}

export default ExplainerArticle
