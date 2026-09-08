import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { articles } from '../src/data/articles'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const publicOrigin = 'https://polarisdx.net'

type ArticleLocaleRecord = {
  title: string
  excerpt: string
  seo: { title: string }
}

const resources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(readFileSync(`public/locales/${locale}/articles.json`, 'utf8')),
  ]),
) as Record<string, Record<string, ArticleLocaleRecord>>

function decodeEntities(value: string | undefined): string | undefined {
  return value
    ?.replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
}

function attribute(html: string, selector: RegExp, name: string): string | undefined {
  const tag = html.match(selector)?.[0]
  return decodeEntities(tag?.match(new RegExp(`${name}="([^"]+)"`, 'i'))?.[1])
}

function titleText(html: string): string | undefined {
  return decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1])
}

test('PT17.4 verifies the full 6x10 HTTP and SEO metadata matrix', async ({ request }) => {
  test.setTimeout(120_000)

  for (const locale of SUPPORTED_LANGUAGES) {
    for (const article of articles) {
      const path = `/${locale}/articles/${article.slug}`
      const canonical = `${publicOrigin}${path}`
      const copy = resources[locale][article.id]
      const response = await request.get(path, { maxRedirects: 0 })
      expect(response.status(), path).toBe(200)
      expect(response.headers().location, path).toBeUndefined()
      const html = await response.text()

      expect(titleText(html), `${path}: title`).toBe(`${copy.seo.title} | PolarisDX`)
      expect(attribute(html, /<meta[^>]+name="description"[^>]*>/i, 'content')).toBe(copy.excerpt)
      expect(attribute(html, /<link[^>]+rel="canonical"[^>]*>/i, 'href')).toBe(canonical)
      expect(attribute(html, /<meta[^>]+property="og:url"[^>]*>/i, 'content')).toBe(canonical)
      expect(attribute(html, /<meta[^>]+property="og:title"[^>]*>/i, 'content')).toBe(
        `${copy.seo.title} | PolarisDX`,
      )
      expect(attribute(html, /<meta[^>]+property="og:description"[^>]*>/i, 'content')).toBe(
        copy.excerpt,
      )
      expect(attribute(html, /<meta[^>]+name="twitter:title"[^>]*>/i, 'content')).toBe(
        `${copy.seo.title} | PolarisDX`,
      )
      expect(html).not.toMatch(/property="article:modified_time"/i)
      expect(html).not.toContain('preview.polarisdx')

      const alternates = html.match(/<link[^>]+rel="alternate"[^>]*>/gi) ?? []
      expect(alternates, `${path}: hreflang`).toHaveLength(SUPPORTED_LANGUAGES.length + 1)
      expect(
        alternates.some(
          (tag) =>
            /hreflang="x-default"/i.test(tag) &&
            tag.includes(`href="${publicOrigin}/de/articles/${article.slug}"`),
        ),
        `${path}: x-default`,
      ).toBe(true)
    }
  }
})

test('PT17.4 keeps Article schema equal to visible metadata across all 60 pages', async ({
  page,
}) => {
  test.setTimeout(120_000)

  for (const locale of SUPPORTED_LANGUAGES) {
    for (const article of articles) {
      const path = `/${locale}/articles/${article.slug}`
      const response = await page.goto(path)
      expect(response?.status(), path).toBe(200)
      const copy = resources[locale][article.id]
      const schemas = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((nodes) =>
          nodes.flatMap((node) => {
            const parsed = JSON.parse(node.textContent || '{}')
            return Array.isArray(parsed) ? parsed : [parsed]
          }),
        )
      const schema = schemas.find((entry) => entry['@type'] === 'Article')

      expect(schema, path).toMatchObject({
        headline: copy.title,
        description: copy.excerpt,
        url: `${publicOrigin}${path}`,
        mainEntityOfPage: { '@id': `${publicOrigin}${path}` },
        datePublished: article.datePublished,
        author: { name: article.author },
        publisher: { name: 'PolarisDX' },
        inLanguage: locale,
      })
      expect(schema, path).not.toHaveProperty('dateModified')
      expect(schema, path).not.toHaveProperty('reviewedBy')
      await expect(page.locator('article[data-article-template] time').first()).toHaveAttribute(
        'datetime',
        article.datePublished,
      )
      await expect(page.locator('article[data-article-template]')).toContainText(article.author)
      await expect(page.locator('section', { hasText: /Quellen|Sources/u })).toHaveCount(0)
    }
  }
})

test('PT17.4 index order and published-only metadata stay consistent x10', async ({ page }) => {
  for (const locale of SUPPORTED_LANGUAGES) {
    await page.goto(`/${locale}/articles`)
    const cards = page.locator('[data-article-card]')
    await expect(cards).toHaveCount(articles.length)
    expect(
      await cards.evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('data-article-card')),
      ),
    ).toEqual(articles.map(({ slug }) => slug))
    await expect(cards.locator('time')).toHaveCount(articles.length)
    for (const [index, article] of articles.entries()) {
      await expect(cards.nth(index).locator('time')).toHaveAttribute(
        'datetime',
        article.datePublished,
      )
      await expect(cards.nth(index)).toContainText(article.author)
    }
  }
})

test('PT17.4 representative index and details remain responsive and Axe-clean', async ({
  page,
}) => {
  for (const [width, locale, path] of [
    [390, 'cs', '/articles'],
    [768, 'pl', `/articles/${articles[2].slug}`],
    [1440, 'fr', `/articles/${articles[3].slug}`],
  ] as const) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(`/${locale}${path}`)
    const overflow = await page.evaluate(
      () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    )
    expect(overflow, `${width}/${locale}${path}`).toBeLessThanOrEqual(1)
    await page.addScriptTag({ path: axePath })
    const violations = await page.evaluate(async () => {
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
    expect(violations).toEqual([])
  }
})

test('PT17.4 keeps article chunks and business navigation consent-safe', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.goto(`/de/articles/${articles[0].slug}`)
  await expect(page.locator('article[data-article-template]')).toBeVisible()

  expect(requests.filter((url) => /google-analytics|googletagmanager/u.test(url))).toEqual([])
  expect(requests.filter((url) => /preview\.polarisdx/u.test(url))).toEqual([])
  expect(requests.some((url) => url.includes(articles[0].slug))).toBe(true)
  for (const sibling of articles.slice(1)) {
    expect(
      requests.some((url) => url.includes(sibling.slug)),
      sibling.slug,
    ).toBe(false)
  }

  const internalTargets = await page
    .locator('article[data-article-template] a[href^="/"]')
    .evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).getAttribute('href')!).filter(Boolean),
    )
  for (const target of new Set(internalTargets)) {
    const response = await page.request.get(target, { maxRedirects: 0 })
    expect(response.status(), target).toBe(200)
    expect(response.headers().location, target).toBeUndefined()
  }
})
