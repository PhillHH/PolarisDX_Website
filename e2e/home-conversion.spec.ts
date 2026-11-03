import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type HomeResource = {
  hero: { cta_secondary: string }
  final_cta: { cta_primary: string }
  blog: { all_articles: string }
}

const resources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(
      readFileSync(resolve(process.cwd(), `public/locales/${locale}/home.json`), 'utf8'),
    ) as HomeResource,
  ]),
) as Record<(typeof SUPPORTED_LANGUAGES)[number], HomeResource>

/**
 * PT11.5 nach SC-023 (Owner 2026-11-03): „Angebot anfragen“ ist aus Kopfzeile und Buehne
 * entfernt, der ROI-Rechner von der Startseite. Es bleibt GENAU EIN GENERAL_SALES-Einstieg
 * (Schluss-CTA) plus die Wissens-Sekundaerkonversion; die Buehne bucht einen Infotermin.
 */
for (const locale of SUPPORTED_LANGUAGES) {
  test(`PT11.5 ${locale} keeps one primary conversion real and locale-aware`, async ({ page }) => {
    const response = await page.goto(`/${locale}/`)
    expect(response?.status()).toBe(200)

    const salesActions = page.locator('[data-cta-intent="GENERAL_SALES"]')
    await expect(salesActions).toHaveCount(1)
    const action = page.locator('[data-cta-intent="GENERAL_SALES"][data-cta-section="final_cta"]')
    await expect(action).toHaveText(resources[locale].final_cta.cta_primary)
    await expect(action).toHaveAttribute('data-cta-source', 'homepage')
    await expect(action).toHaveAttribute('data-cta-journey', 'general_sales')
    await expect(action).toHaveAttribute(
      'href',
      `/${locale}/contact?intent=quote&source=homepage&journey=general_sales&section=final_cta#kontaktformular`,
    )
    expect((await page.request.get(`/${locale}/contact`)).status()).toBe(200)

    const info = page.locator('[data-home-hero] [data-home-hero-cta]')
    await expect(info).toHaveText(resources[locale].hero.cta_secondary)
    await expect(info).toHaveAttribute('href', `/${locale}/contact`)

    await expect(page.locator('#roi-rechner')).toHaveCount(0)
    await expect(page.locator('a[href*="#roi-rechner"]')).toHaveCount(0)

    const knowledge = page.getByRole('link', { name: resources[locale].blog.all_articles })
    await expect(knowledge).toHaveAttribute('href', `/${locale}/articles`)
    await expect(knowledge).toHaveAttribute('data-home-secondary-conversion', 'knowledge')
    expect((await page.request.get(`/${locale}/articles`)).status()).toBe(200)
    await expect(page.locator('#blog article')).toHaveCount(3)
  })
}

test('PT11.5 contact context, focus and mobile overflow remain explicit', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/de/')

  const finalAction = page.locator('[data-cta-section="final_cta"]')
  await finalAction.scrollIntoViewIfNeeded()
  await finalAction.focus()
  await expect(finalAction).toBeFocused()
  await finalAction.click()
  await expect(page).toHaveURL(
    /\/de\/contact\?intent=quote&source=homepage&journey=general_sales&section=final_cta#kontaktformular$/,
  )
  await expect(page.getByRole('button', { name: 'Angebot', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})
