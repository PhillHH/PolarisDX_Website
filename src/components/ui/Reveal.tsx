import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const subscribeNever = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(REDUCED_MOTION_QUERY).matches
function subscribeReducedMotion(onChange: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {}
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener?.('change', onChange)
  return () => query.removeEventListener?.('change', onChange)
}

interface RevealProps {
  children: React.ReactNode
  width?: 'fit-content' | '100%'
  className?: string
  delay?: number
  duration?: number
  yOffset?: number
}

/**
 * Single source of truth for the stagger step (in seconds) between siblings
 * of one visual group: use `delay={index * REVEAL_STAGGER}` instead of
 * per-page values. A lone Reveal gets no delay, so the first element shows
 * up without idle time.
 */
export const REVEAL_STAGGER = 0.06

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
  className = '',
  delay = 0,
  duration = 0.5,
  yOffset = 16,
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null)

  // Start with true to match SSR (content visible)
  // This ensures hydration matches and content is always visible to crawlers
  const [isRevealed, setIsRevealed] = useState(true)
  // AP27 PT27.6: Hydrationszustand und Bewegungspraeferenz kommen aus externen Quellen und werden
  // gelesen statt per synchronem setState im Effekt gespiegelt (react-hooks/set-state-in-effect).
  // Server-Snapshot `false` haelt das SSR-Markup identisch: Inhalt sichtbar, kein Animationsstil.
  const isHydrated = useSyncExternalStore(subscribeNever, clientSnapshot, serverSnapshot)
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    prefersReducedMotion,
    serverSnapshot,
  )

  useEffect(() => {
    // Reduced motion: content stays immediately visible, no transition, no observer.
    if (reduceMotion) return

    const element = ref.current
    if (!element) return

    // Already in view: keep visible, no animation and no observer needed.
    if (element.getBoundingClientRect().top < window.innerHeight * 0.9) return
    if (typeof IntersectionObserver === 'undefined') return

    // The observer reports the current position asynchronously right after `observe()`: an element
    // that is still further down is hidden then and revealed once it scrolls in.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight * 0.9) {
          setIsRevealed(true)
          observer.disconnect()
        } else {
          setIsRevealed(false)
        }
      },
      {
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0,
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [reduceMotion])

  // Build animation styles
  // - SSR (not hydrated): no animation styles, content fully visible
  // - Client (hydrated): apply opacity/transform based on reveal state
  const animationStyle =
    isHydrated && !reduceMotion
      ? {
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? 'translateY(0)' : `translateY(${yOffset}px)`,
          transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
        }
      : {}

  return (
    <div ref={ref} style={{ width }} className={className}>
      <div style={animationStyle}>{children}</div>
    </div>
  )
}

export default Reveal
