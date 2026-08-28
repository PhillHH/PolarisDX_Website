import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * Choice Controls — Checkbox, Radio, Select.
 *
 * Farben kommen aus den PT05.1-Tokens: die Begrenzung eines Bedienelements ist
 * `ui-field` (#6b7280, 4,83:1 — WCAG 1.4.11 verlangt 3:1), der aktive Zustand
 * traegt den Akzent, der Fokusring ist derselbe wie an Input/Textarea.
 *
 * TOUCH TARGET: Checkbox und Radio sind visuell 16px (`h-4 w-4`) — das ist die
 * Sales-Machine-Optik und bleibt so. Die anfassbare Flaeche ist trotzdem
 * >= 44px, weil das umschliessende <label> `min-h-[44px]` traegt und der Klick
 * auf das Label das Control bedient. Groesse des Glyphs != Groesse des Ziels.
 *
 * Die Zustaende default/hover/focus/error/disabled/required kommen aus nativen
 * Attributen, nicht aus nachgebauten div-Konstruktionen — ein natives
 * Bedienelement bringt Tastatur, Screenreader und Formularsemantik mit.
 */

const controlBase =
  'h-4 w-4 shrink-0 border border-ui-field bg-white text-accent transition ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

type ToggleProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  /** Beschriftung neben dem Control. */
  label: React.ReactNode
  /** Fehlerzustand — faerbt die Begrenzung, ersetzt aber keine Fehlermeldung. */
  invalid?: boolean
  /** Ergaenzender Hinweis unter der Beschriftung. */
  description?: string
}

function useToggleIds(id: string | undefined, description?: string) {
  const generated = React.useId()
  const controlId = id || generated
  const descriptionId = description ? `${controlId}-description` : undefined
  return { controlId, descriptionId }
}

/** Ein Label, das gross genug zum Antippen ist und das Control mitbedient. */
const ToggleShell = ({
  controlId,
  descriptionId,
  label,
  description,
  disabled,
  className,
  children,
}: {
  controlId: string
  descriptionId?: string
  label: React.ReactNode
  description?: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}) => (
  <div className={cn('grid gap-1', className)}>
    <label
      htmlFor={controlId}
      className={cn(
        'flex min-h-[44px] cursor-pointer items-center gap-3 text-sm text-gray-700',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {children}
      <span>{label}</span>
    </label>
    {description && (
      <p id={descriptionId} className="t-helper pl-7">
        {description}
      </p>
    )}
  </div>
)

export const Checkbox = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, description, invalid, id, disabled, ...props }, ref) => {
    const { controlId, descriptionId } = useToggleIds(id, description)
    return (
      <ToggleShell
        controlId={controlId}
        descriptionId={descriptionId}
        label={label}
        description={description}
        disabled={disabled}
        className={className}
      >
        <input
          ref={ref}
          type="checkbox"
          id={controlId}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          aria-describedby={descriptionId}
          className={cn(controlBase, 'rounded-sm', invalid && 'border-red-600')}
          {...props}
        />
      </ToggleShell>
    )
  },
)
Checkbox.displayName = 'Checkbox'

export const Radio = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, description, invalid, id, disabled, ...props }, ref) => {
    const { controlId, descriptionId } = useToggleIds(id, description)
    return (
      <ToggleShell
        controlId={controlId}
        descriptionId={descriptionId}
        label={label}
        description={description}
        disabled={disabled}
        className={className}
      >
        <input
          ref={ref}
          type="radio"
          id={controlId}
          disabled={disabled}
          // Kein `aria-invalid`: die Rolle `radio` unterstuetzt es nicht. Ein
          // ungueltiger Zustand gehoert bei Radios an die GRUPPE — dort setzt
          // ihn `FormField as="group"` samt Fehlermeldung. Hier bleibt nur die
          // sichtbare Kennzeichnung.
          aria-describedby={descriptionId}
          className={cn(controlBase, 'rounded-full', invalid && 'border-red-600')}
          {...props}
        />
      </ToggleShell>
    )
  },
)
Radio.displayName = 'Radio'

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean
}

/**
 * Natives `select`. Bewusst kein nachgebautes Listbox-Widget: das native
 * Element bringt auf Mobilgeraeten die Systemauswahl mit und ist per Tastatur
 * und Screenreader ohne Zutun korrekt.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <select
      ref={ref}
      aria-invalid={invalid || props['aria-invalid'] || undefined}
      className={cn(
        'flex min-h-[44px] w-full rounded-md border border-ui-field bg-white px-3 py-2 text-sm text-heading',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid && 'border-red-600',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
)
Select.displayName = 'Select'
