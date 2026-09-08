import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { getSearchEligibleRouteEntries, resolveCanonicalRoute } from '../src/routing/routeRegistry'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const PUBLIC_ORIGIN = 'https://polarisdx.net'

const DEEP_ROUTES = [
  {
    key: 'grundlagen',
    routeId: 'epigenetics-grundlagen',
    titleKey: 'principle.title',
    leadKey: 'principle.lead',
  },
  {
    key: 'studienlage',
    routeId: 'epigenetics-studienlage',
    titleKey: 'evidence.title',
    leadKey: 'evidence.lead',
  },
  {
    key: 'unterlagen',
    routeId: 'epigenetics-unterlagen',
    titleKey: 'downloads.title',
    leadKey: 'downloads.sub',
  },
] as const

type JsonObject = Record<string, unknown>

const resources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(readFileSync(`public/locales/${locale}/epigenetics.json`, 'utf8')) as JsonObject,
  ]),
) as Record<(typeof SUPPORTED_LANGUAGES)[number], JsonObject>

function valueAt(resource: JsonObject, key: string): string {
  const value = key.split('.').reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object') return undefined
    return (current as JsonObject)[segment]
  }, resource)
  if (typeof value !== 'string' || !value.trim()) throw new Error(`Missing locale value: ${key}`)
  return value
}

function tagCount(html: string, pattern: RegExp): number {
  return html.match(pattern)?.length ?? 0
}

function attribute(html: string, tagPattern: RegExp, name: string): string | undefined {
  const tag = html.match(tagPattern)?.[0]
  return tag?.match(new RegExp(`${name}="([^"]*)"`, 'i'))?.[1]
}

test('PT15.2 resolves three registry-backed deep families into a 30 URL SEO matrix', async ({
  request,
}) => {
  test.setTimeout(180_000)
  const sitemapResponse = await request.get('/sitemap.xml', { maxRedirects: 0 })
  expect(sitemapResponse.status()).toBe(200)
  const sitemap = await sitemapResponse.text()
  const searchTargets = new Set(getSearchEligibleRouteEntries().map(({ path }) => path))

  for (const family of DEEP_ROUTES) {
    const path = `/epigenetics/${family.key}`
    const registryRoute = resolveCanonicalRoute(path)
    expect(registryRoute?.id, `${family.key}: Registry ID`).toBe(family.routeId)
    expect(registryRoute?.routeType, `${family.key}: route type`).toBe('EPIGENETICS')
    expect(registryRoute?.indexability, `${family.key}: indexability`).toBe('INDEX_FOLLOW')
    expect(registryRoute?.sitemap, `${family.key}: sitemap`).not.toBe(false)
    expect(searchTargets, `${family.key}: Search eligibility`).toContain(path)

    for (const locale of SUPPORTED_LANGUAGES) {
      const localizedPath = `/${locale}${path}`
      const canonical = `${PUBLIC_ORIGIN}${localizedPath}`
      const response = await request.get(localizedPath, { maxRedirects: 0 })
      expect(response.status(), localizedPath).toBe(200)
      expect(response.headers().location, localizedPath).toBeUndefined()

      const html = await response.text()
      expect(html, `${localizedPath}: locale`).toContain(`<html lang="${locale}"`)
      expect(html, `${localizedPath}: family marker`).toContain(
        `data-epigenetics-subpage="${family.key}"`,
      )
      expect(html, `${localizedPath}: route marker`).toContain(`data-route-id="${family.routeId}"`)
      expect(html, `${localizedPath}: translated H1`).toContain(
        valueAt(resources[locale], family.titleKey),
      )
      expect(html, `${localizedPath}: translated lead`).toContain(
        valueAt(resources[locale], family.leadKey),
      )
      expect(tagCount(html, /<h1(?:\s[^>]*)?>/gi), `${localizedPath}: H1 count`).toBe(1)
      expect(
        attribute(html, /<meta[^>]+name="robots"[^>]*>/i, 'content'),
        `${localizedPath}: robots`,
      ).toMatch(/^index, follow/)
      expect(tagCount(html, /<link[^>]+rel="canonical"[^>]*>/gi)).toBe(1)
      expect(attribute(html, /<link[^>]+rel="canonical"[^>]*>/i, 'href')).toBe(canonical)
      expect(tagCount(html, /<link[^>]+rel="alternate"[^>]*>/gi)).toBe(11)
      for (const alternate of SUPPORTED_LANGUAGES) {
        const tag = new RegExp(`<link[^>]+rel="alternate"[^>]+hreflang="${alternate}"[^>]*>`, 'i')
        expect(attribute(html, tag, 'href')).toBe(`${PUBLIC_ORIGIN}/${alternate}${path}`)
      }
      expect(
        attribute(html, /<link[^>]+rel="alternate"[^>]+hreflang="x-default"[^>]*>/i, 'href'),
      ).toBe(`${PUBLIC_ORIGIN}/de${path}`)
      expect(sitemap, `${localizedPath}: sitemap membership`).toContain(`<loc>${canonical}</loc>`)
      expect(attribute(html, /<meta[^>]+property="og:url"[^>]*>/i, 'content')).toBe(canonical)
      expect(attribute(html, /<meta[^>]+property="og:image:alt"[^>]*>/i, 'content')).toBeTruthy()
      expect(attribute(html, /<meta[^>]+name="twitter:card"[^>]*>/i, 'content')).toBe(
        'summary_large_image',
      )
      expect(html, `${localizedPath}: Breadcrumb schema`).toContain('"@type":"BreadcrumbList"')
      expect(html, `${localizedPath}: real inquiry target`).toContain(
        `href="/${locale}/epigenetics?source=epigenetics&amp;campaign=${family.key}#inquiry"`,
      )
      expect(html, `${localizedPath}: hub return`).toContain(`href="/${locale}/epigenetics"`)
      expect(html, `${localizedPath}: no preview host`).not.toMatch(
        /preview\.polarisdx\.net|localhost|127\.0\.0\.1/,
      )
      expect(html, `${localizedPath}: no legacy service target`).not.toMatch(
        new RegExp(`href="/${locale}/services(?:/|"|#)`),
      )
      expect(html, `${localizedPath}: no visible key`).not.toMatch(
        />(?:principle|basics|evidence|downloads|docsBand)\.[\w.-]+</,
      )
      if (family.key === 'studienlage') {
        const evidenceFile = valueAt(resources[locale], 'evidence.file')
        const resourceLanguage = evidenceFile.startsWith('de/') ? 'de' : 'en'
        expect(html, `${localizedPath}: real evidence asset`).toContain(
          `href="/downloads/epigenetics/${evidenceFile}"`,
        )
        expect(html, `${localizedPath}: evidence language disclosure`).toContain(
          `data-resource-language="${resourceLanguage}"`,
        )
      }
      if (family.key === 'unterlagen') {
        expect(html, `${localizedPath}: document language disclosure`).toContain(
          'data-resource-language=',
        )
      }
    }
  }
})

