import type { ResourceAssetLanguage } from '../content/resources/resourceInventory'

/**
 * Client-Seite der `content_download` Journey (AP19 PT19.3).
 *
 * Der Client schickt eine ASSET-ID, nie einen Dateipfad, und bekommt einen
 * geschuetzten Link zurueck. Die Antwort ist zustandswahr: `status` und
 * `providerConfigured` kommen aus der Datenbank, nicht aus einer Annahme.
 */

export interface ContentDownloadRequest {
  name: string
  email: string
  organization: string
  locale: string
  assetId: string
  source: 'resource-center'
  campaign: string
  originRoute: string
  processingConsent: boolean
  marketingConsent: boolean
  consentAcceptedAt: string
  /** Honeypot — von echten Menschen nie gefuellt. */
  _hp: string
}

export interface ContentDownloadResult {
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
  assetId?: string
  /** Die tatsaechlich ausgelieferte Sprache — nicht die angefragte. */
  deliveredLanguage?: ResourceAssetLanguage
  entitlementId?: string
  expiresAt?: string
  downloadUrl?: string
  code?: string
  fields?: string[]
  /** Darf dieselbe Anfrage mit demselben Idempotency-Key erneut gesendet werden? */
  retryable?: boolean
}

/** Das Envelope aus `server/lead-foundation/api-contract.js` (AP22 PT22.5). */
interface JourneyEnvelope {
  success?: boolean
  state?: ContentDownloadResult['status']
  leadId?: string
  deliveryPending?: boolean
  providerConfigured?: boolean
  code?: string
  retryable?: boolean
  fieldErrors?: { field: string }[]
  data?: Pick<
    ContentDownloadResult,
    'assetId' | 'deliveredLanguage' | 'entitlementId' | 'expiresAt' | 'downloadUrl'
  >
}

/**
 * AP26 PT26.3 (SEC-20): der Server antwortet seit AP22 PT22.5 mit dem Envelope
 * `{ success, state, data }`. Dieser Client las `accepted`/`downloadUrl` auf
 * oberster Ebene — jeder persistierte Download erschien als Fehler.
 */
export async function submitContentDownload(
  data: ContentDownloadRequest,
  idempotencyKey: string,
): Promise<ContentDownloadResult> {
  const response = await fetch('/api/content-download', {
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
    ...body.data,
  }
}
