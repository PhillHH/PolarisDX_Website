const {
  CrmRouter,
  IdempotencyConflictError,
  LeadHandoffWorker,
  LeadRepository,
  openLeadDatabase,
} = require('./lead-foundation')

const JOURNEY = 'epigenetics_inquiry'
const SUPPORTED_LOCALES = new Set(['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'])
const PANELS = new Set([
  'metabolic-health',
  'healthy-aging',
  'biologische-altersuhr',
  'telomer-analyse',
  'stress-monitor',
  'healthy-sport',
])
const FOCUS_KEYS = new Set(['longevity', 'nutrition', 'sports', 'bgm', 'practice'])
const SOURCES = new Set(['epigenetics', 'musterbefund'])
const FACILITY_TYPES = new Set(['practice', 'clinic', 'laboratory', 'consultancy', 'other'])
const VOLUME_RANGES = new Set(['unspecified', '1-10', '11-25', '26-50', '51-plus'])
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CONSENT_VERSION = 'epigenetics-inquiry-2026-09'

class InquiryValidationError extends Error {
  constructor(code, fields = []) {
    super(code)
    this.name = 'InquiryValidationError'
    this.code = code
    this.fields = fields
  }
}

function text(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function optionalEnum(value, values) {
  const normalized = text(value, 128)
  return normalized && values.has(normalized) ? normalized : ''
}

function normalizeOriginRoute(value, locale) {
  const route = text(value, 512)
  const localizedHub = `/${locale}/epigenetics`
  if (
    !route ||
    route.startsWith('//') ||
    !(
      route === localizedHub ||
      route.startsWith(`${localizedHub}?`) ||
      route.startsWith(`${localizedHub}/`)
    )
  ) {
    return localizedHub
  }
  return route
}

function normalizeInquiry(body = {}) {
  const name = text(body.name, 160)
  const email = text(body.email, 254).toLowerCase()
  const organization = text(body.organization, 200)
  const facilityType = optionalEnum(body.facilityType, FACILITY_TYPES)
  const locale = optionalEnum(body.locale, SUPPORTED_LOCALES)
  const panel = optionalEnum(body.panel, PANELS)
  const focus = optionalEnum(body.focus, FOCUS_KEYS)
  const source = optionalEnum(body.source, SOURCES) || 'epigenetics'
  const casesPerMonth = optionalEnum(body.casesPerMonth, VOLUME_RANGES) || 'unspecified'
  const message = text(body.message, 4000)
  const campaign = text(body.campaign, 128)

  const invalid = []
  if (name.length < 2) invalid.push('name')
  if (!EMAIL_RE.test(email)) invalid.push('email')
  if (organization.length < 2) invalid.push('organization')
  if (!facilityType) invalid.push('facilityType')
  if (!locale) invalid.push('locale')
  if (body.panel && !panel) invalid.push('panel')
  if (body.focus && !focus) invalid.push('focus')
  if (body.source && !SOURCES.has(body.source)) invalid.push('source')
  if (body.casesPerMonth && !VOLUME_RANGES.has(body.casesPerMonth)) invalid.push('casesPerMonth')
  if (invalid.length) throw new InquiryValidationError('VALIDATION_FAILED', invalid)
  if (body.processingConsent !== true) {
    throw new InquiryValidationError('PROCESSING_CONSENT_REQUIRED', ['processingConsent'])
  }

  const consentAcceptedAt = text(body.consentAcceptedAt, 64)
  if (!consentAcceptedAt || Number.isNaN(Date.parse(consentAcceptedAt))) {
    throw new InquiryValidationError('INVALID_CONSENT_EVIDENCE', ['consentAcceptedAt'])
  }

  return {
    subject: { name, email, organization, facilityType, casesPerMonth, message },
    context: {
      locale,
      source,
      campaign,
      panel,
      focus,
      originRoute: normalizeOriginRoute(body.originRoute, locale),
    },
    consent: {
      processingAccepted: true,
      acceptedAt: consentAcceptedAt,
      version: CONSENT_VERSION,
      marketing: body.marketingConsent === true ? 'GRANTED' : 'DENIED',
    },
  }
}

function publicLeadState(lead) {
  const accepted = Boolean(lead?.id)
  const providerConfigured =
    lead?.lastErrorClass === 'NO_PROVIDER_CONFIGURED'
      ? false
      : lead?.status === 'DELIVERED'
        ? true
        : undefined
  return {
    accepted,
    leadId: lead?.id,
    status: lead?.status,
    deliveryPending: ['PENDING_HANDOFF', 'PROCESSING', 'RETRY_PENDING'].includes(lead?.status),
    providerConfigured,
  }
}

function createEpigeneticsInquiryService({ repository, worker }) {
  if (!repository || !worker) throw new TypeError('repository and worker are required')
  return {
    async submit({ body, idempotencyKey }) {
      const key = text(idempotencyKey, 200)
      if (!key) throw new InquiryValidationError('IDEMPOTENCY_KEY_REQUIRED', ['idempotencyKey'])
      if (body?._hp) return { ignored: true }

      const normalized = normalizeInquiry(body)
      const persisted = repository.createLead({
        journey: JOURNEY,
        idempotencyKey: key,
        ...normalized,
        channels: ['CRM'],
      })

      // Persistence and its audit event are committed by createLead before the
      // shared worker is allowed to claim any durable outbox item.
      await worker.processNext()
      return publicLeadState(repository.getLead(persisted.id))
    },
    async processNext() {
      return worker.processNext()
    },
  }
}

let runtime
function getRuntimeEpigeneticsInquiryService() {
  if (runtime) return runtime
  const db = openLeadDatabase()
  const repository = new LeadRepository(db)
  const worker = new LeadHandoffWorker({
    repository,
    router: new CrmRouter(),
    workerId: `epigenetics-inquiry-${process.pid}`,
  })
  runtime = createEpigeneticsInquiryService({ repository, worker })
  return runtime
}

module.exports = {
  CONSENT_VERSION,
  InquiryValidationError,
  IdempotencyConflictError,
  createEpigeneticsInquiryService,
  getRuntimeEpigeneticsInquiryService,
  normalizeInquiry,
  publicLeadState,
}
