// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { applyGoogleConsent, hasAnalyticsConsent, withdrawGoogleConsent } from './googleConsent'
import { CONSENT_STORAGE_KEY, CONSENT_VERSION, writeConsentDecision } from './consentState'

/**
 * AP23 PT23.1 — Basic Consent Mode v2 am Provider-Loader.
 *
 * Basic Mode heisst: vor der Einwilligung wird GAR NICHTS geladen. Nicht
 * „geladen und auf denied gestellt" — das waere Advanced Mode und haette
 * bereits einen Request an Google ausgeloest.
 */

const GRANTED = { analytics: true, marketing: true }
const DENIED = { analytics: false, marketing: false }

const reset = () => {
  localStorage.clear()
  document.getElementById('google-tag-manager-script')?.remove()
  delete window.dataLayer
  delete window.gtag
  delete window.__gtmBootstrapStarted
  delete window.__googleConsentDefaultsSet
}

beforeEach(() => {
  reset()
  vi.stubEnv('VITE_GTM_CONTAINER_ID', 'GTM-CLOSURE01')
})

afterEach(() => {
  vi.unstubAllEnvs()
  reset()
})

describe('PT23.1 · vor der Einwilligung entsteht nichts', () => {
  it('erzeugt bei fehlender Entscheidung weder dataLayer noch Script', () => {
    expect(hasAnalyticsConsent()).toBe(false)
    applyGoogleConsent(DENIED)

    expect(window.dataLayer).toBeUndefined()
    expect(window.gtag).toBeUndefined()
    expect(document.getElementById('google-tag-manager-script')).toBeNull()
  })

  it('erzeugt auch bei ausdruecklicher ABLEHNUNG nichts', () => {
    writeConsentDecision(DENIED)
    applyGoogleConsent(DENIED)

    // Kein Puffer, kein Advanced-Mode-Default, kein Providerkontakt.
    expect(window.dataLayer).toBeUndefined()
    expect(window.gtag).toBeUndefined()
    expect(document.getElementById('google-tag-manager-script')).toBeNull()
  })

  it('erkennt das unversionierte Altformat NICHT als Zustimmung an', () => {
    // Bis PT23.1 wurde genau dieses Format gespeichert. Es belegt nicht, fuer
    // welchen Umfang zugestimmt wurde — also wird erneut gefragt.
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify([
        { id: 'analytics', enabled: true },
        { id: 'marketing', enabled: true },
      ]),
    )
    expect(hasAnalyticsConsent()).toBe(false)
  })
})

describe('PT23.1 · nach der Einwilligung', () => {
  it('laedt den Container genau einmal', () => {
    writeConsentDecision(GRANTED)
    expect(hasAnalyticsConsent()).toBe(true)

    applyGoogleConsent(GRANTED)
    applyGoogleConsent(GRANTED)

    const scripts = document.querySelectorAll('#google-tag-manager-script')
    expect(scripts).toHaveLength(1)
    expect(scripts[0].getAttribute('src')).toContain('id=GTM-CLOSURE01')
    expect(
      window.dataLayer?.filter(
        (entry) =>
          typeof entry === 'object' &&
          entry !== null &&
          !Array.isArray(entry) &&
          'event' in entry &&
          entry.event === 'gtm.js',
      ),
    ).toHaveLength(1)
  })

  it('laedt OHNE konfigurierten Container gar nichts', () => {
    // Die harte Regel: eine Kennung wird gelesen, nie erfunden. Ohne
    // Konfiguration gibt es keinen Container — also keinen Request.
    vi.stubEnv('VITE_GTM_CONTAINER_ID', '')
    writeConsentDecision(GRANTED)
    applyGoogleConsent(GRANTED)

    expect(document.getElementById('google-tag-manager-script')).toBeNull()
  })

  it('setzt die Standardsignale genau einmal und danach ein update', () => {
    writeConsentDecision(GRANTED)
    applyGoogleConsent(GRANTED)

    const calls = (window.dataLayer ?? []).filter(
      (entry): entry is unknown[] => Array.isArray(entry) && entry[0] === 'consent',
    )
    expect(calls.filter((c) => c[1] === 'default')).toHaveLength(1)
    expect(calls.filter((c) => c[1] === 'update')).toHaveLength(1)
    expect(calls.find((c) => c[1] === 'update')?.[2]).toMatchObject({
      analytics_storage: 'granted',
      ad_storage: 'granted',
    })
  })
})

describe('PT23.1 · Widerruf', () => {
  it('setzt die Signale auf denied, entfernt das Script und meldet den Reload', () => {
    writeConsentDecision(GRANTED)
    applyGoogleConsent(GRANTED)
    expect(document.getElementById('google-tag-manager-script')).not.toBeNull()

    const result = withdrawGoogleConsent()

    expect(result.reloadRequired).toBe(true)
    expect(document.getElementById('google-tag-manager-script')).toBeNull()
    const updates = (window.dataLayer ?? []).filter(
      (entry): entry is unknown[] =>
        Array.isArray(entry) && entry[0] === 'consent' && entry[1] === 'update',
    )
    expect(updates.at(-1)?.[2]).toMatchObject({
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
  })

  it('verlangt keinen Reload, wenn nie ein Provider lief', () => {
    // Wer ablehnt und danach widerruft, soll nicht grundlos neu laden.
    expect(withdrawGoogleConsent().reloadRequired).toBe(false)
    expect(window.dataLayer).toBeUndefined()
  })

  it('sperrt nach dem Widerruf jede weitere Ereignisquelle', () => {
    writeConsentDecision(GRANTED)
    applyGoogleConsent(GRANTED)
    expect(hasAnalyticsConsent()).toBe(true)

    localStorage.removeItem(CONSENT_STORAGE_KEY)
    withdrawGoogleConsent()

    // `hasAnalyticsConsent` ist die Schranke, an der GtmPageview und die
    // Consumer-Events haengen — sie ist ab sofort zu.
    expect(hasAnalyticsConsent()).toBe(false)
  })
})

describe('PT23.1 · Versionierung', () => {
  it('verwirft eine Entscheidung mit fremder Version', () => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ version: CONSENT_VERSION + 1, analytics: true, marketing: true }),
    )
    expect(hasAnalyticsConsent()).toBe(false)
  })
})
