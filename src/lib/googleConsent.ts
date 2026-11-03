import { resolveAnalyticsConfig } from './analyticsConfig'
import { setTrackingConsent, setTrackingProvider } from './tracking'
import { createGoogleTrackingProvider } from './trackingProvider'
import {
  currentConsent,
  hasCategoryConsent,
  type ConsentDecision,
  type OptionalConsentCategory,
} from './consentState'

/**
 * AP23 PT23.1 — der Provider-Loader im Basic Consent Mode v2.
 *
 * Basic Mode heisst: vor einer Einwilligung wird der Anbieter GAR NICHT
 * geladen. Nicht „geladen und auf `denied` gestellt" — das waere Advanced
 * Mode und wuerde bereits einen Request an Google ausloesen. Dieses Modul
 * kehrt deshalb VOR jedem Seiteneffekt zurueck, solange keine Zustimmung
 * vorliegt: kein `dataLayer`, kein `gtag`, kein Script-Element, kein
 * Preconnect, kein iframe.
 *
 * Es puffert auch nichts. Ereignisse, die vor der Einwilligung entstehen,
 * werden verworfen und nicht nachgesendet — ein Puffer waere eine
 * Vorratsdatenhaltung mit anderem Namen.
 *
 * SC-022 (Owner 2026-11-03, „binde das hier ein"): zusaetzlich zum Container laedt dieses Modul
 * das Google-Ads-Tag (`gtag/js?id=AW-…`, `gtag('config', 'AW-…')`) — aber NUR nach
 * MARKETING-Einwilligung (CONSENT_MARKETING, NETWORK-ALLOWLIST). Analyse-Zustimmung allein laedt
 * den Container, nicht das Werbe-Tag. Dieselben drei Regeln wie beim Container: nichts vor der
 * Zustimmung, genau einmal, keine Kennung ohne Konfiguration (`analyticsConfig.ts`).
 */

export interface GoogleConsentPreferences {
  analytics: boolean
  marketing: boolean
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    __gtmBootstrapStarted?: boolean
    __googleConsentDefaultsSet?: boolean
    __googleAdsConfigured?: boolean
  }
}

const GTM_SCRIPT_ID = 'google-tag-manager-script'
const ADS_SCRIPT_ID = 'google-ads-script'

const deniedConsent = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'granted',
  personalization_storage: 'denied',
  security_storage: 'granted',
}

/** Die geltende Entscheidung in der Form, die dieses Modul verwendet. */
export function readStoredGoogleConsent(): GoogleConsentPreferences {
  const decision: ConsentDecision = currentConsent()
  return { analytics: decision.analytics, marketing: decision.marketing }
}

export function hasAnalyticsConsent(): boolean {
  return hasCategoryConsent('analytics')
}

export function hasMarketingConsent(): boolean {
  return hasCategoryConsent('marketing')
}

/** Hat eine bestimmte Kategorie zugestimmt? Die Pruefung je Einsatzort. */
export function hasConsentFor(category: OptionalConsentCategory): boolean {
  return hasCategoryConsent(category)
}

/** Laeuft in diesem Dokument bereits ein Google-Provider (Container oder Werbe-Tag)? */
export function isProviderLoaded(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.__gtmBootstrapStarted === true ||
    window.__googleAdsConfigured === true ||
    document.getElementById(GTM_SCRIPT_ID) !== null ||
    document.getElementById(ADS_SCRIPT_ID) !== null
  )
}

/** Laeuft das Google-Ads-Tag bereits? */
export function isGoogleAdsLoaded(): boolean {
  if (typeof window === 'undefined') return false
  return window.__googleAdsConfigured === true || document.getElementById(ADS_SCRIPT_ID) !== null
}

function ensureGtag(): Window & typeof globalThis {
  const target = window
  target.dataLayer = target.dataLayer || []
  /**
   * Genau die Form des Google-Schnipsels: `dataLayer.push(arguments)`. gtag.js und gtm.js erkennen
   * nur ein `Arguments`-Objekt als gtag-Befehl (`consent`, `config`, `event`); ein echtes Array
   * waere fuer sie ein gewoehnlicher Datenlayer-Push ohne Wirkung (SC-022, vorher Array).
   */
  target.gtag =
    target.gtag ||
    function gtag() {
      // eslint-disable-next-line prefer-rest-params
      target.dataLayer?.push(arguments)
    }
  return target
}

/**
 * SC-022: Google-Ads-Tag laden — genau einmal, nur mit Marketing-Zustimmung und konfigurierter
 * Kennung. `gtag('js')`/`gtag('config')` gehen in den Datenlayer, bevor das Skript da ist; gtag.js
 * arbeitet die Warteschlange beim Laden ab (so funktioniert auch das Original-Schnipsel).
 */
