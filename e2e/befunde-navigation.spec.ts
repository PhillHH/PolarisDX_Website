import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

import { BEFUND_ORDER, getBefundNeighbors } from '../src/content/befunde/meta'
import { LEGACY_ANCHORS } from '../src/content/befunde/legacyAnchors'

const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

type LocaleResource = {
  befund: { previous: string; next: string; othersTitle: string; backToAll: string }
}

const resources = Object.fromEntries(
  locales.map((locale) => [
    locale,
    JSON.parse(readFileSync(`public/locales/${locale}/epigenetics.json`, 'utf8')) as LocaleResource,
  ]),
) as Record<(typeof locales)[number], LocaleResource>

test('PT16.3 exposes deterministic navigation and five siblings in all 60 report cases', async ({
  page,
}) => {
  test.setTimeout(120_000)
  for (const locale of locales) {
    const labels = resources[locale].befund
    for (const slug of BEFUND_ORDER) {
      const response = await page.goto(
        `/${locale}/epigenetics/musterbefund/${slug}?panel=${slug}&focus=longevity&campaign=pt16-3`,
      )
      expect(response?.status(), `${locale}/${slug}`).toBe(200)
      await expect(page.locator('main h1'), `${locale}/${slug}: content`).toBeVisible()
      const neighbors = getBefundNeighbors(slug)
      await expect(
        page.locator(
          `a[href="/${locale}/epigenetics?panel=${slug}&focus=longevity&campaign=pt16-3#musterbefunde"]`,
        ),
      ).not.toHaveCount(0)
      await expect(
        page.locator(
          `a[href="/${locale}/epigenetics?source=musterbefund&panel=${slug}&focus=longevity&campaign=pt16-3#inquiry"]`,
        ),
      ).not.toHaveCount(0)
      await expect(page.getByText(labels.othersTitle, { exact: true }).last()).toBeVisible()
      await expect(page.getByText(labels.backToAll, { exact: true }).last()).toBeVisible()

      if (neighbors.previous) {
        await expect(page.locator(`[data-report-previous="${neighbors.previous}"]`)).toBeVisible()
        await expect(page.getByText(labels.previous, { exact: true })).toBeVisible()
      } else {
        await expect(page.locator('[data-report-previous]')).toHaveCount(0)
      }
      if (neighbors.next) {
        await expect(page.locator(`[data-report-next="${neighbors.next}"]`)).toBeVisible()
        await expect(page.getByText(labels.next, { exact: true })).toBeVisible()
      } else {
        await expect(page.locator('[data-report-next]')).toHaveCount(0)
      }
      for (const sibling of BEFUND_ORDER.filter((candidate) => candidate !== slug)) {
        await expect(page.locator(`[data-report-sibling="${sibling}"]`)).toBeVisible()
      }
      await expect(page.locator('[data-report-sibling]')).toHaveCount(5)
      expect(await page.locator('main a[href*="/services"]').count()).toBe(0)
      expect(await page.locator('main a[href*="preview.polarisdx"]').count()).toBe(0)
    }
  }
})

test('PT16.3 preserves focus, campaign and report provenance through reload and Inquiry', async ({
  page,
}) => {
  let submitted: Record<string, unknown> | undefined
  await page.route('**/api/epigenetics-inquiry', async (route) => {
    submitted = route.request().postDataJSON() as Record<string, unknown>
    await route.fulfill({
      status: 202,
      contentType: 'application/json',
      body: JSON.stringify({ accepted: true, leadId: 'pt16-3', status: 'PENDING_HANDOFF' }),
    })
  })
  await page.goto(
    '/de/epigenetics/musterbefund/healthy-aging?panel=healthy-aging&focus=longevity&campaign=report-campaign',
  )
  await page.reload()
  // The production SSR document exposes working native links immediately,
  // while the React router attaches its client navigation during hydration.
  // Waiting for that boundary keeps this context-handoff assertion from
  // racing the listener attachment after the preceding 60-page matrix.
  await page.waitForTimeout(750)

  await expect(page.locator('[data-report-previous="metabolic-health"]')).toHaveAttribute(
    'href',
    '/de/epigenetics/musterbefund/metabolic-health?panel=metabolic-health&focus=longevity&campaign=report-campaign',
  )
  await expect(page.locator('[data-report-next="biologische-altersuhr"]')).toHaveAttribute(
    'href',
    '/de/epigenetics/musterbefund/biologische-altersuhr?panel=biologische-altersuhr&focus=longevity&campaign=report-campaign',
  )

  const inquiry = page
    .locator(
      'a[href="/de/epigenetics?source=musterbefund&panel=healthy-aging&focus=longevity&campaign=report-campaign#inquiry"]',
    )
    .last()
  await inquiry.click()
  await expect(page).toHaveURL(
    /\/de\/epigenetics\?source=musterbefund&panel=healthy-aging&focus=longevity&campaign=report-campaign#inquiry$/,
  )
  await expect(page.getByLabel('Panel-Interesse (optional)')).toHaveValue('healthy-aging')
  await page.getByLabel('Name').fill('Ada Example')
  await page.getByLabel('E-Mail').fill('ada@example.test')
  await page.getByLabel('Einrichtung / Unternehmen').fill('Example Practice')
  await page.getByLabel('Einrichtungstyp').selectOption('practice')
  await page.locator('#inquiry input[type="checkbox"]').check()
  await page.getByRole('button', { name: 'Angebot anfragen' }).last().click()
  await expect(page.getByRole('status')).toContainText('Anfrage sicher gespeichert')
  expect(submitted).toMatchObject({
    locale: 'de',
    source: 'musterbefund',
    campaign: 'report-campaign',
    panel: 'healthy-aging',
    focus: 'longevity',
  })
})

test('PT16.3 resolves one evidenced legacy anchor per family and leaves unknown hashes safe', async ({
  page,
}) => {
  for (const slug of BEFUND_ORDER) {
    const [legacy, current] = Object.entries(LEGACY_ANCHORS[slug])[0]
    await page.goto(`/de/epigenetics/musterbefund/${slug}#${legacy}`)
    await expect(page).toHaveURL(new RegExp(`#${current}$`))
    await expect(page.locator(`#${current}`)).toHaveCount(1)
    const details = page.locator(`#${current} details`)
    if ((await details.count()) > 0) await expect(details).toHaveAttribute('open', '')
  }

  await page.goto('/de/epigenetics/musterbefund/healthy-aging#unknown-hash')
  await expect(page).toHaveURL(/#unknown-hash$/)
  await expect(page.locator('#unknown-hash')).toHaveCount(0)
})

test('PT16.3 report-internal route targets are live canonical destinations', async ({
  request,
}) => {
  for (const locale of locales) {
    const hub = await request.get(`/${locale}/epigenetics`, { maxRedirects: 0 })
    expect(hub.status()).toBe(200)
    for (const slug of BEFUND_ORDER) {
      const report = await request.get(`/${locale}/epigenetics/musterbefund/${slug}`, {
        maxRedirects: 0,
      })
      expect(report.status()).toBe(200)
      expect(report.headers().location).toBeUndefined()
    }
  }
})
