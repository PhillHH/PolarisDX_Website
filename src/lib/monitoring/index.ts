/**
 * lib/monitoring — Selbstbeobachtung der App.
 *
 * Herkunft: adaptiert aus `redesign/preview@5673b61` (AP01 PT01.3, P3).
 * Barrel: Fehler-Meldung + nativer Web-Vitals-Sammler, beide ueber eine
 * providerneutrale Senke (siehe `report.ts`).
 *
 * `initWebVitals()` wird von AP01 BEWUSST NICHT aufgerufen: ohne registrierte
 * Senke gaebe es nichts zu melden, und der Start der PerformanceObserver
 * gehoert zur Performance-Arbeit von AP25.
 */
export {
  reportError,
  reportWebVital,
  setMonitoringSink,
  monitoringAktiv,
  type ErrorContext,
  type WebVitalSample,
  type MonitoringEreignis,
  type MonitoringSink,
} from './report'
export { initWebVitals } from './web-vitals'
