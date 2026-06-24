import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Grid — Layout-Primitive-Atom (`primitives-layout/`, §Phase 4.2/4.4).
 *
 * Single Source of Truth fuer das responsive **Karten-Raster** (Holy Grail
 * §Phase 7.8). Konsolidiert die zuvor in `pages/consumer/shell.tsx` lokal
 * definierte (und dort dupliziert genutzte) `Grid`-Funktion (§1.8 — Vermeiden
 * > Wiederverwenden) in die zentrale Design-System-Schicht; `shell.tsx`
 * re-exportiert von hier, sodass es genau **eine** Definition gibt.
 *
 * Spalten teilen 12 sauber (2/3/4, nie 5/7/11 — §Phase 4.2): mobile-first
 * **eine** Spalte, ab `sm` zwei, ab `lg` die Zielzahl → kein Layout-Bruch /
 * Horizontal-Scroll auf schmalen Viewports (§Phase 4.5). `gap` laeuft ueber die
 * rem-basierte Tailwind-Skala = **8pt-Soft-Grid** (`--space-*`), **keine**
 * arbitrary-px. Inhalts-/kontext-agnostisch (§Phase 2.7).
 *
 * Asymmetrische, **inhaltsabhaengige** Tracks (`grid-cols-[1fr_320px]`) bleiben
 * bewusst call-site-spezifisch (§Phase 4.1 „Eigengroessen duerfen
 * inhaltsabhaengig sein") — dieses Primitive deckt das gleichspaltige
 * Karten-Raster, nicht jedes denkbare Grid (§1.20 kein Vorab-Generalisieren).
 *
 * UI-States (§Phase 6.1): n. a. fuer ein strukturelles Layout-Primitive.
 */
const grid = cva('grid', {
  variants: {
    cols: {
      2: 'sm:grid-cols-2',
      3: 'sm:grid-cols-2 lg:grid-cols-3',
      4: 'sm:grid-cols-2 lg:grid-cols-4',
    },
    gap: {
      4: 'gap-4',
      6: 'gap-6',
      8: 'gap-8',
      10: 'gap-10',
      12: 'gap-12',
    },
  },
  defaultVariants: { cols: 3, gap: 6 },
})

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof grid> {}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, ...props }, ref) => (
    <div ref={ref} className={cn(grid({ cols, gap }), className)} {...props} />
  ),
)
Grid.displayName = 'Grid'
