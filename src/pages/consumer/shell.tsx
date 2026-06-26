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

import { type ReactNode, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

import { Cluster, Grid } from '~/design-system'

import Reveal from '../../components/ui/Reveal'
import { trackConsumerCtaClick, type ConsumerPage } from './tracking'
import { useOrderModal } from './OrderModal'
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

type CTAVariant = 'navy' | 'outline-navy' | 'teal' | 'white' | 'outline-fg-on-dark'

export interface TrackingMeta {
  /** Human-readable label of the CTA, e.g. "Buy 12-pack". */
  label: string
  /** Which consumer page emitted the click. */
  page: ConsumerPage
  /** Where on the page the CTA sat, e.g. "hero" / "audience-card" / "final". */
  location?: string
}

interface CTAProps {
  children: ReactNode
  href?: string
  to?: string
  /** Click handler. If provided AND no `to`, the CTA renders as <button>. */
  onClick?: () => void
  variant?: CTAVariant
  size?: 'sm' | 'md'
  /** When set, fires a `consumer_cta_click` dataLayer event on click. */
  track?: TrackingMeta
}

export function CTA({
  children,
  href,
  to,
  onClick,
  variant = 'navy',
  size = 'md',
  track,
}: CTAProps) {
  const base =
    'inline-flex items-center justify-center gap-2 min-h-[var(--tap-target-min)] rounded-md font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-strong'
  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
  }
  const variants: Record<CTAVariant, string> = {
    navy: 'bg-brand-deep text-fg-on-dark hover:bg-brand-navy-hover shadow-1',
    'outline-navy':
      'bg-surface border border-brand-deep text-brand-deep hover:bg-brand-deep hover:text-fg-on-dark shadow-1',
    // teal-700 (accent-strong) statt teal-600: Weiß auf teal-600 = 3.74:1 (< AA);
    // teal-700 = 5.47:1, Hover teal-800 = 7.6:1 — WCAG 2.2 AA durchgängig (§2).
    teal: 'bg-accent-strong text-fg-on-dark hover:bg-accent-deep shadow-1',
    white: 'bg-surface text-brand-deep hover:bg-bg shadow-1',
    'outline-fg-on-dark': 'border border-fg-on-dark/60 text-fg-on-dark hover:bg-fg-on-dark/10',
  }
  const cls = `${base} ${sizes[size]} ${variants[variant]}`
  const handleClick = () => {
    if (track) trackConsumerCtaClick(track.label, track.page, track.location)
    if (onClick) onClick()
  }
  // GTM-friendly data attributes (so marketing can target with built-in
  // Click triggers without relying on the JS event push above).
  const dataAttrs = track
    ? {
        'data-gtm-event': 'consumer_cta_click',
        'data-gtm-cta': track.label,
        'data-gtm-page': track.page,
        ...(track.location ? { 'data-gtm-location': track.location } : {}),
      }
    : {}
  if (to) {
    return (
      <Link to={to} className={cls} onClick={handleClick} {...dataAttrs}>
        {children}
      </Link>
    )
  }
  // If a click handler is wired up (e.g. opens a modal), render as a real
  // <button> — semantically correct + no `#` URL bar pollution.
  if (onClick) {
    return (
      <button type="button" className={cls} onClick={handleClick} {...dataAttrs}>
        {children}
      </button>
    )
  }
  return (
    <a href={href ?? '#'} className={cls} onClick={handleClick} {...dataAttrs}>
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

export function ConsumerHeader({
  nav,
  cta,
  page,
}: {
  nav: NavLink[]
  cta: NavLink
  /** Which consumer page (for tracking the header CTA). */
  page: ConsumerPage
}) {
  const [open, setOpen] = useState(false)
  const orderModal = useOrderModal()

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  // If we're inside an OrderModalProvider, the header CTA opens the modal.
  // Otherwise it falls back to the anchor link (`cta.href`).
  const desktopClick = orderModal ? () => orderModal.open('header') : undefined
  const mobileClick = orderModal
    ? () => {
        setOpen(false)
        orderModal.open('header-mobile')
      }
    : undefined
  return (
    <header className="sticky top-0 z-30 bg-brand-deep shadow-1">
      <div className="mx-auto flex max-w-container items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-0 lg:py-4">
        <a href="#top" aria-label="PolarisDX" className="flex shrink-0 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
          <Wordmark />
        </a>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium text-fg-on-dark/90 md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-accent-on-dark rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]">
              {n.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <CTA
            href={cta.href}
            onClick={desktopClick}
            variant="teal"
            size="sm"
            track={{ label: cta.label, page, location: 'header' }}
          >
            {cta.label}
          </CTA>
        </div>

        {/* Mobile: hamburger toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="flex h-[var(--tap-target-min)] w-[var(--tap-target-min)] items-center justify-center rounded-md border border-fg-on-dark/15 text-fg-on-dark transition-colors hover:bg-fg-on-dark/10 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)] focus-visible:ring-offset-2"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="border-t border-fg-on-dark/10 bg-brand-deep md:hidden">
          <div className="mx-auto max-w-container px-4 py-4 sm:px-6">
            <nav className="flex flex-col gap-1">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-base font-medium text-fg-on-dark/90 transition-colors hover:bg-fg-on-dark/10 hover:text-accent-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]"
                >
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="mt-4">
              <CTA
                href={cta.href}
                onClick={mobileClick}
                variant="teal"
                size="sm"
                track={{ label: cta.label, page, location: 'header-mobile' }}
              >
                {cta.label}
              </CTA>
            </div>
          </div>
        </div>
      )}
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
  page,
  priceBadge,
  price,
}: {
  eyebrow: string
  title: string
  sub: ReactNode
  primary: NavLink
  secondary?: NavLink
  image?: { src?: string; alt: string; placeholder?: string }
  /** Which consumer page — wires the hero CTAs into the dataLayer. */
  page: ConsumerPage
  /** Optional inline badge rendered above the fold below the CTAs
   *  (e.g. a price-positioning pill). */
  priceBadge?: ReactNode
  /** Headline list price shown prominently between the CTAs and the badge.
   *  `amount` e.g. "169 €", `unit` e.g. "12-pack". */
  price?: { amount: string; unit: string }
}) {
  const orderModal = useOrderModal()
  // Hero primary CTA opens the order modal when available; falls back to
  // the anchor `primary.href` if no provider is wired up.
  const primaryClick = orderModal ? () => orderModal.open('hero') : undefined
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-surface to-bg">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-accent-border/30 blur-3xl"
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
              <p className="mb-4 text-xs font-semibold uppercase tracking-overline text-accent-strong">
                {eyebrow}
              </p>
              <h1 className="text-display font-bold tracking-headline text-fg-heading">{title}</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg">{sub}</p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <CTA
                  href={primary.href}
                  onClick={primaryClick}
                  variant="navy"
                  track={{ label: primary.label, page, location: 'hero' }}
                >
                  {primary.label}
                </CTA>
                {secondary && (
                  <CTA
                    href={secondary.href}
                    variant="outline-navy"
                    track={{ label: secondary.label, page, location: 'hero-secondary' }}
                  >
                    {secondary.label}
                  </CTA>
                )}
              </div>
              {price && (
                <p className="mt-8 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-brand-deep sm:text-4xl">
                    {price.amount}
                  </span>
                  <span className="text-sm text-fg-muted">· {price.unit}</span>
                </p>
              )}
              {priceBadge && <div className="mt-7">{priceBadge}</div>}
            </div>

            {/* Image · right (responsive: stacks below text on mobile) */}
            <div className="relative">
              {image?.src ? (
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="eager"
                  decoding="async"
                  className="mx-auto block aspect-[4/5] w-full max-w-md rounded-2xl object-cover shadow-3 lg:max-w-none"
                />
              ) : (
                <div className="mx-auto flex aspect-[4/5] w-full max-w-md items-center justify-center rounded-2xl border-2 border-dashed border-accent-on-dark/60 bg-surface p-8 text-center text-sm text-fg-muted lg:max-w-none">
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
    <div className="border-y border-[var(--color-border)] bg-surface">
      <div className="mx-auto flex max-w-container flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 py-5 text-center text-sm text-fg-heading sm:px-6 lg:px-0">
        {items.map((it, i) => (
          <span key={i} className="flex items-center gap-3">
            {i > 0 && (
              <span aria-hidden className="text-accent-line">
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
          className={`text-xs font-semibold uppercase tracking-overline ${
            onDark ? 'text-accent-on-dark' : 'text-accent-strong'
          }`}
        >
          {eyebrow}
        </p>
      )}
      {title && (
        <h2
          className={`text-3xl font-bold tracking-tight sm:text-4xl ${
            onDark ? 'text-fg-on-dark' : 'text-fg-heading'
          }`}
        >
          {title}
        </h2>
      )}
      {/* Teal underline accent — matches the brief's section-title style */}
      <span aria-hidden className="block h-[3px] w-12 rounded-full bg-accent-line" />
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
  const bg = tone === 'tint' ? 'bg-bg' : isDark ? 'bg-brand-deep' : 'bg-surface'

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
              isDark ? 'text-fg-on-dark/80' : 'text-fg'
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
    teal: 'before:bg-accent-line',
    navy: 'before:bg-brand-deep',
    green: 'before:bg-success',
    amber: 'before:bg-warning',
    none: '',
  }
  const accentClass =
    accent === 'none'
      ? ''
      : `relative pl-8 before:absolute before:left-3 before:top-6 before:bottom-6 before:w-1 before:rounded-full ${barColor[accent]}`
  return (
    <div
      className={`rounded-2xl border border-[var(--color-border)] bg-surface p-7 shadow-2 ${accentClass} ${className}`}
    >
      {children}
    </div>
  )
}

// Grid — re-exportiert das konsolidierte Design-System-Primitive (§1.8 / Holy
// Grail §Phase 7.8): genau eine Definition in `design-system/primitives-layout/
// grid.tsx`. Consumer-Pages importieren es weiterhin ueber diese Shell.
export { Grid }

export function Pills({ items }: { items: string[] }) {
  return (
    <Cluster gap={2}>
      {items.map((p, i) => (
        <span
          key={i}
          className="rounded-full border border-accent-border bg-accent-soft px-4 py-2 text-sm font-medium text-accent-deep"
        >
          {p}
        </span>
      ))}
    </Cluster>
  )
}

export function Steps({ items }: { items: { title: string; body: string }[] }) {
  const cols = (items.length === 4 ? 4 : items.length === 2 ? 2 : 3) as 2 | 3 | 4
  return (
    <Grid cols={cols}>
      {items.map((s, i) => (
        <Card key={i}>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-tint text-base font-bold text-accent-strong">
            {i + 1}
          </div>
          <h3 className="mt-5 text-xl font-semibold text-fg-heading">{s.title}</h3>
          <p className="mt-2 leading-relaxed text-fg">{s.body}</p>
        </Card>
      ))}
    </Grid>
  )
}

export function ImageArea({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-accent-on-dark/60 bg-accent-soft/40 p-8 text-center text-sm text-fg-muted ${className}`}
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
    <div className="mx-auto max-w-3xl rounded-2xl border border-accent-border/60 bg-accent-soft/60 p-8 text-center shadow-1">
      {title && <p className="text-base font-semibold text-fg-heading">{title}</p>}
      <div className="mt-2 leading-relaxed text-fg">{children}</div>
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
          className="group rounded-2xl border border-[var(--color-border)] bg-surface px-6 py-5 shadow-1 transition-shadow hover:shadow-2"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-left font-semibold text-fg-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-2">
            <span className="text-lg">{it.q}</span>
            <span
              aria-hidden
              className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent-tint text-xl leading-none text-accent-strong transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-4 leading-relaxed text-fg">{it.a}</p>
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
  page,
}: {
  id?: string
  title: string
  body: string
  primary: NavLink
  secondary?: NavLink
  note?: string
  /** Which consumer page — wires the final-CTA buttons into the dataLayer. */
  page: ConsumerPage
}) {
  const orderModal = useOrderModal()
  const primaryClick = orderModal ? () => orderModal.open('final') : undefined
  return (
    <section
      id={id}
      className="relative overflow-hidden bg-brand-deep py-20 text-fg-on-dark lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-line/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-0">
        <span
          aria-hidden
          className="mx-auto mb-6 block h-[3px] w-12 rounded-full bg-accent-bright"
        />
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-fg-on-dark/80">{body}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <CTA
            href={primary.href}
            onClick={primaryClick}
            variant="teal"
            track={{ label: primary.label, page, location: 'final' }}
          >
            {primary.label}
          </CTA>
          {secondary && (
            <CTA
              href={secondary.href}
              variant="outline-fg-on-dark"
              track={{ label: secondary.label, page, location: 'final-secondary' }}
            >
              {secondary.label}
            </CTA>
          )}
        </div>
        {note && <p className="mt-8 text-xs text-fg-on-dark/60">{note}</p>}
      </div>
    </section>
  )
}

// =============================================================================
// REGULATORY DISCLAIMER BAND
// =============================================================================
// Thin slate band rendered between the FinalCTA and the (shared) site Footer,
// to keep the product-specific food-supplement / cosmetic disclaimer text
// per the brief's claim rules. The site Footer is the original main-site
// Footer (imported on each page), not a custom one — see commit notes.

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <div className="border-t border-[var(--color-border)] bg-bg-subtle">
      <div className="mx-auto max-w-3xl px-4 py-8 text-center text-xs leading-relaxed text-fg-muted sm:px-6">
        {children}
      </div>
    </div>
  )
}
