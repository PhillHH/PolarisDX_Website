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
import {
  BefundBlock,
  BefundNotice,
  BlockChromeProvider,
  type Block,
} from '../components/befund/BefundBlocks'
import BefundOverview from '../components/befund/BefundOverview'
import ConsultSteps, { CONSULT_ID } from '../components/befund/ConsultSteps'
import { MerkButton, Merkliste } from '../components/befund/Merkliste'
import ChapterNav, { type Chapter, type NavAction } from '../components/ui/ChapterNav'
import { BEFUND_ORDER, RADAR_VALUES, type BefundSprachen } from '../content/befunde/meta'
import { normalizeLanguage } from '../i18n'
import { useScrollDepth } from '../lib/useScrollDepth'
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

/**
 * Bloecke, die offen bleiben — alles andere liegt hinter einem Aufklapper.
 *
 * Die Auswahl ist keine Geschmacksfrage: `cover` und `principle` tragen die
 * Seite und beantworten, was der Leser zuerst wissen will. Die `callout`-
 * Bloecke sind Pflichthinweise (Beispieldaten, GenDG, keine Diagnose) und
 * duerfen nicht hinter einem Klick verschwinden. `summary` und `contact`
 * bilden den Abschluss mit den Rechtstexten.
 *
 * Zugeklappt werden damit die Wertekapitel — bei Metabolic Health neun
 * `markers`, drei `table` und die Auswertungsuebersicht. Kein Wort geht
 * verloren, der Inhalt bleibt im DOM.
 */
const ALWAYS_OPEN = new Set(['cover', 'principle', 'callout', 'summary', 'contact'])

/** Zahl der Werte in einem Block — steht als zweite Zeile im Aufklapper. */
const entryCount = (b: Block) => {
  if (Array.isArray(b.items)) return b.items.length
  if (Array.isArray(b.rows)) return b.rows.length
  return 0
}

/** Kapitelname: die Ueberschrift ohne Schlusspunkt. */
const toLabel = (title: string) => title.replace(/\s*[.:]\s*$/, '')

interface MusterbefundPageProps {
  /**
   * Slug aus dem Routenmodul. Fehlt er, kommt er wie bisher aus der URL —
   * der `:slug`-Auffangpfad in App.tsx rendert diese Seite weiterhin ohne
   * Props, und ein unbekannter Slug faellt damit unveraendert auf den
   * notFound-Zweig weiter unten.
   */
  slug?: string
  /**
   * Inhalt aus dem Routenmodul. Nur so laedt Vite je Slug einen eigenen
   * Chunk, statt alle sechzig JSON-Dateien in einen gemeinsamen zu packen.
   * Der unbekannte Slug des Auffangpfads liefert bewusst keinen Inhalt und
   * landet dadurch im HTTP-404-Zweig, ohne alle Befunddateien zu importieren.
   */
  befunde?: BefundSprachen
}

