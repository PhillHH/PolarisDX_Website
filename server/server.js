const express = require('express')
const sgMail = require('@sendgrid/mail')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const PDFDocument = require('pdfkit')
const { resolveMailLocale, getMailCopy, formatMailCurrency } = require('./system-i18n')
const {
  IdempotencyConflictError,
  InquiryValidationError,
  getRuntimeEpigeneticsInquiryService,
} = require('./epigenetics-inquiry')
const {
  ContentDownloadValidationError,
  EntitlementError,
  getRuntimeContentDownloadService,
} = require('./content-download')
const { ContactValidationError, getRuntimeContactLeadService } = require('./contact-lead')
const { ConsumerOrderValidationError, getRuntimeConsumerOrderService } = require('./consumer-order')
const {
  getRuntimeSupportCaseService,
  IdempotencyConflictError: SupportIdempotencyConflictError,
  MAX_TOTAL_BYTES: SUPPORT_MAX_TOTAL_BYTES,
  SupportValidationError,
} = require('./support-case')
const { AssetResolutionError } = require('./protected-assets')
const {
  LeadDispatcher,
  LeadRepository,
  createLoggerAlertSink,
  createRequestId,
  describeRuntimeIsolation,
  dispatchAlerts,
  errorEnvelope,
  evaluateAlerts,
  logSafeError,
  openLeadDatabase,
  resolveDeliveryMode,
  resolveRetentionPolicy,
  retentionDaysFromPolicy,
  runRetention,
  successEnvelope,
} = require('./lead-foundation')
const { PracticeOrderValidationError, getRuntimePracticeOrderService } = require('./practice-order')
const { RoiReportValidationError, getRuntimeRoiReportService } = require('./roi-report')
require('dotenv').config()

const app = express()

const ERROR_CODES = Object.freeze({
  consentRequired: 'CONSENT_REQUIRED',
  requiredFields: 'REQUIRED_FIELDS',
  invalidEmail: 'INVALID_EMAIL',
  invalidAttachment: 'INVALID_ATTACHMENT',
  unknownProduct: 'UNKNOWN_PRODUCT',
  deliveryFailed: 'DELIVERY_FAILED',
  rateLimited: 'RATE_LIMITED',
})

const sendError = (res, status, code) => res.status(status).json({ success: false, code })

/**
 * Fehlschlaege beim geschuetzten Abruf protokollieren — ausschliesslich
 * Fehlerklasse und Asset-ID. Token, Entitlement-ID, Query-String und URL
 * werden NIE geschrieben; ein Log-Leak waere ein funktionierender Link.
 */
function logDownloadFailure(code, assetId) {
  console.warn('[content_download] delivery refused', {
    errorClass: String(code).slice(0, 64),
    assetId: typeof assetId === 'string' ? assetId.slice(0, 64) : '',
  })
}

function requestMailLocale(value, flow) {
  const resolved = resolveMailLocale(value)
  if (resolved.didFallback) {
    console.warn(`[${flow}] unsupported locale "${resolved.requested || '(missing)'}"; using en`)
  }
  return resolved.locale
}

const HOMEPAGE_SALES_SECTIONS = new Set(['hero', 'roi', 'final_cta'])

function resolveLeadAttribution({ source, journey, section } = {}) {
  if (
    source === 'homepage' &&
    journey === 'general_sales' &&
    HOMEPAGE_SALES_SECTIONS.has(section)
  ) {
    return { source, journey, section }
  }
  if (source === 'homepage' && journey === 'roi_report' && section === 'roi') {
    return { source, journey, section }
  }
  if (source === 'epigenetics') {
    return { source, journey: '', section: '' }
  }
  return { source: '', journey: '', section: '' }
}

// Behind exactly one proxy hop (nginx/SSR) so req.ip reflects the real client.
// IMPORTANT: this is what makes the per-IP rate limiter (formLimiter) trustworthy.
// If this service is ever deployed with NO proxy in front, drop this line —
// otherwise a spoofed X-Forwarded-For header would set req.ip and bypass the limiter.
app.set('trust proxy', 1)

