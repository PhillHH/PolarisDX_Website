import { expect, test } from '@playwright/test'
import { services } from '../src/data/services'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

test.describe('PT13.10 9x10 service route integration matrix', () => {
  for (const service of services) {
    for (const locale of SUPPORTED_LANGUAGES) {
      test(`${locale}/${service.id} is a complete canonical service response`, async ({ page }) => {
        const path = `/${locale}/diagnostics/${service.id}`
        const canonical = `https://polarisdx.net${path}`
        const response = await page.goto(path)

        expect(response?.status()).toBe(200)
        await expect(page.locator('html')).toHaveAttribute('lang', locale)
        await expect(page.locator('[data-service-detail-template="v1"]')).toHaveCount(1)
        await expect(page.locator('.rich-content')).toHaveCount(0)
        await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
        await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('')
        await expect(
          page.locator('nav[aria-label="Breadcrumb"] [aria-current="page"]'),
        ).toHaveCount(1)
        await expect(page.locator('[data-service-detail-sections] section')).toHaveCount(6)
        await expect(page.locator('[data-service-detail-sections] ol > li')).toHaveCount(3)
        await expect(page.locator('[data-cta-intent="GENERAL_SALES"]')).toHaveCount(2)
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
          'content',
          /^index, follow/,
        )
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonical)
        await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(11)
        await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
          'href',
          `https://polarisdx.net/de/diagnostics/${service.id}`,
        )
        await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/)
        await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonical)
        await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /.+/)
        await expect(page.locator('meta[name="twitter:url"]')).toHaveAttribute('content', canonical)
        await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute(
          'content',
          /.+/,
        )
        await expect(page.locator('body')).not.toContainText(/services:[a-z0-9_.-]+/i)
        expect(await page.locator('a[href*="/services/"]').count()).toBe(0)
        const managedSeoHead = await page
          .locator('head [data-rh="true"]')
          .evaluateAll((nodes) => nodes.map((node) => node.outerHTML).join('\n'))
        expect(managedSeoHead).not.toMatch(/preview\.polarisdx\.net|localhost|127\.0\.0\.1/)
      })
    }
  }

  test('Registry-derived sitemap contains all 90 canonical service URLs', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    const xml = await response.text()
    const expected = services.flatMap((service) =>
      SUPPORTED_LANGUAGES.map(
        (locale) => `https://polarisdx.net/${locale}/diagnostics/${service.id}`,
      ),
    )
    expect(expected).toHaveLength(90)
    for (const canonical of expected) expect(xml, canonical).toContain(`<loc>${canonical}</loc>`)
  })

  for (const locale of ['de', 'pl', 'cs'] as const) {
    test(`${locale} unknown service slug remains a real noindex 404`, async ({ request }) => {
      const response = await request.get(`/${locale}/diagnostics/nicht-kanonisch-${locale}`, {
        maxRedirects: 0,
      })
      expect(response.status()).toBe(404)
      const html = await response.text()
      expect(html).toContain('name="robots" content="noindex, follow"')
      expect(html).not.toContain('rel="canonical"')
      expect(html).not.toContain('rel="alternate" hreflang=')
    })
  }
})

const viewportCases = [
  { locale: 'de', service: 'dental', width: 360, height: 800 },
  { locale: 'en', service: 'poc-systemloesungen', width: 768, height: 900 },
  { locale: 'pl', service: 'kompatibilitaet-integration', width: 1024, height: 900 },
  { locale: 'fr', service: 'infektion-entzuendung', width: 1440, height: 1000 },
  { locale: 'cs', service: 'praeventions-checks', width: 1920, height: 1080 },
] as const

for (const scenario of viewportCases) {
  test(`PT13.10 viewport ${scenario.locale} ${scenario.width}px remains usable`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: scenario.width, height: scenario.height })
    await page.goto(`/${scenario.locale}/diagnostics/${scenario.service}`)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    const firstAction = page.locator('[data-cta-intent="GENERAL_SALES"]').first()
    await firstAction.focus()
    await expect(firstAction).toBeFocused()
    await expect(firstAction).toHaveClass(/focus-visible:ring/)
    const firstFaq = page.locator('#faq button[aria-controls]').first()
    await firstFaq.focus()
    await expect(firstFaq).toBeFocused()
    await firstFaq.press('Enter')
    await expect(firstFaq).toHaveAttribute('aria-expanded', 'true')
  })
}
