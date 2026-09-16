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
const { sendEach } = require('./lead-foundation/crm-delivery')
const { getMailCopy, resolveMailLocale } = require('./system-i18n')

/**
 * `consumer_order` — die Consumer-Bestellanfrage als eigene Lead-Journey.
 *
 * REIHENFOLGE (Persistenz vor jedem externen Handoff):
 *
 *   validieren → Produkt/Variante/Menge allowlisten → Processing-Consent
 *   → PERSISTIEREN (Lead + Outbox) → CRM-Handoff (CrmRouter) → Status
 *
 * - AP21 PT21.5 loest den bisherigen Legacy-Mailendpunkt ab. Vorher gab es
 *   weder Persistenz noch Idempotency, Retry oder Rate Limit: ein
 *   SendGrid-Fehler hat die Bestellung ersatzlos verloren.
 * - Diese Datei ist EIN Journey-Slice auf der geteilten lead-foundation,
 *   keine zweite Lead-Plattform (AP22-Grenze) und keine Mail-only-Persistenz.
 * - Kein Multiplexing: Consumer Ordering ist eine eigene Journey neben
 *   `contact` und `support`, kein Sonderfall eines Kontaktformulars.
 * - Consent: Processing ist Pflicht, Marketing optional und strikt getrennt.
 *   Eine Analytics-Einwilligung ist an KEINER Stelle Voraussetzung.
 * - Wahrheit im Status: das hier ist eine BESTELLANFRAGE. Kein Kaufvertrag,
 *   keine Zahlung, keine Verfuegbarkeits- oder Lieferzusage. Ohne
 *   konfigurierten Provider meldet der Status ehrlich NO_PROVIDER_CONFIGURED.
 * - AP21 baut hier bewusst keinen Shop, Cart, Checkout, Payment, kein
 *   Subscription Billing, keine Voucher- oder Deal-Logik.
 */

const JOURNEY = 'consumer_order'
const CONSENT_VERSION = 'consumer-order-2026-09'
const CRM_TARGET = 'consumer'
const SUPPORTED_LOCALES = new Set(['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'])
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * SERVERSEITIGE PRODUKT-ALLOWLIST — die einzige Quelle der Wahrheit fuer
 * Bestellfakten. Der Client schickt IDs, niemals Produktnamen, Preise oder
 * Mengenlabels: was hier nicht steht, wird abgelehnt.
 *
 * Kanonisch ist der Route-Slug (`vitamin-d3-spray`), weil er die
 * oeffentliche, in AP21 festgeschriebene Produktidentitaet ist. Die kurze
 * Bestell-ID (`spray`) bleibt als stabiler Alias erlaubt — sie ist der
 * Wert, den `src/content/consumer/products.ts` als `orderId` fuehrt und den
 * die drei bewiesenen Produkt-Suiten messen. Beides sind gebundene IDs;
 * intern wird immer auf den kanonischen Slug normalisiert.
 *
 * `variants` sind die real existierenden Gebinde aus dem Produktmodell.
 * Ein Bundle-Set ist NICHT der 12er-Pack — die Bundle-Wahrheit aus PT21.4
 * bleibt gewahrt.
 */
const PRODUCT_ALLOWLIST = Object.freeze({
  'vitamin-d3-spray': Object.freeze({
    orderId: 'spray',
    label: 'Vitamin D3+K2 Spray (12-Pack)',
    variants: Object.freeze(['pack-12']),
  }),
  'hydrating-masks': Object.freeze({
    orderId: 'masks',
    label: 'Hydrating Masks (5-Pack)',
    variants: Object.freeze(['box-5']),
  }),
  'inside-out-duo': Object.freeze({
    orderId: 'duo',
    label: 'Inside-Out Care Duo (1 spray + 5 masks)',
    variants: Object.freeze(['set']),
  }),
})

const PRODUCT_ALIASES = Object.freeze(
  Object.fromEntries(
    Object.entries(PRODUCT_ALLOWLIST).map(([slug, product]) => [product.orderId, slug]),
  ),
)

/** Mengen-Allowlist: ganze Zahl in festen Grenzen, sonst der Beratungsfall. */
const QUANTITY_MIN = 1
const QUANTITY_MAX = 3
/** Der Client kann statt einer Zahl "mehr — bitte beraten" waehlen. */
const QUANTITY_ADVISORY = 'MORE'

const CONSUMER_ORDER_RECIPIENTS = Object.freeze([
  'ulrikes@polarisdx.net',
  'inesr@polarisdx.net',
  'adrianoz@polarisdx.net',
  'contact@polarisdx.net',
])

