/**
 * lib/monitoring/report.ts — Monitoring-Adapter (Phase 5 §5.10, lose Kopplung).
 *
 * Selbstbeobachtung der App: Error-Boundaries und Web-Vitals melden hierher.
 * Designprinzipien:
 *  - DEFENSIV: wirft NIE. Ein kaputtes Monitoring darf die App nicht mitreißen.
 *  - DETAILS NUR SERVERSEITIG (§5.10): der Client schickt minimale, nicht-
 *    sensible Nutzdaten an einen Sammel-Endpunkt; Stacktrace-Anreicherung,
 *    Zuordnung und Speicherung passieren serverseitig (außerhalb dieses Repos,
 *    hinter dem `/api`-Proxy). Dem Nutzer wird nie ein Stacktrace gezeigt.
 *  - SSR-SICHER: greift nur im Browser auf `navigator`/`window` zu.
 *
 * Der konkrete Transport ist absichtlich austauschbar (Adapter, §1 lose
 * Kopplung): heute `sendBeacon` → `/api/monitoring/*`, morgen ein SaaS-SDK.
 */

/** Sammel-Endpunkte hinter dem bestehenden `/api`-Proxy (server.ts). */
const ERROR_ENDPOINT = '/api/monitoring/client-error'
const VITALS_ENDPOINT = '/api/monitoring/web-vitals'

const isBrowser = typeof window !== 'undefined'
const isDev = import.meta.env?.DEV === true

/** Kontext, den eine Error-Boundary mitliefert. */
export interface ErrorContext {
  /** Welche Boundary hat gefangen? z. B. 'root' | 'segment:articles'. */
  readonly boundary: string
  /** React componentStack (nur Komponentennamen, keine Nutzerdaten). */
  readonly componentStack?: string
  /** Aktueller Pfad (ohne Query, um keine Tokens zu leaken). */
  readonly pathname?: string
}

/** Per `sendBeacon` (mit `fetch keepalive`-Fallback) feuern und Fehler schlucken. */
function beacon(url: string, payload: unknown): void {
  if (!isBrowser) return
  try {
    const body = JSON.stringify(payload)
    if (typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon(url, blob)
      return
    }
    // Fallback: keepalive-fetch (überlebt einen Page-Unload).
    void fetch(url, { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(
      () => {},
    )
  } catch {
    // Monitoring darf niemals werfen.
  }
}

/**
 * Meldet einen abgefangenen Render-Fehler. Sendet absichtlich nur Message +
 * Komponenten-Stack — KEINE rohen Props/State (könnten Nutzerdaten enthalten).
 */
export function reportError(error: unknown, context: ErrorContext): void {
  const message = error instanceof Error ? error.message : String(error)
  if (isDev) {
     
    console.error(`[monitoring:${context.boundary}]`, error)
  }
  beacon(ERROR_ENDPOINT, {
    type: 'client-error',
    message,
    name: error instanceof Error ? error.name : 'Unknown',
    boundary: context.boundary,
    componentStack: context.componentStack,
    pathname: context.pathname ?? (isBrowser ? window.location.pathname : undefined),
    ts: typeof performance !== 'undefined' ? Math.round(performance.now()) : undefined,
  })
}

/** Eine einzelne Web-Vitals-Messung (siehe `web-vitals.ts`). */
export interface WebVitalSample {
  readonly name: 'LCP' | 'CLS' | 'INP' | 'TTFB' | 'FCP'
  readonly value: number
  readonly rating: 'good' | 'needs-improvement' | 'poor'
}

/** Meldet eine Web-Vitals-Messung an das Monitoring. */
export function reportWebVital(sample: WebVitalSample): void {
  if (isDev) {
     
    console.info(`[web-vitals] ${sample.name}=${Math.round(sample.value)} (${sample.rating})`)
  }
  beacon(VITALS_ENDPOINT, {
    type: 'web-vital',
    ...sample,
    pathname: isBrowser ? window.location.pathname : undefined,
  })
}