// AP26 PT26.1 — API-Baseline. Gemessen vor PT26.1: jede API-Antwort trug
// `X-Powered-By: Express` (auch live auf Preview und Produktion). Antworten
// tragen Lead-Referenzen, Entitlements und Download-Links; sie gehoeren in
// keinen Browser- oder Proxy-Cache. Einzelne Routen setzen strenger
// (geschuetzte Auslieferung: `no-store, private`).
app.disable('x-powered-by')
app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  next()
})

// AP26 PT26.3 — Origin-Modell. Der Browser ruft die API ausschliesslich
// same-origin ueber den SSR-Proxy (`/api`, auch im Vite-Dev-Server). Eine
// CORS-Freigabe braucht diese Architektur nicht; vorher stand sie ohne
// Konfiguration auf `http://localhost:3000` (live: `localhost:2026`, SEC-12).
// Sie entsteht jetzt nur fuer ausdruecklich konfigurierte Origins — nie `*`,
// nie mit Credentials.
const CORS_ORIGINS = String(process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
if (CORS_ORIGINS.length > 0) {
  app.use(
    cors({
      origin: CORS_ORIGINS,
      methods: ['POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Idempotency-Key'],
    }),
  )
}

// AP26 PT26.3 — CSRF-Modell. Keine Cookies, keine Sitzung, keine Anmeldung:
// ein Formular-POST traegt keine fremde Berechtigung. Die Grenze ist deshalb
// strukturell statt eines Tokens: JSON-Pflicht und `Idempotency-Key` erzwingen
// im Browser einen CORS-Preflight, den keine fremde Origin besteht. Browser mit
// Fetch Metadata melden die Herkunft zusaetzlich — ein schreibender Aufruf von
// einer fremden Seite wird dann gar nicht erst verarbeitet.
const WRITE_ALLOWED_FETCH_SITES = new Set(['same-origin', 'none'])
app.use((req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next()
  const site = req.get('Sec-Fetch-Site')
  if (!site || WRITE_ALLOWED_FETCH_SITES.has(site)) return next()
  if (CORS_ORIGINS.includes(req.get('Origin'))) return next()
  return res.status(403).json({ accepted: false, code: 'CROSS_SITE_REQUEST' })
})

/**
 * AP26 PT26.3 — Body erst NACH dem Rate Limit und nur mit Grenze je Route.
 *
 * Vorher parste `express.json({ limit: '10mb' })` global vor jeder Route: auch
 * ein bereits gedrosselter Absender liess bis zu 10 MB JSON parsen. Jetzt:
 * Limiter → Content-Type-Pflicht (415) → Parser mit Routengrenze (413 schon
 * am `Content-Length`, bevor gelesen wird) → nur ein JSON-Objekt als Body.
 */
const JSON_BODY_LIMIT_BYTES = 64 * 1024
// Support: Anhaenge kommen Base64-kodiert (4/3) plus Formularfelder.
const SUPPORT_BODY_LIMIT_BYTES =
  Math.ceil((SUPPORT_MAX_TOTAL_BYTES * 4) / 3) + JSON_BODY_LIMIT_BYTES
function jsonBody(limit) {
  const parse = express.json({ limit, strict: true })
  return (req, res, next) => {
    if (!req.is('application/json')) {
      return res.status(415).json({ accepted: false, code: 'UNSUPPORTED_MEDIA_TYPE' })
    }
    return parse(req, res, (error) => {
      if (error) return next(error)
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ accepted: false, code: 'INVALID_JSON' })
      }
      return next()
    })
  }
}
const jsonForm = jsonBody(JSON_BODY_LIMIT_BYTES)
const jsonSupport = jsonBody(SUPPORT_BODY_LIMIT_BYTES)

// Druckbares ASCII ohne Leerzeichen, hoechstens 200 Zeichen. Vorher wurde ein
// laengerer Schluessel still gekuerzt — zwei verschiedene Schluessel mit
// gleichem Anfang waeren derselbe Vorgang gewesen.
const IDEMPOTENCY_KEY_PATTERN = /^[\x21-\x7e]{1,200}$/

// Per-IP rate limiter shared by the public mail form endpoints (contact/support).
// Over the threshold the library responds with 429 by default.
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // per IP per window (tune to taste)
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, code: ERROR_CODES.rateLimited },
})

