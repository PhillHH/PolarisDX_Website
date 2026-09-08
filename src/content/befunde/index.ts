/**
 * Inhalte der sechs Musterbefunde.
 *
 * JSON-freier Einstiegspunkt fuer Metadaten, Typen und Validierung. Die zehn
 * produktiven Inhaltsfassungen liegen bewusst NICHT im global geladenen
 * i18n-Namensraum und werden direkt in den slugweisen Routenmodulen importiert.
 *
 * Die Werte der Netzdiagramme stehen in keinem PDF-Text — sie sind aus der
 * Vektorgrafik zurueckgerechnet (fuenf Gitterringe geben Mittelpunkt und
 * Maszstab). Die acht im Fliesstext genannten Werte dienten als Gegenprobe und
 * stimmen exakt.
 */

export { BEFUND_ORDER, BEFUND_PANEL_NAMES, RADAR_VALUES } from './meta'
export type { BefundSlug } from './meta'
export {
  BEFUND_BLOCK_TYPES,
  BefundValidationError,
  defineBefundFamily,
  validateBefund,
  validateBefundInventory,
} from './model'
export type { Befund, BefundBlock, BefundBlockType, BefundSprachen } from './model'