class ConsumerOrderValidationError extends Error {
  constructor(code, fields = []) {
    super(code)
    this.name = 'ConsumerOrderValidationError'
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

/**
 * Die fachliche Vorgangsnummer. Deterministisch aus dem Idempotency-Key:
 * ein Replay (Double-Click, Browser-Retry, API-Replay) nennt dieselbe
 * Nummer, ohne dass dafuer ein Zaehler oder ein zweiter Schreibvorgang
 * noetig waere.
 */
function orderReference(idempotencyKey) {
  const digest = createHash('sha256').update(`consumer_order:${idempotencyKey}`).digest('hex')
  return `PDX-${digest.slice(0, 8).toUpperCase()}`
}

/** Produkt-ID → kanonischer Slug. Unbekanntes Produkt wird abgelehnt. */
function resolveProduct(value) {
  const candidate = text(value, 64)
  const slug = PRODUCT_ALLOWLIST[candidate] ? candidate : PRODUCT_ALIASES[candidate]
  if (!slug) throw new ConsumerOrderValidationError('UNKNOWN_PRODUCT', ['product'])
  return { slug, ...PRODUCT_ALLOWLIST[slug] }
}

/**
 * Variante: leer bedeutet "die einzige Variante dieses Produkts". Ein
 * gesetzter, aber nicht allowlisteter Wert wird abgelehnt statt still
 * auf die Standardvariante zu fallen.
 */
function resolveVariant(product, value) {
  const candidate = text(value, 64)
  if (!candidate) return product.variants[0]
  if (!product.variants.includes(candidate)) {
    throw new ConsumerOrderValidationError('UNKNOWN_VARIANT', ['variant'])
  }
  return candidate
}

/**
 * Menge: entweder eine ganze Zahl in den Allowlist-Grenzen oder der
 * explizite Beratungsfall. Strings wie "1 pack (12 bottles)", 0, 1.5, 99
 * oder Injection-Versuche werden abgelehnt — die Menge wird nie mehr
 * ungeprueft aus dem Client uebernommen.
 */
function resolveQuantity(value) {
  if (value === QUANTITY_ADVISORY) return { quantity: 0, mode: 'ADVISE' }
  const numeric = typeof value === 'number' ? value : Number.parseInt(String(value ?? ''), 10)
  if (
    !Number.isInteger(numeric) ||
    String(value).trim() !== String(numeric) ||
    numeric < QUANTITY_MIN ||
    numeric > QUANTITY_MAX
  ) {
    throw new ConsumerOrderValidationError('INVALID_QUANTITY', ['quantity'])
  }
  return { quantity: numeric, mode: 'EXACT' }
}

/**
 * Datenminimierung: exakt die Felder, die die Bestellanfrage braucht.
 * Alles andere aus dem Request faellt weg — nichts Unbekanntes wandert in
 * den Lead oder in eine Mail.
 */
function normalizeRequest(body = {}) {
  const product = resolveProduct(body.product)
  const variant = resolveVariant(product, body.variant)
  const { quantity, mode } = resolveQuantity(body.quantity)

  const name = text(body.name, 160)
  const email = text(body.email, 254).toLowerCase()
  const phone = text(body.phone, 64)
  const company = text(body.company, 200)
  const street = text(body.street, 200)
  const postcode = text(body.postcode, 32)
  const city = text(body.city, 120)
  const country = text(body.country, 120)
  const message = text(body.message, 4000)
  const locale = SUPPORTED_LOCALES.has(text(body.locale, 8)) ? text(body.locale, 8) : ''

  const invalid = []
  if (name.length < 2) invalid.push('name')
  if (!EMAIL_RE.test(email)) invalid.push('email')
  if (!locale) invalid.push('locale')
  if (invalid.length) throw new ConsumerOrderValidationError('VALIDATION_FAILED', invalid)

  return {
    product,
    variant,
    quantity,
    quantityMode: mode,
    locale,
    subject: {
      name,
      email,
      phone,
      company,
      street,
      postcode,
      city,
      country,
      message,
      productId: product.slug,
      productLabel: product.label,
      variant,
      quantity,
      quantityMode: mode,
    },
  }
}

/**
 * Consent GETRENNT: ohne Verarbeitungs-Einwilligung laeuft gar nichts;
 * Marketing ist davon unabhaengig und optional. Eine Analytics-/
 * Cookie-Einwilligung wird hier bewusst NICHT abgefragt — sie ist keine
 * Voraussetzung fuer eine Bestellanfrage.
 */
function normalizeConsentEvidence(body = {}) {
  if (body.processingConsent !== true && body.consent !== true) {
    throw new ConsumerOrderValidationError('PROCESSING_CONSENT_REQUIRED', ['processingConsent'])
  }
  const acceptedAt = text(body.consentAcceptedAt, 64)
  if (!acceptedAt || Number.isNaN(Date.parse(acceptedAt))) {
    throw new ConsumerOrderValidationError('INVALID_CONSENT_EVIDENCE', ['consentAcceptedAt'])
  }
  return {
    processingAccepted: true,
    acceptedAt,
    version: CONSENT_VERSION,
    marketing: body.marketingConsent === true ? 'GRANTED' : 'DENIED',
  }
}

/**
 * Was der Client erfahren darf. Bewusst OHNE Kaufbestaetigung: `accepted`
 * heisst "Bestellanfrage dauerhaft gespeichert", nicht "gekauft".
 */
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
 * CRM-Adapter der `consumer`-Route: Team-Mail an die fest verdrahteten
 * internen Empfaenger plus lokalisierte Eingangsbestaetigung an die
 * Bestellerin. Empfaenger kommen NIE aus dem Request — das Formular ist
 * kein Relay. 5xx/Timeouts sind retryfaehig, alles andere terminal.
 */
class SendGridConsumerOrderAdapter extends CrmAdapter {
  constructor({ send, recipients = CONSUMER_ORDER_RECIPIENTS, sender }) {
    super()
    if (typeof send !== 'function') throw new TypeError('send is required')
    if (!sender) throw new TypeError('sender is required')
    this.send = send
    this.recipients = [...recipients]
    this.sender = sender
  }

  async deliver({ lead }) {
    const subject = lead.subject || {}
    const context = lead.context || {}
    const mailLocale = resolveMailLocale(context.locale, 'consumer-order').locale
    const copy = getMailCopy(mailLocale).consumerOrder

    const quantityText =
      subject.quantityMode === 'ADVISE' ? copy.quantityAdvice : String(subject.quantity)
    const addressLine = [
      subject.street,
      [subject.postcode, subject.city].filter(Boolean).join(' '),
      subject.country,
    ]
      .filter(Boolean)
      .join(', ')

    const teamMail = {
      to: this.recipients,
      from: this.sender,
      replyTo: subject.email,
      subject: `[${mailLocale.toUpperCase()}] Bestellanfrage ${context.reference} — ${subject.productLabel}`,
      text: [
        'Neue Bestellanfrage ueber eine Consumer-Landingpage.',
        '',
        `Vorgangsnummer: ${context.reference}`,
        `Produkt:        ${subject.productLabel} (${subject.productId})`,
        `Variante:       ${subject.variant}`,
        `Menge:          ${quantityText}`,
        '',
        `Name:    ${subject.name}`,
        `E-Mail:  ${subject.email}`,
        `Telefon: ${subject.phone || '-'}`,
        `Firma:   ${subject.company || '-'}`,
        `Adresse: ${addressLine || '-'}`,
        '',
        'Nachricht:',
        subject.message || '-',
        '',
        'Hinweis: Bestellanfrage, kein Kaufvertrag. Preis, Verfuegbarkeit und',
        'Lieferung werden separat bestaetigt. Die Kundin hat der Verarbeitung',
        'zur Bearbeitung dieser Anfrage ausdruecklich zugestimmt',
        '(DSGVO Art. 6 Abs. 1 lit. b).',
      ].join('\n'),
      html: `<h3>Neue Bestellanfrage</h3>
<p><strong>Vorgangsnummer:</strong> ${esc(context.reference)}<br>
<strong>Produkt:</strong> ${esc(subject.productLabel)} (${esc(subject.productId)})<br>
<strong>Variante:</strong> ${esc(subject.variant)}<br>
<strong>Menge:</strong> ${esc(quantityText)}</p>
<p><strong>Name:</strong> ${esc(subject.name)}<br>
<strong>E-Mail:</strong> ${esc(subject.email)}<br>
<strong>Telefon:</strong> ${esc(subject.phone || '-')}<br>
<strong>Firma:</strong> ${esc(subject.company || '-')}<br>
<strong>Adresse:</strong> ${esc(addressLine || '-')}</p>
<p><strong>Nachricht:</strong></p>
<p>${esc(subject.message || '-').replace(/\n/g, '<br>')}</p>
<p style="color:#64748b;font-size:12px;">Bestellanfrage, kein Kaufvertrag. Preis, Verfuegbarkeit und Lieferung werden separat bestaetigt. Einwilligung zur Verarbeitung liegt vor (DSGVO Art. 6 Abs. 1 lit. b).</p>`,
    }

    const confirmationMail = {
      to: subject.email,
      from: this.sender,
      subject: `${copy.subject} — ${context.reference}`,
      text: [
        `${copy.greeting} ${subject.name},`,
        '',
        copy.received,
        '',
        `${copy.details}:`,
        `- ${copy.reference}: ${context.reference}`,
        `- ${copy.product}: ${subject.productLabel}`,
        `- ${copy.variant}: ${subject.variant}`,
        `- ${copy.quantity}: ${quantityText}`,
        '',
        copy.notPurchase,
        '',
        `${copy.regards},`,
        copy.team,
      ].join('\n'),
      html: `<div lang="${mailLocale}" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
<h2 style="color:#083358;">${esc(copy.title)}</h2>
<p>${esc(copy.greeting)} ${esc(subject.name)},</p>
<p>${esc(copy.received)}</p>
<h3 style="color:#083358;margin-top:24px;">${esc(copy.details)}</h3>
<table style="border-collapse:collapse;width:100%;max-width:500px;">
<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:bold;">${esc(copy.reference)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(context.reference)}</td></tr>
<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:bold;">${esc(copy.product)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(subject.productLabel)}</td></tr>
<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:bold;">${esc(copy.variant)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(subject.variant)}</td></tr>
<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:bold;">${esc(copy.quantity)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(quantityText)}</td></tr>
</table>
<p style="color:#475569;font-size:13px;margin-top:20px;">${esc(copy.notPurchase)}</p>
<p style="margin-top:24px;">${esc(copy.regards)},<br><strong>${esc(copy.team)}</strong></p>
</div>`,
    }

    try {
      await sendEach(this.send, [teamMail, confirmationMail])
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

function createConsumerOrderService({ repository, worker }) {
  if (!repository || !worker) throw new TypeError('repository and worker are required')

  return {
    async submit({ body, idempotencyKey }) {
      const key = text(idempotencyKey, 200)
      if (!key) {
        throw new ConsumerOrderValidationError('IDEMPOTENCY_KEY_REQUIRED', ['idempotencyKey'])
      }
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
          source: 'consumer_landing',
          originRoute: `/${request.locale}/consumer/${request.product.slug}`,
          reference: orderReference(key),
          productId: request.product.slug,
          variant: request.variant,
          quantity: request.quantity,
        },
        consent,
        channels: ['CRM'],
      })

      // Erst jetzt darf der externe Handoff laufen. Die Bestellanfrage ist
      // committet — ein Provider-Fehler verliert sie nicht mehr.
      await worker.processNext()

      return publicLeadState(repository.getLead(lead.id))
    },

    async processNext() {
      return worker.processNext()
    },
  }
}

let runtime
function getRuntimeConsumerOrderService({ mailer, env = process.env } = {}) {
  if (runtime) return runtime
  const db = openLeadDatabase()
  const repository = new LeadRepository(db)

  const adapters = {}
  if (env.SENDGRID_API_KEY && env.SENDER_EMAIL) {
    adapters[CRM_TARGET] = new SendGridConsumerOrderAdapter({
      send: (msg) => mailer.send(msg),
      sender: env.SENDER_EMAIL,
    })
  }
  // Ohne konfigurierten Provider bewusst KEIN Adapter: der CrmRouter loest
  // dann ehrlich NO_PROVIDER_CONFIGURED auf — kein Fake-SENT.
  const worker = new LeadHandoffWorker({
    repository,
    router: new CrmRouter({ adapters }),
    workerId: `consumer-order-${process.pid}`,
    // Nur die eigene Journey: sonst uebernimmt dieser Worker fremde
    // Auftraege, fuer die sein Router keinen Adapter hat.
    journeys: [JOURNEY],
  })
  runtime = createConsumerOrderService({ repository, worker })
  return runtime
}

module.exports = {
  CONSENT_VERSION,
  CONSUMER_ORDER_RECIPIENTS,
  ConsumerOrderValidationError,
  CRM_TARGET,
  IdempotencyConflictError,
  JOURNEY,
  PRODUCT_ALIASES,
  PRODUCT_ALLOWLIST,
  QUANTITY_ADVISORY,
  QUANTITY_MAX,
  QUANTITY_MIN,
  SendGridConsumerOrderAdapter,
  createConsumerOrderService,
  getRuntimeConsumerOrderService,
  normalizeConsentEvidence,
  normalizeRequest,
  orderReference,
}
