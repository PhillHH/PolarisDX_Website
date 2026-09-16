const {
  CrmAdapter,
  CrmRouter,
  IdempotencyConflictError,
  LeadHandoffWorker,
  LeadRepository,
  PENDING_DELIVERY_STATUSES,
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
    deliveryPending: PENDING_DELIVERY_STATUSES.includes(lead?.status),
    providerConfigured,
  }
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * CRM-Adapter der `epigenetics`-Route (AP22 PT22.6).
 *
 * VORHER: dieser Slice baute `new CrmRouter()` OHNE jeden Adapter. Jede
 * Anfrage wurde sauber persistiert — und danach terminal mit
 * `NO_PROVIDER_CONFIGURED` abgelegt. Die Zustellung war ehrlich als
 * "kein Provider" gemeldet, aber niemand hat je eine Epigenetik-Anfrage
 * gesehen. Fuer eine Vertriebsanfrage ist ein Lead, den niemand liest,
 * wertlos.
 *
 * Der Empfaenger ist fest verdrahtet und kommt aus der Umgebung. Ohne
 * gesetzte Variablen wird KEIN Adapter registriert — dann bleibt es beim
 * ehrlichen `NO_PROVIDER_CONFIGURED` statt eines halben Wegs.
 */
class SendGridEpigeneticsInquiryAdapter extends CrmAdapter {
  constructor({ send, recipient, sender }) {
    super()
    if (typeof send !== 'function') throw new TypeError('send is required')
    if (!recipient || !sender) throw new TypeError('recipient and sender are required')
    this.send = send
    this.recipient = recipient
    this.sender = sender
  }

  async deliver({ lead }) {
    const subject = lead.subject || {}
    const context = lead.context || {}
    const rows = [
      ['Name', subject.name],
      ['E-Mail', subject.email],
      ['Organisation', subject.organization],
      ['Einrichtungsart', subject.facilityType],
      ['Faelle/Monat', subject.casesPerMonth],
      ['Panel', context.panel],
      ['Schwerpunkt', context.focus],
      ['Quelle', context.source],
      ['Kampagne', context.campaign],
      ['Herkunftsroute', context.originRoute],
    ]

    try {
      await this.send({
        to: this.recipient,
        from: this.sender,
        replyTo: subject.email,
        subject: `[${String(context.locale || 'de').toUpperCase()}] Epigenetik-Anfrage von ${subject.name || subject.email}`,
        text: [
          'Neue Epigenetik-Anfrage ueber das Webseiten-Formular.',
          '',
          ...rows.map(([label, value]) => `${label}: ${value || '-'}`),
          '',
          'Nachricht:',
          subject.message || '-',
        ].join('\n'),
        html: `<h3>Neue Epigenetik-Anfrage</h3>
<table style="border-collapse:collapse;width:100%;max-width:600px;">
${rows
  .map(
    ([label, value]) =>
      `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:bold;">${esc(label)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(value || '-')}</td></tr>`,
  )
  .join('')}
</table>
<p><strong>Nachricht:</strong></p>
<p>${esc(subject.message || '-').replace(/\n/g, '<br>')}</p>`,
      })
      return { status: 'DELIVERED' }
    } catch (error) {
      const statusCode = Number(error?.response?.statusCode ?? 0)
      const errorCode = String(error?.code || '')
      // AP26 PT26.4: nur ein eindeutiger 5xx ist wiederholbar. ETIMEDOUT/ECONNRESET bleiben
      // unveraendert und werden an der Zustellgrenze als UNBEKANNT eingestuft — vorher
      // machte dieser Zweig daraus SENDGRID_TEMPORARY und sendete blind nach.
      if (statusCode >= 500) {
        throw Object.assign(new Error('SENDGRID_TEMPORARY'), {
          code: 'SENDGRID_TEMPORARY',
          retryable: true,
        })
      }
      throw error
    }
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
function getRuntimeEpigeneticsInquiryService({ mailer, env = process.env } = {}) {
  if (runtime) return runtime
  const db = openLeadDatabase()
  const repository = new LeadRepository(db)

  const adapters = {}
  const recipient = env.EPIGENETICS_RECEIVER || env.CONTACT_RECEIVER
  if (mailer && env.SENDGRID_API_KEY && recipient && env.SENDER_EMAIL) {
    adapters.epigenetics = new SendGridEpigeneticsInquiryAdapter({
      send: (msg) => mailer.send(msg),
      recipient,
      sender: env.SENDER_EMAIL,
    })
  }
  const worker = new LeadHandoffWorker({
    repository,
    router: new CrmRouter({ adapters }),
    workerId: `epigenetics-inquiry-${process.pid}`,
    // Nur die eigene Journey: sonst uebernimmt dieser Worker fremde
    // Auftraege, fuer die sein Router keinen Adapter hat.
    journeys: [JOURNEY],
  })
  runtime = createEpigeneticsInquiryService({ repository, worker })
  return runtime
}

module.exports = {
  SendGridEpigeneticsInquiryAdapter,
  CONSENT_VERSION,
  InquiryValidationError,
  IdempotencyConflictError,
  createEpigeneticsInquiryService,
  getRuntimeEpigeneticsInquiryService,
  normalizeInquiry,
  publicLeadState,
}
