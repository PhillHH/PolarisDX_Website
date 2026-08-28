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
import { ErrorState } from '../components/ui/StateBlock'

function SegmentFallback({ reset }: { reset: () => void }) {
  const { t } = useTranslation('common')

  return (
    <ErrorState
      className="mx-auto w-full max-w-[60ch]"
      title={t('errors.segment.title')}
      description={t('errors.segment.body')}
      onRetry={reset}
      retryLabel={t('errors.segment.retry')}
    />
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
