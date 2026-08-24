/**
 * routing — Fehlergrenzen der Client-Laufzeit.
 *
 * Herkunft: adaptiert aus `redesign/preview@5673b61:src/routing/index.ts`
 * (AP01 PT01.3, P2). `RouteFallback` der Quelle ist NICHT uebernommen: ein
 * Lade-Skelett ist Darstellungs-/A11y-Arbeit von AP06/AP24, und der
 * `Suspense`-Fallback dieser Linie ist bewusst `null` (siehe `App.tsx`).
 */
export { ErrorBoundary, type ErrorBoundaryProps } from './ErrorBoundary'
export { RootErrorBoundary } from './RootErrorBoundary'
export { SegmentErrorBoundary } from './SegmentErrorBoundary'
