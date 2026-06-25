import * as React from 'react'
import { Input, type InputProps } from '../core/input'
import { Textarea, type TextareaProps } from '../core/textarea'
import { Select, type SelectProps } from '../core/select'

/**
 * FormField — Molecule (§Phase 2.3).
 *
 * Komponiert genau ein Eingabe-Atom mit Label, optionalem Helper- und Error-Text
 * zu einer funktionalen Einheit (Single Responsibility, §Phase 2.3). Das Host-
 * Element waehlt der orthogonale `as`-Prop ueber **eine** Achse (§Phase 2.9):
 * `'input'` (Default), `'textarea'` oder `'select'` — kein Klon pro Variante.
 * A11y verpflichtend (§1.11): `label` per `htmlFor`/`id` verknuepft, `aria-invalid`
 * im Error-State, `aria-describedby` auf Helper-/Error-Text, Error als
 * `role="alert"`. State des Felds leitet sich aus `error` ab (default ↔ error) —
 * der Aufrufer setzt nur `error`.
 *
 * Alle UI-States als Properties (§Phase 6.1): default / error (mit Klartext-
 * meldung) / helper / disabled (via durchgereichtes `disabled`). Token-rein —
 * die Roh-Optik lebt ausschliesslich in den Atomen.
 */
type FormFieldCommonProps = {
  /** Sichtbares, mit dem Feld verknuepftes Label (Pflicht — kein Placeholder-as-Label). */
  label: string
  /** Klartext-Fehlermeldung (§1.11). Gesetzt ⇒ Feld geht in den Error-State. */
  error?: string
  /** Unterstuetzender Hinweis; wird ausgeblendet, sobald ein `error` anliegt. */
  helperText?: React.ReactNode
}

export type FormFieldProps =
  | (FormFieldCommonProps & InputProps & { as?: 'input' })
  | (FormFieldCommonProps & TextareaProps & { as: 'textarea' })
  | (FormFieldCommonProps & SelectProps & { as: 'select' })

export function FormField({
  label,
  error,
  helperText,
  id,
  className,
  as = 'input',
  ...rest
}: FormFieldProps) {
  const generatedId = React.useId()
  const fieldId = id || generatedId
  const errorId = error ? `${fieldId}-error` : undefined
  const helperId = !error && helperText ? `${fieldId}-helper` : undefined
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined
  const state = error ? 'error' : 'default'

  const controlProps = rest as Record<string, unknown>
  const sharedProps = {
    id: fieldId,
    state,
    className,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  } as const

  return (
    <div className="grid w-full gap-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-fg">
        {label}
      </label>

      {as === 'textarea' ? (
        <Textarea {...(controlProps as TextareaProps)} {...sharedProps} />
      ) : as === 'select' ? (
        <Select {...(controlProps as SelectProps)} {...sharedProps} />
      ) : (
        <Input {...(controlProps as InputProps)} {...sharedProps} />
      )}

      {error && (
        <p id={errorId} role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      )}

      {!error && helperText && (
        <p id={helperId} className="text-sm text-fg-muted">
          {helperText}
        </p>
      )}
    </div>
  )
}
