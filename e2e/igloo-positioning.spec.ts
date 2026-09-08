import fs from 'node:fs'

import { expect, test } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { RESOURCE_INVENTORY } from '../src/content/resources/resourceInventory'
import {
  getSearchEligibleRouteEntries,
  getSitemapEligibleRouteEntries,
  resolveCanonicalRoute,
} from '../src/routing/routeRegistry'

const PRODUCT_PATH = '/igloo-pro'
const PUBLIC_ORIGIN = 'https://polarisdx.net'

function tagCount(html: string, pattern: RegExp): number {
  return html.match(pattern)?.length ?? 0
}

test('PT14.1 keeps the Registry product truth and evidence contract aligned', () => {
  const route = resolveCanonicalRoute(PRODUCT_PATH)
  expect(route).toMatchObject({
    id: 'igloo-pro',
    familyId: 'igloo-pro',
    path: PRODUCT_PATH,
    routeType: 'PRODUCT',
    localeBehavior: 'LOCALIZED_X10',
    indexability: 'INDEX_FOLLOW',
    searchEligible: true,
  })
  expect(route?.sitemap).toEqual({ kind: 'static', priority: 1, changefreq: 'monthly' })
  expect(getSearchEligibleRouteEntries()).toContainEqual(route)
  expect(getSitemapEligibleRouteEntries()).toContainEqual(route)

  const contract = fs.readFileSync('building-docs/IGLOOPRO-CONTRACT.md', 'utf8')
  expect(contract).toContain('**`CV < 2 %`**')
  expect(contract).toContain('does **not** independently validate the scientific correctness')
  expect(contract).toContain('AP15 remains `NOT STARTED`')
  for (const locale of SUPPORTED_LANGUAGES) {
    expect(contract).toContain(`${PUBLIC_ORIGIN}/${locale}${PRODUCT_PATH}`)
  }
})

test('PT14.1 IglooPro x10 routes, SEO and CTA remain real', async ({ request }) => {
  const sitemapResponse = await request.get('/sitemap.xml')
  expect(sitemapResponse.status()).toBe(200)
  const sitemap = await sitemapResponse.text()

  for (const locale of SUPPORTED_LANGUAGES) {
    const path = `/${locale}${PRODUCT_PATH}`
    const response = await request.get(path, { maxRedirects: 0 })
    expect(response.status(), path).toBe(200)
    expect(response.headers().location, path).toBeUndefined()

    const html = await response.text()
    expect(html, `${path} lang`).toMatch(new RegExp(`<html[^>]+lang="${locale}"`, 'i'))
    expect(tagCount(html, /<h1(?:\s[^>]*)?>/gi), `${path} H1`).toBe(1)
    expect(html, `${path} primary contact target`).toContain(`href="/${locale}/contact"`)
    expect(html, `${path} Product schema`).toMatch(/"@type":"Product"/)
    expect(html, `${path} Breadcrumb schema`).toMatch(/"@type":"BreadcrumbList"/)

    const canonical = `${PUBLIC_ORIGIN}${path}`
    expect(html, `${path} canonical`).toContain(`rel="canonical" href="${canonical}"`)
    expect(tagCount(html, /<link[^>]+rel="alternate"[^>]*>/gi), `${path} hreflang`).toBe(11)
    expect(html, `${path} x-default`).toMatch(
      new RegExp(`hrefLang="x-default" href="${PUBLIC_ORIGIN}/de${PRODUCT_PATH}"`, 'i'),
    )
    expect(sitemap, `${path} sitemap`).toContain(`<loc>${canonical}</loc>`)
    expect(html, `${path} host leakage`).not.toMatch(
      /preview\.polarisdx\.net|localhost|127\.0\.0\.1/,
    )
  }

  const german = await (await request.get('/de/igloo-pro')).text()
  expect(german).toContain('Angebot anfragen')

  // AP19 PT19.5: der Legacy-Katalog ist entfallen. Die AP14-Aussage bleibt —
  // sie wird jetzt gegen das kanonische Inventar geprueft und ist dort
  // strenger: nicht launchsichtbar UND ohne produktiven Link.
  const flyer = RESOURCE_INVENTORY.find((resource) =>
    resource.variants.some((variant) => variant.path === 'igloo-pro-flyer.pdf'),
  )
  expect(flyer?.deliveryClass).toBe('NOT_LAUNCH_VISIBLE')
  expect(flyer?.lifecycle).toBe('LEGACY_ORPHAN')
  expect(flyer?.renderedReferenceKeys).toEqual([])
})
