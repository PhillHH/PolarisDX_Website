import { useCallback } from 'react'

/**
 * Cursor-Spot (SC-006, 2026-10-16): ein Lichtpunkt folgt dem Zeiger ueber Karten.
 *
 * EIN Zeiger-Listener am Container statt einem je Karte; er schreibt die
 * Zeigerposition als `--mx`/`--my` auf das `[data-spot]`-Kind unter dem Zeiger,
 * `.spot::after` (index.css) malt daraus den Verlauf. Das Schreiben geht ueber
 * das CSSOM (`style.setProperty`), nicht ueber ein Inline-Style-Attribut — und
 * nur bei echten Zeigern: Touch loest kein `pointermove` ohne Beruehrung aus;
 * Tastaturnutzer sehen den Fokusring der Karte, der Punkt ist reines Zeiger-Dekor.
 *
 * Reine Dekoration: ohne JavaScript, ohne Hover und bei Bewegungsreduktion
 * fehlt nichts — `.spot::after` ist `pointer-events: none` und traegt keinen
 * Inhalt. Die Rueckgabe ist eine Ref-Callback mit Aufraeumfunktion (React 19).
 */
export function useSpotlight<T extends HTMLElement>() {
  return useCallback((node: T | null) => {
    if (!node) return
    const onMove = (event: PointerEvent) => {
      const card = (event.target as Element | null)?.closest<HTMLElement>('[data-spot]')
      if (!card || !node.contains(card)) return
      const box = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${event.clientX - box.left}px`)
      card.style.setProperty('--my', `${event.clientY - box.top}px`)
    }
    node.addEventListener('pointermove', onMove, { passive: true })
    return () => node.removeEventListener('pointermove', onMove)
  }, [])
}
