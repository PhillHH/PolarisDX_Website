import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type HomeResource = {
  hero: { cta_secondary: string }
  blog: { all_articles: string }
  sc025: { contact: { visitor: string } }
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
  test(`SC-025 ${locale} contact, knowledge and shop links use current targets`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/`)
    expect(response?.status()).toBe(200)
    const contact = page.locator('[data-home-contact]')
    await expect(contact.locator('[data-core-service]')).toHaveCount(3)
    for (const link of await contact.locator('[data-core-service]').all()) {
      await expect(link).toHaveAttribute('href', `/${locale}/contact`)
    }
    await expect(contact.locator('[data-home-event-card]')).toHaveCount(1)
    await expect(contact.locator('[data-shop="practice"]')).toHaveAttribute('target', '_blank')
    await expect(contact.locator('[data-shop="panels"]')).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
    const knowledge = page.getByRole('link', { name: resources[locale].blog.all_articles })
    await expect(knowledge).toHaveAttribute('href', `/${locale}/articles`)
    await expect(knowledge).toHaveAttribute('data-home-secondary-conversion', 'knowledge')
    await expect(page.locator('#blog article')).toHaveCount(3)
    await expect(page.locator('#roi-rechner')).toHaveCount(0)
    await expect(page.locator('a[href*="#roi-rechner"]')).toHaveCount(0)
  })
}

test('SC-025 contact cards are keyboard reachable and route to the info-call page', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/de/')
  const first = page.locator('[data-home-contact] [data-core-service]').first()
  await expect(page.locator('[data-home-hero]')).toHaveAttribute('data-animation-ready', 'true')
  await first.scrollIntoViewIfNeeded()
  await first.focus()
  await expect(first).toBeFocused()
  await first.click()
  await expect(page).toHaveURL(/\/de\/contact$/)
  expect((await page.request.get('/de/articles')).status()).toBe(200)
})
