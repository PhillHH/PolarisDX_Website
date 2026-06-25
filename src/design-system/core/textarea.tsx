import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Textarea — Atom (§Phase 2.2).
 *
 * Mehrzeiliges Gegenstueck zu `Input` (eigenes Atom, da `<textarea>` ein
 * anderes Host-Element ist). Bewusst nur das nackte Feld — Label/Error liefert
 * das `FormField`-Molecule (§Phase 2.3). Token-rein (§1.7): nur Component-/
 * Semantic-Tokens (`--input-*`, `--color-focus-ring`) ueber `[var(--token)]` (§3).
 * `state` (default/error) als orthogonaler Prop; Mindesthoehe per Token.
 */
const textarea = cva(
  'flex w-full rounded-[var(--input-radius)] border bg-[var(--input-bg)] ' +
    'px-[var(--input-padding-x)] py-[var(--input-padding-y)] ' +
    'min-h-[var(--input-textarea-min-height)] text-[length:var(--input-font-size)] text-[var(--input-fg)] ' +
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

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textarea> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state, ...props }, ref) => (
    <textarea ref={ref} className={cn(textarea({ state }), className)} {...props} />
  ),
)
Textarea.displayName = 'Textarea'
