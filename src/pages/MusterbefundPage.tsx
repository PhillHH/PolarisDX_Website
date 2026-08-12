/**
 * MusterbefundPage — /epigenetics/musterbefund/<slug>
 *
 * Der vollstaendige Musterbefund als Webseite. Das PDF bleibt als Download
 * erhalten, aber der Inhalt steht hier: alle Seiten, alle Tabellen, und die
 * Diagramme als SVG aus den Werten gerechnet statt als Bild.
 *
 * FACHLICH/RECHTLICH ABGESTIMMT — bitte nicht ohne Ruecksprache aendern:
 * - Saemtliche Werte sind frei erfundene Beispieldaten. Das steht im Deckblatt,
 *   im Hinweisband und noch einmal in den Rechtstexten am Ende. Alle drei
 *   Stellen gehoeren auf die Seite.
 * - Der Laborpartner wird nirgends namentlich genannt.
 * - Kein CE-/IVDR-Zeichen: es sind Labordienstleistungen, keine IVD.
 * - Keine Preise, keine Befundlaufzeit.
 *
 * Die Inhalte liegen als JSON in src/content/befunde/ und sind aus den
 * Quell-PDFs abgeleitet. Nach einem Neubau der PDFs dort nachziehen.
 */

import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageFallbackNotice from '../components/ui/LanguageFallbackNotice'
import { isEnglishFallback } from '../lib/translationStatus'
import { ArrowLeft, ArrowUp, Download } from 'lucide-react'
import { SEOHead, createBreadcrumbSchema, createArticleSchema } from '../components/seo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import PageTransition from '../components/ui/PageTransition'
import { BefundBlock, BlockChromeProvider, type Block } from '../components/befund/BefundBlocks'
import ChapterNav, { type Chapter } from '../components/ui/ChapterNav'
import { BEFUNDE, BEFUND_ORDER, RADAR_VALUES } from '../content/befunde'
import { BEFUND_IMAGES } from '../assets/epigenetics/befundImages'
import { LEGACY_ANCHORS } from '../content/befunde/legacyAnchors'

const ASSET_BASE = '/downloads/epigenetics/'

/**
 * Tag, an dem die sechs Musterbefunde als Webseiten online gingen. Fest
 * verdrahtet, weil ein gerechnetes Datum bei jedem Build ein neues
 * datePublished erzeugen wuerde.
 */
const PUBLISHED = '2026-08-10'

/** Blocktypen, die kein eigenes Kapitel sind: Deckblatt und Einschuebe. */
const NOT_A_CHAPTER = new Set(['cover', 'callout'])

/** Kapitelname: die Ueberschrift ohne Schlusspunkt. */
const toLabel = (title: string) => title.replace(/\s*[.:]\s*$/, '')

