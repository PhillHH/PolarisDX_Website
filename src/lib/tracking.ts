/**
 * dataLayer-Helfer fuer Seiten ausserhalb der Consumer-Strecke.
 *
 * Gleiches Muster wie src/pages/consumer/tracking.ts: hier werden nur
 * strukturierte Ereignisse in den dataLayer geschoben. Ob und wohin daraus ein
 * GA4- oder Ads-Tag wird, entscheidet der GTM-Container (GTM-TW6JFX7K) — so
 * braucht die Marketingseite fuer neue Conversions keinen Code-Deploy.
 *
 * Consent: index.html setzt Consent Mode v2 auf "denied" als Ausgangszustand.
 * Ein dataLayer-Push allein sendet nichts; GTM haelt die Tags zurueck, bis der
 * Nutzer zugestimmt hat. Deshalb ist das Feuern hier unbedenklich.
 *
 * SSR: jeder Push ist gegen fehlendes window abgesichert.
 */

interface DataLayerEvent extends Record<string, unknown> {
  event: string
}

export function trackEvent(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params } as DataLayerEvent)
}
