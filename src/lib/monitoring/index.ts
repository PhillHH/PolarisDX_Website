/**
 * lib/monitoring — Selbstbeobachtung der App (Phase 5 §5.10).
 * Barrel: Error-Reporting + native Web-Vitals-Erfassung.
 */
export { reportError, reportWebVital, type ErrorContext, type WebVitalSample } from './report'
export { initWebVitals } from './web-vitals'
