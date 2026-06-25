/**
 * routing/RootErrorBoundary.tsx — App-weite Fehlergrenze (Phase 5 §5.9).
 *
 * Letzte Verteidigungslinie: fängt Render-Fehler, die keine Segment-Boundary
 * abgefangen hat. Zeigt eine ganzseitige Klartext-Meldung MIT Lösung (Neu
 * laden / zur Startseite) statt eines weißen Bildschirms oder Stacktraces.
 */

import { useTranslation } from 'react-i18next'
import { ErrorBoundary } from './ErrorBoundary'

function RootFallback({ reset }: { reset: () => void }) {
  const { t } = useTranslation('common')

  return (
    <div
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-4 text-center text-fg"
    >
      <div className="max-w-reading space-y-4">
        <h1 className="text-2xl font-semibold text-fg-heading">
          {t('errors.root.title', 'Etwas ist schiefgelaufen')}
        </h1>
        <p className="text-fg">
          {t(
            'errors.root.body',
            'Diese Seite konnte nicht geladen werden. Bitte laden Sie sie neu — Ihre Daten sind nicht verloren. Tritt das Problem erneut auf, versuchen Sie es in einigen Minuten noch einmal.',
          )}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[var(--tap-target-min)] items-center rounded-md bg-action-primary px-5 py-2.5 font-medium text-fg-on-dark outline-none transition-colors hover:bg-action-primary-hover focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-2"
        >
          {t('errors.root.retry', 'Erneut versuchen')}
        </button>
        <a
          href="/"
          className="inline-flex min-h-[var(--tap-target-min)] items-center rounded-md border border-border-strong px-5 py-2.5 font-medium text-fg-heading outline-none transition-colors hover:bg-bg-subtle focus-visible:ring-2 focus-visible:ring-action-primary focus-visible:ring-offset-2"
        >
          {t('errors.root.home', 'Zur Startseite')}
        </a>
      </div>
    </div>
  )
}

export function RootErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary boundary="root" fallback={(reset) => <RootFallback reset={reset} />}>
      {children}
    </ErrorBoundary>
  )
}