function loadGoogleAds(target: Window & typeof globalThis, marketing: boolean): void {
  if (!marketing || isGoogleAdsLoaded()) return
  const { googleAdsId } = resolveAnalyticsConfig()
  if (!googleAdsId) return

  target.__googleAdsConfigured = true
  target.gtag?.('js', new Date())
  target.gtag?.('config', googleAdsId)

  const script = document.createElement('script')
  script.id = ADS_SCRIPT_ID
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`
  document.head.appendChild(script)
}

/**
 * Entscheidung anwenden und Google erst nach ausdruecklicher Zustimmung
 * starten.
 *
 * Drei Ausgaenge, in dieser Reihenfolge:
 *
 *  1. **Keine Zustimmung und noch kein Provider** → sofort zurueck. Es
 *     entsteht nichts, was ein Netzwerkwerkzeug sehen koennte.
 *  2. **Keine Zustimmung, aber Provider laeuft schon** (Widerruf im
 *     laufenden Dokument) → `consent update` auf `denied`. Das Skript bleibt
 *     im Dokument, weil ein `<script>` sich nicht zurueckrufen laesst; die
 *     Zustimmungssignale sind aber ab sofort verweigert und
 *     `hasAnalyticsConsent()` sperrt jede weitere Ereignisquelle. Die
 *     vollstaendige Entfernung braucht einen Neuladen — genau das loest
 *     `applyGoogleConsent` fuer den Widerruf aus (siehe `withdrawGoogleConsent`).
 *  3. **Zustimmung** → Defaults setzen, `update` senden, Container genau
 *     einmal laden.
 */
export function applyGoogleConsent(preferences: GoogleConsentPreferences): void {
  if (typeof window === 'undefined') return

  const granted = preferences.analytics || preferences.marketing

  /**
   * AP23 PT23.2 — die Fassade wird HIER an den Zustand gebunden, an genau
   * einer Stelle. Der Geschaeftscode ruft `setTrackingConsent` nie selbst
   * auf; er wuesste sonst, dass es einen Einwilligungszustand gibt, und
   * jede Aufrufstelle waere eine Gelegenheit, ihn zu vergessen.
   *
   * Die Reihenfolge ist Absicht: die Sperre wird ZUERST gesetzt. Bei einem
   * Widerruf ist `track()` damit schon still, bevor unten irgendetwas am
   * Provider passiert.
   */
  setTrackingConsent(preferences.analytics === true)

  const providerAlreadyLoaded = isProviderLoaded()
  if (!granted && !providerAlreadyLoaded) {
    // Kein Anbieter, keine Einwilligung: die Fassade bleibt ein No-Op.
    setTrackingProvider(null)
    return
  }

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

  if (!granted) return
  loadGoogleAds(target, preferences.marketing)
  if (target.__gtmBootstrapStarted || document.getElementById(GTM_SCRIPT_ID)) return

  /**
   * Ohne konfigurierten Container wird NICHTS geladen.
   *
   * Der historische Container aus dem Altbestand ist bewusst kein
   * Standardwert (siehe `analyticsConfig.ts`): eine ungepruefte Kennung als
   * Vorgabe zu verdrahten hiesse, Nutzerdaten an einen Container zu schicken,
   * von dem niemand belegt hat, wem er gehoert. Setzen und pruefen ist
   * AP23 PT23.4.
   */
  const { gtmContainerId } = resolveAnalyticsConfig()
  if (!gtmContainerId) return

  target.__gtmBootstrapStarted = true
  target.dataLayer?.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

  /**
   * Erst jetzt bekommt die Fassade einen Anbieter — nachdem `dataLayer` und
   * `gtag` existieren und die Zustimmung vorliegt. Genau EIN Anbieter: ein
   * zweiter Aufruf ersetzt ihn, statt einen weiteren zu fuehren, sonst
   * entstuende jedes Ereignis doppelt.
   */
  setTrackingProvider(createGoogleTrackingProvider())

  const script = document.createElement('script')
  script.id = GTM_SCRIPT_ID
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmContainerId}`
  document.head.appendChild(script)
}

/**
 * Widerruf.
 *
 * Die Signale werden sofort auf `denied` gesetzt, damit ein bereits
 * geladener Container nichts mehr sendet. Zusaetzlich meldet die Funktion,
 * ob ein Neuladen noetig ist: ein einmal ausgefuehrtes Providerskript laesst
 * sich nicht zuverlaessig aus dem Dokument entfernen — offene Verbindungen,
 * Timer und bereits registrierte Listener ueberleben ein `removeChild`. Der
 * Aufrufer entscheidet, ob er neu laedt; die Entscheidung selbst ist bereits
 * gespeichert und damit auch ohne Reload wirksam.
 */
export function withdrawGoogleConsent(): { reloadRequired: boolean } {
  if (typeof window === 'undefined') return { reloadRequired: false }
  const providerLoaded = isProviderLoaded()
  applyGoogleConsent({ analytics: false, marketing: false })
  // Der Anbieter wird ABGEMELDET, nicht nur stummgeschaltet: `track()` ist
  // danach wieder die leere Funktion aus dem Auslieferungszustand.
  setTrackingProvider(null)
  for (const id of [GTM_SCRIPT_ID, ADS_SCRIPT_ID]) {
    const script = document.getElementById(id)
    script?.parentElement?.removeChild(script)
  }
  return { reloadRequired: providerLoaded }
}