const MusterbefundPage = () => {
  const { slug = '' } = useParams<{ slug: string }>()
  const { hash } = useLocation()
  const { t, i18n } = useTranslation('epigenetics')

  // Steht bewusst VOR dem vorzeitigen return fuer den unbekannten Slug: React
  // ordnet Hooks ueber ihre Aufrufreihenfolge zu. Lag der Effekt dahinter, lief
  // die Komponente je nach Slug mit zwei oder drei Hooks.
  // Wer einen Link mit einer alten Marke verschickt hat, soll trotzdem am
  // richtigen Abschnitt ankommen. Die Tabelle darf verschwinden, sobald diese
  // Links niemanden mehr erreichen.
  useEffect(() => {
    const alt = hash.slice(1)
    if (!alt || document.getElementById(alt)) return
    const neu = LEGACY_ANCHORS[slug]?.[alt]
    const ziel = neu ? document.getElementById(neu) : null
    if (!ziel || !neu) return
    window.history.replaceState(null, '', `#${neu}`)
    ziel.scrollIntoView()
  }, [slug, hash])
  // Acht Sprachen zeigen hier englischen Text — das muss ausgezeichnet werden.
  const englishFallback = isEnglishFallback(t('_translationStatus', { defaultValue: '' }))
  const lang = i18n.language?.startsWith('de') ? 'de' : 'en'

  const befund = BEFUNDE[slug]?.[lang] ?? BEFUNDE[slug]?.de
  const samples = Array.isArray(t('samples.items', { returnObjects: true }))
    ? (t('samples.items', { returnObjects: true }) as {
        slug: string
        panel: string
        file: string
      }[])
    : []
  const meta = samples.find((s) => s.slug === slug)

  if (!befund) {
    return (
      <PageTransition>
        {/* notFound laesst den SSR-Server mit echtem HTTP 404 antworten.
            noindex steht bewusst daneben: der 404-Mechanismus existiert noch
            nicht in jedem Stand, und ohne ihn waere diese Seite sonst
            indexierbar. */}
        <SEOHead
          title={t('befund.notFoundTitle')}
          description={t('befund.notFoundText')}
          notFound
          noindex
        />
        <div className="mx-auto max-w-container px-4 py-24 lg:px-0 lg:py-32">
          <h1 className="text-3xl font-semibold tracking-tight text-text-heading">
            {t('befund.notFoundTitle')}
          </h1>
          <p className="mt-4 max-w-[62ch] text-lg text-gray-600">{t('befund.notFoundText')}</p>
          <Link
            to="/epigenetics#musterbefunde"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-navy-hover"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('befund.backToAll')}
          </Link>
        </div>
      </PageTransition>
    )
  }

  const blocks = (befund.blocks ?? []) as Block[]

  /**
   * Anker, Kapitelliste und Hintergrundwechsel in einem Durchgang.
   *
   * Der Wechsel haengt an der POSITION, nicht am Blocktyp — sonst haette jeder
   * Befund einen anderen Rhythmus, weil die Blockfolgen sich unterscheiden.
   * Ein `callout` uebernimmt den Ton seines Vorgaengers, damit der Einschub
   * optisch zu dem gehoert, was er kommentiert.
   */
  const chapters: Chapter[] = []
  const chrome: { tint: boolean; id: string | undefined }[] = []
  // Schleife statt map: `tint` traegt Zustand von Block zu Block weiter. In
  // einem map-Callback ist das eine Zuweisung waehrend des Renderings —
  // react-hooks/immutability verbietet sie, weil der Wert bei einem erneuten
  // Rendering derselben Liste nicht mehr derselbe waere.
  let tint = false
  for (const block of blocks) {
    const isCover = block.type === 'cover'
    if (!isCover && block.type !== 'callout') tint = !tint

    // Die Marke steht im Block. Sie leitet sich aus seiner Rolle ab, nicht
    // aus der uebersetzten Ueberschrift und nicht aus der Position — deshalb
    // ist sie in allen zehn Sprachen dieselbe und ueberlebt jede Umstellung.
    const title = typeof block.title === 'string' ? block.title : ''
    const id = typeof block.id === 'string' ? block.id : undefined
    if (id && !NOT_A_CHAPTER.has(block.type) && title) {
      chapters.push({ id, label: toLabel(title) })
    }
    chrome.push({ tint: isCover ? false : tint, id })
  }

  const others = BEFUND_ORDER.map((s) => ({
    slug: s,
    panel: BEFUNDE[s]?.[lang]?.panel ?? BEFUNDE[s]?.de?.panel ?? s,
  }))

  return (
    <PageTransition>
      <SEOHead
        title={t('befund.seoTitle', { panel: befund.panel })}
        description={t('befund.seoDescription', { panel: befund.panel })}
        ogImage="/og-epigenetics.jpg"
        structuredData={[
          /*
           * Bewusst 'Article' und nicht 'MedicalWebPage': diese Seiten zeigen
           * einen Beispielbefund mit frei erfundenen Werten und erklaeren den
           * Aufbau eines Befunds. Sie geben keine medizinische Auskunft. Der
           * medizinische Typ wuerde Suchmaschinen genau das signalisieren —
           * auf einer IVD-Seite die falsche Aussage.
           */
          createArticleSchema({
            headline: t('befund.seoTitle', { panel: befund.panel }),
            description: t('befund.seoDescription', { panel: befund.panel }),
            image: BEFUND_IMAGES[slug]?.src2x ?? '/og-epigenetics.jpg',
            url: `/epigenetics/musterbefund/${slug}`,
            language: i18n.language,
            datePublished: PUBLISHED,
            articleType: 'Article',
          }),
          createBreadcrumbSchema(
            [
              { name: t('breadcrumb.home'), url: '/' },
              { name: t('breadcrumb.current'), url: '/epigenetics' },
              { name: t('samples.caption'), url: '/epigenetics#musterbefunde' },
              { name: befund.panel, url: `/epigenetics/musterbefund/${slug}` },
            ],
            i18n.language,
          ),
        ]}
      />

      <div className="bg-white text-text-heading" lang={englishFallback ? 'en' : undefined}>
        {englishFallback ? <LanguageFallbackNotice lang={i18n.language} /> : null}
        <div className="bg-brand-deep">
          <div className="mx-auto max-w-container px-4 pt-28 lg:px-0 lg:pt-32">
            <Breadcrumbs
              variant="dark"
              items={[
                { label: t('breadcrumb.home'), href: '/' },
                { label: t('breadcrumb.current'), href: '/epigenetics' },
                { label: t('samples.caption'), href: '/epigenetics#musterbefunde' },
                { label: befund.panel },
              ]}
            />
          </div>
        </div>

        {blocks.map((block, index) => (
          <BlockChromeProvider key={`${block.type}-${index}`} value={chrome[index]}>
            <BefundBlock
              block={block}
              radarValues={RADAR_VALUES[slug]}
              scrollHint={t('compare.scrollHint')}
            />
            {/* Die Kapitelleiste steht direkt hinter dem Deckblatt: sie soll
                mitscrollen, aber den Hero nicht ueberdecken. */}
            {block.type === 'cover' ? (
              <ChapterNav
                chapters={chapters}
                chaptersLabel={t('befund.navChapters')}
                back={{ to: '/epigenetics#musterbefunde', label: t('befund.navBack') }}
                action={{
                  to: `/contact?intent=quote&source=epigenetics&panel=${encodeURIComponent(befund.panel)}#kontaktformular`,
                  label: t('hero.ctaQuote'),
                }}
                switcher={{
                  current: befund.panel,
                  currentSlug: slug,
                  entries: others,
                  label: t('befund.othersTitle'),
                  hrefFor: (s) => `/epigenetics/musterbefund/${s}`,
                }}
              />
            ) : null}
          </BlockChromeProvider>
        ))}

        {/* Hinweisband und Weg zurueck. Der Beispieldaten-Hinweis steht hier ein
            zweites Mal, weil die Seite lang ist und die Rechtstexte oben am
            Deckblatt beim Lesen laengst aus dem Blick sind. */}
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <p className="max-w-[80ch] text-sm leading-relaxed text-gray-500">
                {t('samples.note')}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {meta ? (
                  <a
                    href={`${ASSET_BASE}${meta.file}`}
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-navy-hover"
                  >
                    <Download className="h-4 w-4" />
                    {t('befund.pdfCta')}
                  </a>
                ) : null}
                <Link
                  to={`/contact?intent=quote&source=epigenetics&panel=${encodeURIComponent(befund.panel)}#kontaktformular`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-strong px-6 py-3.5 text-base font-semibold text-white transition-colors hover:brightness-110"
                >
                  {t('hero.ctaQuote')}
                </Link>
                <Link
                  to="/epigenetics#musterbefunde"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('befund.backToAll')}
                </Link>
                {chapters[0] ? (
                  <a
                    href={`#${chapters[0].id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
                  >
                    <ArrowUp className="h-4 w-4" />
                    {t('befund.toTop')}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="mt-10">
              <p className="text-xs font-medium text-gray-500">{t('befund.othersTitle')}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {others
                  .filter((o) => o.slug !== slug)
                  .map((o) => (
                    <Link
                      key={o.slug}
                      to={`/epigenetics/musterbefund/${o.slug}`}
                      className="inline-flex items-center rounded-full border border-slate-300 px-5 py-2.5 text-base font-medium text-brand-deep transition-colors hover:border-brand-primary hover:bg-slate-50"
                    >
                      {o.panel}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default MusterbefundPage