/**
 * AP22 PT22.5 — der eine Weg, auf dem eine Journey antwortet.
 *
 * Vorher hatte jeder Endpunkt seinen eigenen try/catch mit eigener
 * Antwortform; `roi_report` antwortete sogar `{ success }` statt
 * `{ accepted, code }`. Hier laeuft alles ueber das Envelope aus
 * `api-contract.js`: eine Anfrage-ID, der echte Zustand, `retryable` und ein
 * Uebersetzungsschluessel statt fertiger Prosa.
 *
 * Das Log bekommt ausschliesslich Fehlerklasse, Journey und Anfrage-ID —
 * kein Body, keine Adresse, kein Stacktrace.
 */
async function handleJourney({ req, res, journey, submit, ValidationError, publicFields = [] }) {
  const requestId = createRequestId()
  const rawKey = req.get('Idempotency-Key')
  if (rawKey !== undefined && rawKey !== '' && !IDEMPOTENCY_KEY_PATTERN.test(rawKey)) {
    const { body, status } = errorEnvelope({
      journey,
      code: 'IDEMPOTENCY_KEY_INVALID',
      requestId,
      fieldErrors: ['idempotencyKey'],
    })
    return res.status(status).json(body)
  }
  try {
    const result = await submit()
    if (result.ignored) {
      // Honeypot: still angenommen, nichts gespeichert.
      return res.status(200).json(successEnvelope({ journey, state: 'IGNORED', requestId }))
    }
    return res.status(202).json(
      successEnvelope({
        journey,
        state: result.status,
        requestId,
        leadId: result.leadId,
        reference: result.orderReference ?? result.reportReference,
        deliveryPending: result.deliveryPending,
        providerConfigured: result.providerConfigured,
        // Journeyspezifische Nutzlast wird AUSDRUECKLICH aufgezaehlt.
        // Das Ergebnis durchzureichen waere bequem und wuerde ein spaeter
        // ergaenztes internes Feld unbemerkt mit nach draussen nehmen.
        data: Object.fromEntries(
          publicFields
            .filter((field) => result[field] !== undefined)
            .map((field) => [field, result[field]]),
        ),
      }),
    )
  } catch (error) {
    const isValidation = ValidationError && error instanceof ValidationError
    const isConflict = error instanceof IdempotencyConflictError
    const code = isConflict
      ? 'IDEMPOTENCY_CONFLICT'
      : isValidation
        ? error.code
        : 'JOURNEY_UNAVAILABLE'
    const { body, status } = errorEnvelope({
      journey,
      code,
      requestId,
      fieldErrors: isValidation ? error.fields : undefined,
    })
    if (status >= 500)
      console.error('[journey] request failed', logSafeError({ journey, code, requestId }))
    return res.status(status).json(body)
  }
}

// Dedicated Epigenetics journey. Unlike the legacy mail endpoints below, this
// route commits the shared Lead + Outbox transaction before any provider path
// can run. SendGrid is deliberately not its source of truth.
app.post('/api/epigenetics-inquiry', formLimiter, jsonForm, async (req, res) => {
  await handleJourney({
    req,
    res,
    journey: 'epigenetics_inquiry',
    submit: () =>
      getRuntimeEpigeneticsInquiryService({ mailer: sgMail }).submit({
        body: req.body,
        idempotencyKey: req.get('Idempotency-Key'),
      }),
    ValidationError: InquiryValidationError,
  })
})

// Ein eigener, groszuegigerer Limiter fuer das Einloesen: einen Download-Link
// klickt man auch mal mehrfach, und er teilt sich das Budget sonst mit den
// Formularen. Missbrauch bleibt begrenzt, weil jeder Abruf zusaetzlich gegen
// `max_downloads` des Entitlements laeuft.
const downloadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { accepted: false, code: ERROR_CODES.rateLimited },
})

// AP19 PT19.3 — gegateter Lead-Magnet. Wie die Epigenetik-Strecke committet
// dieser Pfad Lead und Outbox, BEVOR irgendein Provider laufen darf.
app.post('/api/content-download', formLimiter, jsonForm, async (req, res) => {
  await handleJourney({
    req,
    res,
    journey: 'content_download',
    submit: () =>
      getRuntimeContentDownloadService({ mailer: sgMail }).submit({
        body: req.body,
        idempotencyKey: req.get('Idempotency-Key'),
      }),
    ValidationError: ContentDownloadValidationError,
    publicFields: ['assetId', 'deliveredLanguage', 'entitlementId', 'expiresAt', 'downloadUrl'],
  })
})

