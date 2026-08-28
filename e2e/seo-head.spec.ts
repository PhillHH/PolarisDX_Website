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

function jsonLdSchemas(html: string): Array<Record<string, unknown>> {
  const value = html.match(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i,
  )?.[1]
  if (!value) return []
  const parsed = JSON.parse(value) as Record<string, unknown> | Array<Record<string, unknown>>
  return Array.isArray(parsed) ? parsed : [parsed]
}

test('PT09.5 robots keeps public assets and Consumer crawlable while excluding APIs', async ({
  request,
}) => {
  const response = await request.get('/robots.txt', { maxRedirects: 0 })
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('text/plain')
  const robots = await response.text()
  expect(robots.match(/^User-agent:/gm)).toHaveLength(40)
  expect(robots.match(/^Disallow: \/api$/gm)).toHaveLength(4)
  expect(robots).toContain('Sitemap: https://polarisdx.net/sitemap.xml')
  expect(robots).not.toMatch(/^Disallow:\s*\/(?:assets|locales|[^\n]*consumer)/gm)
  expect(robots).not.toMatch(/preview\.polarisdx\.net|localhost|127\.0\.0\.1/)

  expect((await request.get('/sitemap.xml')).status()).toBe(200)
  expect((await request.get('/locales/de/home.json')).status()).toBe(200)
  expect((await request.get('/og-image.jpg')).status()).toBe(200)
})

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

const CONSUMER_PATHS = [
  '/consumer/vitamin-d3-spray',
  '/consumer/hydrating-masks',
  '/consumer/inside-out-duo',
] as const

