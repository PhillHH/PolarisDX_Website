import { test, expect } from '@playwright/test'
import { getSitemapRouteFamilies } from '../src/components/seo/sitemap'
import { services } from '../src/data/services'
import { INTENTIONAL_404_PATHS, LEGACY_REDIRECT_MIGRATIONS } from '../src/routing/legacyRedirects'

const ROUTES = [
  { path: '/' },
  { path: '/about' },
  { path: '/articles' },
  { path: '/contact' },
  { path: '/diagnostics' },
  { path: '/downloads' },
  { path: '/events' },
  { path: '/igloo-pro' },
  { path: '/imprint' },
  { path: '/privacy' },
  { path: '/s3_leitlinie' },
  { path: '/support' },
  { path: '/terms' },
  { path: '/vitamin-d3-implantologie' },
  { path: '/vitamin-d3-spray' },
]

const DYNAMIC_ROUTES = [
  { path: '/articles/the-ecosystem-of-rapid-tests-why-compatibility-creates-safety' },
  { path: '/diagnostics/dental' },
]

const REDIRECTS = [
  { from: '/about', to: '/de/about' },
  { from: '/services', to: '/de/diagnostics' },
  { from: '/services/dental', to: '/de/diagnostics/dental' },
  { from: '/pl/services', to: '/pl/diagnostics' },
  { from: '/cs/services/dental', to: '/cs/diagnostics/dental' },
  { from: '/agb', to: '/de/terms' },
  { from: '/fr/agb', to: '/fr/terms' },
  { from: '/s3-leitlinie', to: '/de/s3_leitlinie' },
  { from: '/it/s3-leitlinie', to: '/it/s3_leitlinie' },
] as const

const SPECIAL_ROUTES = [
  '/consumer/vitamin-d3-spray',
  '/s3_leitlinie',
  '/vitamin-d3-implantologie',
] as const

const LOCALES = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const
const UNSITEMAPPED_KNOWN_PATHS = ['/support', '/privacy', '/imprint', '/terms'] as const

test.describe('URL Smoke Tests', () => {
  for (const route of ROUTES) {
    test(`${route.path} laedt ohne Fehler`, async ({ page }) => {
      const response = await page.goto(route.path)
      expect(response?.status()).toBeLessThan(400)
      await expect(page.locator('body')).not.toBeEmpty()
    })
  }

  for (const route of DYNAMIC_ROUTES) {
    test(`Dynamic: ${route.path} laedt`, async ({ page }) => {
      const response = await page.goto(route.path)
      expect(response?.status()).toBeLessThan(400)
    })
  }
})

test.describe('301 Redirects', () => {
  for (const redirect of REDIRECTS) {
    test(`${redirect.from} liefert direkt 301 auf ${redirect.to}`, async ({ request }) => {
      const source = `${redirect.from}?utm_source=pt10`
      const target = `${redirect.to}?utm_source=pt10`
      const response = await request.get(source, { maxRedirects: 0 })

      expect(response.status()).toBe(301)
      expect(response.headers().location).toBe(target)

      const finalResponse = await request.get(target, { maxRedirects: 0 })
      expect(finalResponse.status()).toBe(200)
      expect(finalResponse.headers().location).toBeUndefined()

      const headResponse = await request.head(source, { maxRedirects: 0 })
      expect(headResponse.status()).toBe(301)
      expect(headResponse.headers().location).toBe(target)
    })
  }

  test('jede aktuell bekannte unpräfixierte Seite erreicht direkt ihr kanonisches DE-Ziel', async ({
    request,
  }) => {
    const knownPaths = [
      ...getSitemapRouteFamilies().map((family) => family.path),
      ...UNSITEMAPPED_KNOWN_PATHS,
    ]
    for (const path of knownPaths) {
      const source = `${path}?utm_source=pt10`
      const target = `/de${path === '/' ? '/' : path}?utm_source=pt10`
      const response = await request.get(source, { maxRedirects: 0 })
      expect(response.status(), source).toBe(301)
      expect(response.headers().location, source).toBe(target)

      const finalResponse = await request.get(target, { maxRedirects: 0 })
      expect(finalResponse.status(), target).toBe(200)
      expect(finalResponse.headers().location, target).toBeUndefined()
    }
  })

  test('alle realen Service-Slugs migrieren locale-treu auf ein direktes 200-Ziel', async ({
    request,
  }) => {
    for (const locale of LOCALES) {
      for (const service of services) {
        const source = `/${locale}/services/${service.id}?utm_source=pt10`
        const target = `/${locale}/diagnostics/${service.id}?utm_source=pt10`
        const response = await request.get(source, { maxRedirects: 0 })
        expect(response.status(), source).toBe(301)
        expect(response.headers().location, source).toBe(target)

        const finalResponse = await request.get(target, { maxRedirects: 0 })
        expect(finalResponse.status(), target).toBe(200)
        expect(finalResponse.headers().location, target).toBeUndefined()
      }
    }
  })

  test('unbekannte Legacy-Service-Slugs bleiben direkte 404', async ({ request }) => {
    for (const source of ['/de/services/not-a-real-service', '/services/not-a-real-service']) {
      const response = await request.get(`${source}?utm_source=pt10`, { maxRedirects: 0 })
      expect(response.status(), source).toBe(404)
      expect(response.headers().location, source).toBeUndefined()
    }
  })

  for (const migration of LEGACY_REDIRECT_MIGRATIONS) {
    test(`${migration.sourcePath} ist locale-treu als bekannte Alt-URL klassifiziert`, async ({
      request,
    }) => {
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
    })
  }

  test('bekannte Pfade ohne Nachfolger bleiben direkte 404 statt Homepage-Soft-Migration', async ({
    request,
  }) => {
    for (const path of INTENTIONAL_404_PATHS) {
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

test.describe('404 Page', () => {
  test('unbekannter Pfad zeigt NotFoundPage', async ({ page }) => {
    const response = await page.goto('/diese-seite-existiert-nicht')
    expect(response?.status()).toBe(404)
    expect(new URL(page.url()).pathname).toBe('/diese-seite-existiert-nicht')
    await expect(page.locator('body')).toContainText(/404|nicht gefunden|not found/i)
  })
})
