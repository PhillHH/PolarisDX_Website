import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { services } from '../src/data/services'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type ServicesResource = {
  overview: {
    ia: {
      title: string
      poc: { title: string }
      extended: { title: string }
    }
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
  test(`PT12.1 ${locale} renders the orientation and all nine canonical service families`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/diagnostics`)
    expect(response?.status()).toBe(200)

    const landscape = page.locator('[data-diagnostics-landscape]')
    await expect(landscape.getByRole('heading', { level: 2 })).toHaveText(
      resources[locale].overview.ia.title,
    )
    await expect(
      landscape.getByRole('heading', { level: 3, name: resources[locale].overview.ia.poc.title }),
    ).toBeVisible()
    await expect(
      landscape.getByRole('heading', {
        level: 3,
        name: resources[locale].overview.ia.extended.title,
      }),
    ).toBeVisible()

    const serviceLinks = page.locator('[data-diagnostics-service]')
    await expect(serviceLinks).toHaveCount(9)
    await expect(page.locator('[data-hub-priority="PRIMARY"]')).toHaveCount(3)

    for (const service of services) {
      const link = page.locator(`[data-diagnostics-service="${service.id}"]`)
      await expect(link).toHaveCount(1)
      await expect(link).toHaveAttribute('href', `/${locale}/diagnostics/${service.id}`)
      expect((await page.request.get(`/${locale}/diagnostics/${service.id}`)).status()).toBe(200)
    }

    await expect(page.locator('main a[href*="/services"]')).toHaveCount(0)
  })
}

test('PT12.1 mobile keeps all nine service families visible, focusable and within the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/de/diagnostics')

  const links = page.locator('[data-diagnostics-service]')
  await expect(links).toHaveCount(9)
  for (let index = 0; index < 9; index += 1) {
    const link = links.nth(index)
    await link.scrollIntoViewIfNeeded()
    await expect(link).toBeVisible()
    await link.focus()
    await expect(link).toBeFocused()
  }

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})