test('PT09.3 Consumer 3x10 pages are indexable, self-canonical and product-specific', async ({
  request,
}) => {
  test.setTimeout(180_000)
  const sitemapResponse = await request.get('/sitemap.xml')
  expect(sitemapResponse.status()).toBe(200)
  const sitemap = await sitemapResponse.text()

  const robotsResponse = await request.get('/robots.txt')
  expect(robotsResponse.status()).toBe(200)
  expect(await robotsResponse.text()).not.toMatch(/^\s*Disallow:\s*\/consumer(?:\/|\s|$)/im)

  for (const locale of SUPPORTED_LANGUAGES) {
    const localeTitles = new Set<string>()
    const localeDescriptions = new Set<string>()
    const consumerInlinkTargets = new Set<string>()

    for (const route of CONSUMER_PATHS) {
      const response = await request.get(`/${locale}${route}`, { maxRedirects: 0 })
      expect(response.status(), `${locale}${route}`).toBe(200)
      const html = await response.text()
      const canonical = `${PUBLIC_ORIGIN}/${locale}${route}`

      expect(attribute(html, /<meta[^>]+name="robots"[^>]*>/i, 'content')).toMatch(/^index, follow/)
      expect(tagCount(html, /<link[^>]+rel="canonical"[^>]*>/gi)).toBe(1)
      expect(attribute(html, /<link[^>]+rel="canonical"[^>]*>/i, 'href')).toBe(canonical)
      expect(tagCount(html, /<link[^>]+rel="alternate"[^>]*>/gi)).toBe(11)
      for (const alternate of SUPPORTED_LANGUAGES) {
        const tag = new RegExp(`<link[^>]+rel="alternate"[^>]+hreflang="${alternate}"[^>]*>`, 'i')
        expect(attribute(html, tag, 'href')).toBe(`${PUBLIC_ORIGIN}/${alternate}${route}`)
      }
      expect(
        attribute(html, /<link[^>]+rel="alternate"[^>]+hreflang="x-default"[^>]*>/i, 'href'),
      ).toBe(`${PUBLIC_ORIGIN}/de${route}`)
      expect(sitemap).toContain(`<loc>${canonical}</loc>`)

      const title = attribute(html, /<meta[^>]+property="og:title"[^>]*>/i, 'content')
      const description = attribute(html, /<meta[^>]+property="og:description"[^>]*>/i, 'content')
      const image = attribute(html, /<meta[^>]+property="og:image"[^>]*>/i, 'content')
      const imageAlt = attribute(html, /<meta[^>]+property="og:image:alt"[^>]*>/i, 'content')
      expect(attribute(html, /<meta[^>]+property="og:type"[^>]*>/i, 'content')).toBe('product')
      expect(attribute(html, /<meta[^>]+property="og:url"[^>]*>/i, 'content')).toBe(canonical)
      expect(title).toBeTruthy()
      expect(description).toBeTruthy()
      expect(image).toMatch(/^https:\/\/polarisdx\.net\/assets\//)
      expect(imageAlt).toBeTruthy()
      expect(attribute(html, /<meta[^>]+property="og:image:width"[^>]*>/i, 'content')).toBe('1122')
      expect(attribute(html, /<meta[^>]+property="og:image:height"[^>]*>/i, 'content')).toBe('1402')
      expect(attribute(html, /<meta[^>]+name="twitter:title"[^>]*>/i, 'content')).toBe(title)
      expect(attribute(html, /<meta[^>]+name="twitter:description"[^>]*>/i, 'content')).toBe(
        description,
      )
      expect(attribute(html, /<meta[^>]+name="twitter:image"[^>]*>/i, 'content')).toBe(image)
      expect(attribute(html, /<meta[^>]+name="twitter:image:alt"[^>]*>/i, 'content')).toBe(imageAlt)

      const imagePath = new URL(image!).pathname
      expect((await request.get(imagePath)).status(), imagePath).toBe(200)
      const jsonLd = html.match(
        /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i,
      )?.[1]
      expect(jsonLd, `${locale}${route} Product JSON-LD`).toBeTruthy()
      const product = jsonLdSchemas(html).find((schema) => schema['@type'] === 'Product')!
      expect(product['@type']).toBe('Product')
      expect(product.url).toBe(canonical)
      expect(product.image).toBe(image)
      expect(product.name).toBeTruthy()
      expect(product.description).toBeTruthy()
      for (const forbidden of ['offers', 'sku', 'gtin', 'aggregateRating', 'review']) {
        expect(product).not.toHaveProperty(forbidden)
      }
      expect(html).not.toMatch(/preview\.polarisdx\.net|localhost|127\.0\.0\.1/)
      expect(html).not.toMatch(new RegExp(`href="/${locale}/services(?:/|"|#)`))
      for (const match of html.matchAll(new RegExp(`href="(/${locale}/consumer/[^"#?]+)`, 'g'))) {
        consumerInlinkTargets.add(match[1])
      }
      localeTitles.add(title!)
      localeDescriptions.add(description!)
    }

    expect(localeTitles.size, `${locale} product-specific titles`).toBe(CONSUMER_PATHS.length)
    expect(localeDescriptions.size, `${locale} product-specific descriptions`).toBe(
      CONSUMER_PATHS.length,
    )
    for (const route of CONSUMER_PATHS) {
      expect(
        consumerInlinkTargets,
        `${locale}${route} has an intentional Consumer inlink`,
      ).toContain(`/${locale}${route}`)
    }
  }
})

test('PT09.4 representative page types emit public, locale-correct and claim-safe JSON-LD', async ({
  request,
}) => {
  test.setTimeout(180_000)
  const cases = [
    ['/pl/', ['Organization', 'WebSite', 'FAQPage']],
    ['/fr/about', ['Organization', 'BreadcrumbList']],
    ['/it/diagnostics/dental', ['Service', 'BreadcrumbList']],
    ['/es/igloo-pro', ['Product', 'BreadcrumbList']],
    ['/pt/epigenetics/grundlagen', ['BreadcrumbList']],
    ['/nl/epigenetics/musterbefund/metabolic-health', ['Article', 'BreadcrumbList']],
    ['/cs/articles/die-gruene-praxis', ['Article', 'BreadcrumbList']],
    ['/da/events', ['BreadcrumbList', 'BusinessEvent']],
    ['/en/consumer/inside-out-duo', ['Product', 'BreadcrumbList', 'FAQPage']],
    ['/de/downloads', ['BreadcrumbList']],
    ['/de/contact', ['Organization', 'BreadcrumbList']],
    ['/de/support', ['BreadcrumbList', 'FAQPage']],
  ] as const

  for (const [path, expectedTypes] of cases) {
    const response = await request.get(path, { maxRedirects: 0 })
    expect(response.status(), path).toBe(200)
    const html = await response.text()
    const schemas = jsonLdSchemas(html)
    const types = schemas.map((schema) => String(schema['@type']))
    for (const type of expectedTypes) expect(types, `${path}: ${type}`).toContain(type)
    expect(html, path).not.toMatch(/preview\.polarisdx\.net|localhost|127\.0\.0\.1/)

    const serialized = JSON.stringify(schemas)
    expect(serialized, path).not.toMatch(
      /"(?:offers|aggregateRating|review|reviewCount|price|priceCurrency|availability)"\s*:/,
    )
    for (const schema of schemas) expect(schema['@context']).toBe('https://schema.org')

    const breadcrumb = schemas.find((schema) => schema['@type'] === 'BreadcrumbList')
    if (breadcrumb) {
      const items = breadcrumb.itemListElement as Array<Record<string, unknown>>
      expect(items.map((item) => item.position)).toEqual(items.map((_, index) => index + 1))
      expect(
        items.every((item) =>
          String(item.item).startsWith(`${PUBLIC_ORIGIN}/${path.slice(1, 3)}/`),
        ),
      ).toBe(true)
      expect(items.map((item) => item.item)).not.toContain(
        `${PUBLIC_ORIGIN}/${path.slice(1, 3)}/services`,
      )
      expect(items.map((item) => item.item)).not.toContain(
        `${PUBLIC_ORIGIN}/${path.slice(1, 3)}/consumer`,
      )
    }
  }

  const articleHtml = await (await request.get('/cs/articles/die-gruene-praxis')).text()
  const article = jsonLdSchemas(articleHtml).find((schema) => schema['@type'] === 'Article')!
  expect(article.url).toBe(`${PUBLIC_ORIGIN}/cs/articles/die-gruene-praxis`)
  expect(article.datePublished).toBe('2025-11-28')
  expect(article).not.toHaveProperty('dateModified')
  expect(article).not.toHaveProperty('reviewedBy')

  const eventsHtml = await (await request.get('/da/events')).text()
  const events = jsonLdSchemas(eventsHtml).filter((schema) => schema['@type'] === 'BusinessEvent')
  expect(events.length).toBeGreaterThan(0)
  for (const event of events) {
    expect(event.url).toBe(`${PUBLIC_ORIGIN}/da/events`)
    expect(event).not.toHaveProperty('eventStatus')
    expect(event).not.toHaveProperty('eventAttendanceMode')
  }

  const notFoundHtml = await (await request.get('/de/not-a-real-structured-data-page')).text()
  expect(jsonLdSchemas(notFoundHtml)).toEqual([])
})
