/**
 * Inhalte der sechs Musterbefunde.
 *
 * Je Panel eine deutsche und eine englische JSON-Datei, aus den Quell-PDFs
 * abgeleitet. Sie liegen bewusst NICHT im i18n-Namensraum: der laedt auf jeder
 * Seite mit, und diese Daten werden nur auf den Musterbefund-Seiten gebraucht.
 * Ueber den lazy geladenen Routen-Chunk landen sie nur dort im Netz.
 *
 * Die Werte der Netzdiagramme stehen in keinem PDF-Text — sie sind aus der
 * Vektorgrafik zurueckgerechnet (fuenf Gitterringe geben Mittelpunkt und
 * Maszstab). Die acht im Fliesstext genannten Werte dienten als Gegenprobe und
 * stimmen exakt.
 */

import metabolicDe from './metabolic-health.de.json'
import metabolicEn from './metabolic-health.en.json'
import agingDe from './healthy-aging.de.json'
import agingEn from './healthy-aging.en.json'
import clockDe from './biologische-altersuhr.de.json'
import clockEn from './biologische-altersuhr.en.json'
import telomerDe from './telomer-analyse.de.json'
import telomerEn from './telomer-analyse.en.json'
import stressDe from './stress-monitor.de.json'
import stressEn from './stress-monitor.en.json'
import sportDe from './healthy-sport.de.json'
import sportEn from './healthy-sport.en.json'

export interface Befund {
  slug: string
  panel: string
  blocks: { type: string; [key: string]: unknown }[]
}

type ByLanguage = { de: Befund; en: Befund }

/** Reihenfolge wie die sechs Analysen auf /epigenetics (01–06). */
export const BEFUND_ORDER = [
  'metabolic-health',
  'healthy-aging',
  'biologische-altersuhr',
  'telomer-analyse',
  'stress-monitor',
  'healthy-sport',
] as const

export const BEFUNDE: Record<string, ByLanguage> = {
  'metabolic-health': { de: metabolicDe as Befund, en: metabolicEn as Befund },
  'healthy-aging': { de: agingDe as Befund, en: agingEn as Befund },
  'biologische-altersuhr': { de: clockDe as Befund, en: clockEn as Befund },
  'telomer-analyse': { de: telomerDe as Befund, en: telomerEn as Befund },
  'stress-monitor': { de: stressDe as Befund, en: stressEn as Befund },
  'healthy-sport': { de: sportDe as Befund, en: sportEn as Befund },
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
