import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

// Definiert die verfügbaren Stil-Varianten des Buttons
type Variant = 'primary' | 'secondary' | 'outline-light'

// Generischer Typ für den Button, erlaubt die Verwendung als 'button', 'a' oder Link-Komponente (Polymorphismus)
type PrimaryButtonProps<T extends ElementType> = {
  as?: T // Die Komponente, als die gerendert werden soll (Standard: 'button')
  children: ReactNode // Der Inhalt des Buttons
  variant?: Variant // Der visuelle Stil
  className?: string // Zusätzliche CSS-Klassen
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>

// Basis-Klassen für Layout und Fokus-Zustände
const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-md text-base font-medium tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'

// Definition der Klassen für Standard-Varianten (außer 'primary', da dieser speziell behandelt wird)
const variantClasses: Record<Exclude<Variant, 'primary'>, string> = {
  secondary:
    'border-transparent bg-primary px-8 py-4 text-white hover:bg-primary/90 focus-visible:ring-primary',
  'outline-light':
    'border border-white/80 bg-transparent px-8 py-4 text-white hover:bg-white/10 focus-visible:ring-white',
}

/**
 * PrimaryButton Komponente.
 * Ein flexibler Button, der verschiedene HTML-Tags annehmen kann (z.B. für Links).
 * Unterstützt verschiedene visuelle Varianten.
 *
 * Besonderheit: Die 'primary' Variante hat einen Gradienten-Rand.
 */
const PrimaryButton = <T extends ElementType = 'button'>({
  as,
  children,
  variant = 'primary',
  className = '',
  ...rest
}: PrimaryButtonProps<T>) => {
  const Component = as || 'button'

  // Spezialbehandlung für den 'primary'-Style mit Gradient-Border-Effekt
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

  // Standard-Rendering für andere Varianten
  return (
    <Component className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </Component>
  )
}

export default PrimaryButton
