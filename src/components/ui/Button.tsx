import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-deep text-brand-deep shadow-lg shadow-brand-primary/20 border-0 hover:opacity-95 focus-visible:ring-brand-primary', // Removed p-0.5 from here to manage it manually
        secondary:
          'bg-brand-deep text-white shadow-lg shadow-brand-deep/20 hover:bg-brand-deep/90 focus-visible:ring-brand-deep',
        outline:
          'border border-white/80 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-8 py-4 text-base', // Matches 'md' from old component
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
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {

    // Logic for Primary (Gradient) Button
    if (variant === 'primary') {
      return (
        <button
          className={cn(
            buttonVariants({ variant, size, className }),
            // Override padding to be just the border width
            // Using !p-0.5 ensures we override the size classes (px-8 py-4) coming from buttonVariants
            '!p-[2px]',
            // Reset text alignment or specific inner props if needed, but flex handles it.
            'text-inherit'
          )}
          ref={ref}
          {...props}
        >
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
        </button>
      )
    }

    // Standard Render for other variants
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
