const {
  CrmAdapter,
  CrmRouter,
  IdempotencyConflictError,
  LeadHandoffWorker,
  LeadRepository,
  openLeadDatabase,
} = require('./lead-foundation')

/**
 * `contact` — die allgemeine Anfrage als eigene Lead-Journey.
 *
 * REIHENFOLGE (Persistenz vor jedem externen Handoff):
 *
 *   validieren → Processing-Consent pruefen → PERSISTIEREN (Lead + Outbox)
 *   → CRM-Handoff (SendGrid-Team-Mail via CrmRouter) → Status
 *
 * - Persistenz, Idempotency, Outbox, Retry und CRM-Routing sind die
 *   geteilten lead-foundation-Primitive; diese Datei ist EIN Journey-Slice,
 *   keine zweite Lead-Plattform (AP22-Grenze).
 * - Kein Multiplexing: `contact` ist die allgemeine Sales-/Beratungs-Journey.
 *   Consumer-/Epigenetics-/Support-Sonderfaelle haben eigene Journeys/Endpoints.
 * - Consent: Processing ist Pflicht, Marketing optional und getrennt.
 *   Analytics-Einwilligung ist an keiner Stelle Voraussetzung.
 * - Ohne konfigurierten Provider sagt der Status ehrlich
 *   NO_PROVIDER_CONFIGURED — kein Fake-SENT.
 */

const JOURNEY = 'contact'
const SUPPORTED_LOCALES = new Set(['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'])
const INTENTS = new Set(['consultation', 'quote', 'product', 'support', 'other'])
const FIELDS = new Set([
  'dental',
  'beauty',
  'longevity',
  'nutrition',
  'sports',
  'bgm',
  'practice',
  'pharmacy',
  'other',
])
const HOMEPAGE_SALES_SECTIONS = new Set(['hero', 'roi', 'final_cta'])
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CONSENT_VERSION = 'contact-2026-09'
const SPRAY_ORDER_MARKER = 'Vitamin D3+K2 Spray BESTELLUNG'
const SPRAY_ORDER_RECIPIENT = 'ulrikes@polarisdx.net'

