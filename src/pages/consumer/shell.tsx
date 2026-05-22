/**
 * Consumer landing page shell
 *
 * Shared, self-contained chrome + section primitives for the consumer-facing
 * landing pages (Vitamin D3+K2 Spray, Hydrating Masks, Inside-Out Care Duo).
 *
 * Deliberately NOT the B2B PolarisDX <Layout> — these pages have their own
 * slim consumer header/footer per the marketing wireframe brief.
 *
 * Draft status: copy, claims, imagery and pricing are placeholders pending
 * sign-off. See the <DraftBar />.
 */

import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'

// =============================================================================
// BUTTONS
// =============================================================================

type CTAVariant = 'solid' | 'outline' | 'light'

export function CTA({
  children,
  href = '#',
  variant = 'solid',
  internal = false,
}: {
  children: ReactNode
  href?: string
  variant?: CTAVariant
  /** Use react-router <Link> instead of <a> (for /consumer/* cross-links) */
  internal?: boolean
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors'
  const styles: Record<CTAVariant, string> = {
    solid: 'bg-[#0a2f55] text-white hover:bg-[#0c3c6e]',
    outline: 'border border-[#0a2f55] text-[#0a2f55] hover:bg-[#0a2f55] hover:text-white',
    light: 'bg-white text-[#0a2f55] hover:bg-slate-100',
  }
  const cls = `${base} ${styles[variant]}`
  return internal ? (
    <Link to={href} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {children}
    </a>
  )
}

// =============================================================================
// DRAFT NOTICE
// =============================================================================

export function DraftBar() {
  return (
    <div className="bg-amber-300 text-amber-950">
      <div className="mx-auto max-w-[1200px] px-6 py-2 text-center text-xs font-semibold">
        DRAFT WIREFRAME · Not for public release · Copy, claims, imagery &amp; pricing pending
        sign-off
      </div>
    </div>
  )
}

// =============================================================================
// HEADER
// =============================================================================

interface NavLink {
  label: string
  href: string
}

function Wordmark({ onDark = false }: { onDark?: boolean }) {
  return (
    <span className="text-xl tracking-tight">
      <span className={onDark ? 'font-extrabold text-white' : 'font-extrabold text-[#0a2f55]'}>
        POLARIS
      </span>
      <span className="font-extrabold text-[#2199ea]">DX</span>
    </span>
  )
}

export function ConsumerHeader({ nav, cta }: { nav: NavLink[]; cta: NavLink }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-4">
        <a href="#top" aria-label="PolarisDX">
          <Wordmark />
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-600"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <CTA href={cta.href}>{cta.label}</CTA>
      </div>
    </header>
  )
}

// =============================================================================
// HERO
// =============================================================================

