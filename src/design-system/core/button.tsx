import * as React from 'react'
import { Link } from 'react-router-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Button — Atom (§Phase 2.2).
 *
 * Single Source of Truth fuer alle Buttons (Holy Grail §Phase 7.8): App und
 * Pattern-Library importieren diese eine Definition. Token-rein (§1.7) — keine
 * Rohwerte/arbitrary-px, nur Component-/Semantic-Tokens (`--button-*`,
 * `--color-*`). Varianten/Sizes/States ausschliesslich ueber orthogonale Props,
 * niemals ueber Kopien (§Phase 2.2). Alle Interaktions-States als Properties:
 * default/hover/focus-visible/active/disabled. Tap-Target >=44px (§1.11) via
 * `--button-min-height`.
 */
const button = cva(
  'inline-flex items-center justify-center gap-2 font-semibold tracking-tight ' +
    'rounded-[var(--button-radius)] min-h-[var(--button-min-height)] ' +
    'transition-colors duration-[var(--duration-base)] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'focus-visible:ring-[var(--color-focus-ring)] ' +
    'disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none',
  {
    variants: {
      variant: {
        // Solid Navy — dominante Aktion (§3.1 Primary = Brand, nur Aktion/Focus).
        primary:
          'bg-[var(--button-primary-bg)] text-[var(--button-primary-fg)] shadow-1 ' +
          'hover:bg-[var(--button-primary-bg-hover)] active:bg-[var(--button-primary-bg-hover)]',
        // Line/Ghost — sekundaere Aktion auf hellem Grund (§3.1 Secondary).
        secondary:
          'border border-[var(--color-border)] bg-surface text-fg ' +
          'hover:bg-bg-subtle active:bg-bg-subtle',
        // Outline auf dunklem Grund (Hero/Navy-Header) — weisse Schrift/Border.
        outline:
          'border border-[var(--color-fg-on-dark)] bg-transparent text-fg-on-dark ' +
          'hover:bg-[rgb(var(--color-fg-on-dark-rgb)/0.1)] ' +
          'active:bg-[rgb(var(--color-fg-on-dark-rgb)/0.1)]',
      },
      size: {
        default: 'px-8 py-4 text-base',
        sm: 'px-6 py-3 text-sm',
        lg: 'px-10 py-5 text-lg',
        icon: 'h-[var(--button-min-height)] w-[var(--button-min-height)] p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {
  /** Interner Router-Link (rendert `<Link>`). */
  to?: string
  /** Externer/absoluter Link (rendert `<a>`). */
  href?: string
}

/**
 * Polymorph: `to` -> React-Router-`<Link>`, `href` -> `<a>`, sonst `<button>`.
 * Die Variant/Size/State-Logik bleibt fuer alle drei identisch (eine Quelle).
 */
export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, to, href, ...props }, ref) => {
    const Component: React.ElementType = to ? Link : href ? 'a' : 'button'
    const linkProps = to ? { to } : href ? { href } : {}
    return (
      <Component
        ref={ref}
        className={cn(button({ variant, size }), className)}
        {...linkProps}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
