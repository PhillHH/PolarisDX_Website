import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Stack — Layout-Primitive-Atom (`primitives-layout/`, §Phase 4.4).
 *
 * Single Source of Truth fuer den **vertikalen** Fluss (Spalte) mit
 * konsistentem Abstand (Holy Grail §Phase 7.8): die zuvor roh wiederholte
 * Signatur `flex flex-col gap-N` lebt jetzt **einmal** hier. Inhalts-/kontext-
 * agnostisch (§Phase 2.7) — nur das Layout-Geruest; der Aufrufer reicht den
 * Inhalt als `children`.
 *
 * Token-/Grid-rein (§1.7 / §Phase 4.1): der `gap` laeuft ueber die rem-basierte
 * Tailwind-Skala, die auf das **8pt-Soft-Grid** der Tokens rastet
 * (`gap-2`=8px, `gap-4`=16px … = `--space-*`) — **keine** arbitrary-px
 * (`gap-[13px]`), nur Skalen-Stufen. Eine orthogonale Achse je Entscheidung
 * (`gap`, `align`) statt Kopien (§Phase 2.2).
 *
 * UI-States (§Phase 6.1): loading/empty/error/success sind fuer ein rein
 * strukturelles Layout-Primitive nicht anwendbar (kein Datenbezug) — kein
 * erfundener State (analog `Container`).
 */
const stack = cva('flex flex-col', {
  variants: {
    gap: {
      0: 'gap-0',
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      6: 'gap-6',
      8: 'gap-8',
      10: 'gap-10',
      12: 'gap-12',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    },
  },
  defaultVariants: { gap: 4, align: 'stretch' },
})

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof stack> {}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, gap, align, ...props }, ref) => (
    <div ref={ref} className={cn(stack({ gap, align }), className)} {...props} />
  ),
)
Stack.displayName = 'Stack'
