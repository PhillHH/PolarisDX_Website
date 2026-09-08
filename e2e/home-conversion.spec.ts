import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type HomeResource = {
  hero: { cta: string }
  roi: { cta_consult: string; cta_report: string; form: { email: string; consent: string } }
  final_cta: { cta_primary: string; cta_secondary: string }
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

const sections = ['hero', 'roi', 'final_cta'] as const

for (const locale of SUPPORTED_LANGUAGES) {
  test(`PT11.5 ${locale} keeps primary and secondary conversion real and locale-aware`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/`)
    expect(response?.status()).toBe(200)

    const salesActions = page.locator('[data-cta-intent="GENERAL_SALES"]')
    await expect(salesActions).toHaveCount(3)
    for (const section of sections) {
      const action = page.locator(
        `[data-cta-intent="GENERAL_SALES"][data-cta-section="${section}"]`,
      )
      const expectedLabel =
        section === 'hero'
          ? resources[locale].hero.cta
          : section === 'roi'
            ? resources[locale].roi.cta_consult
            : resources[locale].final_cta.cta_primary
      await expect(action).toHaveText(expectedLabel)
      await expect(action).toHaveAttribute('data-cta-source', 'homepage')
      await expect(action).toHaveAttribute('data-cta-journey', 'general_sales')
      await expect(action).toHaveAttribute(
        'href',
        `/${locale}/contact?intent=quote&source=homepage&journey=general_sales&section=${section}#kontaktformular`,
      )
      expect((await page.request.get(`/${locale}/contact`)).status()).toBe(200)
    }

    const roiEntry = page.getByRole('link', { name: resources[locale].final_cta.cta_secondary })
    await expect(roiEntry).toHaveAttribute('href', `/${locale}#roi-rechner`)
    await expect(page.locator('#roi-rechner')).toBeAttached()

    const knowledge = page.getByRole('link', { name: resources[locale].blog.all_articles })
    await expect(knowledge).toHaveAttribute('href', `/${locale}/articles`)
    await expect(knowledge).toHaveAttribute('data-home-secondary-conversion', 'knowledge')
    expect((await page.request.get(`/${locale}/articles`)).status()).toBe(200)
    await expect(page.locator('#blog article')).toHaveCount(3)
  })
}

test('PT11.5 contact context, consent gate, focus and mobile overflow remain explicit', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/de/')

  const contextAction = page.locator('[data-cta-section="roi"]')
  await contextAction.scrollIntoViewIfNeeded()
  await contextAction.focus()
  await expect(contextAction).toBeFocused()

  await page.getByRole('button', { name: resources.de.roi.cta_report }).click()
  await expect(page.getByRole('textbox', { name: resources.de.roi.form.email })).toHaveAttribute(
    'required',
    '',
  )
  await expect(page.locator('#roi-rechner input[type="checkbox"]')).toHaveAttribute('required', '')

  const heroAction = page.locator('[data-cta-section="hero"]')
  await heroAction.click()
  await expect(page).toHaveURL(
    /\/de\/contact\?intent=quote&source=homepage&journey=general_sales&section=hero#kontaktformular$/,
  )
  await expect(page.getByRole('button', { name: 'Angebot', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})
