/**
 * Consumer order intake — calls the SendGrid-backed /api/consumer-order
 * endpoint on the backend. Posts a fixed, DSGVO-conform set of fields;
 * the backend forwards the order to a fixed list of internal recipients.
 */

export type ConsumerOrderProduct = 'spray' | 'masks' | 'duo'

export interface ConsumerOrderPayload {
  product: ConsumerOrderProduct
  quantity: string
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
}

export interface ConsumerOrderResult {
  ok: boolean
  error?: string
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
      let error: string | undefined
      try {
        const body = (await res.json()) as { error?: string }
        error = body?.error
      } catch {
        /* ignore */
      }
      return { ok: false, error: error ?? `HTTP ${res.status}` }
    }
    const body = (await res.json()) as { success?: boolean }
    return { ok: body?.success === true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}
