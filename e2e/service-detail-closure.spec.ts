import { createRequire } from 'node:module'
import { expect, test } from '@playwright/test'
import { services } from '../src/data/services'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

const accessibilityCases = services.map((service, index) => ({
  service: service.id,
  locale: ['de', 'en', 'pl', 'fr', 'cs'][index % 5],
  width: index % 2 === 0 ? 390 : 1440,
  height: index % 2 === 0 ? 844 : 1000,
}))

for (const scenario of accessibilityCases) {
  test(`AP13 Closure accessibility ${scenario.locale}/${scenario.service}`, async ({ page }) => {
    await page.setViewportSize({ width: scenario.width, height: scenario.height })
    await page.goto(`/${scenario.locale}/diagnostics/${scenario.service}`)
    const sections = page.locator('[data-service-detail-sections] section')
    for (let index = 0; index < (await sections.count()); index += 1) {
      await sections.nth(index).scrollIntoViewIfNeeded()
    }
    await page.locator('[data-service-detail-template="v1"] > div > aside').scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
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

for (const scenario of [
  { locale: 'de', service: 'dental', width: 360, height: 800 },
  { locale: 'en', service: 'poc-systemloesungen', width: 768, height: 1024 },
  { locale: 'pl', service: 'kompatibilitaet-integration', width: 1024, height: 900 },
  { locale: 'fr', service: 'infektion-entzuendung', width: 1440, height: 1000 },
  { locale: 'cs', service: 'praeventions-checks', width: 1920, height: 1080 },
] as const) {
  test(`AP13 Closure visual ${scenario.locale} ${scenario.width}px`, async ({ page }, testInfo) => {
    await page.addInitScript(() => {
      ;(window as Window & { __ap13Cls?: number }).__ap13Cls = 0
      new PerformanceObserver((entries) => {
        for (const entry of entries.getEntries()) {
          const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
          if (!shift.hadRecentInput) {
            ;(window as Window & { __ap13Cls?: number }).__ap13Cls! += shift.value ?? 0
          }
        }
      }).observe({ type: 'layout-shift', buffered: true })
    })
    await page.setViewportSize({ width: scenario.width, height: scenario.height })
    await page.goto(`/${scenario.locale}/diagnostics/${scenario.service}`, {
      waitUntil: 'networkidle',
    })

    const sections = page.locator('[data-service-detail-sections] section')
    for (let index = 0; index < (await sections.count()); index += 1) {
      await sections.nth(index).scrollIntoViewIfNeeded()
    }
    await page.locator('[data-service-detail-template="v1"] > div > aside').scrollIntoViewIfNeeded()
    await expect(page.locator('[data-service-detail-template="v1"]')).toBeVisible()
    await expect(page.locator('[data-service-detail-sections] section')).toHaveCount(6)
    await expect(page.locator('[data-cta-intent="GENERAL_SALES"]')).toHaveCount(2)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    expect(
      await page.evaluate(() => (window as Window & { __ap13Cls?: number }).__ap13Cls ?? 0),
    ).toBeLessThan(0.1)

    await page.screenshot({
      path: testInfo.outputPath(`${scenario.locale}-${scenario.width}.png`),
      fullPage: true,
      animations: 'disabled',
    })
  })
}
