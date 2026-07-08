import type { ReactNode } from 'react'
import { Breadcrumbs, type BreadcrumbItem } from '../ui/Breadcrumbs'

/**
 * SubpageHero — geteilter Navy-Hero für Unterseiten (Sales-Machine-System).
 *
 * Reproduziert das Hero-Muster der migrierten Referenzseiten (DiagnosticsHero /
 * IglooProHero): `bg-brand-deep`, dunkle Breadcrumbs, optionaler Teal-Eyebrow,
 * genau EINE H1, optionaler Untertitel, Proof-Chips und ein optionales dekoratives
 * Visual (z. B. Fachrichtungs-Icon in einer Teal-Tint-Kachel).
 *
 * Wird von T1 (ServicePage), T4 (About), T5 (Support), T7 (Legal) genutzt.
 */
export type SubpageHeroProps = {
  breadcrumbs?: BreadcrumbItem[]
  eyebrow?: string
  /** Wird als einzige <h1> der Seite gerendert. */
  title: string
  subtitle?: string
  chips?: string[]
  /** Optionales dekoratives Icon/Visual rechts (nur ≥ lg sichtbar). */
  icon?: ReactNode
}

export function SubpageHero({ breadcrumbs, eyebrow, title, subtitle, chips, icon }: SubpageHeroProps) {
  const hasVisual = !!icon

  return (
    <section className="relative overflow-hidden bg-brand-deep text-white">
      <div
        className={`mx-auto max-w-container px-4 lg:px-0 pt-24 pb-16 lg:pt-28 ${
          hasVisual ? 'grid items-center gap-10 lg:grid-cols-2' : ''
        }`}
      >
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs variant="dark" className="mb-4" items={breadcrumbs} />
          )}

          {eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {eyebrow}
            </p>
          )}

          <h1 className="text-4xl font-medium tracking-tight lg:text-5xl">{title}</h1>

          {subtitle && <p className="mt-4 max-w-xl leading-relaxed text-white/80">{subtitle}</p>}

          {chips && chips.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 ring-1 ring-white/15"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        {hasVisual && (
          <div className="hidden lg:block" aria-hidden="true">
            <div className="relative flex min-h-[280px] items-center justify-center rounded-2xl bg-white/5 p-10 ring-1 ring-white/10">
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-accent/15 text-accent-on-dark [&>svg]:h-16 [&>svg]:w-16">
                {icon}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default SubpageHero
