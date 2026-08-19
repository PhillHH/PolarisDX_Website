/**
 * EpigeneticsPanels — die sechs Analysen als EINE Darstellung.
 *
 * Vorher standen dieselben sechs Panels zweimal auf der Seite: als dichte
 * Textkarten unter "Die sechs Analysen" (3.065 px, 575 Woerter) und rund
 * 4.700 px spaeter als Bildkarten unter "Musterbefunde" (2.438 px, 365 Woerter)
 * — mit jeweils anderen Angaben. Wer wissen wollte, ob ein Panel zu seiner
 * Einrichtung passt, musste an zwei Orten lesen.
 *
 * Jetzt eine Karte je Panel:
 *   - Deckblatt des Musterbefunds als Bild
 *   - eine Zeile, die sagt, worum es geht
 *   - zwei Achsen aus derselben Quelle wie die Vergleichstabelle (Umfang und
 *     Ebene, aus compare.cols / compare.rows) — vorher trugen die sechs Karten
 *     sechs verschiedene Label-Paare, weshalb sich aus ihnen nichts vergleichen
 *     liess, danach alle fuenf Achsen und damit die komplette Tabelle ein
 *     zweites Mal
 *   - "Fuer wen geeignet" — die Angabe, wegen der ein Fachanwender ueberhaupt
 *     auf der Seite ist
 *   - genau eine Aktion: der vollstaendige Musterbefund als Seite
 *
 * Die PDFs sind bewusst nicht mehr an der Karte: der Unterlagen-Abschnitt
 * fuehrt alle neun Infoblaetter und die sechs Musterbefunde ohnehin vollstaendig.
 * Achtzehn Knoepfe im Panel-Raster waren Rauschen.
 *
 * Die ausfuehrlichen Beschreibungstexte (analyses.what, samples.what,
 * samples.bullets) bleiben in den Locale-Dateien stehen, werden hier aber nicht
 * mehr gerendert. Dieselbe Tiefe steht in den Musterbefund-Seiten und den PDFs.
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Download } from 'lucide-react'
import Reveal from '../ui/Reveal'
import SectionHeader from '../ui/SectionHeader'
import { BEFUND_IMAGES, BEFUND_IMAGE_SIZE } from '../../assets/epigenetics/befundImages'
import { MerkButton, Merkliste } from '../befund/Merkliste'

interface AnalysisItem {
  num: string
  name: string
  subtitle: string
  who?: string[]
}

interface SampleItem {
  slug: string
  panel: string
  pages: string
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

const LEAD = 'text-lg leading-8 text-gray-700'
// Reveal rendert innen einen zweiten Div fuer die Animation, der keine Hoehe
// erbt — dadurch riss die h-full-Kette und die Karten einer Reihe endeten auf
// unterschiedlicher Hoehe. [&>div]:h-full reicht sie durch, ohne Reveal selbst
// anzufassen (die Komponente wird seitenweit benutzt).
const STRETCH = 'h-full [&>div]:h-full'

const EpigeneticsPanels = () => {
  const { t } = useTranslation('epigenetics')

  const analyses = asArray<AnalysisItem>(t('analyses.items', { returnObjects: true }))
  const samples = asArray<SampleItem>(t('samples.items', { returnObjects: true }))
  const cols = asArray<string>(t('compare.cols', { returnObjects: true }))
  const rows = asArray<string[]>(t('compare.rows', { returnObjects: true }))

  // Die drei Bloecke fuehren dieselben sechs Panels in derselben Reihenfolge.
  // Zusammengefuehrt wird ueber den Namen, nicht ueber den Index — faellt in
  // einer Sprache ein Eintrag weg, fehlt lieber ein Feld als dass die Karten
  // gegeneinander verrutschen.
  const panels = samples.map((sample, index) => {
    const analysis =
      analyses.find((a) => a.name === sample.panel) ?? analyses[index] ?? ({} as AnalysisItem)
    const row = rows.find((r) => r[0] === sample.panel) ?? rows[index] ?? []
    return { sample, analysis, row }
  })

  return (
    <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
      <Reveal width="100%">
        <SectionHeader caption={t('analyses.caption')} title={t('analyses.title')} align="left" />
        <p className={`mt-4 max-w-[68ch] ${LEAD}`}>{t('analyses.lead')}</p>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {panels.map(({ sample, analysis, row }, index) => (
          <Reveal key={sample.slug} width="100%" delay={0.05 * (index % 3)} className={STRETCH}>
            <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white">
              {BEFUND_IMAGES[sample.slug] ? (
                <img
                  src={BEFUND_IMAGES[sample.slug].src}
                  srcSet={`${BEFUND_IMAGES[sample.slug].src} 640w, ${BEFUND_IMAGES[sample.slug].src2x} 1200w`}
                  sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw"
                  width={BEFUND_IMAGE_SIZE.width}
                  height={BEFUND_IMAGE_SIZE.height}
                  loading="lazy"
                  decoding="async"
                  alt={t('samples.imgAlt', { panel: sample.panel })}
                  className="w-full border-b border-slate-200 object-cover"
                />
              ) : null}

              <div className="flex flex-1 flex-col p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong">
                    {analysis.num}
                  </span>
                  <span className="text-sm text-gray-600">
                    {t('samples.pagesLabel', { pages: sample.pages })}
                  </span>
                  {/* Sprachhinweis. Stand vor dem Umbau in der Pille, die jetzt
                      analysis.num traegt — ohne ihn laden neun Locales ein
                      deutsches PDF ohne Hinweis am Knopf. */}
                  <span className="text-sm text-gray-500">{t('samples.badge')}</span>
                </div>

                <h3 className="mt-4 text-xl font-semibold tracking-tight text-text-heading">
                  {sample.panel}
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-700">{analysis.subtitle}</p>

                {/* Hier standen alle fuenf Achsen aus compare.rows — dieselben
                    Angaben, die die Vergleichstabelle weiter oben Zeile fuer
                    Zeile zeigt, mobil sogar in derselben Kartenform. Eine Karte,
                    die die Tabelle wiederholt, traegt nichts zur Entscheidung
                    bei; sie machte das Raster nur doppelt so hoch.

                    Zwei Achsen bleiben: Umfang und Ebene sind die beiden
                    Angaben, die beim Ueberfliegen einer einzelnen Karte
                    tatsaechlich zaehlen. Beschriftung weiter aus compare.cols,
                    damit Karte und Tabelle dieselben Woerter benutzen. Alles
                    Uebrige fuehrt die Karte allein: wofuer das Panel taugt und
                    der Weg in den Befund. */}
                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-slate-100 pt-4">
                  {[1, 2].map((i) =>
                    row[i] ? (
                      <div key={cols[i]}>
                        <dt className="text-xs text-gray-600">{cols[i]}</dt>
                        <dd className="mt-0.5 text-sm font-semibold text-text-heading">{row[i]}</dd>
                      </div>
                    ) : null,
                  )}
                </dl>

                {analysis.who?.length ? (
                  <>
                    <p className="mt-5 text-xs font-medium text-gray-600">
                      {t('analyses.whoLabel')}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {analysis.who.map((entry) => (
                        <li key={entry} className="flex gap-3 text-base leading-7 text-gray-700">
                          <span className="mt-3 h-1 w-3 shrink-0 rounded-full bg-accent-line" />
                          <span>{entry}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {/* Zwei Wege statt einem: den Befund lesen — oder das Panel
                    vormerken und weiterlesen. Die Merkliste liegt allein im
                    Browser dieses Geraets, siehe src/lib/merkliste.ts. */}
                <div className="mt-auto space-y-3 pt-6">
                  <Link
                    to={`/epigenetics/musterbefund/${sample.slug}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-navy-hover"
                  >
                    {t('samples.btn')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <MerkButton slug={sample.slug} panel={sample.panel} className="w-full" />
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* Die Merkliste direkt unter dem Raster: dort wird vorgemerkt, dort
          gehoert die Rueckmeldung hin. Sie erscheint nur, wenn etwas darin
          steht, und fuehrt von dort in die Anfrage. */}
      {/* Ohne Reveal: die Liste erscheint erst nach der Hydration, und eine
          Einblend-Animation auf einem Element, das schon im Bild steht, kann
          sie unsichtbar halten. */}
      <Merkliste className="mt-8" />

      {/* Beispieldaten-Hinweis — die Bilder zeigen echte Befundlayouts mit frei
          erfundenen Werten, das muss dabeistehen.

          Das ZIP mit allen sechs Musterbefunden stand hier als zweiter,
          gleich prominenter Downloadweg neben dem Unterlagen-Abschnitt. Beide
          Pakete liegen jetzt zusammen auf /epigenetics/unterlagen — die
          Unterlagen haben genau einen Ort. */}
      <Reveal width="100%">
        <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[62ch] text-sm leading-relaxed text-gray-600">{t('samples.note')}</p>
          <Link
            to="/epigenetics/unterlagen"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-brand-deep transition-colors hover:border-brand-primary"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {t('samples.zipLabel')}
          </Link>
        </div>
      </Reveal>
    </div>
  )
}

export default EpigeneticsPanels
