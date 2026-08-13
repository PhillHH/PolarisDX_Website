/**
 * BefundMiniature — die annotierte Miniatur im Kapitel "So lesen Sie diesen
 * Befund" (Block `principle#so-lesen`, auf allen sechs Panels vorhanden).
 *
 * Warum sie hier steht: die Darstellungsformen eines Befunds — die Ampel, das
 * biologische gegen das chronologische Alter, der Verlauf zwischen zwei
 * Messungen — erklaerten sich bisher erst dort, wo sie zum ersten Mal
 * auftauchten, also tausende Pixel weiter unten. Wer den Befund von oben liest,
 * sieht sie jetzt vorab im Kleinen, mit einer Marke je Form.
 *
 * ALLES AUS DEN WERTEN GERECHNET, kein Bild. Dieselbe Regel wie in
 * BefundCharts.tsx, und aus demselben Grund: die Miniatur skaliert auf jedem
 * Viewport, traegt eine Textalternative und kann nichts zeigen, was nicht in
 * den Blockdaten steht.
 *
 * SIE ERFINDET NICHTS. Jede Marke haengt an einem Block, den dieses Panel
 * tatsaechlich fuehrt:
 *   - Skala      aus `evaluations`, `markers` und `bigResult` — je nachdem,
 *                welche Skala im Panel ueberwiegt: Ampel 1–9 oder Prozent
 *   - Alter      aus `ageDots` (nur biologische-altersuhr, healthy-aging,
 *                telomer-analyse)
 *   - Verlauf    aus `trend` (nicht bei healthy-aging und metabolic-health)
 * Fehlt ein Block, faellt seine Marke weg und die Nummerierung rueckt nach.
 * Healthy Aging bekommt so zwei Marken, Metabolic Health eine, die uebrigen
 * vier je zwei oder drei — statt einer Form, die es dort nicht gibt.
 *
 * FACHLICH/RECHTLICH: die Legendentexte liegen in den Locales und nennen KEINE
 * Monatszahl fuer den Abstand zwischen zwei Messungen. Der ist nur fuer
 * Metabolic Health und Healthy Aging belegt und steht dort in ConsultSteps.
 */

import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { toneClasses } from './BefundCharts'
import type { Block } from './BefundBlocks'

const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])
const str = (v: unknown) => (typeof v === 'string' ? v : undefined)
const num = (v: unknown) => (typeof v === 'number' ? v : undefined)

/** Skalen, die eine gemeinsame, im Befund ausgewiesene Achse haben. */
const SCALE_KINDS = new Set(['traffic', 'percent'])
/**
 * Obergrenze der Marken auf dem Band. Sie muss die groesste Auswertungsliste
 * aufnehmen — Metabolic Health hat 17 —, sonst faellt gerade das weg, was
 * hinten steht: dort standen die fuenf roten Werte, und die Marke haette
 * ausgerechnet den roten Bereich leer gezeigt.
 */
const MAX_TICKS = 24
const MAX_DOTS = 4
const MAX_TRENDS = 5

const TRAFFIC = { min: 0, max: 9 }
const PERCENT = { min: 70, max: 130 }

interface RawItem {
  kind?: unknown
  value?: unknown
  tone?: unknown
  age?: unknown
  first?: unknown
  second?: unknown
}

interface Point {
  value: number
  tone?: string
}

interface ScaleMark {
  id: 'traffic' | 'percent'
  points: Point[]
}

interface AgeMark {
  id: 'age'
  chronological: number
  min: number
  max: number
  points: Point[]
}

interface TrendMark {
  id: 'trend'
  kind: string
  pairs: { first: number; second: number; tone?: string }[]
}

type Mark = ScaleMark | AgeMark | TrendMark

/**
 * Die fuehrende Skala des Panels.
 *
 * `evaluations` traegt keinen eigenen `kind` — EvaluationBars zeichnet fest
 * gegen 9, die Auswertungen laufen also immer auf der Ampel. Welche Skala das
 * Panel fuehrt, entscheidet die Mehrheit der Werte und nicht der erste Block:
 * die Altersuhr eroeffnet mit einer Abweichungsskala in Jahren, ihre Marker
 * stehen aber auf der Ampel.
 */
