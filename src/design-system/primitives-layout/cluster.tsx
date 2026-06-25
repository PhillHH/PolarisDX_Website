import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Cluster — Layout-Primitive-Atom (`primitives-layout/`, §Phase 4.4).
 *
 * Single Source of Truth fuer eine **horizontale**, bei Bedarf umbrechende
 * Gruppe (Tags, Buttons, Meta-Chips) mit konsistentem Abstand (Holy Grail
 * §Phase 7.8): die roh wiederholte Signatur `flex flex-wrap gap-N items-…`
 * lebt jetzt **einmal** hier. Inhalts-/kontext-agnostisch (§Phase 2.7).
 *
 * Token-/Grid-rein (§1.7 / §Phase 4.1): `gap` ueber die rem-basierte Tailwind-
 * Skala = **8pt-Soft-Grid** (`gap-2`=8px … = `--space-*`), **keine** arbitrary-
 * px. Umbruch per Default `flex-wrap` → kein Horizontal-Scroll auf schmalen
 * Viewports (§Phase 4.5). Orthogonale Achsen `gap`/`align`/`justify` statt
 * Kopien (§Phase 2.2).
 *
 * UI-States (§Phase 6.1): n. a. fuer ein strukturelles Layout-Primitive.
 */
const cluster = cva('flex flex-wrap', {
  variants: {
    gap: {
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      6: 'gap-6',
      8: 'gap-8',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      between: 'justify-between',
      end: 'justify-end',
    },
  },
  defaultVariants: { gap: 3, align: 'center', justify: 'start' },
})

export interface ClusterProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cluster> {}

export const Cluster = React.forwardRef<HTMLDivElement, ClusterProps>(
  ({ className, gap, align, justify, ...props }, ref) => (
    <div ref={ref} className={cn(cluster({ gap, align, justify }), className)} {...props} />
  ),
)
Cluster.displayName = 'Cluster'
