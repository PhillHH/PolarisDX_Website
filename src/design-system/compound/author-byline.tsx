import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * AuthorByline — Molecule (Communication, §Phase 2.3 / §2.1).
 *
 * Single Source of Truth fuer die redaktionelle Autoren-Attribution
 * (E-E-A-T-Signal): die zuvor in `VitaminD3ImplantologyPage` und
 * `S3LeitliniePage` **byte-identisch** doppelt gepflegte Box
 * (Initialen-Medaillon + Autorenname) lebt jetzt **einmal** hier
 * (Holy Grail §Phase 7.8; zweiter belegter Use-Case §1.16).
 *
 * Inhalts-/kontext-agnostisch (§Phase 2.7): der Aufrufer reicht Initialen und
 * Name durch — die Box kennt keinen konkreten Autor. Das call-site-spezifische
 * Aussen-Spacing (`mb-10`) kommt byte-stabil ueber `className` (twMerge) dazu.
 *
 * Abgrenzung (§Phase 2.7): `ContactCallout` = Kontakt-Aufforderung mit Tel-Aktion;
 * AuthorByline = ruhende Attribution ohne Aktion/Link. Distinkte Patterns.
 *
 * Token-rein (§1.7): Farben ausschliesslich ueber `--author-*`-Component-Tokens
 * via der erlaubten `[var(--token)]`-Form (§3) — **0** Roh-Hex/arbitrary-px.
 * Struktur/Spacing/Radius (`rounded-lg`, `p-4`, `gap-4`, `h-12 w-12`) ueber die
 * rem-basierte Tailwind-Skala (bewusst nicht token-remappt, §Einheit 1a; analog
 * ContactCallout).
 *
 * A11y (§1.11): das Initialen-Medaillon ist dekorativ (`aria-hidden`) — der
 * Autorenname traegt die zugaengliche Information.
 *
 * UI-States: rein statische Attribution (kein Datenbezug) — loading/empty/error/
 * success sind nicht anwendbar (analog ContactCallout/NavTile/Container).
 */
export interface AuthorBylineProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Initialen im Medaillon (z. B. „PX"). Dekorativ. */
  initials: React.ReactNode
  /** Autoren-/Redaktionsname. */
  name: React.ReactNode
}

export const AuthorByline = React.forwardRef<HTMLDivElement, AuthorBylineProps>(
  ({ className, initials, name, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-4 rounded-lg border border-[var(--author-border)] bg-[var(--author-bg)] p-4',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--author-avatar-bg)] text-lg font-semibold text-[var(--author-avatar-fg)]"
      >
        {initials}
      </div>
      <p className="text-sm font-medium text-[var(--author-name-fg)]">{name}</p>
    </div>
  ),
)
AuthorByline.displayName = 'AuthorByline'