// Geschuetzte Auslieferung. Der Client nennt eine ASSET-ID und ein Token —
// niemals einen Dateipfad. Der Server loest ueber die kanonische Registry auf.
app.get('/api/content-download/asset/:assetId', downloadLimiter, (req, res) => {
  // Auch die Ablehnung darf nicht indexiert oder zwischengespeichert werden:
  // die URL traegt ein Geheimnis, und ein 403 mit Cache-Erlaubnis waere ein
  // unnoetiger Verbreitungsweg. Deshalb VOR der Verzweigung gesetzt.
  res.setHeader('Cache-Control', 'no-store, private')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  try {
    const { asset } = getRuntimeContentDownloadService({ mailer: sgMail }).redeem({
      assetId: req.params.assetId,
      entitlementId: req.query.e,
      token: req.query.t,
    })

    // Kein Zwischenspeicher, kein Index, kein Referrer — oben bereits gesetzt.
    res.setHeader('Content-Type', asset.mime)
    res.setHeader('Content-Disposition', `attachment; filename="${asset.filename}"`)
    return res.sendFile(asset.absolutePath)
  } catch (error) {
    const code = error?.code || 'CONTENT_DOWNLOAD_UNAVAILABLE'
    if (error instanceof EntitlementError) {
      // Ungueltig und abgelaufen werden unterschieden, weil die Oberflaeche
      // dem Leser einen sinnvollen Weg zurueck anbieten muss. Ueber die
      // Existenz des Assets sagt keine der Antworten etwas aus.
      const status = code === 'ENTITLEMENT_EXPIRED' || code === 'ENTITLEMENT_EXHAUSTED' ? 410 : 403
      logDownloadFailure(code, req.params.assetId)
      return res.status(status).json({ accepted: false, code })
    }
    if (error instanceof AssetResolutionError) {
      logDownloadFailure(code, req.params.assetId)
      return res.status(404).json({ accepted: false, code: 'UNKNOWN_ASSET' })
    }
    logDownloadFailure('UNCLASSIFIED_ERROR', req.params.assetId)
    return res.status(500).json({ accepted: false, code: 'CONTENT_DOWNLOAD_UNAVAILABLE' })
  }
})

// Validation of required environment variables
const requiredEnvVars = ['SENDGRID_API_KEY', 'CONTACT_RECEIVER', 'SENDER_EMAIL']
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key])

if (missingEnvVars.length > 0) {
  console.warn(
    `WARNING: Missing environment variables for email service: ${missingEnvVars.join(', ')}`,
  )
}

// Set SendGrid API Key — AP26 PT26.4: nicht im Trockenlauf. Eine Umgebung, die nicht
// zustellen darf, haelt den Schluessel dann auch nicht im Mail-Client.
if (process.env.SENDGRID_API_KEY && !resolveDeliveryMode(process.env).dryRun) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

// DRY_RUN: global kill-switch for outbound email. Used by the ISOLATED PREVIEW
// backend instance (started with DRY_RUN=1 on :5001) so preview form submits
// never send real mail through the shared prod mailbox. Prod (:5000) runs
// without DRY_RUN and is unaffected.
// AP22 PT22.8 — der Trockenlauf haengt nicht mehr allein am Flag. Eine
// Umgebung, die sich per APP_ENV als `preview`/`staging` ausweist, ist
// ZWINGEND im Trockenlauf; `DRY_RUN=0` hebt das nicht auf. Was `NODE_ENV`
// dabei nicht leisten kann, steht in `lead-foundation/environment.js`.
const DELIVERY_MODE = resolveDeliveryMode(process.env)
const DRY_RUN = DELIVERY_MODE.dryRun
if (DRY_RUN) {
  // AP22 PT22.3 — zwei Korrekturen an diesem Schalter:
  //
  // 1. Die alte Zeile schrieb `to=<empfaenger>` und den Betreff ins Log. Ein
  //    Betreff enthaelt hier regelmaessig den vollen Namen der Absenderin
  //    ("Neue Kontaktanfrage von Dr. …"), ein Support-Betreff ihr Anliegen.
  //    Beides ist PII und hat in einem Log nichts verloren.
  // 2. Der Stub gab `202` zurueck. Der Adapter sah damit Erfolg und der Lead
  //    wurde mit Zeitstempel als DELIVERED abgelegt — ein Datensatz, der
  //    behauptet, die Mail sei raus. Fuer alle Journeys auf der Foundation
  //    entscheidet jetzt der `CrmRouter` VOR dem Adapter (`DELIVERY_RESULTS
  //    .DRY_RUN`); dieser Stub bleibt als Netz fuer die Legacy-Mailpfade,
  //    die noch nicht ueber die Outbox laufen (`roi_report`).
  sgMail.send = async () => {
    console.log('[DRY_RUN] outbound email suppressed')
    return [{ statusCode: 202, headers: {} }, {}]
  }
  console.log(
    `[DRY_RUN] active — no real emails will be sent (reason=${DELIVERY_MODE.reason}` +
      `, environment=${DELIVERY_MODE.environment}, forced=${DELIVERY_MODE.forced})`,
  )
}

