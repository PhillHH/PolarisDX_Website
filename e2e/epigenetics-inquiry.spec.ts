import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

test('PT15.6 renders productive inquiry copy in all ten locales', async ({ page }) => {
  test.setTimeout(120_000)
  for (const locale of locales) {
    await page.goto(`/${locale}/epigenetics?panel=healthy-aging#inquiry`)
    await page.waitForTimeout(300)
    const resource = JSON.parse(
      readFileSync(`public/locales/${locale}/epigenetics.json`, 'utf8'),
    ) as { inquiry: { submit: string; fields: { organization: string; facilityType: string } } }
    await expect(
      page.getByRole('button', { name: resource.inquiry.submit }).last(),
      locale,
    ).toBeVisible()
    await expect(
      page.getByLabel(resource.inquiry.fields.organization, { exact: true }),
      locale,
    ).toBeVisible()
    await expect(
      page.getByLabel(resource.inquiry.fields.facilityType, { exact: true }),
      locale,
    ).toBeVisible()
    await expect(page.locator('#inquiry'), `${locale}: no fallback keys`).not.toContainText(
      /inquiry\.(?:fields|status|errors)\./u,
    )
  }
})

test('PT15.6 preserves URL context, works without analytics consent and reports provider truth', async ({
  page,
}) => {
  const providerRequests: string[] = []
  page.on('request', (request) => {
    if (
      /google-analytics\.com|googletagmanager\.com|\/g\/collect|\/collect(?:\?|$)/u.test(
        request.url(),
      )
    ) {
      providerRequests.push(request.url())
    }
  })

  let submitted: Record<string, unknown> | undefined
  let idempotencyKey = ''
  await page.route('**/api/epigenetics-inquiry', async (route) => {
    submitted = route.request().postDataJSON() as Record<string, unknown>
    idempotencyKey = (await route.request().allHeaders())['idempotency-key'] || ''
    await route.fulfill({
      status: 202,
      contentType: 'application/json',
      // AP26 PT26.3: Antwortform des Servers (Journey-Envelope, AP22 PT22.5). Der fruehere Mock
      // `{ accepted, status }` bildete eine Form nach, die der Server nie lieferte (SEC-20).
      body: JSON.stringify({
        success: true,
        journey: 'epigenetics_inquiry',
        state: 'FAILED_TERMINAL',
        leadId: 'lead-browser-1',
        deliveryPending: false,
        providerConfigured: false,
      }),
    })
  })

  await page.goto(
    '/de/epigenetics?source=epigenetics&panel=healthy-aging&focus=longevity&campaign=browser-test#inquiry',
  )
  // Development SSR switches this lazy route to client rendering. Wait for
  // hydration before interacting so the controlled fields are not replaced.
  await page.waitForTimeout(750)
  await expect(page.getByLabel('Panel-Interesse (optional)')).toHaveValue('healthy-aging')
  await page.getByRole('button', { name: 'Angebot anfragen' }).last().click()
  await expect(page.getByLabel('Name')).toBeFocused()
  await page.getByLabel('Name').fill('Ada Example')
  await page.getByLabel('E-Mail').fill('ada@example.test')
  await page.getByLabel('Einrichtung / Unternehmen').fill('Example Practice')
  await page.getByLabel('Einrichtungstyp').selectOption('practice')
  await page.locator('#inquiry input[type="checkbox"]').check()
  await page.getByRole('button', { name: 'Angebot anfragen' }).last().click()

  await expect(page.getByRole('status')).toContainText('Anfrage sicher gespeichert')
  await expect(page.getByRole('status')).toContainText('nicht konfiguriert')
  expect(idempotencyKey).not.toBe('')
  expect(submitted).toMatchObject({
    locale: 'de',
    source: 'epigenetics',
    campaign: 'browser-test',
    panel: 'healthy-aging',
    focus: 'longevity',
    processingConsent: true,
    marketingConsent: false,
  })
  expect(providerRequests).toEqual([])

  await page.addScriptTag({ path: axePath })
  const seriousOrCritical = await page.evaluate(async () => {
    const axe = (window as unknown as { axe: typeof import('axe-core') }).axe
    const result = await axe.run(document.querySelector('#inquiry') as HTMLElement)
    return result.violations
      .filter(({ impact }) => impact === 'serious' || impact === 'critical')
      .map(({ id }) => id)
  })
  expect(seriousOrCritical).toEqual([])
})
