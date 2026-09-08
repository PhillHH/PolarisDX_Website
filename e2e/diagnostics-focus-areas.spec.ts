import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { diagnosticsFocusAreas } from '../src/data/diagnosticsHub'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type ServicesResource = {
  overview: { focus: { title: string } }
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
  test(`PT12.4 ${locale} renders six focus paths with clean product boundaries`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/diagnostics`)
    expect(response?.status()).toBe(200)

    const section = page.locator('[data-diagnostics-focus-areas]')
    await expect(section.getByRole('heading', { level: 2 })).toHaveText(
      resources[locale].overview.focus.title,
    )
    await expect(section.locator('[data-diagnostics-focus-area]')).toHaveCount(6)
    await expect(section.locator('[data-focus-link]')).toHaveCount(6)

    for (const { id, entry } of diagnosticsFocusAreas) {
      const area = section.locator(`[data-diagnostics-focus-area="${id}"]`)
      await expect(area).toBeVisible()
      await expect(area.getByRole('heading', { level: 3 })).toBeVisible()
      await expect(area.locator('[data-focus-link]')).toHaveAttribute(
        'href',
        `/${locale}${entry.route.path}`,
      )
    }

    await expect(section.locator('[data-context-link="igloo"]')).toHaveAttribute(
      'href',
      `/${locale}/igloo-pro`,
    )
    await expect(section.locator('[data-context-link="epigenetics"]')).toHaveAttribute(
      'href',
      `/${locale}/epigenetics`,
    )
    await expect(page.locator('[data-diagnostics-card]')).toHaveCount(9)
    await expect(page.locator('[data-diagnostics-card][href*="epigenetics"]')).toHaveCount(0)
    await expect(section.locator('a[href*="/services"]')).toHaveCount(0)
  })
}

for (const viewport of [
  { label: 'mobile', width: 390, height: 844, columns: 1 },
  { label: 'tablet', width: 768, height: 1024, columns: 2 },
  { label: 'wide', width: 1440, height: 1000, columns: 3 },
]) {
  test(`PT12.4 ${viewport.label} focus grid remains readable and responsive`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/de/diagnostics')

    const section = page.locator('[data-diagnostics-focus-areas]')
    const grid = section.locator('[data-diagnostics-focus-grid]')
    await grid.scrollIntoViewIfNeeded()
    expect(
      await grid.evaluate(
        (element) =>
          getComputedStyle(element).gridTemplateColumns.split(' ').filter(Boolean).length,
      ),
    ).toBe(viewport.columns)
    await expect(section.locator('[data-diagnostics-focus-area]')).toHaveCount(6)
    await expect(section.locator('[data-diagnostics-boundary]')).toHaveCount(2)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  })
}

test('PT12.4 keyboard order and focus remain explicit across focus and boundary links', async ({
  page,
}) => {
  await page.goto('/de/diagnostics')
  const links = page.locator(
    '[data-diagnostics-focus-areas] [data-focus-link], [data-diagnostics-focus-areas] [data-context-link]',
  )
  await expect(links).toHaveCount(8)
  await links.first().focus()

  for (let index = 0; index < 8; index += 1) {
    const link = links.nth(index)
    await expect(link).toBeFocused()
    expect(await link.evaluate((element) => getComputedStyle(element).boxShadow !== 'none')).toBe(
      true,
    )
    if (index < 7) await page.keyboard.press('Tab')
  }
})

test('PT12.4 representative canonical focus and boundary targets return HTTP 200', async ({
  request,
}) => {
  const targets = [
    ...diagnosticsFocusAreas.map(({ entry }) => `/de${entry.route.path}`),
    '/de/igloo-pro',
    '/de/epigenetics',
  ]
  expect(new Set(targets).size).toBe(8)

  for (const target of targets) {
    const response = await request.get(target, { maxRedirects: 0 })
    expect(response.status(), target).toBe(200)
  }
})