// Fehlbetrieb wird gemeldet, nicht verschwiegen: eine Vorschau mit
// Live-Zustellung oder eine Produktion im Trockenlauf ist keine Ausnahme, die
// den Start verhindern darf (das wuerde Anfragen kosten), aber sie darf auch
// nicht still bleiben. Keine Werte, nur Befunde.
for (const finding of describeRuntimeIsolation(process.env).findings) {
  console.warn(`[runtime-isolation] ${finding.severity}: ${finding.code} — ${finding.detail}`)
}

// AP20 PT20.2 — die allgemeine Anfrage als eigene Lead-Journey. Wie die
// Epigenetik- und Download-Strecke committet dieser Pfad Lead und Outbox,
// BEVOR irgendein Provider laufen darf. SendGrid ist Side Effect, nicht
// Quelle der Wahrheit.
app.post('/api/contact', formLimiter, jsonForm, async (req, res) => {
  await handleJourney({
    req,
    res,
    journey: 'contact',
    submit: () =>
      getRuntimeContactLeadService({ mailer: sgMail }).submit({
        body: req.body,
        idempotencyKey: req.get('Idempotency-Key'),
      }),
    ValidationError: ContactValidationError,
  })
})

// Support API Endpoint
// AP20 PT20.3 — Support als eigene persistente Journey. Wie die Contact-
// Strecke committet dieser Pfad Case und Outbox, BEVOR irgendein Provider
// laufen darf. Team- + Bestaetigungsmail sind entkoppelte, retryfaehige
// Side Effects ueber die Outbox (CrmRouter). Attachments laufen ueber
// serverseitige Allowlist + Magic-Bytes + Limits und werden opak abgelegt.
app.post('/api/support', formLimiter, jsonSupport, async (req, res) => {
  await handleJourney({
    req,
    res,
    journey: 'support',
    submit: () =>
      getRuntimeSupportCaseService({ mailer: sgMail }).submit({
        body: req.body,
        idempotencyKey: req.get('Idempotency-Key'),
      }),
    ValidationError: SupportValidationError,
  })
})

// =============================================================================
// CONSUMER ORDER ENDPOINT
// =============================================================================
// AP21 PT21.5 — Consumer Ordering als eigene persistente Journey.
//
// Vorher war das ein reiner Mailendpunkt: keine Persistenz, keine
// Idempotency, kein Retry, kein Rate Limit. Ein SendGrid-Fehler hat die
// Bestellanfrage ersatzlos verloren. Jetzt committet dieser Pfad Lead und
// Outbox, BEVOR irgendein Provider laufen darf; Team- und Bestaetigungsmail
// sind entkoppelte, retryfaehige Side Effects ueber den CrmRouter.
//
// - Empfaenger sind serverseitig fest verdrahtet (nie aus dem Body) — das
//   Formular ist kein Relay.
// - Produkt, Variante und Menge werden serverseitig allowlistet; freie
//   Client-Labels landen nirgends mehr in Lead oder Mail.
// - Processing-Consent ist Pflicht, Marketing optional und getrennt. Eine
//   Analytics-Einwilligung ist keine Voraussetzung.
// - Honeypot `_hp` → stilles 200. Rate Limit ueber formLimiter.
// - Kein Shop, kein Cart, kein Checkout, kein Payment: das ist eine
//   Bestellanfrage, kein Kaufvertrag.
// =============================================================================

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

