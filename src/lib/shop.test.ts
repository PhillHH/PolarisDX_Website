import { describe, expect, it } from 'vitest'

import { PANELS_ORIGIN, SHOP_ORIGIN, panelsUrl, shopUrl } from './shop'
import { OUTBOUND_DOMAINS } from './tracking'

describe('shopUrl', () => {
  it('fuehrt Deutsch auf die Wurzel und alle anderen Sprachen auf /en', () => {
    expect(shopUrl('de')).toBe(SHOP_ORIGIN)
    expect(shopUrl('de-DE', '/collections/test-kits')).toBe(`${SHOP_ORIGIN}/collections/test-kits`)
    for (const lang of ['en', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'cs', 'da']) {
      expect(shopUrl(lang)).toBe(`${SHOP_ORIGIN}/en`)
    }
    expect(shopUrl(undefined)).toBe(SHOP_ORIGIN)
  })

  it('zaehlt Shop-Klicks ueber die Outbound-Allowlist', () => {
    expect(OUTBOUND_DOMAINS).toContain(new URL(SHOP_ORIGIN).hostname)
  })
})

describe('panelsUrl (SC-007)', () => {
  it('ist ein eigener Shop und folgt derselben Sprachregel', () => {
    expect(PANELS_ORIGIN).not.toBe(SHOP_ORIGIN)
    expect(panelsUrl('de')).toBe(PANELS_ORIGIN)
    expect(panelsUrl('de-DE', '/products/metabolic-health')).toBe(
      `${PANELS_ORIGIN}/products/metabolic-health`,
    )
    for (const lang of ['en', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'cs', 'da']) {
      expect(panelsUrl(lang)).toBe(`${PANELS_ORIGIN}/en`)
    }
    expect(panelsUrl(undefined)).toBe(PANELS_ORIGIN)
  })

  it('zaehlt Panel-Shop-Klicks ueber die Outbound-Allowlist', () => {
    expect(OUTBOUND_DOMAINS).toContain(new URL(PANELS_ORIGIN).hostname)
  })
})
