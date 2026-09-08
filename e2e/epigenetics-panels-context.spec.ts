import { createRequire } from 'node:module'

import { expect, test } from '@playwright/test'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const
const panels = [
  'metabolic-health',
  'healthy-aging',
  'biologische-altersuhr',
  'telomer-analyse',
  'stress-monitor',
  'healthy-sport',
] as const

test('six panel and report entrances are real across all ten locales', async ({ request }) => {
  for (const locale of locales) {
    const hub = await request.get(`/${locale}/epigenetics`)
    expect(hub.status()).toBe(200)
    const html = await hub.text()

    for (const panel of panels) {
      expect(html).toContain(`data-panel-slug="${panel}"`)
      expect(html).toContain(`href="/${locale}/epigenetics/musterbefund/${panel}?panel=${panel}"`)

      const report = await request.get(`/${locale}/epigenetics/musterbefund/${panel}`)
      expect(report.status()).toBe(200)
      expect(report.headers()['location']).toBeUndefined()
    }
  }
})

test('focus and panel context survive direct entry, reload, report and inquiry navigation', async ({
  page,
}) => {
  await page.goto('/de/epigenetics?panel=healthy-aging&focus=longevity#analysen')

  const selected = page.locator('[data-panel-slug="healthy-aging"]')
  await expect(selected).toHaveAttribute('data-panel-active', 'true')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://polarisdx.net/de/epigenetics',
  )
  await expect(page.locator('[data-panel-slug="metabolic-health"]')).toHaveAttribute(
    'data-panel-active',
    'false',
  )

  await page.reload()
  await expect(selected).toHaveAttribute('data-panel-active', 'true')
  await expect(page.getByText('Wofür suchen Sie?', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('Longevity und Prävention', { exact: true }).first()).toBeVisible()

  const reportLink = selected.locator('a[href*="/musterbefund/healthy-aging"]')
  await expect(reportLink).toHaveAttribute(
    'href',
    '/de/epigenetics/musterbefund/healthy-aging?panel=healthy-aging&focus=longevity',
  )
  await reportLink.click()
  await expect(page).toHaveURL(
    /\/de\/epigenetics\/musterbefund\/healthy-aging\?panel=healthy-aging&focus=longevity$/,
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://polarisdx.net/de/epigenetics/musterbefund/healthy-aging',
  )

  const inquiry = page
    .locator(
      'a[href="/de/epigenetics?source=musterbefund&panel=healthy-aging&focus=longevity#inquiry"]',
    )
    .first()
  await expect(inquiry).toBeVisible()
  await expect(
    page.locator('a[href="/de/epigenetics?panel=healthy-aging&focus=longevity#musterbefunde"]'),
  ).not.toHaveCount(0)

  await inquiry.click()
  await expect(page).toHaveURL(
    /\/de\/epigenetics\?source=musterbefund&panel=healthy-aging&focus=longevity#inquiry$/,
  )
  await expect(page.getByLabel('Panel-Interesse (optional)')).toHaveValue('healthy-aging')
})

test('unknown query values cannot create a seventh panel or false inquiry context', async ({
  page,
}) => {
  await page.goto('/de/epigenetics?panel=heilung-garantiert&focus=preis#analysen')
  await expect(page.locator('[data-panel-active="true"]')).toHaveCount(0)
  await expect(page.locator('[data-panel-slug]')).toHaveCount(6)
  await expect(page.locator('main')).not.toContainText('heilung garantiert')
})

test('selected panel cards stay responsive, Axe-clean and do not load report payloads', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/pl/epigenetics?panel=stress-monitor&focus=bgm#analysen')
  await page.waitForTimeout(1200)

  const overflow = await page.evaluate(
    () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)

  const loadedScripts = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .map(({ name }) => name)
      .filter((name) => name.endsWith('.js')),
  )
  for (const panel of panels) {
    expect(loadedScripts.some((url) => url.includes(`/${panel}-`))).toBe(false)
  }

  await page.addScriptTag({ path: axePath })
  const seriousOrCritical = await page.evaluate(async () => {
    const axe = (
      window as Window & {
        axe: {
          run: (
            context: string,
            options: Record<string, unknown>,
          ) => Promise<{
            violations: Array<{ id: string; impact: string | null }>
          }>
        }
      }
    ).axe
    const result = await axe.run('main', {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    })
    return result.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
  })
  expect(seriousOrCritical).toEqual([])
})
