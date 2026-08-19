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
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import {
  AgeDots,
  EvaluationBars,
  RadarChart,
  ScaleBar,
  ToneBadge,
  TrendChart,
} from './BefundCharts'
import { toneClasses } from './tone'
// Die Miniatur holt sich von hier nur den Typ `Block` zurueck. `import type`
// wird beim Bauen entfernt — zur Laufzeit entsteht kein Ringschluss.
import BefundMiniature from './BefundMiniature'
import { trackEvent } from '../../lib/tracking'

const BODY = 'text-base leading-7 lg:text-[17px] lg:leading-8'
const LEAD = 'text-lg leading-relaxed text-gray-600'

export interface Block {
  type: string
  [key: string]: unknown
}

const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : [])
const str = (v: unknown) => (typeof v === 'string' ? v : undefined)
const num = (v: unknown) => (typeof v === 'number' ? v : undefined)

/**
 * Rahmen eines Blocks — Hintergrund, Anker und Aufklappzustand kommen von
 * aussen, nicht vom Blocktyp. Siehe Section weiter unten.
 */
const BlockChrome = createContext<{
  tint: boolean
  id?: string
  /**
   * Zugeklappt: der Block liegt in einem <details>, seine Ueberschrift wird
   * zum Aufklapper. Der Inhalt bleibt im DOM — er ist damit indexierbar und
   * ueber die Seitensuche des Browsers auffindbar.
   */
  collapsed?: boolean
  /** Beschriftung des Aufklappers. */
  label?: string
  /** Zweite Zeile im Aufklapper, etwa die Zahl der Werte darin. */
  hint?: string
}>({ tint: false })
export const BlockChromeProvider = BlockChrome.Provider

/**
 * Kopfzeile aus Kicker und Ueberschrift, in allen Bloecken gleich.
 *
 * Im zugeklappten Block traegt der Aufklapper bereits die Ueberschrift — sie
 * hier ein zweites Mal auszugeben, ergaebe sie doppelt, sobald jemand oeffnet.
 * Kicker und Fuehrungstext bleiben, sie stehen nicht im Aufklapper.
 */
const Head = ({ caption, title, lead }: { caption?: string; title?: string; lead?: string }) => {
  const { collapsed } = useContext(BlockChrome)
  return (
    <>
      {caption ? (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
          {caption}
        </p>
      ) : null}
      {title && !collapsed ? (
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text-heading lg:text-3xl">
          {title}
        </h2>
      ) : null}
      {lead ? <p className={`mt-3 max-w-[68ch] ${LEAD}`}>{lead}</p> : null}
    </>
  )
}

/**
 * Rahmen eines Blocks. Hintergrund und Anker kommen von aussen, nicht vom
 * Blocktyp: die sechs Befunde haben unterschiedliche Blockfolgen, und ein an
 * den Typ gekoppelter Wechsel ergab je Befund einen anderen Rhythmus — bei
 * Metabolic Health 16 gleichfarbige Nachbarn am Stueck.
 *
 * scroll-mt haelt den Abschnitt beim Sprung aus der Kapitelleiste unter
 * Seitenkopf (68/88 px) und Leiste (~56 px) frei.
 */
