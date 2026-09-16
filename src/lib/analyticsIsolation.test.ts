// @vitest-environment node
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

import {
  HISTORICAL_BASELINE_GA4_MEASUREMENT,
  HISTORICAL_BASELINE_GTM_CONTAINER,
  describeAnalyticsConfig,
  resolveAnalyticsConfig,
} from './analyticsConfig'
import { buildContentSecurityPolicy } from '../security/contentSecurityPolicy'

/**
 * AP23 PT23.4 — der Teil der Providerkonfiguration, der IM Repository liegt.
 *
 * Die Container-, Property- und Conversion-Konfiguration liegt bei Google und
 * ist von hier aus nicht aenderbar (PT23.4 BLOCKED_EXTERNAL_PROVIDER_CONFIG).
 * Was dieses Repository entscheidet, ist: WELCHE Kennung ein Build ueberhaupt
 * verwenden darf. Genau das steht hier unter Test.
 */

const ROOT = path.resolve(__dirname, '..', '..')

describe('PT23.4 · Vorschau kann die Produktionsauswertung nicht treffen', () => {
  const PROD = 'GTM-PROD0001'
  const PREVIEW = 'GTM-PREV0001'

  it.each(['preview', 'staging'])(
    'unterdrueckt in %s den Produktionscontainer, auch wenn er gesetzt ist',
    (environment) => {
      const config = resolveAnalyticsConfig({
        VITE_APP_ENV: environment,
        VITE_GTM_CONTAINER_ID: PROD,
      })
      // Lieber keine Messung als Testverkehr in der Produktions-Property.
      expect(config.gtmContainerId).toBeNull()
      expect(config.providerConfigured).toBe(false)
      expect(config.productionContainerSuppressed).toBe(true)
    },
  )

  it('verwendet in einer Vorschau ausschliesslich den eigens gesetzten Container', () => {
    const config = resolveAnalyticsConfig({
      VITE_APP_ENV: 'preview',
      VITE_GTM_CONTAINER_ID: PROD,
      VITE_GTM_CONTAINER_ID_PREVIEW: PREVIEW,
    })
    expect(config.gtmContainerId).toBe(PREVIEW)
    expect(config.gtmContainerId).not.toBe(PROD)
    expect(config.productionContainerSuppressed).toBe(false)
  })

  it('unterdrueckt in einer Vorschau ohne eigenen Container auch das GA4-Ziel', () => {
    const config = resolveAnalyticsConfig({
      VITE_APP_ENV: 'preview',
      VITE_GTM_CONTAINER_ID: PROD,
      VITE_GA4_MEASUREMENT_ID: 'G-PRODUCTION',
    })
    expect(config.ga4MeasurementId).toBeNull()
  })

  it('laesst die Produktion unveraendert laufen', () => {
    const config = resolveAnalyticsConfig({
      VITE_APP_ENV: 'production',
      VITE_GTM_CONTAINER_ID: PROD,
    })
    expect(config.gtmContainerId).toBe(PROD)
    expect(config.productionContainerSuppressed).toBe(false)
  })

  it('behandelt eine undeklarierte Umgebung wie Produktion — nicht wie Vorschau', () => {
    // Andernfalls koennte man die Isolation durch Weglassen umgehen, und ein
    // vergessenes VITE_APP_ENV waere ein stiller Messausfall.
    const config = resolveAnalyticsConfig({ VITE_GTM_CONTAINER_ID: PROD })
    expect(config.gtmContainerId).toBe(PROD)
    expect(config.environment).toBe('undeclared')
  })
})

describe('PT23.4 · Kennungen werden weiterhin nicht erfunden', () => {
  it('verwendet den historischen Container NICHT als Standardwert', () => {
    const config = resolveAnalyticsConfig({})
    expect(config.gtmContainerId).toBeNull()
    expect(config.gtmContainerId).not.toBe(HISTORICAL_BASELINE_GTM_CONTAINER)
    expect(config.ga4MeasurementId).not.toBe(HISTORICAL_BASELINE_GA4_MEASUREMENT)
  })

  it('meldet den Providerzustand als NICHT extern verifiziert', () => {
    // Der veroeffentlichte Container ist gelesen (§15), die GA4-Property nicht.
    // Solange das so ist, darf hier kein "geprueft" stehen.
    const report = describeAnalyticsConfig({ VITE_GTM_CONTAINER_ID: 'GTM-ABCD123' })
    expect(report.externallyVerified).toBe(false)
    expect(JSON.stringify(report)).not.toContain('GTM-ABCD123')
  })
})

describe('PT23.4 · providerbezogene CSP', () => {
  // AP26 PT26.2: die Policy liegt in src/security/contentSecurityPolicy.ts, nicht mehr als
  // Literal in server.ts. Gelesen wird die Policy, die der Server tatsaechlich ausliefert.
  const direktiven = buildContentSecurityPolicy()

  it('fuehrt keine DoubleClick-Origin mehr', () => {
    // Der veroeffentlichte Container enthaelt keinen einzigen Werbe-Tag
    // (weder AW- noch DC-), also entsteht kein DoubleClick-Aufruf.
    expect(direktiven).not.toContain('doubleclick')
  })

  it('behaelt die Origins, die der Container nachweislich braucht', () => {
    expect(direktiven).toContain('https://www.googletagmanager.com')
    expect(direktiven).toContain('https://region1.google-analytics.com')
    // AP26 PT26.2 gemessen: das Google-Tag beider Properties sendet an `region1`;
    // `www.google-analytics.com` wird nie angesprochen und steht deshalb nicht mehr in der Policy.
    expect(direktiven).not.toContain('https://www.google-analytics.com')
  })

  it('fuehrt weiterhin keine Chat-Domain (DEC-RL-007)', () => {
    expect(direktiven).not.toMatch(/hihuman/i)
  })
})

describe('PT23.4 · Konfigurationsvorlage', () => {
  const beispiel = fs.readFileSync(path.join(ROOT, '.env.example'), 'utf8')

  it('benennt alle vier Schaltstellen', () => {
    for (const name of [
      'VITE_APP_ENV',
      'VITE_GTM_CONTAINER_ID',
      'VITE_GTM_CONTAINER_ID_PREVIEW',
      'VITE_GA4_MEASUREMENT_ID',
    ]) {
      expect(beispiel, name).toContain(name)
    }
  })

  it('enthaelt keine echte Kennung — die Vorlage traegt nur Namen', () => {
    expect(beispiel).not.toMatch(/=\s*GTM-[A-Z0-9]{4,}/)
    expect(beispiel).not.toMatch(/=\s*G-[A-Z0-9]{8,}/)
  })
})
