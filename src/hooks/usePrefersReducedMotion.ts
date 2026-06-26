import { useSyncExternalStore } from 'react'

/**
 * usePrefersReducedMotion — reagiert auf `(prefers-reduced-motion: reduce)`.
 *
 * Quelle für JS-gesteuerte Bewegung (Auto-Karussells), die das globale
 * CSS-`prefers-reduced-motion` (nur Transitions) nicht erreicht. Erlaubt es
 * Auto-Advance-Intervalle zu pausieren — WCAG 2.2.2 (Pause, Stop, Hide) /
 * 2.3.3 (Animation from Interactions), [BEC] User-Control.
 *
 * `useSyncExternalStore` mit Server-Snapshot `false` → SSR-/Hydration-sicher
 * (kein setState-in-Effect, kein Mismatch).
 */
const QUERY = '(prefers-reduced-motion: reduce)'

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const mql = window.matchMedia(QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

const getSnapshot = () => window.matchMedia(QUERY).matches
const getServerSnapshot = () => false

export const usePrefersReducedMotion = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
