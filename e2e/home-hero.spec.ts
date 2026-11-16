import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type HomeResource = {
  hero: { title: string }
  polaris_one: {
    name: string
    start: string
    preorder: string
    dev_note: string
    cuts: string[]
    chapters: Array<{ label: string; title: string; text: string }>
    log: Array<{ title: string; text: string }>
    price: { amount: string; deposit: string }
    controls: { timeline: string }
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
  test(`SC-030 ${locale} Polaris One stage keeps the full H1, price and pre-order target`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/`)
    expect(response?.status()).toBe(200)
    const stage = page.locator('[data-home-hero]')
    await expect(stage).toBeVisible()
    await expect(stage).toHaveAttribute('data-mode', 'gate')
    const h1 = stage.getByRole('heading', { level: 1 })
    await expect(h1).toHaveCount(1)
    await expect(h1).toHaveText(resources[locale].hero.title)
    const copy = resources[locale].polaris_one
    expect(copy.cuts).toHaveLength(5)
    expect(copy.chapters).toHaveLength(5)
    expect(copy.log).toHaveLength(7)
    const gate = stage.locator('[data-polaris-gate]')
    await expect(gate).toContainText(copy.name)
    await expect(gate).toContainText(copy.price.amount)
    await expect(gate).toContainText(copy.price.deposit)

    const action = gate.getByRole('link', { name: copy.preorder })
    await expect(action).toBeVisible()
    await expect(action).toHaveAttribute('href', `/${locale}/contact`)
    await expect(action).toHaveAttribute('data-home-hero-cta')
    await expect(action).not.toHaveAttribute('data-cta-intent')
    expect((await page.request.get(`/${locale}/contact`)).status()).toBe(200)
  })
}

test('SC-030 the film is fetched after load, starts on request and shows its controls', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/de/', { waitUntil: 'load' })
  const stage = page.locator('[data-home-hero]')
  await expect(stage).toHaveAttribute('data-animation-ready', 'true')
  const video = stage.locator('video')
  await expect(video).toHaveAttribute(
    'src',
    /\/media\/polaris-one\/polaris-one-trailer-(480|720)\.mp4$/,
  )
  await stage.getByRole('button', { name: resources.de.polaris_one.start }).click()
  await expect(stage).toHaveAttribute('data-mode', 'play')
  await expect(video).toHaveAttribute('src', /\/media\/polaris-one\/polaris-one-(720|1080)\.mp4$/)
  await expect(stage.locator('[data-polaris-gate]')).toBeHidden()
  await expect(
    stage.getByRole('slider', { name: resources.de.polaris_one.controls.timeline }),
  ).toBeVisible()
  await expect(stage.getByText(resources.de.polaris_one.dev_note)).toBeVisible()
  await expect
    .poll(() => video.evaluate((film: HTMLVideoElement) => film.currentTime))
    .toBeGreaterThan(0.5)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('SC-030 without motion the film is not fetched until the visitor starts it', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/de/', { waitUntil: 'networkidle' })
  const stage = page.locator('[data-home-hero]')
  const video = stage.locator('video')
  expect(await video.getAttribute('src')).toBeNull()
  await expect(stage.locator('.p1s-frame img')).toBeVisible()
  await expect(page.locator('.sc025-trace')).toHaveAttribute('aria-hidden', 'true')
  await stage.getByRole('button', { name: resources.de.polaris_one.start }).click()
  await expect(video).toHaveAttribute('src', /polaris-one-(720|1080)\.mp4$/)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
