import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { services } from '../src/data/services'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const PUBLIC_ORIGIN = 'https://polarisdx.net'

type ServicesResource = {
  seo: { overview_title: string; overview_description: string }
  overview: {
    hero: { entry: { title: string; primary_cta: string } }
    focus: { title: string }
  }
}

const resources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(
      readFileSync(resolve(process.cwd(), `public/locales/${locale}/services.json`), 'utf8'),
    ) as ServicesResource,
  ]),
) as Record<(typeof SUPPORTED_LANGUAGES)[number], ServicesResource>

for (const locale of SUPPORTED_LANGUAGES) {
  test(`AP12 Closure ${locale} locale, route, conversion and SEO matrix`, async ({ page }) => {
    const response = await page.goto(`/${locale}/diagnostics`)
    expect(response?.status()).toBe(200)
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveText(resources[locale].overview.hero.entry.title)

    const cards = page.locator('[data-diagnostics-card]')
    await expect(cards).toHaveCount(9)
    expect(
      await cards.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href'))),
    ).toEqual(services.map(({ id }) => `/${locale}/diagnostics/${id}`))
    await expect(page.locator('[data-diagnostics-focus-area]')).toHaveCount(6)
    await expect(page.locator('[data-diagnostics-related-article]')).toHaveCount(3)
    await expect(page.locator('main a[href*="/services"]')).toHaveCount(0)

    const primary = page.locator('[data-diagnostics-hero] [data-cta-intent="GENERAL_SALES"]')
    await expect(primary).toHaveText(new RegExp(resources[locale].overview.hero.entry.primary_cta))
    await expect(primary).toHaveAttribute('data-cta-source', 'diagnostics')
    await expect(primary).toHaveAttribute('data-cta-journey', 'general_sales')
    await expect(primary).toHaveAttribute('href', `/${locale}/contact?intent=quote#kontaktformular`)

    const canonical = `${PUBLIC_ORIGIN}/${locale}/diagnostics`
    await expect(page.locator(`link[rel="canonical"][href="${canonical}"]`)).toHaveCount(1)
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
    await expect(page.locator('link[rel="alternate"]')).toHaveCount(11)
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      `${PUBLIC_ORIGIN}/de/diagnostics`,
    )
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index, follow/)
    await expect(page).toHaveTitle(`${resources[locale].seo.overview_title} | PolarisDX`)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      resources[locale].seo.overview_description,
    )
    expect(await page.locator('main').innerText()).not.toMatch(
      /(?:^|\s)(?:common|home|services|articles):[\w.-]+/,
    )
  })
}

test('AP12 Closure all 90 locale-aware service targets are direct HTTP 200', async ({
  request,
}) => {
  for (const locale of SUPPORTED_LANGUAGES) {
    for (const service of services) {
      const path = `/${locale}/diagnostics/${service.id}`
      const response = await request.get(path, { maxRedirects: 0 })
      expect(response.status(), path).toBe(200)
      expect(new URL(response.url()).pathname, path).toBe(path)
    }
  }
})

for (const viewport of [
  { locale: 'de', width: 360, height: 800 },
  { locale: 'pl', width: 390, height: 844 },
  { locale: 'en', width: 768, height: 1024 },
  { locale: 'fr', width: 1024, height: 900 },
  { locale: 'cs', width: 1440, height: 1000 },
  { locale: 'de', width: 1920, height: 1080 },
] as const) {
  test(`AP12 Closure visual/performance ${viewport.locale} ${viewport.width}px`, async ({
    page,
  }, testInfo) => {
    await page.addInitScript(() => {
      ;(window as Window & { __ap12Cls?: number }).__ap12Cls = 0
      new PerformanceObserver((entries) => {
        for (const entry of entries.getEntries()) {
          const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
          if (!shift.hadRecentInput) {
            ;(window as Window & { __ap12Cls?: number }).__ap12Cls! += shift.value ?? 0
          }
        }
      }).observe({ type: 'layout-shift', buffered: true })
    })
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto(`/${viewport.locale}/diagnostics`, { waitUntil: 'networkidle' })

    const sections = page.locator('main section')
    for (let index = 0; index < (await sections.count()); index += 1) {
      await sections.nth(index).scrollIntoViewIfNeeded()
    }
    await expect(page.locator('[data-diagnostics-hero]')).toBeVisible()
    await expect(page.locator('[data-diagnostics-card]')).toHaveCount(9)
    await expect(page.locator('[data-diagnostics-focus-area]')).toHaveCount(6)
    await expect(page.locator('[data-cta-intent="GENERAL_SALES"]')).not.toHaveCount(0)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    expect(
      await page.evaluate(() => (window as Window & { __ap12Cls?: number }).__ap12Cls ?? 0),
    ).toBeLessThan(0.1)
    await expect(page.locator('main img[loading="eager"]')).toHaveCount(1)
    await expect(
      page.locator('[data-diagnostics-related-articles] img[loading="lazy"]'),
    ).toHaveCount(3)

    await page.screenshot({
      path: testInfo.outputPath(`${viewport.locale}-${viewport.width}.png`),
      fullPage: true,
      animations: 'disabled',
    })
  })
}

for (const scenario of [
  { locale: 'de', width: 390, height: 844 },
  { locale: 'cs', width: 1920, height: 1080 },
] as const) {
  test(`AP12 Closure accessibility ${scenario.locale} ${scenario.width}px`, async ({ page }) => {
    await page.setViewportSize({ width: scenario.width, height: scenario.height })
    await page.goto(`/${scenario.locale}/diagnostics`)
    await page.addScriptTag({ path: axePath })
    const violations = await page.evaluate(async () => {
      const result = await window.axe.run(
        { include: [['main']] },
        { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } },
      )
      return result.violations.map(({ id, impact, nodes }) => ({
        id,
        impact,
        targets: nodes.map((node) => node.target),
      }))
    })
    expect(violations).toEqual([])
  })
}

test('AP12 Closure keyboard, breadcrumb, history and locale interactions remain real', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/de/diagnostics')

  const breadcrumbHome = page.locator('[data-diagnostics-hero] nav a').first()
  await breadcrumbHome.focus()
  await expect(breadcrumbHome).toBeFocused()

  const firstCard = page.locator('[data-diagnostics-card]').first()
  await firstCard.focus()
  await expect(firstCard).toBeFocused()
  await firstCard.click()
  await page.waitForURL('/de/diagnostics/dental')
  await page.goBack()
  await page.waitForURL('/de/diagnostics')
  await page.goForward()
  await page.waitForURL('/de/diagnostics/dental')
  await page.goBack()

  await page.getByRole('button', { name: 'Sprache wählen' }).click()
  await page.getByRole('button', { name: 'Polski' }).click()
  await page.waitForURL('/pl/diagnostics')
  await expect(page.locator('[data-diagnostics-card]')).toHaveCount(9)
})
