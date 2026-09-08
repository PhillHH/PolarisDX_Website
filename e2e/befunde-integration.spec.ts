import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

import { BEFUND_ORDER, RADAR_VALUES, type BefundSlug } from '../src/content/befunde/meta'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const
const providerPattern =
  /(?:www\.googletagmanager\.com|(?:region1\.)?google-analytics\.com|stats\.g\.doubleclick\.net)/u

type ReportBlock = {
  id: string
  type: string
  display?: string
  axes?: string[]
  items?: Array<Record<string, unknown>>
  rows?: Array<{ cells?: string[] } | string[]>
}
type Report = { panel: string; blocks: ReportBlock[] }
type LocaleResource = {
  samples: { badge: string; items: Array<{ slug: BefundSlug; file: string }> }
}

const reports = Object.fromEntries(
  BEFUND_ORDER.map((slug) => [
    slug,
    JSON.parse(readFileSync(`src/content/befunde/${slug}.de.json`, 'utf8')) as Report,
  ]),
) as Record<BefundSlug, Report>

const localizedReports = Object.fromEntries(
  locales.map((locale) => [
    locale,
    Object.fromEntries(
      BEFUND_ORDER.map((slug) => [
        slug,
        JSON.parse(readFileSync(`src/content/befunde/${slug}.${locale}.json`, 'utf8')) as Report,
      ]),
    ),
  ]),
) as Record<(typeof locales)[number], Record<BefundSlug, Report>>

const resources = Object.fromEntries(
  locales.map((locale) => [
    locale,
    JSON.parse(readFileSync(`public/locales/${locale}/epigenetics.json`, 'utf8')) as LocaleResource,
  ]),
) as Record<(typeof locales)[number], LocaleResource>

const visibleSourceValues = (block: ReportBlock): string[] => {
  const values = new Set<string>()
  if (block.display) values.add(block.display)
  for (const item of block.items ?? []) {
    for (const key of ['display', 'firstDisplay', 'secondDisplay', 'delta']) {
      if (typeof item[key] === 'string' && item[key]) values.add(item[key] as string)
    }
  }
  for (const row of block.rows ?? []) {
    const cells = Array.isArray(row) ? row : row.cells
    cells?.filter(Boolean).forEach((cell) => values.add(cell))
  }
  return [...values]
}

test('PT16.5 renders the complete 60-case web matrix with truthful report/PDF context', async ({
  page,
  request,
}) => {
  test.setTimeout(240_000)
  const checkedPdfs = new Set<string>()

  for (const locale of locales) {
    for (const slug of BEFUND_ORDER) {
      const path = `/${locale}/epigenetics/musterbefund/${slug}`
      const response = await page.goto(path)
      expect(response?.status(), path).toBe(200)
      await expect(page.locator('html')).toHaveAttribute('lang', locale)
      await expect(page.locator('main h1')).toHaveText(localizedReports[locale][slug].panel)
      await expect(page.locator('#pflichthinweise')).toBeVisible()
      await expect(
        page.locator(`a[href^="/${locale}/epigenetics?source=musterbefund&panel=${slug}"]`).first(),
      ).toBeVisible()

      const sample = resources[locale].samples.items.find((entry) => entry.slug === slug)
      expect(sample, `${locale}/${slug}: sample metadata`).toBeDefined()
      const pdfHref = `/downloads/epigenetics/${sample!.file}`
      const pdfLinks = page.locator(`a[href="${pdfHref}"]`)
      expect(await pdfLinks.count(), `${locale}/${slug}: PDF link`).toBeGreaterThan(0)
      await expect(pdfLinks.first()).toHaveAttribute('hreflang', 'de')
      if (locale !== 'de') {
        await expect(
          page.getByText(resources[locale].samples.badge, { exact: true }).first(),
        ).toBeVisible()
      }

      if (!checkedPdfs.has(pdfHref)) {
        const pdf = await request.get(pdfHref, { maxRedirects: 0 })
        expect(pdf.status(), pdfHref).toBe(200)
        expect(pdf.headers()['content-type'], pdfHref).toContain('application/pdf')
        expect((await pdf.body()).byteLength, pdfHref).toBeGreaterThan(50_000)
        checkedPdfs.add(pdfHref)
      }

      const body = await page.locator('main').innerText()
      expect(body, `${locale}/${slug}: finite output`).not.toMatch(/\b(?:NaN|Infinity)\b/u)
      expect(await page.locator('main a[href*="preview.polarisdx"]').count()).toBe(0)
    }
  }
  expect(checkedPdfs.size).toBe(6)
})