test('PT15.2 unknown deep slugs remain real 404 responses', async ({ request }) => {
  for (const locale of ['de', 'en', 'cs'] as const) {
    const path = `/${locale}/epigenetics/__pt15-2-unknown__`
    const response = await request.get(path, { maxRedirects: 0 })
    expect(response.status(), path).toBe(404)
    const html = await response.text()
    expect(attribute(html, /<meta[^>]+name="prerender-status-code"[^>]*>/i, 'content')).toBe('404')
    expect(tagCount(html, /<link[^>]+rel="canonical"[^>]*>/gi)).toBe(0)
  }
})

for (const [locale, family, width] of [
  ['de', 'grundlagen', 390],
  ['pl', 'studienlage', 768],
  ['cs', 'unterlagen', 1440],
] as const) {
  test(`PT15.2 ${locale}/${family} is keyboard-reachable, responsive and Axe-clean`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(`/${locale}/epigenetics/${family}`)
    await expect(page.locator('main h1')).toHaveCount(1)

    const inquiry = page.locator(
      `main a[href="/${locale}/epigenetics?source=epigenetics&campaign=${family}#inquiry"]`,
    )
    await expect(inquiry).toBeVisible()
    await inquiry.focus()
    await expect(inquiry).toBeFocused()

    const overflow = await page.evaluate(
      () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)

    await page.waitForTimeout(1200)
    await page.addScriptTag({ path: axePath })
    const violations = await page.evaluate(async () => {
      const axe = (
        window as Window & {
          axe: {
            run: (
              context: string,
              options: Record<string, unknown>,
            ) => Promise<{ violations: Array<{ id: string; impact: string | null }> }>
          }
        }
      ).axe
      const result = await axe.run('main', {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      })
      return result.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')
    })
    expect(violations).toEqual([])
  })
}
