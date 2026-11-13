/**
 * EpigeneticsPanels — die sechs Analysen als EINE Darstellung.
 *
 * Vorher standen dieselben sechs Panels zweimal auf der Seite: als dichte
 * Textkarten unter "Die sechs Analysen" (3.065 px, 575 Woerter) und rund
 * 4.700 px spaeter als Bildkarten unter "Musterbefunde" (2.438 px, 365 Woerter)
 * — mit jeweils anderen Angaben. Wer wissen wollte, ob ein Panel zu seiner
 * Einrichtung passt, musste an zwei Orten lesen.
 *
 * Jetzt eine Spalte je Panel (SC-028: im Raster der Startseite, ohne Kartenrahmen):
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
import SubHead from '../sub/SubHead'
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
    <div className="sc025-inner">
      <SubHead
        kicker={t('analyses.caption')}
        title={title ?? t('analyses.title')}
        lead={t('analyses.lead')}
      />
      {filter}

      {/* SC-028: keine Karten mehr — je Panel eine Spalte: Deckblatt auf heller Platte, dünne
          Überschrift, die fünf Achsen als Tabelle, „Für wen geeignet" und die beiden Wege. */}
      <div className="sc028-panels">
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
              className="sc028-panel"
            >
              <div className="sc028-cover">
                <p>
                  {[analysis.num, t('samples.pagesLabel', { pages: sample.pages })]
                    .filter(Boolean)
                    .join(' · ')}
                  {/* Sprachhinweis: ohne ihn laden neun Locales ein deutsches PDF ohne Hinweis. */}
                  {' · '}
                  {t('samples.badge')}
                </p>
                {BEFUND_IMAGES[sample.slug] ? (
                  <img
                    src={BEFUND_IMAGES[sample.slug].src}
                    srcSet={`${BEFUND_IMAGES[sample.slug].src} 640w, ${BEFUND_IMAGES[sample.slug].src2x} 1200w`}
                    sizes="(min-width: 901px) 340px, (min-width: 640px) 45vw, 80vw"
                    width={BEFUND_IMAGE_SIZE.width}
                    height={BEFUND_IMAGE_SIZE.height}
                    loading="lazy"
                    decoding="async"
                    alt={t('samples.imgAlt', { panel: sample.panel })}
                  />
                ) : null}
              </div>

              <h3>{sample.panel}</h3>
              <p className="sc028-panel-sub">{analysis.subtitle}</p>

              {/* Dieselben Achsen wie in der Vergleichstabelle — so laesst sich
                  von der Karte auf die Tabelle und zurueck lesen. */}
              <dl>
                {cols.slice(1).map((col, i) => (
                  <div key={col}>
                    <dt>{col}</dt>
                    <dd>{row[i + 1]}</dd>
                  </div>
                ))}
              </dl>

              {analysis.who?.length ? (
                <>
                  <p className="sc028-panel-label">{t('analyses.whoLabel')}</p>
                  <ul className="sc028-who">
                    {analysis.who.map((entry) => (
                      <li key={entry}>{entry}</li>
                    ))}
                  </ul>
                </>
              ) : null}

              {/* Zwei Wege statt einem: den Befund lesen — oder das Panel
                  vormerken und weiterlesen. Die Merkliste liegt allein im
                  Browser dieses Geraets, siehe src/lib/merkliste.ts. */}
              <div className="sc028-panel-actions">
                <Link
                  to={musterbefundHref(sample.slug as EpigeneticsPanel, focus)}
                  className="sc025-underlink"
                >
                  <span>{t('samples.btn')}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
                <MerkButton slug={sample.slug} panel={sample.panel} />
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
      <Merkliste className="sc028-merk" />

      {/* Beispieldaten-Hinweis und ZIP wie bisher — die Bilder zeigen echte
          Befundlayouts mit frei erfundenen Werten, das muss dabeistehen. */}
      <Reveal width="100%">
        <div className="sc028-noterow">
          <p className="sc025-note">{t('samples.note')}</p>
          {/* AP19 PT19.4: Gate statt Dateilink — siehe Unterlagen-Seite. */}
          <ResourceGateTrigger
            assetId={SAMPLE_BUNDLE_ASSET_ID}
            label={t('samples.zipLabel')}
            className="sc025-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          />
        </div>
      </Reveal>
    </div>
  )
}

export default EpigeneticsPanels
