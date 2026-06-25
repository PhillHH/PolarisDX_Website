import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * InfoItem — Molecule (Communication, §Phase 2.3 / §2.1).
 *
 * Single Source of Truth fuer die kompakte Kontakt-Kanal-Zeile (Holy Grail
 * §Phase 7.8): die zuvor in `ContactPage` (2x) und `SupportPage` (2x)
 * **vierfach** roh gepflegte Zeile (Icon-Medaillon + uppercase-Label + Wert)
 * lebt jetzt **einmal** hier. Inhalts-/kontext-agnostisch (§Phase 2.7): der
 * Aufrufer reicht Icon, Label und Wert (`children`) durch — die Zeile kennt
 * weder E-Mail noch Telefonnummer.
 *
 * Abgrenzung zu `ContactCallout` (§Phase 2.7): ContactCallout = ganze gerahmte
 * Box mit dedizierter Tel-Aktion; InfoItem = einzelne, rahmenlose Label/Wert-
 * Zeile mit fuehrendem Medaillon (Detail-/Metadaten-Anzeige). `MediaLink` =
 * navigierbare Link-Zeile; InfoItem = ruhende Anzeige ohne Link/Aktion.
 *
 * Token-rein (§1.7): Farben ausschliesslich ueber `--info-item-*`-Component-
 * Tokens via der erlaubten `[var(--token)]`-Form (§3) — **0** Roh-Hex/
 * arbitrary-px. Struktur/Spacing/Radius (`h-8 w-8`, `gap-3`, `rounded-full`)
 * ueber die rem-basierte Tailwind-Skala (bewusst nicht token-remappt,
 * §Einheit 1a). Die Schriftgroesse des Werts wird **nicht** gesetzt → erbt vom
 * Aufrufer-Kontext (byte-identisch zur bisherigen `text-sm`-Kaskade).
 *
 * A11y (§1.11): das fuehrende Medaillon-Icon ist dekorativ (`aria-hidden`) —
 * das Label traegt die zugaengliche Information (vermeidet redundantes
 * Vorlesen des ✉/☎-Glyphen).
 *
 * UI-States: rein statische Detail-Anzeige (kein Datenbezug) — loading/empty/
 * error/success sind nicht anwendbar (analog ContactCallout/AuthorByline).
 * `icon`, `label` und Wert (`children`) sind verpflichtend.
 */
export interface InfoItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fuehrendes Icon im Medaillon (Glyph/ReactNode; Farbe per Token). */
  icon: React.ReactNode
  /** Uppercase-Label ueber dem Wert (z. B. „E-Mail"). */
  label: React.ReactNode
  /** Der Wert (z. B. die E-Mail-Adresse) als `children`. */
  children: React.ReactNode
}

export const InfoItem = React.forwardRef<HTMLDivElement, InfoItemProps>(
  ({ className, icon, label, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-3', className)} {...props}>
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--info-item-icon-bg)] text-[var(--info-item-icon-fg)]"
      >
        {icon}
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-overline text-[var(--info-item-label-fg)]">
          {label}
        </p>
        <p className="text-[var(--info-item-value-fg)]">{children}</p>
      </div>
    </div>
  ),
)
InfoItem.displayName = 'InfoItem'