app.post('/api/consumer-order', formLimiter, jsonForm, async (req, res) => {
  await handleJourney({
    req,
    res,
    journey: 'consumer_order',
    submit: () =>
      getRuntimeConsumerOrderService({ mailer: sgMail }).submit({
        body: req.body,
        idempotencyKey: req.get('Idempotency-Key'),
      }),
    ValidationError: ConsumerOrderValidationError,
  })
})

// =============================================================================
// ROI-REPORT (Lead-Magnet) ENDPOINT — Home ROI-Rechner (#roi-rechner)
// =============================================================================
// - Recipients fixed server-side (no `to` from body) → no open relay.
// - DSGVO: explicit consent required; honeypot `_hp`; rate-limited (formLimiter).
// - Single-Opt-in transactional: der ausdrücklich angeforderte Report wird sofort
//   gesendet (Art. 6(1)(a)/(b)) + das Team als Lead benachrichtigt. Ein voller
//   Confirmed-Opt-in-Handshake (Double-Opt-in) ist ein späterer Toggle (braucht
//   einen persistenten Token-Store) — bewusst hier nicht implementiert.
// - PDF: serverseitig via pdfkit erzeugt + als Anhang (best-effort; Mail geht
//   auch ohne Anhang raus, falls PDF scheitert).
// - DRY_RUN (Preview-Instanz): sgMail.send ist oben global stillgelegt.
// =============================================================================

const ROI_REPORT_RECIPIENTS = [
  'ulrikes@polarisdx.net',
  'inesr@polarisdx.net',
  'adrianoz@polarisdx.net',
  'contact@polarisdx.net',
]

function buildRoiPdf({ practice, area, inputs = {}, outputs = {}, locale }) {
  return new Promise((resolve, reject) => {
    try {
      const c = getMailCopy(locale).roi
      const eur = (value) => formatMailCurrency(value, locale)
      const doc = new PDFDocument({ size: 'A4', margin: 50 })
      const chunks = []
      doc.on('data', (c) => chunks.push(c))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      doc.fillColor('#083358').fontSize(22).text(c.title)
      doc.moveDown(0.3).fillColor('#0d9488').fontSize(11).text(c.subtitle)
      doc.moveDown(1).fillColor('#334155').fontSize(11)
      if (practice) doc.text(`${c.practice}: ${practice}`)
      if (area) doc.text(`${c.area}: ${area}`)
      doc.moveDown(1)

      doc.fillColor('#083358').fontSize(14).text(c.inputs)
      doc.moveDown(0.3).fillColor('#334155').fontSize(11)
      doc.text(`• ${c.tests}: ${inputs.testsPerMonth ?? '-'}`)
      doc.text(`• ${c.price}: ${eur(inputs.pricePerTest)}`)
      doc.text(`• ${c.material}: ${eur(inputs.materialCostPerTest)}`)
      doc.text(`• ${c.minutes}: ${inputs.minutesPerTest ?? '-'}`)
      doc.text(`• ${c.staff}: ${eur(inputs.staffCostPerHour)}`)
      if (inputs.deviceInvestment) doc.text(`• ${c.investment}: ${eur(inputs.deviceInvestment)}`)
      doc.moveDown(1)

      doc.fillColor('#083358').fontSize(14).text(c.results)
      doc.moveDown(0.3).fillColor('#334155').fontSize(11)
      doc.text(`• ${c.month}: ${eur(outputs.dbPerMonth)}`)
      doc.text(`• ${c.revenue}: ${eur(outputs.revenuePerMonth)}`)
      doc.text(`• ${c.year}: ${eur(outputs.dbPerYear)}`)
      doc.text(`• ${c.perTest}: ${eur(outputs.dbPerTest)}`)
      if (outputs.payback != null) doc.text(`• ${c.payback}: ${outputs.payback} ${c.months}`)
      doc.moveDown(1.2)

      doc.fillColor('#64748b').fontSize(9).text(`${c.disclaimer} IVDR/CE · CV < 2 %.`)
      doc.end()
    } catch (e) {
      reject(e)
    }
  })
}

