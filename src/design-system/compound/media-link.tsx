import * as React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

/**
 * MediaLink — Molecule (Navigation, §Phase 2.3 / §2.1).
 *
 * Single Source of Truth fuer die icon-gefuehrte Related-/Weiterfuehrend-Link-
 * Zeile (Holy Grail §Phase 7.8): die zuvor in `VitaminD3SprayPage`,
 * `VitaminD3ImplantologyPage` und `S3LeitliniePage` **neunfach** roh gepflegte
 * Sidebar-Listenzeile (Icon-Tile + Titel + Beschreibung, ganze Zeile als Link)
 * lebt jetzt **einmal** hier. Inhalts-/kontext-agnostisch (§Phase 2.7) — der
 * Aufrufer reicht Ziel (`to`), Icon, Titel und Beschreibung.
 *
 * Abgrenzung zu `NavTile` (§Phase 2.7): NavTile = erhobene, einzeilige Nav-
 * Kachel mit Hover-Lift (scale/shadow, gerahmter Gradient-Tile); MediaLink =
 * flache, **zweizeilige** Listenzeile (Titel + Beschreibung) mit dezentem
 * Row-Hover (kein Lift). Distinkte Patterns, kein verfruehtes Generalisieren.
 *
 * Token-rein (§1.7): Farben ausschliesslich ueber `--media-link-*`-Component-
 * Tokens via der erlaubten `[var(--token)]`-Form (§3) — **0** Roh-Hex/
 * arbitrary-px. Struktur/Spacing/Radius/Icon-Tile-Groesse ueber die rem-basierte
 * Tailwind-Skala (bewusst nicht token-remappt, §Einheit 1a; analog NavTile/Card).
 *
 * UI-States: default + hover (Row-Tint, Titel-/Icon-Akzent) als Properties.
 * loading/empty/error/success sind fuer eine rein strukturelle Navigations-Zeile
 * nicht anwendbar (kein Datenbezug) — der Leerzustand der Liste liegt beim
 * Aufrufer (analog NavTile/Container).
 */
type MediaLinkAccent = 'primary' | 'success'

const accentTile: Record<MediaLinkAccent, string> = {
  primary: 'bg-[var(--media-link-icon-primary-bg)] text-[var(--media-link-icon-primary-fg)]',
  success: 'bg-[var(--media-link-icon-success-bg)] text-[var(--media-link-icon-success-fg)]',
}

export interface MediaLinkProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Link>,
  'to' | 'title'
> {
  /** Internes Router-Ziel (ganze Zeile klickbar). */
  to: string
  /** Fuehrendes Icon (ReactNode) — im Icon-Tile zentriert. */
  icon: React.ReactNode
  /** Primaerzeile (fett). */
  title: React.ReactNode
  /** Sekundaerzeile (gedaempfter Beschreibungstext). */
  description: React.ReactNode
  /** Rollenbasierter Icon-Tile-Akzent (Default: primary/Navy). */
  accent?: MediaLinkAccent
}

export const MediaLink = React.forwardRef<HTMLAnchorElement, MediaLinkProps>(
  ({ className, to, icon, title, description, accent = 'primary', ...props }, ref) => (
    <Link
      ref={ref}
      to={to}
      className={cn(
        'group flex items-start gap-3 rounded-lg p-2 transition-colors',
        'hover:bg-[var(--media-link-hover-bg)]',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
          accentTile[accent],
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--media-link-title-fg)] group-hover:text-[var(--media-link-title-fg-hover)]">
          {title}
        </p>
        <p className="text-xs text-[var(--media-link-desc-fg)]">{description}</p>
      </div>
    </Link>
  ),
)
MediaLink.displayName = 'MediaLink'
