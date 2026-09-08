import type { SupportedLanguage } from '../i18n'

export interface SupportAttachment {
  filename: string
  content: string // base64
  type: string
}

export interface SupportFormData {
  name: string
  email: string
  udi: string
  swVersion: string
  issueType: string
  subject: string
  description: string
  issueTypeLabel: string
  locale: SupportedLanguage
  /** 202 = Case persistent committet; 400/409 terminal; 429/5xx/Netz retrybar. */
  attachments?: SupportAttachment[]
  /** Explicit DSGVO consent — must be true. */
  processingConsent?: boolean
  consent?: boolean
  consentAcceptedAt?: string
  /** Honeypot — must stay empty (humans don't see it). */
  _hp?: string
}

export type SupportSubmitResult =
  | { ok: true }
  | { ok: false; retryable: boolean; code?: string; fields?: string[] }

/**
 * AP20 PT20.3 — Support-Journey: Idempotency-Key Header, ehrliche
 * Ergebnisklassen. 202/200 = ok, 400/409 = terminal (Feldfehler/Konflikt),
 * 429/5xx/Netzwerk = retryable (Case ist persistiert, Zustellung haengt).
 */
export const sendSupportEmail = async (
  data: SupportFormData,
  idempotencyKey: string,
): Promise<SupportSubmitResult> => {
  try {
    const response = await fetch('/api/support', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(data),
    })

    if (response.status === 202 || response.status === 200) {
      return { ok: true }
    }
    if (response.status === 400 || response.status === 409) {
      const body = (await response.json().catch(() => null)) as {
        code?: string
        fields?: string[]
      } | null
      return { ok: false, retryable: false, code: body?.code, fields: body?.fields }
    }
    return { ok: false, retryable: true, code: `HTTP_${response.status}` }
  } catch (error) {
    console.error('Support request failed:', error)
    return { ok: false, retryable: true, code: 'NETWORK_ERROR' }
  }
}