class ContactValidationError extends Error {
  constructor(code, fields = []) {
    super(code)
    this.name = 'ContactValidationError'
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

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Attributions kommen vom Client und werden allowlisted: nur die bekannte
 * Homepage-Sales-Kombination darf persistent werden. Alles andere faellt auf
 * leer — ein Absender kann sich keine fremde Herkunft in den Lead schreiben.
 */
function normalizeAttribution(body = {}) {
  const source = text(body.source, 128)
  const journey = text(body.journey, 128)
  const section = text(body.section, 128)
  if (
    source === 'homepage' &&
    journey === 'general_sales' &&
    HOMEPAGE_SALES_SECTIONS.has(section)
  ) {
    return { source, journey, section }
  }
  return { source: '', journey: '', section: '' }
}

/**
 * Die Herkunftsroute darf nur eine eigene Seite dieser Sprache sein.
 */
function normalizeOriginRoute(value, locale) {
  const route = text(value, 512)
  if (!route || route.startsWith('//') || !route.startsWith(`/${locale}/`)) {
    return `/${locale}/contact`
  }
  return route
}

function normalizeRequest(body = {}) {
  const name = text(body.name, 160)
  const email = text(body.email, 254).toLowerCase()
  const company = text(body.company, 200)
  const phone = text(body.phone, 64)
  const area = text(body.area, 200)
  const intent = optionalEnum(body.intent, INTENTS)
  const field = optionalEnum(body.field, FIELDS)
  const locale = optionalEnum(body.locale, SUPPORTED_LOCALES)
  const message = text(body.message, 4000) || text(body.requirements, 4000)
  const campaign = text(body.campaign, 128)
  const attribution = normalizeAttribution(body)

  const invalid = []
  if (name.length < 2) invalid.push('name')
  if (!EMAIL_RE.test(email)) invalid.push('email')
  if (message.length < 2) invalid.push('message')
  if (!locale) invalid.push('locale')
  if (body.intent && !intent) invalid.push('intent')
  if (body.field && !field) invalid.push('field')
  if (invalid.length) throw new ContactValidationError('VALIDATION_FAILED', invalid)

  return {
    subject: { name, email, company, phone, area, intent, field, message },
    locale,
    campaign,
    attribution,
    originRoute: normalizeOriginRoute(body.originRoute, locale),
  }
}

/**
 * Consent GETRENNT: ohne Verarbeitungs-Einwilligung laeuft gar nichts;
 * Marketing ist davon unabhaengig und optional.
 */
function normalizeConsentEvidence(body = {}) {
  if (body.processingConsent !== true && body.consent !== true) {
    throw new ContactValidationError('PROCESSING_CONSENT_REQUIRED', ['processingConsent'])
  }
  const acceptedAt = text(body.consentAcceptedAt, 64)
  if (!acceptedAt || Number.isNaN(Date.parse(acceptedAt))) {
    throw new ContactValidationError('INVALID_CONSENT_EVIDENCE', ['consentAcceptedAt'])
  }
  return {
    processingAccepted: true,
    acceptedAt,
    version: CONSENT_VERSION,
    marketing: body.marketingConsent === true ? 'GRANTED' : 'DENIED',
  }
}

function publicLeadState(lead) {
  return {
    accepted: Boolean(lead?.id),
    leadId: lead?.id,
    journey: lead?.journey,
    status: lead?.status,
    deliveryPending: ['PENDING_HANDOFF', 'PROCESSING', 'RETRY_PENDING'].includes(lead?.status),
    providerConfigured:
      lead?.lastErrorClass === 'NO_PROVIDER_CONFIGURED'
        ? false
        : lead?.status === 'DELIVERED'
          ? true
          : undefined,
  }
}

/**
 * Der CRM-Adapter fuer die `general-sales`-Route: die Team-Mail ueber den
 * bestehenden SendGrid-Transport. `send` wird injiziert — im Betrieb die
 * DRY_RUN-bewusste sgMail-Instanz aus server.js, in Tests ein Fake.
 * 5xx/Timeouts sind retryfaehig, alles andere terminal.
 */
class SendGridTeamMailAdapter extends CrmAdapter {
  constructor({ send, recipient, sender, sprayRecipient = SPRAY_ORDER_RECIPIENT }) {
    super()
    if (typeof send !== 'function') throw new TypeError('send is required')
    if (!recipient || !sender) throw new TypeError('recipient and sender are required')
    this.send = send
    this.recipient = recipient
    this.sender = sender
    this.sprayRecipient = sprayRecipient
  }

  async deliver({ lead }) {
    const subject = lead.subject || {}
    const context = lead.context || {}
    const attribution = [
      `Quelle: ${context.source || '-'}`,
      `Journey: ${context.journey || '-'}`,
      `Bereichskontext: ${context.section || '-'}`,
      `Kampagne: ${context.campaign || '-'}`,
    ].join('\n')
    const textBody = [
      'Neue Kontaktanfrage ueber das Webseiten-Formular:',
      '',
      `Name: ${subject.name || '-'}`,
      `Firma: ${subject.company || '-'}`,
      `E-Mail: ${subject.email || '-'}`,
      `Telefon: ${subject.phone || '-'}`,
      `Bereich: ${subject.area || '-'}`,
      `Anliegen: ${subject.intent || '-'}`,
      `Fachbereich: ${subject.field || '-'}`,
      attribution,
      '',
      'Nachricht:',
      subject.message || '-',
    ].join('\n')
    const htmlBody = `
<h3>Neue Kontaktanfrage</h3>
<p><strong>Name:</strong> ${esc(subject.name)}<br>
<strong>Firma:</strong> ${esc(subject.company || '-')}<br>
<strong>E-Mail:</strong> ${esc(subject.email)}<br>
<strong>Telefon:</strong> ${esc(subject.phone || '-')}<br>
<strong>Bereich:</strong> ${esc(subject.area || '-')}<br>
<strong>Anliegen:</strong> ${esc(subject.intent || '-')}<br>
<strong>Fachbereich:</strong> ${esc(subject.field || '-')}</p>
<p><strong>Quelle:</strong> ${esc(context.source || '-')} · <strong>Journey:</strong> ${esc(
      context.journey || '-',
    )} · <strong>Bereichskontext:</strong> ${esc(context.section || '-')} · <strong>Kampagne:</strong> ${esc(
      context.campaign || '-',
    )}</p>
<p><strong>Nachricht:</strong></p>
<p>${esc(subject.message || '-').replace(/\n/g, '<br>')}</p>`

    // Spray-Bestellungen laufen weiterhin direkt an die zustaendige Person.
    const recipient = String(subject.area || '').includes(SPRAY_ORDER_MARKER)
      ? this.sprayRecipient
      : this.recipient

    try {
      await this.send({
        to: recipient,
        from: this.sender,
        replyTo: subject.email,
        subject: `[${String(context.locale || 'de').toUpperCase()}] Neue Kontaktanfrage von ${subject.name}`,
        text: textBody,
        html: htmlBody,
      })
      return { status: 'DELIVERED' }
    } catch (error) {
      const statusCode = Number(error?.response?.statusCode ?? 0)
      const errorCode = String(error?.code || '')
      if (statusCode >= 500 || errorCode === 'ETIMEDOUT' || errorCode === 'ECONNRESET') {
        throw Object.assign(new Error('SENDGRID_TEMPORARY'), {
          code: 'SENDGRID_TEMPORARY',
          retryable: true,
        })
      }
      throw error
    }
  }
}

function createContactLeadService({ repository, worker }) {
  if (!repository || !worker) throw new TypeError('repository and worker are required')

  return {
    async submit({ body, idempotencyKey }) {
      const key = text(idempotencyKey, 200)
      if (!key) throw new ContactValidationError('IDEMPOTENCY_KEY_REQUIRED', ['idempotencyKey'])
      // Honeypot: still annehmen, nichts persistieren, nichts zustellen.
      if (body?._hp) return { ignored: true }

      const request = normalizeRequest(body)
      const consent = normalizeConsentEvidence(body)

      const lead = repository.createLead({
        journey: JOURNEY,
        idempotencyKey: key,
        subject: request.subject,
        context: {
          locale: request.locale,
          source: request.attribution.source,
          journey: request.attribution.journey,
          section: request.attribution.section,
          campaign: request.campaign,
          originRoute: request.originRoute,
        },
        consent,
        channels: ['CRM'],
      })

      // Erst jetzt darf der externe Handoff laufen. Der Lead ist committet —
      // ein Provider-Fehler verliert ihn nicht.
      await worker.processNext()

      return publicLeadState(repository.getLead(lead.id))
    },

    async processNext() {
      return worker.processNext()
    },
  }
}

let runtime
function getRuntimeContactLeadService({ mailer, env = process.env } = {}) {
  if (runtime) return runtime
  const db = openLeadDatabase()
  const repository = new LeadRepository(db)

  const adapters = {}
  if (env.SENDGRID_API_KEY && env.CONTACT_RECEIVER && env.SENDER_EMAIL) {
    adapters['general-sales'] = new SendGridTeamMailAdapter({
      send: (msg) => mailer.send(msg),
      recipient: env.CONTACT_RECEIVER,
      sender: env.SENDER_EMAIL,
    })
  }
  // Ohne konfigurierten Provider bewusst KEIN Adapter registrieren: CrmRouter
  // loest dann ehrlich NO_PROVIDER_CONFIGURED auf — kein Fake-SENT.
  const worker = new LeadHandoffWorker({
    repository,
    router: new CrmRouter({ adapters }),
    workerId: `contact-${process.pid}`,
  })
  runtime = createContactLeadService({ repository, worker })
  return runtime
}

module.exports = {
  CONSENT_VERSION,
  ContactValidationError,
  IdempotencyConflictError,
  JOURNEY,
  SendGridTeamMailAdapter,
  SPRAY_ORDER_MARKER,
  createContactLeadService,
  getRuntimeContactLeadService,
  normalizeRequest,
}