export function Hero({
  eyebrow,
  title,
  sub,
  primary,
  secondary,
  imageLabel,
}: {
  eyebrow: string
  title: string
  sub: string
  primary: NavLink
  secondary: NavLink
  imageLabel: string
}) {
  return (
    <section
      id="top"
      className="border-b border-slate-200 bg-gradient-to-b from-white to-[#eef4f4]"
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-teal-600">
            {eyebrow}
          </div>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[#0a2f55] md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">{sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CTA href={primary.href}>{primary.label}</CTA>
            <CTA href={secondary.href} variant="outline">
              {secondary.label}
            </CTA>
          </div>
        </div>
        <ImageArea label={imageLabel} className="aspect-[4/3]" />
      </div>
    </section>
  )
}

// =============================================================================
// FACT / OFFER STRIP
// =============================================================================

export function FactStrip({ items }: { items: string[] }) {
  return (
    <div className="bg-[#0a2f55] text-white">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-3 gap-y-2 px-6 py-4 text-center text-sm font-medium">
        {items.map((it, i) => (
          <span key={i} className="flex items-center gap-3">
            {i > 0 && <span className="text-[#2199ea]">·</span>}
            {it}
          </span>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// SECTION WRAPPER
// =============================================================================

type Tone = 'light' | 'tint' | 'navy'

export function Section({
  id,
  eyebrow,
  title,
  lead,
  tone = 'light',
  children,
}: {
  id?: string
  eyebrow?: string
  title?: string
  lead?: string
  tone?: Tone
  children?: ReactNode
}) {
  const isNavy = tone === 'navy'
  const bg = tone === 'tint' ? 'bg-[#eef4f4]' : isNavy ? 'bg-[#0a2f55]' : 'bg-white'
  return (
    <section id={id} className={bg}>
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        {eyebrow && (
          <div
            className={
              isNavy
                ? 'text-sm font-semibold uppercase tracking-wide text-teal-300'
                : 'text-sm font-semibold uppercase tracking-wide text-teal-600'
            }
          >
            {eyebrow}
          </div>
        )}
        {title && (
          <h2
            className={
              isNavy
                ? 'mt-2 text-3xl font-bold text-white md:text-4xl'
                : 'mt-2 text-3xl font-bold text-[#0a2f55] md:text-4xl'
            }
          >
            {title}
          </h2>
        )}
        {lead && (
          <p
            className={
              isNavy
                ? 'mt-4 max-w-2xl text-lg leading-relaxed text-slate-300'
                : 'mt-4 max-w-2xl text-lg leading-relaxed text-slate-600'
            }
          >
            {lead}
          </p>
        )}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  )
}

// =============================================================================
// CONTENT PRIMITIVES
// =============================================================================

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

export function Grid({ cols = 3, children }: { cols?: 2 | 3 | 4; children: ReactNode }) {
  const map = {
    2: 'grid gap-6 md:grid-cols-2',
    3: 'grid gap-6 md:grid-cols-3',
    4: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-4',
  }
  return <div className={map[cols]}>{children}</div>
}

export function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((p, i) => (
        <span
          key={i}
          className="rounded-full bg-[#eef4f4] px-4 py-1.5 text-sm font-medium text-[#0a2f55]"
        >
          {p}
        </span>
      ))}
    </div>
  )
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-slate-700">
          <span
            aria-hidden
            className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700"
          >
            ✓
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

export function Steps({ items }: { items: { title: string; body: string }[] }) {
  return (
    <Grid cols={items.length === 4 ? 4 : 3}>
      {items.map((s, i) => (
        <Card key={i}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a2f55] text-sm font-bold text-white">
            {i + 1}
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[#0a2f55]">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
        </Card>
      ))}
    </Grid>
  )
}

export function ImageArea({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/70 p-6 text-center ${className}`}
    >
      <span className="text-sm font-medium text-slate-400">Image placeholder — {label}</span>
    </div>
  )
}

// =============================================================================
// FAQ (native <details> — SSR-safe, no JS hydration needed)
// =============================================================================

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {items.map((it, i) => (
        <details key={i} className="group px-6 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#0a2f55]">
            <span>{it.q}</span>
            <span
              aria-hidden
              className="flex-none text-xl leading-none text-teal-600 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 leading-relaxed text-slate-600">{it.a}</p>
        </details>
      ))}
    </div>
  )
}

// =============================================================================
// FINAL CTA
// =============================================================================

export function FinalCTA({
  id,
  title,
  body,
  primary,
  secondary,
  note,
}: {
  id?: string
  title: string
  body: string
  primary: NavLink
  secondary?: NavLink
  note?: string
}) {
  return (
    <section id={id} className="bg-[#0a2f55]">
      <div className="mx-auto max-w-[1200px] px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">{body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CTA href={primary.href} variant="light">
            {primary.label}
          </CTA>
          {secondary && (
            <a
              href={secondary.href}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {secondary.label}
            </a>
          )}
        </div>
        {note && <p className="mt-6 text-xs text-slate-400">{note}</p>}
      </div>
    </section>
  )
}

// =============================================================================
// FOOTER
// =============================================================================

export function ConsumerFooter({ disclaimer }: { disclaimer: string }) {
  return (
    <footer className="bg-[#072442] text-slate-300">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Wordmark onDark />
          <nav className="flex flex-wrap gap-6 text-sm">
            <a href="#" className="transition-colors hover:text-white">
              Contact
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Imprint
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Terms
            </a>
          </nav>
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-slate-400">{disclaimer}</p>
        <p className="mt-4 text-xs text-slate-500">
          © 2026 PolarisDX · Draft consumer landing page — content, claims and pricing to be
          confirmed before launch.
        </p>
      </div>
    </footer>
  )
}
