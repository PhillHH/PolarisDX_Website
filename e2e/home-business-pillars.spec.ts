import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type HomeResource = {
  business_pillars: {
    title: string
    pillars: Record<'diagnostics' | 'igloo' | 'epigenetics', { title: string; cta: string }>
  }
  segments: Record<'dental' | 'beauty' | 'longevity', { title: string; cta: string }>
}

const resources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(
      readFileSync(resolve(process.cwd(), `public/locales/${locale}/home.json`), 'utf8'),
    ) as HomeResource,
  ]),
) as Record<(typeof SUPPORTED_LANGUAGES)[number], HomeResource>

const pillarPaths = {
  diagnostics: '/diagnostics',
  igloo: '/igloo-pro',
  epigenetics: '/epigenetics',
} as const

const corePaths = {
  dental: '/diagnostics/dental',
  beauty: '/diagnostics/beauty',
  longevity: '/diagnostics/longevity',
} as const

for (const locale of SUPPORTED_LANGUAGES) {
  test(`PT11.3 ${locale} exposes three independent pillars and real core-service targets`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/`)
    expect(response?.status()).toBe(200)

    const section = page.locator('[data-home-business-pillars]')
    await expect(section.getByRole('heading', { level: 2 })).toHaveText(
      resources[locale].business_pillars.title,
    )
    await expect(section.locator('[data-business-pillar]')).toHaveCount(3)

    for (const [pillarId, path] of Object.entries(pillarPaths)) {
      const pillar = section.locator(`[data-business-pillar="${pillarId}"]`)
      await expect(pillar).toHaveAttribute('href', `/${locale}${path}`)
      await expect(pillar.getByRole('heading', { level: 3 })).toHaveText(
        resources[locale].business_pillars.pillars[pillarId as keyof typeof pillarPaths].title,
      )
      expect((await page.request.get(`/${locale}${path}`)).status()).toBe(200)
    }

    await expect(section.locator('[data-core-service]')).toHaveCount(3)
    for (const [sourceId, path] of Object.entries(corePaths)) {
      const service = section.locator(`[data-core-service="${sourceId}"]`)
      await expect(service).toHaveAttribute('href', `/${locale}${path}`)
      await expect(service.getByRole('heading', { level: 4 })).toHaveText(
        resources[locale].segments[sourceId as keyof typeof corePaths].title,
      )
      expect((await page.request.get(`/${locale}${path}`)).status()).toBe(200)
    }

    await expect(page.locator('main a[href*="/services"]')).toHaveCount(0)
  })
}

test('PT11.3 mobile stacks all six links without overflow and preserves keyboard focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/de/')

  const section = page.locator('[data-home-business-pillars]')
  const links = section.getByRole('link')
  await expect(links).toHaveCount(6)

  for (let index = 0; index < 6; index += 1) {
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
