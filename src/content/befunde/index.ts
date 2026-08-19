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

export type { Befund, BefundSprachen } from './meta'
export { BEFUND_ORDER, RADAR_VALUES } from './meta'

import type { Befund, BefundSprachen } from './meta'

/**
 * ALLE zwoelf Inhalte auf einmal.
 *
 * ACHTUNG: Wer das hier importiert, zieht 322 KB Quelltext mit. Die
 * Musterbefund-Seiten tun das NICHT mehr — sie bekommen ihren Befund ueber je
 * ein eigenes Routenmodul unter src/pages/musterbefund/, damit Vite pro Slug
 * splittet. Diese Sammlung bleibt fuer Werkzeuge und Tests, die wirklich alle
 * Befunde brauchen (panelNames.test.ts prueft die Panelnamen gegen sie).
 */
export const BEFUNDE: Record<string, BefundSprachen> = {
  'metabolic-health': { de: metabolicDe as Befund, en: metabolicEn as Befund },
  'healthy-aging': { de: agingDe as Befund, en: agingEn as Befund },
  'biologische-altersuhr': { de: clockDe as Befund, en: clockEn as Befund },
  'telomer-analyse': { de: telomerDe as Befund, en: telomerEn as Befund },
  'stress-monitor': { de: stressDe as Befund, en: stressEn as Befund },
  'healthy-sport': { de: sportDe as Befund, en: sportEn as Befund },
}
