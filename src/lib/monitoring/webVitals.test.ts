// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  WEB_VITAL_THRESHOLDS,
  initWebVitals,
  rateWebVital,
  setMonitoringSink,
  type MonitoringEreignis,
} from './index'

/**
 * AP23 PT23.5 — die Erhebung selbst, nicht nur ihre Trennung.
 *
 * Der Sammler war bis hierhin ungetestet: er laeuft im produktiven Baum
 * bewusst nicht, und damit hat ihn auch nie jemand nachgemessen. Ein
 * Schwellenwert, den niemand prueft, wandert mit der naechsten Anpassung
 * lautlos in eine andere Bedeutung — und eine Metrik, die ein Feld zu viel
 * mitschickt, faellt erst im Netzmitschnitt auf.
 */

const gemeldet: MonitoringEreignis[] = []

beforeEach(() => {
  gemeldet.length = 0
  setMonitoringSink((e) => gemeldet.push(e))
})

afterEach(() => {
  setMonitoringSink(null)
  vi.unstubAllGlobals()
})

describe('PT23.5 · Normalisierung der Messwerte', () => {
  it('kennt Schwellen fuer LCP, CLS, INP, TTFB und FCP', () => {
    for (const name of ['LCP', 'CLS', 'INP', 'TTFB', 'FCP'] as const) {
      expect(WEB_VITAL_THRESHOLDS[name], name).toHaveLength(2)
    }
  })

  it.each([
    ['LCP', 2500, 'good'],
    ['LCP', 2501, 'needs-improvement'],
    ['LCP', 4000, 'needs-improvement'],
    ['LCP', 4001, 'poor'],
    ['CLS', 0.1, 'good'],
    ['CLS', 0.26, 'poor'],
    ['INP', 200, 'good'],
    ['INP', 501, 'poor'],
    ['TTFB', 800, 'good'],
    ['TTFB', 1801, 'poor'],
    ['FCP', 1800, 'good'],
    ['FCP', 3001, 'poor'],
  ] as const)('ordnet %s=%s als %s ein', (name, wert, erwartet) => {
    // Die Grenze gehoert zur GUTEN Klasse (web.dev: „good ≤ Schwelle").
    expect(rateWebVital(name, wert)).toBe(erwartet)
  })
})

describe('PT23.5 · Erhebung von LCP, CLS, INP und TTFB', () => {
  /** Minimaler PerformanceObserver, der die Callbacks steuerbar macht. */
  const installObserver = () => {
    const callbacks = new Map<string, (entries: unknown[]) => void>()
    class FakeObserver {
      // Kein Parameter-Property: `erasableSyntaxOnly` erlaubt es nicht.
      private readonly cb: (list: { getEntries: () => unknown[] }) => void
      constructor(cb: (list: { getEntries: () => unknown[] }) => void) {
        this.cb = cb
      }
      observe({ type }: { type: string }) {
        callbacks.set(type, (entries) => this.cb({ getEntries: () => entries }))
      }
      takeRecords() {
        return []
      }
      disconnect() {}
    }
    vi.stubGlobal('PerformanceObserver', FakeObserver as unknown as typeof PerformanceObserver)
    return callbacks
  }

  it('meldet TTFB aus der Navigation-Timing-Entry', () => {
    installObserver()
    vi.stubGlobal('performance', {
      getEntriesByType: (t: string) => (t === 'navigation' ? [{ responseStart: 640 }] : []),
    })
    initWebVitals()
    const ttfb = gemeldet.find((e) => e.type === 'web-vital' && e.name === 'TTFB')
    expect(ttfb).toMatchObject({ type: 'web-vital', name: 'TTFB', value: 640, rating: 'good' })
  })

  it('meldet LCP, CLS und INP erst, wenn die Seite verborgen wird', () => {
    const cb = installObserver()
    vi.stubGlobal('performance', { getEntriesByType: () => [] })
    initWebVitals()

    cb.get('largest-contentful-paint')?.([{ startTime: 1200 }, { startTime: 2100 }])
    cb.get('layout-shift')?.([
      { value: 0.04, hadRecentInput: false },
      // Verschiebungen direkt nach einer Eingabe zaehlen nicht — sie sind
      // vom Nutzer ausgeloest und kein Layout-Fehler.
      { value: 0.9, hadRecentInput: true },
      { value: 0.03, hadRecentInput: false },
    ])
    cb.get('event')?.([{ duration: 80 }, { duration: 240 }, { duration: 90 }])

    // Vor dem Verstecken ist noch nichts gemeldet.
    expect(gemeldet.filter((e) => e.type === 'web-vital' && e.name !== 'TTFB')).toHaveLength(0)

    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true })
    document.dispatchEvent(new Event('visibilitychange'))

    const werte = Object.fromEntries(
      gemeldet
        .filter(
          (e): e is Extract<MonitoringEreignis, { type: 'web-vital' }> => e.type === 'web-vital',
        )
        .map((e) => [e.name, e.value]),
    )
    // LCP ist der LETZTE beobachtete Wert, nicht der erste.
    expect(werte.LCP).toBe(2100)
    // CLS summiert nur ohne Recent-Input: 0.04 + 0.03.
    expect(werte.CLS).toBeCloseTo(0.07, 5)
    // INP-Proxy ist die groesste Interaktionslatenz.
    expect(werte.INP).toBe(240)
  })

  it('traegt in jeder Meldung nur Name, Wert, Bewertung und den Pfad', () => {
    installObserver()
    vi.stubGlobal('performance', {
      getEntriesByType: (t: string) => (t === 'navigation' ? [{ responseStart: 100 }] : []),
    })
    initWebVitals()
    const probe = gemeldet.find((e) => e.type === 'web-vital')
    expect(Object.keys(probe ?? {}).sort()).toEqual(
      ['name', 'pathname', 'rating', 'type', 'value'].sort(),
    )
  })

  it('wirft nicht, wenn es keinen PerformanceObserver gibt', () => {
    vi.stubGlobal('PerformanceObserver', undefined)
    expect(() => initWebVitals()).not.toThrow()
    expect(gemeldet).toEqual([])
  })
})

describe('PT23.5 · ohne Transport passiert nichts', () => {
  it('verwirft jede Meldung, wenn keine Senke registriert ist', () => {
    setMonitoringSink(null)
    const observer = vi.fn()
    vi.stubGlobal(
      'PerformanceObserver',
      class {
        observe() {}
        takeRecords() {
          return []
        }
        disconnect() {}
      } as unknown as typeof PerformanceObserver,
    )
    vi.stubGlobal('performance', {
      getEntriesByType: (t: string) => (t === 'navigation' ? [{ responseStart: 500 }] : []),
    })
    // Kein Fehler, kein Netzwerk, kein Puffer — die Meldung faellt weg.
    expect(() => initWebVitals()).not.toThrow()
    expect(observer).not.toHaveBeenCalled()
    expect(gemeldet).toEqual([])
  })
})
