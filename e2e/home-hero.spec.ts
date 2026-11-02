import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

type HomeResource = {
  hero: {
    title: string
    cta: string
    cta_secondary: string
  }
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
  test(`PT11.1 ${locale} Hero is SSR-visible and links to locale-aware real targets`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/`)
    expect(response?.status()).toBe(200)

    const hero = page.locator('[data-home-hero]')
    await expect(hero).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(hero.getByRole('heading', { level: 1 })).toHaveText(resources[locale].hero.title)

    const primary = hero.getByRole('link', { name: resources[locale].hero.cta })
    await expect(primary).toHaveAttribute(
      'href',
      `/${locale}/contact?intent=quote&source=homepage&journey=general_sales&section=hero#kontaktformular`,
    )
    await expect(primary).toHaveAttribute('data-cta-intent', 'GENERAL_SALES')
    await expect(primary).toHaveAttribute('data-cta-source', 'homepage')
    await expect(primary).toHaveAttribute('data-cta-journey', 'general_sales')
    expect((await page.request.get(`/${locale}/contact`)).status()).toBe(200)

    // SC-021: the second action books an info call — same contact page, no sales intent.
    const secondary = hero.getByRole('link', { name: resources[locale].hero.cta_secondary })
    await expect(secondary).toHaveAttribute('href', `/${locale}/contact`)
    await expect(secondary).not.toHaveAttribute('data-cta-intent', 'GENERAL_SALES')

    // SC-021: one decorative 16:10 photo card carries the LCP priority; no product cutout.
    const photo = hero.locator('[data-home-hero-photo] img')
    await expect(photo).toHaveCount(1)
    await expect(photo).toHaveAttribute('fetchpriority', 'high')
    await expect(photo).toHaveAttribute('loading', 'eager')
    await expect(photo).toHaveAttribute('alt', '')
    await expect(photo).toHaveAttribute('width', '1280')
    await expect(photo).toHaveAttribute('height', '800')
    expect(
      await photo.evaluate(
        (element: HTMLImageElement) => element.complete && element.naturalWidth > 0,
      ),
    ).toBe(true)
    await expect(hero.locator('img')).toHaveCount(1)
  })
}

test('PT11.1 mobile hierarchy keeps both actions before the photo without overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/de/')

  const hero = page.locator('[data-home-hero]')
  const heading = hero.getByRole('heading', { level: 1 })
  const primary = hero.getByRole('link', { name: resources.de.hero.cta })
  const secondary = hero.getByRole('link', { name: resources.de.hero.cta_secondary })
  const visual = hero.locator('[data-home-hero-visual]')

  const order = await hero.evaluate((section) => {
    const nodes = [
      section.querySelector('h1'),
      section.querySelector('[data-cta-intent="GENERAL_SALES"]'),
      section.querySelector('[data-home-hero-secondary]'),
      section.querySelector('[data-home-hero-visual]'),
    ]
    return nodes.map((node) =>
      node ? Array.from(section.querySelectorAll('*')).indexOf(node) : -1,
    )
  })
  expect(order).toEqual([...order].sort((a, b) => a - b))
  expect(order.every((index) => index >= 0)).toBe(true)

  await expect(heading).toBeVisible()
  await expect(primary).toBeVisible()
  await expect(secondary).toBeVisible()
  await expect(visual).toBeVisible()
  await primary.focus()
  await expect(primary).toBeFocused()
  await secondary.focus()
  await expect(secondary).toBeFocused()

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})
