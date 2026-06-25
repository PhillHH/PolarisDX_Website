/**
 * routing/RouteFallback.tsx — Suspense-Fallback je Route (Phase 5 §5.9).
 *
 * Ersetzt das bisherige `fallback={null}` durch ein ruhiges Skelett, falls ein
 * Lazy-Chunk doch sichtbar nachlädt (z. B. langsame Verbindung, abgelaufenes
 * SSR-HTML). Bei der ersten SSR-Hydration bleibt das Server-HTML ohnehin
 * stehen (React 19) — dieses Skelett greift nur bei echten Client-Navigationen.
 *
 * A11y: `role="status"` + `aria-busy` + sr-only-Text; reduced-motion entfernt
 * die Puls-Animation global (index.css).
 */

import { useTranslation } from 'react-i18next'

export function RouteFallback() {
  const { t } = useTranslation('common')

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="mx-auto w-full max-w-container px-4 py-16 sm:py-24"
    >
      <span className="sr-only">{t('a11y.loading', 'Inhalt wird geladen …')}</span>
      <div className="animate-pulse space-y-6" aria-hidden="true">
        <div className="h-8 w-2/3 rounded-md bg-bg-subtle" />
        <div className="h-4 w-full rounded bg-bg-subtle" />
        <div className="h-4 w-5/6 rounded bg-bg-subtle" />
        <div className="h-64 w-full rounded-xl bg-bg-subtle" />
      </div>
    </div>
  )
}
