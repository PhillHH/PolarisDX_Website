import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * EmptyState — Feedback (§Phase 2, feedback-Ebene). Leerzustand.
 *
 * Single Source of Truth fuer den „kein Datensatz / keine Treffer"-Zustand
 * (Holy Grail §Phase 7.8) — schliesst die UI-State-Familie der feedback-Ebene
 * (loading=`Spinner`, error/success=`Alert`, **empty**=`EmptyState`). Inhalts-/
 * kontext-agnostisch (§Phase 2.7): der Aufrufer reicht die Meldung als `title`.
 * Token-rein (§1.7): Text/Rahmen/Flaeche ausschliesslich ueber `--empty-state-*`-
 * Component-Tokens via `[var(--token)]` (§3) — kein Roh-Hex/arbitrary-px;
 * Abstaende/Radius ueber die rem-basierte Tailwind-Skala. Optik ueber **eine**
 * orthogonale Achse `variant` (plain/outlined), nicht ueber Kopien (§Phase 2.2).
 * A11y (§1.11): `role="status"` kuendigt einen dynamisch eintretenden Leerzustand
 * (z. B. „keine Suchergebnisse") hoeflich fuer Screenreader an.
 */
const emptyState = cva('text-center text-[var(--empty-state-fg)]', {
  variants: {
    variant: {
      plain: 'py-10',
      outlined:
        'rounded-xl border border-dashed border-[var(--empty-state-border)] ' +
        'bg-[var(--empty-state-bg)] p-8',
    },
  },
  defaultVariants: { variant: 'plain' },
})

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof emptyState> {
  /** Primaere Meldung (z. B. „Keine Ergebnisse gefunden."). */
  title: React.ReactNode
}

export const EmptyState = ({ className, variant = 'plain', title, ...props }: EmptyStateProps) => (
  <div role="status" className={cn(emptyState({ variant }), className)} {...props}>
    <p>{title}</p>
  </div>
)
EmptyState.displayName = 'EmptyState'
