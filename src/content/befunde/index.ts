/**
 * Inhalte der sechs Musterbefunde.
 *
 * Dieser historische Index fuehrt nur DE/EN fuer den Test der extern
 * akzeptierten Panelnamen. Die zehn produktiven Inhaltsfassungen liegen
 * bewusst NICHT im global geladenen i18n-Namensraum und werden direkt in den
 * slugweisen Routenmodulen importiert.
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

/**
 * Typen und JSON-freie Metadaten liegen seit AP01 PT01.2 in ./meta — sie
 * werden hier nur weiterexportiert, damit bestehende Importe unveraendert
 * funktionieren. Wer NUR den Typ oder die Reihenfolge braucht, importiert
 * direkt aus ./meta und zieht selbst diese Testdaten nicht mit.
 */
export type { Befund, BefundSprachen } from './meta'
export { BEFUND_ORDER, RADAR_VALUES } from './meta'

import type { Befund, BefundSprachen } from './meta'

/**
 * Schlanker DE/EN-Abgleich fuer die bestehende Panelnamen-Sicherheitsliste.
 * Die produktiven zehn Sprachfassungen werden weiterhin slugweise aus den
 * Routenmodulen geladen; diese Testquelle darf deren Lazy-Grenze nicht ersetzen.
 */
export const BEFUNDE: Record<string, Pick<BefundSprachen, 'de' | 'en'>> = {
  'metabolic-health': { de: metabolicDe as Befund, en: metabolicEn as Befund },
  'healthy-aging': { de: agingDe as Befund, en: agingEn as Befund },
  'biologische-altersuhr': { de: clockDe as Befund, en: clockEn as Befund },
  'telomer-analyse': { de: telomerDe as Befund, en: telomerEn as Befund },
  'stress-monitor': { de: stressDe as Befund, en: stressEn as Befund },
  'healthy-sport': { de: sportDe as Befund, en: sportEn as Befund },
}
