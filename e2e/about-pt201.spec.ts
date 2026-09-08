import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

type AboutResource = {
  hero: { primary_cta: string }
  seo: { title: string; description: string }
  pillars: {
    items: {
      diagnostics: { title: string; cta: string }
      igloo: { title: string; cta: string }
      epigenetics: { title: string; cta: string }
    }
  }
}

type AxeViolation = { impact?: string; id: string; help: string }

const aboutResources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(readFileSync(`public/locales/${locale}/about.json`, 'utf8')) as AboutResource,
  ]),
)

const ANALYTICS_HOSTS = /googletagmanager|google-analytics|doubleclick|facebook|hotjar|clarity/i

async function seriousCriticalFindings(page: Page): Promise<AxeViolation[]> {
  await page.addScriptTag({ path: axePath })
  const results = await page.evaluate(() =>
    (
      window as unknown as {
        axe: { run: (o: unknown) => Promise<{ violations: AxeViolation[] }> }
      }
    ).axe.run({ resultTypes: ['violations'] }),
  )
  return results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  )
}

test.describe('PT20.1 About — x10 routes, SEO, CTA and links', () => {
  for (const locale of SUPPORTED_LANGUAGES) {
    test(`${locale}: /${locale}/about is 200, canonical and fully localized`, async ({ page }) => {
      const response = await page.goto(`/${locale}/about`)
      expect(response?.status()).toBe(200)
      expect(response?.request().redirectedFrom()?.url() ?? null).toBeNull()

      await expect(page.locator('html')).toHaveAttribute('lang', locale)
      await expect(page.locator('h1')).toHaveCount(1)

      const canonical = page.locator('link[rel="canonical"]')
      await expect(canonical).toHaveCount(1)
      await expect(canonical).toHaveAttribute('href', new RegExp(`/${locale}/about$`))

      const hreflang = page.locator('link[rel="alternate"][hreflang]')
      await expect(hreflang).toHaveCount(11) // 10 locales + x-default
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
        'href',
        /\/de\/about$/,
      )

      const expectedTitle = aboutResources[locale].seo.title
      const titlePattern = expectedTitle.slice(0, 24).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      await expect(page).toHaveTitle(new RegExp(titlePattern))

      const metaDescription = page.locator('meta[name="description"]')
      await expect(metaDescription).toHaveAttribute(
        'content',
        aboutResources[locale].seo.description,
      )
    })
  }

  test('de: hero CTA is exactly "Angebot anfragen" and points to /de/contact', async ({ page }) => {
    await page.goto('/de/about')
    const heroCta = page.locator('main a', { hasText: 'Angebot anfragen' }).first()
    await expect(heroCta).toBeVisible()
    await expect(heroCta).toHaveAttribute('href', /\/de\/contact$/)
  })

  test('pillar cards link to canonical registry targets that return 200 without redirect', async ({
    page,
  }) => {
    await page.goto('/de/about')
    const expected: Record<string, string> = {
      diagnostics: '/de/diagnostics',
      igloo: '/de/igloo-pro',
      epigenetics: '/de/epigenetics',
    }
    for (const [pillar, path] of Object.entries(expected)) {
      const card = page.locator(`[data-about-pillar="${pillar}"]`)
      await expect(card).toBeVisible()
      await expect(card).toHaveAttribute('href', new RegExp(`${path}$`))
      const response = await page.request.get(path)
      expect(response.status(), path).toBe(200)
      expect(new URL(response.url()).pathname, path).toBe(path)
    }
  })

  test('epigenetics pillar copy is rendered as a standalone pillar', async ({ page }) => {
    await page.goto('/de/about')
    const epigenetics = page.locator('[data-about-pillar="epigenetics"]')
    await expect(epigenetics).toContainText(aboutResources.de.pillars.items.epigenetics.title)
    await expect(epigenetics).toContainText(aboutResources.de.pillars.items.epigenetics.cta)
  })

  test('pre-consent: zero analytics/marketing provider requests', async ({ page }) => {
    const analyticsRequests: string[] = []
    page.on('request', (request) => {
      if (ANALYTICS_HOSTS.test(request.url())) analyticsRequests.push(request.url())
    })
    await page.goto('/de/about')
    await page.waitForLoadState('networkidle')
    expect(analyticsRequests).toEqual([])
  })
})

test.describe('PT20.1 About — accessibility and responsive', () => {
  for (const locale of ['de', 'en', 'pl'] as const) {
    test(`${locale}: axe serious/critical = 0`, async ({ page }) => {
      await page.goto(`/${locale}/about`)
      await page.waitForLoadState('networkidle')
      // PageTransition/Reveal-Einblendung abwarten, damit axe keinen
      // Transition-Zwischenzustand (Opacity ~0) als Kontrastverletzung misst.
      await page.waitForTimeout(800)
      expect(await seriousCriticalFindings(page)).toEqual([])
    })
  }

  for (const locale of ['de', 'cs'] as const) {
    for (const viewport of [
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
      { width: 1440, height: 900 },
    ]) {
      test(`${locale}: no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
        await page.setViewportSize(viewport)
        await page.goto(`/${locale}/about`)
        await page.waitForLoadState('networkidle')
        // PageTransition/Reveal-Einblendung abwarten, damit axe keinen
        // Transition-Zwischenzustand (Opacity ~0) als Kontrastverletzung misst.
        await page.waitForTimeout(800)
        const metrics = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        }))
        expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth)
      })
    }
  }
})
