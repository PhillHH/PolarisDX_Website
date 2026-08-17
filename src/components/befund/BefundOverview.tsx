/**
 * BefundOverview — alle Werte eines Musterbefunds auf einem Bildschirm.
 *
 * Die Befundseiten sind rund 24.000 px lang; die Einzelwerte verteilen sich bei
 * Metabolic Health auf neun Kapitel und etwa 13.000 px. Wer einen Befund liest,
 * will zuerst wissen, was auffaellig ist — dafuer musste er bisher die ganze
 * Strecke scrollen.
 *
 * Dieser Block steht direkt hinter der Kapitelleiste und fuehrt jeden Wert mit
 * Ton, Anzeigewert und Sprung zu seinem Abschnitt. Er erfindet nichts: alle
 * Angaben stammen aus denselben Blockdaten, die weiter unten ausfuehrlich
 * stehen, und die Reihenfolge ist die des Dokuments — nicht nach Auffaelligkeit
 * sortiert, das waere eine fachliche Wertung.
 */

import { ToneBadge } from './BefundCharts'
import type { Block } from './BefundBlocks'

interface OverviewEntry {
  name: string
  display?: string
  status?: string
  tone?: string
  anchor?: string
  /** Stammt aus einem ausfuehrlichen Markerblock, nicht aus der Ergebnistabelle. */
  detail?: boolean
}

interface MaybeItem {
  name?: unknown
  label?: unknown
  display?: unknown
  status?: unknown
  tone?: unknown
}

interface MaybeRow {
  cells?: unknown[]
  tone?: unknown
}

const str = (v: unknown) => (typeof v === 'string' ? v : undefined)

/** Ein Zahlenwert wie "2 / 9", "112 %" oder "34,5" — nicht jede Zelle ist einer. */
const WERT = /^\s*[\d.,]+\s*(\/|%)/

/**
 * Sammelt jeden Wert, der einen Ton traegt — also auf einer Skala eingeordnet
 * ist. Die drei Blockarten fuehren ihre Werte unterschiedlich:
 *   markers      items[] mit name
 *   evaluations  items[] mit label
 *   resultTable  rows[]  mit cells[] und tone
 * Deshalb alle drei Formen, statt sich auf eine zu verlassen.
 */
function collectOverview(blocks: Block[]): OverviewEntry[] {
  const out: OverviewEntry[] = []
  for (const block of blocks) {
    const anchor = typeof block.id === 'string' ? block.id : undefined

    for (const item of Array.isArray(block.items) ? (block.items as MaybeItem[]) : []) {
      const name = str(item?.name) ?? str(item?.label)
      const tone = str(item?.tone)
      if (!name || !tone) continue
      out.push({
        name,
        tone,
        display: str(item?.display),
        status: str(item?.status),
        anchor,
        detail: block.type === 'markers',
      })
    }

    for (const row of Array.isArray(block.rows) ? (block.rows as MaybeRow[]) : []) {
      const tone = str(row?.tone)
      const cells = Array.isArray(row?.cells)
        ? row.cells.filter((c): c is string => typeof c === 'string')
        : []
      if (!tone || cells.length === 0) continue
      out.push({
        name: cells[0],
        tone,
        display: cells.slice(1).find((c) => WERT.test(c)),
        status: cells.length > 1 ? cells[cells.length - 1] : undefined,
        anchor,
        detail: false,
      })
    }
  }

  // Dieselben Werte stehen zweimal in den Daten: einmal in der Ergebnistabelle
  // am Anfang, einmal im ausfuehrlichen Markerblock weiter unten. Im Ueberblick
  // gehoert jeder Wert genau einmal vor — an seiner ersten Stelle, aber mit dem
  // Sprungziel des ausfuehrlichen Blocks, denn dorthin will man beim Klick.
  const schluessel = (e: OverviewEntry) =>
    e.name.split('·')[0].trim().toLowerCase() + '|' + (e.display ?? '')
  const gesehen = new Map<string, OverviewEntry>()
  for (const e of out) {
    const k = schluessel(e)
    const vorhanden = gesehen.get(k)
    if (!vorhanden) {
      gesehen.set(k, { ...e })
    } else if (e.detail && !vorhanden.detail) {
      vorhanden.anchor = e.anchor
      vorhanden.detail = true
    }
  }
  return [...gesehen.values()]
}

interface Labels {
  caption: string
  title: string
  lead: string
  red: string
  amber: string
  green: string
}

const BefundOverview = ({ blocks, labels }: { blocks: Block[]; labels: Labels }) => {
  const entries = collectOverview(blocks)
  if (entries.length < 4) return null

  const count = (tone: string) => entries.filter((e) => e.tone === tone).length
  const summary = [
    { tone: 'red', n: count('red'), label: labels.red },
    { tone: 'amber', n: count('amber'), label: labels.amber },
    { tone: 'green', n: count('green'), label: labels.green },
  ].filter((s) => s.n > 0)

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-container px-4 py-14 lg:px-0 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
          {labels.caption}
        </p>
        <h2 className="mt-3 text-2xl font-medium tracking-tight text-heading lg:text-3xl">
          {labels.title}
        </h2>
        <p className="mt-3 max-w-[72ch] text-lg leading-8 text-gray-700">{labels.lead}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {summary.map((s) => (
            <ToneBadge key={s.tone} tone={s.tone}>
              {s.n} {s.label}
            </ToneBadge>
          ))}
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((e, i) => {
            const inner = (
              <>
                <span className="min-w-0 flex-1 truncate text-base text-heading">{e.name}</span>
                {e.display ? (
                  <span className="shrink-0 text-base font-semibold text-heading">{e.display}</span>
                ) : null}
                {e.status ? <ToneBadge tone={e.tone}>{e.status}</ToneBadge> : null}
              </>
            )
            const cls =
              'flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-colors'
            return (
              <li key={`${e.name}-${i}`}>
                {e.anchor ? (
                  <a href={`#${e.anchor}`} className={`${cls} hover:border-brand-primary`}>
                    {inner}
                  </a>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default BefundOverview
