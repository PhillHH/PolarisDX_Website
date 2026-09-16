import { describe, expect, it } from 'vitest'

import {
  HISTORICAL_BASELINE_GA4_MEASUREMENT,
  HISTORICAL_BASELINE_GTM_CONTAINER,
  describeAnalyticsConfig,
  resolveAnalyticsConfig,
} from './analyticsConfig'

/**
 * AP23 PT23.1 — Kennungen werden gelesen, nie erfunden.
 *
 * Die harte Regel dahinter: der historische Container aus dem Altbestand ist
 * ein Hinweis, kein Standardwert. Wer ihn als Vorgabe verdrahtet, schickt
 * Nutzerdaten an einen Container, von dem niemand belegt hat, wem er gehoert.
 */

describe('PT23.1 · Provider-Konfiguration', () => {
  it('liefert ohne Umgebung KEINEN Container — der Provider bleibt aus', () => {
    const config = resolveAnalyticsConfig({})
    expect(config.gtmContainerId).toBeNull()
    expect(config.ga4MeasurementId).toBeNull()
    expect(config.providerConfigured).toBe(false)
  })

  it('verwendet den historischen Container NICHT als Standardwert', () => {
    const config = resolveAnalyticsConfig({})
    expect(config.gtmContainerId).not.toBe(HISTORICAL_BASELINE_GTM_CONTAINER)
    expect(config.ga4MeasurementId).not.toBe(HISTORICAL_BASELINE_GA4_MEASUREMENT)
  })

  it('nimmt eine gueltige Kennung aus der Umgebung an', () => {
    const config = resolveAnalyticsConfig({
      VITE_GTM_CONTAINER_ID: '  GTM-ABCD123  ',
      VITE_GA4_MEASUREMENT_ID: 'G-ABCDEFGH12',
    })
    expect(config.gtmContainerId).toBe('GTM-ABCD123')
    expect(config.ga4MeasurementId).toBe('G-ABCDEFGH12')
    expect(config.providerConfigured).toBe(true)
  })

  it.each([
    ['leer', ''],
    ['nur Leerzeichen', '   '],
    ['falsches Praefix', 'GA-ABCD123'],
    ['zu kurz', 'GTM-AB'],
    ['Kleinbuchstaben', 'gtm-abcd123'],
    ['Fremdinhalt', 'https://evil.example/gtm.js'],
  ])('verwirft eine syntaktisch falsche GTM-Kennung (%s)', (_label, value) => {
    // Ein Tippfehler in der Umgebung wuerde sonst eine Anfrage an einen
    // fremden oder nicht existierenden Container ausloesen.
    expect(resolveAnalyticsConfig({ VITE_GTM_CONTAINER_ID: value }).gtmContainerId).toBeNull()
  })

  it('berichtet den Stand, ohne eine Kennung auszugeben', () => {
    const report = describeAnalyticsConfig({ VITE_GTM_CONTAINER_ID: 'GTM-ABCD123' })
    // AP23 PT23.4 — der Bericht traegt zusaetzlich die Umgebung und ob eine
    // Vorschau den Produktionscontainer unterdrueckt hat. Weiterhin gilt:
    // NUR Zustaende, nie eine Kennung.
    expect(report).toEqual({
      gtm: 'CONFIGURED',
      ga4: 'UNCONFIGURED',
      environment: 'undeclared',
      productionContainerSuppressed: false,
      externallyVerified: false,
    })
    expect(JSON.stringify(report)).not.toContain('GTM-ABCD123')
    // Konfiguriert heisst NICHT geprueft — die externe Verifikation ist PT23.4.
    expect(report.externallyVerified).toBe(false)
  })
})
