import * as React from 'react'

/**
 * Die Tastaturmechanik eines echten Modals — an EINER Stelle.
 *
 * `role="dialog"` + `aria-modal="true"` ist ein Versprechen: der Hintergrund
 * ist fuer die Dauer des Dialogs weg. Assistenztechnik glaubt dieses
 * Versprechen und blendet den Rest des Dokuments aus. Eine Tastaturnutzerin
 * ohne Screenreader merkt davon nichts — sie tabbt weiter und landet hinter
 * dem Dialog, in einem Bereich, den der Dialog gerade fuer unerreichbar
 * erklaert hat. Genau dieser Widerspruch war in `OrderModal` gemessen:
 * nach dem Absenden-Knopf ging es in den Consent-Banner und von dort auf
 * `<body>`.
 *
 * Der Haken buendelt deshalb die vier Zusagen, die zusammengehoeren und die
 * keine Aufrufstelle einzeln nachbauen soll:
 *
 *  - Fokus wandert beim Oeffnen in den Dialog;
 *  - Tab und Shift+Tab laufen im Kreis (Fokusfalle);
 *  - Escape schliesst;
 *  - der Fokus kehrt beim Schliessen auf das ausloesende Element zurueck.
 *
 * Die Umsetzung ist die aus `Dialog.tsx`, unveraendert uebernommen: sie ist
 * in AP24 PT24.2 im Browser als funktionierend gemessen (Suche: Fokus ins
 * Eingabefeld, Tab im Kreis, Escape schliesst, Fokus kehrt zum Ausloeser
 * zurueck). Ein zweiter, neu geschriebener Nachbau waere das Risiko gewesen,
 * nicht die Wiederverwendung.
 *
 * NICHT fuer nicht-modale Aufklapper. Dort ist eine Fokusfalle falsch — dafuer
 * gibt es `useKeyboardDismiss`.
 */

export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export type UseFocusTrapOptions = {
  /** Die Falle greift nur, solange dies wahr ist. */
  active: boolean
  /** Das Panel, in dem der Fokus bleibt. */
  containerRef: React.RefObject<HTMLElement | null>
  /** Wird bei Escape gerufen. */
  onEscape: () => void
  /** Optionales Element fuer den ersten Fokus; sonst das erste fokussierbare. */
  initialFocusRef?: React.RefObject<HTMLElement | null>
}

export function useFocusTrap({
  active,
  containerRef,
  onEscape,
  initialFocusRef,
}: UseFocusTrapOptions) {
  const previouslyFocused = React.useRef<HTMLElement | null>(null)

  // Fokus hinein, Fokus zurueck. Bewusst EIN Effekt: das Merken des
  // ausloesenden Elements und seine Wiederherstellung gehoeren zusammen,
  // sonst zeigt das Cleanup irgendwann auf ein anderes Element.
  React.useEffect(() => {
    if (!active) return
    previouslyFocused.current = document.activeElement as HTMLElement | null

    const container = containerRef.current
    const first = container?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
    ;(initialFocusRef?.current ?? first ?? container)?.focus()

    return () => {
      const target = previouslyFocused.current
      // Nur zurueckgeben, wenn das Element noch existiert — sonst landet der
      // Fokus auf <body> und der Nutzer verliert seine Position.
      if (target && document.contains(target)) target.focus()
    }
  }, [active, containerRef, initialFocusRef])

  React.useEffect(() => {
    if (!active) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onEscape()
        return
      }
      if (event.key !== 'Tab') return

      const container = containerRef.current
      if (!container) return
      // Bewusst OHNE Sichtbarkeitsfilter ueber `offsetParent`: der Wert haengt
      // am Layout, ist in jeder layoutlosen Umgebung null und haette die Falle
      // dort auf ein einziges Element zusammenschrumpfen lassen. `:disabled`
      // und `tabindex="-1"` sind bereits im Selektor ausgeschlossen.
      const items = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      if (items.length === 0) {
        event.preventDefault()
        container.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const activeElement = document.activeElement

      if (!event.shiftKey && activeElement === last) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && (activeElement === first || activeElement === container)) {
        event.preventDefault()
        last.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [active, containerRef, onEscape])
}