const MusterbefundPage = ({ slug: slugProp, befunde }: MusterbefundPageProps = {}) => {
  const { slug: slugParam = '' } = useParams<{ slug: string }>()
  const slug = slugProp ?? slugParam
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

  // Wer aus dem Ueberblick oder der Kapitelleiste auf ein Wertekapitel springt,
  // landet sonst auf einem zugeklappten Block und sieht nur dessen Aufklapper.
  // Steht nach dem Anker-Effekt, damit eine bereits umgeschriebene Marke hier
  // schon die richtige ist.
  useEffect(() => {
    const id = hash.slice(1)
    if (!id) return
    const ziel = document.getElementById(id)
    const aufklapper = ziel?.querySelector('details')
    if (!ziel || !aufklapper || aufklapper.open) return
    aufklapper.open = true
    // Der Browser hat vor dem Aufklappen gescrollt; die Zielhoehe stimmt danach
    // nicht mehr.
    ziel.scrollIntoView()
  }, [slug, hash])

  // Der Effekt oben haengt am Hash. Klickt jemand denselben Anker ein zweites
  // Mal — nachdem er das Kapitel zwischendurch wieder zugeklappt hat —, aendert
  // sich der Hash nicht und der Block bliebe zu. Im Ueberblick zeigen 26
  // Eintraege auf 14 Anker, der Fall tritt im normalen Gebrauch auf.
  useEffect(() => {
    const aufklappen = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]')
      if (!a) return
      const ziel = document.getElementById(a.getAttribute('href')!.slice(1))
      const auf = ziel?.querySelector('details')
      if (!ziel || !auf || auf.open) return
      auf.open = true
      requestAnimationFrame(() => ziel.scrollIntoView())
    }
    document.addEventListener('click', aufklappen)
    return () => document.removeEventListener('click', aufklappen)
  }, [])

  // Der Marker bleibt ein rein defensiver Vertrag für technische Fallbacks.
  const englishFallback = isEnglishFallback(t('_translationStatus', { defaultValue: '' }))

  // Vor dem fruehen Ausstieg fuer unbekannte Slugs: Hooks duerfen nicht hinter
  // einem return stehen.
  useScrollDepth('musterbefund', slug)
  const lang = normalizeLanguage(i18n.language)

  const quelle = befunde
  const befund = quelle?.[lang]
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
          <h1 className="text-3xl font-semibold tracking-tight text-heading">
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
   * Position des Beratungsabschnitts: hinter dem Kapitel "So lesen Sie diesen
   * Befund" und den Pflichthinweisen, die unmittelbar daran haengen — und vor
   * dem ersten Wert des Beispielbefunds. Der Index wird gesucht statt fest
   * verdrahtet, weil die sechs Befunde unterschiedliche Blockfolgen haben.
   *
   * Findet sich kein `principle`-Block, bleibt der Wert -1 und der Abschnitt
   * entfaellt, statt an einer beliebigen Stelle zu landen. Alle sechs Befunde
   * haben ihn; die Bedingung ist die Absicherung fuer einen siebten.
   */
  let consultAfter = blocks.findIndex((b) => b.type === 'principle')
  while (consultAfter >= 0 && blocks[consultAfter + 1]?.type === 'callout') consultAfter += 1

  /**
   * Die Pflichttexte dieses Befunds. Sie stehen im Kontaktblock am Seitenende
   * und werden von dort auch fuer den Hinweisrahmen weiter oben gelesen — eine
   * Quelle, ein Wortlaut, kein zweiter Abstimmungsstand.
   */
  const legalBlock = blocks.find((bl) => bl.type === 'contact')?.legal
  const legal = (Array.isArray(legalBlock) ? legalBlock : []) as {
    title: string
    text: string
  }[]

  /**
   * Anker, Kapitelliste und Hintergrundwechsel in einem Durchgang.
   *
   * Der Wechsel haengt an der POSITION, nicht am Blocktyp — sonst haette jeder
   * Befund einen anderen Rhythmus, weil die Blockfolgen sich unterscheiden.
   * Ein `callout` uebernimmt den Ton seines Vorgaengers, damit der Einschub
   * optisch zu dem gehoert, was er kommentiert.
   */
  const chapters: Chapter[] = []
  const chrome: {
    tint: boolean
    id: string | undefined
    collapsed?: boolean
    label?: string
    hint?: string
    panel?: string
  }[] = []
  // Schleife statt map: `tint` traegt Zustand von Block zu Block weiter. In
  // einem map-Callback ist das eine Zuweisung waehrend des Renderings —
  // react-hooks/immutability verbietet sie, weil der Wert bei einem erneuten
  // Rendering derselben Liste nicht mehr derselbe waere.
  let tint = false
  let markersChapterGesetzt = false
  for (const block of blocks) {
    const isCover = block.type === 'cover'
    if (!isCover && block.type !== 'callout') tint = !tint

    // Die Marke steht im Block. Sie leitet sich aus seiner Rolle ab, nicht
    // aus der uebersetzten Ueberschrift und nicht aus der Position — deshalb
    // ist sie in allen zehn Sprachen dieselbe und ueberlebt jede Umstellung.
    const title = typeof block.title === 'string' ? block.title : ''
    const id = typeof block.id === 'string' ? block.id : undefined
    // Die Einzelwerte verteilen sich auf bis zu neun eigene Bloecke - bei
    // Metabolic Health ueber rund 13.000 px. In der Leiste standen dadurch 18
    // Eintraege, von denen nur ein Teil ins Bild passt. Sie bekommen ein
    // gemeinsames Kapitel; die Anker der einzelnen Bloecke bleiben bestehen,
    // damit der Ueberblick und alte Links weiter dorthin springen.
    if (id && !NOT_A_CHAPTER.has(block.type) && title) {
      if (block.type === 'markers') {
        if (!markersChapterGesetzt) {
          markersChapterGesetzt = true
          chapters.push({ id, label: t('befund.markersChapter') })
        }
      } else {
        chapters.push({ id, label: toLabel(title) })
      }
    }

    // Der Beratungsabschnitt ist kein Block, steht aber zwischen zweien. Sein
    // Kapiteleintrag gehoert damit direkt hinter den des Grundsatzblocks.
    if (block.type === 'principle' && consultAfter >= 0) {
      chapters.push({ id: CONSULT_ID, label: t('consult.caption') })
    }
    // Ohne Ueberschrift gaebe es nichts, was auf dem Aufklapper stehen koennte —
    // ein solcher Block bleibt offen, statt namenlos zu verschwinden.
    const collapsed = !ALWAYS_OPEN.has(block.type) && Boolean(title)
    const n = collapsed ? entryCount(block) : 0
    chrome.push({
      tint: isCover ? false : tint,
      id,
      collapsed,
      label: collapsed ? toLabel(title) : undefined,
      hint: n > 0 ? t('befund.entryCount', { count: n }) : undefined,
      panel: slug,
    })
  }

  const others = BEFUND_ORDER.map((s) => ({
    slug: s,
    panel: samples.find((sample) => sample.slug === s)?.panel ?? s,
  }))

  /**
   * Die Aufforderung in der Kapitelleiste wechselt mit der Lesetiefe.
   *
   * Im ersten Drittel steht der Leser noch vor der Frage, ob dieses Panel
   * ueberhaupt das richtige ist — dort fuehrt der Weg in die
   * Vergleichstabelle. In der Mitte hat er den Aufbau gesehen und will das
   * Dokument mitnehmen. Erst im letzten Drittel steht die Anfrage. Alle drei
   * Beschriftungen sind bestehende Schluessel, es kommt kein neuer Text in
   * zehn Sprachen hinzu.
   */
  const navAktionen: NavAction[] = [
    { to: '/epigenetics#vergleich', label: t('compare.title') },
    // Ohne Musterbefund-Metadaten faellt die mittlere Stufe weg; die Leiste
    // teilt dann in Haelften statt in Drittel.
    ...(meta
      ? [
          {
            href: `${ASSET_BASE}${meta.file}`,
            download: true,
            hrefLang: 'de',
            label: `${t('befund.pdfCta')} · ${t('samples.badge')}`,
          },
        ]
      : []),
    // Der Musterbefund gibt zusaetzlich mit, um welches Panel es geht — das
    // steht dann in der Benachrichtigung und im vorbelegten Freitext.
    {
      to: `/contact?intent=quote&source=epigenetics&panel=${encodeURIComponent(befund.panel)}#kontaktformular`,
      label: t('hero.ctaQuote'),
    },
  ]

  /**
   * Titel und Beschreibung fuer die Suche.
   *
   * Die Vorlage "Musterbefund {{panel}}" gab allen sechs Seiten denselben
   * Bau; in der Suche standen sie damit fuer dieselbe Frage. befund.seo.<slug>
   * traegt je Panel einen eigenen Titel, der die Frage nennt, auf die diese
   * Seite antwortet. Fehlt der Eintrag — etwa fuer ein spaeter dazukommendes
   * Panel —, greift die alte Vorlage weiter.
   */
  const seoTitel = t(`befund.seo.${slug}.title`, {
    defaultValue: t('befund.seoTitle', { panel: befund.panel }),
  })
  const seoBeschreibung = t(`befund.seo.${slug}.description`, {
    defaultValue: t('befund.seoDescription', { panel: befund.panel }),
  })

  return (
    <PageTransition>
      <SEOHead
        title={seoTitel}
        description={seoBeschreibung}
        ogImage="/og-epigenetics.jpg"
        /* Die Seite traegt ein Article-Schema — og:type muss dasselbe sagen. */
        ogType="article"
        structuredData={[
          /*
           * Bewusst 'Article' und nicht 'MedicalWebPage': diese Seiten zeigen
           * einen Beispielbefund mit frei erfundenen Werten und erklaeren den
           * Aufbau eines Befunds. Sie geben keine medizinische Auskunft. Der
           * medizinische Typ wuerde Suchmaschinen genau das signalisieren —
           * auf einer IVD-Seite die falsche Aussage.
           */
          createArticleSchema({
            headline: seoTitel,
            description: seoBeschreibung,
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

      <div className="bg-white text-heading" lang={englishFallback ? 'en' : undefined}>
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
              /* Der Grundsatzblock rechnet daraus seine Miniatur. */
              blocks={blocks}
              slug={slug}
              radarValues={RADAR_VALUES[slug]}
              scrollHint={t('compare.scrollHint')}
            />
            {/* Der feste Hinweisrahmen steht hinter dem Grundsatzblock — auf
                allen sechs Panels an derselben Stelle, bevor der erste Wert
                kommt. Er nimmt keinem der bisherigen Hinweise seinen Platz. */}
            {block.type === 'principle' ? (
              <BefundNotice
                caption={t('befund.noticeTitle')}
                legal={legal}
                tint={chrome[index].tint}
              />
            ) : null}
            {/* "So wird daraus eine Beratung" — der Abschnitt bleibt offen und
                traegt seinen eigenen dunklen Rahmen. Damit bricht er den
                Wechsel weiss/hell der Bloecke nicht, sondern setzt sich
                bewusst davon ab. */}
            {index === consultAfter ? <ConsultSteps slug={slug} /> : null}
            {/* Die Kapitelleiste steht direkt hinter dem Deckblatt: sie soll
                mitscrollen, aber den Hero nicht ueberdecken. */}
            {block.type === 'cover' ? (
              <>
                <ChapterNav
                  chapters={chapters}
                  chaptersLabel={t('befund.navChapters')}
                  back={{ to: '/epigenetics#musterbefunde', label: t('befund.navBack') }}
                  actions={navAktionen}
                  switcher={{
                    current: befund.panel,
                    currentSlug: slug,
                    entries: others,
                    label: t('befund.othersTitle'),
                    hrefFor: (s) => `/epigenetics/musterbefund/${s}`,
                  }}
                />
                {/* Der Ueberblick steht vor allem anderen: er beantwortet die
                    erste Frage eines Befundlesers — was ist auffaellig — ohne
                    dass er dafuer die Wertekapitel aufklappen muss. Jeder
                    Eintrag springt zu seinem Abschnitt. */}
                <BefundOverview
                  blocks={blocks}
                  labels={{
                    caption: t('befund.overviewCaption'),
                    title: t('befund.overviewTitle'),
                    lead: t('befund.overviewLead'),
                    red: t('befund.toneRed'),
                    amber: t('befund.toneAmber'),
                    green: t('befund.toneGreen'),
                  }}
                />
              </>
            ) : null}
          </BlockChromeProvider>
        ))}

        {/* Hinweisband und Weg zurueck. Der Beispieldaten-Hinweis steht hier ein
            zweites Mal, weil die Seite lang ist und die Rechtstexte oben am
            Deckblatt beim Lesen laengst aus dem Blick sind. */}
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">
            {/* Die Merkliste steht vor dem Hinweisband: wer bis hierher
                gelesen hat, entscheidet jetzt. Sie erscheint nur, wenn etwas
                darin steht, und liegt allein im Browser dieses Geraets. */}
            <Merkliste className="mb-6" />
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <p className="max-w-[80ch] text-sm leading-relaxed text-gray-600">
                {t('samples.note')}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {meta ? (
                  <a
                    href={`${ASSET_BASE}${meta.file}`}
                    download
                    hrefLang="de"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-navy-hover"
                  >
                    <Download className="h-4 w-4" />
                    {t('befund.pdfCta')} · {t('samples.badge')}
                  </a>
                ) : null}
                {/* Die Zwischenstufe zwischen Lesen und Anfragen: dieses Panel
                    vormerken, ohne die Seite zu verlassen. */}
                <MerkButton slug={slug} panel={befund.panel} className="bg-white" />
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
              <p className="text-xs font-medium text-gray-600">{t('befund.othersTitle')}</p>
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
