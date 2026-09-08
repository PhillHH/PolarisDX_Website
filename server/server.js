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
const {
  getRuntimeSupportCaseService,
  IdempotencyConflictError: SupportIdempotencyConflictError,
  SupportValidationError,
} = require('./support-case')
const { AssetResolutionError } = require('./protected-assets')
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

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Idempotency-Key'],
  }),
)
app.use(express.json({ limit: '10mb' }))

// Per-IP rate limiter shared by the public mail form endpoints (contact/support).
// Over the threshold the library responds with 429 by default.
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // per IP per window (tune to taste)
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, code: ERROR_CODES.rateLimited },
})

// Dedicated Epigenetics journey. Unlike the legacy mail endpoints below, this
// route commits the shared Lead + Outbox transaction before any provider path
// can run. SendGrid is deliberately not its source of truth.
app.post('/api/epigenetics-inquiry', formLimiter, async (req, res) => {
  try {
    const result = await getRuntimeEpigeneticsInquiryService().submit({
      body: req.body,
      idempotencyKey: req.get('Idempotency-Key'),
    })
    if (result.ignored) return res.status(200).json({ accepted: true })
    return res.status(202).json(result)
  } catch (error) {
    if (error instanceof InquiryValidationError) {
      return res.status(400).json({ accepted: false, code: error.code, fields: error.fields })
    }
    if (error instanceof IdempotencyConflictError) {
      return res.status(409).json({ accepted: false, code: error.code })
    }
    console.error('[epigenetics_inquiry] request failed', {
      errorClass: error?.code || error?.name || 'UNCLASSIFIED_ERROR',
    })
    return res.status(500).json({ accepted: false, code: 'INQUIRY_UNAVAILABLE' })
  }
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
app.post('/api/content-download', formLimiter, async (req, res) => {
  try {
    const result = await getRuntimeContentDownloadService().submit({
      body: req.body,
      idempotencyKey: req.get('Idempotency-Key'),
    })
    if (result.ignored) return res.status(200).json({ accepted: true })
    return res.status(202).json(result)
  } catch (error) {
    if (error instanceof ContentDownloadValidationError) {
      return res.status(400).json({ accepted: false, code: error.code, fields: error.fields })
    }
    if (error instanceof IdempotencyConflictError) {
      return res.status(409).json({ accepted: false, code: error.code })
    }
    // Bewusst OHNE req.url: die Query traegt beim Einloesepfad ein Token, und
    // eine gemeinsame Log-Zeile waere die einfachste Art, es doch zu leaken.
    console.error('[content_download] request failed', {
      errorClass: error?.code || error?.name || 'UNCLASSIFIED_ERROR',
    })
    return res.status(500).json({ accepted: false, code: 'CONTENT_DOWNLOAD_UNAVAILABLE' })
  }
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
    const { asset } = getRuntimeContentDownloadService().redeem({
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

// Set SendGrid API Key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

// DRY_RUN: global kill-switch for outbound email. Used by the ISOLATED PREVIEW
// backend instance (started with DRY_RUN=1 on :5001) so preview form submits
// never send real mail through the shared prod mailbox. Prod (:5000) runs
// without DRY_RUN and is unaffected.
const DRY_RUN = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true'
if (DRY_RUN) {
  sgMail.send = async (msg) => {
    const to = Array.isArray(msg.to) ? msg.to.join(',') : msg.to
    console.log(`[DRY_RUN] email suppressed → to=${to} subject="${msg.subject}"`)
    return [{ statusCode: 202, headers: {} }, {}]
  }
  console.log('[DRY_RUN] active — no real emails will be sent')
}

// AP20 PT20.2 — die allgemeine Anfrage als eigene Lead-Journey. Wie die
// Epigenetik- und Download-Strecke committet dieser Pfad Lead und Outbox,
// BEVOR irgendein Provider laufen darf. SendGrid ist Side Effect, nicht
// Quelle der Wahrheit.
app.post('/api/contact', formLimiter, async (req, res) => {
  try {
    const result = await getRuntimeContactLeadService({ mailer: sgMail }).submit({
      body: req.body,
      idempotencyKey: req.get('Idempotency-Key'),
    })
    if (result.ignored) return res.status(200).json({ accepted: true })
    return res.status(202).json(result)
  } catch (error) {
    if (error instanceof ContactValidationError) {
      return res.status(400).json({ accepted: false, code: error.code, fields: error.fields })
    }
    if (error instanceof IdempotencyConflictError) {
      return res.status(409).json({ accepted: false, code: error.code })
    }
    // Bewusst nur Fehlerklasse — keine PII, keine Payload-Inhalte.
    console.error('[contact] request failed', {
      errorClass: error?.code || error?.name || 'UNCLASSIFIED_ERROR',
    })
    return res.status(500).json({ accepted: false, code: 'CONTACT_UNAVAILABLE' })
  }
})

// Support API Endpoint
// AP20 PT20.3 — Support als eigene persistente Journey. Wie die Contact-
// Strecke committet dieser Pfad Case und Outbox, BEVOR irgendein Provider
// laufen darf. Team- + Bestaetigungsmail sind entkoppelte, retryfaehige
// Side Effects ueber die Outbox (CrmRouter). Attachments laufen ueber
// serverseitige Allowlist + Magic-Bytes + Limits und werden opak abgelegt.
app.post('/api/support', formLimiter, async (req, res) => {
  try {
    const result = await getRuntimeSupportCaseService({ mailer: sgMail }).submit({
      body: req.body,
      idempotencyKey: req.get('Idempotency-Key'),
    })
    if (result.ignored) return res.status(200).json({ accepted: true })
    return res.status(202).json(result)
  } catch (error) {
    if (error instanceof SupportValidationError) {
      return res.status(400).json({ accepted: false, code: error.code, fields: error.fields })
    }
    if (error instanceof SupportIdempotencyConflictError) {
      return res.status(409).json({ accepted: false, code: 'IDEMPOTENCY_CONFLICT' })
    }
    console.error('[support] unerwarteter Fehler:', error.message)
    return res.status(500).json({ accepted: false, code: 'SUPPORT_UNAVAILABLE' })
  }
})

// =============================================================================
// CONSUMER ORDER ENDPOINT
// =============================================================================
// Order intake from the unlisted consumer landing pages (/consumer/*).
//
// - Recipients are fixed server-side (no `to` from the request body) to
//   prevent the form being used as a relay.
// - DSGVO: requires explicit consent flag in the body; otherwise 400.
// - Spam: honeypot field `_hp`; if filled, returns 200 silently without sending.
// - Data minimization: only the fields the order intake actually needs.
//   Shipping address etc. is collected later by sales (no payment flow yet).
// =============================================================================

const CONSUMER_ORDER_RECIPIENTS = [
  'ulrikes@polarisdx.net',
  'inesr@polarisdx.net',
  'adrianoz@polarisdx.net',
  'contact@polarisdx.net',
]

const CONSUMER_PRODUCT_LABELS = {
  spray: 'Vitamin D3+K2 Spray (12-Pack)',
  masks: 'Hydrating Masks (5-Pack)',
  duo: 'Inside-Out Care Duo (1 spray + 5 masks)',
}

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

app.post('/api/consumer-order', async (req, res) => {
  try {
    const {
      product,
      quantity,
      // contact
      name,
      email,
      phone,
      // company
      company,
      // shipping address
      street,
      postcode,
      city,
      country,
      // free-form context
      message,
      quantityLabel,
      // GDPR / spam
      consent,
      _hp,
      locale,
    } = req.body || {}
    const mailLocale = requestMailLocale(locale, 'consumer-order')

    // Honeypot — bots almost always fill all visible/hidden fields
    if (_hp) {
      console.log('[consumer-order] honeypot triggered, silently dropping')
      return res.status(200).json({ success: true })
    }

    // DSGVO: explicit consent is required
    if (consent !== true) {
      return sendError(res, 400, ERROR_CODES.consentRequired)
    }

    if (!product || !CONSUMER_PRODUCT_LABELS[product]) {
      return sendError(res, 400, ERROR_CODES.unknownProduct)
    }
    if (!name || !email || !quantity) {
      return sendError(res, 400, ERROR_CODES.requiredFields)
    }
    // Cheap email shape check (server-side; UI also validates)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return sendError(res, 400, ERROR_CODES.invalidEmail)
    }

    const productLabel = CONSUMER_PRODUCT_LABELS[product]

    // Build a one-line address summary (only the parts the customer filled in)
    const addressLine = [street, [postcode, city].filter(Boolean).join(' '), country]
      .map((s) => (s || '').trim())
      .filter(Boolean)
      .join(', ')

    const orderText = `Neue Bestellanfrage über die Consumer-Landingpage

Produkt:     ${productLabel}
Stückzahl:   ${quantityLabel || quantity}

— Ansprechpartner —
Name:        ${name}
E-Mail:      ${email}
Telefon:     ${phone || '-'}

— Firma —
Firma:       ${company || '-'}

— Lieferadresse —
Straße:      ${street || '-'}
PLZ / Ort:   ${[postcode, city].filter(Boolean).join(' ') || '-'}
Land:        ${country || '-'}

— Nachricht / Kontext —
${message || '-'}

— Hinweis: Der Kunde hat der Datenverarbeitung zur Bestellabwicklung
ausdrücklich zugestimmt (DSGVO Art. 6 Abs. 1 lit. b).
`

    const row = (label, value) => `
  <tr>
    <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-weight:600;width:180px;color:#083358;font-family:system-ui,sans-serif;">${esc(label)}</td>
    <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;color:#334155;font-family:system-ui,sans-serif;">${value}</td>
  </tr>`
    const sectionRow = (label) => `
  <tr>
    <td colspan="2" style="padding:14px 10px 6px;font-size:12px;font-weight:700;color:#0d9488;text-transform:uppercase;letter-spacing:1px;font-family:system-ui,sans-serif;">${esc(label)}</td>
  </tr>`

    const orderHtml = `
<h2 style="margin:0 0 12px;font-family:system-ui,sans-serif;color:#083358;">
  Neue Bestellanfrage
</h2>
<p style="margin:0 0 16px;font-family:system-ui,sans-serif;color:#475569;">
  über die Consumer-Landingpage
</p>
<table style="border-collapse:collapse;width:100%;max-width:680px;">
  ${sectionRow('Bestellung')}
  ${row('Produkt', esc(productLabel))}
  ${row('Stückzahl', esc(quantityLabel || quantity))}

  ${sectionRow('Ansprechpartner')}
  ${row('Name', esc(name))}
  ${row('E-Mail', `<a href="mailto:${esc(email)}">${esc(email)}</a>`)}
  ${row('Telefon', esc(phone || '-'))}

  ${sectionRow('Firma')}
  ${row('Firma', esc(company || '-'))}

  ${sectionRow('Lieferadresse')}
  ${row('Straße', esc(street || '-'))}
  ${row('PLZ / Ort', esc([postcode, city].filter(Boolean).join(' ') || '-'))}
  ${row('Land', esc(country || '-'))}
</table>
${
  message
    ? `<p style="margin:18px 0 6px;font-family:system-ui,sans-serif;font-weight:600;color:#083358;">Nachricht / Kontext</p>
       <p style="margin:0;font-family:system-ui,sans-serif;color:#334155;white-space:pre-line;">${esc(message)}</p>`
    : ''
}
${
  addressLine
    ? `<p style="margin:18px 0 0;font-family:system-ui,sans-serif;font-size:13px;color:#64748b;">
         Adresse (Zusammenfassung): ${esc(addressLine)}
       </p>`
    : ''
}
<p style="margin:24px 0 0;font-family:system-ui,sans-serif;font-size:12px;color:#64748b;">
  Der Kunde hat der Datenverarbeitung zur Bestellabwicklung ausdrücklich zugestimmt
  (DSGVO Art. 6 Abs. 1 lit. b).
</p>
`

    const msg = {
      to: CONSUMER_ORDER_RECIPIENTS,
      from: process.env.SENDER_EMAIL,
      replyTo: email,
      subject: `[${mailLocale.toUpperCase()}] Neue Bestellung — ${productLabel} (${quantityLabel || quantity})`,
      text: orderText,
      html: orderHtml,
    }

    await sgMail.send(msg)
    console.log(`[consumer-order] sent: product=${product} qty=${quantity} from=${email}`)
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error sending consumer order:', error)
    if (error.response) {
      console.error(error.response.body)
    }
    sendError(res, 500, ERROR_CODES.deliveryFailed)
  }
})

/**
 * Chat Endpoint (Mock / Placeholder)
 *
 * TODO: Integration with Microsoft Teams Bot Framework or OpenAI
 *
 * To implement full "Option C":
 * 1. Register a Bot in Azure Bot Service.
 * 2. Use `botbuilder` SDK to forward messages to the bot.
 * 3. Use `openai` SDK if you want an intermediate AI agent.
 *
 * Current implementation: Simple Echo/Mock Agent.
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock Response Logic
    let reply =
      'Vielen Dank für Ihre Nachricht. Ein Mitarbeiter wird sich in Kürze bei Ihnen melden.'

    const lowerMsg = message.toLowerCase()
    if (lowerMsg.includes('hallo') || lowerMsg.includes('hi')) {
      reply = 'Hallo! Wie kann ich Ihnen heute helfen?'
    } else if (lowerMsg.includes('preis') || lowerMsg.includes('kosten')) {
      reply =
        'Für Preisanfragen wenden Sie sich bitte direkt an unseren Vertrieb oder nutzen Sie das Kontaktformular.'
    } else if (lowerMsg.includes('termin')) {
      reply = 'Gerne! Sie können einen Termin direkt über unsere Kontaktseite buchen.'
    }

    // TODO: Connect to MS Teams Webhook or OpenAI API here
    // Example (Pseudo-code):
    // const aiResponse = await openai.createCompletion({ ... });
    // reply = aiResponse.choices[0].text;

    res.status(200).json({ reply })
  } catch (error) {
    console.error('Chat Error:', error)
    res.status(500).json({ error: 'Chat service error' })
  }
})

/**
 * Teams Integration Roadmap (Option C):
 *
 * 1.  **Azure Bot Service Setup**:
 *     -   Create a "Azure Bot" resource in the Azure Portal.
 *     -   Select "Multi Tenant" or "Single Tenant" based on requirements.
 *     -   Enable the "Microsoft Teams" channel in the Bot Blade.
 *
 * 2.  **Code Changes (Server)**:
 *     -   Install `botbuilder` and `botframework-connector`.
 *     -   Create a `CloudAdapter` instance using `ConfigurationBotFrameworkAuthentication`.
 *     -   Implement a Bot class extending `ActivityHandler`.
 *     -   Replace the simple `/api/chat` logic below with the adapter's `process` method.
 *
 * 3.  **Frontend Changes**:
 *     -   Currently using a custom React widget.
 *     -   To use standard Teams features, you might switch to the "Bot Framework Web Chat" component (optional, but easier)
 *     -   OR continue using this custom widget and treat it as a Direct Line client.
 *     -   If using Direct Line:
 *         -   Enable "Direct Line" channel in Azure.
 *         -   Fetch a token from a new endpoint `/api/directline/token` on this server.
 *         -   Connect via WebSocket or polling in `ChatWidget.tsx`.
 */

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

app.post('/api/roi-report', formLimiter, async (req, res) => {
  try {
    const {
      email,
      area,
      areaLabel,
      practice,
      consent,
      _hp,
      locale,
      inputs = {},
      outputs = {},
      source,
      journey,
      section,
    } = req.body || {}
    const mailLocale = requestMailLocale(locale, 'roi-report')
    const c = getMailCopy(mailLocale).roi
    const eur = (value) => formatMailCurrency(value, mailLocale)
    const attribution = resolveLeadAttribution({ source, journey, section })

    if (_hp) {
      console.log('[roi-report] honeypot triggered, silently dropping')
      return res.status(200).json({ success: true })
    }
    if (consent !== true) {
      return sendError(res, 400, ERROR_CODES.consentRequired)
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return sendError(res, 400, ERROR_CODES.invalidEmail)
    }

    const resolvedArea = areaLabel || area || '-'
    const sanArea = esc(resolvedArea)
    const sanPractice = esc(practice || '-')
    const rowsIn = `
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">${esc(c.tests)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(inputs.testsPerMonth ?? '-')}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">${esc(c.price)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${eur(inputs.pricePerTest)}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">${esc(c.material)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${eur(inputs.materialCostPerTest)}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">${esc(c.minutes)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(inputs.minutesPerTest ?? '-')}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">${esc(c.staff)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${eur(inputs.staffCostPerHour)}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">${esc(c.investment)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${inputs.deviceInvestment ? eur(inputs.deviceInvestment) : '-'}</td></tr>`
    const rowsOut = `
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">${esc(c.month)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${eur(outputs.dbPerMonth)}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">${esc(c.revenue)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${eur(outputs.revenuePerMonth)}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">${esc(c.year)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${eur(outputs.dbPerYear)}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">${esc(c.perTest)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${eur(outputs.dbPerTest)}</td></tr>
      ${outputs.payback != null ? `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">${esc(c.payback)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(outputs.payback)} ${esc(c.months)}</td></tr>` : ''}`

    let attachments
    try {
      const pdf = await buildRoiPdf({
        practice,
        area: resolvedArea,
        inputs,
        outputs,
        locale: mailLocale,
      })
      attachments = [
        {
          content: pdf.toString('base64'),
          filename: 'IglooPro-ROI-Report.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ]
    } catch (e) {
      console.error('[roi-report] PDF generation failed, sending without attachment:', e.message)
    }

    // 1) Lead → Team
    const leadMsg = {
      to: ROI_REPORT_RECIPIENTS,
      from: process.env.SENDER_EMAIL,
      replyTo: email,
      subject: `Neuer ROI-Report-Lead — ${area || '-'} (${email})`,
      text: `Neuer ROI-Rechner-Lead\n\nE-Mail: ${email}\nFachrichtung: ${area || '-'}\nPraxis: ${practice || '-'}\nQuelle: ${attribution.source || '-'}\nJourney: ${attribution.journey || '-'}\nBereichskontext: ${attribution.section || '-'}\n\nEingaben: ${JSON.stringify(inputs)}\nErgebnis: ${JSON.stringify(outputs)}`,
      html: `<h3>Neuer ROI-Report-Lead</h3>
        <p><strong>E-Mail:</strong> ${esc(email)}<br><strong>Fachrichtung:</strong> ${sanArea}<br><strong>Praxis:</strong> ${sanPractice}<br><strong>Quelle:</strong> ${esc(attribution.source || '-')}<br><strong>Journey:</strong> ${esc(attribution.journey || '-')}<br><strong>Bereichskontext:</strong> ${esc(attribution.section || '-')}</p>
        <h4>Eingaben</h4><table style="border-collapse:collapse;width:100%;max-width:520px;">${rowsIn}</table>
        <h4>Ergebnis</h4><table style="border-collapse:collapse;width:100%;max-width:520px;">${rowsOut}</table>`,
    }

    // 2) Report → Anfragender
    const reportMsg = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: c.subject,
      text: `${attachments ? c.introAttachment : c.introNoAttachment}\n\n${c.results}:\n${c.month}: ${eur(outputs.dbPerMonth)}\n${c.revenue}: ${eur(outputs.revenuePerMonth)}\n${c.year}: ${eur(outputs.dbPerYear)}\n${c.perTest}: ${eur(outputs.dbPerTest)}\n\n${c.cta}: https://polarisdx.net/${mailLocale}/contact\n\n${c.disclaimer}\n\nPolarisDX`,
      html: `<div lang="${mailLocale}" style="font-family:system-ui,sans-serif;max-width:600px;">
        <h2 style="color:#083358;">${esc(c.title)}</h2>
        <p>${esc(attachments ? c.introAttachment : c.introNoAttachment)}</p>
        <h3 style="color:#083358;">${esc(c.results)}</h3>
        <table style="border-collapse:collapse;width:100%;max-width:520px;">${rowsOut}</table>
        <p style="margin-top:18px;"><a href="https://polarisdx.net/${mailLocale}/contact" style="background:#0d9488;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;display:inline-block;">${esc(c.cta)}</a></p>
        <p style="color:#64748b;font-size:12px;margin-top:18px;">${esc(c.disclaimer)}</p>
      </div>`,
      ...(attachments ? { attachments } : {}),
    }

    await Promise.all([sgMail.send(leadMsg), sgMail.send(reportMsg)])
    console.log(`[roi-report] processed lead from ${email} (area=${area || '-'})`)
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error processing ROI report:', error)
    if (error.response) console.error(error.response.body)
    sendError(res, 500, ERROR_CODES.deliveryFailed)
  }
})

// Start Server
const PORT = process.env.PORT || 5000
// Listen on 0.0.0.0 to ensure Docker accessibility.
// Guard so importing this module for tests does not start a live server.
if (require.main === module) {
  app.listen(PORT, process.env.LISTEN_HOST || '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
  })
}

// Exported for unit/endpoint tests (esc is the core HTML-escape XSS control).
module.exports = { app, esc, ERROR_CODES, buildRoiPdf, resolveLeadAttribution }
