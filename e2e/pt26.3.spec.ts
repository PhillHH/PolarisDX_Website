import fs from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

import { SAMPLE_BUNDLE_ASSET_ID } from '../src/content/resources/leadMagnetCandidates'
import { PT263_LEAD_DB, PT263_PORT } from './pt26.3.config'

/**
 * AP26 PT26.3 — was erst der Browser zeigt.
 *
 * 1. SEC-20: Gate und Epigenetik-Formular lesen das Journey-Envelope — ein gespeicherter
 *    Vorgang erscheint als Erfolg, nicht als Fehler (vorher: Fehlerhinweis, neuer Key,
 *    Duplikat bei erneutem Absenden).
 * 2. Origin-Grenze: eine fremde Seite kann weder per JSON-fetch (Preflight ohne Freigabe)
 *    noch per einfachem POST (Fetch Metadata → 403) einen Vorgang anlegen.
 *
 * Die Datenbank wird nur lesend geoeffnet, um Vorgaenge zu zaehlen; es werden keine
 * Inhalte ausgegeben.
 */

const require = createRequire(import.meta.url)
const Database = require('../server/node_modules/better-sqlite3')
const dbFile = fileURLToPath(new URL(PT263_LEAD_DB, import.meta.url))

function countLeads(journey: string): number {
  if (!fs.existsSync(dbFile)) return 0
  const db = new Database(dbFile, { readonly: true })
  try {
    return (
      db.prepare('SELECT COUNT(*) AS n FROM leads WHERE journey = ?').get(journey) as { n: number }
    ).n
  } finally {
    db.close()
  }
}

test.describe('PT26.3 · Envelope im Browser (SEC-20)', () => {
  test('Ressourcen-Gate zeigt nach dem Speichern den Download und liefert die Datei', async ({
    page,
  }) => {
    await page.goto('/de/downloads', { waitUntil: 'networkidle' })
    const trigger = page.locator(
      `[data-resource-id="${SAMPLE_BUNDLE_ASSET_ID}"] button[data-gate-asset]`,
    )
    await expect(async () => {
      if ((await page.locator('[data-gate-state]').count()) === 0) await trigger.click()
      await expect(page.locator('[data-gate-state="form"]')).toBeVisible({ timeout: 500 })
    }).toPass({ timeout: 20_000 })
    const before = countLeads('content_download')
    const gate = page.locator('[data-gate-state="form"]')
    await gate.locator('input[type="text"]').first().fill('Dr. PT Zweisechsdrei')
    await gate.locator('input[type="email"]').fill('pt263-gate@praxis.example')
    await gate.locator('input[type="text"]').nth(1).fill('Praxis PT26.3')
    await gate.locator('input[type="checkbox"]').first().check()
    await gate.locator('button[type="submit"]').click()

    const success = page.locator('[data-gate-state="success"]')
    await expect(success).toBeVisible({ timeout: 20_000 })
    await expect(page.getByText('Der Download konnte nicht vorbereitet werden')).toHaveCount(0)
    expect(countLeads('content_download')).toBe(before + 1)

    const download = page.waitForEvent('download')
    await success.locator('a[data-gate-download]').click()
    expect((await download).suggestedFilename()).toMatch(/\.zip$/)
  })

  test('Epigenetik-Anfrage zeigt nach dem Speichern einen Status statt eines Fehlers — genau ein Vorgang', async ({
    page,
  }) => {
    await page.goto('/de/epigenetics?panel=healthy-aging#inquiry', { waitUntil: 'networkidle' })
    const before = countLeads('epigenetics_inquiry')
    const form = page.locator('#inquiry')
    await page.getByLabel('Name').fill('Dr. PT Zweisechsdrei')
    await page.getByLabel('E-Mail').fill('pt263-epi@praxis.example')
    await page.getByLabel('Einrichtung / Unternehmen').fill('Praxis PT26.3')
    await page.getByLabel('Einrichtungstyp').selectOption('practice')
    await form.locator('input[type="checkbox"]').check()
    await page.getByRole('button', { name: 'Angebot anfragen' }).last().click()

    await expect(form.locator('[role="status"]').last()).toBeVisible({ timeout: 20_000 })
    await expect(form.locator('[role="alert"]')).toHaveCount(0)
    expect(countLeads('epigenetics_inquiry')).toBe(before + 1)
  })
})

test.describe('PT26.3 · Origin-Grenze im Browser', () => {
  test('eine fremde Origin legt weder per JSON-fetch noch per einfachem POST einen Vorgang an', async ({
    browser,
    request,
  }) => {
    // `localhost` und `127.0.0.1` sind verschiedene Sites. Die CSP der Seite wird fuer diese
    // Probe umgangen — gemessen wird die Server-Grenze, nicht `connect-src`.
    const context = await browser.newContext({ bypassCSP: true })
    const page = await context.newPage()
    await page.goto(`http://localhost:${PT263_PORT}/de/`, { waitUntil: 'domcontentloaded' })
    const before = countLeads('contact')
    const target = `http://127.0.0.1:${PT263_PORT}/api/contact`
    const body = JSON.stringify({
      name: 'Cross Site',
      email: 'cross-site@attacker.example',
      message: 'Fremde Seite',
      locale: 'de',
      processingConsent: true,
      consentAcceptedAt: '2026-09-15T09:00:00.000Z',
    })

    const jsonFetch = await page.evaluate(
      async ({ target, body }) => {
        try {
          const response = await fetch(target, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Idempotency-Key': 'pt263-cross-json' },
            body,
          })
          return `status ${response.status}`
        } catch (error) {
          return `blocked ${(error as Error).name}`
        }
      },
      { target, body },
    )
    expect(jsonFetch).toBe('blocked TypeError')

    const simplePost = page.waitForResponse(
      (response) => response.url() === target && response.request().method() === 'POST',
    )
    await page.evaluate(
      async ({ target, body }) => {
        await fetch(target, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body,
        })
      },
      { target, body },
    )
    const answered = await simplePost
    // Die Antwort ist opak (no-cors): lesbar ist nur der Status. Dass der 403 aus dem
    // Fetch-Metadata-Guard stammt, zeigt der Kontrast unten — ohne `Sec-Fetch-Site: cross-site`
    // endet derselbe text/plain-POST an der JSON-Pflicht mit 415.
    expect(answered.status()).toBe(403)

    const withoutMetadata = await request.post(target, {
      headers: { 'Content-Type': 'text/plain', 'Idempotency-Key': 'pt263-contrast-1' },
      data: body,
    })
    expect(withoutMetadata.status()).toBe(415)
    const crossSite = await request.post(target, {
      headers: {
        'Content-Type': 'text/plain',
        'Idempotency-Key': 'pt263-contrast-2',
        'Sec-Fetch-Site': 'cross-site',
      },
      data: body,
    })
    expect(crossSite.status()).toBe(403)
    expect(await crossSite.json()).toEqual({ accepted: false, code: 'CROSS_SITE_REQUEST' })

    expect(countLeads('contact')).toBe(before)
    await context.close()
  })
})
