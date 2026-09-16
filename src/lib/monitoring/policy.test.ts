// @vitest-environment node
import { describe, expect, it } from 'vitest'

import {
  describeTelemetryPolicy,
  mayRegisterTelemetryTransport,
  resolveTelemetryPolicy,
} from './policy'

/**
 * AP23 PT23.5 — die Entscheidung ueber technische Telemetrie, nachgemessen.
 *
 * Bis hierhin stand sie nur in Prosa im Vertrag. Eine Regel, die nur in einem
 * Dokument steht, haelt genau bis zu dem Tag, an dem jemand unter Zeitdruck
 * einen RUM-Dienst einhaengt — und dann ist die Entscheidung nicht getroffen,
 * sondern uebersprungen worden.
 */

const VOLLSTAENDIG = {
  VITE_TELEMETRY_PURPOSE_DOCUMENTED: 'true',
  VITE_TELEMETRY_PROCESSOR_AGREED: 'true',
  VITE_TELEMETRY_RETENTION_DEFINED: 'true',
  VITE_TELEMETRY_PRIVACY_NOTICE_UPDATED: 'true',
}

describe('PT23.5 · Auslieferungszustand', () => {
  it('meldet ohne Konfiguration `NONE` und keinen Transport', () => {
    const policy = resolveTelemetryPolicy({})
    expect(policy.scope).toBe('NONE')
    const gate = mayRegisterTelemetryTransport(policy)
    // Kein Mangel, sondern der einzige Zustand, der ohne Entscheidung
    // vertretbar ist.
    expect(gate).toEqual({ allowed: false, reason: 'NO_TRANSPORT_CONFIGURED', missing: [] })
  })

  it('faellt bei einem unbekannten Wert auf `NONE` zurueck', () => {
    expect(resolveTelemetryPolicy({ VITE_TELEMETRY_SCOPE: 'ALLES' }).scope).toBe('NONE')
    expect(resolveTelemetryPolicy({ VITE_TELEMETRY_SCOPE: '' }).scope).toBe('NONE')
  })
})

describe('PT23.5 · externer Dienst braucht eine vollstaendige Entscheidung', () => {
  it('blockiert die AKTIVIERUNG, solange Belege fehlen', () => {
    const gate = mayRegisterTelemetryTransport(
      resolveTelemetryPolicy({ VITE_TELEMETRY_SCOPE: 'THIRD_PARTY', VITE_APP_ENV: 'production' }),
    )
    expect(gate.allowed).toBe(false)
    expect(gate.reason).toBe('BLOCKED_POLICY_DECISION')
    expect([...gate.missing].sort()).toEqual([
      'privacyNoticeUpdated',
      'processorAgreed',
      'purposeDocumented',
      'retentionDefined',
    ])
  })

  it('benennt genau den fehlenden Beleg, nicht pauschal alle', () => {
    const gate = mayRegisterTelemetryTransport(
      resolveTelemetryPolicy({
        VITE_TELEMETRY_SCOPE: 'THIRD_PARTY',
        VITE_APP_ENV: 'production',
        ...VOLLSTAENDIG,
        VITE_TELEMETRY_RETENTION_DEFINED: 'false',
      }),
    )
    expect(gate.missing).toEqual(['retentionDefined'])
  })

  it('gibt frei, sobald alle vier Belege vorliegen', () => {
    const gate = mayRegisterTelemetryTransport(
      resolveTelemetryPolicy({
        VITE_TELEMETRY_SCOPE: 'THIRD_PARTY',
        VITE_APP_ENV: 'production',
        ...VOLLSTAENDIG,
      }),
    )
    expect(gate).toEqual({ allowed: true, reason: 'ALLOWED', missing: [] })
  })

  it('verlangt fuer einen EIGENEN Endpunkt keine Auftragsverarbeitung', () => {
    // Kein Dritter, kein Drittlandtransfer — die Frage ist eine andere und
    // ausdruecklich leichter. Das hier ist eine bewusste Unterscheidung,
    // keine Nachlaessigkeit.
    const gate = mayRegisterTelemetryTransport(
      resolveTelemetryPolicy({ VITE_TELEMETRY_SCOPE: 'FIRST_PARTY', VITE_APP_ENV: 'production' }),
    )
    expect(gate.allowed).toBe(true)
  })
})

describe('PT23.5 · Vorschau verschmutzt die Produktionsmessung nicht', () => {
  it.each(['preview', 'staging'])(
    'blockiert in %s einen Transport ohne eigenen Endpunkt',
    (environment) => {
      const gate = mayRegisterTelemetryTransport(
        resolveTelemetryPolicy({ VITE_TELEMETRY_SCOPE: 'FIRST_PARTY', VITE_APP_ENV: environment }),
      )
      // Dieselbe Regel wie bei den Marketingkennungen (PT23.4): Messwerte aus
      // einer Vorschau sind in derselben Auswertung hinterher nicht mehr von
      // echten Besuchen zu unterscheiden.
      expect(gate.allowed).toBe(false)
      expect(gate.reason).toBe('BLOCKED_PREVIEW_ISOLATION')
    },
  )

  it('erlaubt die Vorschau mit einem eigenen Endpunkt', () => {
    const gate = mayRegisterTelemetryTransport(
      resolveTelemetryPolicy({ VITE_TELEMETRY_SCOPE: 'FIRST_PARTY', VITE_APP_ENV: 'preview' }),
      { hasDedicatedPreviewEndpoint: true },
    )
    expect(gate.allowed).toBe(true)
  })

  it('behandelt eine undeklarierte Umgebung wie Produktion', () => {
    // Sonst liesse sich die Isolation durch Weglassen umgehen.
    const policy = resolveTelemetryPolicy({ VITE_TELEMETRY_SCOPE: 'FIRST_PARTY' })
    expect(policy.environment).toBe('undeclared')
    expect(mayRegisterTelemetryTransport(policy).allowed).toBe(true)
  })
})

describe('PT23.5 · Betriebsbericht', () => {
  it('meldet den Zustand ohne Anbieternamen und ohne Adresse', () => {
    const report = describeTelemetryPolicy({
      VITE_TELEMETRY_SCOPE: 'THIRD_PARTY',
      VITE_APP_ENV: 'production',
    })
    expect(report).toEqual({
      scope: 'THIRD_PARTY',
      environment: 'production',
      transport: 'BLOCKED_POLICY_DECISION',
      missing: ['purposeDocumented', 'processorAgreed', 'retentionDefined', 'privacyNoticeUpdated'],
    })
    // Nur Zustaende. Kein Endpunkt, kein Dienstname, kein Schluessel.
    expect(JSON.stringify(report)).not.toMatch(/https?:|\.com|\.io|api[_-]?key/i)
  })

  it('meldet im Auslieferungszustand `NONE` / `NO_TRANSPORT_CONFIGURED`', () => {
    expect(describeTelemetryPolicy({})).toMatchObject({
      scope: 'NONE',
      transport: 'NO_TRANSPORT_CONFIGURED',
    })
  })
})
