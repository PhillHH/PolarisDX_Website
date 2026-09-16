import * as React from 'react'

/**
 * Escape schliesst, der Fokus kehrt zum Ausloeser zurueck — fuer NICHT-modale
 * Aufklapper: mobiles Menue, Sprachdropdown und Verwandtes.
 *
 * Bewusst OHNE Fokusfalle. Diese Flaechen sperren die Seite nicht, der
 * Hintergrund bleibt bedienbar — dann darf der Fokus ihn auch erreichen. Eine
 * Falle waere hier die falsche Zusage und genau das, was AP24 als
 * „unbeabsichtigten Keyboard Trap" verbietet.
 *
 * Was der Haken stattdessen zusagt:
 *
 *  - **Escape schliesst** und gibt den Fokus an den Ausloeser zurueck. Ohne die
 *    Rueckgabe landet der Fokus auf `<body>`, und die Nutzerin faengt die
 *    Navigation von vorn an.
 *  - **Der Fokus verlaesst die Flaeche → sie schliesst.** Ohne das bliebe ein
 *    aufgeklapptes Menue offen, waehrend der Fokus laengst woanders steht:
 *    `aria-expanded` sagt dann „true" ueber etwas, das niemand mehr benutzt.
 *    Der Fokus wird dabei NICHT angefasst — geschlossen wird nur der Zustand.
 *
 * Die Maus-Variante (Klick nach draussen) bleibt Sache der Aufrufstelle; sie
 * ist eine andere Eingabeart mit anderen Grenzfaellen.
 */

export type UseKeyboardDismissOptions = {
  /** Nur wirksam, solange dies wahr ist. */
  open: boolean
  /** Wird bei Escape und beim Verlassen des Bereichs gerufen. */
  onDismiss: () => void
  /** Der Bereich, der als „drinnen" gilt (enthaelt ueblicherweise den Ausloeser). */
  containerRef: React.RefObject<HTMLElement | null>
  /** Element, das nach Escape den Fokus bekommt. */
  triggerRef: React.RefObject<HTMLElement | null>
  /**
   * Schliessen, sobald der Fokus den Bereich verlaesst. Abschaltbar fuer
   * Faelle, in denen der Inhalt bewusst ausserhalb des Containers liegt.
   */
  dismissOnFocusOut?: boolean
}

export function useKeyboardDismiss({
  open,
  onDismiss,
  containerRef,
  triggerRef,
  dismissOnFocusOut = true,
}: UseKeyboardDismissOptions) {
  React.useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      onDismiss()
      // Erst schliessen, dann zurueckgeben: das fokussierte Element kann
      // gerade im Inhalt liegen, der mit dem Schliessen verschwindet.
      triggerRef.current?.focus()
    }

    const onFocusIn = (event: FocusEvent) => {
      if (!dismissOnFocusOut) return
      const target = event.target as Node | null
      if (!target) return
      if (containerRef.current?.contains(target)) return
      if (triggerRef.current?.contains(target)) return
      onDismiss()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [open, onDismiss, containerRef, triggerRef, dismissOnFocusOut])
}
