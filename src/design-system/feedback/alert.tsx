import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * Alert — Feedback (§Phase 2, feedback-Ebene).
 *
 * Single Source of Truth fuer Inline-Statusmeldungen (Holy Grail §Phase 7.8).
 * Token-rein (§1.7): Flaeche/Rahmen/Text/Radius/Spacing ausschliesslich ueber
 * `--alert-*`-Component-Tokens (`[var(--token)]`-Form, §3) — kein Roh-Hex,
 * kein arbitrary-px. Tonalitaet ueber **eine** orthogonale Achse `variant`
 * (default/success/danger), nicht ueber Kopien (§Phase 2.2). Feedback laeuft nie
 * ueber Farbe allein — immer mit Icon + Text (§FIL). A11y (§1.11): Fehler werden
 * assertiv (`role="alert"`), Erfolg/Hinweis hoeflich (`role="status"`) angekuendigt.
 */
const alert = cva(
  'relative flex w-full items-start gap-[var(--alert-gap)] ' +
    'rounded-[var(--alert-radius)] border p-[var(--alert-padding)]',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--alert-default-bg)] border-[var(--alert-default-border)] text-[var(--alert-default-fg)]',
        success:
          'bg-[var(--alert-success-bg)] border-[var(--alert-success-border)] text-[var(--alert-success-fg)]',
        danger:
          'bg-[var(--alert-danger-bg)] border-[var(--alert-danger-border)] text-[var(--alert-danger-fg)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alert> {
  /** Optionale fette Ueberschrift ueber dem Hinweistext. */
  title?: string
}

export const Alert = ({
  className,
  variant = 'default',
  title,
  children,
  ...props
}: AlertProps) => {
  const Icon = variant === 'success' ? CheckCircle : AlertCircle
  const role = variant === 'danger' ? 'alert' : 'status'

  return (
    <div role={role} className={cn(alert({ variant }), className)} {...props}>
      <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1">
        {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
        {children && <div className="text-sm opacity-90">{children}</div>}
      </div>
    </div>
  )
}
Alert.displayName = 'Alert'
