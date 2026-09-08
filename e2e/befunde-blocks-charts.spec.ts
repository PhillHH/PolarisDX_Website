import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

import { BEFUND_BLOCK_TYPES } from '../src/content/befunde/model'
import { BEFUND_ORDER, RADAR_VALUES } from '../src/content/befunde/meta'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

type Block = { id: string; type: string; axes?: string[] }
type Report = { blocks: Block[] }

const reports = Object.fromEntries(
  BEFUND_ORDER.map((slug) => [
    slug,
    JSON.parse(readFileSync(`src/content/befunde/${slug}.de.json`, 'utf8')) as Report,
  ]),
)

test('PT16.2 renders every productive block type without a silent fallback', async ({ page }) => {
  const found = new Set(
    Object.values(reports).flatMap(({ blocks }) => blocks.map(({ type }) => type)),
  )
  expect([...found].sort()).toEqual([...BEFUND_BLOCK_TYPES].sort())

  for (const slug of BEFUND_ORDER) {
    await page.goto(`/de/epigenetics/musterbefund/${slug}`)
    await expect(page.locator('main h1')).toBeVisible()
    for (const block of reports[slug].blocks.filter(({ type }) => type !== 'cover')) {
      await expect(page.locator(`#${block.id}`), `${slug}: ${block.type}/${block.id}`).toHaveCount(
        1,
      )
    }
  }
})

test('PT16.2 keeps table relationships and radar values source-true', async ({ page }) => {
  await page.goto('/de/epigenetics/musterbefund/healthy-aging')
  await expect(page.locator('.befund-report')).toBeVisible()
  await page.locator('.befund-report details').evaluateAll((details) => {
    details.forEach((element) => {
      ;(element as HTMLDetailsElement).open = true
    })
  })

  const tables = page.locator('.befund-table-scroll table')
  await expect(tables.first()).toBeAttached()
  for (let index = 0; index < (await tables.count()); index += 1) {
    const table = tables.nth(index)
    await expect(table.locator('caption')).toHaveCount(1)
    expect(await table.locator('thead th[scope="col"]').count()).toBeGreaterThan(0)
    expect(await table.locator('tbody th[scope="row"]').count()).toBeGreaterThan(0)
  }

  const radar = reports['healthy-aging'].blocks.find(({ type }) => type === 'radar')
  expect(radar?.axes).toBeDefined()
  const alternative = page.locator(`#${radar!.id} .befund-chart-alternative`)
  await expect(alternative).toBeVisible()
  for (const [index, axis] of radar!.axes!.entries()) {
    await expect(alternative.locator('dt', { hasText: axis })).toHaveCount(1)
    await expect(alternative.locator('dd').nth(index)).toContainText(
      `${RADAR_VALUES['healthy-aging']!.profile[index]} / 10`,
    )
    await expect(alternative.locator('dd').nth(index)).toContainText(
      `${RADAR_VALUES['healthy-aging']!.reference![index]} / 10`,
    )
  }
})

for (const [slug, width] of [
  ['healthy-aging', 390],
  ['biologische-altersuhr', 768],
  ['metabolic-health', 1440],
] as const) {
  test(`PT16.2 is responsive and Axe-clean for ${slug} at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(`/de/epigenetics/musterbefund/${slug}`)
    await page.waitForTimeout(500)

    const overflow = await page.evaluate(
      () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)

    await page.addScriptTag({ path: axePath })
    const seriousOrCritical = await page.evaluate(async () => {
      const result = await (
        window as Window & {
          axe: {
            run: (
              context: string,
              options: Record<string, unknown>,
            ) => Promise<{ violations: Array<{ id: string; impact: string | null }> }>
          }
        }
      ).axe.run('main', {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      })
      return result.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
    })
    expect(seriousOrCritical).toEqual([])
    await page.screenshot({
      path: testInfo.outputPath(`${slug}-${width}.png`),
      fullPage: false,
    })
  })
}

test('PT16.2 print view keeps report content, notices, tables, and chart alternatives', async ({
  page,
}) => {
  await page.goto('/de/epigenetics/musterbefund/healthy-aging')
  await expect(page.locator('.befund-report')).toBeVisible()
  // `beforeprint` is registered after client hydration. Production SSR can be
  // visually ready a fraction earlier, so wait for the interactive client
  // before exercising the native print lifecycle.
  await page.waitForTimeout(750)
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')))
  await page.emulateMedia({ media: 'print' })

  await expect(page.locator('header')).toBeHidden()
  await expect(page.locator('footer')).toBeHidden()
  await expect(page.locator('.befund-chart-alternative').first()).toBeVisible()
  expect(await page.locator('.befund-report details:not([open])').count()).toBe(0)
  expect(
    await page
      .locator('.befund-table-scroll')
      .first()
      .evaluate((node) => getComputedStyle(node).overflowX),
  ).toBe('visible')
  await expect(page.locator('#pflichthinweise')).toBeVisible()
  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')))
})