function scaleMark(blocks: Block[]): ScaleMark | null {
  const all: { kind: string; value: number; tone?: string }[] = []
  const evaluations: Point[] = []

  for (const b of blocks) {
    if (b.type === 'evaluations') {
      for (const it of arr<RawItem>(b.items)) {
        const value = num(it.value)
        if (value === undefined) continue
        evaluations.push({ value, tone: str(it.tone) })
        all.push({ kind: 'traffic', value, tone: str(it.tone) })
      }
      continue
    }
    if (b.type === 'markers') {
      for (const it of arr<RawItem>(b.items)) {
        const kind = str(it.kind)
        const value = num(it.value)
        if (!kind || value === undefined || !SCALE_KINDS.has(kind)) continue
        all.push({ kind, value, tone: str(it.tone) })
      }
      continue
    }
    if (b.type === 'bigResult') {
      const kind = str(b.kind)
      const value = num(b.value)
      if (kind && value !== undefined && SCALE_KINDS.has(kind)) {
        all.push({ kind, value, tone: str(b.tone) })
      }
    }
  }

  if (all.length === 0) return null
  const traffic = all.filter((e) => e.kind === 'traffic').length
  const id = traffic >= all.length - traffic ? 'traffic' : 'percent'
  // Wo es eine Auswertungsuebersicht gibt, ist sie die Zusammenfassung des
  // Panels — dann stehen ihre Werte auf dem Band und nicht jeder Einzelmarker.
  const points =
    id === 'traffic' && evaluations.length > 0
      ? evaluations
      : all.filter((e) => e.kind === id).map((e) => ({ value: e.value, tone: e.tone }))
  return { id, points: points.slice(0, MAX_TICKS) }
}

function ageMark(blocks: Block[]): AgeMark | null {
  const b = blocks.find((x) => x.type === 'ageDots')
  const chronological = b ? num(b.chronological) : undefined
  if (!b || chronological === undefined) return null
  const points: Point[] = []
  for (const it of arr<RawItem>(b.items)) {
    const value = num(it.age)
    if (value === undefined) continue
    points.push({ value, tone: str(it.tone) })
  }
  if (points.length === 0) return null
  return {
    id: 'age',
    chronological,
    min: num(b.min) ?? 30,
    max: num(b.max) ?? 70,
    points: points.slice(0, MAX_DOTS),
  }
}

function trendMark(blocks: Block[]): TrendMark | null {
  const b = blocks.find((x) => x.type === 'trend')
  if (!b) return null
  const pairs: TrendMark['pairs'] = []
  for (const it of arr<RawItem>(b.items)) {
    const first = num(it.first)
    const second = num(it.second)
    if (first === undefined || second === undefined) continue
    pairs.push({ first, second, tone: str(it.tone) })
  }
  if (pairs.length === 0) return null
  return { id: 'trend', kind: str(b.kind) ?? 'traffic', pairs: pairs.slice(0, MAX_TRENDS) }
}

/**
 * Spanne einer Achse. Dieselben Regeln wie in BefundCharts, damit die Miniatur
 * und das grosse Diagramm denselben Wert an dieselbe Stelle setzen.
 */
const domainFor = (kind: string, values: number[]) => {
  if (kind === 'traffic') return TRAFFIC
  if (kind === 'percent') return PERCENT
  if (values.length === 0) return PERCENT
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  const pad = Math.max(1, (hi - lo) * 0.6)
  return { min: lo - pad, max: hi + pad }
}

// ===========================================================================
// GEOMETRIE
// ===========================================================================

const W = 260
const HEAD_H = 20
const CHART_X = 40
const CHART_W = W - CHART_X - 14
const TOP = HEAD_H + 14
const GAP = 16
const BADGE_X = 22

const heightOf = (m: Mark) => {
  if (m.id === 'age') return 15 + 11 * m.points.length
  if (m.id === 'trend') return 4 + 11 * m.pairs.length
  return 24
}

