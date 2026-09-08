import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

type HomeResource = {
  trustbar: {
    aria: string
    cv: string
    ivdr: string
    minutes: string
    compat: string
  }
  testimonials: {
    title: string
    bastian_wessing: {
      role: string
      practice: string
      proof_text: string
    }
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
  test(`PT11.2 ${locale} Trust and Proof renders only sourced signals`, async ({ page }) => {
    const response = await page.goto(`/${locale}/`)
    expect(response?.status()).toBe(200)

    const trustbar = page.locator('[data-home-trustbar]')
    await expect(trustbar).toHaveAttribute('aria-label', resources[locale].trustbar.aria)
    await expect(trustbar.getByRole('listitem')).toHaveCount(4)
    for (const [claimId, key] of [
      ['HCL-002', 'cv'],
      ['HCL-003', 'ivdr'],
      ['HCL-004', 'minutes'],
      ['HCL-005', 'compat'],
    ] as const) {
      await expect(trustbar.locator(`[data-claim-id="${claimId}"]`)).toHaveText(
        resources[locale].trustbar[key],
      )
    }
    await expect(trustbar).not.toContainText(/Nobel Biocare|Premium[ -]?Partner/i)
    await expect(trustbar.locator('img')).toHaveCount(0)

    const proof = page.locator('[data-home-proof]')
    await expect(proof.getByRole('heading', { level: 2 })).toHaveText(
      resources[locale].testimonials.title,
    )
    const reference = proof.locator('[data-testimonial-id="bastian_wessing"]')
    await expect(reference).toHaveCount(1)
    await expect(reference).toHaveAttribute('data-claim-id', 'HCL-006')
    await expect(reference.getByRole('blockquote')).toHaveText(
      `„${resources[locale].testimonials.bastian_wessing.proof_text}“`,
    )
    await expect(reference).toContainText('Dr. Bastian Wessing')
    await expect(reference).toContainText(resources[locale].testimonials.bastian_wessing.role)
    await expect(reference).toContainText(resources[locale].testimonials.bastian_wessing.practice)
    await expect(proof.locator('figure')).toHaveCount(1)
    await expect(proof.getByRole('button')).toHaveCount(0)
    await expect(proof.getByRole('link')).toHaveCount(0)
    await expect(proof.locator('[aria-roledescription="carousel"]')).toHaveCount(0)
    await expect(reference.locator('img')).toHaveAttribute('loading', 'lazy')
  })
}

test('PT11.2 mobile Trust and Proof remains semantic and overflow-free', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/de/')

  const trustbar = page.locator('[data-home-trustbar]')
  const proof = page.locator('[data-home-proof]')
  await expect(trustbar).toBeVisible()
  await expect(proof).toBeVisible()
  await expect(trustbar.getByRole('list')).toBeVisible()
  await expect(proof.locator('figure')).toBeVisible()
  await expect(proof.getByRole('blockquote')).toBeVisible()
  await expect(proof.getByRole('button')).toHaveCount(0)
  await expect(proof.getByRole('link')).toHaveCount(0)

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})
