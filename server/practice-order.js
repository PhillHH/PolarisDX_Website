const { createHash } = require('node:crypto')

const {
  CrmAdapter,
  CrmRouter,
  IdempotencyConflictError,
  LeadHandoffWorker,
  LeadRepository,
  PENDING_DELIVERY_STATUSES,
  openLeadDatabase,
} = require('./lead-foundation')

/**
 * `practice_order` — die Praxisbestellung als eigene Journey (AP22 PT22.5).
 *
 * VORHER: es gab diese Journey nicht. Eine Praxisbestellung lief durch
 * `/api/contact` und wurde dort an einem MAGIC STRING erkannt —
 * `area === 'Vitamin D3+K2 Spray BESTELLUNG'` entschied in `contact-lead.js`
 * ueber den Mailempfaenger. Der Empfaenger einer echten Bestellung hing damit
 * an einem deutschen Freitext aus dem Client. Wer die Zeichenkette
 * uebersetzte oder aenderte, schickte die Bestellung stillschweigend an den
 * allgemeinen Vertrieb; wer sie kannte, konnte sie fuer eine beliebige
 * Kontaktanfrage setzen.
 *
 * JETZT: eine getypte Journey mit eigenem CRM-Ziel (`practice-sales`),
 * serverseitiger Produkt- und Mengen-Allowlist und einer Bestellnummer.
 * Das Ziel kommt aus der Journey, nicht aus dem Formular.
 *
 * REIHENFOLGE (Persistenz vor jedem externen Handoff):
 *   validieren → Produkt/Menge allowlisten → Processing-Consent
 *   → PERSISTIEREN (Lead + Outbox) → CRM-Handoff → Status
 *
 * AP22 baut hier keinen Shop, Warenkorb, Checkout oder Zahlungsfluss: das
 * ist eine Bestellanfrage einer Praxis, kein Kaufvertrag.
 */

const JOURNEY = 'practice_order'
const CONSENT_VERSION = 'practice-order-2026-09'
const CRM_TARGET = 'practice-sales'
const SUPPORTED_LOCALES = new Set(['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'])
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Serverseitige Produkt-Allowlist. Der Client schickt eine ID, niemals einen
 * Produktnamen — und schon gar keinen Empfaenger.
 *
 * Die Mengen stammen aus der freigegebenen Auswahl der Produktseite
 * (`vitd3spray:order.quantity_options`): 12, 24, 36, 48 und die
 * Grossbestellung ab 100. Sie stehen hier, damit ein manipulierter Client
 * keine beliebige Zahl in die Bestellung schreiben kann.
 */
const PRACTICE_PRODUCTS = Object.freeze({
  'vitamin-d3-k2-spray': Object.freeze({
    label: 'Vitamin D3+K2 Spray',
    quantities: Object.freeze([12, 24, 36, 48, 100]),
  }),
})

/** Art der Einrichtung — kategorial, kein Freitext. */
const ORG_TYPES = Object.freeze(['praxis', 'klinik', 'apotheke', 'labor', 'other'])

class PracticeOrderValidationError extends Error {
  constructor(code, fields = []) {
    super(code)
    this.name = 'PracticeOrderValidationError'
    this.code = code
    this.fields = fields
  }
}

