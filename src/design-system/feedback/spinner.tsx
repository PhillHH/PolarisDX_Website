import { Loader2 } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Spinner — Feedback (§Phase 2, feedback-Ebene). Lade-Indikator.
 *
 * Single Source of Truth fuer den Lade-Status (Holy Grail §Phase 7.8;
 * Industriestandard-Name, ohne `Loading`-Praefix §Phase 2.8). Token-rein
 * (§1.7): Farbe ueber `--spinner-color`, Groessen ueber die Tailwind-Skala —
 * kein Roh-Hex/arbitrary-px. A11y (§1.11): `role="status"`; die optionale
 * `label`-Prop liefert eine sichtbar-versteckte Statusbeschriftung fuer
 * Screenreader (i18n-Text bleibt Sache des Aufrufers, kein Literal hier).
 */
const spinner = cva('animate-spin text-[var(--spinner-color)]', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
    },
  },
  defaultVariants: { size: 'md' },
})

export interface SpinnerProps extends VariantProps<typeof spinner> {
  className?: string
  /** Sichtbar-versteckte Statusbeschriftung fuer Screenreader. */
  label?: string
}

export const Spinner = ({ className, size, label }: SpinnerProps) => (
  <span role="status" className="inline-flex">
    <Loader2 aria-hidden className={cn(spinner({ size }), className)} />
    {label ? <span className="sr-only">{label}</span> : null}
  </span>
)
Spinner.displayName = 'Spinner'
