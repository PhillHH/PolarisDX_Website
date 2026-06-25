import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Input — Atom (§Phase 2.2).
 *
 * Single Source of Truth fuer das nackte Eingabe-Feld (Holy Grail §Phase 7.8).
 * Bewusst **nur** das `<input>`-Element — Label/Helper/Error gehoeren in das
 * `FormField`-Molecule (§Phase 2.3: Atom = `Input`, Molecule = `FormField`).
 * Token-rein (§1.7): konsumiert ausschliesslich Component-/Semantic-Tokens
 * (`--input-*`, `--color-focus-ring`, `--duration-base`) ueber die erlaubte
 * `[var(--token)]`-Form (§3) — kein Roh-Hex, kein arbitrary-px.
 *
 * Alle relevanten States als Properties: default/focus-visible/disabled +
 * orthogonaler `state`-Prop (default/error). Body/Input >=16px (`--input-font-size`)
 * und Tap-Target >=44px (`--input-min-height`) per Token (§1.11 / §FIL).
 */
const input = cva(
  'flex w-full rounded-[var(--input-radius)] border bg-[var(--input-bg)] ' +
    'px-[var(--input-padding-x)] py-[var(--input-padding-y)] ' +
    'min-h-[var(--input-min-height)] text-[length:var(--input-font-size)] text-[var(--input-fg)] ' +
    'placeholder:text-[var(--input-placeholder)] ' +
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

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof input> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, state, ...props }, ref) => (
    <input ref={ref} className={cn(input({ state }), className)} {...props} />
  ),
)
Input.displayName = 'Input'
