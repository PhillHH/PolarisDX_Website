import { useEffect } from 'react'
/**
 * EpigeneticsPage — /epigenetics
 *
 * PROGRAMMSEITE der Epigenetik-Strecke. Sie beantwortet genau eine Frage:
 * welche der sechs Analysen passt zu dieser Einrichtung — und wie kommt man an
 * sie heran. Alles, was diese Frage nicht beantwortet, steht seit dem Umbau
 * auf einer eigenen Seite:
 *
 *   /epigenetics/grundlagen   Das Prinzip + Werte verstehen
 *   /epigenetics/studienlage  Belege, Grenzen, GenDG, Rechtshinweis
 *   /epigenetics/unterlagen   alle 18 Blaetter, beide ZIP-Pakete
 *
 * Damit stehen hier fuenf Kapitel statt zehn. Vorbild sind die Anbieter, mit
 * denen Fachanwender diese Seite vergleichen: Programmseite, Testkatalog,
 * "Our Science" und Download-Center sind dort ebenfalls getrennte Seiten, und
 * die Programmseite traegt 6-9 kurze Abschnitte statt einen Fachaufsatz.
 *
 * ALTE ANKER: #prinzip, #werte-verstehen, #studienlage und #downloads stehen in
 * den PDFs und sind extern verlinkt. Sie leiten unten per useEffect auf die
 * jeweilige Unterseite weiter. #musterbefunde und #analysen bleiben hier.
 *
 * FACHLICH/RECHTLICH ABGESTIMMT — bitte nicht ohne Ruecksprache aendern:
 * - Der Laborpartner wird nirgends namentlich genannt ("Kooperationspartner").
 * - Kein CE-/IVDR-Zeichen: es sind Labordienstleistungen, keine IVD.
 * - Der Hinweistext (contact.note) gehoert auf diese Seite — hier wird das
 *   Angebot gemacht. Er steht zusaetzlich auf der Studienlage-Seite.
 * - Keine Preise ("B2B nach Absprache") und keine Befundlaufzeit.
 *
 * TYPOGRAFIE: Fliesstext laeuft auf text-base und ab lg auf 17px/2rem. Das ist
 * bewusst groesser als der Rest der Site — die Seite ist eine Lesestrecke fuer
 * Fachpublikum, keine Uebersichtsseite.
 */

import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { trackEvent } from '../lib/tracking'
import { ArrowRight, ChevronDown, Download, FileText, FlaskConical } from 'lucide-react'
import { SEOHead, createBreadcrumbSchema, createFAQSchema } from '../components/seo'
import type { FAQItem } from '../components/seo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import SectionHeader from '../components/ui/SectionHeader'
import EpigeneticsPanels from '../components/sections/EpigeneticsPanels'
import PageTransition from '../components/ui/PageTransition'
import ChapterNav, { type Chapter, type NavAction } from '../components/ui/ChapterNav'
import Reveal from '../components/ui/Reveal'
import ConsultSteps from '../components/befund/ConsultSteps'
import { ScaleRamp } from '../components/befund/BefundCharts'
import { isEnglishFallback } from '../lib/translationStatus'
import { useScrollDepth } from '../lib/useScrollDepth'

// public/ wird nach dist/client kopiert — die oeffentliche URL ist /downloads/...
const ASSET_BASE = '/downloads/epigenetics/'

// Die drei Eintraege in basics.scales stehen in allen Sprachen in derselben
// Reihenfolge — Ampel, Prozent, Jahre. Sie tragen keinen eigenen Typschluessel,
// deshalb haengt die Rampe positionell daran. Kommt eine vierte Ergebnisform
// dazu, faellt sie auf die neutrale Rampe zurueck statt auf eine falsche.
const SCALE_KINDS = ['traffic', 'percent', 'deviation']

// Reveal rendert zwei verschachtelte divs; damit Grid-Karten auf Reihenhoehe
// wachsen, muss h-full auf beide.
const STRETCH = 'h-full [&>div]:h-full'

// Fliesstext, Lead und Kleinlabel — an einer Stelle definiert, damit die
// Lesegroesse ueber alle Sektionen identisch bleibt.
const BODY = 'text-base leading-7 lg:text-[17px] lg:leading-8'
const LEAD = 'text-lg leading-relaxed text-gray-600 lg:text-xl lg:leading-relaxed'
const LABEL = 'text-xs font-semibold uppercase tracking-[0.16em] text-gray-600'

