import { expect, test } from '@playwright/test'

const PUBLIC_ORIGIN = 'https://polarisdx.net'
const translationKeyPattern = /^[a-z][\w-]*(?::[\w-]+)?(?:\.[\w-]+)+$/i
const placeholderPattern = /\b(?:lorem ipsum|tbd|placeholder|preview copy|coming soon)\b/i

function tagCount(html: string, pattern: RegExp): number {
  return html.match(pattern)?.length ?? 0
}

function attribute(html: string, tagPattern: RegExp, name: string): string | undefined {
  const tag = html.match(tagPattern)?.[0]
  return tag?.match(new RegExp(`${name}="([^"]*)"`, 'i'))?.[1]
}

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
  const metadata: Array<{ locale: string; path: string; description: string }> = []

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

        const title = html.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i)?.[1]?.trim()
        const description = attribute(html, /<meta[^>]+name="description"[^>]*>/i, 'content')
        const ogUrl = attribute(html, /<meta[^>]+property="og:url"[^>]*>/i, 'content')
        const ogImage = attribute(html, /<meta[^>]+property="og:image"[^>]*>/i, 'content')
        const ogAlt = attribute(html, /<meta[^>]+property="og:image:alt"[^>]*>/i, 'content')
        const twitterAlt = attribute(html, /<meta[^>]+name="twitter:image:alt"[^>]*>/i, 'content')
        expect(tagCount(html, /<title(?:\s[^>]*)?>[\s\S]*?<\/title>/gi), `${loc} title`).toBe(1)
        expect(tagCount(html, /<meta[^>]+name="description"[^>]*>/gi), `${loc} description`).toBe(1)
        expect(title, `${loc} title`).toBeTruthy()
        expect(description, `${loc} description`).toBeTruthy()
        expect(translationKeyPattern.test(title!), `${loc} title key`).toBe(false)
        expect(translationKeyPattern.test(description!), `${loc} description key`).toBe(false)
        expect(placeholderPattern.test(`${title} ${description}`), `${loc} placeholder`).toBe(false)
        expect(ogUrl, `${loc} og:url`).toBe(loc)
        expect(ogImage, `${loc} og:image`).toMatch(/^https:\/\/polarisdx\.net\//)
        expect(ogAlt, `${loc} og:image:alt`).toBeTruthy()
        expect(twitterAlt, `${loc} twitter:image:alt`).toBe(ogAlt)
        expect(ogAlt, `${loc} filename-only alt`).not.toMatch(
          /(?:^|\/)[^/]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i,
        )
        metadata.push({
          locale: url.pathname.slice(1, 3),
          path: url.pathname.slice(3) || '/',
          description: description!,
        })
      }),
    )
  }

  const localeDescriptions = new Map<string, string>()
  const familyDescriptions = new Map<string, Map<string, string>>()
  for (const entry of metadata) {
    const duplicateKey = `${entry.locale}:${entry.description}`
    const previousPath = localeDescriptions.get(duplicateKey)
    expect(
      previousPath,
      `${entry.locale} duplicate description for ${previousPath} and ${entry.path}`,
    ).toBeUndefined()
    localeDescriptions.set(duplicateKey, entry.path)
    const family = familyDescriptions.get(entry.path) ?? new Map<string, string>()
    family.set(entry.locale, entry.description)
    familyDescriptions.set(entry.path, family)
  }
  for (const [path, family] of familyDescriptions) {
    for (const locale of ['pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs']) {
      expect(family.get(locale), `${locale}${path} German-copy regression`).not.toBe(
        family.get('de'),
      )
      expect(family.get(locale), `${locale}${path} English-copy regression`).not.toBe(
        family.get('en'),
      )
    }
  }
})
