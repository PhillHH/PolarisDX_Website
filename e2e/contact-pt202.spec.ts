import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

type ContactResource = {
  contact: { form: { marketing_consent: string; consent: string; success: string } }
}

const contactResources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(readFileSync(`public/locales/${locale}/contact.json`, 'utf8')) as ContactResource,
  ]),
)

const ANALYTICS_HOSTS = /googletagmanager|google-analytics|doubleclick|facebook|hotjar|clarity/i

async function seriousCriticalFindings(page: Page) {
  await page.addScriptTag({ path: axePath })
  const results = await page.evaluate(() =>
    (
      window as unknown as {
        axe: { run: (o: unknown) => Promise<{ violations: { impact?: string }[] }> }
      }
    ).axe.run({ resultTypes: ['violations'] }),
  )
  return results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  )
}

// Hydrations-Race (Dev-SSR): Vorbereitung abwarten, dann Wert setzen und
// gegenlesen — falls React den Pre-Hydration-Wert mit dem serverseitigen
// State zurueckgesetzt hat, ein zweites Mal setzen.
const fillStable = async (page: Page, selector: string, value: string) => {
  const loc = page.locator(selector)
  await loc.fill(value)
  if ((await loc.inputValue()) !== value) await loc.fill(value)
}

const fillValidForm = async (page: Page) => {
  await page.waitForLoadState('networkidle')
  await fillStable(page, '#name', 'E2E Test Praxis')
  await fillStable(page, '#email', 'e2e@praxis.example')
  // Feld-Pill-Gruppe: erste Option waehlen (Dental).
  await page.getByRole('button', { name: 'Dental' }).first().click()
  await fillStable(page, '#requirements', 'E2E: Angebot fuer ein POC-Panel erbeten.')
}

test.describe('PT20.2 Contact — x10 UI and consent separation', () => {
  for (const locale of SUPPORTED_LANGUAGES) {
    test(`${locale}: form renders localized with separate marketing consent`, async ({ page }) => {
      const response = await page.goto(`/${locale}/contact`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('form')).toBeVisible()
      await expect(page.locator('#consent')).toBeVisible()
      await expect(page.locator('#marketing-consent')).toBeVisible()
      await expect(page.locator('label[for="marketing-consent"]')).toContainText(
        contactResources[locale].contact.form.marketing_consent,
      )
      await expect(page.locator('h1')).toHaveCount(1)
    })
  }

  test('de: processing consent is required — submit without it blocks with a visible error', async ({
    page,
  }) => {
    await page.goto('/de/contact')
    await fillValidForm(page)
    await page.getByRole('button', { name: 'Angebot anfragen' }).last().click()
    await expect(page.locator('#consent-error')).toBeVisible()
    await expect(page.locator('form')).toBeVisible()
  })

  test('de: valid submit reaches a real persisted success state (DRY_RUN backend)', async ({
    page,
  }) => {
    await page.goto('/de/contact')
    await fillValidForm(page)
    await page.locator('#consent').check()
    await page.locator('#marketing-consent').check()
    await page.getByRole('button', { name: 'Angebot anfragen' }).last().click()
    await expect(page.locator('form [role="status"]')).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('form [role="status"]')).toContainText(
      contactResources.de.contact.form.success.slice(0, 30),
    )
  })

  test('pre-consent: zero analytics/marketing provider requests on the contact page', async ({
    page,
  }) => {
    const analyticsRequests: string[] = []
    page.on('request', (request) => {
      if (ANALYTICS_HOSTS.test(request.url())) analyticsRequests.push(request.url())
    })
    await page.goto('/de/contact')
    await fillValidForm(page)
    await page.locator('#consent').check()
    await page.getByRole('button', { name: 'Angebot anfragen' }).last().click()
    await expect(page.locator('form [role="status"]')).toBeVisible({ timeout: 10_000 })
    expect(analyticsRequests).toEqual([])
  })
})

test.describe('PT20.2 Contact — accessibility and responsive', () => {
  for (const locale of ['de', 'en', 'pl'] as const) {
    test(`${locale}: axe serious/critical = 0`, async ({ page }) => {
      await page.goto(`/${locale}/contact`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(800)
      expect(await seriousCriticalFindings(page)).toEqual([])
    })
  }

  test('de: no horizontal overflow at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/de/contact')
    await page.waitForLoadState('networkidle')
    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }))
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth)
  })
})
