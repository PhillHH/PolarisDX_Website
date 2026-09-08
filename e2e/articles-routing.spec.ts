import { expect, test } from '@playwright/test'
import { articles } from '../src/data/articles'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

const publicOrigin = 'https://polarisdx.net'
const retiredLocaleRecords = ['first_checkup', 'managing_diabetes', 'home_care'] as const

function tagCount(html: string, pattern: RegExp): number {
  return html.match(pattern)?.length ?? 0
}

test('PT17.3 serves all 60 canonical slug routes with self-canonical output', async ({
  request,
}) => {
  test.setTimeout(120_000)

  for (const locale of SUPPORTED_LANGUAGES) {
    for (const article of articles) {
      const path = `/${locale}/articles/${article.slug}`
      const response = await request.get(path, { maxRedirects: 0 })
      expect(response.status(), path).toBe(200)
      expect(response.headers().location, path).toBeUndefined()
      const html = await response.text()
      expect(tagCount(html, /<link[^>]+rel="canonical"[^>]*>/gi), path).toBe(1)
      expect(html, path).toContain(`href="${publicOrigin}${path}"`)
      expect(html, path).not.toContain(`/articles/${article.id}`)
    }
  }
})

test('PT17.3 treats internal IDs only as one-hop historical redirects and preserves queries', async ({
  request,
}) => {
  test.setTimeout(120_000)

  for (const locale of SUPPORTED_LANGUAGES) {
    for (const article of articles) {
      const source = `/${locale}/articles/${article.id}?utm_source=pt17_3&ref=identity`
      const target = `/${locale}/articles/${article.slug}?utm_source=pt17_3&ref=identity`
      const response = await request.get(source, { maxRedirects: 0 })
      expect(response.status(), source).toBe(301)
      expect(response.headers().location, source).toBe(target)

      const finalResponse = await request.get(target, { maxRedirects: 0 })
      expect(finalResponse.status(), target).toBe(200)
      expect(finalResponse.headers().location, target).toBeUndefined()
    }
  }
})

test('PT17.3 returns real SEO-safe 404s for unknown and retired article slugs', async ({
  request,
}) => {
  for (const slug of ['not-a-published-article', ...retiredLocaleRecords]) {
    const path = `/nl/articles/${slug}`
    const response = await request.get(path, { maxRedirects: 0 })
    expect(response.status(), path).toBe(404)
    expect(response.headers().location, path).toBeUndefined()
    const html = await response.text()

    expect(html, path).toMatch(/<meta[^>]+name="robots"[^>]+content="noindex, follow"[^>]*>/i)
    expect(tagCount(html, /<link[^>]+rel="canonical"[^>]*>/gi), `${path} canonical`).toBe(0)
    expect(tagCount(html, /<link[^>]+rel="alternate"[^>]*>/gi), `${path} hreflang`).toBe(0)
    expect(html, `${path} Article schema`).not.toMatch(/"@type":"Article"/i)
  }
})

test('PT17.3 sitemap exposes canonical slugs and no internal IDs or redirect sources', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml', { maxRedirects: 0 })
  expect(response.status()).toBe(200)
  const sitemap = await response.text()

  for (const locale of SUPPORTED_LANGUAGES) {
    for (const article of articles) {
      expect(sitemap).toContain(`<loc>${publicOrigin}/${locale}/articles/${article.slug}</loc>`)
      expect(sitemap).not.toContain(`<loc>${publicOrigin}/${locale}/articles/${article.id}</loc>`)
    }
    for (const id of retiredLocaleRecords) {
      expect(sitemap).not.toContain(`<loc>${publicOrigin}/${locale}/articles/${id}</loc>`)
    }
  }
})
