/**
 * Diagramme der Musterbefunde — /epigenetics/musterbefund/<slug>
 *
 * Alles reines SVG aus den Werten gerechnet, kein Bild und keine Bibliothek.
 * Damit skalieren die Diagramme auf jedem Viewport, sind durchsuchbar und
 * koennen eine Textalternative tragen — drei Dinge, die das PDF nicht kann.
 *
 * Die Farben kommen aus den Quell-PDFs (Design-Tokens `befund.*`). `ink` traegt
 * jedes bedeutungstragende Element, weil die Basisfarbe bei Gelb nur 2,45:1
 * gegen Weiss erreicht und damit unter der 3:1-Schwelle fuer Grafik liegt.
 */

import type { ReactNode } from 'react'

export type Tone = 'red' | 'amber' | 'green'

/** Vollstaendig ausgeschriebene Klassen — Tailwind scannt statisch. */
const TONE = {
  red: {
    fill: 'fill-befund-red-ink',
    stroke: 'stroke-befund-red-ink',
    text: 'text-befund-red-ink',
    zone: 'fill-befund-red-soft',
    band: 'bg-befund-red-soft',
    ink: 'text-befund-red-ink',
    border: 'border-befund-red-ink',
    dot: 'bg-befund-red-ink',
  },
  amber: {
    fill: 'fill-befund-amber-ink',
    stroke: 'stroke-befund-amber-ink',
    text: 'text-befund-amber-ink',
    zone: 'fill-befund-amber-soft',
    band: 'bg-befund-amber-soft',
    ink: 'text-befund-amber-ink',
    border: 'border-befund-amber-ink',
    dot: 'bg-befund-amber-ink',
  },
  green: {
    fill: 'fill-befund-green-ink',
    stroke: 'stroke-befund-green-ink',
    text: 'text-befund-green-ink',
    zone: 'fill-befund-green-soft',
    band: 'bg-befund-green-soft',
    ink: 'text-befund-green-ink',
    border: 'border-befund-green-ink',
    dot: 'bg-befund-green-ink',
  },
} as const

export const toneClasses = (tone?: string) => TONE[(tone as Tone) ?? 'green'] ?? TONE.green