const Section = ({ children }: { children: ReactNode }) => {
  const { tint, id, collapsed, label, hint } = useContext(BlockChrome)
  const shell = `scroll-mt-[var(--chapterbar-offset,148px)] ${
    tint ? 'border-y border-slate-200 bg-slate-50' : 'bg-white'
  }`

  if (!collapsed || !label) {
    return (
      <section id={id} className={shell}>
        <div className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">{children}</div>
      </section>
    )
  }

  /*
   * Zugeklappt. <details> statt einer eigenen Loesung, weil der Browser damit
   * alles mitbringt, was hier zaehlt: Tastaturbedienung, die richtige Rolle
   * fuer Screenreader, und in aktuellen Browsern findet die Seitensuche auch
   * Text im geschlossenen Block und klappt ihn auf. Der Inhalt ist zu keiner
   * Zeit aus dem DOM entfernt — fuer Suchmaschinen bleibt die Seite, was sie
   * war.
   */
  return (
    <section id={id} className={shell}>
      <details
        className="group mx-auto max-w-container px-4 lg:px-0"
        /*
         * Die Aufklapp-Rate ist die einzige Messgroesse, die es vor der
         * Staffelung nicht geben konnte: sie sagt, welche Tiefe wirklich
         * gebraucht wird. Ein Kapitel, das niemand oeffnet, ist der erste
         * Kandidat fuers Kuerzen — ein Kapitel, das fast jeder oeffnet, gehoert
         * womoeglich wieder aufgeklappt.
         *
         * Nur das Oeffnen wird gemeldet. Das Zuklappen sagt nichts Eigenes:
         * wer zuklappt, hat vorher geoeffnet und ist damit schon gezaehlt.
         */
        onToggle={(e) => {
          if (e.currentTarget.open) {
            trackEvent('befund_block_open', { block: id ?? 'ohne-anker', label })
          }
        }}
      >
        <summary className="flex cursor-pointer list-none items-center gap-4 py-7 [&::-webkit-details-marker]:hidden">
          {/*
           * Die Ueberschrift steht als echtes h2 im Aufklapper, nicht als span.
           * Auf einer Seite dieser Laenge ist die Ueberschriftenliste des
           * Screenreaders der Hauptnavigationsweg — ohne h2 fehlen dort genau
           * die vierzehn Kapitelnamen, nach denen jemand sucht. Der HTML-
           * Standard erlaubt Ueberschriften in <summary>; die Rolle des
           * Aufklappers bleibt daneben erhalten.
           */}
          {/* div, nicht span: span ist Phrasing Content und darf laut
              HTML-Inhaltsmodell keine Ueberschrift aufnehmen. Browser rendern
              es trotzdem, aber die Ueberschriftenliste des Screenreaders hing
              damit an einer Duldung statt am Standard. */}
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-semibold tracking-tight text-text-heading lg:text-3xl">
              {label}
            </h2>
            {hint ? <span className="mt-1 block text-base text-gray-600">{hint}</span> : null}
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 text-brand-deep transition-colors group-hover:border-brand-primary">
            <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
          </span>
        </summary>
        <div className="pb-12 lg:pb-16">{children}</div>
      </details>
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
    {scrollHint ? <p className="mt-2 text-sm text-gray-600 lg:hidden">{scrollHint}</p> : null}
  </>
)

// ===========================================================================

const Cover = ({ b, slug }: { b: Block; slug?: string }) => {
  const { t, i18n } = useTranslation('epigenetics')
  const istDeutsch = i18n.language?.startsWith('de') ?? false

  // Fakten und Zielgruppen kommen aus der Vergleichstabelle, nicht aus dem
  // Befund-JSON: dort liegen sie in allen zehn Sprachen, und Hero und Tabelle
  // koennen so nicht auseinanderlaufen. Geschluesselt ueber den Slug — der
  // Panelname ist uebersetzt, der Slug nicht.
  const samples = arr<{ slug: string; pages: string; file: string }>(
    t('samples.items', { returnObjects: true }),
  )
  const idx = slug ? samples.findIndex((x) => x.slug === slug) : -1
  const sample = idx >= 0 ? samples[idx] : undefined

  // compare.cols[0] ist der Panelname selbst, ab 1 stehen die fuenf Achsen.
  // compare.rows und compare.groups haengen positionell am selben Index.
  const cols = arr<string>(t('compare.cols', { returnObjects: true })).slice(1)
  const rows = arr<string[]>(t('compare.rows', { returnObjects: true }))
  const groups = arr<string[]>(t('compare.groups', { returnObjects: true }))
  const facts = idx >= 0 && rows[idx] ? cols.map((k, n) => ({ k, v: rows[idx][n + 1] })) : []
  const zielgruppen =
    idx >= 0 && groups[idx]
      ? groups[idx].map((g) => t(`compare.filter.options.${g}`)).join(' · ')
      : ''

  const anfrage = `/contact?intent=quote&source=epigenetics&panel=${encodeURIComponent(
    str(b.panel) ?? '',
  )}#kontaktformular`

  // Die sechs Panels stehen sichtbar im Hero, nicht nur im Aufklappmenue der
  // Kapitelleiste. Grund: ein Drittel der Sitzungen betritt die Website ueber
  // eine dieser sechs Seiten. Wer hier einsteigt, sieht sonst nirgends, dass es
  // fuenf weitere gibt — er muesste erst ein Menue oeffnen, von dem er nicht
  // weiss, dass es eines ist. Die Namen kommen aus derselben Quelle wie die
  // Fakten oben: compare.rows[n][0], in allen zehn Sprachen vorhanden.
  const panels = samples
    .map((s, n) => ({ slug: s.slug, name: rows[n]?.[0] }))
    .filter((p): p is { slug: string; name: string } => Boolean(p.slug && p.name))

  return (
    <section className="relative overflow-hidden bg-brand-deep text-white">
      <div className="mx-auto max-w-container px-4 py-10 lg:px-0 lg:py-24">
        {zielgruppen ? (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
            {zielgruppen}
          </p>
        ) : str(b.badge) ? (
          <span className="inline-flex rounded-full bg-accent-on-dark px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep">
            {str(b.badge)}
          </span>
        ) : null}

        <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">{str(b.panel)}</h1>

        {/* Nutzen vor Methode. Wo noch kein benefit hinterlegt ist, bleibt der
            bisherige Fachclaim stehen. */}
        <p className="mt-4 max-w-[62ch] text-lg leading-relaxed text-white/80 lg:text-xl">
          {str(b.benefit) || str(b.claim)}
        </p>

        {/* Die Faktenachsen stehen schon auf dem schmalsten Geraet zweispaltig:
            fuenf gestapelte Karten schoben CTA und Panelreihe rund 450 px nach
            unten, und genau die beiden sind der Grund, warum jemand ueberhaupt
            auf dieser Seite einsteigt. Die Achsenwerte sind kurz genug fuer die
            halbe Breite. */}
        {facts.length > 0 ? (
          <dl className="mt-8 grid grid-cols-2 gap-2.5 lg:mt-10 lg:gap-3 lg:grid-cols-5">
            {facts.map((f) => (
              <div
                key={f.k}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 lg:px-5 lg:py-4"
              >
                <dt className="text-xs font-medium text-white/60">{f.k}</dt>
                <dd className="mt-1 text-base font-semibold text-white">{f.v}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-10">
          <Link
            to={anfrage}
            /* Der Panel-Hero ist der Anfrageweg, dessen Quote der Umbau heben
               soll (heute 4 von 52 Musterbefund-Lesern). Ungemessen waere jede
               spaetere Aussage darueber eine Schaetzung. Dasselbe Ereignis wie
               auf der Landingpage, damit beide Wege in einer Zahl zusammen-
               laufen — unterschieden ueber `source`. */
            onClick={() =>
              trackEvent('epigenetics_request', {
                method: 'form',
                source: 'panel',
                panel: str(b.panel) ?? '',
              })
            }
            className="inline-flex items-center justify-center rounded-full bg-accent-on-dark px-7 py-3.5 text-base font-semibold text-brand-deep transition-opacity hover:opacity-90"
          >
            {t('hero.ctaQuote')}
          </Link>
          {sample?.file ? (
            <a
              href={`/downloads/epigenetics/${sample.file}`}
              /* Die Musterbefund-PDFs gibt es nur auf Deutsch. Der englische
                 Hero versprach bisher "This report as PDF" und lieferte
                 wortlos ein deutsches Dokument. */
              hrefLang="de"
              /* Der PDF-Weg ist der vierte Anfrageweg des Messplans und war
                 als einziger nicht verdrahtet. */
              onClick={() =>
                trackEvent('epigenetics_request', {
                  method: 'pdf',
                  source: 'panel',
                  panel: str(b.panel) ?? '',
                })
              }
              className="text-base font-medium text-white/80 underline underline-offset-4 hover:text-white"
            >
              {t('befund.ctaPdf')}
            </a>
          ) : null}
          {sample?.file && !istDeutsch ? (
            <span className="text-sm text-white/70">{t('samples.badge')}</span>
          ) : null}
        </div>

        {panels.length > 1 ? (
          <nav
            aria-label={t('samples.caption')}
            className="mt-8 border-t border-white/15 pt-5 lg:mt-12 lg:pt-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              {t('samples.caption')}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {panels.map((p) => {
                const aktuell = p.slug === slug
                // Der Punkt vor dem Namen traegt die Reihe optisch — gefuellt
                // fuer das Panel, auf dem der Leser steht. Der Name bleibt
                // trotzdem stehen: sechs nackte Punkte waeren sechs Raetsel.
                const punkt = (
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      aktuell ? 'bg-brand-deep' : 'bg-white/40'
                    }`}
                  />
                )
                return (
                  <li key={p.slug}>
                    {aktuell ? (
                      <span
                        aria-current="page"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-deep"
                      >
                        {punkt}
                        {p.name}
                      </span>
                    ) : (
                      <Link
                        to={`/epigenetics/musterbefund/${p.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:border-white/60 hover:text-white"
                      >
                        {punkt}
                        {p.name}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
        ) : null}
      </div>
    </section>
  )
}

/**
 * Die Kopfdaten der Beispielauswertung — Name, Probenahme, Material, Umfang.
 *
 * WARUM SIE NICHT MEHR UNTER DEM HERO STEHEN: sie beschreiben eine erfundene
 * Person. Auf dem ersten Bildschirm beantworteten sie damit keine einzige
 * Frage, die jemand an dieser Stelle hat — und ein Drittel der Sitzungen
 * betritt die Website ueber genau diese Seiten. Der Platz gehoert der
 * Kaufinformation (Zielgruppe, Nutzen, fuenf Faktenachsen), nicht dem
 * Anschauungsmaterial.
 *
 * Geloescht werden sie deshalb nicht: sie sind der Beleg, dass ein echter
 * Befund Herkunft und Umfang ausweist. Sie stehen jetzt dort, wo die
 * Beispielwerte beginnen, und tragen die Rahmung mit, die sie oben nie hatten
 * — als Demonstration erkennbar statt als Angabe ueber einen Patienten.
 */
export const SampleMeta = ({ b, caption, lead }: { b: Block; caption: string; lead: string }) => {
  const meta = arr<{ k: string; v: string }>(b.meta)
  if (meta.length === 0) return null
  return (
    <section className="border-y border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-container px-4 py-8 lg:px-0 lg:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue">
          {caption}
        </p>
        <p className="mt-2 max-w-[70ch] text-base leading-relaxed text-gray-600">{lead}</p>
        <dl className="mt-6 grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
          {meta.map((m) => (
            <div key={m.k} className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-600">
                {m.k}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-heading">{m.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/**
 * "So lesen Sie diesen Befund" — der zweite Hauptabschnitt der Seite.
 *
 * Hier steht jetzt alles beisammen, was man braucht, BEVOR der erste Wert
 * kommt: die Ebenen des Panels, die Skalenlegende und die annotierte Miniatur.
 * Vorher erklaerte sich jede Darstellungsform erst dort, wo sie zum ersten Mal
 * auftauchte — bei Metabolic Health rund 13.000 px weiter unten.
 *
 * `blocks` ist der ganze Befund, nicht nur dieser Block: die Miniatur rechnet
 * ihre Marken aus den Ergebnisbloecken desselben Dokuments.
 */
const Principle = ({ b, blocks }: { b: Block; blocks?: Block[] }) => {
  const cards = arr<{ title: string; text: string; items?: string[] }>(b.cards)
  const flow = arr<{ num: string; title: string; text: string }>(b.flow)
  const zones = arr<{ tone: string; label: string; text: string }>(b.scaleZones)
  const ticks = arr<string>(b.scaleTicks)
  return (
    <Section>
      <Head caption={str(b.caption)} title={str(b.title)} lead={str(b.lead)} />

      {cards.length > 0 ? (
        /* Zwei Karten sind die Zwei-Ebenen-Erklaerung (Genetik/Epigenetik) und
           tragen Listen — im Dreierraster stuenden sie schmal und mit einer
           Luecke daneben. */
        <div
          className={`mt-8 grid gap-5 ${cards.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}
        >
          {cards.map((c) => (
            <div key={c.title} className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-text-heading">{c.title}</h3>
              <p className={`mt-2 text-gray-700 ${BODY}`}>{c.text}</p>
              {/* Die Aufzaehlung stand seit jeher im Inhalts-JSON, wurde aber
                  nie ausgegeben — bei Metabolic Health sind das die sechs
                  Zeilen, die erklaeren, was ein SNP ist und welche vier Werte
                  auf der epigenetischen Ebene liegen. */}
              {arr<string>(c.items).length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {arr<string>(c.items).map((i) => (
                    <li key={i} className={`flex gap-3 text-gray-700 ${BODY}`}>
                      <span className="mt-3.5 h-1 w-3 shrink-0 rounded-full bg-accent-line" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {flow.length > 0 ? (
        <div className="mt-6">
          {str(b.flowTitle) ? (
            <p className="text-xs font-medium text-gray-600">{str(b.flowTitle)}</p>
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
            <p className="text-xs font-medium text-gray-600">{str(b.scaleCaption)}</p>
          ) : null}
          {str(b.scaleTitle) ? (
            <h3 className="mt-1 text-lg font-semibold text-text-heading">{str(b.scaleTitle)}</h3>
          ) : null}
          {str(b.scaleLead) ? (
            <p className={`mt-2 max-w-[68ch] text-gray-700 ${BODY}`}>{str(b.scaleLead)}</p>
          ) : null}
          {/* Frueher hing das Band an den Ticks aus dem JSON. Fehlten sie -
              wie bei healthy-sport -, verschwand die Skala aus der
              Skalenlegende und es blieben drei Zonen ohne Achse. Jetzt
              entscheidet die Skalenart; die Beschriftung der Ampel bringt
              ScaleBar selbst mit. */}
          {ticks.length > 0 || str(b.scaleKind) ? (
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

      {/* Die Miniatur steht hinter der Skalenlegende: erst was die Skala
          bedeutet, dann wie sie in diesem Panel aussieht. */}
      {blocks && blocks.length > 0 ? <BefundMiniature blocks={blocks} /> : null}
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
    {str(b.note) ? <p className="mt-3 text-sm text-gray-600">{str(b.note)}</p> : null}
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
    {str(b.note) ? <p className="mt-3 text-sm text-gray-600">{str(b.note)}</p> : null}
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
              {m.category ? (
                <span className="ml-2 text-base text-gray-600">{m.category}</span>
              ) : null}
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
  const { t } = useTranslation('epigenetics')
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
            /* `n` statt `count`: `count` schaltet in i18next die
               Pluralbehandlung ein und verlangte dann je Sprache zwei
               Schluessel fuer einen Satz, den niemand liest, sondern hoert. */
            beschreibung={t('befund.a11y.radar', { n: axes.length })}
          />
        </div>
        <div className="space-y-4">
          {scores.map((s) => (
            <div key={s.label} className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-3xl font-semibold tabular-nums text-text-heading">{s.value}</p>
              <p className="mt-1 text-base font-semibold text-text-heading">{s.label}</p>
              {s.text ? <p className={`mt-2 text-gray-700 ${BODY}`}>{s.text}</p> : null}
              {s.ref ? <p className="mt-2 text-sm text-gray-600">{s.ref}</p> : null}
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
      {str(b.note) ? <p className="mt-4 text-sm text-gray-600">{str(b.note)}</p> : null}
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
    {str(b.note) ? <p className="mt-3 text-sm text-gray-600">{str(b.note)}</p> : null}
  </Section>
)

const Evaluations = ({ b }: { b: Block }) => (
  <Section>
    <Head caption={str(b.caption)} title={str(b.title)} lead={str(b.lead)} />
    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 lg:p-8">
      <EvaluationBars items={arr(b.items)} />
    </div>
    {str(b.note) ? <p className="mt-3 text-sm text-gray-600">{str(b.note)}</p> : null}
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
              <p className="text-xs font-medium text-gray-600">{str(b.compareTitle)}</p>
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
    {str(b.note) ? <p className="mt-3 text-sm text-gray-600">{str(b.note)}</p> : null}
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
          <p className={`text-sm font-semibold ${accent ? 'text-accent-strong' : 'text-gray-600'}`}>
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

/**
 * Fester Hinweisrahmen — die Pflichttexte an einer auf allen sechs Panels
 * gleichen Stelle, direkt hinter "So lesen Sie diesen Befund".
 *
 * Bisher standen die Pflichttexte geschlossen nur ganz am Seitenende unter dem
 * Kontaktblock. Wer den Befund von oben liest, kam an ihnen erst nach dem
 * letzten Kapitel vorbei, und welcher Hinweis wo auftauchte, unterschied sich
 * von Panel zu Panel. Der Rahmen zieht sie nach vorn, ohne sie unten
 * wegzunehmen: der Hinweis auf die Beispieldaten muss an allen Stellen stehen
 * bleiben, an denen er heute steht.
 *
 * Der Wortlaut kommt UNVERAENDERT aus dem legal-Feld des Kontaktblocks
 * desselben Befunds — abgestimmter Text, woertlich wie im PDF. Damit steht im
 * Rahmen kein Satz, der nicht schon freigegeben waere, und er bleibt von
 * selbst panelrichtig: der Hinweis auf das Gendiagnostikgesetz erscheint
 * weiter nur dort, wo genetisch ausgewertet wird.
 *
 * Der Rahmen liegt nie hinter einem Aufklapper. Er uebernimmt den Ton des
 * Grundsatzblocks davor, damit er sichtbar zu ihm gehoert — dieselbe Regel,
 * nach der auch ein callout den Ton seines Vorgaengers erbt.
 */
export const BefundNotice = ({
  caption,
  legal,
  tint,
  id = 'pflichthinweise',
}: {
  caption: string
  legal: { title: string; text: string }[]
  tint: boolean
  id?: string
}) => {
  if (legal.length === 0) return null
  return (
    <BlockChromeProvider value={{ tint, id }}>
      <Section>
        {/*
         * Echtes h2: auf einer Seite dieser Laenge ist die Ueberschriftenliste
         * des Screenreaders der Hauptnavigationsweg, und die Pflichthinweise
         * gehoeren dort hinein. Die Kapitelleiste bleibt unberuehrt — sie
         * fuehrt durch die Wertekapitel, nicht durch die Rechtstexte.
         */}
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
          {caption}
        </h2>
        <div
          className={`mt-4 rounded-3xl border border-slate-200 p-7 ${
            tint ? 'bg-white' : 'bg-slate-50'
          }`}
        >
          <dl className="space-y-4">
            {legal.map((l) => (
              <div key={l.title}>
                <dt className="text-sm font-semibold text-gray-600">{l.title}</dt>
                <dd className="mt-1 max-w-[80ch] text-sm leading-relaxed text-gray-600">
                  {l.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>
    </BlockChromeProvider>
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
            <p className="text-xs font-medium text-gray-600">{str(b.controlTitle)}</p>
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
          {i.source ? <p className="mt-3 text-sm text-gray-600">{i.source}</p> : null}
        </div>
      ))}
    </div>
    {str(b.note) ? (
      <p className="mt-6 max-w-[80ch] text-sm leading-relaxed text-gray-600">{str(b.note)}</p>
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
          <p className="text-xs font-medium text-gray-600">{c.k}</p>
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
        <p key={l.title} className="max-w-[80ch] text-sm leading-relaxed text-gray-600">
          <span className="font-semibold text-gray-600">{l.title}.</span> {l.text}
        </p>
      ))}
      {str(b.copyright) ? <p className="text-sm text-gray-600">{str(b.copyright)}</p> : null}
    </div>
  </Section>
)

// ===========================================================================

export const BefundBlock = ({
  block,
  blocks,
  slug,
  radarValues,
  scrollHint,
}: {
  block: Block
  /** Der ganze Befund. Nur der Grundsatzblock braucht ihn — fuer die Miniatur. */
  blocks?: Block[]
  slug?: string
  radarValues?: { profile: number[]; reference?: number[] }
  scrollHint?: string
}) => {
  switch (block.type) {
    case 'cover':
      // Nur der Hero. Die Kopfdaten der Beispielauswertung rendert
      // MusterbefundPage weiter unten als <SampleMeta>, dort wo die
      // Beispielwerte beginnen.
      return <Cover b={block} slug={slug} />
    case 'principle':
      return <Principle b={block} blocks={blocks} />
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
