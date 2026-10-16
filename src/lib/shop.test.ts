import { describe, expect, it } from 'vitest'

import { SHOP_ORIGIN, shopUrl } from './shop'
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