/**
 * Anker, die vor dem Umbau auf dieser Seite lagen, und ihr neues Ziel.
 * Sie stehen in ausgelieferten PDFs und in externen Verweisen — ein Sprung ins
 * Leere waere die teuerste Nebenwirkung des Umbaus.
 */
const ANKER_ALIAS: Record<string, string> = {
  prinzip: '/epigenetics/grundlagen#prinzip',
  'werte-verstehen': '/epigenetics/grundlagen#werte-verstehen',
  studienlage: '/epigenetics/studienlage#studienlage',
  downloads: '/epigenetics/unterlagen#downloads',
}

/** Einstiegsfilter. Der Wert steht in der URL (?fokus=), nicht nur im State. */
const FILTER_KEYS = ['longevity', 'nutrition', 'sports', 'bgm', 'practice']
const FILTER_PARAM = 'fokus'

interface Fact {
  k: string
  v: string
}

interface TitledText {
  title: string
  text: string
}

interface QA {
  q: string
  a: string
}

/**
 * i18next liefert bei fehlendem Key den Key-String zurueck statt eines Arrays.
 * Der Guard haelt SSR am Leben, falls ein Locale-File unvollstaendig ist.
 */
function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

/** Dekoratives Sparkle-Motiv des Programms — Inline-SVG, erbt currentColor. */
const Sparkle = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
    <path
      d="M50 2 C50 33 33 50 2 50 C33 50 50 67 50 98 C50 67 67 50 98 50 C67 50 50 33 50 2 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>
)

