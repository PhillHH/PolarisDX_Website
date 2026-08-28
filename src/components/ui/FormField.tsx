import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * FormField — die eine Verdrahtung von Label, Bedienelement, Hilfstext,
 * Pflichtkennzeichnung und Fehlermeldung.
 *
 * Das Muster loest genau die Fehler, die man von Hand immer wieder macht:
 * fehlendes `htmlFor`, ein `aria-describedby`, das Hilfstext ODER Fehler
 * vergisst, und ein Pflichtfeld, dessen Sternchen nur optisch existiert.
 *
 * Verdrahtung (die Aufrufstelle muss nichts davon selbst tun):
 * - `label` haengt per `htmlFor` an der Control-Id;
 * - `aria-describedby` verweist auf Hilfstext UND Fehler, sobald sie da sind;
 * - `aria-invalid` wird gesetzt, sobald ein Fehler anliegt;
 * - `required` setzt `required` + `aria-required` am Bedienelement, und das
 *   Sternchen ist per `aria-hidden` vom Screenreader entkoppelt — die
 *   Pflichtangabe kommt aus dem Attribut, nicht aus dem Glyph;
 * - der Fehler traegt `role="alert"`, wird also angesagt, sobald er erscheint.
 *
 * Die Kinder bekommen die fertigen Props ueber eine Render-Funktion. So bleibt
 * FormField unabhaengig davon, ob innen ein Input, ein Textarea, ein Select
 * oder eine Fieldset-Gruppe steckt.
 */

export type FormFieldControlProps = {
  id: string
  required?: boolean
  'aria-required'?: boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

export type FormFieldProps = {
  /** Sichtbares Label. */
  label: string
  /** Stabile Id; ohne Angabe wird eine erzeugt. */
  id?: string
  /** Erklaerender Hilfstext unter dem Bedienelement. */
  description?: string
  /** Fehlermeldung. Gesetzt = Feld ist invalid. */
  error?: string
  required?: boolean
  className?: string
  /** Bekommt die fertig verdrahteten Props fuer das Bedienelement. */
  children: (props: FormFieldControlProps) => React.ReactNode
  /**
   * Fuer Gruppen (Radio/Checkbox-Gruppen): rendert `fieldset`/`legend` statt
   * `div`/`label`, weil eine Gruppe kein einzelnes Bedienelement beschriftet.
   */
  as?: 'field' | 'group'
}

export const FormField = ({
  label,
  id,
  description,
  error,
  required = false,
  className,
  children,
  as = 'field',
}: FormFieldProps) => {
  const generatedId = React.useId()
  const controlId = id || generatedId
  const descriptionId = description ? `${controlId}-description` : undefined
  const errorId = error ? `${controlId}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  const controlProps: FormFieldControlProps = {
    id: controlId,
    ...(required ? { required: true, 'aria-required': true } : {}),
    ...(error ? { 'aria-invalid': true } : {}),
    ...(describedBy ? { 'aria-describedby': describedBy } : {}),
  }

  const requiredMark = required ? (
    <>
      {' '}
      <span aria-hidden="true">*</span>
    </>
  ) : null

  const body = (
    <>
      {children(controlProps)}
      {description && (
        <p id={descriptionId} className="t-helper">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="t-error">
          {error}
        </p>
      )}
    </>
  )

  if (as === 'group') {
    return (
      <fieldset className={cn('grid w-full gap-1.5 border-0 p-0', className)}>
        <legend className="t-label">
          {label}
          {requiredMark}
        </legend>
        {body}
      </fieldset>
    )
  }

  return (
    <div className={cn('grid w-full gap-1.5', className)}>
      <label htmlFor={controlId} className="t-label">
        {label}
        {requiredMark}
      </label>
      {body}
    </div>
  )
}

FormField.displayName = 'FormField'
