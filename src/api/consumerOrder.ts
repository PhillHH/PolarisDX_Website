/**
 * Consumer order intake — calls the SendGrid-backed /api/consumer-order
 * endpoint on the backend. Posts a fixed, DSGVO-conform set of fields;
 * the backend forwards the order to a fixed list of internal recipients.
 */

import type { SupportedLanguage } from '../i18n'

export type ConsumerOrderProduct = 'spray' | 'masks' | 'duo'

export interface ConsumerOrderPayload {
  product: ConsumerOrderProduct
  quantity: string
  quantityLabel: string
  // Contact (Ansprechpartner)
  name: string
  email: string
  phone?: string
  // Company (Firma — optional, for business orders)
  company?: string
  // Shipping address (Lieferadresse — optional; sales clarifies if missing)
  street?: string
  postcode?: string
  city?: string
  country?: string
  // Free-form context
  message?: string
  /** Explicit DSGVO consent — must be true. */
  consent: boolean
  /** Honeypot — must stay empty (humans don't see it). */
  _hp?: string
  locale: SupportedLanguage
}

export type ConsumerOrderErrorCode =
  | 'CONSENT_REQUIRED'
  | 'REQUIRED_FIELDS'
  | 'INVALID_EMAIL'
  | 'UNKNOWN_PRODUCT'
  | 'DELIVERY_FAILED'
  | 'RATE_LIMITED'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'

export interface ConsumerOrderResult {
  ok: boolean
  code?: ConsumerOrderErrorCode
}

export async function sendConsumerOrder(
  payload: ConsumerOrderPayload,
): Promise<ConsumerOrderResult> {
  try {
    const res = await fetch('/api/consumer-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      let code: ConsumerOrderErrorCode | undefined
      try {
        const body = (await res.json()) as { code?: ConsumerOrderErrorCode }
        code = body?.code
      } catch {
        /* ignore */
      }
      return { ok: false, code: code ?? 'UNKNOWN_ERROR' }
    }
    const body = (await res.json()) as { success?: boolean }
    return { ok: body?.success === true }
  } catch {
    return { ok: false, code: 'NETWORK_ERROR' }
  }
}
