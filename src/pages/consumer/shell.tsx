/**
 * Consumer landing page shell — bright premium wellbeing style per the brief
 *
 * Shared chrome + section primitives for the consumer-facing landing pages
 * (Vitamin D3+K2 Spray, Hydrating Masks, Inside-Out Care Duo).
 *
 * Visual language follows the PolarisDX Consumer Page Wireframe Brief
 * (slide 3"Shared page style and build rules"):
 *   - bright, clean, premium healthcare/wellbeing
 *   - soft neutrals, navy headings, TEAL accents
 *   - real product imagery, clear pack size on every page
 *
 * Differs from the main polarisdx.net site (which is a darker B2B aesthetic)
 * by design — but reuses PolarisDX brand colours, logo and the consumer-
 * focused navigation/footer pattern. Marketing brief overrides main-site
 * styling where the two conflict.
 */

import { type ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import Reveal from '../../components/ui/Reveal'
import ImagePlaceholder from '../../components/ui/ImagePlaceholder'
import LanguageSwitcher from '../../components/ui/LanguageSwitcher'
import { cn } from '../../lib/utils'
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

type AccentBar = 'teal' | 'navy' | 'green' | 'blue' | 'none'

// =============================================================================
// BUTTONS — solid navy primary, outline navy secondary, teal for header
// =============================================================================

type CTAVariant = 'navy' | 'outline-navy' | 'teal' | 'white' | 'outline-white'

export interface TrackingMeta {
  /** Human-readable label of the CTA, e.g."Buy 12-pack". */
  label: string
  /** Which consumer page emitted the click. */
  page: ConsumerPage
  /** Where on the page the CTA sat, e.g."hero" /"audience-card" /"final". */
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
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-line'
  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
  }
  const variants: Record<CTAVariant, string> = {
    navy: 'bg-brand-deep text-white hover:bg-brand-navy-hover ',
    'outline-navy':
      'bg-white border border-brand-deep text-brand-deep hover:bg-brand-deep hover:text-white ',
    teal: 'bg-accent-strong text-white hover:brightness-110 ',
    white: 'bg-white text-brand-deep hover:bg-slate-50 ',
    'outline-white': 'border border-white/60 text-white hover:bg-white/10',
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
  const { t } = useTranslation('consumer')
  return (
    <img
      src={logoWhite}
      alt={t('shell.copy_001')}
      width={136}
      height={40}
      className="h-9 w-auto sm:h-10"
    />
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
  const { t } = useTranslation('consumer')
  const [open, setOpen] = useState(false)
  const orderModal = useOrderModal()
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
    <header className="sticky top-0 z-30 bg-brand-deep shadow-[0_2px_12px_rgba(8,51,88,0.18)]">
      <div className="mx-auto flex max-w-container items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-0 lg:py-4">
        <a href="#top" aria-label={t('shell.copy_001')} className="flex shrink-0 items-center">
          <Wordmark />
        </a>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium text-white/90 md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-accent-on-dark">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 text-white">
          <LanguageSwitcher isMobile />

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
            aria-label={open ? t('shell.close_menu') : t('shell.open_menu')}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-white transition-colors hover:bg-white/10 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="border-t border-white/10 bg-brand-deep md:hidden">
          <div className="mx-auto max-w-container px-4 py-4 sm:px-6">
            <nav className="flex flex-col gap-1">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-base font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-accent-on-dark"
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
  highlights,
  floatingStat,
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
   *  `amount` e.g."169 €", `unit` e.g."12-pack". */
  price?: { amount: string; unit: string }
  /** Short teal-check reassurance items shown under the CTAs (trust signals). */
  highlights?: string[]
  /** Floating stat card overlapping the product image (e.g."71 · doses / bottle"). */
  floatingStat?: { value: string; label: string }
}) {
  const { t } = useTranslation('consumer')
  const orderModal = useOrderModal()
  // Hero primary CTA opens the order modal when available; falls back to
  // the anchor `primary.href` if no provider is wired up.
  const primaryClick = orderModal ? () => orderModal.open('hero') : undefined
  return (
    <section id="top" className="relative overflow-hidden bg-white">
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
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
            {/* Text · left */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                {eyebrow}
              </p>
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-heading sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
                {title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">{sub}</p>
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
              {highlights && highlights.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                  {highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700"
                    >
                      <Check
                        className="h-4 w-4 flex-none text-accent"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
              {price && (
                <p className="mt-8 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight text-brand-deep sm:text-4xl">
                    {price.amount}
                  </span>
                  <span className="text-sm text-gray-500">· {price.unit}</span>
                </p>
              )}
              {priceBadge && <div className="mt-7">{priceBadge}</div>}
            </div>

            {/* Image · right (responsive: stacks below text on mobile) */}
            <div className="relative">
              {image?.src ? (
                <div className="group relative mx-auto w-full max-w-md overflow-visible rounded-2xl lg:max-w-none">
                  <div className="overflow-hidden rounded-2xl ring-1 ring-brand-deep/5">
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="eager"
                      decoding="async"
                      className="block w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                  {floatingStat && (
                    <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-3.5 shadow-[0_16px_40px_rgba(8,51,88,0.18)] sm:-left-6">
                      <span className="text-2xl font-semibold tracking-tight text-brand-deep sm:text-3xl">
                        {floatingStat.value}
                      </span>
                      <span className="max-w-[7.5rem] text-xs font-medium leading-tight text-gray-500">
                        {floatingStat.label}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <ImagePlaceholder
                  label={image?.placeholder ?? t('shell.image_placeholder')}
                  className="mx-auto aspect-[4/5] w-full max-w-md rounded-2xl border-accent-on-dark/60 bg-accent-soft/40 p-7 text-accent-strong lg:max-w-none"
                />
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
      <div className="mx-auto flex max-w-container flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 py-5 text-center text-sm text-heading sm:px-6 lg:px-0">
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
          className={`text-xs font-semibold uppercase tracking-[0.16em] ${
            onDark ? 'text-accent-on-dark' : 'text-accent-strong'
          }`}
        >
          {eyebrow}
        </p>
      )}
      {title && (
        <h2
          className={`text-3xl font-semibold tracking-tight sm:text-4xl ${
            onDark ? 'text-white' : 'text-heading'
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
  const bg = tone === 'tint' ? 'bg-slate-50' : isDark ? 'bg-brand-deep' : 'bg-white'

  return (
    <section id={id} className={`${bg} py-24`}>
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
 * Card with optional coloured left accent bar — matches the"ingredient
 * architecture" card style on slide 13 of the brief.
 */
export function Card({
  children,
  className = '',
  accent = 'none',
  hover = false,
}: {
  children: ReactNode
  className?: string
  accent?: AccentBar
  /** Enables the premium hover-lift (translate + card shadow + teal border). */
  hover?: boolean
}) {
  const barColor: Record<AccentBar, string> = {
    teal: 'before:bg-accent-line',
    navy: 'before:bg-brand-deep',
    green: 'before:bg-success',
    blue: 'before:bg-brand-primary',
    none: '',
  }
  const accentClass =
    accent === 'none'
      ? ''
      : `relative pl-8 before:absolute before:left-3 before:top-6 before:bottom-6 before:w-1 before:rounded-full ${barColor[accent]}`
  // Motion only: instant (no transform) under prefers-reduced-motion.
  const hoverClass = hover
    ? 'transition duration-200 will-change-transform hover:-translate-y-1 hover:border-accent-border  motion-reduce:transition-none motion-reduce:hover:translate-y-0'
    : ''
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-100 bg-white p-7 ',
        hoverClass,
        accentClass,
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * IconTile — soft teal-tint square that fronts a lucide icon on content cards.
 * Decorative: always `aria-hidden` (the card heading carries the meaning).
 */
export function IconTile({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden
      className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent-strong ring-1 ring-accent/15"
    >
      {children}
    </span>
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

export function Pills({ items, onDark = false }: { items: string[]; onDark?: boolean }) {
  const cls = onDark
    ? 'rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-sm'
    : 'rounded-full border border-accent-border bg-accent-soft px-4 py-2 text-sm font-medium text-accent-strong'
  return (
    <div className={`flex flex-wrap gap-2 ${onDark ? 'justify-center' : ''}`}>
      {items.map((p, i) => (
        <span key={i} className={cls}>
          {p}
        </span>
      ))}
    </div>
  )
}

/**
 * Stats — a bright band of large teal numbers with labels. Re-presents the
 * key product facts as a scannable"at a glance" strip. Works on light or
 * tinted section backgrounds (used as <Section> children).
 */
export function Stats({ items }: { items: { value: string; label: string }[] }) {
  const cols =
    items.length === 4
      ? 'sm:grid-cols-2 lg:grid-cols-4'
      : items.length === 2
        ? 'sm:grid-cols-2'
        : 'sm:grid-cols-3'
  return (
    <div className={`grid gap-4 ${cols}`}>
      {items.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-slate-100 bg-white p-7 text-center transition duration-200 hover:-translate-y-1 hover:border-accent-border motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          <p className="text-3xl font-semibold tracking-tight text-brand-deep sm:text-4xl">
            {s.value}
          </p>
          <p className="mt-2 text-sm font-medium leading-snug text-gray-500">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

export function Steps({ items }: { items: { title: string; body: string }[] }) {
  const cols = (items.length === 4 ? 4 : items.length === 2 ? 2 : 3) as 2 | 3 | 4
  return (
    <Grid cols={cols}>
      {items.map((s, i) => (
        <Card key={i} hover className="flex h-full flex-col">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-strong text-base font-semibold text-white ring-4 ring-accent/15">
            {i + 1}
          </div>
          <h3 className="mt-5 text-xl font-semibold text-heading">{s.title}</h3>
          <p className="mt-2 leading-relaxed text-gray-600">{s.body}</p>
        </Card>
      ))}
    </Grid>
  )
}

export function ImageArea({ label, className = '' }: { label: string; className?: string }) {
  return (
    <ImagePlaceholder
      label={label}
      className={`rounded-2xl border-accent-on-dark/60 bg-accent-soft/40 p-8 text-accent-strong ${className}`}
    />
  )
}

// =============================================================================
// CALLOUT BOX — light mint card (matches the brief's"core message" card)
// =============================================================================

export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-accent-border/60 bg-accent-soft/60 p-7 text-center">
      {title && <p className="text-base font-semibold text-heading">{title}</p>}
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
          className="group rounded-2xl border border-slate-200 bg-white px-6 py-5 transition-shadow"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-heading">
            <span className="text-lg">{it.q}</span>
            <span
              aria-hidden
              className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent/15 text-xl leading-none text-accent-strong transition-transform group-open:rotate-45"
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
  assurances,
  page,
}: {
  id?: string
  title: string
  body: string
  primary: NavLink
  secondary?: NavLink
  note?: string
  /** Teal-check reassurance chips (friction-killers) shown under the CTAs. */
  assurances?: string[]
  /** Which consumer page — wires the final-CTA buttons into the dataLayer. */
  page: ConsumerPage
}) {
  const orderModal = useOrderModal()
  const primaryClick = orderModal ? () => orderModal.open('final') : undefined
  return (
    <section id={id} className="relative overflow-hidden bg-brand-deep py-20 text-white lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-line/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-0">
        <span
          aria-hidden
          className="mx-auto mb-6 block h-[3px] w-12 rounded-full bg-accent-on-dark"
        />
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">{body}</p>
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
              variant="outline-white"
              track={{ label: secondary.label, page, location: 'final-secondary' }}
            >
              {secondary.label}
            </CTA>
          )}
        </div>
        {assurances && assurances.length > 0 && (
          <ul className="mt-9 flex flex-wrap justify-center gap-2.5">
            {assurances.map((a) => (
              <li
                key={a}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90"
              >
                <Check
                  className="h-4 w-4 flex-none text-accent-on-dark"
                  strokeWidth={2.5}
                  aria-hidden
                />
                {a}
              </li>
            ))}
          </ul>
        )}
        {note && <p className="mt-8 text-xs text-white/60">{note}</p>}
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
    <div className="border-t border-slate-200 bg-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-8 text-center text-xs leading-relaxed text-gray-500 sm:px-6">
        {children}
      </div>
    </div>
  )
}
