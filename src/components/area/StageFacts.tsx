import type { LucideIcon } from 'lucide-react'

/**
 * Kennzahlen-Leiste, die die Buehne von unten ueberlappt — dasselbe Muster wie
 * die Trust-Leiste der Startseite (`.home-signal`). Nur bestehende, belegte
 * Angaben; die Leiste erfindet keine Zahl.
 */
export interface StageFact {
  icon: LucideIcon
  label: string
  value: string
}

const StageFacts = ({ items, label }: { items: StageFact[]; label: string }) => (
  <div className="relative z-10 mx-auto -mt-14 max-w-container px-4 sm:px-6 lg:-mt-16 lg:px-0">
    <ul
      aria-label={label}
      className="grid grid-cols-2 overflow-hidden rounded-card bg-white text-heading shadow-card lg:grid-cols-4"
    >
      {items.map(({ icon: Icon, label: itemLabel, value }) => (
        <li key={itemLabel} className="home-signal">
          <span
            aria-hidden="true"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-strong"
          >
            <Icon className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-gray-600">
              {itemLabel}
            </span>
            <span className="block text-[15px] font-semibold leading-snug">{value}</span>
          </span>
        </li>
      ))}
    </ul>
  </div>
)

export default StageFacts
