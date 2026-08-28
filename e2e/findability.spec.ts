import { expect, test } from '@playwright/test'

const serviceSlugs = [
  'dental',
  'beauty',
  'longevity',
  'poc-systemloesungen',
  'praeventions-checks',
  'infektion-entzuendung',
  'stoffwechsel-herz',
  'hormon-tests',
  'kompatibilitaet-integration',
]

const reportSlugs = [
  'metabolic-health',
  'healthy-aging',
  'biologische-altersuhr',
  'telomer-analyse',
  'stress-monitor',
  'healthy-sport',
]

test.describe('PT07.3 internal findability', () => {
  test('diagnostics hub exposes all nine current services', async ({ page }) => {
    await page.goto('/de/diagnostics')

    for (const slug of serviceSlugs) {
      await expect(page.locator(`main a[href="/de/diagnostics/${slug}"]`).first()).toBeVisible()
    }
    await expect(page.locator('main a[href^="/de/services"]')).toHaveCount(0)
  })

  test('published article exposes its curated service routes', async ({ page }) => {
    await page.goto('/de/articles/die-gruene-praxis')

    await expect(page.locator('main a[href="/de/diagnostics/dental"]')).toBeVisible()
    await expect(page.locator('main a[href="/de/diagnostics/longevity"]')).toBeVisible()
  })

  test('epigenetics hub exposes deepening routes, anchors and six reports', async ({ page }) => {
    await page.goto('/de/epigenetics')

    for (const path of ['grundlagen', 'studienlage', 'unterlagen']) {
      await expect(page.locator(`main a[href="/de/epigenetics/${path}"]`)).toBeVisible()
    }
    for (const slug of reportSlugs) {
      await expect(
        page.locator(`main a[href="/de/epigenetics/musterbefund/${slug}"]`),
      ).toBeVisible()
    }
    await expect(page.locator('#musterbefunde')).toHaveCount(1)
    await expect(page.locator('#vergleich')).toHaveCount(1)
  })

  test('report and events pages retain real contextual exits', async ({ page }) => {
    await page.goto('/de/epigenetics/musterbefund/metabolic-health')
    await expect(page.locator('a[href="/de/epigenetics#musterbefunde"]').first()).toBeVisible()

    await page.goto('/de/events')
    await expect(page.locator('main a[href="/de/contact"]').first()).toBeVisible()
  })
})
