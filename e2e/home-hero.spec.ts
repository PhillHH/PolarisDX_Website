import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type HomeResource = {
  hero: { title: string; cta_secondary: string }
  sc025: { hero: { steps: Array<{ title: string; text: string }>; hint: string } }
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
  test(`SC-025 ${locale} Lichtfilm hero keeps the full H1, three steps and info-call target`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/`)
    expect(response?.status()).toBe(200)
    const hero = page.locator('[data-home-hero]')
    await expect(hero).toBeVisible()
    const h1 = hero.getByRole('heading', { level: 1 })
    await expect(h1).toHaveCount(1)
    await expect(h1).toHaveText(resources[locale].hero.title)
    expect(resources[locale].sc025.hero.steps).toHaveLength(3)
    for (const step of resources[locale].sc025.hero.steps) {
      await expect(hero.locator('[data-home-film-phases]')).toContainText(step.text)
    }

    const action = hero.getByRole('link', { name: resources[locale].hero.cta_secondary })
    await expect(action).toBeVisible()
    await expect(action).toHaveAttribute('href', `/${locale}/contact`)
    await expect(action).not.toHaveAttribute('data-cta-intent')
    await expect(hero.getByRole('link')).toHaveCount(1)
    expect((await page.request.get(`/${locale}/contact`)).status()).toBe(200)
  })
}

test('SC-025 Lichtfilm switches the device view while scrolling and stays pinned', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/de/')
  const hero = page.locator('[data-home-hero]')
  await expect(hero).toHaveAttribute('data-animation-ready', 'true')
  await expect(hero).toHaveAttribute('data-phase', '0')
  await expect(hero.locator('[data-home-film-views] img')).toHaveCount(3)
  const scrollToProgress = (progress: number) =>
    page.evaluate((value) => {
      const film = document.querySelector<HTMLElement>('[data-home-hero]')!
      window.scrollTo(0, film.offsetTop + (film.offsetHeight - window.innerHeight) * value)
    }, progress)
  await scrollToProgress(0.5)
  await expect(hero).toHaveAttribute('data-phase', '1')
  await expect(hero.locator('[data-home-film-views] img.is-on')).toHaveCount(1)
  const pinTop = await hero
    .locator('.sc025-film-pin')
    .evaluate((pin) => pin.getBoundingClientRect().top)
  expect(Math.abs(pinTop)).toBeLessThanOrEqual(1)
  await scrollToProgress(0.95)
  await expect(hero).toHaveAttribute('data-phase', '2')
  await expect(hero.getByRole('link')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('SC-025 Lichtfilm without motion shows every phase and the finished trace', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/de/')
  const hero = page.locator('[data-home-hero]')
  for (const step of resources.de.sc025.hero.steps) {
    await expect(hero.getByText(step.text)).toBeVisible()
  }
  await expect(hero.locator('.sc025-film-pin')).toHaveCSS('position', 'static')
  await expect(page.locator('.sc025-trace')).toHaveAttribute('aria-hidden', 'true')
  await expect(page.locator('.sc025-trace')).toHaveCSS('pointer-events', 'none')
  expect(
    await page
      .locator('.sc025-trace [data-trace-path]')
      .evaluate((path: SVGPathElement) => path.style.strokeDashoffset),
  ).toBe('0')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
