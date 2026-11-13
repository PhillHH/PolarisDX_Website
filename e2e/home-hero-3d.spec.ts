import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test, type Page } from '@playwright/test'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

/**
 * SC-026 (Owner 2026-11-13, Lichtstimmung „Dramatisch"): Der IglooPro erscheint als 3D-Modell mit
 * Adapter und Testkassette. Es ist eine Zugabe — ohne Bewegung oder ohne WebGL bleibt der Lichtfilm
 * mit seinen drei Bildern stehen, und das Modul wird dann gar nicht erst geladen.
 */
const DEVICE_KEYS = ['start', 'running', 'analyte', 'verdict', 'range'] as const
type HomeResource = { sc025: { hero: { device?: Record<string, string> } } }
const resource = (locale: string) =>
  JSON.parse(
    readFileSync(resolve(process.cwd(), `public/locales/${locale}/home.json`), 'utf8'),
  ) as HomeResource

const collectProblems = (page: Page) => {
  const problems: string[] = []
  page.on('pageerror', (error) => problems.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(message.text())
  })
  return problems
}
const scrollToProgress = (page: Page, progress: number) =>
  page.evaluate((value) => {
    const film = document.querySelector<HTMLElement>('[data-home-hero]')!
    window.scrollTo(0, film.offsetTop + (film.offsetHeight - window.innerHeight) * value)
  }, progress)

test('SC-026 every language carries the labels of the device display', () => {
  for (const locale of SUPPORTED_LANGUAGES) {
    const device = resource(locale).sc025.hero.device ?? {}
    expect(Object.keys(device).sort(), locale).toEqual([...DEVICE_KEYS].sort())
    for (const key of DEVICE_KEYS) expect(device[key]?.trim(), `${locale} ${key}`).toBeTruthy()
  }
})

test('SC-026 the 3D device takes over the stage and keeps text above and button below the light line', async ({
  page,
}) => {
  const problems = collectProblems(page)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/de/')
  const hero = page.locator('[data-home-hero]')
  await expect(hero).toHaveAttribute('data-gl', 'on', { timeout: 30_000 })

  const canvas = hero.locator('[data-home-film-gl]')
  await expect(canvas).toHaveAttribute('aria-hidden', 'true')
  await expect(canvas).toHaveCSS('opacity', '1')
  await expect(canvas).toHaveCSS('pointer-events', 'none')
  const images = hero.locator('[data-home-film-views] img')
  await expect(images).toHaveCount(3)
  // Die Bilder treten zurück, bleiben aber als Textalternative des Geräts im Baum.
  await expect(images.first()).toHaveCSS('opacity', '0')
  await expect(images.first()).toHaveAttribute('alt', /\S/)
  await expect(hero.locator('[data-home-film-views]')).toHaveAttribute('data-ring-line', /^0\.\d+$/)

  const geometry = () =>
    hero.evaluate((section) => {
      const pin = section.querySelector<HTMLElement>('.sc025-film-pin')!
      const text = section.querySelector('[data-home-film-phases] > div.is-on p')!
      const action = section.querySelector('[data-home-hero-cta]')!
      const line = pin.getBoundingClientRect().top + pin.clientHeight * 0.6
      return {
        text: line - text.getBoundingClientRect().bottom,
        action: action.getBoundingClientRect().top - line,
      }
    })
  await expect.poll(async () => (await geometry()).text).toBeGreaterThan(8)
  await expect.poll(async () => (await geometry()).action).toBeGreaterThan(8)

  await scrollToProgress(page, 0.5)
  await expect(hero).toHaveAttribute('data-phase', '1')
  await expect.poll(async () => (await geometry()).text).toBeGreaterThan(8)
  await scrollToProgress(page, 0.95)
  await expect(hero).toHaveAttribute('data-phase', '2')
  await expect.poll(async () => (await geometry()).text).toBeGreaterThan(8)
  await expect(hero.getByRole('link')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect(problems).toEqual([])
})

test('SC-026 on a phone the 3D device runs without sideways scrolling or shifted text', async ({
  page,
}) => {
  const problems = collectProblems(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/en/')
  const hero = page.locator('[data-home-hero]')
  await expect(hero).toHaveAttribute('data-gl', 'on', { timeout: 30_000 })
  expect(
    await hero
      .locator('.sc025-film-pin')
      .evaluate((pin) => getComputedStyle(pin).getPropertyValue('--sc025-copy-shift').trim()),
  ).toBe('0px')
  await scrollToProgress(page, 0.95)
  await expect(hero).toHaveAttribute('data-phase', '2')
  await expect(hero.getByRole('link')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  expect(problems).toEqual([])
})

test('SC-026 without motion the 3D module is never requested', async ({ page }) => {
  const requested: string[] = []
  page.on('request', (request) => {
    if (/iglooScene/.test(request.url())) requested.push(request.url())
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/de/')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1500)
  const hero = page.locator('[data-home-hero]')
  await expect(hero).not.toHaveAttribute('data-gl', 'on')
  await expect(hero.locator('[data-home-film-gl]')).toBeHidden()
  await expect(hero.locator('[data-home-film-views] img').first()).toBeVisible()
  expect(requested).toEqual([])
})
