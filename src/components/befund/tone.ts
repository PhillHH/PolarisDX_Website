/**
 * Die drei Einordnungsfarben der Befunde — als eigenes Modul.
 *
 * Sie standen frueher in BefundCharts.tsx. Dort waren sie der einzige Export,
 * der keine Komponente ist, und genau das meldet die Lint-Regel
 * react-refresh/only-export-components: eine Datei, die Komponenten UND
 * Konstanten ausgibt, laesst sich beim Entwickeln nicht mehr sauber heiss
 * ersetzen. Der Inhalt ist unveraendert uebernommen.
 */

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
