import { useEffect, useRef, useState } from 'react'

interface RevealProps {
  children: React.ReactNode
  width?: 'fit-content' | '100%'
  className?: string
  delay?: number
  duration?: number
  yOffset?: number
}

/**
 * SSR-safe Reveal component
 *
 * CRITICAL FOR SEO: Content is ALWAYS rendered in the DOM.
 * Animation is purely visual enhancement that only activates client-side.
 *
 * SSR behavior: Content renders fully visible (no animation styles)
 * Client behavior: After hydration, applies reveal animation when scrolled into view
 */
const Reveal = ({
  children,
  width = 'fit-content',
  className = "",
  delay = 0.1,
  duration = 0.5,
  yOffset = 30
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null)

  // Start with true to match SSR (content visible)
  // This ensures hydration matches and content is always visible to crawlers
  const [isRevealed, setIsRevealed] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated - animations can now be enabled
    setIsHydrated(true)

    const element = ref.current
    if (!element) return

    // Check if element is already in viewport
    const rect = element.getBoundingClientRect()
    const isInViewport = rect.top < window.innerHeight * 0.9

    if (isInViewport) {
      // Already in view, keep visible (no animation needed)
      setIsRevealed(true)
      return
    }

    // Not in view - prepare for reveal animation
    setIsRevealed(false)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  // Build animation styles
  // - SSR (not hydrated): no animation styles, content fully visible
  // - Client (hydrated): apply opacity/transform based on reveal state
  const animationStyle = isHydrated
    ? {
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'translateY(0)' : `translateY(${yOffset}px)`,
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
      }
    : {}

  return (
    <div ref={ref} style={{ width }} className={className}>
      <div style={animationStyle}>
        {children}
      </div>
    </div>
  )
}

export default Reveal
