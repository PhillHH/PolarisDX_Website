import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

/**
 * SSR-safe PageTransition component
 *
 * CRITICAL FOR SEO: Content is ALWAYS rendered in the DOM.
 * Animation is purely visual enhancement that only activates client-side.
 *
 * SSR behavior: Content renders fully visible (no animation styles)
 * Client behavior: After hydration, applies fade-in animation
 */
const PageTransition = ({ children, className = "w-full" }: PageTransitionProps) => {
  const [isHydrated, setIsHydrated] = useState(false)
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    // Small delay to allow the browser to paint the initial state
    const timer = requestAnimationFrame(() => {
      setIsAnimated(true)
    })
    return () => cancelAnimationFrame(timer)
  }, [])

  // Build animation styles
  // - SSR (not hydrated): no animation styles, content fully visible
  // - Client (hydrated, not animated): opacity 0, ready for animation
  // - Client (animated): full opacity with transition
  const animationStyle = isHydrated
    ? {
        opacity: isAnimated ? 1 : 0,
        transform: isAnimated ? 'translateY(0)' : 'translateY(15px)',
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
      }
    : {}

  return (
    <div className={className} style={animationStyle}>
      {children}
    </div>
  )
}

export default PageTransition
