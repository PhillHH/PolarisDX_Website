/**
 * Metadaten der sechs Musterbefunde — OHNE die Inhalte.
 *
 * Warum getrennt von den Inhaltsdateien: Wer aus einem globalen Inhaltsindex
 * auch nur den Typ `Befund` oder `RADAR_VALUES` importierte, zoege alle sechs
 * Panels samt Sprachfassungen mit. Die Routenmodule importieren deshalb nur
 * die zehn Dateien ihres eigenen Slugs.
 *
 * Diese Datei bleibt frei von JSON-Importen. Wer sie erweitert, achtet darauf.
 */

export interface Befund {
  slug: string
  panel: string
  blocks: { type: string; [key: string]: unknown }[]
}

/** Die zehn kanonischen Sprachfassungen eines Befunds. */
export interface BefundSprachen {
  de: Befund
  en: Befund
  pl: Befund
  fr: Befund
  it: Befund
  es: Befund
  pt: Befund
  da: Befund
  nl: Befund
  cs: Befund
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
