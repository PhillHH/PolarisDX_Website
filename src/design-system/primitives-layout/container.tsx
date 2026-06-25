import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * Container — Layout-Primitive-Atom (`primitives-layout/`, §2.1).
 *
 * Single Source of Truth fuer den horizontal zentrierten Inhalts-Rahmen
 * (Holy Grail §Phase 7.8): die zuvor ueber ~12 Seiten/Sektionen roh
 * wiederholte Wrapper-Signatur `mx-auto max-w-container px-4 lg:px-0` lebt
 * jetzt **einmal** hier. Inhalts-/kontext-agnostisch (§Phase 2.7) — nur der
 * Rahmen (Zentrierung, Max-Breite, seitliche Gutter), der Aufrufer reicht den
 * Inhalt als `children`; vertikale Abstaende/Layout-Extras (`py-*`,
 * `text-center`, `relative` …) bleiben **call-site-spezifisch** und kommen ueber
 * `className` dazu (kein verfruehtes Generalisieren, §1.20).
 *
 * Token-rein (§1.7): ausschliesslich token-/config-gebundene Tailwind-Utilities
 * (`max-w-container` aus der Config, `px-4`/`lg:px-0` auf der rem-basierten
 * Spacing-Skala — bewusst nicht token-remappt, §Einheit 1a) — **0** Roh-Hex/
 * arbitrary-px in der Komponente. Rendert ein neutrales `<div>` (alle 12
 * Call-Sites sind Wrapper-`<div>`s; kein ungenutzter `as`-Prop, §1.20).
 *
 * UI-States (§Phase 6.1): loading/empty/error/success sind fuer einen rein
 * strukturellen Layout-Rahmen nicht anwendbar (kein Datenbezug) — kein
 * erfundener State (analog `Breadcrumbs`/`Stat`).
 */
export type ContainerProps = React.HTMLAttributes<HTMLDivElement>

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mx-auto max-w-container px-4 lg:px-0', className)} {...props} />
  ),
)
Container.displayName = 'Container'
