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
export type HeroCta = {
  label: string
  to?: string
  href?: string
  hrefLang?: string
  attributes?: Record<string, string>
}

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
      ? // AP34 (SC-002/SC-003): weisse Pille auf Navy wie Startseite und Bereichsbuehnen.
        'inline-flex min-h-[44px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-deep shadow-card sm:text-base transition hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep'
      : 'inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/25 transition hover:bg-white/10 sm:text-base'
  return cta.to ? (
    <Link to={cta.to} className={cls} {...cta.attributes}>
      {cta.label}
    </Link>
  ) : (
    <a
      href={cta.href}
      hrefLang={cta.hrefLang}
      className={cls}
      target={cta.href?.startsWith('http') ? '_blank' : undefined}
      rel={cta.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...cta.attributes}
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
        className={`relative mx-auto max-w-container px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-0 lg:pb-20 lg:pt-32 ${
          hasVisual ? 'grid items-center gap-8 lg:grid-cols-2' : ''
        }`}
      >
        {/* LEFT — copy */}
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs variant="dark" className="mb-5 sm:mb-8" items={breadcrumbs} />
          )}

          {eyebrow && (
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/25">
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-accent-line" />
              {eyebrow}
            </p>
          )}

          <h1 className="mt-4 max-w-3xl text-balance text-[clamp(2.25rem,5.2vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-3 max-w-[60ch] text-pretty text-base leading-relaxed text-white/85 sm:mt-6 sm:text-lg">
              {subtitle}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="mt-7 flex flex-wrap gap-3 sm:mt-9 sm:gap-5">
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
            <div className="relative min-h-[320px] rounded-card bg-white/5 p-7 ring-1 ring-white/10">
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
