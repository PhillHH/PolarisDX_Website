import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type Variant = 'primary' | 'brand-secondary' | 'outline-light'
type Size = 'lg' | 'md' | 'sm'

type PrimaryButtonProps<T extends ElementType> = {
  as?: T
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-md text-base font-medium tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'

const sizeClasses: Record<Size, string> = {
  lg: 'px-10 py-5 text-lg',
  md: 'px-8 py-4 text-base',
  sm: 'px-6 py-3 text-sm',
}

// Classes for non-primary variants
const variantClasses: Record<Exclude<Variant, 'primary'>, (size: Size) => string> = {
  'brand-secondary': (size) =>
    `border-transparent bg-brand-deep text-white hover:bg-brand-deep/90 shadow-lg shadow-brand-deep/20 focus-visible:ring-brand-deep ${sizeClasses[size]}`,
  'outline-light': (size) =>
    `border border-white/80 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white ${sizeClasses[size]}`,
}

const PrimaryButton = <T extends ElementType = 'button'>({
  as,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: PrimaryButtonProps<T>) => {
  const Component = as || 'button'

  if (variant === 'primary') {
    return (
      <Component
        className={`
          ${baseClasses} 
          border-0 p-0.5
          bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-deep
          shadow-lg shadow-brand-primary/20
          focus-visible:ring-brand-primary
          ${className}
        `}
        {...rest}
      >
        <div
          className={`flex h-full w-full items-center justify-center gap-2 rounded-[4px] bg-white text-brand-deep hover:bg-gray-50 transition-colors ${sizeClasses[size]}`}
        >
          {children}
        </div>
      </Component>
    )
  }

  // Fallback for other variants, preserving original structure
  return (
    <Component className={`${baseClasses} ${variantClasses[variant](size)} ${className}`} {...rest}>
      {children}
    </Component>
  )
}

export default PrimaryButton