app.post('/api/roi-report', formLimiter, jsonForm, async (req, res) => {
  await handleJourney({
    req,
    res,
    journey: 'roi_report',
    submit: () =>
      getRuntimeRoiReportService({ mailer: sgMail, buildPdf: buildRoiPdf }).submit({
        body: req.body,
        idempotencyKey: req.get('Idempotency-Key'),
      }),
    ValidationError: RoiReportValidationError,
  })
})

// =============================================================================
// PRACTICE ORDER ENDPOINT
// =============================================================================
// AP22 PT22.5 — die Praxisbestellung als eigene, getypte Journey.
//
// Vorher gab es diesen Endpunkt nicht: eine Praxisbestellung lief durch
// `/api/contact` und wurde dort an einem MAGIC STRING erkannt
// (`area === 'Vitamin D3+K2 Spray BESTELLUNG'`), der ueber den Mailempfaenger
// entschied. Der Empfaenger haengt jetzt an der Journey, nicht am Formular.
// =============================================================================
app.post('/api/practice-order', formLimiter, jsonForm, async (req, res) => {
  await handleJourney({
    req,
    res,
    journey: 'practice_order',
    submit: () =>
      getRuntimePracticeOrderService({ mailer: sgMail }).submit({
        body: req.body,
        idempotencyKey: req.get('Idempotency-Key'),
      }),
    ValidationError: PracticeOrderValidationError,
  })
})

/**
 * AP22 PT22.4 — der Hintergrundlauf der Outbox.
 *
 * Vorher drehte sie sich NUR beim Absenden eines Formulars: jeder Slice ruft
 * `processNext()` einmal am Ende seines eigenen Submits. Ein Auftrag im
 * Zustand RETRY_PENDING mit einem Abstand in der Zukunft wurde damit erst
 * beim naechsten fremden Submit wieder angefasst — nachts also gar nicht.
 * Die Wiederholung stand auf dem Papier und lief in der Praxis nicht.
 *
 * Der Dispatcher konsumiert die vorhandenen Services; Router, Zustellgrenze,
 * DRY_RUN, Timeout und Journey-Zustaendigkeit gelten unveraendert weiter.
 */
/**
 * AP22 PT22.8 — die Wartung auf dem Takt des Dispatchers.
 *
 * Zwei Jobs, beide bewusst zurueckhaltend:
 *
 *  - **Aufbewahrung.** Standardmaessig BERICHTET der Lauf nur, was faellig
 *    waere. Wirklich anonymisiert wird erst mit `LEAD_RETENTION_APPLY=1`.
 *    Ein Loeschjob, der sich mit dem Deployment selbst scharf schaltet, ist
 *    im Betrieb nicht zu verantworten — die Freigabe ist eine bewusste
 *    Entscheidung, keine Nebenwirkung eines Neustarts.
 *  - **Alarme.** Bewertet Warteschlange, Datenschutzstand und
 *    Umgebungsisolation und gibt die Befunde an die Senken. Standardsenke
 *    ist das Log; ein echtes Monitoring haengt AP28 daran.
 */
function buildMaintenanceJobs() {
  const retentionApply = process.env.LEAD_RETENTION_APPLY === '1'
  const retentionEveryMs = Number(process.env.LEAD_RETENTION_INTERVAL_MS ?? 6 * 60 * 60_000)
  const alertEveryMs = Number(process.env.LEAD_ALERT_INTERVAL_MS ?? 5 * 60_000)
  const alertSinks = [createLoggerAlertSink(console)]

  const withRepository = (fn) => {
    const db = openLeadDatabase()
    try {
      return fn(
        new LeadRepository(db, {
          retentionPolicy: retentionDaysFromPolicy(resolveRetentionPolicy(process.env)),
        }),
      )
    } finally {
      db.close()
    }
  }

  return [
    {
      name: 'retention',
      everyMs: retentionEveryMs,
      run: () =>
        withRepository((repository) => {
          const summary = runRetention({
            repository,
            storageRoot: process.env.SUPPORT_UPLOAD_DIR || null,
            apply: retentionApply,
            logger: {
              info: (event, fields) => console.log(`[lead-retention] ${event}`, fields),
              warn: (event, fields) => console.warn(`[lead-retention] ${event}`, fields),
            },
          })
          if (summary.due > 0) {
            console.log(
              `[lead-retention] due=${summary.due} applied=${summary.applied} ` +
                `anonymized=${summary.anonymized.length} deferred=${summary.deferred.length}`,
            )
          }
          return summary
        }),
    },
    {
      name: 'alerts',
      everyMs: alertEveryMs,
      run: () =>
        withRepository((repository) => {
          const alerts = evaluateAlerts({
            queueMetrics: repository.collectQueueMetrics(),
            privacyMetrics: repository.collectPrivacyMetrics(),
            isolation: describeRuntimeIsolation(process.env),
          })
          return dispatchAlerts(alerts, { sinks: alertSinks, logger: console })
        }),
    },
  ]
}

