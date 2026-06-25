/**
 * lib/monitoring/web-vitals.ts — Core-Web-Vitals-Sammler (Phase 5 §5.10).
 *
 * BEWUSST OHNE die `web-vitals`-Bibliothek (§1.16 „kein neues Dependency ohne
 * Not"; Sustainability §5.8 „toter Code/Deps = 0"): ein schlanker, nativer
 * Sammler auf Basis der Performance-APIs (`PerformanceObserver`) deckt
 * LCP / CLS / INP (+ FCP / TTFB) ab und kostet ~0 Bundle-Bytes extra.
 *
 * Misst nur im Browser, schluckt jeden Fehler (Monitoring darf nie werfen) und
 * meldet jede Metrik über `reportWebVital` an den serverseitigen Sink.
 *
 * INP wird nativ als größte beobachtete Interaktions-Latenz approximiert
 * (Event-Timing-API). Das ist ein dokumentierter Proxy; die kanonische
 * Perzentil-Berechnung der `web-vitals`-Lib bleibt CI/RUM vorbehalten.
 */

import { reportWebVital, type WebVitalSample } from './report'

type Rating = WebVitalSample['rating']

/** web.dev-Schwellen [good ≤, poor >]. */
const THRESHOLDS: Record<WebVitalSample['name'], [number, number]> = {
  LCP: [2500, 4000],
  CLS: [0.1, 0.25],
  INP: [200, 500],
  TTFB: [800, 1800],
  FCP: [1800, 3000],
}

function rate(name: WebVitalSample['name'], value: number): Rating {
  const [good, poor] = THRESHOLDS[name]
  if (value <= good) return 'good'
  if (value <= poor) return 'needs-improvement'
  return 'poor'
}

function emit(name: WebVitalSample['name'], value: number): void {
  reportWebVital({ name, value, rating: rate(name, value) })
}

function observe(
  type: string,
  cb: (entries: PerformanceEntryList) => void,
): PerformanceObserver | null {
  try {
    const po = new PerformanceObserver((list) => cb(list.getEntries()))
    // buffered: auch vor dem Observer aufgetretene Einträge erfassen.
    po.observe({ type, buffered: true } as PerformanceObserverInit)
    return po
  } catch {
    return null
  }
}

/**
 * Startet die Web-Vitals-Erfassung. Idempotent genug für StrictMode (doppelte
 * Beobachter melden denselben Wert; der Server dedupliziert/aggregiert).
 */
export function initWebVitals(): void {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return

  try {
    // --- TTFB: aus der Navigation-Timing-Entry ableiten. ---
    const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    if (nav) emit('TTFB', Math.max(0, nav.responseStart))

    // --- FCP: First Contentful Paint. ---
    observe('paint', (entries) => {
      for (const e of entries) {
        if (e.name === 'first-contentful-paint') emit('FCP', e.startTime)
      }
    })

    // --- LCP: letzter Wert beim Verlassen/Verstecken der Seite zählt. ---
    let lcp = 0
    const lcpPo = observe('largest-contentful-paint', (entries) => {
      const last = entries[entries.length - 1]
      if (last) lcp = last.startTime
    })

    // --- CLS: Summe der Layout-Shift-Session (ohne Recent-Input). ---
    let cls = 0
    const clsPo = observe('layout-shift', (entries) => {
      for (const e of entries as unknown as Array<{ value: number; hadRecentInput: boolean }>) {
        if (!e.hadRecentInput) cls += e.value
      }
    })

    // --- INP-Proxy: größte Interaktions-Latenz. ---
    let inp = 0
    observe('event', (entries) => {
      for (const e of entries as unknown as Array<{ duration: number }>) {
        if (e.duration > inp) inp = e.duration
      }
    })

    // Beim ersten Verstecken der Seite die finalen Werte melden.
    const finalize = () => {
      if (document.visibilityState !== 'hidden') return
      lcpPo?.takeRecords()
      clsPo?.takeRecords()
      if (lcp > 0) emit('LCP', lcp)
      emit('CLS', cls)
      if (inp > 0) emit('INP', inp)
      document.removeEventListener('visibilitychange', finalize)
    }
    document.addEventListener('visibilitychange', finalize)
  } catch {
    // Monitoring darf nie werfen.
  }
}
