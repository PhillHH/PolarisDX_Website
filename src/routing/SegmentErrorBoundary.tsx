/**
 * routing/SegmentErrorBoundary.tsx — Segment-Fehlergrenze.
 *
 * Herkunft: adaptiert aus `redesign/preview@5673b61:src/routing/SegmentErrorBoundary.tsx`
 * (AP01 PT01.3, Pattern-Gruppe P2).
 *
 * Kapselt einen Inhaltsbereich, sodass ein Fehler in EINER Route nur diesen
 * Bereich degradiert — Kopf, Fuss und Navigation bleiben bedienbar. Klartext
 * und ein Weg zurueck, niemals ein Stacktrace.
 *
 * ABWEICHUNG VON DER QUELLE: dieselbe Umschreibung der Token-Klassen wie in
 * `RootErrorBoundary.tsx` — die Quellfassung haengt an der Token-Schicht des
 * alternativen Design-Systems (BRANCH-RECONCILIATION-MAP X1).
 *
 * NOCH NICHT EINGEHAENGT: Wo Segmentgrenzen sinnvoll sitzen, entscheidet die
 * App-Shell-Arbeit von AP06. AP01 stellt das Bauteil bereit.
 */

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary } from './ErrorBoundary'

function SegmentFallback({ reset }: { reset: () => void }) {
  const { t } = useTranslation('common')

  return (
    <div role="alert" className="mx-auto w-full max-w-[60ch] px-4 py-16 text-center">
      <h2 className="text-xl font-semibold tracking-tight text-heading">
        {t('errors.segment.title')}
      </h2>
      <p className="mt-3 text-base leading-7 text-gray-600">{t('errors.segment.body')}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-brand-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-navy-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
      >
        {t('errors.segment.retry')}
      </button>
    </div>
  )
}

export function SegmentErrorBoundary({ name, children }: { name: string; children: ReactNode }) {
  return (
    <ErrorBoundary
      boundary={`segment:${name}`}
      fallback={(reset) => <SegmentFallback reset={reset} />}
    >
      {children}
    </ErrorBoundary>
  )
}
