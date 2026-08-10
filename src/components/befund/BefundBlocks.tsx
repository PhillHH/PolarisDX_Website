/**
 * Bausteine der Musterbefund-Seiten.
 *
 * Ein Befund ist eine Liste typisierter Bloecke; hier steht je Typ ein
 * Renderer. Die Inhalte kommen aus src/content/befunde/<slug>.<lang>.json und
 * bilden das Quell-PDF vollstaendig ab — deshalb ist ein fehlendes Feld kein
 * Fehlerfall, sondern einfach ein Abschnitt, den dieses Panel nicht hat.
 * Jeder Renderer prueft deshalb, bevor er etwas ausgibt.
 */

import { createContext, useContext, type ReactNode } from 'react'
import {
  AgeDots,
  EvaluationBars,
  RadarChart,
  ScaleBar,
  ToneBadge,
  TrendChart,
  toneClasses,
} from './BefundCharts'

const BODY = 'text-base leading-7 lg:text-[17px] lg:leading-8'
const LEAD = 'text-lg leading-relaxed text-gray-600'

export interface Block {
  type: string
  [key: string]: unknown
}

const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])
const str = (v: unknown) => (typeof v === 'string' ? v : undefined)
const num = (v: unknown) => (typeof v === 'number' ? v : undefined)

/** Kopfzeile aus Kicker und Ueberschrift, in allen Bloecken gleich. */
const Head = ({
  caption,
  title,
  lead,
}: {
  caption?: string
  title?: string
  lead?: string
}) => (
  <>
    {caption ? (
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
        {caption}
      </p>
    ) : null}
    {title ? (
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-heading lg:text-3xl">
        {title}
      </h2>
    ) : null}
    {lead ? <p className={`mt-3 max-w-[68ch] ${LEAD}`}>{lead}</p> : null}
  </>
)

/**
 * Rahmen eines Blocks. Hintergrund und Anker kommen von aussen, nicht vom
 * Blocktyp: die sechs Befunde haben unterschiedliche Blockfolgen, und ein an
 * den Typ gekoppelter Wechsel ergab je Befund einen anderen Rhythmus — bei
 * Metabolic Health 16 gleichfarbige Nachbarn am Stueck.
 *
 * scroll-mt haelt den Abschnitt beim Sprung aus der Kapitelleiste unter
 * Seitenkopf (68/88 px) und Leiste (~56 px) frei.
 */
const BlockChrome = createContext<{ tint: boolean; id?: string }>({ tint: false })
export const BlockChromeProvider = BlockChrome.Provider

const Section = ({ children }: { children: ReactNode }) => {
  const { tint, id } = useContext(BlockChrome)
  return (
    <section
      id={id}
      className={`scroll-mt-[var(--chapterbar-offset,148px)] ${
        tint ? 'border-y border-slate-200 bg-slate-50' : 'bg-white'
      }`}
    >
      <div className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">{children}</div>
    </section>
  )
}

