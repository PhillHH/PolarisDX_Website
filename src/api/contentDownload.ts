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
  status?: 'PENDING_HANDOFF' | 'PROCESSING' | 'DELIVERED' | 'RETRY_PENDING' | 'FAILED_TERMINAL'
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
}

export async function submitContentDownload(
  data: ContentDownloadRequest,
  idempotencyKey: string,
): Promise<ContentDownloadResult> {
  const response = await fetch('/api/content-download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(data),
  })
  const result = (await response.json()) as ContentDownloadResult
  if (!response.ok) return { ...result, accepted: false }
  return result
}
