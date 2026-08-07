import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

/**
 * Modul-Flag: true, sobald die erste PageTransition auf dem Client gemountet hat.
 * Der erste (harte) Seitenaufruf kommt serverseitig gerendert und damit bereits
 * sichtbar an - dort darf nichts eingeblendet werden, sonst blinkt der Inhalt kurz
 * auf opacity 0 und der LCP verschiebt sich. Erst die Folge-Mounts, also die
 * SPA-Navigationen, blenden ein.
 */
let hasMountedOnce = false

/** Gleicher Guard wie in Reveal.tsx: bei Bewegungsreduktion wird gar nicht animiert. */
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * SSR-safe PageTransition component
 *
 * CRITICAL FOR SEO: Content is ALWAYS rendered in the DOM.
 * Animation is purely visual enhancement that only activates client-side.
 *
 * SSR behavior: Content renders fully visible (no animation styles)
 * Client behavior: fade-in only on client-side route changes, never on the first
 * (server-rendered) page load, and never when prefers-reduced-motion: reduce is set.
 */
const PageTransition = ({ children, className = 'w-full' }: PageTransitionProps) => {
  // Einmal beim Mount entschieden. Server und erster Client-Render ergeben false,
  // dadurch bleibt die Hydration deckungsgleich mit dem Server-HTML.
  const [shouldAnimate] = useState(() => hasMountedOnce && !prefersReducedMotion())
  const [isAnimated, setIsAnimated] = useState(false)

  useEffect(() => {
    hasMountedOnce = true
    if (!shouldAnimate) return
    // Zwei Frames: der erste malt den Startzustand (opacity 0), erst der zweite
    // startet die Transition. Mit nur einem rAF lief die Einblendung faktisch nie,
    // weil Start- und Zielzustand im selben Frame gesetzt wurden.
    let innerFrame = 0
    const outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => setIsAnimated(true))
    })
    return () => {
      cancelAnimationFrame(outerFrame)
      cancelAnimationFrame(innerFrame)
    }
  }, [shouldAnimate])

  // Build animation styles
  // - SSR, erster Seitenaufruf oder prefers-reduced-motion: keine Styles, Inhalt sichtbar
  // - Route-Wechsel (vor dem Start): opacity 0, bereit fuer die Einblendung
  // - Route-Wechsel (laufend): volle Deckkraft mit Transition
  const animationStyle = shouldAnimate
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