/** Waagerecht scrollbare Tabelle — die Befunde haben bis zu fuenf Spalten. */
const DataTable = ({
  cols,
  rows,
  rowTones,
  badgeLastCell = false,
  scrollHint,
  label,
}: {
  cols: string[]
  rows: (string[] | { cells: string[]; tone?: string })[]
  /** Name der Tabelle fuer Screenreader — sonst heisst sie nur "Tabelle". */
  label?: string
  /** Ton je Zeile — faerbt nur den linken Rand, weil nicht feststeht, auf
      welche Spalte er sich bezieht. */
  rowTones?: string[]
  /** Nur wo die letzte Spalte tatsaechlich die Einordnung ist. */
  badgeLastCell?: boolean
  scrollHint?: string
}) => (
  <>
    <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
      <table aria-label={label} className="w-full min-w-[44rem] border-collapse text-left">
        <thead>
          <tr className="bg-brand-deep text-white">
            {cols.map((c, j) => (
              <th
                key={c}
                scope="col"
                className={`px-4 py-3 text-sm font-semibold ${
                  j === 0 ? 'sticky left-0 z-20 bg-brand-deep' : ''
                }`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const cells = Array.isArray(row) ? row : row.cells
            const tone = Array.isArray(row) ? rowTones?.[i] : (row.tone ?? rowTones?.[i])
            return (
              <tr key={`${cells[0]}-${i}`} className={i % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                {cells.map((cell, j) => (
                  <td
                    key={`${cell}-${j}`}
                    /* Die erste Spalte laeuft mit: die Tabellen sind 704 px
                       breit und stehen mobil in 356 px. Ohne sie liest man
                       Mengen, ohne zu wissen, wozu sie gehoeren. Der
                       Hintergrund muss deckend sein und die Zebrastreifung
                       aufnehmen, sonst scheint der Inhalt durch. */
                    className={`px-4 py-3 align-top text-base ${
                      j === 0
                        ? `sticky left-0 z-10 font-semibold text-text-heading ${
                            i % 2 === 1 ? 'bg-slate-50' : 'bg-white'
                          } ${tone ? 'border-l-4 ' + toneClasses(tone).border : ''}`
                        : 'text-gray-700'
                    }`}
                  >
                    {badgeLastCell && tone && j === cells.length - 1 ? (
                      <ToneBadge tone={tone}>{cell}</ToneBadge>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
    {scrollHint ? <p className="mt-2 text-sm text-gray-500 lg:hidden">{scrollHint}</p> : null}
  </>
)

// ===========================================================================

const Cover = ({ b }: { b: Block }) => (
  <section className="relative overflow-hidden bg-brand-deep text-white">
    <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
      {str(b.badge) ? (
        <span className="inline-flex rounded-full bg-accent-on-dark px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep">
          {str(b.badge)}
        </span>
      ) : null}
      <h1 className="mt-6 text-4xl font-semibold tracking-tight lg:text-5xl">{str(b.panel)}</h1>
      {str(b.subtitle) ? (
        <p className="mt-1 text-2xl font-medium text-white/60 lg:text-3xl">{str(b.subtitle)}</p>
      ) : null}
      {str(b.claim) ? (
        <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-white/80">{str(b.claim)}</p>
      ) : null}

      <dl className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {arr<{ k: string; v: string }>(b.meta).map((m) => (
          <div key={m.k} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
            <dt className="text-xs font-medium text-white/60">{m.k}</dt>
            <dd className="mt-1 text-base font-semibold text-white">{m.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
)

const Principle = ({ b }: { b: Block }) => {
  const cards = arr<{ title: string; text: string }>(b.cards)
  const flow = arr<{ num: string; title: string; text: string }>(b.flow)
  const zones = arr<{ tone: string; label: string; text: string }>(b.scaleZones)
  const ticks = arr<string>(b.scaleTicks)
  return (
    <Section>
      <Head caption={str(b.caption)} title={str(b.title)} lead={str(b.lead)} />

      {cards.length > 0 ? (
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {cards.map((c) => (
            <div key={c.title} className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-text-heading">{c.title}</h3>
              <p className={`mt-2 text-gray-700 ${BODY}`}>{c.text}</p>
            </div>
          ))}
        </div>
      ) : null}

      {flow.length > 0 ? (
        <div className="mt-6">
          {str(b.flowTitle) ? (
            <p className="text-xs font-medium text-gray-500">{str(b.flowTitle)}</p>
          ) : null}
          <ol className="mt-3 grid gap-5 lg:grid-cols-3">
            {flow.map((f) => (
              <li key={f.num} className="rounded-3xl border border-slate-200 bg-white p-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-deep text-sm font-semibold text-white">
                  {f.num}
                </span>
                <h3 className="mt-3 text-base font-semibold text-text-heading">{f.title}</h3>
                <p className={`mt-1.5 text-gray-700 ${BODY}`}>{f.text}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {zones.length > 0 ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
          {str(b.scaleCaption) ? (
            <p className="text-xs font-medium text-gray-500">{str(b.scaleCaption)}</p>
          ) : null}
          {str(b.scaleTitle) ? (
            <h3 className="mt-1 text-lg font-semibold text-text-heading">{str(b.scaleTitle)}</h3>
          ) : null}
          {str(b.scaleLead) ? (
            <p className={`mt-2 max-w-[68ch] text-gray-700 ${BODY}`}>{str(b.scaleLead)}</p>
          ) : null}
          {ticks.length > 0 ? (
            <div className="mt-5">
              <ScaleBar
                kind={str(b.scaleKind) ?? 'percent'}
                value={str(b.scaleKind) === 'traffic' ? 9 : 130}
                ticks={ticks}
                tone="green"
                display=""
              />
            </div>
          ) : null}
          <dl className="mt-5 grid gap-4 lg:grid-cols-3">
            {zones.map((z) => (
              <div key={z.label}>
                <dt>
                  <ToneBadge tone={z.tone}>{z.label}</ToneBadge>
                </dt>
                <dd className={`mt-2 text-gray-700 ${BODY}`}>{z.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </Section>
  )
}

const ResultTable = ({ b, hint }: { b: Block; hint?: string }) => (
  <Section>
    <Head caption={str(b.caption)} title={str(b.title)} lead={str(b.lead)} />
    <DataTable
      cols={arr<string>(b.cols)}
      rows={arr<{ cells: string[]; tone?: string }>(b.rows)}
      rowTones={arr<string>(b.rowTones)}
      badgeLastCell
      scrollHint={hint}
      label={str(b.title)}
    />
    {str(b.note) ? <p className="mt-3 text-sm text-gray-500">{str(b.note)}</p> : null}
  </Section>
)

const AgeBlock = ({ b }: { b: Block }) => (
  <Section>
    <Head caption={str(b.caption)} title={str(b.title)} lead={str(b.lead)} />
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 lg:p-8">
      <AgeDots
        items={arr(b.items)}
        chronological={num(b.chronological) ?? 0}
        chronologicalLabel={str(b.chronologicalLabel)}
        min={num(b.min) ?? 30}
        max={num(b.max) ?? 70}
        unit={str(b.unit) ?? 'Jahre'}
      />
    </div>
    {str(b.note) ? <p className="mt-3 text-sm text-gray-500">{str(b.note)}</p> : null}
  </Section>
)

interface MarkerItem {
  name: string
  category?: string
  intro?: string
  kind?: string
  value: number
  display?: string
  sub?: string
  ticks?: string[]
  /** Einordnung in Worten — steht so im Befund und gehoert auf die Seite. */
  status?: string
  zoneLabels?: string[]
  tone?: string
  text?: string
  table?: { cols: string[]; rows: string[][] }
}

const Markers = ({ b, hint }: { b: Block; hint?: string }) => (
  <Section>
    <Head caption={str(b.caption)} title={str(b.title)} lead={str(b.lead)} />
    <div className="mt-8 space-y-6">
      {arr<MarkerItem>(b.items).map((m) => (
        <article key={m.name} className="rounded-3xl border border-slate-200 bg-white p-6 lg:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-xl font-semibold tracking-tight text-text-heading">
              {m.name}
              {m.category ? <span className="ml-2 text-base text-gray-500">{m.category}</span> : null}
            </h3>
          </div>
          {m.intro ? <p className={`mt-2 max-w-[72ch] text-gray-600 ${BODY}`}>{m.intro}</p> : null}

          <div className="mt-6 max-w-xl">
            <ScaleBar
              kind={m.kind}
              value={m.value}
              ticks={m.ticks}
              tone={m.tone}
              display={m.display}
              sub={m.sub}
              status={m.status}
              zoneLabels={m.zoneLabels}
            />
          </div>

          {m.text ? <p className={`mt-6 max-w-[72ch] text-gray-700 ${BODY}`}>{m.text}</p> : null}

          {m.table && m.table.cols?.length ? (
            <DataTable
              cols={m.table.cols}
              rows={m.table.rows ?? []}
              scrollHint={hint}
              label={`${m.name} — ${m.table.cols[0]}`}
            />
          ) : null}
        </article>
      ))}
    </div>
  </Section>
)

const Radar = ({
  b,
  values,
}: {
  b: Block
  values?: { profile: number[]; reference?: number[] }
}) => {
  const axes = arr<string>(b.axes)
  const scores = arr<{ value: string; label: string; text?: string; ref?: string }>(b.scores)
  const notices = arr<string>(b.notices)
  if (!values || axes.length === 0) return null
  const labels = (b.seriesLabels ?? {}) as { profile?: string; reference?: string }
  return (
    <Section>
      <Head caption={str(b.caption)} title={str(b.title)} lead={str(b.lead)} />
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <RadarChart
            axes={axes}
            profile={values.profile}
            reference={values.reference}
            labels={labels}
          />
        </div>
        <div className="space-y-4">
          {scores.map((s) => (
            <div key={s.label} className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-3xl font-semibold tabular-nums text-text-heading">{s.value}</p>
              <p className="mt-1 text-base font-semibold text-text-heading">{s.label}</p>
              {s.text ? <p className={`mt-2 text-gray-700 ${BODY}`}>{s.text}</p> : null}
              {s.ref ? <p className="mt-2 text-sm text-gray-500">{s.ref}</p> : null}
            </div>
          ))}
        </div>
      </div>

      {notices.length > 0 ? (
        <div className="mt-6 rounded-3xl border border-accent-border bg-accent-soft p-7">
          {str(b.noticeTitle) ? (
            <p className="text-sm font-semibold text-accent-strong">{str(b.noticeTitle)}</p>
          ) : null}
          <ul className="mt-4 space-y-3">
            {notices.map((n) => (
              <li key={n} className={`flex gap-3 text-gray-700 ${BODY}`}>
                <span className="mt-3.5 h-1 w-3 shrink-0 rounded-full bg-accent-line" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {str(b.note) ? <p className="mt-4 text-sm text-gray-500">{str(b.note)}</p> : null}
    </Section>
  )
}

const TableBlock = ({ b, hint }: { b: Block; hint?: string }) => (
  <Section>
    <Head caption={str(b.caption)} title={str(b.title)} lead={str(b.lead)} />
    <DataTable
      cols={arr<string>(b.cols)}
      rows={arr<string[]>(b.rows)}
      rowTones={arr<string>(b.rowTones)}
      scrollHint={hint}
      label={str(b.title)}
    />
    {str(b.note) ? <p className="mt-3 text-sm text-gray-500">{str(b.note)}</p> : null}
  </Section>
)

const Evaluations = ({ b }: { b: Block }) => (
  <Section>
    <Head caption={str(b.caption)} title={str(b.title)} lead={str(b.lead)} />
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 lg:p-8">
      <EvaluationBars items={arr(b.items)} />
    </div>
    {str(b.note) ? <p className="mt-3 text-sm text-gray-500">{str(b.note)}</p> : null}
  </Section>
)

const BigResult = ({ b }: { b: Block }) => {
  const compare = arr<{ label: string; value: string; tone?: string }>(b.compare)
  return (
    <Section>
      <Head caption={str(b.caption)} title={str(b.title)} lead={str(b.lead)} />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 lg:p-8">
          <ScaleBar
            kind={str(b.kind)}
            value={num(b.value) ?? 0}
            ticks={arr<string>(b.ticks)}
            tone={str(b.tone)}
            display={str(b.display)}
            sub={str(b.sub)}
            status={str(b.status)}
            zoneLabels={arr<string>(b.zoneLabels)}
          />
          {str(b.text) ? <p className={`mt-6 text-gray-700 ${BODY}`}>{str(b.text)}</p> : null}
        </div>
        {compare.length > 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 lg:p-8">
            {str(b.compareTitle) ? (
              <p className="text-xs font-medium text-gray-500">{str(b.compareTitle)}</p>
            ) : null}
            <dl className="mt-4 space-y-4">
              {compare.map((c) => (
                <div key={c.label} className="flex items-baseline justify-between gap-4">
                  <dt className={`text-gray-700 ${BODY}`}>{c.label}</dt>
                  <dd
                    className={`shrink-0 text-xl font-semibold tabular-nums ${
                      c.tone ? toneClasses(c.tone).text : 'text-text-heading'
                    }`}
                  >
                    {c.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>
    </Section>
  )
}

const Trend = ({ b }: { b: Block }) => (
  <Section>
    <Head caption={str(b.caption)} title={str(b.title)} lead={str(b.lead)} />
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 lg:p-8">
      <TrendChart
        items={arr(b.items)}
        kind={str(b.kind)}
        firstLabel={str(b.firstLabel)}
        secondLabel={str(b.secondLabel)}
      />
    </div>
    {str(b.note) ? <p className="mt-3 text-sm text-gray-500">{str(b.note)}</p> : null}
  </Section>
)

const Callout = ({ b }: { b: Block }) => {
  const items = arr<string>(b.items)
  const accent = str(b.tone) !== 'neutral'
  return (
    <Section>
      <div
        className={`rounded-3xl border p-7 ${
          accent ? 'border-accent-border bg-accent-soft' : 'border-slate-200 bg-slate-50'
        }`}
      >
        {str(b.title) ? (
          <p
            className={`text-sm font-semibold ${accent ? 'text-accent-strong' : 'text-gray-500'}`}
          >
            {str(b.title)}
          </p>
        ) : null}
        {str(b.text) ? (
          <p className={`mt-3 max-w-[72ch] text-gray-700 ${BODY}`}>{str(b.text)}</p>
        ) : null}
        {items.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {items.map((i) => (
              <li key={i} className={`flex gap-3 text-gray-700 ${BODY}`}>
                <span className="mt-3.5 h-1 w-3 shrink-0 rounded-full bg-accent-line" />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Section>
  )
}

const Summary = ({ b }: { b: Block }) => {
  const focuses = arr<{ num: string; title: string; text: string }>(b.focuses)
  const control = arr<string>(b.controlItems)
  return (
    <Section>
      <Head caption={str(b.caption)} title={str(b.title)} lead={str(b.lead)} />
      <div className="mt-8 space-y-5">
        {focuses.map((f) => (
          <div key={f.num} className="rounded-3xl border border-slate-200 bg-white p-6 lg:p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-deep text-sm font-semibold text-white">
                {f.num}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-text-heading">{f.title}</h3>
                <p className={`mt-2 max-w-[72ch] text-gray-700 ${BODY}`}>{f.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {str(b.keepText) ? (
        <div className="mt-5 rounded-3xl border border-accent-border bg-accent-soft p-7">
          {str(b.keepTitle) ? (
            <p className="text-sm font-semibold text-accent-strong">{str(b.keepTitle)}</p>
          ) : null}
          <p className={`mt-3 max-w-[72ch] text-gray-700 ${BODY}`}>{str(b.keepText)}</p>
        </div>
      ) : null}

      {control.length > 0 ? (
        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-7">
          {str(b.controlTitle) ? (
            <p className="text-xs font-medium text-gray-500">{str(b.controlTitle)}</p>
          ) : null}
          <ul className="mt-3 space-y-2">
            {control.map((c) => (
              <li key={c} className={`flex gap-3 text-gray-700 ${BODY}`}>
                <span className="mt-3.5 h-1 w-3 shrink-0 rounded-full bg-accent-line" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  )
}

const Science = ({ b }: { b: Block }) => (
  <Section>
    <Head caption={str(b.caption)} title={str(b.title)} lead={str(b.lead)} />
    <div className="mt-8 grid gap-5 lg:grid-cols-2">
      {arr<{ title: string; text: string; source?: string }>(b.items).map((i) => (
        <div key={i.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 lg:p-7">
          <h3 className="text-lg font-semibold text-text-heading">{i.title}</h3>
          <p className={`mt-2 text-gray-700 ${BODY}`}>{i.text}</p>
          {i.source ? <p className="mt-3 text-sm text-gray-500">{i.source}</p> : null}
        </div>
      ))}
    </div>
    {str(b.note) ? (
      <p className="mt-6 max-w-[80ch] text-sm leading-relaxed text-gray-500">{str(b.note)}</p>
    ) : null}
  </Section>
)

const Contact = ({ b }: { b: Block }) => (
  <Section>
    <h2 className="text-2xl font-semibold tracking-tight text-text-heading lg:text-3xl">
      {str(b.title)}
    </h2>
    {str(b.text) ? <p className={`mt-3 max-w-[62ch] ${LEAD}`}>{str(b.text)}</p> : null}

    <div className="mt-8 grid gap-5 sm:grid-cols-2">
      {arr<{ k: string; lines: string[] }>(b.columns).map((c) => (
        <div key={c.k} className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-medium text-gray-500">{c.k}</p>
          <ul className="mt-2 space-y-1">
            {arr<string>(c.lines).map((l) => (
              <li key={l} className="text-base text-text-heading">
                {l}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Die Rechtstexte sind abgestimmt und stehen woertlich wie im PDF. */}
    <div className="mt-8 space-y-4">
      {arr<{ title: string; text: string }>(b.legal).map((l) => (
        <p key={l.title} className="max-w-[80ch] text-sm leading-relaxed text-gray-500">
          <span className="font-semibold text-gray-600">{l.title}.</span> {l.text}
        </p>
      ))}
      {str(b.copyright) ? (
        <p className="text-sm text-gray-400">{str(b.copyright)}</p>
      ) : null}
    </div>
  </Section>
)

// ===========================================================================

export const BefundBlock = ({
  block,
  radarValues,
  scrollHint,
}: {
  block: Block
  radarValues?: { profile: number[]; reference?: number[] }
  scrollHint?: string
}) => {
  switch (block.type) {
    case 'cover':
      return <Cover b={block} />
    case 'principle':
      return <Principle b={block} />
    case 'resultTable':
      return <ResultTable b={block} hint={scrollHint} />
    case 'ageDots':
      return <AgeBlock b={block} />
    case 'markers':
      return <Markers b={block} hint={scrollHint} />
    case 'radar':
      return <Radar b={block} values={radarValues} />
    case 'table':
      return <TableBlock b={block} hint={scrollHint} />
    case 'evaluations':
      return <Evaluations b={block} />
    case 'bigResult':
      return <BigResult b={block} />
    case 'trend':
      return <Trend b={block} />
    case 'callout':
      return <Callout b={block} />
    case 'summary':
      return <Summary b={block} />
    case 'science':
      return <Science b={block} />
    case 'contact':
      return <Contact b={block} />
    default:
      return null
  }
}
