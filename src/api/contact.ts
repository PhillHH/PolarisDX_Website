import type { SupportedLanguage } from '../i18n'

export interface ContactFormData {
  name: string
  email: string
  message?: string
  company?: string
  phone?: string
  area?: string
  requirements?: string
  /** Intent pill — e.g. consultation / quote / support. */
  intent?: string
  /** Field pill — e.g. dental / beauty / longevity. */
  field?: string
  /** Validated URL/journey locale used by current mail flows. */
  locale: SupportedLanguage
  /** Allowlisted journey context; attribution in the lead payload, not analytics. */
  source?: string
  journey?: string
  section?: string
  /** Processing consent evidence — required, persisted server-side. */
  processingConsent?: boolean
  /** Legacy alias kept for backward compatibility; maps to processingConsent. */
  consent?: boolean
  /** Marketing consent — optional and strictly separate from processing. */
  marketingConsent?: boolean
  /** ISO timestamp of the consent click — persisted as consent evidence. */
  consentAcceptedAt?: string
  /** Honeypot — must stay empty (humans don't see it). */
  _hp?: string
}

export type ContactSubmitResult =
  | { ok: true }
  | { ok: false; retryable: boolean; code?: string; fields?: string[] }

/**
 * Contact-Journey (AP20 PT20.2): POST /api/contact ist ein persistenter
 * Lead-Endpunkt, kein Mail-Relais mehr. Der Idempotency-Key wird als Header
 * gesendet und bleibt ueber Wiederholungen gleich — ein erneuter Absenden-
 * Versuch erzeugt keinen zweiten Lead. 202 = dauerhaft angenommen; 409 =
 * Konflikt (terminal); 400 = Validierung; 429/5xx/Netzwerk = retrybar.
 */
export const sendContactEmail = async (
  data: ContactFormData,
  idempotencyKey: string,
): Promise<ContactSubmitResult> => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(data),
    })

    if (response.status === 202 || response.status === 200) return { ok: true }

    let payload: { code?: string; fields?: string[] } = {}
    try {
      payload = await response.json()
    } catch {
      // Nicht-JSON-Ablehnung — unten ueber Statuscode klassifiziert.
    }

    if (response.status === 400) {
      return { ok: false, retryable: false, code: payload.code, fields: payload.fields }
    }
    if (response.status === 409) {
      return { ok: false, retryable: false, code: payload.code || 'IDEMPOTENCY_CONFLICT' }
    }
    // 429 (Rate Limit) und 5xx sind retrybar — der Lead ist ggf. schon
    // persistiert; dieselbe Anfrage mit demselben Key absetzen ist sicher.
    return { ok: false, retryable: true, code: payload.code }
  } catch (error) {
    console.error('Contact submission failed:', error)
    return { ok: false, retryable: true, code: 'NETWORK_ERROR' }
  }
}
