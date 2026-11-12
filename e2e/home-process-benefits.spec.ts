import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type HomeResource = {
  why: { title: string; signals: Record<string, { title: string }> }
  steps: { aria_label: string; items: Record<string, { title: string }> }
}
const resources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(
      readFileSync(resolve(process.cwd(), `public/locales/${locale}/home.json`), 'utf8'),
    ) as HomeResource,
  ]),
) as Record<(typeof SUPPORTED_LANGUAGES)[number], HomeResource>

for (const locale of SUPPORTED_LANGUAGES) {
  test(`SC-025 ${locale} information and POC process stay semantic`, async ({ page }) => {
    const response = await page.goto(`/${locale}/`)
    expect(response?.status()).toBe(200)
    const why = page.locator('[data-home-information]')
    await expect(why.getByRole('heading', { level: 2 })).toHaveText(resources[locale].why.title)
    await expect(why.locator('[data-poc-signal]')).toHaveCount(3)
    for (const id of ['access', 'workflow', 'conversation']) {
      await expect(why.locator(`[data-poc-signal="${id}"]`)).toContainText(
        resources[locale].why.signals[id].title,
      )
    }
    await expect(why.locator('[data-benefit-audience]')).toHaveCount(0)
    const process = why.getByRole('table', { name: resources[locale].steps.aria_label })
    await expect(process.locator('thead th')).toHaveCount(2)
    for (const [index, id] of ['application', 'result', 'context'].entries()) {
      const row = process.locator(`[data-process-step="${id}"]`)
      await expect(row.locator('th')).toContainText(`0${index + 1}`)
      await expect(row).toContainText(resources[locale].steps.items[id].title)
    }
  })
}

test('SC-025 event table follows the real clock and mobile tables do not overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.clock.setFixedTime(new Date('2026-11-12T10:00:00+01:00'))
  await page.goto('/de/')
  await expect(page.locator('[data-home-event]')).toHaveCount(2)
  await expect(page.locator('[data-home-event-card="medica_2026"]')).toHaveCount(1)
  await page.clock.setFixedTime(new Date('2026-11-20T10:00:00+01:00'))
  await page.reload()
  await expect(page.locator('[data-home-event]')).toHaveCount(1)
  await expect(page.locator('[data-home-event-card="dgi_jahreskongress"]')).toHaveCount(1)
  await page.clock.setFixedTime(new Date('2026-11-29T10:00:00+01:00'))
  await page.reload()
  await expect(page.locator('[data-home-events]')).toHaveCount(0)
  await expect(page.locator('[data-home-event-card]')).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
