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
const { formatMailCurrency, getMailCopy, resolveMailLocale } = require('./system-i18n')

/**
 * `roi_report` — die Report-Anfrage als eigene Journey (AP22 PT22.5).
 *
 * VORHER: `/api/roi-report` war ein reiner Mailendpunkt. Im ganzen Handler
 * stand kein einziger `createLead`-Aufruf; das PDF wurde IM Request erzeugt
 * und synchron verschickt. Ein SendGrid-Fehler beantwortete die Anfrage mit
 * 500 und verlor sie ersatzlos — dieselbe Klasse Fehler, die AP21 fuer die
 * Consumer-Bestellung behoben hat.
 *
 * JETZT: validieren → Consent → PERSISTIEREN → Outbox → Zustellung. Die
 * PDF-Erzeugung ist ein Side Effect DES ZUSTELLVERSUCHS, nicht des Requests:
 * scheitert sie, wird der Versuch wiederholt, ohne dass die Anfrage weg ist.
 *
 * Die Rechenwerte sind Teil der Anfrage und werden mitgespeichert — sie sind
 * die Grundlage des Reports und ohne sie waere ein Wiederholungsversuch
 * wertlos. Sie sind Zahlen, keine Personendaten.
 */

const JOURNEY = 'roi_report'
const CONSENT_VERSION = 'roi-report-2026-09'
const CRM_TARGET = 'reports'
const SUPPORTED_LOCALES = new Set(['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'])
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Fachbereiche der Beispielrechnung — allowlistet, kein Freitext. */
const REPORT_AREAS = Object.freeze([
  'dental',
  'implantology',
  'beauty',
  'longevity',
  'nutrition',
  'sports',
  'bgm',
  'practice',
  'pharmacy',
  'other',
])

/** Die Kennzahlen, die der Report ausweist. Alles andere wird verworfen. */
const OUTPUT_FIELDS = Object.freeze([
  'dbPerMonth',
  'revenuePerMonth',
  'dbPerYear',
  'dbPerTest',
  'paybackMonths',
])
const INPUT_FIELDS = Object.freeze([
  'testsPerMonth',
  'pricePerTest',
  'materialPerTest',
  'minutesPerTest',
  'staffCostPerHour',
  'investment',
])

class RoiReportValidationError extends Error {
  constructor(code, fields = []) {
    super(code)
    this.name = 'RoiReportValidationError'
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

function reportReference(idempotencyKey) {
  const digest = createHash('sha256').update(`roi_report:${idempotencyKey}`).digest('hex')
  return `ROI-${digest.slice(0, 8).toUpperCase()}`
}

/** Nur endliche Zahlen in vernuenftigen Grenzen; alles andere faellt weg. */
function numbers(source, allowed) {
  const result = {}
  for (const field of allowed) {
    const value = source?.[field]
    const numeric = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''))
    if (Number.isFinite(numeric) && Math.abs(numeric) < 1e9) {
      result[field] = Math.round(numeric * 100) / 100
    }
  }
  return result
}

function normalizeRequest(body = {}) {
  const name = text(body.name, 160) || text(body.practice, 200)
  const email = text(body.email, 254).toLowerCase()
  const practice = text(body.practice, 200)
  const areaRaw = text(body.area, 64)
  const area = REPORT_AREAS.includes(areaRaw) ? areaRaw : ''
  const locale = SUPPORTED_LOCALES.has(text(body.locale, 8)) ? text(body.locale, 8) : ''

  const invalid = []
  if (!EMAIL_RE.test(email)) invalid.push('email')
  if (!locale) invalid.push('locale')
  if (body.area && !area) invalid.push('area')
  if (invalid.length) throw new RoiReportValidationError('VALIDATION_FAILED', invalid)

  return {
    locale,
    area,
    subject: {
      name,
      email,
      practice,
      area,
      inputs: numbers(body.inputs, INPUT_FIELDS),
      outputs: numbers(body.outputs, OUTPUT_FIELDS),
    },
  }
}