test('PT16.5 keeps all six rendered chart/value surfaces equal to canonical source data', async ({
  page,
}) => {
  test.setTimeout(120_000)
  for (const slug of BEFUND_ORDER) {
    await page.goto(`/de/epigenetics/musterbefund/${slug}`)
    await page.locator('.befund-report details').evaluateAll((details) => {
      details.forEach((element) => {
        ;(element as HTMLDetailsElement).open = true
      })
    })

    for (const block of reports[slug].blocks) {
      // The cover is the page hero and deliberately does not create a second
      // fragment target. Every content block below it owns its validated ID.
      if (block.type === 'cover') continue
      const section = page.locator(`#${block.id}`)
      await expect(section, `${slug}: ${block.type}/${block.id}`).toHaveCount(1)
      const rendered = (await section.innerText()).replace(/\s/gu, '')
      for (const value of visibleSourceValues(block)) {
        expect(rendered, `${slug}/${block.id}: ${value}`).toContain(value.replace(/\s/gu, ''))
      }
      if (block.type === 'radar') {
        const vectors = RADAR_VALUES[slug]
        expect(vectors, `${slug}: radar vectors`).toBeDefined()
        const alternative = section.locator('.befund-chart-alternative')
        await expect(alternative).toBeVisible()
        for (const [index, axis] of (block.axes ?? []).entries()) {
          await expect(alternative.locator('dt', { hasText: axis })).toHaveCount(1)
          await expect(alternative.locator('dd').nth(index)).toContainText(
            `${vectors.profile[index]} / 10`,
          )
          if (vectors.reference) {
            await expect(alternative.locator('dd').nth(index)).toContainText(
              `${vectors.reference[index]} / 10`,
            )
          }
        }
      }
    }
  }
})

for (const slug of BEFUND_ORDER) {
  test(`PT16.5 Axe gate is clean for ${slug}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto(`/de/epigenetics/musterbefund/${slug}`)
    await page.locator('.befund-report details').evaluateAll((details) => {
      details.forEach((element) => {
        ;(element as HTMLDetailsElement).open = true
      })
    })
    await page.addScriptTag({ path: axePath })
    const findings = await page.evaluate(async () => {
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
    expect(findings).toEqual([])
  })
}

for (const [width, locale] of [
  [390, 'cs'],
  [768, 'pl'],
  [1440, 'fr'],
] as const) {
  test(`PT16.5 all reports remain responsive at ${width}px in ${locale}`, async ({ page }) => {
    for (const slug of BEFUND_ORDER) {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto(`/${locale}/epigenetics/musterbefund/${slug}`)
      const overflow = await page.evaluate(
        () =>
          Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
      )
      expect(overflow, `${locale}/${slug}`).toBeLessThanOrEqual(1)
      await expect(page.locator('main h1')).toBeVisible()
      await expect(page.locator('#pflichthinweise')).toBeVisible()
    }
  })
}

for (const slug of ['healthy-aging', 'stress-monitor', 'healthy-sport'] as const) {
  test(`PT16.5 print smoke keeps ${slug} complete`, async ({ page }) => {
    await page.goto(`/de/epigenetics/musterbefund/${slug}`)
    await page.waitForTimeout(750)
    await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')))
    await page.emulateMedia({ media: 'print' })
    await expect(page.locator('.befund-report')).toBeVisible()
    await expect(page.locator('#pflichthinweise')).toBeVisible()
    expect(await page.locator('.befund-report details:not([open])').count()).toBe(0)
    expect(
      await page
        .locator('.befund-table-scroll')
        .evaluateAll((nodes) =>
          nodes.every((node) => getComputedStyle(node).overflowX === 'visible'),
        ),
    ).toBe(true)
    for (const alternative of await page.locator('.befund-chart-alternative').all()) {
      await expect(alternative).toBeVisible()
    }
  })
}

test('PT16.5 keeps report payloads, PDFs and analytics lazy before consent', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.goto('/de/')
  await page.goto('/de/epigenetics/musterbefund/healthy-aging')
  await expect(page.locator('main h1')).toBeVisible()

  expect(requests.filter((url) => providerPattern.test(url))).toEqual([])
  expect(requests.filter((url) => /\.pdf(?:\?|$)/u.test(url))).toEqual([])
  for (const slug of BEFUND_ORDER.filter((candidate) => candidate !== 'healthy-aging')) {
    expect(
      requests.filter(
        (url) => url.includes(`/musterbefund/${slug}.`) || url.includes(`${slug}.de.json`),
      ),
    ).toEqual([])
  }
})