/** Einordnungs-Plakette, wie im PDF neben jedem Wert. */
export const ToneBadge = ({ tone, children }: { tone?: string; children: ReactNode }) => {
  const t = toneClasses(tone)
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${t.band} ${t.ink}`}
    >
      {children}
    </span>
  )
}

// ===========================================================================
// SKALENBALKEN — Prozent (70–130) oder Ampel (1–9)
// ===========================================================================

interface ScaleBarProps {
  kind?: string
  value: number
  ticks?: string[]
  tone?: string
  /** Sichtbarer Wert, z. B. "96 %" oder "2/9". */
  display?: string
  sub?: string
  label?: string
  /** Einordnung in Worten, z. B. "Außerhalb" — steht so im Befund. */
  status?: string
  /** Beschriftung der Skalenpole, z. B. chronischer/akuter/kein Stress. */
  zoneLabels?: string[]
}

const PERCENT_DOMAIN = { min: 70, max: 130 }
const TRAFFIC_DOMAIN = { min: 0, max: 9 }
/** Abweichung in Jahren: die Achse laeuft invertiert, +20 steht links. */
const DEVIATION_DOMAIN = { min: -20, max: 20 }

/**
 * Zonen als Anteil der Achse — dieselbe Einteilung wie im PDF.
 * Nur fuer die beiden Skalen, deren Grenzen im Dokument ausgewiesen sind.
 * Bei Jahres- und Abweichungsskalen bleibt die Spur neutral: dort nennt kein
 * Quelldokument Schwellen, und erfundene Grenzen waeren eine Aussage.
 */
const zonesFor = (kind: string) => {
  if (kind === 'traffic') {
    return [
      { tone: 'red' as Tone, from: 0, to: 3 },
      { tone: 'amber' as Tone, from: 3, to: 6 },
      { tone: 'green' as Tone, from: 6, to: 9 },
    ]
  }
  if (kind === 'percent') {
    return [
      { tone: 'red' as Tone, from: 70, to: 90 },
      { tone: 'amber' as Tone, from: 90, to: 100 },
      { tone: 'green' as Tone, from: 100, to: 130 },
    ]
  }
  return []
}

const domainFor = (kind: string, value: number) => {
  if (kind === 'traffic') return TRAFFIC_DOMAIN
  if (kind === 'percent') return PERCENT_DOMAIN
  if (kind === 'deviation') return DEVIATION_DOMAIN
  // Unbekannte Skala: eine Spanne um den Wert, damit die Marke nicht am Rand klebt.
  const pad = Math.max(5, Math.abs(value) * 0.25)
  return { min: value - pad, max: value + pad }
}

export const ScaleBar = ({
  kind = 'percent',
  value,
  ticks,
  tone,
  display,
  sub,
  status,
  zoneLabels,
}: ScaleBarProps) => {
  const dom = domainFor(kind, value)
  const span = dom.max - dom.min || 1
  const raw = (value - dom.min) / span
  // Bei der Abweichungsskala steht der groessere Wert links.
  const pos = Math.max(0, Math.min(1, kind === 'deviation' ? 1 - raw : raw))
  const t = toneClasses(tone)
  const zones = zonesFor(kind)

  const W = 100
  const H = 10

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span className={`text-3xl font-semibold tabular-nums ${t.text}`}>{display}</span>
        {sub ? <span className="text-base text-gray-500">{sub}</span> : null}
        {status ? <ToneBadge tone={tone}>{status}</ToneBadge> : null}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Wert ${display ?? value}`}
        className="mt-3 h-2.5 w-full"
      >
        {zones.length > 0 ? (
          zones.map((z) => {
            const x = ((z.from - dom.min) / span) * W
            const w = ((z.to - z.from) / span) * W
            return (
              <rect
                key={z.tone}
                x={x}
                y={0}
                width={w}
                height={H}
                className={toneClasses(z.tone).zone}
              />
            )
          })
        ) : (
          <rect x={0} y={0} width={W} height={H} className="fill-slate-100" />
        )}
        {/* Wertmarke: breiter Strich, damit sie auch bei 100 % Breite sichtbar
            bleibt. preserveAspectRatio=none verzerrt Kreise, deshalb ein Rechteck. */}
        <rect
          x={Math.max(0, Math.min(W - 1.6, pos * W - 0.8))}
          y={-1}
          width={1.6}
          height={H + 2}
          className={t.fill}
        />
      </svg>

      {ticks && ticks.length > 0 ? (
        <div className="mt-1.5 flex justify-between text-xs text-gray-500">
          {ticks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
      ) : kind === 'traffic' ? (
        <div className="mt-1.5 flex justify-between text-xs text-gray-500">
          <span>1</span>
          <span>5</span>
          <span>9</span>
        </div>
      ) : null}

      {zoneLabels && zoneLabels.length > 0 ? (
        <div className="mt-2 flex justify-between gap-3 text-xs text-gray-500">
          {zoneLabels.map((z, i) => (
            <span
              key={z}
              className={i === 0 ? 'text-left' : i === zoneLabels.length - 1 ? 'text-right' : 'text-center'}
            >
              {z}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

// ===========================================================================
// ALTERSPUNKTE — biologisches Alter je Marker gegen das Kalenderalter
// ===========================================================================

interface AgeItem {
  label: string
  age: number
  delta?: string
  tone?: string
}

export const AgeDots = ({
  items,
  chronological,
  chronologicalLabel,
  min,
  max,
  unit = 'Jahre',
}: {
  items: AgeItem[]
  chronological: number
  chronologicalLabel?: string
  min: number
  max: number
  unit?: string
}) => {
  const span = max - min || 1
  const pct = (v: number) => ((v - min) / span) * 100
  const ticks = [min, min + span / 4, min + span / 2, min + (span * 3) / 4, max]

  return (
    <div>
      {chronologicalLabel ? (
        <div className="mb-1 grid grid-cols-[minmax(0,11rem)_1fr_auto] gap-3">
          <span />
          <div className="relative h-4">
            <span
              className="absolute -translate-x-1/2 whitespace-nowrap text-xs text-gray-500"
              style={{ left: `${pct(chronological)}%` }}
            >
              {chronologicalLabel}
            </span>
          </div>
          <span />
        </div>
      ) : null}
      <div className="space-y-3">
        {items.map((item) => {
          const t = toneClasses(item.tone)
          return (
            <div
              key={item.label}
              className="grid grid-cols-[minmax(0,11rem)_1fr_auto] items-center gap-3"
            >
              {/* Nicht abschneiden: "Epigenetische Alterungsmarker" waere sonst
                  als "Epigen. Alterung..." unlesbar. */}
              <span className="text-sm font-medium leading-tight text-text-heading sm:text-base">
                {item.label}
              </span>
              <div className="relative h-6">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-200" />
                {/* Kalenderalter als gestrichelte Senkrechte */}
                <div
                  className="absolute top-0 h-6 border-l border-dashed border-slate-400"
                  style={{ left: `${pct(chronological)}%` }}
                  aria-hidden="true"
                />
                {/* Der Punkt sitzt absolut statt im SVG: preserveAspectRatio=none
                    wuerde einen Kreis zur Ellipse verzerren. */}
                <span
                  className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white ${t.band}`}
                  style={{ left: `${pct(item.age)}%` }}
                  role="img"
                  aria-label={`${item.label}: ${item.age} ${unit}`}
                >
                  <span
                    className={`block h-full w-full rounded-full border-[3px] border-current ${t.text}`}
                  />
                </span>
              </div>
              <span className={`text-base font-semibold tabular-nums ${t.text}`}>
                {item.age} J. {item.delta ? `· ${item.delta}` : ''}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,11rem)_1fr_auto] gap-3">
        <span />
        <div className="flex justify-between text-xs text-gray-500">
          {ticks.map((v) => (
            <span key={v}>{Math.round(v)}</span>
          ))}
        </div>
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
    </div>
  )
}

// ===========================================================================
// NETZDIAGRAMM — 11 Lebensstilfaktoren, ein bis zwei Serien
// ===========================================================================

interface RadarProps {
  axes: string[]
  profile: number[]
  reference?: number[]
  labels?: { profile?: string; reference?: string }
  max?: number
  rings?: number
}

const RADAR_SIZE = 520
const RADAR_R = 150

const radarPoint = (index: number, count: number, value: number, max: number) => {
  const angle = (index / count) * 2 * Math.PI - Math.PI / 2
  const r = (value / max) * RADAR_R
  return [RADAR_SIZE / 2 + r * Math.cos(angle), RADAR_SIZE / 2 + r * Math.sin(angle)]
}

const polygon = (values: number[], max: number) =>
  values.map((v, i) => radarPoint(i, values.length, v, max).join(',')).join(' ')

export const RadarChart = ({
  axes,
  profile,
  reference,
  labels,
  max = 10,
  rings = 5,
}: RadarProps) => {
  const n = axes.length
  const ringValues = Array.from({ length: rings }, (_, i) => ((i + 1) / rings) * max)

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
        className="mx-auto h-auto w-full max-w-[34rem]"
        role="img"
        aria-label={`Netzdiagramm mit ${n} Faktoren`}
      >
        {ringValues.map((rv) => (
          <polygon
            key={rv}
            points={polygon(new Array(n).fill(rv), max)}
            className="fill-none stroke-slate-200"
            strokeWidth={1}
          />
        ))}
        {axes.map((axis, i) => {
          const [x, y] = radarPoint(i, n, max, max)
          return (
            <line
              key={axis}
              x1={RADAR_SIZE / 2}
              y1={RADAR_SIZE / 2}
              x2={x}
              y2={y}
              className="stroke-slate-200"
              strokeWidth={1}
            />
          )
        })}

        {reference ? (
          <polygon
            points={polygon(reference, max)}
            className="fill-slate-400 stroke-slate-500"
            fillOpacity={0.35}
            strokeWidth={1.5}
          />
        ) : null}
        <polygon
          points={polygon(profile, max)}
          className="fill-brand-primary stroke-brand-deep"
          fillOpacity={0.55}
          strokeWidth={2}
        />

        {axes.map((axis, i) => {
          const [x, y] = radarPoint(i, n, max + 1.55, max)
          const dx = x - RADAR_SIZE / 2
          const anchor = Math.abs(dx) < 12 ? 'middle' : dx > 0 ? 'start' : 'end'
          return (
            <text
              key={axis}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="fill-current text-[13px] font-medium text-gray-600"
            >
              {axis}
            </text>
          )
        })}
      </svg>

      <figcaption className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-brand-primary" />
          {labels?.profile ?? 'Ihr Profil'}
        </span>
        {reference ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-slate-400" />
            {labels?.reference ?? 'Referenzgruppe'}
          </span>
        ) : null}
      </figcaption>
    </figure>
  )
}

// ===========================================================================
// MESSVERLAUF — zwei Messungen je Marker
// ===========================================================================

interface TrendItem {
  label: string
  first: number
  second: number
  firstDisplay?: string
  secondDisplay?: string
  delta?: string
  status?: string
  tone?: string
}

export const TrendChart = ({
  items,
  kind = 'traffic',
  firstLabel,
  secondLabel,
}: {
  items: TrendItem[]
  kind?: string
  firstLabel?: string
  secondLabel?: string
}) => {
  // Nicht jeder Verlauf laeuft auf der Ampel: die Altersuhr vergleicht Jahre
  // (54 -> 52). Fuer solche Skalen wird die Spanne aus den Daten bestimmt,
  // sonst klebten beide Punkte am rechten Rand.
  const values = items.flatMap((i) => [i.first, i.second]).filter((v) => typeof v === 'number')
  const auto = (() => {
    const lo = Math.min(...values)
    const hi = Math.max(...values)
    const pad = Math.max(1, (hi - lo) * 0.6)
    return { min: lo - pad, max: hi + pad }
  })()
  const dom =
    kind === 'traffic'
      ? TRAFFIC_DOMAIN
      : kind === 'percent'
        ? PERCENT_DOMAIN
        : values.length > 0
          ? auto
          : PERCENT_DOMAIN
  const span = dom.max - dom.min || 1
  const pct = (v: number) => Math.max(0, Math.min(100, ((v - dom.min) / span) * 100))

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-slate-400 bg-white" />
          {firstLabel ?? 'Erstmessung'}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-brand-deep" />
          {secondLabel ?? 'Kontrolle'}
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const t = toneClasses(item.tone)
          const a = pct(item.first)
          const b = pct(item.second)
          return (
            <div
              key={item.label}
              className="grid grid-cols-[minmax(0,13rem)_1fr_auto] items-center gap-3"
            >
              {/* Nicht abschneiden — "Kardiovaskulaere Fitness" waere sonst weg. */}
              <span className="text-sm font-medium leading-tight text-text-heading sm:text-base">
                {item.label}
              </span>
              {/* Punkte als HTML statt SVG: ein Kreis in einem auf 100 %
                  gestreckten viewBox wird zur Ellipse. */}
              <div
                className="relative h-5"
                role="img"
                aria-label={`${item.label}: von ${item.firstDisplay ?? item.first} auf ${
                  item.secondDisplay ?? item.second
                }`}
              >
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-200" />
                <div
                  className={`absolute top-1/2 h-0.5 -translate-y-1/2 ${t.dot}`}
                  style={{ left: `${Math.min(a, b)}%`, width: `${Math.abs(b - a)}%` }}
                />
                <span
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-400 bg-white"
                  style={{ left: `${a}%` }}
                />
                <span
                  className={`absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white ${t.dot}`}
                  style={{ left: `${b}%` }}
                />
              </div>
              <span className="whitespace-nowrap text-base tabular-nums text-gray-600">
                <span className="text-gray-500">{item.firstDisplay ?? item.first}</span>
                <span className="px-1.5 text-gray-400">→</span>
                <span className={`font-semibold ${t.text}`}>
                  {item.secondDisplay ?? item.second}
                </span>
                {item.delta ? <span className={`pl-2 ${t.text}`}>{item.delta}</span> : null}
                {item.status ? (
                  <span className="pl-3">
                    <ToneBadge tone={item.tone}>{item.status}</ToneBadge>
                  </span>
                ) : null}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ===========================================================================
// AMPELLISTE — nach Wert sortierte Auswertungen
// ===========================================================================

export const EvaluationBars = ({
  items,
}: {
  items: { label: string; sub?: string; value: number; status?: string; tone?: string }[]
}) => (
  <div className="space-y-3">
    {items.map((item) => {
      const t = toneClasses(item.tone)
      return (
        <div
          key={item.label}
          className="grid grid-cols-[minmax(0,1fr)_minmax(0,8rem)_auto] items-center gap-4"
        >
          <span className="text-base text-text-heading">
            {item.label}
            {item.sub ? <span className="ml-2 text-sm text-gray-500">{item.sub}</span> : null}
          </span>
          <svg
            viewBox="0 0 90 8"
            preserveAspectRatio="none"
            className="h-2.5 w-full"
            role="img"
            aria-label={`${item.label}: ${item.value} von 9`}
          >
            <rect x={0} y={0} width={90} height={8} className="fill-slate-100" />
            <rect x={0} y={0} width={(item.value / 9) * 90} height={8} className={t.fill} />
          </svg>
          <span className={`whitespace-nowrap text-right text-base font-semibold tabular-nums ${t.text}`}>
            {item.value}/9
            {item.status ? (
              <span className="ml-2 font-medium">· {item.status}</span>
            ) : null}
          </span>
        </div>
      )
    })}
  </div>
)
