import * as React from 'react'
import { Link } from 'react-router-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight transition ring-offset-surface-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-brand-blue-bright via-brand-blue to-brand-navy text-white shadow-lg shadow-brand-blue/30 border-0 hover:opacity-95 focus-visible:ring-brand-blue',
        secondary:
          'bg-brand-deep text-white shadow-lg shadow-brand-deep/20 hover:bg-brand-deep/90 focus-visible:ring-brand-deep',
        outline:
          'border border-white/80 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white',
      },
      size: {
        default: 'px-8 py-4 text-base',
        sm: 'px-6 py-3 text-sm',
        lg: 'px-10 py-5 text-lg',
        icon: 'h-10 w-10',
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
  to?: string
  href?: string
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', children, to, href, ...props }, ref) => {
    // Determine the component to render
    let Component: React.ElementType = 'button'
    if (to) Component = Link
    else if (href) Component = 'a'

    // Combine props. All variants now render as a single element — the primary
    // CTA is a solid blue gradient fill with white text (dark-theme), so the
    // former white-pill inner-<span> + 2px-border padding hack is gone.
    const commonProps = {
      className: cn(buttonVariants({ variant, size, className })),
      ref: ref as any,
      ...props,
      ...(to ? { to } : {}),
      ...(href ? { href } : {}),
    }

    return <Component {...commonProps}>{children}</Component>
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
