import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type HomeResource = {
  business_pillars: { pillars: Record<'diagnostics' | 'igloo' | 'epigenetics', { title: string }> }
}
const resources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(
      readFileSync(resolve(process.cwd(), `public/locales/${locale}/home.json`), 'utf8'),
    ) as HomeResource,
  ]),
) as Record<(typeof SUPPORTED_LANGUAGES)[number], HomeResource>
const paths = {
  diagnostics: '/diagnostics',
  igloo: '/igloo-pro',
  epigenetics: '/epigenetics',
} as const

for (const locale of SUPPORTED_LANGUAGES) {
  test(`SC-025 ${locale} product pillars and metrics use real routes and table headers`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/`)
    expect(response?.status()).toBe(200)
    const section = page.locator('[data-home-business-pillars]')
    await expect(section.locator('[data-business-pillar]')).toHaveCount(3)
    for (const [id, path] of Object.entries(paths)) {
      const pillar = section.locator(`[data-business-pillar="${id}"]`)
      await expect(pillar).toHaveAttribute('href', `/${locale}${path}`)
      await expect(pillar).toContainText(
        resources[locale].business_pillars.pillars[id as keyof typeof paths].title,
      )
      expect((await page.request.get(`/${locale}${path}`)).status()).toBe(200)
    }
    const table = section.getByRole('table')
    await expect(table.locator('thead th')).toHaveCount(3)
    await expect(table.locator('tbody th[scope="row"]')).toHaveCount(5)
    await expect(table).toContainText('CV < 2 %')
  })
}

test('SC-025 product cards remain overflow-free on mobile and the reader follows a mouse only', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/de/')
  const section = page.locator('[data-home-business-pillars]')
  await expect(page.locator('[data-home-hero]')).toHaveAttribute('data-animation-ready', 'true')
  for (const link of await section.getByRole('link').all()) {
    await link.scrollIntoViewIfNeeded()
    await link.focus()
    await expect(link).toBeFocused()
  }
  expect(await section.locator('img[loading="eager"]').count()).toBe(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 900 })
  const image = section.locator('.sc025-device img')
  await image.scrollIntoViewIfNeeded()
  await image.hover()
  expect(await image.evaluate((element: HTMLImageElement) => element.style.transform)).toBe('')
})
