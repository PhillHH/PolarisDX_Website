import type { SupportedLanguage } from '../i18n'

/**
 * `practice_order` (AP22 PT22.5): die Praxisbestellung als eigene Journey.
 *
 * Vorher lief sie durch `/api/contact` und wurde dort an einem Magic String
 * im Feld `area` erkannt, der ueber den Mailempfaenger entschied. Jetzt gibt
 * es einen eigenen Endpunkt mit eigenem CRM-Ziel; Produkt und Menge sind
 * serverseitig allowlistet.
 */

/** Serverseitig allowlistet — der Client sendet eine ID, keinen Namen. */
export type PracticeOrderProduct = 'vitamin-d3-k2-spray'

export type PracticeOrgType = 'praxis' | 'klinik' | 'apotheke' | 'labor' | 'other'

export interface PracticeOrderPayload {
  product: PracticeOrderProduct
  /** Allowlistete Stueckzahl; ein fremder Wert wird abgelehnt. */
  quantity: number
  organization: string
  name: string
  email: string
  phone?: string
  street?: string
  postcode?: string
  city?: string
  message?: string
  orgType?: PracticeOrgType
  locale: SupportedLanguage
  processingConsent: boolean
  marketingConsent?: boolean
  consentAcceptedAt: string
  _hp?: string
}

export type PracticeOrderResult =
  | { ok: true; reference?: string; state?: string }
  | { ok: false; retryable: boolean; code?: string; messageKey?: string; fields?: string[] }

export async function sendPracticeOrder(
  payload: PracticeOrderPayload,
  idempotencyKey: string,
): Promise<PracticeOrderResult> {
  try {
    const response = await fetch('/api/practice-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(payload),
    })

    let body: {
      reference?: string
      state?: string
      code?: string
      retryable?: boolean
      messageKey?: string
      fieldErrors?: Array<{ field: string }>
    } = {}
    try {
      body = (await response.json()) as typeof body
    } catch {
      // Nicht-JSON — der Statuscode bleibt massgeblich.
    }

    if (response.status === 202 || response.status === 200) {
      return { ok: true, reference: body.reference, state: body.state }
    }
    return {
      ok: false,
      retryable: body.retryable ?? response.status >= 500,
      code: body.code,
      messageKey: body.messageKey,
      fields: body.fieldErrors?.map((entry) => entry.field),
    }
  } catch {
    return { ok: false, retryable: true, code: 'NETWORK_ERROR' }
  }
}
