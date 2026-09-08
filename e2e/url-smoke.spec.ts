import { test, expect } from '@playwright/test'
import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { getRouteTestMatrix } from '../src/routing/routeRegistry'

const ROUTE_MATRIX = getRouteTestMatrix()
const CANONICAL_ROUTES = [...ROUTE_MATRIX.static200, ...ROUTE_MATRIX.dynamic200]

const SPECIAL_ROUTES = [
  '/consumer/vitamin-d3-spray',
  '/s3_leitlinie',
  '/vitamin-d3-implantologie',
] as const

const LOCALES = SUPPORTED_LANGUAGES

function localizedPath(locale: string, path: string): string {
  return `/${locale}${path === '/' ? '/' : path}`
}

function tagCount(html: string, pattern: RegExp): number {
  return html.match(pattern)?.length ?? 0
}

function assertSharedHtmlHeaders(headers: Record<string, string>): void {
  expect(headers['content-type']).toContain('text/html')
  expect(headers['cache-control']).toContain('no-store')
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(headers['x-powered-by']).toBeUndefined()
}

function assert404Seo(html: string, path: string): void {
  expect(html, path).toMatch(/<meta[^>]+name="robots"[^>]+content="noindex, follow"[^>]*>/i)
  expect(html, path).toMatch(/<meta[^>]+name="prerender-status-code"[^>]+content="404"[^>]*>/i)
  expect(tagCount(html, /<link[^>]+rel="canonical"[^>]*>/gi), `${path} canonical`).toBe(0)
  expect(tagCount(html, /<link[^>]+rel="alternate"[^>]*>/gi), `${path} hreflang`).toBe(0)
  expect(tagCount(html, /hreflang="x-default"/gi), `${path} x-default`).toBe(0)
}

test.describe('G2 — real HTTP status and soft-404 matrix', () => {
  for (const locale of LOCALES) {
    test(`${locale}: every Registry-known public route returns 200`, async ({ request }) => {
      test.setTimeout(120_000)
      for (const route of CANONICAL_ROUTES) {
        const path = localizedPath(locale, route.path)
        const response = await request.get(path, { maxRedirects: 0 })
        expect(response.status(), path).toBe(200)
        expect(response.headers().location, path).toBeUndefined()
        assertSharedHtmlHeaders(response.headers())

        const html = await response.text()
        expect(html, `${path} NotFound marker`).not.toMatch(/name="prerender-status-code"/i)
        expect(html.trim().length, `${path} non-empty SSR body`).toBeGreaterThan(0)
      }
    })
  }

  test('unknown static and dynamic routes return real 404 with synchronized SEO output', async ({
    request,
  }) => {
    test.setTimeout(120_000)
    const sitemapResponse = await request.get('/sitemap.xml', { maxRedirects: 0 })
    expect(sitemapResponse.status()).toBe(200)
    const sitemap = await sitemapResponse.text()

    const unknownPaths = [
      ROUTE_MATRIX.unknownStatic404,
      ...ROUTE_MATRIX.unknownDynamic404.map((route) => route.path),
    ]
    for (const locale of LOCALES) {
      for (const unknownPath of unknownPaths) {
        const path = localizedPath(locale, unknownPath)
        const response = await request.get(path, { maxRedirects: 0 })
        expect(response.status(), path).toBe(404)
        expect(response.headers().location, path).toBeUndefined()
        assertSharedHtmlHeaders(response.headers())
        assert404Seo(await response.text(), path)
        expect(sitemap, `${path} sitemap exclusion`).not.toContain(
          `<loc>https://polarisdx.net${path}</loc>`,
        )
      }
    }
  })

  test('intentional no-successor paths remain locale-true 404 instead of soft-home pages', async ({
    request,
  }) => {
    test.setTimeout(120_000)
    for (const locale of LOCALES) {
      for (const unknownPath of ROUTE_MATRIX.intentional404) {
        const path = localizedPath(locale, unknownPath)
        const response = await request.get(`${path}?utm_source=pt10_4`, { maxRedirects: 0 })
        expect(response.status(), path).toBe(404)
        expect(response.headers().location, path).toBeUndefined()
        assertSharedHtmlHeaders(response.headers())
        assert404Seo(await response.text(), path)
      }
    }
  })

  test('browser navigation receives the real 404 response rather than only NotFound UI', async ({
    page,
  }) => {
    const response = await page.goto(`/fr${ROUTE_MATRIX.unknownStatic404}`)
    expect(response?.status()).toBe(404)
    expect(new URL(page.url()).pathname).toBe(`/fr${ROUTE_MATRIX.unknownStatic404}`)
    await expect(page.locator('body')).toContainText(/404|nicht gefunden|not found/i)
  })

  test('representative 200, 301 and 404 responses retain the narrow runtime header contract', async ({
    request,
  }) => {
    const ok = await request.get('/de/epigenetics', { maxRedirects: 0 })
    expect(ok.status()).toBe(200)
    assertSharedHtmlHeaders(ok.headers())

    const redirect = await request.get('/epigenetics?utm_source=pt10_4', { maxRedirects: 0 })
    expect(redirect.status()).toBe(301)
    expect(redirect.headers().location).toBe('/de/epigenetics?utm_source=pt10_4')
    expect(redirect.headers()['x-content-type-options']).toBe('nosniff')
    expect(redirect.headers()['referrer-policy']).toBe('strict-origin-when-cross-origin')

    const missing = await request.get('/de/__pt10-4-header-404__', { maxRedirects: 0 })
    expect(missing.status()).toBe(404)
    assertSharedHtmlHeaders(missing.headers())
  })
})

