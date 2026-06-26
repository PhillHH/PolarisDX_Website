import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * GradientSurface — Atom (Containment, RELAUNCH-CONCEPT §5 / §6 „keine Duplikate").
 *
 * Single Source of Truth fuer die **dunkle Navy-Gradient-Schale** (Gradient
 * Navy → Heading-Navy + Noise-Overlay + beidseitige Glow-Kanten). Diese Chrome
 * war zuvor mehrfach roh kopiert (GradientHero, CtaBand, Produkt-/Spray-Split-
 * Heroes) — mit Drift (mal `w-60`, mal `w-80` Glow, mal ohne `pointer-events`).
 * Sie lebt jetzt **einmal** hier; Aufrufer reichen ihren Inhalt als `children`
 * und ihre Innen-Geometrie via `className`/eigene Wrapper.
 *
 * Token-rein (§1.7): Flaeche/Overlays ausschliesslich ueber Rollen-Tokens
 * (`brand-primary/deep/heading`, `fg-on-dark`) — **0** Roh-Hex/arbitrary-Farbe.
 * Rendert per Default ein semantisches `<section>` (via `as` ueberschreibbar).
 *
 * `glowWidth`: Breite der seitlichen Glow-Kanten (Default `w-60`; breite Bänder
 * wie das CTA-Band nutzen `w-80`).
 */
export interface GradientSurfaceProps extends React.HTMLAttributes<HTMLElement> {
  /** Semantisches Wurzel-Element. Default `section`. */
  as?: 'section' | 'div'
  /** Breite der seitlichen Glow-Kanten. Default `w-60`. */
  glowWidth?: string
}

export const GradientSurface = React.forwardRef<HTMLElement, GradientSurfaceProps>(
  ({ as: Tag = 'section', className, glowWidth = 'w-60', children, ...props }, ref) => {
    return (
      <Tag
        ref={ref as React.Ref<HTMLElement & HTMLDivElement>}
        className={cn(
          'relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-deep to-brand-heading text-fg-on-dark',
          className,
        )}
        {...props}
      >
        <div className="pointer-events-none absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay" />
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-br from-fg-on-dark/30 to-transparent opacity-10',
            glowWidth,
          )}
        />
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 bg-gradient-to-tl from-fg-on-dark/30 to-transparent opacity-10',
            glowWidth,
          )}
        />
        {children}
      </Tag>
    )
  },
)
GradientSurface.displayName = 'GradientSurface'
