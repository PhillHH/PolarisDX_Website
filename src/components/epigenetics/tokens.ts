/**
 * Gemeinsame Schriftgroessen, Pfade und Helfer der Epigenetik-Strecke.
 *
 * Eigene Datei und nicht in EpiSubpage.tsx: eine Komponentendatei, die auch
 * Konstanten exportiert, nimmt dem Fast Refresh die Zuordnung
 * (react-refresh/only-export-components).
 */

/**
 * Fliesstext, Lead und Kleinlabel — identisch zur Programmseite, damit die
 * Lesegroesse beim Wechsel auf eine Vertiefungsseite nicht springt.
 */
export const BODY = 'text-base leading-7 lg:text-[17px] lg:leading-8'
export const LEAD = 'text-lg leading-relaxed text-gray-600 lg:text-xl lg:leading-relaxed'
export const LABEL = 'text-xs font-semibold uppercase tracking-[0.16em] text-gray-600'

/** Reveal rendert zwei verschachtelte divs; h-full muss auf beide. */
export const STRETCH = 'h-full [&>div]:h-full'

/** public/ wird nach dist/client kopiert — die oeffentliche URL ist /downloads/... */
export const ASSET_BASE = '/downloads/epigenetics/'

/**
 * i18next liefert bei fehlendem Key den Key-String zurueck statt eines Arrays.
 * Der Guard haelt SSR am Leben, falls ein Locale-File unvollstaendig ist.
 */
export function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}
