import { beforeEach, describe, expect, it } from 'vitest'

import { applyGoogleConsent, hasAnalyticsConsent } from './googleConsent'

describe('Basic Google consent lifecycle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.getElementById('google-tag-manager-script')?.remove()
    delete window.dataLayer
    delete window.gtag
    delete window.__gtmBootstrapStarted
    delete window.__googleConsentDefaultsSet
  })

  it('creates no provider state for a missing or denied decision', () => {
    expect(hasAnalyticsConsent()).toBe(false)
    applyGoogleConsent({ analytics: false, marketing: false })

    expect(window.dataLayer).toBeUndefined()
    expect(window.gtag).toBeUndefined()
    expect(document.getElementById('google-tag-manager-script')).toBeNull()
  })

  it('loads GTM once only after an explicit grant', () => {
    localStorage.setItem(
      'cookie-consent',
      JSON.stringify([
        { id: 'necessary', enabled: true },
        { id: 'analytics', enabled: true },
        { id: 'marketing', enabled: true },
      ]),
    )

    expect(hasAnalyticsConsent()).toBe(true)
    applyGoogleConsent({ analytics: true, marketing: true })
    applyGoogleConsent({ analytics: true, marketing: true })

    expect(document.querySelectorAll('#google-tag-manager-script')).toHaveLength(1)
    expect(
      window.dataLayer?.filter(
        (entry) =>
          typeof entry === 'object' &&
          entry !== null &&
          !Array.isArray(entry) &&
          'event' in entry &&
          entry.event === 'gtm.js',
      ),
    ).toHaveLength(1)
  })
})
