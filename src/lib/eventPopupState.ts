/**
 * Termin-Popup (SC-020): Entscheidung und Sitzungsgedächtnis — ohne React, damit Layout und
 * Test dieselben Regeln nutzen und der Dialog-Chunk nur lädt, wenn er wirklich erscheint.
 */
import { getNextHomeEvent, type EventEntry } from '../data/events'

export const EVENT_POPUP_DELAY_MS = 1200

/** Hier nie: die Terminseite zeigt den Termin selbst, Formulare werden nicht überlagert. */
const EXCLUDED_PREFIXES = ['/events', '/contact', '/support']

export const popupStorageKey = (id: string) => `polaris-event-popup:${id}`

export function isEventPopupDismissed(id: string): boolean {
  try {
    return window.sessionStorage.getItem(popupStorageKey(id)) === '1'
  } catch {
    return false
  }
}

export function rememberEventPopup(id: string): void {
  try {
    window.sessionStorage.setItem(popupStorageKey(id), '1')
  } catch {
    /* privater Modus o. ä.: dann eben einmal je Seitenaufruf */
  }
}

/** Der Termin, für den das Popup auf diesem Pfad in Frage kommt — oder nichts. */
export function eventPopupCandidate(
  pathname: string,
  now: Date = new Date(),
): EventEntry | undefined {
  if (EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return undefined
  const event = getNextHomeEvent(now)
  if (!event || isEventPopupDismissed(event.id)) return undefined
  return event
}

/** Ein anderer Dialog ist offen (Cookie-Einstellungen, Download-Schranke, Bestellung …). */
export function anotherDialogOpen(): boolean {
  return typeof document !== 'undefined' && document.querySelector('[role="dialog"]') !== null
}