function normalizeConsentEvidence(body = {}) {
  if (body.processingConsent !== true && body.consent !== true) {
    throw new RoiReportValidationError('PROCESSING_CONSENT_REQUIRED', ['processingConsent'])
  }
  const acceptedAt = text(body.consentAcceptedAt, 64)
  if (!acceptedAt || Number.isNaN(Date.parse(acceptedAt))) {
    throw new RoiReportValidationError('INVALID_CONSENT_EVIDENCE', ['consentAcceptedAt'])
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
    reportReference: lead?.context?.reference,
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
 * Der CRM-Adapter der `reports`-Route.
 *
 * Die PDF-Erzeugung liegt HIER, im Zustellversuch — nicht im Request. Faellt
 * sie aus, gilt der Versuch als fehlgeschlagen und wird wiederholt; die
 * Anfrage selbst ist laengst gespeichert. `buildPdf` wird eingespeist, damit
 * die Journey nicht von der PDF-Bibliothek abhaengt und ein Test den Ausfall
 * nachstellen kann.
 */
class SendGridRoiReportAdapter extends CrmAdapter {
  constructor({ send, buildPdf, recipient, sender }) {
    super()
    if (typeof send !== 'function') throw new TypeError('send is required')
    if (!sender) throw new TypeError('sender is required')
    this.send = send
    this.buildPdf = typeof buildPdf === 'function' ? buildPdf : null
    this.recipient = recipient || null
    this.sender = sender
  }

  async deliver({ lead }) {
    const subject = lead.subject || {}
    const context = lead.context || {}
    const mailLocale = resolveMailLocale(context.locale, 'roi-report').locale
    const copy = getMailCopy(mailLocale).roi
    const money = (value) => formatMailCurrency(value, mailLocale)

    let attachments
    if (this.buildPdf) {
      // Ein Fehler hier ist ein Zustellfehler, kein verlorener Vorgang.
      const pdf = await this.buildPdf({
        practice: subject.practice,
        area: subject.area,
        inputs: subject.inputs,
        outputs: subject.outputs,
        locale: mailLocale,
      })
      attachments = [
        {
          content: Buffer.from(pdf).toString('base64'),
          filename: `polarisdx-roi-${context.reference || 'report'}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ]
    }

    const rows = [
      [copy.month, money(subject.outputs?.dbPerMonth)],
      [copy.revenue, money(subject.outputs?.revenuePerMonth)],
      [copy.year, money(subject.outputs?.dbPerYear)],
      [copy.perTest, money(subject.outputs?.dbPerTest)],
    ]

    const reportMail = {
      to: subject.email,
      from: this.sender,
      subject: `${copy.subject} — ${context.reference}`,
      text: [
        attachments ? copy.introAttachment : copy.introNoAttachment,
        '',
        `${copy.results}:`,
        ...rows.map(([label, value]) => `${label}: ${value}`),
        '',
        copy.disclaimer,
        '',
        'PolarisDX',
      ].join('\n'),
      html: `<div lang="${mailLocale}" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
<h2 style="color:#083358;">${esc(copy.title)}</h2>
<p>${esc(attachments ? copy.introAttachment : copy.introNoAttachment)}</p>
<h3 style="color:#083358;">${esc(copy.results)}</h3>
<table style="border-collapse:collapse;width:100%;max-width:520px;">
${rows
  .map(
    ([label, value]) =>
      `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:bold;">${esc(label)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(value)}</td></tr>`,
  )
  .join('')}
</table>
<p style="color:#64748b;font-size:12px;margin-top:18px;">${esc(copy.disclaimer)}</p>
</div>`,
      ...(attachments ? { attachments } : {}),
    }

    const messages = [reportMail]
    if (this.recipient) {
      messages.push({
        to: this.recipient,
        from: this.sender,
        replyTo: subject.email,
        subject: `[${mailLocale.toUpperCase()}] ROI-Report angefordert ${context.reference}`,
        text: [
          'Neue ROI-Report-Anfrage.',
          '',
          `Vorgangsnummer: ${context.reference}`,
          `Praxis:  ${subject.practice || '-'}`,
          `Bereich: ${subject.area || '-'}`,
          `E-Mail:  ${subject.email}`,
        ].join('\n'),
      })
    }

    try {
      await sendEach(this.send, messages)
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

function createRoiReportService({ repository, worker }) {
  if (!repository || !worker) throw new TypeError('repository and worker are required')

  return {
    async submit({ body, idempotencyKey }) {
      const key = text(idempotencyKey, 200)
      if (!key) throw new RoiReportValidationError('IDEMPOTENCY_KEY_REQUIRED', ['idempotencyKey'])
      if (body?._hp) return { ignored: true }

      const request = normalizeRequest(body)
      const consent = normalizeConsentEvidence(body)

      const lead = repository.createLead({
        journey: JOURNEY,
        idempotencyKey: key,
        subject: request.subject,
        context: {
          locale: request.locale,
          source: 'roi_calculator',
          originRoute: `/${request.locale}/igloo-pro`,
          reference: reportReference(key),
          reportArea: request.area,
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
function getRuntimeRoiReportService({ mailer, buildPdf, env = process.env } = {}) {
  if (runtime) return runtime
  const db = openLeadDatabase()
  const repository = new LeadRepository(db)

  const adapters = {}
  if (env.SENDGRID_API_KEY && env.SENDER_EMAIL) {
    adapters[CRM_TARGET] = new SendGridRoiReportAdapter({
      send: (msg) => mailer.send(msg),
      buildPdf,
      recipient: env.ROI_REPORT_RECEIVER || env.CONTACT_RECEIVER || null,
      sender: env.SENDER_EMAIL,
    })
  }
  const worker = new LeadHandoffWorker({
    repository,
    router: new CrmRouter({ adapters }),
    workerId: `roi-report-${process.pid}`,
    journeys: [JOURNEY],
  })
  runtime = createRoiReportService({ repository, worker })
  return runtime
}

module.exports = {
  CONSENT_VERSION,
  CRM_TARGET,
  IdempotencyConflictError,
  INPUT_FIELDS,
  JOURNEY,
  OUTPUT_FIELDS,
  REPORT_AREAS,
  RoiReportValidationError,
  SendGridRoiReportAdapter,
  createRoiReportService,
  getRuntimeRoiReportService,
  normalizeRequest,
  reportReference,
}
