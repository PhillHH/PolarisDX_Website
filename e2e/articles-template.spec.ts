import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

import { articles } from '../src/data/articles'
import { calculateArticleReadMinutes } from '../src/lib/articleMeta'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const
type ArticleLocaleRecord = {
  title: string
  excerpt: string
}
type ArticleLocaleResource = Record<string, ArticleLocaleRecord>
type CommonLocaleResource = { nav: { cta_quote: string } }

const resources = Object.fromEntries(
  locales.map((locale) => [
    locale,
    JSON.parse(readFileSync(`public/locales/${locale}/articles.json`, 'utf8')),
  ]),
) as Record<(typeof locales)[number], ArticleLocaleResource>

type ArticleBodyResource = Record<
  (typeof locales)[number],
  { sections: unknown[]; keyStats?: unknown[] }
>

const bodyResources = Object.fromEntries(
  articles.map((article) => [
    article.id,
    JSON.parse(readFileSync(`src/content/articles/${article.slug}.json`, 'utf8')),
  ]),
) as Record<string, ArticleBodyResource>

const localizedArticle = (locale: (typeof locales)[number], articleId: string) => ({
  ...resources[locale][articleId],
  ...bodyResources[articleId][locale],
})

const commonResources = Object.fromEntries(
  locales.map((locale) => [
    locale,
    JSON.parse(readFileSync(`public/locales/${locale}/common.json`, 'utf8')),
  ]),
) as Record<(typeof locales)[number], CommonLocaleResource>

test('PT17.2 uses one truth-safe template for all six article types', async ({ page, request }) => {
  test.setTimeout(90_000)

  for (const [index, article] of articles.entries()) {
    const locale = locales[index]
    const content = localizedArticle(locale, article.id)
    const url = `/${locale}/articles/${article.slug}`
    const response = await page.goto(url)
    expect(response?.status(), url).toBe(200)

    const template = page.locator(`article[data-article-template="${article.slug}"]`)
    await expect(template).toHaveCount(1)
    await expect(template.locator('h1')).toHaveCount(1)
    await expect(template.locator('h1')).toHaveText(content.title)
    await expect(template.locator('time')).toHaveAttribute('datetime', /^2025-\d{2}-\d{2}$/)
    await expect(template).toContainText(article.author)
    await expect(template.locator('[data-reading-minutes]')).toHaveAttribute(
      'data-reading-minutes',
      String(calculateArticleReadMinutes(content.excerpt, content.sections)),
    )

    const headingLevels = await template
      .locator('h1, h2, h3')
      .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName.slice(1))))
    expect(headingLevels[0]).toBe(1)
    for (let heading = 1; heading < headingLevels.length; heading += 1) {
      expect(headingLevels[heading] - headingLevels[heading - 1]).toBeLessThanOrEqual(1)
    }

    const breadcrumb = template.locator('nav[aria-label="Breadcrumb"]')
    await expect(breadcrumb.locator(`a[href="/${locale}"]`)).toHaveCount(1)
    await expect(breadcrumb.locator(`a[href="/${locale}/articles"]`)).toHaveCount(1)
    await expect(breadcrumb.locator('[aria-current="page"]')).toHaveText(content.title)

    const relatedTargets = await template
      .locator('a[href*="/articles/"]')
      .evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).getAttribute('href')!).filter(Boolean),
      )
    expect(relatedTargets.length).toBeGreaterThan(0)
    for (const target of new Set(relatedTargets)) {
      const related = await request.get(target, { maxRedirects: 0 })
      expect(related.status(), target).toBe(200)
      expect(related.headers().location).toBeUndefined()
    }

    const serviceTargets = await template
      .locator('a[href*="/diagnostics/"]')
      .evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).getAttribute('href')!),
      )
    expect(serviceTargets.length).toBe(article.relatedServiceIds?.length)
    for (const target of serviceTargets) {
      const service = await request.get(target, { maxRedirects: 0 })
      expect(service.status(), target).toBe(200)
    }

    const quote = template.locator(`a[href="/${locale}/contact?intent=quote#kontaktformular"]`)
    await expect(quote).toHaveText(commonResources[locale].nav.cta_quote)

    const internalTargets = await template
      .locator('a[href^="/"]')
      .evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).getAttribute('href')!).filter(Boolean),
      )
    for (const target of new Set(internalTargets)) {
      const internal = await request.get(target, { maxRedirects: 0 })
      expect(internal.status(), target).toBe(200)
      expect(internal.headers().location).toBeUndefined()
    }

    const articleSchemas = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts
          .flatMap((script) => {
            const parsed = JSON.parse(script.textContent || '{}')
            return Array.isArray(parsed) ? parsed : [parsed]
          })
          .filter((schema) => schema['@type'] === 'Article'),
      )
    expect(articleSchemas).toHaveLength(1)
    expect(articleSchemas[0]).toMatchObject({
      headline: content.title,
      author: { name: article.author },
      inLanguage: locale,
    })
    expect(articleSchemas[0].datePublished).toBe(article.datePublished)
    expect(articleSchemas[0]).not.toHaveProperty('dateModified')
    expect(articleSchemas[0]).not.toHaveProperty('reviewedBy')

    const image = template.locator('img').first()
    if (article.sections[0]?.image) {
      await expect(image).toHaveAttribute('alt', '')
      await expect(image).toHaveAttribute('loading', 'lazy')
      await expect(image).toHaveAttribute('width', /^(1024|1200)$/)
      await expect(image).toHaveAttribute('height', /^(800|1024)$/)
    } else {
      await expect(template.locator('img')).toHaveCount(0)
    }
    await expect(template.locator('section', { hasText: /Quellen|Sources/u })).toHaveCount(0)
  }
})

test('PT17.2 formats deterministic reading time across x10', async ({ page }) => {
  const article = articles[0]
  for (const locale of locales) {
    const content = localizedArticle(locale, article.id)
    await page.goto(`/${locale}/articles/${article.slug}`)
    await expect(page.locator('[data-reading-minutes]')).toHaveAttribute(
      'data-reading-minutes',
      String(calculateArticleReadMinutes(content.excerpt, content.sections)),
    )
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
  }
})

for (const [width, locale, slug] of [
  [390, 'cs', articles[0].slug],
  [768, 'pl', articles[2].slug],
  [1440, 'fr', articles[3].slug],
] as const) {
  test(`PT17.2 template is responsive and Axe-clean at ${width}px in ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(`/${locale}/articles/${slug}`)
    await expect(page.locator('article[data-article-template]')).toBeVisible()
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

test('PT17.2 keeps detail navigation lightweight and pre-consent clean', async ({ page }) => {
  const requests: string[] = []
  page.on('request', (request) => requests.push(request.url()))
  await page.goto(`/de/articles/${articles[0].slug}`)
  await expect(page.locator('article[data-article-template]')).toBeVisible()

  expect(requests.filter((url) => /google-analytics|googletagmanager/u.test(url))).toEqual([])
  expect(requests.filter((url) => /\/locales\/(?!de\/|en\/)/u.test(url))).toEqual([])
  expect(requests.some((url) => url.includes('die-gruene-praxis'))).toBe(true)
  for (const article of articles.slice(1)) {
    expect(
      requests.some((url) => url.includes(article.slug)),
      article.slug,
    ).toBe(false)
  }
  await expect(page.locator('article[data-article-template] img[loading="lazy"]')).toHaveCount(1)
})
