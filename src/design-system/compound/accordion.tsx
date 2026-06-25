import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * Accordion — Molecule (Disclosure, §Phase 2.3 / §2.1).
 *
 * Single Source of Truth fuer die aufklappbare Frage/Antwort-Liste (Holy Grail
 * §Phase 7.8): das zuvor inline in `FAQSection` gepflegte, stateful Disclosure-
 * Widget lebt jetzt **einmal** hier. Industriestandard-Name (§Phase 2.8 nennt
 * `Accordion` explizit). Inhalts-/kontext-agnostisch (§Phase 2.7) — der Aufrufer
 * reicht Trigger + Inhalt je Eintrag durch (`items`), das Widget kennt kein FAQ.
 *
 * Verhalten: **Single-Open** (max. ein Eintrag offen) — verhaltenserhaltend zur
 * bisherigen FAQ-Logik (§1.6). Keine ungenutzte `allowMultiple`-Achse (§1.20).
 *
 * Token-rein (§1.7): Farben/Radius/Schatten ausschliesslich ueber die neuen
 * `--accordion-*`-Component-Tokens via `[var(--token)]` (§3) — **0** Roh-Hex/
 * arbitrary-px. Schrift-/Abstands-Groessen ueber die rem-basierte Tailwind-Skala
 * (bewusst nicht token-remappt, §Einheit 1a). Alle interaktiven States als
 * Properties: default / hover / focus-visible / expanded.
 *
 * A11y (§1.11): jeder Trigger ist ein `<button>` mit `aria-expanded` +
 * `aria-controls`; die zugehoerige Inhalts-Region traegt `role="region"` +
 * `aria-labelledby`. Der Chevron ist dekorativ (`aria-hidden`).
 *
 * UI-States (§Phase 6.1): **Empty** (`items` leer/kein Array) → rendert `null`
 * statt einer toten, leeren Panel-Flaeche. Loading/Error/Success sind fuer eine
 * statische Disclosure-Liste nicht anwendbar (Datenbeschaffung = Aufrufer-Sache).
 */
export interface AccordionItem {
  /** Optionaler stabiler Schluessel (sonst index-basiert). */
  id?: string
  /** Trigger-/Frage-Inhalt. */
  trigger: React.ReactNode
  /** Aufklappbarer Inhalt. */
  content: React.ReactNode
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[]
}

export function Accordion({ items, className, ...rest }: AccordionProps) {
  const baseId = React.useId()
  const [openId, setOpenId] = React.useState<string | null>(null)

  // Empty-State (§Phase 6.1): keine leere, tote Panel-Flaeche rendern.
  if (!Array.isArray(items) || items.length === 0) return null

  return (
    <div
      className={cn(
        'divide-y divide-[var(--accordion-border)] overflow-hidden rounded-[var(--accordion-radius)]',
        'border border-[var(--accordion-border)] bg-[var(--accordion-bg)] shadow-[var(--accordion-shadow)]',
        className,
      )}
      {...rest}
    >
      {items.map((item, index) => {
        const key = item.id ?? `${baseId}-${index}`
        const triggerId = `${key}-trigger`
        const regionId = `${key}-region`
        const open = openId === key
        return (
          <div key={key}>
            <button
              type="button"
              id={triggerId}
              aria-expanded={open}
              aria-controls={regionId}
              onClick={() => setOpenId(open ? null : key)}
              className={cn(
                'flex w-full items-center justify-between gap-4 px-6 py-5 text-left',
                'transition-colors duration-[var(--duration-base)] hover:bg-[var(--accordion-trigger-hover-bg)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-focus-ring)]',
              )}
            >
              <span className="text-base font-medium text-[var(--accordion-trigger-fg)] sm:text-lg">
                {item.trigger}
              </span>
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  'h-5 w-5 flex-shrink-0 text-[var(--accordion-icon-color)] transition-transform duration-300 ease-out',
                  open && 'rotate-180',
                )}
              />
            </button>
            <div
              id={regionId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(
                'grid transition-all duration-300 ease-out',
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-5 text-sm leading-relaxed text-[var(--accordion-content-fg)] sm:text-base">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
Accordion.displayName = 'Accordion'
