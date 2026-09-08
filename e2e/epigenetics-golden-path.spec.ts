import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

const require = createRequire(import.meta.url)
const Database = require('../server/node_modules/better-sqlite3')
const databasePath = process.env.LEAD_DB_PATH
const evidencePath = process.env.PT157_CRM_EVIDENCE_PATH
const providerPattern =
  /(?:www\.googletagmanager\.com|(?:region1\.)?google-analytics\.com|stats\.g\.doubleclick\.net)/u
const publicOrigin = 'https://polarisdx.net'
const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const
const routePaths = [
  '/epigenetics',
  '/epigenetics/grundlagen',
  '/epigenetics/studienlage',
  '/epigenetics/unterlagen',
  '/epigenetics/musterbefund/metabolic-health',
  '/epigenetics/musterbefund/healthy-aging',
  '/epigenetics/musterbefund/biologische-altersuhr',
  '/epigenetics/musterbefund/telomer-analyse',
  '/epigenetics/musterbefund/stress-monitor',
  '/epigenetics/musterbefund/healthy-sport',
] as const

test('PT15.7 verifies the complete 100-case HTTP, canonical, hreflang and sitemap matrix', async ({
  request,
}) => {
  test.setTimeout(180_000)
  const sitemapResponse = await request.get('/sitemap.xml', { maxRedirects: 0 })
  expect(sitemapResponse.status()).toBe(200)
  const sitemap = await sitemapResponse.text()

  for (const path of routePaths) {
    for (const locale of locales) {
      const localizedPath = `/${locale}${path}`
      const canonical = `${publicOrigin}${localizedPath}`
      const response = await request.get(localizedPath, { maxRedirects: 0 })
      expect(response.status(), localizedPath).toBe(200)
      expect(response.headers().location, localizedPath).toBeUndefined()
      const html = await response.text()
      expect(html, `${localizedPath}: lang`).toContain(`<html lang="${locale}"`)
      expect(html, `${localizedPath}: canonical`).toContain(`rel="canonical" href="${canonical}"`)
      expect(html.match(/rel="alternate"/gu), `${localizedPath}: hreflang count`).toHaveLength(11)
      expect(html, `${localizedPath}: x-default`).toContain(
        `rel="alternate" hrefLang="x-default" href="${publicOrigin}/de${path}"`,
      )
      expect(sitemap, `${localizedPath}: sitemap`).toContain(`<loc>${canonical}</loc>`)
      expect(html, `${localizedPath}: indexability`).not.toMatch(/name="robots" content="noindex/iu)
      expect(html, `${localizedPath}: preview leakage`).not.toMatch(
        /preview\.polarisdx\.net|localhost|127\.0\.0\.1/u,
      )
    }
  }
})

test('PT15.7 Search exposes the canonical locale-aware Hub target', async ({ page }) => {
  await page.goto('/de/')
  await page.getByRole('button', { name: 'Suche öffnen' }).first().click()
  await page.getByRole('searchbox', { name: 'Suchbegriff' }).fill('Epigenetik')
  const result = page.getByRole('dialog').locator('a[href="/de/epigenetics"]')
  await expect(result).toHaveCount(1)
  await expect(result).toBeVisible()
})

test('PT15.7 production Golden Path persists and hands off one contextual inquiry', async ({
  page,
}) => {
  test.setTimeout(90_000)
  if (!databasePath || !evidencePath) throw new Error('PT15.7 evidence paths are required')

  const analyticsRequests: string[] = []
  page.on('request', (request) => {
    if (providerPattern.test(request.url())) analyticsRequests.push(request.url())
  })

  await page.goto('/de/')
  const headerEntry = page.locator('header a[href="/de/epigenetics"]:visible').first()
  await expect(headerEntry).toBeVisible()
  await headerEntry.click()
  await expect(page).toHaveURL(/\/de\/epigenetics$/u)

  const panel = page.locator('[data-panel-slug="healthy-aging"]')
  await expect(panel).toBeVisible()
  await panel.locator('a[href*="/musterbefund/healthy-aging"]').click()
  await expect(page).toHaveURL(
    /\/de\/epigenetics\/musterbefund\/healthy-aging\?panel=healthy-aging$/u,
  )

  const inquiry = page
    .locator('a[href="/de/epigenetics?source=musterbefund&panel=healthy-aging#inquiry"]')
    .first()
  await expect(inquiry).toBeVisible()
  await inquiry.click()
  await expect(page.getByLabel('Panel-Interesse (optional)')).toHaveValue('healthy-aging')

  await page.getByLabel('Name').fill('Golden Path Test')
  await page.getByLabel('E-Mail').fill('golden-path@example.test')
  await page.getByLabel('Einrichtung / Unternehmen').fill('Golden Path Practice')
  await page.getByLabel('Einrichtungstyp').selectOption('practice')
  await page.locator('#inquiry input[name="processingConsent"]').check()
  await page.getByRole('button', { name: 'Angebot anfragen' }).last().click()

  await expect(page.getByRole('status')).toContainText('Anfrage gespeichert und weitergeleitet')
  expect(analyticsRequests).toEqual([])

  const database = new Database(databasePath, { readonly: true })
  const lead = database
    .prepare(
      `SELECT id, journey, status, subject_json AS subjectJson,
        context_json AS contextJson, consent_json AS consentJson,
        attempt_count AS attemptCount, handoff_state AS handoffState
       FROM leads ORDER BY created_at DESC LIMIT 1`,
    )
    .get() as Record<string, unknown>
  const events = database
    .prepare('SELECT event_type AS eventType FROM lead_events WHERE lead_id = ? ORDER BY id')
    .all(lead.id) as Array<{ eventType: string }>
  database.close()

  expect(lead).toMatchObject({
    journey: 'epigenetics_inquiry',
    status: 'DELIVERED',
    attemptCount: 1,
    handoffState: 'DELIVERED',
  })
  expect(JSON.parse(lead.contextJson as string)).toMatchObject({
    locale: 'de',
    source: 'musterbefund',
    panel: 'healthy-aging',
    originRoute: expect.stringContaining('/de/epigenetics'),
  })
  expect(JSON.parse(lead.consentJson as string)).toMatchObject({
    processingAccepted: true,
    marketing: 'DENIED',
  })
  expect(events.map(({ eventType }) => eventType)).toEqual(
    expect.arrayContaining(['LEAD_PERSISTED', 'HANDOFF_ATTEMPT', 'HANDOFF_DELIVERED']),
  )

  const deliveries = readFileSync(evidencePath, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as Record<string, unknown>)
  expect(deliveries).toHaveLength(1)
  expect(deliveries[0]).toMatchObject({
    leadId: lead.id,
    journey: 'epigenetics_inquiry',
    target: 'epigenetics',
    context: { locale: 'de', source: 'musterbefund', panel: 'healthy-aging' },
  })
})

for (const [label, path, width] of [
  ['hub-mobile-long-locale', '/cs/epigenetics', 390],
  ['deep-tablet', '/pl/epigenetics/studienlage', 768],
  ['panel-desktop', '/fr/epigenetics?panel=stress-monitor&focus=bgm#analysen', 1024],
  ['resources-wide', '/de/epigenetics/unterlagen', 1440],
  ['inquiry-mobile', '/cs/epigenetics?panel=healthy-aging#inquiry', 390],
] as const) {
  test(`PT15.7 visual smoke: ${label}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
    await page.goto(path)
    await page.waitForTimeout(1200)

    const overflow = await page.evaluate(
      () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
    await expect(page.locator('main h1')).toHaveCount(1)
    if (label === 'inquiry-mobile') {
      await expect(page.locator('#inquiry form')).toBeVisible()
      await expect(page.locator('#inquiry button[type="submit"]')).toBeVisible()
    }
    await page.screenshot({
      path: testInfo.outputPath(`${label}.png`),
      fullPage: true,
      animations: 'disabled',
    })
  })
}
