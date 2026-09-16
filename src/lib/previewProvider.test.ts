// @vitest-environment node
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

import { resolveAnalyticsConfig } from './analyticsConfig'

/**
 * AP23 PT23.4 — die REALE Preview-Konfiguration, gegen das Repository gehalten.
 *
 * Die Betreiberin hat einen eigenen Preview-Container eingerichtet und das
 * Preview-Deployment darauf gebaut. Diese Datei haelt genau zwei Dinge fest,
 * die ohne Test wieder auseinanderlaufen wuerden:
 *
 *  1. Das Preview-Deployment uebergibt NUR die Preview-Kennung — der
 *     Produktionscontainer taucht in der Build-Konfiguration nicht auf.
 *  2. Die Aufloesung liefert fuer genau diese Werte auch wirklich den
 *     Preview-Container und nicht den der Produktion.
 *
 * Die Kennungen stehen hier als Zeichenketten, weil sie KONFIGURATION sind
 * und kein Geheimnis: ein GTM-Container ist in jedem Browser sichtbar.
 */

const ROOT = path.resolve(__dirname, '..', '..')
const compose = fs.readFileSync(path.join(ROOT, 'docker-compose.yml'), 'utf8')

/** Die real eingerichtete Vorschau (Operator-Evidenz, 2026-09-11). */
const PREVIEW_CONTAINER = 'GTM-PL26PFFH'
/** Der Produktionscontainer der Altseite — darf die Vorschau nie erreichen. */
const PRODUCTION_CONTAINER = 'GTM-TW6JFX7K'

describe('PT23.4 · Preview-Deployment traegt nur den Preview-Container', () => {
  const frontend = compose.slice(compose.indexOf('  frontend:'), compose.indexOf('  backend:'))

  it('uebergibt VITE_APP_ENV=preview an den Build', () => {
    // Ohne diese Deklaration greift die Isolation nicht: eine undeklarierte
    // Umgebung gilt bewusst als Produktion.
    expect(frontend).toMatch(/VITE_APP_ENV:\s*preview/)
  })

  it('uebergibt den Preview-Container als Build-Argument', () => {
    expect(frontend).toMatch(new RegExp(`VITE_GTM_CONTAINER_ID_PREVIEW:\\s*${PREVIEW_CONTAINER}`))
  })

  it('uebergibt den Produktionscontainer NIRGENDS in der Compose-Datei', () => {
    // Der wichtigste Test dieser Datei: waere er hier, laege er im
    // Preview-Bundle, und Testklicks landeten in der Produktions-Property.
    expect(compose).not.toContain(PRODUCTION_CONTAINER)
    expect(compose).not.toMatch(/VITE_GTM_CONTAINER_ID:/)
  })
})

describe('PT23.4 · Aufloesung mit den realen Werten', () => {
  it('waehlt in der Vorschau den Preview-Container', () => {
    const config = resolveAnalyticsConfig({
      VITE_APP_ENV: 'preview',
      VITE_GTM_CONTAINER_ID_PREVIEW: PREVIEW_CONTAINER,
    })
    expect(config.gtmContainerId).toBe(PREVIEW_CONTAINER)
    expect(config.providerConfigured).toBe(true)
  })

  it('unterdrueckt den Produktionscontainer selbst dann, wenn beide gesetzt waeren', () => {
    const config = resolveAnalyticsConfig({
      VITE_APP_ENV: 'preview',
      VITE_GTM_CONTAINER_ID: PRODUCTION_CONTAINER,
      VITE_GTM_CONTAINER_ID_PREVIEW: PREVIEW_CONTAINER,
    })
    expect(config.gtmContainerId).toBe(PREVIEW_CONTAINER)
    expect(config.gtmContainerId).not.toBe(PRODUCTION_CONTAINER)
  })

  it('laedt in der Vorschau gar nichts, wenn der Preview-Container fehlt', () => {
    const config = resolveAnalyticsConfig({
      VITE_APP_ENV: 'preview',
      VITE_GTM_CONTAINER_ID: PRODUCTION_CONTAINER,
    })
    expect(config.gtmContainerId).toBeNull()
    expect(config.productionContainerSuppressed).toBe(true)
  })
})

describe('PT23.4 · die Kennungen bleiben Konfiguration, nicht Quelltext', () => {
  const nichtEingebacken = (rel: string) =>
    fs
      .readFileSync(path.join(ROOT, rel), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')

  it('verdrahtet keine Container-Kennung im produktiven Quelltext', () => {
    for (const rel of [
      'src/lib/analyticsConfig.ts',
      'src/lib/googleConsent.ts',
      'src/lib/trackingProvider.ts',
    ]) {
      const code = nichtEingebacken(rel)
      expect(code, `${rel}: Preview-Container`).not.toContain(PREVIEW_CONTAINER)
      // Der historische Container steht nur als benannte Baseline-Konstante.
      if (rel !== 'src/lib/analyticsConfig.ts') {
        expect(code, `${rel}: Produktionscontainer`).not.toContain(PRODUCTION_CONTAINER)
      }
    }
  })
})
