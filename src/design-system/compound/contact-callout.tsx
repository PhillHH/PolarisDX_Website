import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * ContactCallout — Molecule (Communication, §Phase 2.3 / §2.1).
 *
 * Single Source of Truth fuer die kompakte Sidebar-Telefon-Kontaktbox
 * (Holy Grail §Phase 7.8): die zuvor in `VitaminD3SprayPage`,
 * `VitaminD3ImplantologyPage` und `S3LeitliniePage` **dreifach** roh gepflegte
 * Box (Icon-Medaillon + Titel/Subtitel + Soft-Tel-Aktion + Hinweis) lebt jetzt
 * **einmal** hier. Inhalts-/kontext-agnostisch (§Phase 2.7): der Aufrufer reicht
 * Icon, Texte, Telefon-Ziel und -Label durch — die Box kennt keine Telefonnummer.
 *
 * Abgrenzung zu `Panel` (§Phase 2.7): Panel = ruhende, generische Inhalts-Flaeche;
 * ContactCallout = spezialisierte Kontakt-Aufforderung mit Medaillon + Aktion.
 * Abgrenzung zu `NavTile`: NavTile = ganze Flaeche ist ein Navigations-Link;
 * ContactCallout = ruhende Box mit **einer** dedizierten Tel-Aktion.
 *
 * Token-rein (§1.7): Farben/Schatten ausschliesslich ueber `--callout-*`-
 * Component-Tokens via der erlaubten `[var(--token)]`-Form (§3) — **0** Roh-Hex/
 * arbitrary-px. Struktur/Spacing/Radius ueber die rem-basierte Tailwind-Skala
 * (bewusst nicht token-remappt, §Einheit 1a; `rounded-xl` analog NavTile/Card).
 *
 * A11y (§1.11): das fuehrende Icon ist dekorativ (`aria-hidden`); der Tel-Link
 * ist ein nativer `<a href="tel:…">` (tastatur-/screenreader-bedienbar) mit
 * sichtbarem Tastatur-Fokus (Navy-Ring mit Offset, WCAG 2.4.7) und hover/active.
 *
 * UI-States: rein statische Informations-Box (kein Datenbezug) — loading/empty/
 * error/success sind nicht anwendbar (analog NavTile/Container). Pflicht-Inhalte
 * (`title`, `phoneHref`, `phoneLabel`) sind verpflichtende Props.
 */
export interface ContactCalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Fuehrendes Icon im Medaillon (Groesse vom Aufrufer, Farbe per Token). */
  icon: React.ReactNode
  /** Ueberschrift der Box (z. B. „Fragen zur Bestellung?"). */
  title: React.ReactNode
  /** Erlaeuternder Subtitel unter der Ueberschrift. */
  subtitle?: React.ReactNode
  /** Telefon-Ziel (`tel:…`). */
  phoneHref: string
  /** Inhalt des Tel-Buttons (Icon + Nummer als ReactNode). */
  phoneLabel: React.ReactNode
  /** Hinweiszeile unter dem Button (z. B. Erreichbarkeit). */
  note?: React.ReactNode
}

export const ContactCallout = React.forwardRef<HTMLDivElement, ContactCalloutProps>(
  ({ className, icon, title, subtitle, phoneHref, phoneLabel, note, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-[var(--callout-border)] bg-[var(--callout-bg)] p-5 shadow-[var(--callout-shadow)]',
        className,
      )}
      {...props}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--callout-icon-bg)] text-[var(--callout-icon-fg)]"
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--callout-title-fg)]">{title}</p>
          {subtitle && <p className="text-xs text-[var(--callout-muted-fg)]">{subtitle}</p>}
        </div>
      </div>
      <a
        href={phoneHref}
        className="flex items-center justify-center gap-2 rounded-md bg-[var(--callout-action-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--callout-action-fg)] transition-colors hover:bg-[var(--callout-action-bg-hover)] active:bg-[var(--callout-action-bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus-ring)]"
      >
        {phoneLabel}
      </a>
      {note && <p className="mt-2 text-center text-xs text-[var(--callout-muted-fg)]">{note}</p>}
    </div>
  ),
)
ContactCallout.displayName = 'ContactCallout'
