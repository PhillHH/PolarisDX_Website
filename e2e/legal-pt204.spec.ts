import { createRequire } from 'node:module'

import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

const LOCALES = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

async function seriousCriticalFindings(page: Page) {
  await page.addScriptTag({ path: axePath })
  const results = await page.evaluate(() =>
    (
      window as unknown as {
        axe: { run: (o: unknown) => Promise<{ violations: { impact?: string }[] }> }
      }
    ).axe.run({ resultTypes: ['violations'] }),
  )
  return results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  )
}

test.describe('PT20.4 Legal — x10 routes, indexing, no CTA', () => {
  for (const locale of LOCALES) {
    for (const route of ['imprint', 'privacy', 'terms'] as const) {
      test(`${locale}/${route}: 200, canonical, noindex, no conversion CTA`, async ({ page }) => {
        const response = await page.goto(`/${locale}/${route}`)
        expect(response?.status()).toBe(200)
        await expect(page.locator('h1')).toHaveCount(1)
        // Canonical auf die sprachliche Eigen-URL, robots noindex/nofollow.
        const canonical = page.locator('link[rel="canonical"]')
        await expect(canonical).toHaveAttribute('href', new RegExp(`/${locale}/${route}$`))
        const robots = page.locator('meta[name="robots"]')
        await expect(robots).toHaveAttribute('content', /noindex/)
        // Legal-Seiten ohne Sales-/Conversion-CTA im Seiten-Content (der
        // globale Header-CTA ist site-weit und kein Seiten-Element).
        const main = page.locator('main')
        expect(await main.getByRole('button', { name: /angebot anfragen/i }).count()).toBe(0)
        expect(await main.getByRole('link', { name: /angebot anfragen/i }).count()).toBe(0)
      })
    }
  }

  test('de/privacy: beschreibt die reale Architektur (Consent Mode v2, Support, Retention)', async ({
    page,
  }) => {
    await page.goto('/de/privacy')
    const body = await page.locator('main').innerText()
    expect(body).toContain('Consent Mode v2')
    expect(body).toContain('Supportformular')
    expect(body).toContain('90 Tage')
    expect(body).toMatch(/Marketing/i)
  })

  test('/agb: permanenter serverseitiger Redirect auf /de/terms', async ({ page }) => {
    const resp = await page.context().request.get('/agb', { maxRedirects: 0 })
    expect(resp.status()).toBe(301)
    expect(resp.headers()['location']).toMatch(/\/de\/terms$/)
    await page.goto('/agb')
    expect(page.url()).toMatch(/\/de\/terms$/)
  })

  for (const locale of ['de', 'en', 'pl'] as const) {
    test(`${locale}/privacy + terms: axe serious/critical = 0`, async ({ page }) => {
      for (const route of ['privacy', 'terms'] as const) {
        await page.goto(`/${locale}/${route}`)
        await page.waitForLoadState('networkidle')
        await page.waitForTimeout(600)
        expect(await seriousCriticalFindings(page)).toEqual([])
      }
    })
  }

  test('de: kein horizontaler Overflow auf Legal-Longform (390px)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    for (const route of ['imprint', 'privacy', 'terms'] as const) {
      await page.goto(`/de/${route}`)
      await page.waitForLoadState('networkidle')
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }))
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth)
    }
  })
})
