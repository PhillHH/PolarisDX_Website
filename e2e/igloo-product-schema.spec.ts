import fs from 'node:fs'

import { expect, test } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

const PUBLIC_ORIGIN = 'https://polarisdx.net'
const PRODUCT_PATH = '/igloo-pro'

type JsonLdEntity = Record<string, unknown>

function jsonLdEntities(html: string): JsonLdEntity[] {
  const scripts = [
    ...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  ]
  return scripts.flatMap((match) => {
    const value = JSON.parse(match[1]) as JsonLdEntity | JsonLdEntity[]
    return Array.isArray(value) ? value : [value]
  })
}

test('PT14.5 emits one locale-aware, claim-safe IglooPro Product entity in all ten locales', async ({
  request,
}) => {
  const productIds = new Set<string>()

  for (const locale of SUPPORTED_LANGUAGES) {
    const resource = JSON.parse(
      fs.readFileSync(`public/locales/${locale}/products.json`, 'utf8'),
    ) as { hero: { description: string } }
    const path = `/${locale}${PRODUCT_PATH}`
    const response = await request.get(path, { maxRedirects: 0 })
    expect(response.status(), path).toBe(200)

    const html = await response.text()
    const entities = jsonLdEntities(html)
    const products = entities.filter((entity) => entity['@type'] === 'Product')
    expect(products, `${path} Product count`).toHaveLength(1)

    const product = products[0]
    const canonical = `${PUBLIC_ORIGIN}${path}`
    expect(product, path).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${canonical}#product`,
      name: 'IglooPro',
      description: resource.hero.description,
      url: canonical,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      inLanguage: locale,
    })
    expect(product.image, `${path} image`).toMatch(
      /^https:\/\/polarisdx\.net\/assets\/Igloo-pro-frontal-[\w-]+\.webp$/,
    )

    for (const forbidden of [
      'brand',
      'manufacturer',
      'offers',
      'price',
      'availability',
      'rating',
      'review',
      'aggregateRating',
      'sku',
      'gtin',
      'discount',
      'seller',
      'additionalProperty',
    ]) {
      expect(product, `${path} ${forbidden}`).not.toHaveProperty(forbidden)
    }

    const serialized = JSON.stringify(product)
    expect(serialized, `${path} QuantitativeValue`).not.toContain('QuantitativeValue')
    expect(serialized, `${path} claim amplification`).not.toMatch(
      /CV\s*<|accuracy|guarantee|diagnos|therap|outcome|certif|zulassung|approval/i,
    )
    expect(serialized, `${path} public host`).not.toMatch(
      /preview\.polarisdx\.net|localhost|127\.0\.0\.1/i,
    )

    const id = String(product['@id'])
    expect(productIds.has(id), `${path} duplicate Product @id`).toBe(false)
    productIds.add(id)
  }

  expect(productIds.size).toBe(SUPPORTED_LANGUAGES.length)
})

test('PT14.5 does not inject Product markup into generic Diagnostics or Downloads pages', async ({
  request,
}) => {
  for (const path of ['/de/diagnostics', '/en/downloads']) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    expect(
      jsonLdEntities(await response.text()).filter((entity) => entity['@type'] === 'Product'),
      path,
    ).toHaveLength(0)
  }
})
