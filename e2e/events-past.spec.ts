import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

const expectedIds = [
  'nobel_biocare_dach_symposium',
  'dentale_themenwelt',
  'dgi_summer_event',
  'ids_cologne',
  'dgi_kongress_frankfurt',
  'dental_summer',
  'ids_innovation',
]

test('PT18.3 renders the merged, deduplicated Rückblick across x10', async ({ page }) => {
  test.setTimeout(90_000)

  for (const locale of locales) {
    const content = JSON.parse(readFileSync(`public/locales/${locale}/events.json`, 'utf8')) as {
      items: Record<string, { title: string }>
      past_items: Record<string, { title: string }>
    }
    const response = await page.goto(`/${locale}/events`)
    expect(response?.status(), locale).toBe(200)

    const archive = page.locator('[data-events-past]')
    const cards = archive.locator('[data-past-event-id]')
    await expect(cards).toHaveCount(7)
    expect(
      await cards.evaluateAll((items) =>
        items.map((item) => item.getAttribute('data-past-event-id')),
      ),
    ).toEqual(expectedIds)
    await expect(cards.nth(0)).toHaveAttribute('data-past-event-source', 'automatic')
    await expect(cards.nth(0)).toContainText(content.items.nobel_biocare_dach_symposium.title)
    await expect(cards.nth(3)).toHaveAttribute('data-past-event-source', 'static')
    await expect(cards.nth(3)).toContainText(content.past_items.ids_cologne.title)
    await expect(archive.locator('a')).toHaveCount(0)
  }
})

for (const [width, locale] of [
  [390, 'cs'],
  [768, 'pl'],
  [1440, 'de'],
] as const) {
  test(`PT18.3 archive is responsive and accessible at ${width}px in ${locale}`, async ({
    page,
  }) => {
    const providerRequests: string[] = []
    page.on('request', (request) => {
      if (/google-analytics|googletagmanager|doubleclick/u.test(request.url())) {
        providerRequests.push(request.url())
      }
    })
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(`/${locale}/events`)
    await expect(page.locator('[data-events-past]')).toBeVisible()

    const overflow = await page.evaluate(
      () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
    expect(providerRequests).toEqual([])

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
      ).axe.run('[data-events-past]', {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      })
      return result.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
    })
    expect(seriousOrCritical).toEqual([])
  })
}
