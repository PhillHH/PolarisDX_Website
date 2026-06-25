import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * Stat — Atom (§Phase 2.2).
 *
 * Single Source of Truth fuer eine einzelne Kennzahl (grosser Wert + optionaler
 * Suffix + Label), Holy Grail §Phase 7.8. Industriestandard-/agnostischer Name
 * (§Phase 2.7/2.8): „Stat" statt des Orts-Suffix „StatItem".
 *
 * Token-rein (§1.7): Farben ausschliesslich ueber `--stat-*`-Component-Tokens
 * (`[var(--token)]`-Form, §3) — kein Roh-`text-white`/`brand-secondary`. Die
 * Stat lebt auf dunklem Grund (Hero), daher on-dark-Tonalitaeten. Schriftgroessen
 * laufen ueber die rem-basierte Tailwind-Skala (bewusst nicht token-remappt,
 * §Einheit 1a).
 *
 * Bewusst **keine** `size`-Achse: der einzige Use-Case (Hero) nutzt eine Groesse;
 * keine API ohne Use (§1.20) — bei zweitem Use-Case als orthogonaler Prop ergaenzbar.
 */
export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Die Kennzahl, z. B. "48h". */
  value: string
  /** Optionaler nachgestellter Zusatz, z. B. "%". */
  suffix?: string
  /** Beschriftung unter dem Wert. */
  label: string
}

export const Stat = ({ value, suffix, label, className, ...props }: StatProps) => (
  <div className={cn('space-y-1', className)} {...props}>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-medium tracking-tight text-[var(--stat-value-color)] sm:text-3xl">
        {value}
      </span>
      {suffix && (
        <span className="text-lg font-medium text-[var(--stat-suffix-color)]">{suffix}</span>
      )}
    </div>
    <p className="text-xxs font-normal text-[var(--stat-label-color)] sm:text-xs">{label}</p>
  </div>
)
Stat.displayName = 'Stat'
