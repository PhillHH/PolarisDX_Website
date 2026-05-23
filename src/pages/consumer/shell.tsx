/**
 * Consumer landing page shell — main-site design, product-focused chrome
 *
 * Shared chrome + section primitives for the consumer-facing landing pages
 * (Vitamin D3+K2 Spray, Hydrating Masks, Inside-Out Care Duo).
 *
 * Reuses the main polarisdx.net design system:
 * - brand colors (brand-primary / brand-deep / brand-secondary)
 * - the real <Button>, <SectionHeader> and <Reveal> components
 * - the fixed dark-on-scroll header style from the main Header
 * - the brand-primary footer treatment
 *
 * Differs from the main site only in navigation: header links and footer
 * links are product-focused (Wireframe brief), no B2B / Diagnostik menu.
 */

import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Linkedin, Instagram } from 'lucide-react'

import { Button } from '../../components/ui/Button'
import SectionHeader from '../../components/ui/SectionHeader'
import Reveal from '../../components/ui/Reveal'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import logoWhite from '../../assets/polaris_white.webp'

// =============================================================================
// TYPES
// =============================================================================

export interface NavLink {
  label: string
  href: string
}

// =============================================================================
// HEADER — fixed, transparent over hero, dark backdrop on scroll
// =============================================================================

export function ConsumerHeader({ nav, cta }: { nav: NavLink[]; cta: NavLink }) {
  const scrollY = useScrollPosition()
  const isScrolled = scrollY > 24

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-all duration-500 ease-in-out ${
        isScrolled
          ? 'border-b border-white/5 bg-[#083358]/85 shadow-[0_4px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-container items-center justify-between px-4 py-3 sm:px-6 lg:px-0 lg:py-4">
        <a href="#top" aria-label="PolarisDX" className="flex shrink-0 items-center gap-3">
          <img
            src={logoWhite}
            alt="PolarisDX"
            width={136}
            height={40}
            className="h-10 w-auto transition-all duration-300 sm:h-12"
          />
        </a>

        {/* Desktop nav (anchor links into the page) */}
        <nav className="hidden flex-wrap items-center gap-8 text-sm font-medium tracking-wide text-white md:flex xl:gap-12">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="flex items-center gap-1 text-white transition-all duration-300 hover:opacity-70"
            >
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100">
                {n.label}
              </span>
            </a>
          ))}
        </nav>

        <div className={`${isScrolled ? '' : 'shadow-lg shadow-blue-900/20'} rounded-full`}>
          <Button
            href={cta.href}
            variant={isScrolled ? 'primary' : 'outline'}
            size="sm"
            className={
              isScrolled
                ? 'shadow-lg shadow-blue-500/25'
                : 'border-white/40 hover:border-white hover:bg-white/10'
            }
          >
            {cta.label}
          </Button>
        </div>
      </div>
    </header>
  )
}

// =============================================================================
// HERO — dark, gradient, text-left / image-right
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
    <section
      id="top"
      className="relative overflow-hidden bg-brand-deep pt-32 pb-20 text-white lg:pt-40 lg:pb-28"
    >
      {/* Decorative radial gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(33,153,234,0.28),transparent_55%),radial-gradient(circle_at_bottom_left,rgba(15,95,149,0.4),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/20 to-transparent opacity-10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/20 to-transparent opacity-10"
      />

      <div className="relative mx-auto max-w-container px-4 sm:px-6 lg:px-0">
        <Reveal width="100%" yOffset={20}>
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[1.2px] text-brand-secondary">
                {eyebrow}
              </p>
              <h1 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                {title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                {sub}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button href={primary.href} variant="primary" size="sm">
                  {primary.label}
                </Button>
                {secondary && (
                  <Button href={secondary.href} variant="outline" size="sm">
                    {secondary.label}
                  </Button>
                )}
              </div>
            </div>

            <div>
              {image?.src ? (
                <img
                  src={image.src}
                  alt={image.alt}
                  className="mx-auto w-full max-w-sm rounded-2xl shadow-2xl lg:max-w-md"
                />
              ) : (
                <div className="mx-auto flex aspect-[4/5] w-full max-w-sm items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-8 text-center text-sm text-white/60 lg:max-w-md">
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
// FACT / OFFER STRIP — light band directly under the hero
// =============================================================================

export function FactStrip({ items }: { items: string[] }) {
  return (
    <div className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-container flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-5 text-center text-sm text-gray-900 sm:px-6 lg:px-0">
        {items.map((it, i) => (
          <span key={i} className="flex items-center gap-4">
            {i > 0 && (
              <span aria-hidden className="text-brand-primary/40">
                •
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
// SECTION WRAPPER — uses real SectionHeader on light/tint, custom on dark
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
    <section id={id} className={`${bg} py-20 lg:py-28`}>
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-0">
        {(eyebrow || title) && (
          <Reveal width="100%">
            <div className={align === 'left' ? '' : 'flex justify-center'}>
              {!isDark ? (
                <SectionHeader caption={eyebrow ?? ''} title={title ?? ''} align={align} />
              ) : (
                <div
                  className={`flex flex-col gap-3 ${
                    align === 'center' ? 'items-center text-center' : 'items-start text-left'
                  }`}
                >
                  <span className="inline-block rounded bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                    {eyebrow}
                  </span>
                  <h2 className="text-hero-sm font-medium tracking-tight text-white lg:text-[44px] lg:leading-[52px]">
                    {title}
                  </h2>
                </div>
              )}
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

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-section border border-slate-100 bg-white p-8 shadow-card ${className}`}
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
          className="rounded-full border border-brand-primary/20 bg-brand-primary/5 px-4 py-2 text-sm font-medium text-brand-deep"
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
          <div className="inline-block rounded p-px bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-deep">
            <div className="flex h-11 w-11 items-center justify-center rounded-[3px] bg-white text-lg font-semibold text-brand-deep">
              {i + 1}
            </div>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-900">{s.title}</h3>
          <p className="mt-3 leading-relaxed text-gray-600">{s.body}</p>
        </Card>
      ))}
    </Grid>
  )
}

export function ImageArea({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-section border-2 border-dashed border-brand-primary/25 bg-brand-primary/5 p-8 text-center text-sm text-gray-500 ${className}`}
    >
      Bildplatzhalter — {label}
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
          className="group rounded-section border border-slate-200 bg-white px-6 py-5 shadow-sm transition-shadow hover:shadow-card"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium text-gray-900">
            <span className="text-lg">{it.q}</span>
            <span
              aria-hidden
              className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-primary/10 text-xl leading-none text-brand-primary transition-transform group-open:rotate-45"
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
// FINAL CTA — dark closing band
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
    <section id={id} className="relative overflow-hidden bg-brand-deep py-20 text-white lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(33,153,234,0.22),transparent_60%)]"
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-0">
        <h2 className="text-hero-sm font-medium tracking-tight lg:text-[44px] lg:leading-[52px]">
          {title}
        </h2>
        <p className="mt-6 text-lg text-white/80">{body}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href={primary.href} variant="primary" size="sm">
            {primary.label}
          </Button>
          {secondary && (
            <Button href={secondary.href} variant="outline" size="sm">
              {secondary.label}
            </Button>
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
            <img src={logoWhite} alt="PolarisDX" width={136} height={40} className="h-10 w-auto" />
            <p className="text-sm text-white/70">Simple daily wellbeing products from PolarisDX.</p>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/polarisdx/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-white transition-colors hover:text-brand-secondary"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/polaris_diagnostix/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-white transition-colors hover:text-brand-secondary"
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
