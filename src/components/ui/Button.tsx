import * as React from 'react'
import { Link } from 'react-router-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-deep text-brand-deep shadow-lg shadow-brand-primary/20 border-0 hover:opacity-95 focus-visible:ring-brand-primary',
        secondary:
          'bg-brand-deep text-white shadow-lg shadow-brand-deep/20 hover:bg-brand-deep/90 focus-visible:ring-brand-deep',
        outline:
          'border border-white/80 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white',
        'outline-light':
          'border border-white/80 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white',
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
        link: 'text-brand-primary underline-offset-4 hover:underline',
        'brand-secondary': 'bg-brand-deep text-white shadow-lg shadow-brand-deep/20 hover:bg-brand-deep/90 focus-visible:ring-brand-deep'
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
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  to?: string
  href?: string
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', children, to, href, ...props }, ref) => {

    // Determine the component to render
    let Component: React.ElementType = 'button'
    if (to) Component = Link
    else if (href) Component = 'a'

    // Combine props
    const commonProps = {
      className: cn(
        buttonVariants({ variant, size, className }),
        // Override padding for primary variant to handle the border width hack
        variant === 'primary' && '!p-[2px]',
        'text-inherit'
      ),
      ref: ref as any,
      ...props,
      ...(to ? { to } : {}),
      ...(href ? { href } : {}),
    }

    // Logic for Primary (Gradient) Button special rendering
    if (variant === 'primary') {
      return (
        <Component {...commonProps}>
          <span
            className={cn(
              'flex h-full w-full items-center justify-center gap-2 rounded-[4px] bg-white text-brand-deep transition-colors hover:bg-gray-50',
              // Re-apply size classes manually to the inner element
              size === 'lg' && 'px-10 py-5 text-lg',
              (size === 'default' || !size) && 'px-8 py-4 text-base',
              size === 'sm' && 'px-6 py-3 text-sm',
              size === 'icon' && 'h-full w-full p-0'
            )}
          >
            {children}
          </span>
        </Component>
      )
    }

    // Standard Render
    return (
      <Component {...commonProps}>
        {children}
      </Component>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
