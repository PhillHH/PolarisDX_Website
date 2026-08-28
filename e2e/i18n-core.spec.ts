import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

const searchLabels = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => {
    const common = JSON.parse(
      readFileSync(resolve(process.cwd(), `public/locales/${locale}/common.json`), 'utf8'),
    ) as { a11y: { search: string } }
    return [locale, common.a11y.search]
  }),
) as Record<(typeof SUPPORTED_LANGUAGES)[number], string>

for (const locale of SUPPORTED_LANGUAGES) {
  test(`${locale}: SSR, hydration and html lang use the URL locale`, async ({ page }) => {
    const hydrationErrors: string[] = []
    page.on('console', (message) => {
      if (
        message.type() === 'error' &&
        /hydration|did not match|server rendered html/i.test(message.text())
      ) {
        hydrationErrors.push(message.text())
      }
    })

    const response = await page.goto(`/${locale}/`)
    expect(response?.status()).toBe(200)
    expect(await response!.text()).toMatch(new RegExp(`<html lang=["']${locale}["']`))

    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    await expect(page.getByRole('button', { name: searchLabels[locale] }).first()).toBeVisible()
    expect(hydrationErrors).toEqual([])
  })
}

test('URL locale wins over cookies and persisted language-like values', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('i18nextLng', 'en')
    localStorage.setItem('language', 'fr')
    document.cookie = 'language=it; path=/'
  })

  await page.goto('/pl/about')
  await expect(page.locator('html')).toHaveAttribute('lang', 'pl')
})

test('LanguageSwitcher derives exactly ten options from the canonical language list', async ({
  page,
}) => {
  await page.goto('/de/')
  const trigger = page.getByRole('button', { name: 'Sprache wählen' }).first()
  await trigger.click()
  await expect(trigger.locator('xpath=..').locator('div > button')).toHaveCount(10)
})