function text(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Bestellnummer, deterministisch aus dem Idempotency-Key. */
function orderReference(idempotencyKey) {
  const digest = createHash('sha256').update(`practice_order:${idempotencyKey}`).digest('hex')
  return `PRX-${digest.slice(0, 8).toUpperCase()}`
}

function resolveProduct(value) {
  const candidate = text(value, 64)
  const product = PRACTICE_PRODUCTS[candidate]
  if (!product) throw new PracticeOrderValidationError('UNKNOWN_PRODUCT', ['product'])
  return { id: candidate, ...product }
}

function resolveQuantity(product, value) {
  // `parseInt` allein waere zu nachsichtig: '24 Sprays' ergaebe 24 und
  // rutschte durch die Allowlist. Die Zeichenkette muss die Zahl SEIN.
  const raw = typeof value === 'number' ? String(value) : String(value ?? '').trim()
  const numeric = Number.parseInt(raw, 10)
  if (
    !Number.isInteger(numeric) ||
    String(numeric) !== raw ||
    !product.quantities.includes(numeric)
  ) {
    throw new PracticeOrderValidationError('INVALID_QUANTITY', ['quantity'])
  }
  return numeric
}

/**
 * Datenminimierung: genau die Felder, die eine Praxisbestellung braucht.
 * Alles Uebrige aus dem Request faellt weg — insbesondere jedes `area`,
 * `to` oder `recipient`, das frueher die Zustellung gesteuert hat.
 */
function normalizeRequest(body = {}) {
  const product = resolveProduct(body.product)
  const quantity = resolveQuantity(product, body.quantity)

  const organization = text(body.organization, 200)
  const name = text(body.name, 160)
  const email = text(body.email, 254).toLowerCase()
  const phone = text(body.phone, 64)
  const street = text(body.street, 200)
  const postcode = text(body.postcode, 32)
  const city = text(body.city, 120)
  const message = text(body.message, 4000)
  const orgTypeRaw = text(body.orgType, 64)
  const orgType = ORG_TYPES.includes(orgTypeRaw) ? orgTypeRaw : 'praxis'
  const locale = SUPPORTED_LOCALES.has(text(body.locale, 8)) ? text(body.locale, 8) : ''

  const invalid = []
  if (organization.length < 2) invalid.push('organization')
  if (name.length < 2) invalid.push('name')
  if (!EMAIL_RE.test(email)) invalid.push('email')
  if (!locale) invalid.push('locale')
  if (invalid.length) throw new PracticeOrderValidationError('VALIDATION_FAILED', invalid)

  return {
    product,
    quantity,
    orgType,
    locale,
    subject: {
      organization,
      name,
      email,
      phone,
      street,
      postcode,
      city,
      message,
      productId: product.id,
      productLabel: product.label,
      quantity,
    },
  }
}

/** Processing Pflicht, Marketing optional und getrennt. */
function normalizeConsentEvidence(body = {}) {
  if (body.processingConsent !== true && body.consent !== true) {
    throw new PracticeOrderValidationError('PROCESSING_CONSENT_REQUIRED', ['processingConsent'])
  }
  const acceptedAt = text(body.consentAcceptedAt, 64)
  if (!acceptedAt || Number.isNaN(Date.parse(acceptedAt))) {
    throw new PracticeOrderValidationError('INVALID_CONSENT_EVIDENCE', ['consentAcceptedAt'])
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
    orderReference: lead?.context?.reference,
    journey: lead?.journey,
    status: lead?.status,
    deliveryPending: PENDING_DELIVERY_STATUSES.includes(lead?.status),
    providerConfigured:
      lead?.lastErrorClass === 'NO_PROVIDER_CONFIGURED'
        ? false
        : lead?.status === 'DELIVERED'
          ? true
          : undefined,
  }
}

/**
 * Der CRM-Adapter der `practice-sales`-Route.
 *
 * Der Empfaenger ist fest verdrahtet und kommt aus der Umgebung — nicht mehr
 * aus einem Formularfeld. Genau das war der Kern des alten Magic-String-Wegs.
 */
class SendGridPracticeOrderAdapter extends CrmAdapter {
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
    const address = [subject.street, [subject.postcode, subject.city].filter(Boolean).join(' ')]
      .filter(Boolean)
      .join(', ')
    const lines = [
      'Neue Praxisbestellung ueber die Produktseite.',
      '',
      `Bestellnummer: ${context.reference}`,
      `Produkt:       ${subject.productLabel} (${subject.productId})`,
      `Menge:         ${subject.quantity}`,
      `Einrichtung:   ${context.orgType || '-'}`,
      '',
      `Praxis/Firma:  ${subject.organization}`,
      `Ansprechpartner: ${subject.name}`,
      `E-Mail:        ${subject.email}`,
      `Telefon:       ${subject.phone || '-'}`,
      `Adresse:       ${address || '-'}`,
      '',
      'Nachricht:',
      subject.message || '-',
      '',
      'Hinweis: Bestellanfrage, kein Kaufvertrag. Die Kundin hat der',
      'Verarbeitung zur Bearbeitung dieser Anfrage zugestimmt',
      '(DSGVO Art. 6 Abs. 1 lit. b).',
    ]

    try {
      await this.send({
        to: this.recipient,
        from: this.sender,
        replyTo: subject.email,
        subject: `[${String(context.locale || 'de').toUpperCase()}] Praxisbestellung ${context.reference} — ${subject.productLabel}`,
        text: lines.join('\n'),
        html: `<h3>Neue Praxisbestellung</h3>
<p><strong>Bestellnummer:</strong> ${esc(context.reference)}<br>
<strong>Produkt:</strong> ${esc(subject.productLabel)} (${esc(subject.productId)})<br>
<strong>Menge:</strong> ${esc(subject.quantity)}<br>
<strong>Einrichtung:</strong> ${esc(context.orgType || '-')}</p>
<p><strong>Praxis/Firma:</strong> ${esc(subject.organization)}<br>
<strong>Ansprechpartner:</strong> ${esc(subject.name)}<br>
<strong>E-Mail:</strong> ${esc(subject.email)}<br>
<strong>Telefon:</strong> ${esc(subject.phone || '-')}<br>
<strong>Adresse:</strong> ${esc(address || '-')}</p>
<p><strong>Nachricht:</strong></p>
<p>${esc(subject.message || '-').replace(/\n/g, '<br>')}</p>
<p style="color:#64748b;font-size:12px;">Bestellanfrage, kein Kaufvertrag. Einwilligung zur Verarbeitung liegt vor (DSGVO Art. 6 Abs. 1 lit. b).</p>`,
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

function createPracticeOrderService({ repository, worker }) {
  if (!repository || !worker) throw new TypeError('repository and worker are required')

  return {
    async submit({ body, idempotencyKey }) {
      const key = text(idempotencyKey, 200)
      if (!key) {
        throw new PracticeOrderValidationError('IDEMPOTENCY_KEY_REQUIRED', ['idempotencyKey'])
      }
      if (body?._hp) return { ignored: true }

      const request = normalizeRequest(body)
      const consent = normalizeConsentEvidence(body)

      const lead = repository.createLead({
        journey: JOURNEY,
        idempotencyKey: key,
        subject: request.subject,
        context: {
          locale: request.locale,
          source: 'product_page',
          originRoute: `/${request.locale}/vitamin-d3-spray`,
          reference: orderReference(key),
          productId: request.product.id,
          quantity: request.quantity,
          orgType: request.orgType,
        },
        consent,
        channels: ['CRM'],
      })

      await worker.processNext()
      return publicLeadState(repository.getLead(lead.id))
    },

    async processNext() {
      return worker.processNext()
    },
  }
}

let runtime
function getRuntimePracticeOrderService({ mailer, env = process.env } = {}) {
  if (runtime) return runtime
  const db = openLeadDatabase()
  const repository = new LeadRepository(db)

  const adapters = {}
  // Der Praxisbestell-Empfaenger ist eine eigene Variable. Faellt sie weg,
  // gibt es keinen Adapter — und damit ehrlich NO_PROVIDER_CONFIGURED statt
  // einer stillen Umleitung an den allgemeinen Vertrieb.
  const recipient = env.PRACTICE_ORDER_RECEIVER || env.CONTACT_RECEIVER
  if (env.SENDGRID_API_KEY && recipient && env.SENDER_EMAIL) {
    adapters[CRM_TARGET] = new SendGridPracticeOrderAdapter({
      send: (msg) => mailer.send(msg),
      recipient,
      sender: env.SENDER_EMAIL,
    })
  }
  const worker = new LeadHandoffWorker({
    repository,
    router: new CrmRouter({ adapters }),
    workerId: `practice-order-${process.pid}`,
    journeys: [JOURNEY],
  })
  runtime = createPracticeOrderService({ repository, worker })
  return runtime
}

module.exports = {
  CONSENT_VERSION,
  CRM_TARGET,
  IdempotencyConflictError,
  JOURNEY,
  ORG_TYPES,
  PRACTICE_PRODUCTS,
  PracticeOrderValidationError,
  SendGridPracticeOrderAdapter,
  createPracticeOrderService,
  getRuntimePracticeOrderService,
  normalizeRequest,
  orderReference,
}
