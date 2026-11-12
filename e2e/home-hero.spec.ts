import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type HomeResource = {
  hero: { title: string; cta_secondary: string }
  sc025: { hero: { pause: string; play: string } }
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
  test(`SC-025 ${locale} hero keeps the full H1, pause control and info-call target`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/`)
    expect(response?.status()).toBe(200)
    const hero = page.locator('[data-home-hero]')
    await expect(hero).toBeVisible()
    await expect(hero).toHaveAttribute('data-animation-ready', 'true')
    const h1 = hero.getByRole('heading', { level: 1 })
    await expect(h1).toHaveCount(1)
    await expect(h1).toHaveAccessibleName(resources[locale].hero.title)
    await expect(h1.locator('.sr-only')).toHaveText(resources[locale].hero.title)

    const action = hero.getByRole('link', { name: resources[locale].hero.cta_secondary })
    await expect(action).toHaveAttribute('href', `/${locale}/contact`)
    await expect(action).not.toHaveAttribute('data-cta-intent')
    await expect(hero.getByRole('link')).toHaveCount(1)
    expect((await page.request.get(`/${locale}/contact`)).status()).toBe(200)

    const pause = hero.getByRole('button', { name: resources[locale].sc025.hero.pause })
    await expect(pause).toHaveAttribute('aria-pressed', 'false')
    const bounds = await pause.boundingBox()
    expect(bounds?.height).toBeGreaterThanOrEqual(44)
    await pause.focus()
    await expect(pause).toBeFocused()
    await pause.click()
    await expect(
      hero.getByRole('button', { name: resources[locale].sc025.hero.play }),
    ).toHaveAttribute('aria-pressed', 'true')
    await expect(hero.locator('.sc025-hero-words > span:not(.is-on)')).toHaveCount(0)
  })
}

test('SC-025 hero animates after SSR and reduced motion keeps every phrase visible', async ({
  page,
}) => {
  await page.goto('/de/')
  const hero = page.locator('[data-home-hero]')
  await expect(hero).toHaveAttribute('data-animation-ready', 'true')
  await expect(hero.locator('.sc025-dashes i')).toHaveCount(3)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  await expect(hero.locator('.sc025-hero-words > span:not(.is-on)')).toHaveCount(0)
  await expect(page.locator('.sc025-trace')).toHaveAttribute('aria-hidden', 'true')
  await expect(page.locator('.sc025-trace')).toHaveCSS('pointer-events', 'none')
  expect(
    await page
      .locator('.sc025-trace [data-trace-path]')
      .evaluate((path: SVGPathElement) => path.style.strokeDashoffset),
  ).toBe('0')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
