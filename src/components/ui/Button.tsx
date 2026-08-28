import * as React from 'react'
import { Link } from 'react-router-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * Button — Schaltflaeche und Handlungslink auf einer Mechanik.
 *
 * Das Element folgt der Absicht, nicht dem Aussehen:
 *   `to`   -> <Link>  (interne Route)
 *   `href` -> <a>     (externes Ziel oder Anker)
 *   sonst  -> <button>
 * Eine Schaltflaeche, die navigiert, waere weder mit der Tastatur noch mit
 * dem Kontextmenue benutzbar — deshalb diese Trennung.
 *
 * Die drei Bestandsvarianten `primary`/`secondary`/`outline` sind unveraendert;
 * `primary` behaelt ihr Zwei-Schichten-Rendering (aeussere Flaeche als Rand,
 * innerer weisser Layer). `ghost` ist neu fuer textnahe Sekundaeraktionen.
 *
 * TOUCH TARGET: alle Groessen liegen bei >= 44px Hoehe (WCAG 2.5.8).
 * `sm` kommt ueber `min-h-[44px]` dorthin, ohne optisch zu wachsen;
 * `icon` ist 44x44.
 *
 * LOADING: `loading` setzt `aria-busy`, blendet einen Spinner ein und
 * deaktiviert die Schaltflaeche. Der Text bleibt stehen — eine Schaltflaeche,
 * die beim Laden ihre Beschriftung verliert, verliert auch ihren
 * zugaenglichen Namen.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-deep text-brand-deep border-0 hover:opacity-95 focus-visible:ring-brand-primary',
        secondary: 'bg-brand-deep text-white hover:bg-brand-deep/90 focus-visible:ring-brand-deep',
        outline:
          'border border-white/80 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white',
        ghost:
          'bg-transparent text-brand-deep hover:bg-gray-50 focus-visible:ring-brand-primary border-0',
      },
      size: {
        default: 'min-h-[44px] px-8 py-4 text-base',
        sm: 'min-h-[44px] px-6 py-3 text-sm',
        lg: 'min-h-[44px] px-10 py-5 text-lg',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Interne Route — rendert einen <Link>. */
  to?: string
  /** Externe URL oder Anker — rendert ein <a>. */
  href?: string
  /** Laedt: Spinner, `aria-busy`, nicht ausloesbar. */
  loading?: boolean
  /**
   * Pflicht bei reinen Icon-Schaltflaechen: der zugaengliche Name.
   * Ohne ihn heisst die Schaltflaeche fuer einen Screenreader gar nichts.
   */
  'aria-label'?: string
}

const isExternalHref = (href: string) =>
  /^(https?:)?\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      children,
      to,
      href,
      loading = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    let Component: React.ElementType = 'button'
    if (to) Component = Link
    else if (href) Component = 'a'

    const isLink = Boolean(to || href)
    const inactive = Boolean(disabled) || loading
    const external = Boolean(href) && isExternalHref(href as string)

    // Alles wird VOR dem Erzeugen des Props-Objekts berechnet und dann in
    // einem Rutsch zusammengesetzt. Nachtraeglich in ein Objekt zu schreiben,
    // das den `ref` traegt, gilt dem React-Compiler als Ref-Zugriff waehrend
    // des Renderns — und waere auch schlechter lesbar.
    const linkProps = isLink
      ? {
          ...(to ? { to } : {}),
          ...(href ? { href } : {}),
          // Ein <a> kennt kein `disabled`. Ohne diese Behandlung bliebe ein
          // "deaktivierter" Link voll benutzbar.
          ...(inactive
            ? {
                'aria-disabled': true,
                tabIndex: -1,
                onClick: (event: React.MouseEvent) => event.preventDefault(),
              }
            : {}),
          // rel="noopener" schliesst den Zugriff des Ziels auf window.opener aus.
          ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
        }
      : { disabled: inactive, type: props.type ?? 'button' }

    const commonProps = {
      className: cn(
        buttonVariants({ variant, size, className }),
        // Nur die Zwei-Schichten-Variante braucht text-inherit — sonst frisst
        // twMerge die Textfarbe der secondary-Variante (Button wurde dadurch
        // unsichtbar).
        variant === 'primary' && '!p-[2px] text-inherit',
      ),
      ...props,
      ...linkProps,
      ...(loading ? { 'aria-busy': true } : {}),
    }

    const content = (
      <>
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
        )}
        {children}
      </>
    )

    if (variant === 'primary') {
      return (
        <Component ref={ref} {...commonProps}>
          <span
            className={cn(
              'flex h-full w-full items-center justify-center gap-2 rounded-[4px] bg-white text-brand-deep transition-colors hover:bg-gray-50',
              size === 'lg' && 'px-10 py-5 text-lg',
              (size === 'default' || !size) && 'px-8 py-4 text-base',
              size === 'sm' && 'px-6 py-3 text-sm',
              size === 'icon' && 'h-full w-full p-0',
            )}
          >
            {content}
          </span>
        </Component>
      )
    }

    return (
      <Component ref={ref} {...commonProps}>
        {content}
      </Component>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
