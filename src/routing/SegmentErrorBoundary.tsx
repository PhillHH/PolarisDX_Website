/**
 * routing/SegmentErrorBoundary.tsx — Segment-Fehlergrenze (Phase 5 §5.9).
 *
 * Kapselt den Seiten-`<Outlet>`, sodass ein Fehler in EINER Route nur deren
 * Inhaltsbereich degradiert — Header/Footer/Navigation bleiben bedienbar
 * („externer Ausfall degradiert nur das Segment", DoD P8). Klartext + Retry,
 * niemals ein Stacktrace.
 */

import { useTranslation } from 'react-i18next'
import { ErrorBoundary } from './ErrorBoundary'

function SegmentFallback({ reset }: { reset: () => void }) {
  const { t } = useTranslation('common')

  return (
    <div role="alert" className="mx-auto w-full max-w-reading px-4 py-16 text-center">
      <h2 className="text-xl font-semibold text-fg-heading">
        {t('errors.segment.title', 'Dieser Bereich konnte nicht geladen werden')}
      </h2>
      <p className="mt-3 text-fg">
        {t(
          'errors.segment.body',
          'Der Rest der Seite funktioniert weiterhin. Bitte versuchen Sie es erneut.',
        )}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex min-h-[var(--tap-target-min)] items-center rounded-md bg-action-primary px-5 py-2.5 font-medium text-fg-on-dark outline-none transition-colors hover:bg-action-primary-hover focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-2"
      >
        {t('errors.segment.retry', 'Erneut versuchen')}
      </button>
    </div>
  )
}

export function SegmentErrorBoundary({
  name,
  children,
}: {
  /** Segment-Kennung fürs Monitoring, z. B. 'main'. */
  name: string
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary
      boundary={`segment:${name}`}
      fallback={(reset) => <SegmentFallback reset={reset} />}
    >
      {children}
    </ErrorBoundary>
  )
}