test.describe('G9 — permanent one-hop redirect status', () => {
  test('every unprefixed canonical route redirects directly to its DE 200 target', async ({
    request,
  }) => {
    test.setTimeout(120_000)
    for (const route of CANONICAL_ROUTES) {
      const source = `${route.path}?utm_source=pt10_4`
      const target = `${localizedPath('de', route.path)}?utm_source=pt10_4`
      const response = await request.get(source, { maxRedirects: 0 })
      expect(response.status(), source).toBe(301)
      expect(response.headers().location, source).toBe(target)

      const finalResponse = await request.get(target, { maxRedirects: 0 })
      expect(finalResponse.status(), target).toBe(200)
      expect(finalResponse.headers().location, target).toBeUndefined()
    }
  })

  test('unbekannte Legacy-Service-Slugs bleiben direkte 404', async ({ request }) => {
    for (const source of ['/de/services/not-a-real-service', '/services/not-a-real-service']) {
      const response = await request.get(`${source}?utm_source=pt10`, { maxRedirects: 0 })
      expect(response.status(), source).toBe(404)
      expect(response.headers().location, source).toBeUndefined()
    }
  })

  for (const migration of ROUTE_MATRIX.redirectSources) {
    test(`${migration.sourcePath} ist locale-treu als bekannte Alt-URL klassifiziert`, async ({
      request,
    }) => {
      test.setTimeout(120_000)
      for (const locale of LOCALES) {
        const source = `/${locale}${migration.sourcePath}?utm_source=pt10_2`
        const target = `/${locale}${migration.targetPath}?utm_source=pt10_2`
        const response = await request.get(source, { maxRedirects: 0 })
        expect(response.status(), source).toBe(301)
        expect(response.headers().location, source).toBe(target)

        const finalResponse = await request.get(target, { maxRedirects: 0 })
        expect(finalResponse.status(), target).toBe(200)
        expect(finalResponse.headers().location, target).toBeUndefined()
      }

      const unprefixedSource = `${migration.sourcePath}?utm_source=pt10_2`
      const deTarget = `/de${migration.targetPath}?utm_source=pt10_2`
      const unprefixedResponse = await request.get(unprefixedSource, { maxRedirects: 0 })
      expect(unprefixedResponse.status(), unprefixedSource).toBe(301)
      expect(unprefixedResponse.headers().location, unprefixedSource).toBe(deTarget)

      const headResponse = await request.head(unprefixedSource, { maxRedirects: 0 })
      expect(headResponse.status(), unprefixedSource).toBe(301)
      expect(headResponse.headers().location, unprefixedSource).toBe(deTarget)
    })
  }

  test('bekannte Pfade ohne Nachfolger bleiben direkte 404 statt Homepage-Soft-Migration', async ({
    request,
  }) => {
    for (const path of ROUTE_MATRIX.intentional404) {
      for (const source of [path, `/pl${path}`]) {
        const response = await request.get(`${source}?utm_source=pt10_2`, { maxRedirects: 0 })
        expect(response.status(), source).toBe(404)
        expect(response.headers().location, source).toBeUndefined()
      }
    }
  })

  test('bekannter alter Musterbefund-Anker wird clientseitig auf den stabilen Anker migriert', async ({
    page,
  }) => {
    const response = await page.goto(
      '/de/epigenetics/musterbefund/metabolic-health#adipositas-und-diabetes-veranlagung-13',
    )
    expect(response?.status()).toBe(200)
    await expect(page).toHaveURL(/#marker-4$/)
    await expect(page.locator('#marker-4')).toBeAttached()
  })

  test('/downloads-Seite kollidiert nicht mit realen Dateien im gleichnamigen Asset-Ordner', async ({
    request,
  }) => {
    const pageResponse = await request.get('/downloads?utm_source=pt10_2', { maxRedirects: 0 })
    expect(pageResponse.status()).toBe(301)
    expect(pageResponse.headers().location).toBe('/de/downloads?utm_source=pt10_2')

    const assetResponse = await request.get('/downloads/igloo-pro-flyer.pdf', { maxRedirects: 0 })
    expect(assetResponse.status()).toBe(200)
    expect(assetResponse.headers().location).toBeUndefined()
  })

  test('Consumer, S3 und Implantology bleiben in allen zehn Locales direkt', async ({
    request,
  }) => {
    for (const locale of LOCALES) {
      for (const route of SPECIAL_ROUTES) {
        const response = await request.get(`/${locale}${route}`, { maxRedirects: 0 })
        expect(response.status(), `${locale}${route}`).toBe(200)
        expect(response.headers().location, `${locale}${route}`).toBeUndefined()
      }
    }
  })
})
