import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test, type Page } from '@playwright/test'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const
const publicOrigin = 'https://polarisdx.net'
const rejectConsentLabels = {
  cs: 'Pouze nezbytné',
  de: 'Nur notwendige',
  pl: 'Tylko niezbędne',
} as const
const providerPattern =
  /(?:www\.googletagmanager\.com|(?:region1\.)?google-analytics\.com|stats\.g\.doubleclick\.net)/

function attribute(html: string, tagPattern: RegExp, name: string): string | undefined {
  const tag = html.match(tagPattern)?.[0]
  return tag
    ?.match(new RegExp(`${name}="([^"]*)"`, 'i'))?.[1]
    ?.replaceAll('&amp;', '&')
    .replaceAll('&#x27;', "'")
    .replaceAll('&quot;', '"')
}

function jsonLdSchemas(html: string): Array<Record<string, unknown>> {
  const value = html.match(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i,
  )?.[1]
  if (!value) return []
  const parsed = JSON.parse(value) as Record<string, unknown> | Array<Record<string, unknown>>
  return Array.isArray(parsed) ? parsed : [parsed]
}

function captureProviderRequests(page: Page) {
  const requests: string[] = []
  page.on('request', (request) => {
    if (providerPattern.test(request.url())) requests.push(request.url())
  })
  return requests
}

test('PT18.4 x10 SSR SEO, sitemap and schema truth matrix', async ({ request }) => {
  const sitemapResponse = await request.get('/sitemap.xml')
  expect(sitemapResponse.status()).toBe(200)
  const sitemap = await sitemapResponse.text()

  for (const locale of locales) {
    const copy = JSON.parse(readFileSync(`public/locales/${locale}/events.json`, 'utf8')) as {
      seo_title: string
      seo_description: string
      hero: { title: string }
    }
    const response = await request.get(`/${locale}/events`, { maxRedirects: 0 })
    expect(response.status(), locale).toBe(200)
    const html = await response.text()
    const canonical = `${publicOrigin}/${locale}/events`

    expect(html).toContain(`<h1`)
    expect(html).toContain(copy.hero.title)
    expect(html.replaceAll('&amp;', '&')).toContain(`${copy.seo_title} | PolarisDX`)
    expect(attribute(html, /<meta[^>]+name="description"[^>]*>/i, 'content'), locale).toBe(
      copy.seo_description,
    )
    expect(attribute(html, /<link[^>]+rel="canonical"[^>]*>/i, 'href')).toBe(canonical)
    expect(attribute(html, /<meta[^>]+property="og:url"[^>]*>/i, 'content')).toBe(canonical)
    expect(attribute(html, /<meta[^>]+name="twitter:url"[^>]*>/i, 'content')).toBe(canonical)
    expect(html.match(/<link[^>]+rel="alternate"[^>]*>/gi)).toHaveLength(11)
    for (const alternate of locales) {
      const tag = new RegExp(`<link[^>]+rel="alternate"[^>]+hreflang="${alternate}"[^>]*>`, 'i')
      expect(attribute(html, tag, 'href')).toBe(`${publicOrigin}/${alternate}/events`)
    }
    expect(
      attribute(html, /<link[^>]+rel="alternate"[^>]+hreflang="x-default"[^>]*>/i, 'href'),
    ).toBe(`${publicOrigin}/de/events`)
    expect(sitemap).toContain(`<loc>${canonical}</loc>`)
    expect(html).not.toMatch(/preview\.polarisdx\.net|localhost|127\.0\.0\.1/)

    const schemas = jsonLdSchemas(html)
    expect(schemas.map((schema) => schema['@type'])).toContain('BreadcrumbList')
    expect(schemas.filter((schema) => schema['@type'] === 'BusinessEvent')).toEqual([])
  }

  expect((await request.get('/de/events/phantom-event', { maxRedirects: 0 })).status()).toBe(404)
})

test('PT18.4 fresh and denied consent keep the Event page provider-silent and functional', async ({
  browser,
}) => {
  for (const decision of ['fresh', 'denied'] as const) {
    const context = await browser.newContext()
    const page = await context.newPage()
    const requests = captureProviderRequests(page)
    await page.goto('/de/events')

    if (decision === 'denied') {
      await page.getByRole('button', { name: 'Nur notwendige' }).click()
    }
    await page.waitForTimeout(500)
    expect(requests, decision).toEqual([])
    await expect(page.locator('[data-events-upcoming]')).toBeVisible()
    await expect(page.locator('[data-events-past]')).toBeVisible()
    await expect(page.locator('[data-event-external]')).toHaveCount(0)
    await expect(page.locator('[data-event-calendar]')).toHaveCount(0)

    if (decision === 'denied') {
      await page.locator('a[href="/de/contact"]').first().click()
      await expect(page).toHaveURL(/\/de\/contact$/)
      expect(requests).toEqual([])
    }
    await context.close()
  }
})

test('PT18.4 explicit analytics grant alone starts the existing provider bootstrap', async ({
  browser,
}) => {
  const context = await browser.newContext()
  const page = await context.newPage()
  const requests = captureProviderRequests(page)
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort())
  await page.goto('/en/events')

  await Promise.all([
    page.waitForRequest((request) => request.url().includes('googletagmanager.com/gtm.js')),
    page.getByRole('button', { name: 'Accept All' }).click(),
  ])
  expect(requests.filter((url) => url.includes('googletagmanager.com/gtm.js'))).toHaveLength(1)
  await context.close()
})

for (const [width, locale] of [
  [390, 'cs'],
  [768, 'pl'],
  [1440, 'de'],
] as const) {
  test(`PT18.4 page-level a11y/responsive/performance at ${width}px in ${locale}`, async ({
    page,
  }) => {
    const providerRequests = captureProviderRequests(page)
    const resourceUrls: string[] = []
    page.on('response', (response) => resourceUrls.push(response.url()))
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(`/${locale}/events`)
    await page.getByRole('button', { name: rejectConsentLabels[locale] }).click()
    await page.waitForTimeout(500)

    const overflow = await page.evaluate(
      () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
    expect(providerRequests).toEqual([])
    expect(resourceUrls.some((url) => /mapbox|fullcalendar|googleapis\.com\/maps/i.test(url))).toBe(
      false,
    )

    await page.keyboard.press('Tab')
    expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe('BODY')
    await page.addScriptTag({ path: axePath })
    const seriousOrCritical = await page.evaluate(async () => {
      const result = await (
        window as Window & {
          axe: {
            run: (options: Record<string, unknown>) => Promise<{
              violations: Array<{ id: string; impact: string | null }>
            }>
          }
        }
      ).axe.run({ runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })
      return result.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
    })
    expect(seriousOrCritical).toEqual([])
  })
}
