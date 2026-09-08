import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

type ServicesResource = {
  overview: {
    hero: {
      entry: {
        breadcrumb_label: string
        title: string
        primary_cta: string
        secondary_cta: string
        trust_label: string
        visual: { alt: string }
      }
    }
  }
}

const resources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(
      readFileSync(resolve(process.cwd(), `public/locales/${locale}/services.json`), 'utf8'),
    ) as ServicesResource,
  ]),
) as Record<(typeof SUPPORTED_LANGUAGES)[number], ServicesResource>

for (const locale of SUPPORTED_LANGUAGES) {
  test(`PT12.2 ${locale} renders a claim-safe Diagnostics entry with real actions`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/diagnostics`)
    expect(response?.status()).toBe(200)

    const copy = resources[locale].overview.hero.entry
    const hero = page.locator('[data-diagnostics-hero]')
    await expect(hero.getByRole('heading', { level: 1 })).toHaveText(copy.title)
    await expect(page.locator('main h1')).toHaveCount(1)
    await expect(hero.getByRole('navigation', { name: copy.breadcrumb_label })).toBeVisible()

    const primary = hero.getByRole('link', { name: copy.primary_cta })
    await expect(primary).toHaveAttribute('href', `/${locale}/contact?intent=quote#kontaktformular`)
    await expect(primary).toHaveAttribute('data-cta-intent', 'GENERAL_SALES')

    const secondary = hero.getByRole('link', { name: copy.secondary_cta })
    await expect(secondary).toHaveAttribute('href', '#diagnostics-services')
    await expect(hero.getByLabel(copy.trust_label)).toBeVisible()

    const image = hero.getByRole('img', { name: copy.visual.alt })
    await expect(image).toBeVisible()
    expect(
      await image.evaluate((element: HTMLImageElement) => ({
        complete: element.complete,
        naturalWidth: element.naturalWidth,
        naturalHeight: element.naturalHeight,
      })),
    ).toEqual({ complete: true, naturalWidth: 650, naturalHeight: 650 })

    await secondary.click()
    await expect(page).toHaveURL(new RegExp(`/${locale}/diagnostics#diagnostics-services$`))
    await expect(page.locator('#diagnostics-services')).toBeVisible()
  })
}

test('PT12.2 mobile keeps actions ahead of the visual, focusable and inside the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/de/diagnostics')

  const hero = page.locator('[data-diagnostics-hero]')
  const primary = hero.getByRole('link', { name: 'Angebot anfragen' })
  const secondary = hero.getByRole('link', { name: 'Leistungsbereiche entdecken' })
  const visual = hero.locator('[data-diagnostics-hero-visual]')

  await primary.focus()
  await expect(primary).toBeFocused()
  await secondary.focus()
  await expect(secondary).toBeFocused()

  const positions = await page.evaluate(() => {
    const primaryLink = document.querySelector<HTMLElement>('[data-cta-section="hero"]')
    const secondaryLink = document.querySelector<HTMLElement>('[data-diagnostics-secondary-entry]')
    const heroVisual = document.querySelector<HTMLElement>('[data-diagnostics-hero-visual]')
    return {
      primaryBeforeSecondary: Boolean(
        primaryLink?.compareDocumentPosition(secondaryLink as Node) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      ),
      secondaryBeforeVisual: Boolean(
        secondaryLink?.compareDocumentPosition(heroVisual as Node) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    }
  })
  expect(positions).toEqual({ primaryBeforeSecondary: true, secondaryBeforeVisual: true })

  await visual.scrollIntoViewIfNeeded()
  await expect(visual).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})
