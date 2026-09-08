import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

const localizedTitles = Object.fromEntries(
  locales.map((locale) => {
    const content = JSON.parse(readFileSync(`public/locales/${locale}/events.json`, 'utf8')) as {
      items: Record<string, { title: string }>
    }
    return [locale, content.items]
  }),
) as Record<(typeof locales)[number], Record<string, { title: string }>>

test('PT18.2 renders the fixed 2026-09-01 upcoming/ongoing projection across x10', async ({
  page,
}) => {
  test.setTimeout(90_000)

  for (const locale of locales) {
    const response = await page.goto(`/${locale}/events`)
    expect(response?.status(), locale).toBe(200)
    await expect(page.locator('html')).toHaveAttribute('lang', locale)

    const highlight = page.locator('[data-event-highlight]')
    await expect(highlight).toHaveCount(1)
    await expect(highlight).toHaveAttribute('data-event-id', 'dgi_jahreskongress')
    await expect(highlight).toHaveAttribute('data-event-status', 'upcoming')
    await expect(highlight).toContainText(localizedTitles[locale].dgi_jahreskongress.title)
    await expect(highlight).toContainText('Hamburg')
    await expect(highlight).toContainText('Nobel Biocare')

    const list = page.locator('ul li[data-event-id]')
    await expect(list).toHaveCount(2)
    expect(
      await list.evaluateAll((items) => items.map((item) => item.getAttribute('data-event-id'))),
    ).toEqual(['kite_education', 'dgi_jahreskongress'])
    await expect(list.nth(0)).toHaveAttribute('data-event-status', 'ongoing')
    await expect(list.nth(0)).toContainText(localizedTitles[locale].kite_education.title)
    await expect(list.nth(0)).toContainText('Sylt')
    await expect(list.nth(1)).toHaveAttribute('data-event-status', 'upcoming')

    await expect(page.locator('[data-event-external]')).toHaveCount(0)
    await expect(page.locator('[data-event-calendar]')).toHaveCount(0)
  }
})

for (const [width, locale] of [
  [390, 'cs'],
  [768, 'pl'],
  [1440, 'de'],
] as const) {
  test(`PT18.2 is responsive and accessible at ${width}px in ${locale}`, async ({ page }) => {
    const providerRequests: string[] = []
    page.on('request', (request) => {
      if (/google-analytics|googletagmanager|doubleclick/u.test(request.url())) {
        providerRequests.push(request.url())
      }
    })
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(`/${locale}/events`)
    await expect(page.locator('[data-event-highlight]')).toBeVisible()
    await expect(page.locator('li[data-event-id]')).toHaveCount(2)

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
      ).axe.run('[data-events-upcoming]', {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      })
      return result.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
    })
    expect(seriousOrCritical).toEqual([])
  })
}