function startLeadDispatcher() {
  if (process.env.LEAD_DISPATCHER_DISABLED === '1') {
    console.log('[lead-dispatcher] disabled by LEAD_DISPATCHER_DISABLED=1')
    return null
  }
  const intervalMs = Number(process.env.LEAD_DISPATCHER_INTERVAL_MS ?? 30_000)
  const handles = [
    { name: 'contact', service: () => getRuntimeContactLeadService({ mailer: sgMail }) },
    { name: 'support', service: () => getRuntimeSupportCaseService({ mailer: sgMail }) },
    { name: 'consumer_order', service: () => getRuntimeConsumerOrderService({ mailer: sgMail }) },
    {
      name: 'epigenetics_inquiry',
      service: () => getRuntimeEpigeneticsInquiryService({ mailer: sgMail }),
    },
    {
      name: 'content_download',
      service: () => getRuntimeContentDownloadService({ mailer: sgMail }),
    },
    {
      name: 'roi_report',
      service: () => getRuntimeRoiReportService({ mailer: sgMail, buildPdf: buildRoiPdf }),
    },
    { name: 'practice_order', service: () => getRuntimePracticeOrderService({ mailer: sgMail }) },
  ].map(({ name, service }) => ({ name, processNext: () => service().processNext() }))

  const dispatcher = new LeadDispatcher({
    handles,
    jobs: buildMaintenanceJobs(),
    intervalMs,
    logger: {
      info() {},
      warn: (event, fields) => console.warn(`[lead-dispatcher] ${event}`, fields),
    },
  }).start()
  console.log(`[lead-dispatcher] running every ${intervalMs} ms for ${handles.length} journeys`)
  return dispatcher
}

// AP26 PT26.1 — sichere Fehlersemantik fuer alles, was keine Route beantwortet.
// Ohne NODE_ENV=production (so laeuft der Compose-Dienst) lieferte Express bei
// kaputtem JSON oder zu grosser Nutzlast seine HTML-Fehlerseite MIT Stacktrace
// und Dateipfaden, bei unbekanntem Pfad die Standardseite. Jetzt: JSON mit Code,
// ohne Rohfehler; ins Log nur die Fehlerart.
const SAFE_ERROR_CODES = {
  'entity.parse.failed': 'INVALID_JSON',
  'entity.too.large': 'PAYLOAD_TOO_LARGE',
}
app.use((_req, res) => res.status(404).json({ accepted: false, code: 'NOT_FOUND' }))
// Vier Parameter: nur daran erkennt Express eine Fehler-Middleware.
app.use((error, _req, res, next) => {
  if (res.headersSent) return next(error)
  const clientError = Number.isInteger(error?.status) && error.status >= 400 && error.status < 500
  const status = clientError ? error.status : 500
  const code = SAFE_ERROR_CODES[error?.type] || (clientError ? 'INVALID_REQUEST' : 'INTERNAL_ERROR')
  if (!clientError) console.error('[api] unhandled error', { type: error?.type || error?.name })
  return res.status(status).json({ accepted: false, code })
})

const PORT = process.env.PORT || 5000
// Listen on 0.0.0.0 to ensure Docker accessibility.
// Guard so importing this module for tests does not start a live server.
if (require.main === module) {
  app.listen(PORT, process.env.LISTEN_HOST || '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
  })
  startLeadDispatcher()
}

// Exported for unit/endpoint tests (esc is the core HTML-escape XSS control).
module.exports = {
  app,
  esc,
  ERROR_CODES,
  buildRoiPdf,
  buildMaintenanceJobs,
  resolveLeadAttribution,
  startLeadDispatcher,
}
