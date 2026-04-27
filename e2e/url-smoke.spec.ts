import { test, expect } from '@playwright/test'

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
  { from: '/services', to: '/diagnostics' },
  { from: '/services/dental', to: '/diagnostics/dental' },
]

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
    test(`${redirect.from} leitet nach ${redirect.to}`, async ({ page }) => {
      await page.goto(redirect.from)
      await page.waitForURL((url) => url.pathname.endsWith(redirect.to), {
        timeout: 10000,
      })
      expect(page.url()).toContain(redirect.to)
    })
  }
})

test.describe('404 Page', () => {
  test('unbekannter Pfad zeigt NotFoundPage', async ({ page }) => {
    await page.goto('/diese-seite-existiert-nicht')
    await expect(page.locator('body')).toContainText(/404|nicht gefunden|not found/i)
  })
})
