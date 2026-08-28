import { expect, test } from '@playwright/test'

const PUBLIC_ORIGIN = 'https://polarisdx.net'

test('G3 sitemap URLs are real 200 pages with self-canonical indexable output', async ({
  request,
}) => {
  test.setTimeout(240_000)
  const sitemapResponse = await request.get('/sitemap.xml', { maxRedirects: 0 })
  expect(sitemapResponse.status()).toBe(200)
  expect(sitemapResponse.headers()['content-type']).toContain('application/xml')

  const xml = await sitemapResponse.text()
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  expect(locs).toHaveLength(390)
  expect(new Set(locs).size).toBe(390)

  const batchSize = 10
  for (let offset = 0; offset < locs.length; offset += batchSize) {
    const batch = locs.slice(offset, offset + batchSize)
    await Promise.all(
      batch.map(async (loc) => {
        const url = new URL(loc)
        expect(url.origin).toBe(PUBLIC_ORIGIN)
        const response = await request.get(url.pathname, { maxRedirects: 0 })
        expect(response.status(), loc).toBe(200)

        const html = await response.text()
        expect(html, loc).not.toMatch(/name="robots" content="noindex/i)
        expect(html, loc).toContain(`rel="canonical" href="${loc}"`)
        expect(html, loc).not.toMatch(/preview\.polarisdx\.net|localhost|127\.0\.0\.1/)
      }),
    )
  }
})
