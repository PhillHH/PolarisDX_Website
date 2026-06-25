/**
 * ThemePreviewSwitcher — kleiner Preview-Umschalter fuer die Design-Varianten.
 *
 * Schaltet das aktive [data-theme] am <html>-Element um:
 *   Aktuell = kein data-theme (Ist-Look) · V1 = fresh-1 · V2 = fresh-2 · V3 = fresh-3
 *
 * - Persistiert die Wahl in localStorage ('polaris-preview-theme').
 * - Unterstuetzt zusaetzlich ?v=0|1|2|3 (0 = aktueller Look) fuer teilbare Links;
 *   diese URL-/Storage-Logik laeuft FOUC-frei als Inline-Script in index.html
 *   (vor dem Hydration-Bundle). Diese Komponente spiegelt nur den Zustand und
 *   bietet die Buttons.
 * - A11y: native <button>, aria-pressed, tastaturbedienbar; sichtbarer Fokus
 *   bleibt (kein outline:none). Eigene Inline-Styles, damit der Umschalter NICHT
 *   selbst vom aktiven Theme umgefaerbt wird (stabil & unaufdringlich).
 *
 * Hinweis: rein clientseitig (mounted-Guard) — rendert serverseitig und beim
 * ersten Client-Render `null`, danach erst die Buttons → keine Hydration-Mismatch.
 */

import { useEffect, useState, type CSSProperties } from 'react'

const STORAGE_KEY = 'polaris-preview-theme'

const OPTIONS = [
  { label: 'Aktuell', value: '' },
  { label: 'V1', value: 'fresh-1' },
  { label: 'V2', value: 'fresh-2' },
  { label: 'V3', value: 'fresh-3' },
] as const

const groupStyle: CSSProperties = {
  position: 'fixed',
  right: 16,
  bottom: 16,
  zIndex: 2147483000,
  display: 'flex',
  gap: 4,
  padding: 4,
  borderRadius: 9999,
  background: 'rgba(15, 23, 42, 0.92)',
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.28)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  fontFamily: 'system-ui, -apple-system, sans-serif',
}

const buttonStyle: CSSProperties = {
  appearance: 'none',
  border: 'none',
  cursor: 'pointer',
  borderRadius: 9999,
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1,
  color: 'rgba(255, 255, 255, 0.75)',
  background: 'transparent',
  minHeight: 28,
}

const activeButtonStyle: CSSProperties = {
  color: '#0b1220',
  background: '#ffffff',
}

export default function ThemePreviewSwitcher() {
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    setMounted(true)
    setActive(document.documentElement.getAttribute('data-theme') ?? '')
  }, [])

  function apply(value: string) {
    const root = document.documentElement
    if (value) root.setAttribute('data-theme', value)
    else root.removeAttribute('data-theme')
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* localStorage kann blockiert sein (Privacy-Mode) — Umschalten bleibt trotzdem funktional */
    }
    setActive(value)
  }

  if (!mounted) return null

  return (
    <div role="group" aria-label="Design-Variante (Vorschau)" style={groupStyle}>
      {OPTIONS.map((option) => {
        const isActive = active === option.value
        return (
          <button
            key={option.value || 'current'}
            type="button"
            aria-pressed={isActive}
            onClick={() => apply(option.value)}
            style={isActive ? { ...buttonStyle, ...activeButtonStyle } : buttonStyle}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