const EpigeneticsPage = () => {
  const { t } = useTranslation('epigenetics')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  useScrollDepth('epigenetics')
  // Acht Sprachen zeigen diese Seite auf Englisch (Marker `_translationStatus`
  // im Namensraum). Ohne Auszeichnung liest ein tschechischer Screenreader den
  // englischen Text mit tschechischer Phonetik vor — WCAG 3.1.2, Level AA.
  const englishFallback = isEnglishFallback(t('_translationStatus', { defaultValue: '' }))

  /**
   * Weiterleitung der alten Kapitelanker auf ihre neue Seite. Sie laeuft nur,
   * wenn tatsaechlich ein solcher Anker in der URL steht — ein Aufruf ohne Hash
   * bleibt unberuehrt.
   */
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    const ziel = hash ? ANKER_ALIAS[hash] : undefined
    if (ziel) navigate(ziel, { replace: true })
  }, [navigate])

  const established = asArray<TitledText>(t('evidence.established', { returnObjects: true }))
  const preliminary = asArray<TitledText>(t('evidence.preliminary', { returnObjects: true }))
  const steps = asArray<string>(t('workflow.steps', { returnObjects: true }))
  const faq = asArray<QA>(t('faq.items', { returnObjects: true }))
  const compareCols = asArray<string>(t('compare.cols', { returnObjects: true }))
  const compareRows = asArray<string[]>(t('compare.rows', { returnObjects: true }))
  const compareGroups = asArray<string[]>(t('compare.groups', { returnObjects: true }))
  const compareCaveats = asArray<TitledText>(t('compare.caveats', { returnObjects: true }))
  const scales = asArray<Fact>(t('basics.scales', { returnObjects: true }))

  /**
   * Der Einstiegsfilter steht in der URL statt nur im React-State. Damit ist er
   * verlinkbar: der Teaser der Startseite fuehrt eine Ernaehrungsberatung
   * direkt auf die vorgefilterte Tabelle, der Zurueck-Knopf funktioniert, und
   * eine Auswahl laesst sich weitergeben.
   */
  const fokus = searchParams.get(FILTER_PARAM)
  const panelGroup = fokus && FILTER_KEYS.includes(fokus) ? fokus : null
  const setPanelGroup = (key: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (key) next.set(FILTER_PARAM, key)
    else next.delete(FILTER_PARAM)
    setSearchParams(next, { replace: true })
  }
  const visibleRows = panelGroup
    ? compareRows.filter((_, i) => compareGroups[i]?.includes(panelGroup))
    : compareRows

  const faqSchemaItems: FAQItem[] = faq.map((item) => ({ question: item.q, answer: item.a }))
  const zipHref = `${ASSET_BASE}${t('downloads.zipFile')}`

  /**
   * Fuenf Kapitel statt zehn. Was hier fehlt, ist nicht geloescht, sondern hat
   * eine eigene Seite bekommen — der Abschnitt "Zum Nachlesen" vor der Anfrage
   * fuehrt dorthin. Er steht bewusst NICHT in der Leiste: er ist ein Wegweiser,
   * kein Kapitel.
   */
  const chapters: Chapter[] = [
    { id: 'vergleich', label: t('compare.caption') },
    { id: 'analysen', label: t('analyses.title') },
    { id: 'ablauf', label: t('workflow.caption') },
    { id: 'fragen', label: t('faq.caption') },
    // NICHT #contact — diese id gehoert dem globalen Abschlussblock nach
    // </main>. Das Kapitel meint den eigenen Block.
    { id: 'konditionen', label: t('contact.navLabel') },
  ]

  /**
   * Die Aufforderung in der Kapitelleiste wechselt mit der Lesetiefe, statt
   * ueber die ganze Seite hinweg denselben Satz zu wiederholen. Sie teilt die
   * Lesestrecke in drei gleich grosse Abschnitte: erst die Auswahl, dann die
   * Frage, wie ein fertiger Befund aussieht, zuletzt die Anfrage.
   */
  const navAktionen: NavAction[] = [
    { href: '#vergleich', label: t('compare.title') },
    { href: '#analysen', label: t('downloads.samplesCta') },
    { to: '/contact?intent=quote&source=epigenetics#kontaktformular', label: t('hero.ctaQuote') },
  ]

  /** Die drei Vertiefungsseiten — Wegweiser vor der Anfrage. */
  const vertiefung = [
    {
      to: '/epigenetics/grundlagen',
      caption: t('principle.caption'),
      title: t('principle.title'),
      text: t('principle.lead'),
    },
    {
      to: '/epigenetics/studienlage',
      caption: t('evidence.caption'),
      title: t('evidence.title'),
      text: t('evidence.lead'),
    },
    {
      to: '/epigenetics/unterlagen',
      caption: t('downloads.caption'),
      title: t('downloads.title'),
      text: t('downloads.sub'),
    },
  ]

  return (
    <PageTransition>
      <SEOHead
        title={t('seo.title')}
        description={t('seo.description')}
        ogImage="/og-epigenetics.jpg"
        keywords={[
          'Epigenetik Analyse',
          'Genetik Analyse Praxis',
          'biologisches Alter',
          'Telomerlänge',
          'Trockenblutkarte',
          'microRNA',
          'PolarisDX',
        ]}
        structuredData={[
          createBreadcrumbSchema([
            { name: t('breadcrumb.home'), url: '/' },
            { name: t('breadcrumb.current'), url: '/epigenetics' },
          ]),
          ...(faqSchemaItems.length > 0 ? [createFAQSchema(faqSchemaItems)] : []),
        ]}
      />

      <div className="bg-slate-50 text-gray-900" lang={englishFallback ? 'en' : undefined}>
        {/* ================================================================
            HERO
        ================================================================ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-deep to-[#203864] text-white">
          <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-brand-secondary/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-[320px] w-[320px] rounded-full bg-accent/20 blur-3xl" />
          <Sparkle className="pointer-events-none absolute right-8 top-24 hidden h-40 w-40 text-white/15 lg:block" />
          <Sparkle className="pointer-events-none absolute right-52 top-56 hidden h-16 w-16 text-accent-on-dark/30 lg:block" />

          <div className="relative mx-auto max-w-page px-4 pb-16 pt-28 lg:px-10 lg:pb-20 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <div className="max-w-container">
                <Breadcrumbs
                  variant="dark"
                  className="mb-4"
                  items={[
                    { label: t('breadcrumb.home'), href: '/' },
                    { label: t('breadcrumb.current') },
                  ]}
                />
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
                  {t('hero.eyebrow')}
                </p>
                <h1 className="max-w-3xl text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                  {t('hero.title')}
                </h1>
                <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-white/85 lg:text-xl lg:leading-relaxed">
                  {t('hero.claim')}
                </p>

                {/* Der Kernsatz aus dem Beratungsabschnitt. Er ist das
                    Argument fuer wiederkehrende Termine und steht deshalb im
                    ersten Bildschirm. Bewusst OHNE Monatszahl: die Untergrenze
                    "fruehestens nach vier bis sechs Monaten" ist nur fuer die
                    beiden Methylierungspanels belegt, der Hero gilt aber fuer
                    alle sechs. */}
                <p className="mt-5 max-w-[60ch] text-base leading-7 text-white/80 lg:text-[17px] lg:leading-8">
                  {t('hero.consultLine')}
                </p>

                {/* Vertrauenszeile im ersten Bildschirm. Zwei Elemente statt
                    drei: der dritte Platz waere eine Praktiker-Stimme zum
                    Programm — es liegt keine echte vor, und erfundene kommen
                    nicht auf die Seite. Die Zahlen der Studienzeile kommen aus
                    derselben Quelle wie die Studienlage-Seite und koennen
                    deshalb nicht auseinanderlaufen. */}
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  <li className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-base text-white/85 backdrop-blur-sm">
                    {t('contact.lab')}
                  </li>
                  <li className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-base text-white/85 backdrop-blur-sm">
                    <Link
                      to="/epigenetics/studienlage"
                      className="inline-flex items-start gap-1.5 transition-colors hover:text-white"
                    >
                      {t('hero.trustEvidence', {
                        established: established.length,
                        preliminary: preliminary.length,
                      })}
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                    </Link>
                  </li>
                </ul>

                {/* Die einzige Aufgabe des Heros: die Auswahl. Die Chips setzen
                    den Filter in der URL und springen auf die Tabelle, wo er
                    wirkt — dadurch ist jede Vorauswahl verlinkbar, und der
                    Teaser der Startseite kann direkt darauf zeigen. */}
                <div className="mt-10 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm lg:p-8">
                  <h2 className="max-w-[26ch] text-2xl font-semibold tracking-tight lg:text-3xl">
                    {t('hero.chooseTitle')}
                  </h2>
                  <p className="mt-2 text-sm text-white/70">{t('compare.filter.label')}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href="#vergleich"
                      onClick={() => setPanelGroup(null)}
                      aria-current={panelGroup === null ? 'true' : undefined}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        panelGroup === null
                          ? 'border-white bg-white text-brand-deep'
                          : 'border-white/40 text-white hover:border-white hover:bg-white/10'
                      }`}
                    >
                      {t('compare.filter.all')}
                    </a>
                    {FILTER_KEYS.map((key) => (
                      <a
                        key={key}
                        href="#vergleich"
                        onClick={() => setPanelGroup(key)}
                        aria-current={panelGroup === key ? 'true' : undefined}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          panelGroup === key
                            ? 'border-white bg-white text-brand-deep'
                            : 'border-white/40 text-white hover:border-white hover:bg-white/10'
                        }`}
                      >
                        {t(`compare.filter.options.${key}`)}
                      </a>
                    ))}
                  </div>
                  {/* Der Anfrageweg bleibt im ersten Bildschirm erreichbar,
                      aber als Textlink: er steht dem Filter nicht mehr als
                      gleichrangiger Knopf gegenueber. */}
                  <Link
                    to="/contact?intent=quote&source=epigenetics#kontaktformular"
                    className="mt-6 inline-flex items-center gap-1.5 text-base font-semibold text-accent-on-dark transition-colors hover:text-white"
                  >
                    {t('hero.ctaQuote')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <ChapterNav
          chapters={chapters}
          chaptersLabel={t('befund.navChapters')}
          actions={navAktionen}
        />

        {/* ================================================================
            1 · AUSWAHL — die sechs Panels im Vergleich
        ================================================================ */}
        <section
          id="vergleich"
          className="scroll-mt-[var(--chapterbar-offset,148px)] border-b border-slate-200 bg-slate-50"
        >
          <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-20">
            <Reveal width="100%">
              <SectionHeader
                caption={t('compare.caption')}
                title={t('compare.title')}
                align="left"
              />
              <p className={`mt-4 max-w-[68ch] ${LEAD}`}>{t('compare.lead')}</p>
              {/* Die Tabelle nennt die molekulare Ebene beim Namen — microRNA,
                  Telomerlaenge, Methylierung. Erklaert werden die Begriffe auf
                  der Grundlagenseite; der Verweis steht deshalb hier, bei der
                  ersten Verwendung. */}
              <Link
                to="/epigenetics/grundlagen#werte-verstehen"
                className="mt-3 inline-flex items-center gap-1.5 text-base font-semibold text-accent-strong"
              >
                {t('basics.title')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              {/* Der Filter selbst steht im Hero. Hier bleibt nur die Anzeige,
                  welche Auswahl die Tabelle gerade zeigt, und der Weg zurueck
                  auf alle sechs — ein zweites Chip-Raster waere ein zweiter
                  Bedienort fuer denselben Zustand. */}
              {panelGroup ? (
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <p className="text-base text-gray-600">
                    {t('compare.filter.label')}{' '}
                    <span className="font-semibold text-brand-deep">
                      {t(`compare.filter.options.${panelGroup}`)}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setPanelGroup(null)}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-brand-deep transition-colors hover:border-brand-primary"
                  >
                    {t('compare.filter.all')}
                  </button>
                </div>
              ) : null}
            </Reveal>

            <Reveal width="100%">
              {/* Mobil: die Tabelle ist 54rem breit und scrollt quer — die
                  Panel-Spalte war nach rund 140px Scroll komplett weg, keine
                  Zelle bleibt stehen. Unter lg stehen deshalb dieselben Daten
                  als Karten, eine je Panel, aus derselben Quelle. */}
              <div className="mt-10 grid gap-4 lg:hidden">
                {visibleRows.map((row) => (
                  <div
                    key={`karte-${row[0]}`}
                    className="rounded-3xl border border-slate-200 bg-white p-6"
                  >
                    <p className="text-lg font-semibold text-text-heading">{row[0]}</p>
                    <dl className="mt-4">
                      {compareCols.slice(1).map((col, i) => (
                        <div
                          key={`${row[0]}-${col}`}
                          className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-slate-100 py-3"
                        >
                          <dt className="text-sm text-gray-600">{col}</dt>
                          <dd className="text-sm font-semibold text-text-heading">{row[i + 1]}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>

              {/* Kein overflow auf dem Wrapper: das machte ihn zum Scroll-Container und
                  die klebende Kopfzeile haette sich an ihm statt am Viewport
                  ausgerichtet — sie blieb dann 58px zu weit oben hinter der Leiste.
                  Die Rundung uebernehmen stattdessen die aeusseren Kopfzellen. */}
              <div className="mt-10 hidden rounded-3xl border border-slate-200 bg-white lg:block">
                <table className="w-full min-w-[54rem] border-collapse text-left">
                  <thead>
                    {/* Die Kopfzeile bleibt beim Scrollen stehen — sonst liest man
                        ab der dritten Zeile "ja", "nein", "Ampel 1-9" ohne zu
                        wissen, welche Spalte das ist. */}
                    <tr className="bg-brand-deep text-white">
                      {compareCols.map((col) => (
                        <th
                          key={col}
                          scope="col"
                          className="sticky top-[var(--chapterbar-offset,153px)] z-10 bg-brand-deep px-5 py-4 text-sm font-semibold first:rounded-tl-3xl last:rounded-tr-3xl"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map((row, rowIndex) => (
                      <tr key={row[0]} className={rowIndex % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={`${row[0]}-${cellIndex}`}
                            className={
                              cellIndex === 0
                                ? 'px-5 py-4 text-base font-semibold text-text-heading'
                                : 'px-5 py-4 text-base text-gray-700'
                            }
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {visibleRows.length === 0 ? (
                <p className="mt-4 text-base text-gray-600">{t('compare.filter.empty')}</p>
              ) : null}
            </Reveal>

            {/* Die Ergebnisformen der letzten Spalte werden hier erklaert.
                Eine Legende, die man erst suchen muss, ist keine Legende. */}
            <Reveal width="100%">
              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
                <p className={LABEL}>{t('basics.scaleTitle')}</p>
                <dl className="mt-4 grid gap-5 lg:grid-cols-3">
                  {scales.map((scale, scaleIndex) => (
                    <div key={`vergleich-${scale.k}`}>
                      <dt className="text-base font-semibold text-text-heading">{scale.k}</dt>
                      <dd className="mt-2">
                        <ScaleRamp kind={SCALE_KINDS[scaleIndex] ?? 'deviation'} />
                        <p className={`mt-2 text-gray-700 ${BODY}`}>{scale.v}</p>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            {/* Methodische Grenzen und der GenDG-Hinweis bleiben an der Tabelle,
                wo die betroffenen Panels sichtbar sind — aber zugeklappt. Zuvor
                standen hier drei weitere Kartenraster untereinander und machten
                ausgerechnet den Auswahlabschnitt zum dichtesten der Seite.
                Nichts ist entfallen: der Inhalt steht offen im Markup und damit
                auch fuer Suchmaschinen und Screenreader da. */}
            <Reveal width="100%">
              <details className="group mt-6 overflow-hidden rounded-3xl border border-accent-border bg-accent-soft">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-7 py-5 text-left text-base font-semibold text-accent-strong">
                  <span>{t('compare.caveatTitle')}</span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="px-7 pb-7">
                  <div className="grid gap-5 lg:grid-cols-2">
                    {compareCaveats.map((item) => (
                      <div key={item.title}>
                        <p className="text-base font-semibold text-text-heading">{item.title}</p>
                        <p className={`mt-1.5 text-gray-700 ${BODY}`}>{item.text}</p>
                      </div>
                    ))}
                  </div>
                  <p className={`mt-5 border-t border-accent-border pt-5 text-gray-700 ${BODY}`}>
                    {t('compare.gendg')}
                  </p>
                  <Link
                    to="/epigenetics/studienlage"
                    className="mt-4 inline-flex items-center gap-1.5 text-base font-semibold text-accent-strong"
                  >
                    {t('evidence.title')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </details>
            </Reveal>
          </div>
        </section>

        {/* ================================================================
            2 · DIE SECHS PANELS — eine Darstellung statt zwei

            Beide Anker bleiben erhalten: #analysen liegt auf dem Abschnitt,
            #musterbefunde als Sprungmarke davor — beide sind extern verlinkt
            und stehen in den PDFs.
        ================================================================ */}
        <section
          id="analysen"
          className="scroll-mt-[var(--chapterbar-offset,148px)] border-y border-slate-200 bg-white"
        >
          <span id="musterbefunde" className="block scroll-mt-[var(--chapterbar-offset,148px)]" />
          <EpigeneticsPanels />
        </section>

        {/* ================================================================
            3 · ABLAUF — Probenweg und Beratung in EINEM Kapitel

            Vorher zwei Kapitel mit zwei Schrittlisten (sechs Logistikschritte,
            drei Beratungsschritte) an zwei Stellen der Leiste. Die
            Vergleichsanbieter zeigen genau ein Onboarding-Diagramm; hier
            stehen jetzt beide Reihen hintereinander unter einer Ueberschrift.
        ================================================================ */}
        <section
          id="ablauf"
          className="scroll-mt-[var(--chapterbar-offset,148px)] mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-20"
        >
          <Reveal width="100%">
            <SectionHeader
              caption={t('workflow.caption')}
              title={t('workflow.title')}
              align="left"
            />
            <p className={`mt-4 max-w-[68ch] ${LEAD}`}>{t('workflow.lead')}</p>
          </Reveal>
          <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal key={index} width="100%" delay={0.05 * (index % 3)} className={STRETCH}>
                <li className="h-full rounded-3xl border border-slate-200 bg-white p-6">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-base font-semibold text-accent-strong">
                    {index + 1}
                  </span>
                  <p className={`mt-4 text-gray-700 ${BODY}`}>{step}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* "So wird daraus eine Beratung" — dieselbe Fassung wie auf den
            Musterbefunden, ohne Panelbezug und damit ohne Monatszahl. Sie
            gehoert zum Ablaufkapitel und hat deshalb keinen eigenen
            Leisteneintrag mehr. */}
        <ConsultSteps />

        {/* ================================================================
            4 · HAEUFIGE FRAGEN — natives <details>, kein JavaScript noetig
        ================================================================ */}
        <section
          id="fragen"
          className="scroll-mt-[var(--chapterbar-offset,148px)] mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-20"
        >
          <Reveal width="100%">
            <div className="mx-auto max-w-[80ch]">
              <SectionHeader caption={t('faq.caption')} title={t('faq.title')} align="left" />
              <p className={`mt-4 max-w-[68ch] ${LEAD}`}>{t('faq.lead')}</p>
            </div>
          </Reveal>
          <div className="mx-auto mt-10 max-w-[80ch] divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            {faq.map((item) => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-6 text-left text-lg font-medium text-text-heading transition-colors hover:bg-slate-50 lg:px-8">
                  <span>{item.q}</span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-brand-primary transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className={`px-6 pb-7 text-gray-600 lg:px-8 ${BODY}`}>{item.a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* ================================================================
            5 · ZUM NACHLESEN — die drei Vertiefungsseiten

            Kein Kapitel, sondern der Wegweiser: hier steht, was von dieser
            Seite abgezogen wurde und wo es jetzt liegt. Ohne ihn waeren die
            drei Seiten nur ueber die Verweise im Text erreichbar.
        ================================================================ */}
        <section
          id="nachlesen"
          className="scroll-mt-[var(--chapterbar-offset,148px)] border-y border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-20">
            <div className="grid gap-5 lg:grid-cols-3">
              {vertiefung.map((item, index) => (
                <Reveal key={item.to} width="100%" delay={0.05 * index} className={STRETCH}>
                  <Link
                    to={item.to}
                    className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-slate-50 p-7 transition-all hover:-translate-y-0.5 hover:border-brand-primary hover:shadow-card"
                  >
                    <p className={LABEL}>{item.caption}</p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-text-heading">
                      {item.title}
                    </h2>
                    <p className={`mt-3 line-clamp-4 text-gray-600 ${BODY}`}>{item.text}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-base font-semibold text-brand-primary">
                      {item.title}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>

            {/* Ein direkter Griff zu allen Blaettern, ohne den Umweg ueber die
                Unterlagenseite — der einzige Download, der auf der
                Programmseite verbleibt. */}
            <Reveal width="100%">
              <a
                href={zipHref}
                onClick={() =>
                  trackEvent('epigenetics_request', {
                    method: 'pdf',
                    source: 'landing',
                    document: 'zip',
                  })
                }
                download
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {t('downloads.zipLabel')}
              </a>
            </Reveal>
          </div>
        </section>

        {/* ================================================================
            6 · KONDITIONEN ANFRAGEN + RECHTLICHER HINWEIS
        ================================================================ */}
        <section
          id="konditionen"
          className="scroll-mt-[var(--chapterbar-offset,148px)] mx-auto max-w-container px-4 py-16 text-center lg:px-0 lg:py-20"
        >
          <Reveal width="100%">
            <SectionHeader
              caption={t('contact.caption')}
              title={t('contact.title')}
              align="center"
            />
            <p className={`mx-auto mt-4 max-w-[62ch] ${LEAD}`}>{t('contact.sub')}</p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {/* Das Formular ist der eigentliche Weg — es bekommt den
                  Primaerknopf, die direkten Wege bleiben als Alternative
                  daneben stehen. */}
              <Link
                to="/contact?intent=quote&source=epigenetics#kontaktformular"
                onClick={() =>
                  trackEvent('epigenetics_request', { method: 'form', source: 'landing' })
                }
                className="inline-flex items-center justify-center rounded-full bg-accent-strong px-6 py-3.5 text-base font-semibold text-white transition-colors hover:brightness-110"
              >
                {t('contact.title')}
              </Link>
              <a
                href="mailto:contact@polarisdx.net"
                onClick={() =>
                  trackEvent('epigenetics_request', { method: 'email', source: 'landing' })
                }
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
              >
                contact@polarisdx.net
              </a>
              <a
                href="tel:+4915228580999"
                onClick={() =>
                  trackEvent('epigenetics_request', { method: 'phone', source: 'landing' })
                }
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
              >
                +49 152 2858 0999
              </a>
            </div>

            {/* Rechtlicher Hinweis — Wortlaut abgestimmt, bitte unveraendert lassen.
                Die Farbe ist nicht Teil der Abstimmung: text-gray-500 ergab auf
                diesem Grund 3,23:1 und text-gray-400 sogar 2,43:1 bei 14px.
                text-gray-600 bringt beide auf ueber 7:1. */}
            <p className="mx-auto mt-10 max-w-[80ch] text-sm leading-relaxed text-gray-600">
              {t('contact.note')}
            </p>
            <p className="mt-3 text-sm text-gray-600">{t('contact.lab')}</p>

            {/* Zwei Wege weiter statt drei — der dritte zeigte auf dasselbe
                Ziel wie der Unterlagen-Wegweiser eine Sektion darueber. */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-base">
              <Link
                to="/diagnostics/longevity"
                className="inline-flex items-center gap-1.5 font-semibold text-brand-primary transition-colors hover:text-brand-deep"
              >
                <FlaskConical className="h-4 w-4" aria-hidden="true" />
                {t('links.longevity')}
              </Link>
              <Link
                to="/downloads"
                className="inline-flex items-center gap-1.5 font-semibold text-brand-primary transition-colors hover:text-brand-deep"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                {t('links.downloads')}
              </Link>
            </div>
          </Reveal>
        </section>
      </div>
    </PageTransition>
  )
}

export default EpigeneticsPage
