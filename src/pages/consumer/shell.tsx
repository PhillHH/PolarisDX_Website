/**
 * Consumer landing page shell — bright premium wellbeing style per the brief
 *
 * Shared chrome + section primitives for the consumer-facing landing pages
 * (Vitamin D3+K2 Spray, Hydrating Masks, Inside-Out Care Duo).
 *
 * Visual language follows the PolarisDX Consumer Page Wireframe Brief
 * (slide 3 "Shared page style and build rules"):
 *   - bright, clean, premium healthcare/wellbeing
 *   - soft neutrals, navy headings, TEAL accents
 *   - real product imagery, clear pack size on every page
 *
 * Differs from the main polarisdx.net site (which is a darker B2B aesthetic)
 * by design — but reuses PolarisDX brand colours, logo and the consumer-
 * focused navigation/footer pattern. Marketing brief overrides main-site
 * styling where the two conflict.
 */

import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Linkedin, Instagram } from 'lucide-react'

import Reveal from '../../components/ui/Reveal'
import logoWhite from '../../assets/polaris_white.webp'

// =============================================================================
// TYPES
// =============================================================================

export interface NavLink {
  label: string
  href: string
}

type AccentBar = 'teal' | 'navy' | 'green' | 'amber' | 'none'

// =============================================================================
// BUTTONS — solid navy primary, outline navy secondary, teal for header
// =============================================================================

type CTAVariant = 'navy' | 'outline-navy' | 'teal' | 'white' | 'outline-white'

interface CTAProps {
  children: ReactNode
  href?: string
  to?: string
  variant?: CTAVariant
  size?: 'sm' | 'md'
}

export function CTA({ children, href, to, variant = 'navy', size = 'md' }: CTAProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500'
  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
  }
  const variants: Record<CTAVariant, string> = {
    navy: 'bg-brand-deep text-white hover:bg-[#0a4170] shadow-sm',
    'outline-navy':
      'bg-white border border-brand-deep text-brand-deep hover:bg-brand-deep hover:text-white shadow-sm',
    teal: 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm',
    white: 'bg-white text-brand-deep hover:bg-slate-50 shadow-sm',
    'outline-white': 'border border-white/60 text-white hover:bg-white/10',
  }
  const cls = `${base} ${sizes[size]} ${variants[variant]}`
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href ?? '#'} className={cls}>
      {children}
    </a>
  )
}

// =============================================================================
// LOGO WORDMARK (helper)
// =============================================================================

function Wordmark() {
  return (
    <img src={logoWhite} alt="PolarisDX" width={136} height={40} className="h-9 w-auto sm:h-10" />
  )
}

// =============================================================================
// HEADER — solid dark navy bar, white logo, teal CTA
// =============================================================================

export function ConsumerHeader({ nav, cta }: { nav: NavLink[]; cta: NavLink }) {
  return (
    <header className="sticky top-0 z-30 bg-brand-deep shadow-[0_2px_12px_rgba(8,51,88,0.18)]">
      <div className="mx-auto flex max-w-container items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-0 lg:py-4">
        <a href="#top" aria-label="PolarisDX" className="flex shrink-0 items-center">
          <Wordmark />
        </a>

        <nav className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium text-white/90 md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-teal-300">
              {n.label}
            </a>
          ))}
        </nav>

        <CTA href={cta.href} variant="teal" size="sm">
          {cta.label}
        </CTA>
      </div>
    </header>
  )
}

// =============================================================================
// HERO — bright/light, text left, product right, teal eyebrow, navy headline
// =============================================================================

