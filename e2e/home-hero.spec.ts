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

    // SC-023 (Owner 2026-11-03): „Angebot anfragen“ ist aus der Bühne entfernt; die einzige
    // Aktion bucht einen Infotermin — Kontaktseite ohne Verkaufs-Attribution.
    const action = hero.getByRole('link', { name: resources[locale].hero.cta_secondary })
    await expect(action).toHaveAttribute('href', `/${locale}/contact`)
    await expect(action).not.toHaveAttribute('data-cta-intent', 'GENERAL_SALES')
    await expect(hero.locator('[data-cta-intent="GENERAL_SALES"]')).toHaveCount(0)
    await expect(hero.getByRole('link')).toHaveCount(1)
    expect((await page.request.get(`/${locale}/contact`)).status()).toBe(200)

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

test('PT11.1 mobile hierarchy keeps the action before the photo without overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/de/')

  const hero = page.locator('[data-home-hero]')
  const heading = hero.getByRole('heading', { level: 1 })
  const action = hero.getByRole('link', { name: resources.de.hero.cta_secondary })
  const visual = hero.locator('[data-home-hero-visual]')

  const order = await hero.evaluate((section) => {
    const nodes = [
      section.querySelector('h1'),
      section.querySelector('[data-home-hero-cta]'),
      section.querySelector('[data-home-hero-visual]'),
    ]
    return nodes.map((node) =>
      node ? Array.from(section.querySelectorAll('*')).indexOf(node) : -1,
    )
  })
  expect(order).toEqual([...order].sort((a, b) => a - b))
  expect(order.every((index) => index >= 0)).toBe(true)

  await expect(heading).toBeVisible()
  await expect(action).toBeVisible()
  await expect(visual).toBeVisible()
  await action.focus()
  await expect(action).toBeFocused()

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})
