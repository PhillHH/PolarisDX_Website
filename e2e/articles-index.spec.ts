import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

import { articles } from '../src/data/articles'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const
const staleIds = ['first_checkup', 'managing_diabetes', 'home_care']

const resources = Object.fromEntries(
  locales.map((locale) => [
    locale,
    JSON.parse(readFileSync(`public/locales/${locale}/articles.json`, 'utf8')) as Record<
      string,
      { title: string; excerpt: string }
    >,
  ]),
) as Record<(typeof locales)[number], Record<string, { title: string; excerpt: string }>>

test('PT17.1 renders exactly six published canonical cards across x10', async ({
  page,
  request,
}) => {
  test.setTimeout(90_000)
  const checkedTargets = new Set<string>()

  for (const locale of locales) {
    const response = await page.goto(`/${locale}/articles`)
    expect(response?.status(), locale).toBe(200)
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    await expect(page.locator('main h1')).toHaveCount(1)
    const cards = page.locator('[data-article-card]')
    await expect(cards).toHaveCount(articles.length)
    await expect(page.locator('[data-article-card] img')).toHaveCount(4)
    expect(await page.locator('a[href*="vitamin-d3-implantologie"]').count()).toBe(0)

    for (const article of articles) {
      const card = page.locator(`[data-article-card="${article.slug}"]`)
      const target = `/${locale}/articles/${article.slug}`
      await expect(card).toHaveCount(1)
      await expect(card.locator(`a[href="${target}"]`)).toHaveAttribute(
        'aria-label',
        resources[locale][article.id].title,
      )
      await expect(card).toContainText(resources[locale][article.id].excerpt)
      await expect(card.locator('time')).toHaveAttribute('datetime', /^2025-\d{2}-\d{2}$/)
      if (!checkedTargets.has(target)) {
        const detail = await request.get(target, { maxRedirects: 0 })
        expect(detail.status(), target).toBe(200)
        expect(detail.headers().location).toBeUndefined()
        checkedTargets.add(target)
      }
    }

    for (const stale of staleIds) {
      expect(await page.locator(`a[href*="/articles/${stale}"]`).count()).toBe(0)
    }
    expect(await page.locator('a[href*="preview.polarisdx"]').count()).toBe(0)
  }
  expect(checkedTargets.size).toBe(60)
})

for (const [width, locale] of [
  [390, 'cs'],
  [768, 'pl'],
  [1440, 'fr'],
] as const) {
  test(`PT17.1 index is responsive and accessible at ${width}px in ${locale}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(`/${locale}/articles`)
    await expect(page.locator('[data-article-card]')).toHaveCount(6)
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
  })
}

test('PT17.1 index does not fetch article images before they are rendered', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.goto('/de/articles')
  await expect(page.locator('[data-article-card]')).toHaveCount(6)
  expect(requests.filter((url) => /preview\.polarisdx/u.test(url))).toEqual([])
  expect(requests.filter((url) => /google-analytics|googletagmanager/u.test(url))).toEqual([])
  expect(await page.locator('img[loading="lazy"]').count()).toBe(4)
})
