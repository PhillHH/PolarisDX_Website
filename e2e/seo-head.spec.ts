import { expect, test } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

const PUBLIC_ORIGIN = 'https://polarisdx.net'

function tagCount(html: string, pattern: RegExp): number {
  return html.match(pattern)?.length ?? 0
}

function attribute(html: string, tagPattern: RegExp, name: string): string | undefined {
  const tag = html.match(tagPattern)?.[0]
  return tag?.match(new RegExp(`${name}="([^"]*)"`, 'i'))?.[1]
}

test('PT09.1 unknown route keeps the SSR 404 and emits no valid-page SEO claims', async ({
  request,
}) => {
  const response = await request.get('/fr/definitely-not-a-real-route', { maxRedirects: 0 })
  expect(response.status()).toBe(404)

  const html = await response.text()
  expect(attribute(html, /<meta[^>]+name="robots"[^>]*>/i, 'content')).toBe('noindex, follow')
  expect(attribute(html, /<meta[^>]+name="prerender-status-code"[^>]*>/i, 'content')).toBe('404')
  expect(tagCount(html, /<link[^>]+rel="canonical"[^>]*>/gi)).toBe(0)
  expect(tagCount(html, /<link[^>]+rel="alternate"[^>]*>/gi)).toBe(0)
  expect(tagCount(html, /<meta[^>]+property="og:locale:alternate"[^>]*>/gi)).toBe(0)
  expect(tagCount(html, /<meta[^>]+property="og:url"[^>]*>/gi)).toBe(0)
  expect(html).not.toContain('preview.polarisdx.net')
  expect(html).not.toContain('localhost')
})

for (const locale of ['de', 'en', 'pl', 'fr', 'cs'] as const) {
  test(`PT09.1 ${locale} special routes follow the x10 SEO contract`, async ({ request }) => {
    for (const route of [
      '/consumer/vitamin-d3-spray',
      '/s3_leitlinie',
      '/vitamin-d3-implantologie',
    ]) {
      const response = await request.get(`/${locale}${route}`, { maxRedirects: 0 })
      expect(response.status(), `${locale}${route}`).toBe(200)

      const html = await response.text()
      const canonical = `${PUBLIC_ORIGIN}/${locale}${route}`
      expect(tagCount(html, /<title(?:\s[^>]*)?>[\s\S]*?<\/title>/gi)).toBe(1)
      expect(tagCount(html, /<meta[^>]+name="description"[^>]*>/gi)).toBe(1)
      expect(tagCount(html, /<link[^>]+rel="canonical"[^>]*>/gi)).toBe(1)
      expect(attribute(html, /<link[^>]+rel="canonical"[^>]*>/i, 'href')).toBe(canonical)
      expect(attribute(html, /<meta[^>]+property="og:url"[^>]*>/i, 'content')).toBe(canonical)
      expect(attribute(html, /<meta[^>]+property="og:locale"[^>]*>/i, 'content')).toBeTruthy()
      expect(tagCount(html, /<meta[^>]+property="og:locale:alternate"[^>]*>/gi)).toBe(9)
      expect(attribute(html, /<meta[^>]+property="og:image"[^>]*>/i, 'content')).toMatch(
        /^https:\/\/polarisdx\.net\//,
      )
      expect(attribute(html, /<meta[^>]+property="og:image:alt"[^>]*>/i, 'content')).toBeTruthy()
      expect(attribute(html, /<meta[^>]+name="twitter:card"[^>]*>/i, 'content')).toBe(
        'summary_large_image',
      )
      expect(tagCount(html, /<link[^>]+rel="alternate"[^>]*>/gi)).toBe(11)
      for (const alternate of SUPPORTED_LANGUAGES) {
        const tag = new RegExp(`<link[^>]+rel="alternate"[^>]+hreflang="${alternate}"[^>]*>`, 'i')
        expect(attribute(html, tag, 'href')).toBe(`${PUBLIC_ORIGIN}/${alternate}${route}`)
      }
      expect(
        attribute(html, /<link[^>]+rel="alternate"[^>]+hreflang="x-default"[^>]*>/i, 'href'),
      ).toBe(`${PUBLIC_ORIGIN}/de${route}`)
      expect(html).not.toMatch(/preview\.polarisdx\.net|localhost|127\.0\.0\.1/)
    }
  })
}
