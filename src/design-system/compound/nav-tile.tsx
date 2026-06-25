import * as React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

/**
 * NavTile — Molecule (Navigation, §Phase 2.3 / §2.1).
 *
 * Single Source of Truth fuer die kompakte, icon-gefuehrte Navigations-Kachel
 * (Holy Grail §Phase 7.8): die zuvor in `ArticlePage` (Related-Services) und
 * `ServicePage` (Key-Areas) dreifach roh gepflegte Link-Listenzeile
 * (Icon-Tile + Label, Hover-Lift) lebt jetzt **einmal** hier. Inhalts-/kontext-
 * agnostisch (§Phase 2.7) — der Aufrufer reicht Ziel (`to`), Icon und Label.
 *
 * Abgrenzung zu `Card` (§Phase 2.7): Card = erhobene Glass-Karte (Inhalts-
 * Container); NavTile = schlanke, icon-gefuehrte **Navigations-Zeile** in einer
 * Sidebar-Liste. Distinkte Patterns, kein verfruehtes Generalisieren.
 *
 * Token-rein (§1.7): Farben/Schatten ausschliesslich ueber `--navtile-*`-
 * Component-Tokens via der erlaubten `[var(--token)]`-Form (§3) — **0** Roh-Hex/
 * arbitrary-px. Struktur/Spacing/Radius ueber die rem-basierte Tailwind-Skala
 * (bewusst nicht token-remappt, §Einheit 1a; analog Card).
 *
 * UI-States: default + hover (Lift) + active (gesetzter Lift) + focus-visible
 * (Navy-Ring mit Offset, §1.11 WCAG 2.4.7) als Properties. `disabled` ist fuer
 * einen nativen Navigations-Link nicht anwendbar (gesperrtes Ziel wird nicht
 * gerendert); loading/empty/error/success sind ohne Datenbezug nicht anwendbar —
 * der Leerzustand der Liste liegt beim Aufrufer (analog Container).
 */
export interface NavTileProps extends Omit<React.ComponentPropsWithoutRef<typeof Link>, 'to'> {
  /** Internes Router-Ziel (ganze Kachel klickbar). */
  to: string
  /** Fuehrendes Icon (ReactNode) — im Icon-Tile zentriert. */
  icon: React.ReactNode
}

export const NavTile = React.forwardRef<HTMLAnchorElement, NavTileProps>(
  ({ className, to, icon, children, ...props }, ref) => (
    <Link
      ref={ref}
      to={to}
      className={cn(
        'group flex items-center justify-between rounded-xl p-4 transition-all duration-300',
        'border border-[var(--navtile-border)] bg-gradient-to-br from-[var(--navtile-bg-from)] to-[var(--navtile-bg-to)] shadow-[var(--navtile-shadow)]',
        'hover:scale-[1.02] hover:border-[var(--navtile-border-hover)] hover:shadow-[var(--navtile-shadow-hover)]',
        'active:scale-[1.01] active:border-[var(--navtile-border-hover)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus-ring)]',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--navtile-icon-bg)] text-[var(--navtile-icon-fg)] transition-colors group-hover:bg-[var(--navtile-icon-bg-hover)] group-hover:text-[var(--navtile-icon-fg-hover)]">
          {icon}
        </div>
        <span className="font-medium text-[var(--navtile-label-fg)] group-hover:text-[var(--navtile-label-fg-hover)]">
          {children}
        </span>
      </div>
    </Link>
  ),
)
NavTile.displayName = 'NavTile'
