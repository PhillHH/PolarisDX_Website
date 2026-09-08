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
  status?: 'PENDING_HANDOFF' | 'PROCESSING' | 'DELIVERED' | 'RETRY_PENDING' | 'FAILED_TERMINAL'
  deliveryPending?: boolean
  providerConfigured?: boolean
  code?: string
  fields?: string[]
}

export async function submitEpigeneticsInquiry(
  data: EpigeneticsInquiryData,
  idempotencyKey: string,
): Promise<EpigeneticsInquiryResult> {
  const response = await fetch('/api/epigenetics-inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(data),
  })
  const result = (await response.json()) as EpigeneticsInquiryResult
  if (!response.ok) return { ...result, accepted: false }
  return result
}
