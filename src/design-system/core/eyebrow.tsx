import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * Eyebrow — Atom (§Phase 2.2).
 *
 * Single Source of Truth fuer die gradient-umrandete Section-Label-Pill
 * (Holy Grail §Phase 7.8). Bewusst kontext-/inhaltsagnostisch (§Phase 2.7):
 * kein erzwungenes `<h2>`, keine Titelfarbe — nur die Pill. Das `SectionHeader`-
 * Molecule und einzelne Hero-/Widget-Sektionen teilen diese eine Definition.
 *
 * Token-rein (§1.7): Flaeche/Schrift/Radius ueber Component-Tokens
 * (`--eyebrow-*`); der Gradient-Rand laeuft ueber die token-gebundenen
 * `brand-*`-Config-Keys (rgb(var(--brand-*-rgb))) — kein Roh-Hex, kein
 * arbitrary-px. Zwei live belegte Groessen (`default`/`sm`) als orthogonaler
 * Prop, nicht als Kopie.
 */
export type EyebrowSize = 'default' | 'sm'

export interface EyebrowProps {
  children: React.ReactNode
  /** Groesse der Pill — reproduziert die zwei live gefundenen Varianten. */
  size?: EyebrowSize
  /** Passthrough am aeusseren Wrapper (z. B. Layout-Margins wie mb-2 / mb-8). */
  className?: string
}

const innerBySize: Record<EyebrowSize, string> = {
  default: 'rounded-[var(--eyebrow-radius)] bg-[var(--eyebrow-bg)] px-4 py-2 lg:px-3 lg:py-1',
  sm: 'rounded-[var(--eyebrow-radius)] bg-[var(--eyebrow-bg)] px-3 py-1',
}

const captionBySize: Record<EyebrowSize, string> = {
  default: 'text-sm font-semibold uppercase tracking-wide text-[var(--eyebrow-fg)] lg:text-xs',
  sm: 'text-xs font-semibold uppercase tracking-wide text-[var(--eyebrow-fg)]',
}

export function Eyebrow({ children, size = 'default', className }: EyebrowProps) {
  return (
    <div
      className={cn(
        'inline-block rounded-[var(--eyebrow-radius)] p-px bg-gradient-to-r ' +
          'from-brand-secondary via-brand-primary to-brand-deep ' +
          'shadow-lg shadow-brand-primary/20',
        className,
      )}
    >
      <div className={innerBySize[size]}>
        <span className={captionBySize[size]}>{children}</span>
      </div>
    </div>
  )
}
Eyebrow.displayName = 'Eyebrow'
