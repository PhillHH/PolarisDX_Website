import { expect, test } from '@playwright/test'
import { services } from '../src/data/services'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

for (const locale of SUPPORTED_LANGUAGES) {
  test(`PT12.3 ${locale} renders nine unique locale-aware service cards`, async ({ page }) => {
    const response = await page.goto(`/${locale}/diagnostics`)
    expect(response?.status()).toBe(200)

    const cards = page.locator('[data-diagnostics-card]')
    await expect(cards).toHaveCount(9)

    const hrefs = await cards.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('href')),
    )
    expect(hrefs).toEqual(services.map(({ id }) => `/${locale}/diagnostics/${id}`))
    expect(new Set(hrefs).size).toBe(9)
    expect(hrefs.every((href) => !href?.includes('/services'))).toBe(true)

    for (const service of services) {
      const card = page.locator(`[data-diagnostics-card][data-diagnostics-service="${service.id}"]`)
      await expect(card).toBeVisible()
      await expect(card).toHaveAttribute('aria-label', /.+: .+/)
      await expect(card.getByRole('heading', { level: 3 })).toBeVisible()
      await expect(card.locator('svg')).toHaveCount(2)
    }
  })
}

for (const viewport of [
  { label: 'mobile', width: 390, height: 844, columns: 1 },
  { label: 'tablet', width: 768, height: 1024, columns: 2 },
  { label: 'desktop', width: 1024, height: 900, columns: 3 },
  { label: 'wide', width: 1440, height: 1000, columns: 3 },
]) {
  test(`PT12.3 ${viewport.label} grid is readable and remains inside the viewport`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.goto('/de/diagnostics')

    const cards = page.locator('[data-diagnostics-card]')
    await expect(cards).toHaveCount(9)
    const firstGrid = page.locator('[data-diagnostics-card-grid]').first()
    await firstGrid.scrollIntoViewIfNeeded()

    expect(
      await firstGrid.evaluate(
        (element) =>
          getComputedStyle(element).gridTemplateColumns.split(' ').filter(Boolean).length,
      ),
    ).toBe(viewport.columns)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)

    for (let index = 0; index < 9; index += 1) {
      const card = cards.nth(index)
      const title = card.getByRole('heading', { level: 3 })
      await expect(card).toBeVisible()
      expect(
        await title.evaluate((element) => element.scrollWidth <= element.clientWidth),
        `card ${index + 1} title must not be horizontally clipped`,
      ).toBe(true)
    }
  })
}

test('PT12.3 keyboard order follows the nine-card DOM sequence with visible focus', async ({
  page,
}) => {
  await page.goto('/de/diagnostics')
  const cards = page.locator('[data-diagnostics-card]')
  await cards.first().focus()

  for (let index = 0; index < 9; index += 1) {
    const card = cards.nth(index)
    await expect(card).toBeFocused()
    const focusStyle = await card.evaluate((element) => ({
      boxShadow: getComputedStyle(element).boxShadow,
      outline: getComputedStyle(element).outlineStyle,
    }))
    expect(focusStyle.boxShadow !== 'none' || focusStyle.outline !== 'none').toBe(true)
    if (index < 8) await page.keyboard.press('Tab')
  }
})

test('PT12.3 language switching preserves the hub and logical card structure', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/de/diagnostics')

  await page.getByRole('button', { name: 'Sprache wählen' }).click()
  await page.getByRole('button', { name: 'Polski' }).click()
  await page.waitForURL('/pl/diagnostics')

  const cards = page.locator('[data-diagnostics-card]')
  await expect(cards).toHaveCount(9)
  expect(
    await cards.evaluateAll((elements) => elements.map((card) => card.dataset.diagnosticsService)),
  ).toEqual(services.map(({ id }) => id))
  expect(
    await cards.evaluateAll((elements) => elements.map((card) => card.getAttribute('href'))),
  ).toEqual(services.map(({ id }) => `/pl/diagnostics/${id}`))
})

test('PT12.3 canonical German card targets return HTTP 200 without redirecting', async ({
  request,
}) => {
  for (const service of services) {
    const response = await request.get(`/de/diagnostics/${service.id}`, { maxRedirects: 0 })
    expect(response.status(), service.id).toBe(200)
  }
})
