import { createRequire } from 'node:module'
import { readFileSync, readdirSync } from 'node:fs'
import { relative, resolve } from 'node:path'

import { expect, test, type Page } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const assetRoot = resolve('public/downloads/epigenetics')
// AP19 PT19.4: das Musterbefund-Paket ist der aktive Lead-Magnet und liegt
// ausserhalb von public/. Es wird ueber die Asset-ID ausgeliefert, nicht ueber
// eine oeffentliche URL — alle acht enthaltenen Dokumente bleiben einzeln frei.
const GATED_FILES = new Set(['PolarisDX_Musterbefunde_DE.zip'])
const GATED_ASSET_ID = 'rsc-epi-019'
const providerPattern =
  /(?:www\.googletagmanager\.com|(?:region1\.)?google-analytics\.com|stats\.g\.doubleclick\.net)/u

type JsonObject = Record<string, unknown>

const resources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(readFileSync(`public/locales/${locale}/epigenetics.json`, 'utf8')) as JsonObject,
  ]),
) as Record<(typeof SUPPORTED_LANGUAGES)[number], JsonObject>

const downloadResources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(readFileSync(`public/locales/${locale}/downloads.json`, 'utf8')) as JsonObject,
  ]),
) as Record<(typeof SUPPORTED_LANGUAGES)[number], JsonObject>

function filesBelow(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const child = resolve(path, entry.name)
    return entry.isDirectory() ? filesBelow(child) : [relative(assetRoot, child)]
  })
}

function docsPageFiles(resource: JsonObject): string[] {
  const sheets = resource.sheets as Array<{ file: string }>
  return [
    (resource.downloads as JsonObject).zipFile,
    (resource.samples as JsonObject).zipFile,
    ...sheets.map(({ file }) => file),
    (resource.compare as JsonObject).file,
    (resource.basics as JsonObject).file,
  ].filter((file) => !GATED_FILES.has(file as string)) as string[]
}

function language(file: string): 'de' | 'en' {
  const normalized = file.toLowerCase()
  return normalized.startsWith('de/') || normalized.includes('_de.') ? 'de' : 'en'
}

function htmlText(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('>', '&gt;')
    .replaceAll('<', '&lt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;')
}

function providerRequests(page: Page): string[] {
  const requests: string[] = []
  page.on('request', (request) => {
    if (providerPattern.test(request.url())) requests.push(request.url())
  })
  return requests
}

test('PT15.5 serves every physical Epigenetics asset without redirect or broken bytes', async ({
  request,
}) => {
  test.setTimeout(120_000)
  const files = filesBelow(assetRoot).sort()
  expect(files).toHaveLength(28)
  expect(files.some((file) => GATED_FILES.has(file))).toBe(false)

  for (const file of files) {
    const response = await request.get(`/downloads/epigenetics/${file}`, { maxRedirects: 0 })
    expect(response.status(), file).toBe(200)
    expect(response.headers().location, file).toBeUndefined()
    expect((await response.body()).byteLength, file).toBeGreaterThan(0)
  }
})

test('PT15.5 renders truthful FREE_PUBLIC and language disclosure in all ten locales', async ({
  request,
}) => {
  test.setTimeout(120_000)

  for (const locale of SUPPORTED_LANGUAGES) {
    const response = await request.get(`/${locale}/epigenetics/unterlagen`, { maxRedirects: 0 })
    expect(response.status(), locale).toBe(200)
    const html = await response.text()
    const chip = downloadResources[locale].chip_free
    expect(typeof chip, `${locale}: free disclosure`).toBe('string')
    expect(html, `${locale}: visible free disclosure`).toContain(htmlText(chip as string))
    expect(html, `${locale}: technical access class`).toContain(
      'data-resource-access="FREE_PUBLIC"',
    )

    const files = docsPageFiles(resources[locale])
    expect(new Set(files).size, `${locale}: page asset count`).toBe(12)

    // Das gegatete Paket steht als Gate-Einstieg auf der Seite — nicht als
    // Dateilink, und sein Dateiname taucht im Markup nicht auf.
    expect(html, `${locale}: gate entry`).toContain(`data-gate-trigger="${GATED_ASSET_ID}"`)
    for (const gated of GATED_FILES) {
      expect(html, `${locale}: ${gated} must not be linked`).not.toContain(gated)
    }
    for (const file of files) {
      expect(html, `${locale}: ${file}`).toContain(`href="/downloads/epigenetics/${file}"`)
      expect(html, `${locale}: ${file} language`).toContain(`hrefLang="${language(file)}"`)
    }
    if (locale !== 'de' && locale !== 'en') {
      expect(html, `${locale}: no fake locale asset`).not.toMatch(
        new RegExp(`/downloads/epigenetics/(?:${locale}/|[^"']+_${locale}\\.)`, 'iu'),
      )
    }
    expect(html, `${locale}: no preview host`).not.toMatch(
      /preview\.polarisdx\.net|localhost|127\.0\.0\.1/u,
    )
  }
})

for (const [locale, width] of [
  ['de', 390],
  ['en', 768],
  ['cs', 1440],
] as const) {
  test(`PT15.5 ${locale} resources stay responsive, accessible and consent-safe`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    const page = await context.newPage()
    const trackedRequests = providerRequests(page)
    await page.goto(`/${locale}/epigenetics/unterlagen`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    await expect(page.locator('[data-resource-access="FREE_PUBLIC"]').first()).toBeVisible()
    const eagerDocuments = await page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .map(({ name }) => name)
        .filter((name) => /\/downloads\/epigenetics\/.*\.(?:pdf|zip)(?:$|\?)/iu.test(name)),
    )
    expect(eagerDocuments).toEqual([])
    expect(trackedRequests).toEqual([])

    const overflow = await page.evaluate(
      () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)

    const downloadLinks = page.locator('main a[download]')
    expect(await downloadLinks.count()).toBe(12)
    await expect(page.locator(`[data-gate-trigger="${GATED_ASSET_ID}"]`)).toHaveCount(1)
    const accessibleNames = await downloadLinks.evaluateAll((links) =>
      links.map((link) => link.getAttribute('aria-label') || link.textContent?.trim()),
    )
    expect(accessibleNames.every(Boolean)).toBe(true)

    await page.addScriptTag({ path: axePath })
    const seriousOrCritical = await page.evaluate(async () => {
      const result = await (
        window as Window & {
          axe: {
            run: (
              context: string,
              options: Record<string, unknown>,
            ) => Promise<{ violations: Array<{ id: string; impact: string | null }> }>
          }
        }
      ).axe.run('main', {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      })
      return result.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
    })
    expect(seriousOrCritical).toEqual([])

    if (locale === 'de') {
      const download = page.waitForEvent('download')
      await downloadLinks.nth(2).click()
      await download
      await page.waitForTimeout(300)
      expect(trackedRequests).toEqual([])
    }
    await context.close()
  })
}
