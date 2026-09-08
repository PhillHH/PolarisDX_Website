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

/** Reihenfolge wie die sechs Analysen auf /epigenetics (01–06). */
export const BEFUND_ORDER = [
  'metabolic-health',
  'healthy-aging',
  'biologische-altersuhr',
  'telomer-analyse',
  'stress-monitor',
  'healthy-sport',
] as const

export type BefundSlug = (typeof BEFUND_ORDER)[number]

/**
 * Deterministische lineare Nachbarschaft fuer die Befundnavigation.
 *
 * Die Reihenfolge bleibt in `BEFUND_ORDER` kanonisch; erste und letzte Seite
 * wrappen bewusst nicht. So fuehrt "weiter" nicht unbemerkt wieder zum
 * Anfang einer bereits vollstaendig gelesenen Reihe.
 */
export const getBefundNeighbors = (
  slug: BefundSlug,
): { previous: BefundSlug | null; next: BefundSlug | null } => {
  const index = BEFUND_ORDER.indexOf(slug)
  return {
    previous: index > 0 ? BEFUND_ORDER[index - 1] : null,
    next: index >= 0 && index < BEFUND_ORDER.length - 1 ? BEFUND_ORDER[index + 1] : null,
  }
}

/**
 * Extern sichtbare Panelnamen, ohne Report-Inhalte zu importieren. Der Slug
 * bleibt ausschliesslich in BEFUND_ORDER kanonisch; dieser Record ist durch
 * BefundSlug dagegen compile-time vollstaendig und kann nicht driften.
 */
export const BEFUND_PANEL_NAMES: Readonly<Record<BefundSlug, readonly string[]>> = {
  'metabolic-health': ['Metabolic Health'],
  'healthy-aging': ['Healthy Aging'],
  'biologische-altersuhr': ['Biologische Altersuhr', 'Biological Age Clock'],
  'telomer-analyse': ['Telomer-Analyse', 'Telomere Analysis'],
  'stress-monitor': ['Stress Monitor'],
  'healthy-sport': ['Healthy Sport'],
}

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
