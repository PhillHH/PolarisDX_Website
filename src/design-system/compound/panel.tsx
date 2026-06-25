import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Panel — Molecule (Containment, §Phase 2.3 / §2.1).
 *
 * Single Source of Truth fuer die **statische** Inhalts-Flaeche (Holy Grail
 * §Phase 7.8): die zuvor in `ContactPage` und `SupportPage` sechsfach roh
 * gepflegte weisse Form-/Info-Flaeche lebt jetzt **einmal** hier. Inhalts-/
 * kontext-agnostisch (§Phase 2.7) — nur die Flaeche, der Aufrufer reicht den
 * Inhalt als `children`.
 *
 * Abgrenzung zu `Card`: Panel ist die **ruhende** Flaeche (kein Hover-Lift,
 * keine Link-Semantik) fuer Formular-/Info-Bloecke; `Card` ist die **erhobene,
 * klickbare** Glass-Karte. Bewusst zwei distinkte Containment-Patterns, nicht
 * eine ueberladene Komponente (§Phase 2.7).
 *
 * Token-rein (§1.7): Flaeche/Radius/Schatten/Rahmen ausschliesslich ueber die
 * `--panel-*`-Component-Tokens via `[var(--token)]` (§3) — **0** Roh-Hex/
 * arbitrary-px. Padding ueber die rem-basierte Tailwind-Skala (bewusst nicht
 * token-remappt, §Einheit 1a). Rendert semantisches `<section>`.
 *
 * Orthogonale Achsen (§Phase 2.9): `padding` (sm/md/lg), `bordered`, `radius`
 * (md/lg) und `as` — alle live belegt (Form-/Info-Panel vs. Sidebar-Widget mit
 * Rahmen + `p-5`; engerer `rounded-xl`-Radius fuer Related-/Download-Boxen).
 *
 * Radius: `lg` (Default) = `--panel-radius`-Token (16px); `md` = `rounded-xl`
 * (12px) ueber die rem-basierte Tailwind-Skala — bewusst **nicht** auf ein
 * Token remappt (`--radius-md` ist 8px, ein Remap waere ein stiller Werte-
 * wechsel, §Einheit 1a). `as` waehlt das Host-Element (`section` Default,
 * `div` fuer eingebettete Boxen ohne eigenen Dokument-Outline-Abschnitt).
 */
const panel = cva('bg-[var(--panel-bg)] shadow-[var(--panel-shadow)]', {
  variants: {
    // Alle drei Stufen live belegt (Sidebar-Widget=sm, Form=lg, Info=md).
    padding: {
      sm: 'p-5',
      md: 'p-6',
      lg: 'p-6 lg:p-8',
    },
    // Rahmen-Achse (Sidebar-Widget): rollenbasierter --panel-border-Token.
    bordered: {
      true: 'border border-[var(--panel-border)]',
      false: '',
    },
    // Radius-Achse: lg = Token (16px), md = rounded-xl (12px, Tailwind-Skala).
    radius: {
      md: 'rounded-xl',
      lg: 'rounded-[var(--panel-radius)]',
    },
  },
  defaultVariants: {
    padding: 'md',
    bordered: false,
    radius: 'lg',
  },
})

export interface PanelProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof panel> {
  /** Host-Element (§1.20 — erst ab realem Bedarf). Default `section`. */
  as?: 'section' | 'div'
}

export const Panel = React.forwardRef<HTMLElement, PanelProps>(
  ({ className, padding, bordered, radius, as: Tag = 'section', ...props }, ref) => {
    const Component = Tag as React.ElementType
    return (
      <Component
        ref={ref}
        className={cn(panel({ padding, bordered, radius }), className)}
        {...props}
      />
    )
  },
)
Panel.displayName = 'Panel'