export function Hero({
  eyebrow,
  title,
  sub,
  primary,
  secondary,
  image,
}: {
  eyebrow: string
  title: string
  sub: string
  primary: NavLink
  secondary?: NavLink
  image?: { src?: string; alt: string; placeholder?: string }
}) {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-secondary/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-container px-4 pt-16 pb-20 sm:px-6 lg:px-0 lg:pt-24 lg:pb-28">
        <Reveal width="100%" yOffset={20}>
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            {/* Text · left */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[1.6px] text-teal-700">
                {eyebrow}
              </p>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
                {title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">{sub}</p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <CTA href={primary.href} variant="navy">
                  {primary.label}
                </CTA>
                {secondary && (
                  <CTA href={secondary.href} variant="outline-navy">
                    {secondary.label}
                  </CTA>
                )}
              </div>
            </div>

            {/* Image · right */}
            <div className="relative">
              {image?.src ? (
                <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
                  <div
                    aria-hidden
                    className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-teal-100/60 via-white to-brand-secondary/10"
                  />
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="relative w-full rounded-2xl shadow-[0_20px_50px_rgba(8,51,88,0.18)]"
                  />
                </div>
              ) : (
                <div className="mx-auto flex aspect-[4/5] w-full max-w-sm items-center justify-center rounded-2xl border-2 border-dashed border-teal-300/60 bg-white p-8 text-center text-sm text-gray-500 lg:max-w-md">
                  Bildplatzhalter — {image?.placeholder ?? image?.alt}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// =============================================================================
// FACT / OFFER STRIP — light bar with teal divider dots
// =============================================================================

export function FactStrip({ items }: { items: string[] }) {
  return (
    <div className="border-y border-slate-200 bg-white">
      <div className="mx-auto flex max-w-container flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 py-5 text-center text-sm text-gray-900 sm:px-6 lg:px-0">
        {items.map((it, i) => (
          <span key={i} className="flex items-center gap-3">
            {i > 0 && (
              <span aria-hidden className="text-teal-500">
                ●
              </span>
            )}
            <span className="font-medium">{it}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// SECTION TITLE — navy headline with teal underline accent
// =============================================================================

function SectionTitle({
  eyebrow,
  title,
  align = 'center',
  onDark = false,
}: {
  eyebrow?: string
  title?: string
  align?: 'left' | 'center'
  onDark?: boolean
}) {
  const flex = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  return (
    <div className={`flex flex-col gap-3 ${flex}`}>
      {eyebrow && (
        <p
          className={`text-xs font-semibold uppercase tracking-[1.6px] ${
            onDark ? 'text-teal-300' : 'text-teal-700'
          }`}
        >
          {eyebrow}
        </p>
      )}
      {title && (
        <h2
          className={`text-3xl font-bold tracking-tight sm:text-4xl ${
            onDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {title}
        </h2>
      )}
      {/* Teal underline accent — matches the brief's section-title style */}
      <span aria-hidden className="block h-[3px] w-12 rounded-full bg-teal-500" />
    </div>
  )
}

// =============================================================================
// SECTION WRAPPER
// =============================================================================

type Tone = 'light' | 'tint' | 'dark'

export function Section({
  id,
  eyebrow,
  title,
  lead,
  tone = 'light',
  align = 'center',
  children,
}: {
  id?: string
  eyebrow?: string
  title?: string
  lead?: string
  tone?: Tone
  align?: 'left' | 'center'
  children?: ReactNode
}) {
  const isDark = tone === 'dark'
  const bg = tone === 'tint' ? 'bg-slate-50' : isDark ? 'bg-brand-deep' : 'bg-white'

  return (
    <section id={id} className={`${bg} py-20 lg:py-24`}>
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-0">
        {(eyebrow || title) && (
          <Reveal width="100%">
            <div className={align === 'left' ? '' : 'flex justify-center'}>
              <SectionTitle eyebrow={eyebrow} title={title} align={align} onDark={isDark} />
            </div>
          </Reveal>
        )}
        {lead && (
          <p
            className={`mt-6 max-w-3xl text-lg leading-relaxed ${
              isDark ? 'text-white/80' : 'text-gray-600'
            } ${align === 'center' ? 'mx-auto text-center' : ''}`}
          >
            {lead}
          </p>
        )}
        {children && (
          <div className="mt-12 lg:mt-16">
            <Reveal width="100%">{children}</Reveal>
          </div>
        )}
      </div>
    </section>
  )
}

// =============================================================================
// CONTENT PRIMITIVES
// =============================================================================

/**
 * Card with optional coloured left accent bar — matches the "ingredient
 * architecture" card style on slide 13 of the brief.
 */
export function Card({
  children,
  className = '',
  accent = 'none',
}: {
  children: ReactNode
  className?: string
  accent?: AccentBar
}) {
  const barColor: Record<AccentBar, string> = {
    teal: 'before:bg-teal-500',
    navy: 'before:bg-brand-deep',
    green: 'before:bg-emerald-500',
    amber: 'before:bg-amber-400',
    none: '',
  }
  const accentClass =
    accent === 'none'
      ? ''
      : `relative pl-8 before:absolute before:left-3 before:top-6 before:bottom-6 before:w-1 before:rounded-full ${barColor[accent]}`
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_10px_30px_rgba(8,51,88,0.08)] ${accentClass} ${className}`}
    >
      {children}
    </div>
  )
}

export function Grid({ cols = 3, children }: { cols?: 2 | 3 | 4; children: ReactNode }) {
  const map = {
    2: 'grid gap-6 sm:grid-cols-2',
    3: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
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
          className="rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-800"
        >
          {p}
        </span>
      ))}
    </div>
  )
}

export function Steps({ items }: { items: { title: string; body: string }[] }) {
  const cols = (items.length === 4 ? 4 : items.length === 2 ? 2 : 3) as 2 | 3 | 4
  return (
    <Grid cols={cols}>
      {items.map((s, i) => (
        <Card key={i}>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-base font-bold text-teal-700">
            {i + 1}
          </div>
          <h3 className="mt-5 text-xl font-semibold text-gray-900">{s.title}</h3>
          <p className="mt-2 leading-relaxed text-gray-600">{s.body}</p>
        </Card>
      ))}
    </Grid>
  )
}

export function ImageArea({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-teal-300/60 bg-teal-50/40 p-8 text-center text-sm text-gray-500 ${className}`}
    >
      Bildplatzhalter — {label}
    </div>
  )
}

// =============================================================================
// CALLOUT BOX — light mint card (matches the brief's "core message" card)
// =============================================================================

export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-teal-200/60 bg-teal-50/60 p-8 text-center shadow-sm">
      {title && <p className="text-base font-semibold text-gray-900">{title}</p>}
      <div className="mt-2 leading-relaxed text-gray-700">{children}</div>
    </div>
  )
}

// =============================================================================
// FAQ — native <details>, SSR-safe
// =============================================================================

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((it, i) => (
        <details
          key={i}
          className="group rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition-shadow hover:shadow-[0_10px_30px_rgba(8,51,88,0.08)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-gray-900">
            <span className="text-lg">{it.q}</span>
            <span
              aria-hidden
              className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-teal-100 text-xl leading-none text-teal-700 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-4 leading-relaxed text-gray-600">{it.a}</p>
        </details>
      ))}
    </div>
  )
}

// =============================================================================
// FINAL CTA — dark navy closing band with teal accent (matches brief slide 18)
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
    <section id={id} className="relative overflow-hidden bg-brand-deep py-20 text-white lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-0">
        <span aria-hidden className="mx-auto mb-6 block h-[3px] w-12 rounded-full bg-teal-400" />
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">{body}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <CTA href={primary.href} variant="teal">
            {primary.label}
          </CTA>
          {secondary && (
            <CTA href={secondary.href} variant="outline-white">
              {secondary.label}
            </CTA>
          )}
        </div>
        {note && <p className="mt-8 text-xs text-white/60">{note}</p>}
      </div>
    </section>
  )
}

// =============================================================================
// FOOTER — slim, brand-primary background
// =============================================================================

export function ConsumerFooter({ disclaimer }: { disclaimer: string }) {
  return (
    <footer className="bg-brand-primary text-white">
      <div className="mx-auto max-w-container px-4 py-16 sm:px-6 lg:px-0">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm space-y-4">
            <Wordmark />
            <p className="text-sm text-white/70">Simple daily wellbeing products from PolarisDX.</p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/polarisdx/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-white transition-colors hover:text-teal-300"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/polaris_diagnostix/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-white transition-colors hover:text-teal-300"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/70">
            <Link to="/imprint" className="transition-colors hover:text-white">
              Imprint
            </Link>
            <Link to="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link to="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-12 border-t border-white/15 pt-8 text-xs leading-relaxed text-white/60">
          <p className="max-w-3xl">{disclaimer}</p>
          <p className="mt-3">
            © {new Date().getFullYear()} PolarisDX · Draft consumer landing page — content, claims
            and pricing to be confirmed before launch.
          </p>
        </div>
      </div>
    </footer>
  )
}
