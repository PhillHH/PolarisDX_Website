import type { SupportedLanguage } from '../i18n'
import type {
  EpigeneticsFocus,
  EpigeneticsInquirySource,
  EpigeneticsPanel,
} from '../lib/epigeneticsContext'

export interface EpigeneticsInquiryData {
  name: string
  email: string
  organization: string
  facilityType: 'practice' | 'clinic' | 'laboratory' | 'consultancy' | 'other'
  casesPerMonth: 'unspecified' | '1-10' | '11-25' | '26-50' | '51-plus'
  message: string
  locale: SupportedLanguage
  source: EpigeneticsInquirySource
  campaign: string
  panel: EpigeneticsPanel | ''
  focus: EpigeneticsFocus | ''
  originRoute: string
  processingConsent: boolean
  marketingConsent: boolean
  consentAcceptedAt: string
  _hp: string
}

export interface EpigeneticsInquiryResult {
  accepted: boolean
  leadId?: string
  /**
   * AP22 PT22.2: `QUEUED` ist der kanonische Name des Wartezustands,
   * `RECONCILIATION_REQUIRED` steht fuer ein unbekanntes Providerergebnis.
   * `PENDING_HANDOFF` bleibt als Altwert gelistet, damit eine aeltere
   * gespeicherte Antwort weiterhin typkonform ist.
   */
  status?:
    | 'VALIDATED'
    | 'QUEUED'
    | 'PENDING_HANDOFF'
    | 'PROCESSING'
    | 'DELIVERED'
    | 'RETRY_PENDING'
    | 'RECONCILIATION_REQUIRED'
    | 'FAILED_TERMINAL'
  deliveryPending?: boolean
  providerConfigured?: boolean
  code?: string
  fields?: string[]
  /** Darf dieselbe Anfrage mit demselben Idempotency-Key erneut gesendet werden? */
  retryable?: boolean
}

/** Das Envelope aus `server/lead-foundation/api-contract.js` (AP22 PT22.5). */
interface JourneyEnvelope {
  success?: boolean
  state?: EpigeneticsInquiryResult['status']
  leadId?: string
  deliveryPending?: boolean
  providerConfigured?: boolean
  code?: string
  retryable?: boolean
  fieldErrors?: { field: string }[]
}

/**
 * AP26 PT26.3 (SEC-20): der Server antwortet seit AP22 PT22.5 mit dem Envelope
 * `{ success, state }`. Dieser Client las `accepted` auf oberster Ebene — jede
 * persistierte Anfrage erschien als Fehler, und das Formular verwarf daraufhin
 * den Idempotency-Key: ein erneutes Absenden erzeugte einen zweiten Vorgang.
 */
export async function submitEpigeneticsInquiry(
  data: EpigeneticsInquiryData,
  idempotencyKey: string,
): Promise<EpigeneticsInquiryResult> {
  const response = await fetch('/api/epigenetics-inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(data),
  })
  let body: JourneyEnvelope = {}
  try {
    body = (await response.json()) as JourneyEnvelope
  } catch {
    // Keine JSON-Antwort (z. B. Proxy-Fehler) — unten als Ablehnung behandelt.
  }
  if (!response.ok || body.success !== true) {
    return {
      accepted: false,
      code: body.code,
      fields: body.fieldErrors?.map((error) => error.field),
      retryable: body.retryable ?? response.status >= 500,
    }
  }
  return {
    accepted: true,
    leadId: body.leadId,
    status: body.state,
    deliveryPending: body.deliveryPending,
    providerConfigured: body.providerConfigured,
  }
}
