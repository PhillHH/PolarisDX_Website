import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type HomeResource = {
  testimonials: { q_open: string; q_close: string; next: string } & Record<
    string,
    { role: string; practice?: string; proof_text: string }
  >
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
  test(`SC-025 ${locale} renders all four sourced practice voices`, async ({ page }) => {
    const response = await page.goto(`/${locale}/`)
    expect(response?.status()).toBe(200)
    const proof = page.locator('[data-home-proof]')
    await expect(proof.locator('figure')).toHaveCount(4)
    const first = proof.locator('[data-testimonial-id="bastian_wessing"]')
    await expect(first).toHaveAttribute('data-claim-id', 'HCL-006')
    await expect(first.getByRole('blockquote')).toHaveText(
      `${resources[locale].testimonials.q_open}${resources[locale].testimonials.bastian_wessing.proof_text}${resources[locale].testimonials.q_close}`,
    )
    for (const id of ['richard_pollock', 'kristian_grimm', 'goran_stojanovic']) {
      const voice = proof.locator(`[data-testimonial-id="${id}"]`)
      await expect(voice).toHaveAttribute('data-claim-id', 'HCL-017')
      await expect(voice.getByRole('blockquote')).toHaveText(
        `${resources[locale].testimonials.q_open}${resources[locale].testimonials[id].proof_text}${resources[locale].testimonials.q_close}`,
      )
      await expect(voice).toContainText(resources[locale].testimonials[id].role)
    }
    await expect(proof.locator('[data-testimonial-id="martin_fischer"]')).toHaveCount(0)
    await expect(proof.getByRole('button')).toHaveCount(2)
    await expect(proof.getByRole('link')).toHaveCount(0)
    await expect(first.locator('img')).toHaveAttribute('loading', 'lazy')
  })
}

test('SC-025 practice voices page with buttons and remain overflow-free', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/de/')
  const proof = page.locator('[data-home-proof]')
  await expect(page.locator('[data-home-hero]')).toHaveAttribute('data-animation-ready', 'true')
  await proof.scrollIntoViewIfNeeded()
  const next = proof.getByRole('button', { name: resources.de.testimonials.next })
  await next.click()
  await expect(proof.getByText('2 / 4')).toBeVisible()
  await expect(next).toBeEnabled()
  await expect(proof.locator('[data-testimonial-id="richard_pollock"]')).toBeInViewport({
    ratio: 0.9,
  })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
