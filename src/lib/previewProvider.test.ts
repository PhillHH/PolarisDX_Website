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

/**
 * SC-011 (Owner 2026-10-19) ersetzt das Bauzeit-Modell: ein Image fuer Preview UND Produktion
 * (`deploy.sh` prueft die Artefaktidentitaet), deshalb konnte ein „Preview-Build" nie von der
 * Produktion getrennt werden — gemessen schrieb polarisdx.net seit dem Go-live in die
 * Preview-Property. Jetzt: gebaut wird mit dem Container der Produktion (`GTM-PL26PFFH`, Owner-
 * Wahl), und die Preview schaltet die Messung zur LAUFZEIT ab (`APP_ENV=preview` am Frontend →
 * `<meta name="polaris-app-env">` → `analyticsConfig.ts`).
 */
describe('SC-011 · ein Image, Messung nur in der Produktion', () => {
  const frontend = compose.slice(compose.indexOf('  frontend:'), compose.indexOf('  backend:'))
  const previewCompose = fs.readFileSync(path.join(ROOT, 'docker-compose.preview.yml'), 'utf8')
  const previewFrontend = previewCompose.slice(
    previewCompose.indexOf('  frontend:'),
    previewCompose.indexOf('  backend:'),
  )
  const server = fs.readFileSync(path.join(ROOT, 'server.ts'), 'utf8')

  it('baut als Produktion mit genau dem Messcontainer der Produktion', () => {
    expect(frontend).toMatch(/VITE_APP_ENV:\s*production/)
    expect(frontend).toMatch(new RegExp(`VITE_GTM_CONTAINER_ID:\\s*${PREVIEW_CONTAINER}`))
    // Kein zweiter Container im Image: die Preview darf nichts haben, was sie laden koennte.
    expect(compose).not.toMatch(/VITE_GTM_CONTAINER_ID_PREVIEW:/)
    expect(compose).not.toContain(PRODUCTION_CONTAINER)
  })

  it('setzt am Preview-Frontend APP_ENV=preview', () => {
    expect(previewFrontend).toMatch(/APP_ENV=preview/)
  })

  it('schreibt die Laufzeit-Umgebung als Meta-Tag in jede SSR-Antwort', () => {
    expect(server).toContain('<meta name="polaris-app-env" content="${RUNTIME_APP_ENV}">')
    expect(server).toMatch(/RUNTIME_APP_ENV_TAG\}\$\{i18nHeadTags/)
  })

  it('loest dieselben Bauwerte je Laufzeit-Umgebung richtig auf', () => {
    const build = { VITE_APP_ENV: 'production', VITE_GTM_CONTAINER_ID: PREVIEW_CONTAINER }
    expect(resolveAnalyticsConfig({ ...build, RUNTIME_APP_ENV: 'production' }).gtmContainerId).toBe(
      PREVIEW_CONTAINER,
    )
    expect(
      resolveAnalyticsConfig({ ...build, RUNTIME_APP_ENV: 'preview' }).gtmContainerId,
    ).toBeNull()
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
