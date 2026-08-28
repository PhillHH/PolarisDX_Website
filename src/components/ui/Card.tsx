import * as React from 'react'
import { Link } from 'react-router-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Card — die eine Kartenflaeche der Sales-Machine.
 *
 * Das Rezept ist aus dem Bestand uebernommen (Diagnostik-/Igloo-Karten):
 * `rounded-xl border bg-white`, Hover-Lift nur dort, wo die Karte wirklich
 * fuehrt. `ui-border` (#e2e8f0) ist hier korrekt — ein Kartenrand ist Dekor,
 * keine Begrenzung eines Bedienelements (DESIGN-SYSTEM-CONTRACT §3.4).
 *
 * INTERAKTIV vs. STATISCH ist eine Verhaltensfrage, keine Stilfrage:
 * - `to`/`href` gesetzt  -> die ganze Karte ist EIN Link, bekommt Hover-Lift
 *   und einen sichtbaren Fokusring.
 * - sonst                -> reine Flaeche, KEIN Hover-Effekt, kein Fokus.
 *
 * Damit gibt es keine Karte, die aussieht wie ein Bedienelement, ohne eines zu
 * sein — und keine, die fuehrt, ohne per Tastatur erreichbar zu sein.
 *
 * Fachliche Kartentypen (ServiceCard, BlogCard, Befund-Karten) werden bewusst
 * NICHT zwanghaft hierauf vereinheitlicht; sie duerfen diese Karte nutzen,
 * muessen es aber nicht.
 */
const cardVariants = cva('rounded-xl border border-ui-border bg-white', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-4',
      default: 'p-7',
      lg: 'p-8',
    },
    interactive: {
      // Der Hover ist der im Bestand DOMINANTE: nur der Lift. `hover:shadow-card`
      // kommt repo-weit nur 2x vor, der reine Lift 16x — die Komponente folgt
      // der gemessenen Mehrheit, nicht der Annahme. Neu ist allein der
      // Fokusring: eine anklickbare Karte fiel bisher auf den UA-Standardring
      // zurueck statt auf den des Design-Systems.
      true: 'transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
      false: '',
    },
  },
  defaultVariants: {
    padding: 'default',
    interactive: false,
  },
})

type CardOwnProps = {
  /** Interne Route — macht die ganze Karte zu einem Link. */
  to?: string
  /** Externe URL — macht die ganze Karte zu einem Link. */
  href?: string
  children?: React.ReactNode
  className?: string
} & Omit<VariantProps<typeof cardVariants>, 'interactive'>

export type CardProps = CardOwnProps &
  Omit<React.HTMLAttributes<HTMLElement>, keyof CardOwnProps | 'children'>

const isExternal = (href: string) => /^(https?:)?\/\//i.test(href) || href.startsWith('mailto:')

export const Card = React.forwardRef<HTMLElement, CardProps>(
  ({ className, padding, to, href, children, ...props }, ref) => {
    const interactive = Boolean(to || href)
    const classes = cn(cardVariants({ padding, interactive }), 'flex h-full flex-col', className)

    if (to) {
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          to={to}
          className={cn('group', classes)}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      )
    }

    if (href) {
      const external = isExternal(href)
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cn('group', classes)}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      )
    }

    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className={classes} {...props}>
        {children}
      </div>
    )
  },
)
Card.displayName = 'Card'
