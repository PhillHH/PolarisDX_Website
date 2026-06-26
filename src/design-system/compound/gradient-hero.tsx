import * as React from 'react'
import { cn } from '../../lib/utils'
import { GradientSurface } from '../primitives-layout/gradient-surface'

/**
 * GradientHero — Molecule (Containment, §Phase 2.3 / §2.1, RELAUNCH-CONCEPT §5).
 *
 * Single Source of Truth fuer die **Detailseiten-Hero-Schale**: der in §5
 * vorgeschriebene Gradient-Hero (Navy → Heading-Navy). Die dunkle Gradient-
 * Chrome (Noise-Overlay + Glow-Kanten) liefert das `GradientSurface`-Atom; diese
 * Molecule legt die §5-Innen-Geometrie (Breadcrumb/Eyebrow/H1/Subline) darueber.
 * Beides war zuvor auf ~9 Seiten roh kopiert — mit Drift (mal flat
 * `bg-brand-primary` statt Gradient, mal ohne Noise-Overlay), was die
 * §5-Konsistenz und [FIL]-Hierarchie brach. Der Aufrufer reicht den Inhalt als
 * `children` (inhalts-/kontext-agnostisch, §Phase 2.7).
 *
 * Token-rein (§1.7): Flaeche/Overlays ausschliesslich ueber Rollen-Tokens
 * (`brand-primary/deep/heading`, `fg-on-dark`) — **0** Roh-Hex/arbitrary-Farbe.
 * Innen-Geometrie (max-w-page, Padding) ueber die rem-/Token-Skala. Rendert
 * semantisches `<section>`.
 *
 * `minHeight`: vertikale Mindesthoehe der Hero-Bande (Default `min-h-hero` =
 * `--size-hero`-Token). `innerClassName`: Breiten-Korridor des Inhalts-Wrappers
 * (Default `max-w-container`; Lesetypografie-Seiten nutzen `max-w-4xl mx-auto`).
 */
export interface GradientHeroProps extends React.HTMLAttributes<HTMLElement> {
  /** Mindesthoehe der Hero-Bande. Default `min-h-hero` (`--size-hero`). */
  minHeight?: string
  /** Breiten-/Zentrierungs-Korridor des Inhalts-Wrappers. Default `max-w-container`. */
  innerClassName?: string
}

export const GradientHero = React.forwardRef<HTMLElement, GradientHeroProps>(
  ({ className, minHeight = 'min-h-hero', innerClassName = 'max-w-container', children, ...props }, ref) => {
    return (
      <GradientSurface ref={ref} className={className} {...props}>
        <div
          className={cn(
            'relative z-10 mx-auto flex max-w-page flex-col justify-end px-4 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32',
            minHeight,
          )}
        >
          <div className={innerClassName}>{children}</div>
        </div>
      </GradientSurface>
    )
  },
)
GradientHero.displayName = 'GradientHero'
