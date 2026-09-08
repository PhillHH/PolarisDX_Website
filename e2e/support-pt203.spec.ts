import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

type SupportResource = {
  support: { form: { success: string; error: string; error_retryable: string } }
}

const supportResources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(readFileSync(`public/locales/${locale}/support.json`, 'utf8')) as SupportResource,
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

// Hydrations-Race (Dev-SSR): warten, fuellen, gegenlesen, ggf. wiederholen.
const fillStable = async (page: Page, selector: string, value: string) => {
  const loc = page.locator(selector)
  await loc.fill(value)
  if ((await loc.inputValue()) !== value) await loc.fill(value)
}

const PDF_BYTES = Buffer.from('%PDF-1.4\ne2e-test\n%%EOF')

const fillValidForm = async (page: Page, { withAttachment = false } = {}) => {
  await page.waitForLoadState('networkidle')
  await fillStable(page, '#name', 'E2E Support Praxis')
  await fillStable(page, '#email', 'e2e-support@praxis.example')
  await fillStable(page, '#udi', 'S0DA25000E2E01')
  await fillStable(page, '#swVersion', '1.8.42')
  await page.locator('#issueType').selectOption('hardware')
  await fillStable(page, '#subject', 'E2E: Reader startet nicht')
  await fillStable(page, '#description', 'E2E Beschreibung des Problems.')
  if (withAttachment) {
    await page.locator('#attachment').setInputFiles({
      name: 'e2e-log.pdf',
      mimeType: 'application/pdf',
      buffer: PDF_BYTES,
    })
  }
}

test.describe('PT20.3 Support — x10 UI and consent', () => {
  for (const locale of SUPPORTED_LANGUAGES) {
    test(`${locale}: form renders localized`, async ({ page }) => {
      const response = await page.goto(`/${locale}/support`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('form')).toBeVisible()
      await expect(page.locator('#consent')).toBeVisible()
      await expect(page.locator('#attachment')).toBeAttached()
      await expect(page.locator('h1')).toHaveCount(1)
    })
  }

  test('de: processing consent is required — submit without it blocks with a visible error', async ({
    page,
  }) => {
    await page.goto('/de/support')
    await fillValidForm(page)
    await page.getByRole('button', { name: 'Absenden' }).click()
    await expect(page.locator('form [role="alert"]')).toBeVisible()
    await expect(page.locator('form [role="status"]')).toHaveCount(0)
  })

  test('de: valid submit with allowed attachment reaches a persisted success state', async ({
    page,
  }) => {
    await page.goto('/de/support')
    await fillValidForm(page, { withAttachment: true })
    await page.locator('#consent').check()
    await page.getByRole('button', { name: 'Absenden' }).click()
    await expect(page.locator('form [role="status"]')).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('form [role="status"]')).toContainText(
      supportResources.de.support.form.success.slice(0, 30),
    )
  })

  test('pre-consent: zero analytics/marketing provider requests on the support page', async ({
    page,
  }) => {
    const analyticsRequests: string[] = []
    page.on('request', (request) => {
      if (ANALYTICS_HOSTS.test(request.url())) analyticsRequests.push(request.url())
    })
    await page.goto('/de/support')
    await fillValidForm(page)
    await page.locator('#consent').check()
    await page.getByRole('button', { name: 'Absenden' }).click()
    await expect(page.locator('form [role="status"]')).toBeVisible({ timeout: 10_000 })
    expect(analyticsRequests).toEqual([])
  })
})

test.describe('PT20.3 Support — accessibility and responsive', () => {
  for (const locale of ['de', 'en', 'pl'] as const) {
    test(`${locale}: axe serious/critical = 0`, async ({ page }) => {
      await page.goto(`/${locale}/support`)
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(800)
      expect(await seriousCriticalFindings(page)).toEqual([])
    })
  }

  test('de: no horizontal overflow at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/de/support')
    await page.waitForLoadState('networkidle')
    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }))
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth)
  })
})
