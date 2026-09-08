import { describe, expect, it } from 'vitest'
import {
  getHomepageSalesContext,
  getHomepageSalesTarget,
  resolveHomepageSalesContext,
} from './homepageConversion'

describe('Homepage GENERAL_SALES context', () => {
  it('builds deterministic targets without inferring attribution from copy', () => {
    expect(getHomepageSalesTarget('hero')).toBe(
      '/contact?intent=quote&source=homepage&journey=general_sales&section=hero#kontaktformular',
    )
    expect(getHomepageSalesContext('final_cta')).toEqual({
      source: 'homepage',
      journey: 'general_sales',
      section: 'final_cta',
    })
  })

  it('accepts only the explicit source, journey and section vocabulary', () => {
    expect(
      resolveHomepageSalesContext(
        new URLSearchParams('source=homepage&journey=general_sales&section=roi'),
      ),
    ).toEqual({ source: 'homepage', journey: 'general_sales', section: 'roi' })
    expect(
      resolveHomepageSalesContext(
        new URLSearchParams('source=homepage&journey=marketing&section=hero'),
      ),
    ).toBeNull()
    expect(
      resolveHomepageSalesContext(
        new URLSearchParams('source=homepage&journey=general_sales&section=unknown'),
      ),
    ).toBeNull()
  })
})
