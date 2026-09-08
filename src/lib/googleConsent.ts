export interface GoogleConsentPreferences {
  analytics: boolean
  marketing: boolean
}

interface StoredConsentCategory {
  id?: string
  enabled?: boolean
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __gtmBootstrapStarted?: boolean
    __googleConsentDefaultsSet?: boolean
  }
}

const CONSENT_STORAGE_KEY = 'cookie-consent'
const GTM_SCRIPT_ID = 'google-tag-manager-script'
const GTM_CONTAINER_ID = 'GTM-TW6JFX7K'

const deniedConsent = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'granted',
  personalization_storage: 'denied',
  security_storage: 'granted',
}

export function readStoredGoogleConsent(): GoogleConsentPreferences {
  if (typeof window === 'undefined') return { analytics: false, marketing: false }

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return { analytics: false, marketing: false }
    const categories = JSON.parse(raw) as StoredConsentCategory[]
    if (!Array.isArray(categories)) return { analytics: false, marketing: false }
    return {
      analytics: categories.some(({ id, enabled }) => id === 'analytics' && enabled === true),
      marketing: categories.some(({ id, enabled }) => id === 'marketing' && enabled === true),
    }
  } catch {
    return { analytics: false, marketing: false }
  }
}

export function hasAnalyticsConsent(): boolean {
  return readStoredGoogleConsent().analytics
}

function ensureGtag(): Window & typeof globalThis {
  const target = window
  target.dataLayer = target.dataLayer || []
  target.gtag =
    target.gtag ||
    ((...args: unknown[]) => {
      target.dataLayer?.push(args)
    })
  return target
}

/**
 * Applies the current decision and starts Google only after an explicit grant.
 * A missing decision and an explicit rejection both return before creating a
 * dataLayer, script element or provider request. Events are not buffered.
 */
export function applyGoogleConsent(preferences: GoogleConsentPreferences): void {
  if (typeof window === 'undefined') return

  const providerAlreadyLoaded = window.__gtmBootstrapStarted === true
  if (!preferences.analytics && !preferences.marketing && !providerAlreadyLoaded) return

  const target = ensureGtag()
  if (!target.__googleConsentDefaultsSet) {
    target.gtag?.('consent', 'default', deniedConsent)
    target.__googleConsentDefaultsSet = true
  }

  target.gtag?.('consent', 'update', {
    analytics_storage: preferences.analytics ? 'granted' : 'denied',
    ad_storage: preferences.marketing ? 'granted' : 'denied',
    ad_user_data: preferences.marketing ? 'granted' : 'denied',
    ad_personalization: preferences.marketing ? 'granted' : 'denied',
  })

  if (!preferences.analytics && !preferences.marketing) return
  if (target.__gtmBootstrapStarted || document.getElementById(GTM_SCRIPT_ID)) return

  target.__gtmBootstrapStarted = true
  target.dataLayer?.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

  const script = document.createElement('script')
  script.id = GTM_SCRIPT_ID
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`
  document.head.appendChild(script)
}
