import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Select — Atom (§Phase 2.2).
 *
 * Einzeiliges Auswahl-Feld als drittes Eingabe-Atom neben `Input`/`Textarea`
 * (eigenes Atom, da `<select>` ein anderes Host-Element mit eigener Semantik
 * ist). Bewusst nur das nackte Feld — Label/Helper/Error liefert das
 * `FormField`-Molecule (§Phase 2.3). Die Optionen reicht der Aufrufer als
 * `children` (`<option>`) durch; das native Dropdown-Verhalten (inkl. OS-Pfeil
 * und Tastatur-Steuerung) bleibt erhalten (§1.6, A11y §1.11).
 *
 * Token-rein (§1.7): teilt die Feld-Familie und konsumiert ausschliesslich die
 * `--input-*`-Component-Tokens ueber die erlaubte `[var(--token)]`-Form (§3) —
 * kein Roh-Hex, kein arbitrary-px. `state` (default/error) als orthogonaler
 * Prop; alle States als Properties (default/focus-visible/disabled). Schrift
 * >=16px (`--input-font-size`) und Tap-Target >=44px (`--input-min-height`)
 * per Token (§1.11 / §FIL) — verhindert iOS-Auto-Zoom.
 */
const select = cva(
  'flex w-full rounded-[var(--input-radius)] border bg-[var(--input-bg)] ' +
    'px-[var(--input-padding-x)] py-[var(--input-padding-y)] ' +
    'min-h-[var(--input-min-height)] text-[length:var(--input-font-size)] text-[var(--input-fg)] ' +
    'transition-colors duration-[var(--duration-base)] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-[var(--input-border)] focus-visible:ring-[var(--input-border-focus)]',
        error:
          'border-[var(--input-border-error)] text-[var(--input-fg-error)] ' +
          'focus-visible:ring-[var(--input-border-error)]',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  },
)

export interface SelectProps
  extends
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof select> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, state, children, ...props }, ref) => (
    <select ref={ref} className={cn(select({ state }), className)} {...props}>
      {children}
    </select>
  ),
)
Select.displayName = 'Select'
