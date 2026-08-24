/**
 * lib/monitoring/report.ts — providerneutrale Selbstbeobachtung der App.
 *
 * Herkunft: adaptiert aus `redesign/preview@5673b61:src/lib/monitoring/report.ts`
 * (AP01 PT01.3, Pattern-Gruppe P3).
 *
 * WAS GEAENDERT WURDE UND WARUM (Abweichung von der Quelle, bewusst):
 * Die Quellfassung feuert jede Meldung per `navigator.sendBeacon` an
 * `/api/monitoring/client-error` bzw. `/api/monitoring/web-vitals`. Diese
 * beiden Endpunkte existieren nirgends — weder auf `5673b61` noch auf der
 * Baseline noch auf `main` (RUNTIME-CONTRACT.md RD-10). Uebernommen haette der
 * Import also einen neuen Laufzeit-Netzwerkpfad erzeugt, der ueber den
 * `/api`-Proxy in server.ts gegen den Backend-Dienst laeuft und dort ins Leere
 * geht. AP01 PT01.3 darf keine neue Datenuebertragung aktivieren.
 *
 * Deshalb liegt hier statt eines fest verdrahteten Transports eine SENKE, die
 * standardmaessig NICHTS tut. Das ist dasselbe Muster, das diese Linie in
 * `src/lib/tracking.ts` bereits fuehrt: ohne registrierten Anbieter passiert
 * nichts, und die Registrierung ist eine eigene, spaeter zu treffende
 * Entscheidung.
 *
 * ZUSTAENDIGKEIT: Welcher Transport hier eingehaengt wird — eigener Endpunkt,
 * RUM-Dienst oder gar keiner — entscheiden AP25 (Performance/CWV) und AP26/AP28
 * (Betrieb/Monitoring), gemeinsam mit AP23 fuer die Consent-Frage. AP01 stellt
 * nur das Geruest.
 *
 * Designprinzipien der Quelle bleiben:
 *  - DEFENSIV: wirft NIE. Ein kaputtes Monitoring darf die App nicht mitreissen.
 *  - KEINE STACKTRACES IN DER UI. Details gehen nur an die Senke.
 *  - SSR-SICHER: greift nur im Browser auf `window` zu.
 *  - KEINE PERSONENBEZOGENEN DATEN: Message, Fehlername, Boundary-Kennung,
 *    Komponenten-Stack und Pfad OHNE Query (damit keine Tokens mitgehen).
 */

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

/** Eine einzelne Web-Vitals-Messung (siehe `web-vitals.ts`). */
export interface WebVitalSample {
  readonly name: 'LCP' | 'CLS' | 'INP' | 'TTFB' | 'FCP'
  readonly value: number
  readonly rating: 'good' | 'needs-improvement' | 'poor'
}

/** Fertige Meldung, wie sie eine Senke entgegennimmt. */
export type MonitoringEreignis =
  | {
      readonly type: 'client-error'
      readonly message: string
      readonly name: string
      readonly boundary: string
      readonly componentStack?: string
      readonly pathname?: string
    }
  | ({ readonly type: 'web-vital'; readonly pathname?: string } & WebVitalSample)

/**
 * Eine Senke nimmt ein fertiges Ereignis entgegen. Mehr verlangt dieses Modul
 * nicht — welcher Transport dahinter steht, bleibt seine Sache.
 */
export type MonitoringSink = (ereignis: MonitoringEreignis) => void

let sink: MonitoringSink | null = null

/**
 * Senke registrieren. Ohne Aufruf bleiben `reportError` und `reportWebVital`
 * ausserhalb der Entwicklungskonsole wirkungslos.
 *
 * `null` entfernt die Senke wieder.
 */
export function setMonitoringSink(next: MonitoringSink | null): void {
  sink = next
}

/** Nur fuer Tests und die Fehlersuche. */
export function monitoringAktiv(): boolean {
  return sink !== null
}

/** An die Senke geben und jeden Fehler schlucken. */
function melden(ereignis: MonitoringEreignis): void {
  if (!sink) return
  try {
    sink(ereignis)
  } catch {
    // Ein kaputtes Monitoring darf die Seite nicht anhalten.
  }
}

/**
 * Meldet einen abgefangenen Render-Fehler. Sendet absichtlich nur Message +
 * Komponenten-Stack — KEINE rohen Props/State (koennten Nutzerdaten enthalten).
 */
export function reportError(error: unknown, context: ErrorContext): void {
  const message = error instanceof Error ? error.message : String(error)
  if (isDev) {
    console.error(`[monitoring:${context.boundary}]`, error)
  }
  melden({
    type: 'client-error',
    message,
    name: error instanceof Error ? error.name : 'Unknown',
    boundary: context.boundary,
    componentStack: context.componentStack,
    pathname: context.pathname ?? (isBrowser ? window.location.pathname : undefined),
  })
}

/** Meldet eine Web-Vitals-Messung an die Senke. */
export function reportWebVital(sample: WebVitalSample): void {
  if (isDev) {
    console.info(`[web-vitals] ${sample.name}=${Math.round(sample.value)} (${sample.rating})`)
  }
  melden({
    type: 'web-vital',
    ...sample,
    pathname: isBrowser ? window.location.pathname : undefined,
  })
}
