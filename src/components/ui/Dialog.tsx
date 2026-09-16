import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useFocusTrap } from '../../hooks/useFocusTrap'

/**
 * Dialog — Modal und Drawer auf einer Mechanik.
 *
 * Ein Modal ist nicht "ein Kasten ueber der Seite". Die Zusagen, die ihn
 * ueberhaupt zu einem Modal machen, stecken alle hier drin, damit sie keine
 * Aufrufstelle einzeln nachbauen (und dabei die Haelfte vergessen) muss:
 *
 *  - `role="dialog"` + `aria-modal="true"`;
 *  - `aria-labelledby` auf den Titel, `aria-describedby` auf die Beschreibung;
 *  - Fokus wandert beim Oeffnen in den Dialog;
 *  - Fokus bleibt drin (Tab und Shift+Tab wandern im Kreis);
 *  - Escape schliesst;
 *  - Klick auf den Backdrop schliesst (abschaltbar);
 *  - Hintergrund scrollt nicht mit (Scroll Lock, `scrollbar-gutter`-frei
 *    ueber Padding-Ausgleich, damit das Layout nicht springt);
 *  - Fokus kehrt beim Schliessen auf das ausloesende Element zurueck;
 *  - beim Schliessen wird jeder Listener und der Scroll Lock zurueckgenommen.
 *
 * SSR: Der Dialog rendert nur im Browser (`mounted`-Gate), weil er sich an
 * `document` haengt. Geschlossen rendert er `null` — es bleibt nichts im DOM
 * stehen, was ein Crawler als Inhalt missversteht.
 *
 * REDUCED MOTION: Die Einblendung nutzt die Motion-Tokens aus PT05.1
 * (`modal-backdrop-in`, `modal-card-in`). Das globale Sicherheitsnetz in
 * `src/index.css` haelt sie bei `prefers-reduced-motion: reduce` an; die
 * `motion-reduce:animate-none`-Angabe hier macht das zusaetzlich explizit.
 * Die vollstaendige Motion-Abnahme ist PT05.5.
 */

export type DialogProps = {
  open: boolean
  onClose: () => void
  /** Sichtbarer Titel — benennt den Dialog auch fuer Screenreader. */
  title: string
  /** Optionale Beschreibung direkt unter dem Titel. */
  description?: string
  children?: React.ReactNode
  /** Fussbereich, typischerweise die Aktionen. */
  footer?: React.ReactNode
  /** `modal` = zentriert, `drawer` = von rechts einfahrende Schublade. */
  variant?: 'modal' | 'drawer'
  /** Klick auf den Backdrop schliesst. Default an. */
  closeOnBackdrop?: boolean
  /** Beschriftung des Schliessen-Knopfes (lokalisierbar). */
  closeLabel?: string
  /** Optionales primaeres Bedienelement fuer den initialen Fokus. */
  initialFocusRef?: React.RefObject<HTMLElement | null>
  className?: string
}

export const Dialog = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  variant = 'modal',
  closeOnBackdrop = true,
  closeLabel = 'Schließen',
  initialFocusRef,
  className,
}: DialogProps) => {
  const panelRef = React.useRef<HTMLDivElement>(null)
  const titleId = React.useId()
  const descriptionId = React.useId()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  // Fokus hinein, Fokusfalle, Escape, Fokusrueckgabe — alles in einem Haken.
  // AP24 PT24.2: die Mechanik lag frueher hier und war damit an genau EINEN
  // Dialog gebunden; `OrderModal` hatte sie nie und liess den Fokus trotz
  // `aria-modal="true"` hinter sich aus dem Dialog laufen.
  //
  // `active` MUSS `mounted` beruecksichtigen: im ersten Durchlauf ist es
  // false, der Dialog rendert null und `panelRef` ist leer. Ohne das liefe der
  // Effekt genau einmal — auf einem Panel, das es noch nicht gibt — und der
  // Fokus bliebe draussen.
  useFocusTrap({
    active: open && mounted,
    containerRef: panelRef,
    onEscape: onClose,
    initialFocusRef,
  })

  // Scroll Lock inklusive Ausgleich fuer die verschwindende Scrollleiste.
  React.useEffect(() => {
    if (!open) return
    const { body, documentElement } = document
    const previousOverflow = body.style.overflow
    const previousPadding = body.style.paddingRight
    const scrollbar = window.innerWidth - documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPadding
    }
  }, [open])

  if (!mounted || !open) return null

  const isDrawer = variant === 'drawer'

  return (
    <div
      className={cn(
        'fixed inset-0 z-[80] flex',
        isDrawer ? 'justify-end' : 'items-center justify-center p-4',
      )}
    >
      {/* Backdrop. `aria-hidden` + kein Tabstop: er ist Flaeche, kein Bedienelement.
          Das Schliessen per Klick ist eine Bequemlichkeit — die zugaengliche
          Variante ist der Schliessen-Knopf und Escape. */}
      <div
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
        className="absolute inset-0 bg-brand-deep/60 backdrop-blur-sm animate-modal-backdrop-in motion-reduce:animate-none"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative flex w-full flex-col bg-white shadow-dialog focus:outline-none',
          isDrawer
            ? 'h-full max-w-md rounded-l-2xl animate-slide-in-right motion-reduce:animate-none'
            : 'max-h-[85vh] max-w-lg rounded-2xl animate-modal-card-in motion-reduce:animate-none',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 p-6 pb-0">
          <div className="min-w-0">
            <h2 id={titleId} className="t-h3">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="t-small mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="-mr-2 -mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-ui-field transition hover:bg-gray-50 hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {children && <div className="min-h-0 flex-1 overflow-y-auto p-6">{children}</div>}
        {footer && <div className="flex flex-wrap justify-end gap-3 p-6 pt-0">{footer}</div>}
      </div>
    </div>
  )
}

Dialog.displayName = 'Dialog'
