import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Badge — Atom (§Phase 2.2).
 *
 * Single Source of Truth fuer kompakte Status-/Kategorie-Pills (Holy Grail
 * §Phase 7.8). Kontext-/inhaltsagnostisch (§Phase 2.7): nur die Pill — der
 * Aufrufer reicht den Inhalt (inkl. optionalem Icon) als `children`; das
 * `items-center gap` der Basis traegt ein vorangestelltes Icon mit.
 *
 * Token-rein (§1.7): Flaeche/Farbe/Radius ausschliesslich ueber `--badge-*`-
 * Component-Tokens (`[var(--token)]`-Form, §3) — kein Roh-Hex, kein
 * arbitrary-px. Padding/Gap/Schriftgroesse laufen ueber die Tailwind-Skala
 * (rem-basiert, bewusst nicht token-remappt — §Einheit 1a). Farbe rollenbasiert
 * ueber **eine** orthogonale Achse `variant` (brand/accent/success), nicht ueber
 * Kopien (§Phase 2.2). `uppercase` als zweite orthogonale Achse fuer die
 * Label-/Kategorie-Optik.
 */
const badge = cva(
  'inline-flex items-center gap-1.5 rounded-[var(--badge-radius)] ' +
    'px-3 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        brand: 'bg-[var(--badge-brand-bg)] text-[var(--badge-brand-fg)]',
        accent: 'bg-[var(--badge-accent-bg)] text-[var(--badge-accent-fg)]',
        success: 'bg-[var(--badge-success-bg)] text-[var(--badge-success-fg)]',
      },
      uppercase: { true: 'uppercase tracking-wider', false: '' },
    },
    defaultVariants: { variant: 'brand', uppercase: false },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badge> {}

export const Badge = ({ className, variant, uppercase, ...props }: BadgeProps) => (
  <span className={cn(badge({ variant, uppercase }), className)} {...props} />
)
Badge.displayName = 'Badge'
