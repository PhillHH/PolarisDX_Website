import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * Breadcrumbs — Molecule / Navigation (§Phase 2.3, §2.1 Containment→Navigation).
 *
 * Single Source of Truth fuer die Breadcrumb-Navigation (Holy Grail §Phase 7.8):
 * komponiert Router-`Link` + Trenner-Icon zu einer A11y-konformen Pfad-Anzeige.
 * Industriestandard-Name (§Phase 2.8). Token-rein (§1.7): Farben ausschliesslich
 * ueber `--breadcrumb-*`-Component-Tokens (`[var(--token)]`-Form, §3) — kein
 * Roh-Hex, kein nacktes `text-white`. Icon-Groesse laeuft ueber die rem-basierte
 * Tailwind-Skala (bewusst nicht token-remappt — §Einheit 1a).
 *
 * A11y (§1.11): `<nav aria-label>` + `<ol>`, letzter Eintrag `aria-current="page"`,
 * dekorativer Trenner `aria-hidden`. UI-States (§Phase 6.1): Empty (keine Items) →
 * rendert nichts statt einer leeren Navigation.
 *
 * Kontext: lebt auf dunklem Hero-Grund (Main-Site = default-dark) — daher
 * on-dark Tonalitaeten, keine `variant`-Achse (alle Call-Sites nutzten nur
 * „dark"; das ungenutzte „light" entfaellt — keine API ohne Use, §1.20).
 */

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  // Empty-State: ein leeres <nav> waere ein toter Landmark — nichts rendern.
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 text-[var(--breadcrumb-separator)]"
                />
              )}
              {isLast || !item.href ? (
                <span
                  className="text-[var(--breadcrumb-fg)]"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-[var(--breadcrumb-fg)] transition-colors hover:text-[var(--breadcrumb-link-hover)]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
Breadcrumbs.displayName = 'Breadcrumbs'
