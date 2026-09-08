import { expect, test, type Browser, type Page } from '@playwright/test'

const providerPattern =
  /(?:www\.googletagmanager\.com|(?:region1\.)?google-analytics\.com|stats\.g\.doubleclick\.net)/
const collectPattern = /google-analytics\.com\/g\/collect/

function captureProviderRequests(page: Page) {
  const requests: string[] = []
  page.on('request', (request) => {
    if (providerPattern.test(request.url())) requests.push(request.url())
  })
  return requests
}

async function freshPage(browser: Browser) {
  const context = await browser.newContext()
  const page = await context.newPage()
  return { context, page, requests: captureProviderRequests(page) }
}

test('Basic Consent sends no provider request before a decision', async ({ browser }) => {
  const { context, page, requests } = await freshPage(browser)
  await page.goto('/en/igloo-pro', { waitUntil: 'networkidle' })
  await page.waitForTimeout(750)

  await expect(page.getByRole('button', { name: 'Accept All' })).toBeVisible()
  expect(requests).toEqual([])
  expect(requests.filter((url) => collectPattern.test(url))).toEqual([])
  await context.close()
})

test('Basic Consent sends no provider request after explicit denial', async ({ browser }) => {
  const { context, page, requests } = await freshPage(browser)
  await page.goto('/en/igloo-pro', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Only necessary' }).click()
  await page.waitForTimeout(750)

  expect(requests).toEqual([])
  expect(requests.filter((url) => collectPattern.test(url))).toEqual([])
  await context.close()
})

test('an explicit grant starts Google once and enables analytics without duplicate bootstrap', async ({
  browser,
}) => {
  const { context, page, requests } = await freshPage(browser)
  await page.goto('/en/igloo-pro', { waitUntil: 'networkidle' })

  await Promise.all([
    page.waitForRequest((request) => request.url().includes('googletagmanager.com/gtm.js')),
    page.getByRole('button', { name: 'Accept All' }).click(),
  ])
  await page.waitForTimeout(1500)

  expect(requests.filter((url) => url.includes('googletagmanager.com/gtm.js'))).toHaveLength(1)
  expect(requests.filter((url) => collectPattern.test(url)).length).toBeLessThanOrEqual(1)

  await page.locator('[data-cta-intent="GENERAL_SALES"]').first().click()
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(750)

  expect(requests.filter((url) => url.includes('googletagmanager.com/gtm.js'))).toHaveLength(1)
  expect(requests.filter((url) => collectPattern.test(url)).length).toBeGreaterThanOrEqual(1)
  expect(requests.filter((url) => collectPattern.test(url)).length).toBeLessThanOrEqual(2)
  await context.close()
})
