/**
 * routing/RootErrorBoundary.tsx — App-weite Fehlergrenze.
 *
 * Herkunft: adaptiert aus `redesign/preview@5673b61:src/routing/RootErrorBoundary.tsx`
 * (AP01 PT01.3, Pattern-Gruppe P2).
 *
 * Letzte Verteidigungslinie: faengt Render-Fehler im Browser, die keine
 * Segment-Boundary abgefangen hat, und zeigt eine Klartext-Meldung MIT Ausweg
 * (neu versuchen / zur Startseite) statt eines weissen Bildschirms. Ein
 * Stacktrace erreicht die Oberflaeche nie.
 *
 * ABWEICHUNG VON DER QUELLE, bewusst: Die Quellfassung ist ueber ihre Klassen
 * (`bg-bg`, `text-fg`, `text-fg-heading`, `bg-action-primary`,
 * `border-border-strong`, `max-w-reading`, `var(--tap-target-min)`) an die
 * Token-Schicht des alternativen Design-Systems aus `redesign/preview`
 * gebunden. Dieses Design-System ist ausdruecklich nicht Teil des Relaunchs
 * (BRANCH-RECONCILIATION-MAP X1, DEC-RL-002/DEC-RL-003). Die Darstellung ist
 * deshalb auf die Tokens dieser Linie umgeschrieben; das Verhalten ist
 * unveraendert.
 *
 * NUR CLIENT: eingehaengt wird diese Grenze in `src/entry-client.tsx`, nicht in
 * `App.tsx`. Wuerde sie auch beim SSR greifen, faenge sie einen Renderfehler ab,
 * den `server.ts` heute als echten HTTP 500 beantwortet — die Antwort waere
 * dann ein HTTP 200 mit Fehlerseite. Die Statussemantik der Baseline bleibt so
 * unangetastet.
 */

import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary } from './ErrorBoundary'

function RootFallback({ reset }: { reset: () => void }) {
  const { t } = useTranslation('common')

  return (
    <div
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4 text-center"
    >
      <div className="max-w-[60ch] space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight text-heading">
          {t('errors.root.title')}
        </h1>
        <p className="text-base leading-7 text-gray-600">{t('errors.root.body')}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] items-center rounded-full bg-brand-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-navy-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          {t('errors.root.retry')}
        </button>
        <a
          href="/"
          className="inline-flex min-h-[44px] items-center rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-brand-deep transition-colors hover:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          {t('errors.root.home')}
        </a>
      </div>
    </div>
  )
}

export function RootErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary boundary="root" fallback={(reset) => <RootFallback reset={reset} />}>
      {children}
    </ErrorBoundary>
  )
}
