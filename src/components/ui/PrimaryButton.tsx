import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'outline-light'

type PrimaryButtonProps<T extends ElementType> = {
  as?: T
  children: ReactNode
  variant?: Variant
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-md text-base font-medium tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'

// Classes for non-primary variants
const variantClasses: Record<Exclude<Variant, 'primary'>, string> = {
  secondary:
    'border-transparent bg-primary px-8 py-4 text-white hover:bg-primary/90 focus-visible:ring-primary',
  'outline-light':
    'border border-white/80 bg-transparent px-8 py-4 text-white hover:bg-white/10 focus-visible:ring-white',
}

const PrimaryButton = <T extends ElementType = 'button'>({
  as,
  children,
  variant = 'primary',
  className = '',
  ...rest
}: PrimaryButtonProps<T>) => {
  const Component = as || 'button'

  if (variant === 'primary') {
    return (
      <Component
        className={`
          ${baseClasses} 
          border-0 p-[2px] 
          bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 
          focus-visible:ring-blue-500 
          ${className}
        `}
        {...rest}
      >
        <div className="flex h-full w-full items-center justify-center gap-2 rounded-[4px] bg-white px-8 py-4 text-secondary transition-colors">
          {children}
        </div>
      </Component>
    )
  }

  // Fallback for other variants, preserving original structure
  return (
    <Component className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </Component>
  )
}

export default PrimaryButton