const BefundMiniature = ({ blocks }: { blocks: Block[] }) => {
  const { t } = useTranslation('epigenetics')
  const uid = useId().replace(/:/g, '')

  const marks = [scaleMark(blocks), ageMark(blocks), trendMark(blocks)].filter(
    (m): m is Mark => m !== null,
  )
  // Ohne eine einzige Marke gaebe es nichts zu zeigen. Tritt bei den sechs
  // Panels nicht auf; die Bedingung ist die Absicherung fuer ein siebtes.
  if (marks.length === 0) return null

  let y = TOP
  const placed = marks.map((mark) => {
    const at = y
    y += heightOf(mark) + GAP
    return { mark, y: at }
  })
  const H = y - GAP + 14

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
      <p className="text-xs font-medium text-gray-500">{t('befund.mini.caption')}</p>
      <h3 className="mt-1 text-lg font-semibold text-text-heading">{t('befund.mini.title')}</h3>
      <p className="mt-2 max-w-[68ch] text-base leading-7 text-gray-700 lg:text-[17px] lg:leading-8">
        {t('befund.mini.lead')}
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full max-w-[20rem]"
          role="img"
          aria-label={t('befund.mini.alt')}
        >
          <defs>
            <clipPath id={`${uid}-page`}>
              <rect x={0.5} y={0.5} width={W - 1} height={H - 1} rx={10} />
            </clipPath>
          </defs>

          {/* Blattkante und Kopfband. Rein schematisch — die zwei hellen Balken
              stehen fuer den Befundkopf, sie tragen keinen Inhalt. */}
          <g clipPath={`url(#${uid}-page)`}>
            <rect x={0} y={0} width={W} height={H} className="fill-white" />
            <rect x={0} y={0} width={W} height={HEAD_H} className="fill-brand-deep" />
            <rect x={12} y={7} width={64} height={4} rx={2} className="fill-white" opacity={0.55} />
            <rect x={82} y={7} width={30} height={4} rx={2} className="fill-white" opacity={0.25} />
          </g>
          <rect
            x={0.5}
            y={0.5}
            width={W - 1}
            height={H - 1}
            rx={10}
            className="fill-none stroke-slate-200"
          />

          {placed.map(({ mark, y: top }, i) => (
            <g key={mark.id}>
              {/* Die Nummer verbindet die Bildmarke mit ihrem Legendeneintrag. */}
              <circle cx={BADGE_X} cy={top + 8} r={7.5} className="fill-brand-deep" />
              <text
                x={BADGE_X}
                y={top + 8}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-white text-[9px] font-semibold"
              >
                {i + 1}
              </text>
              {mark.id === 'trend' ? (
                <TrendMini mark={mark} top={top} />
              ) : mark.id === 'age' ? (
                <AgeMini mark={mark} top={top} />
              ) : (
                <ScaleMini mark={mark} top={top} />
              )}
            </g>
          ))}
        </svg>

        <ol className="space-y-5">
          {placed.map(({ mark }, i) => (
            <li key={mark.id} className="flex gap-4">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-deep text-sm font-semibold text-white">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h4 className="text-base font-semibold text-text-heading">
                  {t(`befund.mini.marks.${mark.id}.title`)}
                </h4>
                <p className="mt-1 max-w-[62ch] text-base leading-7 text-gray-700">
                  {t(`befund.mini.marks.${mark.id}.text`)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

// ===========================================================================
// DIE DREI BILDMARKEN
// ===========================================================================

/**
 * Ampel 1–9 oder Prozent der Referenz: ein Band mit den Zonen des Befunds und
 * je einer Marke pro Wert. Die Zonengrenzen sind dieselben wie in
 * BefundCharts.zonesFor — nur dort, wo das Quelldokument sie ausweist.
 */
const ScaleMini = ({ mark, top }: { mark: ScaleMark; top: number }) => {
  const dom = mark.id === 'traffic' ? TRAFFIC : PERCENT
  const span = dom.max - dom.min
  const x = (v: number) => CHART_X + ((v - dom.min) / span) * CHART_W
  const zones =
    mark.id === 'traffic'
      ? [
          { tone: 'red', from: 0, to: 3 },
          { tone: 'amber', from: 3, to: 6 },
          { tone: 'green', from: 6, to: 9 },
        ]
      : [
          { tone: 'red', from: 70, to: 90 },
          { tone: 'amber', from: 90, to: 100 },
          { tone: 'green', from: 100, to: 130 },
        ]
  // Die Beschriftung sitzt an der Stelle ihres Werts, nicht in gleichen
  // Abstaenden: bei der Prozentskala liegt 100 % in der Mitte, weil die rote
  // Zone 20 und die gruene 30 Punkte breit ist.
  const ticks =
    mark.id === 'traffic'
      ? [
          { v: 1, label: '1' },
          { v: 5, label: '5' },
          { v: 9, label: '9' },
        ]
      : [
          { v: 70, label: '70 %' },
          { v: 100, label: '100 %' },
          { v: 130, label: '130 %' },
        ]

  return (
    <>
      {zones.map((z) => (
        <rect
          key={z.tone}
          x={x(z.from)}
          y={top + 2}
          width={x(z.to) - x(z.from)}
          height={11}
          className={toneClasses(z.tone).zone}
        />
      ))}
      {mark.points.map((p, i) => (
        <rect
          key={`${p.value}-${i}`}
          x={Math.min(x(p.value) - 1, CHART_X + CHART_W - 2)}
          y={top}
          width={2}
          height={15}
          rx={1}
          className={toneClasses(p.tone).fill}
        />
      ))}
      {ticks.map((tick, i) => (
        <text
          key={tick.label}
          x={x(tick.v)}
          y={top + 23}
          textAnchor={i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle'}
          className="fill-current text-[7px] text-gray-600"
        >
          {tick.label}
        </text>
      ))}
    </>
  )
}

/**
 * Biologisches gegen chronologisches Alter: eine gestrichelte Senkrechte fuer
 * das Kalenderalter, je Marker ein Punkt auf seiner Spur.
 */
const AgeMini = ({ mark, top }: { mark: AgeMark; top: number }) => {
  const span = mark.max - mark.min || 1
  const x = (v: number) => CHART_X + Math.max(0, Math.min(1, (v - mark.min) / span)) * CHART_W
  const rows = mark.points.length
  const bottom = top + 4 + 11 * rows

  return (
    <>
      <line
        x1={x(mark.chronological)}
        y1={top}
        x2={x(mark.chronological)}
        y2={bottom}
        strokeDasharray="3 2.5"
        className="stroke-slate-400"
        strokeWidth={1}
      />
      {mark.points.map((p, i) => {
        const cy = top + 7 + 11 * i
        const tone = toneClasses(p.tone)
        return (
          <g key={`${p.value}-${i}`}>
            <line
              x1={CHART_X}
              y1={cy}
              x2={CHART_X + CHART_W}
              y2={cy}
              className="stroke-slate-200"
              strokeWidth={1}
            />
            <circle
              cx={x(p.value)}
              cy={cy}
              r={3.6}
              className={`${tone.zone} ${tone.stroke}`}
              strokeWidth={1.6}
            />
          </g>
        )
      })}
      <text
        x={x(mark.chronological)}
        y={bottom + 7}
        textAnchor="middle"
        className="fill-current text-[7px] text-gray-600"
      >
        {mark.chronological}
      </text>
    </>
  )
}

/**
 * Verlauf: je Wert eine Spur mit offenem Punkt fuer die erste und vollem Punkt
 * fuer die zweite Messung. Die Achse folgt derselben Regel wie TrendChart —
 * bei Jahren aus den Daten gerechnet, sonst die feste Skala des Befunds.
 */
const TrendMini = ({ mark, top }: { mark: TrendMark; top: number }) => {
  const values = mark.pairs.flatMap((p) => [p.first, p.second])
  const dom = domainFor(mark.kind, values)
  const span = dom.max - dom.min || 1
  const x = (v: number) => CHART_X + Math.max(0, Math.min(1, (v - dom.min) / span)) * CHART_W

  return (
    <>
      {mark.pairs.map((p, i) => {
        const cy = top + 6 + 11 * i
        const tone = toneClasses(p.tone)
        return (
          <g key={`${p.first}-${p.second}-${i}`}>
            <line
              x1={CHART_X}
              y1={cy}
              x2={CHART_X + CHART_W}
              y2={cy}
              className="stroke-slate-200"
              strokeWidth={1}
            />
            <line
              x1={x(p.first)}
              y1={cy}
              x2={x(p.second)}
              y2={cy}
              className={tone.stroke}
              strokeWidth={1.6}
            />
            <circle
              cx={x(p.first)}
              cy={cy}
              r={2.8}
              className="fill-white stroke-slate-400"
              strokeWidth={1.4}
            />
            <circle cx={x(p.second)} cy={cy} r={3.4} className={tone.fill} />
          </g>
        )
      })}
    </>
  )
}

export default BefundMiniature
