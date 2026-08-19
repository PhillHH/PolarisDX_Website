/**
 * Metadaten der sechs Musterbefunde — OHNE die Inhalte.
 *
 * Warum getrennt von index.ts: dort haengen an jedem Befund zwei JSON-Dateien,
 * zusammen 322 KB Quelltext. Wer aus index.ts auch nur den Typ `Befund` oder
 * `RADAR_VALUES` importierte, zog alle zwoelf mit. Genau das war der Grund,
 * warum jede Musterbefund-Seite einen Client-Chunk von 287 KB lud, um 24 KB
 * anzuzeigen: Faktor 12.
 *
 * Diese Datei bleibt frei von JSON-Importen. Wer sie erweitert, achtet darauf.
 */

export interface Befund {
  slug: string
  panel: string
  blocks: { type: string; [key: string]: unknown }[]
}

/** Deutsche und englische Fassung eines Befunds. */
export interface BefundSprachen {
  de: Befund
  en: Befund
}

/** Reihenfolge wie die sechs Analysen auf /epigenetics (01–06). */
export const BEFUND_ORDER = [
  'metabolic-health',
  'healthy-aging',
  'biologische-altersuhr',
  'telomer-analyse',
  'stress-monitor',
  'healthy-sport',
] as const

/**
 * Lebensstil-Radar, elf Achsen im Uhrzeigersinn ab 12 Uhr:
 * Alltagsbewegung, Sport, Stress, Tabak, Alkohol, Snacks, Fleisch, Omega-3,
 * Ballaststoffe, Obst/Gemuese, Fluessigkeit.
 *
 * Es ist in allen Befunden dieselbe Beispielperson, deshalb dieselben Werte.
 * Healthy Sport zeigt im PDF keine Referenzgruppe.
 */
const LIFESTYLE_PROFILE = [6, 7, 4, 9, 6, 5, 5, 6, 7, 8, 8]
const LIFESTYLE_REFERENCE = [5, 5, 5, 6, 5, 5, 5, 5, 6, 6, 6]

export const RADAR_VALUES: Record<string, { profile: number[]; reference?: number[] }> = {
  'healthy-aging': { profile: LIFESTYLE_PROFILE, reference: LIFESTYLE_REFERENCE },
  'biologische-altersuhr': { profile: LIFESTYLE_PROFILE, reference: LIFESTYLE_REFERENCE },
  'telomer-analyse': { profile: LIFESTYLE_PROFILE, reference: LIFESTYLE_REFERENCE },
  'healthy-sport': { profile: LIFESTYLE_PROFILE },
}
