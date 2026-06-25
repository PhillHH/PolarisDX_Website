import * as React from 'react'
import { Link } from 'react-router-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Card — Molecule (Containment, §Phase 2.3 / §2.1).
 *
 * Single Source of Truth fuer die erhobene Inhalts-Karte (Holy Grail
 * §Phase 7.8): die zuvor in `ServiceCard` und `BlogCard` doppelt gepflegte
 * Glass-Panel-Oberflaeche mit Hover-Lift lebt jetzt **einmal** hier. Inhalts-/
 * kontext-agnostisch (§Phase 2.7) — nur die Flaeche, der Aufrufer reicht den
 * Inhalt als `children`.
 *
 * Token-rein (§1.7): konsumiert ausschliesslich token-gebundene Utilities
 * (`glass-panel`-Component-Class, `rounded-xl`, `shadow-card`, `bg-surface` — alle
 * via Tailwind an die Token-Config gebunden, Einheit 1b) sowie die Spacing-Skala
 * (`p-6`). **Kein** Roh-Hex/arbitrary-px. Alle Oberflaechen-States als
 * Properties: default/hover/active + focus-visible (Navy-Ring mit Offset, §1.11
 * WCAG 2.4.7) — nur bei `interactive` (dann rendert die Karte als Link/`<a>`).
 *
 * Polymorph: `to` -> React-Router-`<Link>`, `href` -> `<a>`, sonst `as`
 * (`div`/`article`). Die Flaechen-Logik bleibt fuer alle Elemente identisch.
 */
const card = cva('glass-panel rounded-xl transition duration-300', {
  variants: {
    padding: {
      none: '',
      md: 'p-6',
    },
    // Hover-Lift nur dort, wo die Karte selbst eine erhobene/klickbare Flaeche ist.
    interactive: {
      true:
        'hover:-translate-y-1 hover:shadow-card hover:bg-surface/80 active:-translate-y-0.5 ' +
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus-ring)]',
      false: '',
    },
  },
  defaultVariants: {
    padding: 'md',
    interactive: false,
  },
})

export interface CardProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof card> {
  /** Interner Router-Link (rendert `<Link>`, ganze Karte klickbar). */
  to?: string
  /** Externer/absoluter Link (rendert `<a>`). */
  href?: string
  /** Host-Element ohne Link-Semantik (Default `div`). */
  as?: 'div' | 'article'
}

export const Card = React.forwardRef<HTMLElement, CardProps>(
  ({ className, padding, interactive, to, href, as = 'div', ...props }, ref) => {
    const Component: React.ElementType = to ? Link : href ? 'a' : as
    const linkProps = to ? { to } : href ? { href } : {}
    return (
      <Component
        ref={ref}
        className={cn(card({ padding, interactive }), className)}
        {...linkProps}
        {...props}
      />
    )
  },
)
Card.displayName = 'Card'
