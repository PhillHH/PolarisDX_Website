import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Breadcrumbs, type BreadcrumbItem } from '../ui/Breadcrumbs'

/**
 * SubpageHero — geteilter Navy-Hero für Unterseiten (Sales-Machine-System).
 *
 * Bringt Unterseiten auf das UX-Niveau der Referenz-Heroes (DiagnosticsHero /
 * IglooProHero / HomeHero): `bg-brand-deep`, Pill-Eyebrow, genau EINE H1,
 * Untertitel, optionale Hero-CTAs, Proof-Chips, optionale Stat-Zeile und ein
 * reiches, EINHEITLICHES Visual rechts — entweder ein SVG-Gauge (Diagnostik/
 * Produkt) oder ein Icon-Spotlight (About/Support/…), jeweils mit Puls-Ring und
 * schwebenden Live-Wert-Karten. Motion läuft nur hinter prefers-reduced-motion:
 * no-preference (Klassen hero-pulse-ring / hero-float* in index.css).
 */
export type HeroStat = { value: string; label: string }
export type HeroValueChip = { value: string; label: string }
export type HeroCta = { label: string; to?: string; href?: string }

export type SubpageHeroProps = {
  breadcrumbs?: BreadcrumbItem[]
  eyebrow?: string
  /** Wird als einzige <h1> der Seite gerendert. */
  title: string
  subtitle?: string
  chips?: string[]
  stats?: HeroStat[]
  primaryCta?: HeroCta
  secondaryCta?: HeroCta
  /** Gauge-Wert (Mitte). Aktiviert das Reader-Visual (Diagnostik/Produkt). */
  gauge?: string
  /** Schwebende Live-Wert-Karten am Visual (max. 3). */
  valueChips?: HeroValueChip[]
  /** Icon-Spotlight-Visual (falls kein gauge). */
  icon?: ReactNode
}

const GAUGE_R = 52
const GAUGE_C = 2 * Math.PI * GAUGE_R

function HeroCtaButton({ cta, variant }: { cta: HeroCta; variant: 'primary' | 'secondary' }) {
  const cls =
    variant === 'primary'
      ? 'inline-flex items-center justify-center rounded-md bg-accent-strong px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep'
      : 'inline-flex items-center justify-center rounded-md border border-white/25 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10'
  return cta.to ? (
    <Link to={cta.to} className={cls}>
      {cta.label}
    </Link>
  ) : (
    <a
      href={cta.href}
      className={cls}
      target={cta.href?.startsWith('http') ? '_blank' : undefined}
      rel={cta.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {cta.label}
    </a>
  )
}

export function SubpageHero({
  breadcrumbs,
  eyebrow,
  title,
  subtitle,
  chips,
  stats,
  primaryCta,
  secondaryCta,
  gauge,
  valueChips,
  icon,
}: SubpageHeroProps) {
  const cards = (valueChips || []).slice(0, 3)
  const hasVisual = !!(gauge || icon || cards.length)
  const positions = ['left-3 top-6', 'right-3 top-1/2', 'bottom-7 left-10']
  const floatCls = ['hero-float', 'hero-float-2', 'hero-float']

  return (
    <section className="relative overflow-hidden bg-brand-deep text-white">
      <div
        className={`relative mx-auto max-w-container px-4 lg:px-0 pt-24 pb-16 lg:pt-28 ${
          hasVisual ? 'grid items-center gap-8 lg:grid-cols-2' : ''
        }`}
      >
        {/* LEFT — copy */}
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs variant="dark" className="mb-4" items={breadcrumbs} />
          )}

          {eyebrow && (
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
              {eyebrow}
            </span>
          )}

          <h1 className="mt-5 text-4xl font-medium tracking-tight lg:text-5xl">{title}</h1>

          {subtitle && <p className="mt-4 max-w-xl leading-relaxed text-white/80">{subtitle}</p>}

          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-4">
              {primaryCta && <HeroCtaButton cta={primaryCta} variant="primary" />}
              {secondaryCta && <HeroCtaButton cta={secondaryCta} variant="secondary" />}
            </div>
          )}

          {chips && chips.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {stats && stats.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-medium text-white">{s.value}</div>
                  <div className="text-xs text-white/70">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — unified rich visual */}
        {hasVisual && (
          <div className="hidden lg:block" aria-hidden="true">
            <div className="relative min-h-[320px] rounded-2xl bg-white/5 p-7 ring-1 ring-white/10">
              <div className="relative mx-auto flex h-44 w-44 items-center justify-center">
                <span className="hero-pulse-ring absolute inset-0 rounded-full ring-2 ring-accent/40" />
                {gauge ? (
                  <>
                    <svg viewBox="0 0 120 120" className="h-44 w-44 -rotate-90">
                      <circle
                        cx="60"
                        cy="60"
                        r={GAUGE_R}
                        fill="none"
                        strokeWidth="10"
                        className="stroke-white/10"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r={GAUGE_R}
                        fill="none"
                        strokeWidth="10"
                        strokeLinecap="round"
                        className="stroke-accent"
                        strokeDasharray={GAUGE_C}
                        strokeDashoffset={GAUGE_C * 0.3}
                      />
                    </svg>
                    <span className="absolute text-2xl font-medium">{gauge}</span>
                  </>
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-accent/15 text-accent-on-dark [&>svg]:h-14 [&>svg]:w-14">
                    {icon}
                  </div>
                )}
              </div>

              {cards.map((c, i) => (
                <div
                  key={c.label}
                  className={`absolute ${positions[i]} ${floatCls[i]} flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-brand-deep `}
                >
                  <Check size={14} className="text-accent" />
                  <span>
                    <span className="block text-sm font-semibold">{c.value}</span>
                    <span className="block text-xs text-gray-700">{c.label}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default SubpageHero
