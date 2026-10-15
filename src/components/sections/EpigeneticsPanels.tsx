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
 *   - dieselben fuenf Achsen wie die Vergleichstabelle, aus derselben Quelle
 *     (compare.cols / compare.rows) — vorher trugen die sechs Karten sechs
 *     verschiedene Label-Paare, weshalb sich aus ihnen nichts vergleichen liess
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

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import Reveal, { REVEAL_STAGGER } from '../ui/Reveal'
import SectionHeader from '../ui/SectionHeader'
import { BEFUND_IMAGES, BEFUND_IMAGE_SIZE } from '../../assets/epigenetics/befundImages'
import { MerkButton, Merkliste } from '../befund/Merkliste'
import {
  musterbefundHref,
  type EpigeneticsFocus,
  type EpigeneticsPanel,
} from '../../lib/epigeneticsContext'
import ResourceGateTrigger from '../resources/ResourceGateTrigger'
import { SAMPLE_BUNDLE_ASSET_ID } from '../../content/resources/leadMagnetCandidates'

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

const LEAD = 'text-lg leading-relaxed text-gray-600 lg:text-xl lg:leading-relaxed'
// Reveal rendert innen einen zweiten Div fuer die Animation, der keine Hoehe
// erbt — dadurch riss die h-full-Kette und die Karten einer Reihe endeten auf
// unterschiedlicher Hoehe. [&>div]:h-full reicht sie durch, ohne Reveal selbst
// anzufassen (die Komponente wird seitenweit benutzt).
const STRETCH = 'h-full [&>div]:h-full'

const EpigeneticsPanels = ({
  activePanel,
  focus,
  groups = [],
  title,
  filter,
}: {
  activePanel: EpigeneticsPanel | null
  focus: EpigeneticsFocus | null
  /** compare.groups — positionell zu compare.rows (AP34 PT34.2b). */
  groups?: string[][]
  /** Ueberschrift des Abschnitts; ohne Angabe analyses.title. */
  title?: string
  /** Filterzeile zwischen Einleitung und Karten (AP34 PT34.2b). */
  filter?: ReactNode
}) => {
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
    const rowIndex = rows.findIndex((r) => r[0] === sample.panel)
    const row = rows[rowIndex] ?? rows[index] ?? []
    // Passt das Panel zur gewaehlten Zielgruppe? Alle sechs bleiben sichtbar
    // (Vertrag PT15.3); die passenden werden hervorgehoben.
    const match = focus !== null && (groups[rowIndex >= 0 ? rowIndex : index] ?? []).includes(focus)
    return { sample, analysis, row, match }
  })

  return (
    <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-0 lg:py-24">
      <Reveal width="100%">
        <SectionHeader
          caption={t('analyses.caption')}
          title={title ?? t('analyses.title')}
          align="left"
        />
        <p className={`mt-4 max-w-[68ch] ${LEAD}`}>{t('analyses.lead')}</p>
      </Reveal>
      {filter}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {panels.map(({ sample, analysis, row, match }, index) => (
          <Reveal
            key={sample.slug}
            width="100%"
            delay={(index % 3) * REVEAL_STAGGER}
            className={STRETCH}
          >
            <article
              data-panel-slug={sample.slug}
              data-panel-active={activePanel === sample.slug ? 'true' : 'false'}
              data-panel-match={match ? 'true' : undefined}
              className={`flex h-full flex-col overflow-hidden rounded-card bg-white transition-shadow ${
                activePanel === sample.slug
                  ? 'border-2 border-brand-primary shadow-lg ring-2 ring-brand-primary/20'
                  : match
                    ? 'border-2 border-accent shadow-card'
                    : 'border border-paper-line'
              }`}
            >
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
                  className="w-full border-b border-paper-line object-cover"
                />
              ) : null}

              <div className="flex flex-1 flex-col p-6 lg:p-7">
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
                  <span className="text-sm text-gray-600">{t('samples.badge')}</span>
                </div>

                <h3 className="mt-4 text-xl font-semibold tracking-tight text-heading">
                  {sample.panel}
                </h3>
                <p className="mt-2 text-base leading-7 text-gray-700">{analysis.subtitle}</p>

                {/* Dieselben Achsen wie in der Vergleichstabelle — so laesst sich
                    von der Karte auf die Tabelle und zurueck lesen. */}
                <dl className="mt-5 border-t border-paper-line">
                  {cols.slice(1).map((col, i) => (
                    <div
                      key={col}
                      className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 border-b border-paper-line py-2"
                    >
                      <dt className="text-sm text-gray-600">{col}</dt>
                      <dd className="text-sm font-semibold text-heading">{row[i + 1]}</dd>
                    </div>
                  ))}
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
                    to={musterbefundHref(sample.slug as EpigeneticsPanel, focus)}
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

      {/* Beispieldaten-Hinweis und ZIP wie bisher — die Bilder zeigen echte
          Befundlayouts mit frei erfundenen Werten, das muss dabeistehen. */}
      <Reveal width="100%">
        <div className="mt-8 flex flex-col gap-5 rounded-card border border-paper-line bg-paper p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[62ch] text-sm leading-relaxed text-gray-600">{t('samples.note')}</p>
          {/* AP19 PT19.4: Gate statt Dateilink — siehe Unterlagen-Seite. */}
          <ResourceGateTrigger
            assetId={SAMPLE_BUNDLE_ASSET_ID}
            label={t('samples.zipLabel')}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-navy-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          />
        </div>
      </Reveal>
    </div>
  )
}

export default EpigeneticsPanels
