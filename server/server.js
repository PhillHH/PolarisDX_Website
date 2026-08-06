const express = require('express')
const sgMail = require('@sendgrid/mail')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const PDFDocument = require('pdfkit')
require('dotenv').config()

const app = express()

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
    allowedHeaders: ['Content-Type'],
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
  message: { success: false, error: 'Too many requests, please try later.' },
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

// API Endpoint
app.post('/api/contact', formLimiter, async (req, res) => {
  try {
    const { name, email, message, company, phone, area, requirements, consent, _hp } =
      req.body || {}

    // Honeypot — bots almost always fill it; drop silently without sending.
    if (_hp) {
      console.log('[contact] honeypot triggered, silently dropping')
      return res.status(200).json({ success: true })
    }

    // DSGVO: explicit consent is required
    if (consent !== true) {
      return res.status(400).json({ error: 'Consent required.' })
    }

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' })
    }

    // Cheap email shape check (server-side; UI also validates)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return res.status(400).json({ error: 'Invalid email.' })
    }

    // Route Vitamin D3+K2 Spray orders to dedicated address
    const SPRAY_ORDER_RECIPIENT = 'ulrikes@polarisdx.net'
    const isSprayOrder = area && area.includes('Vitamin D3+K2 Spray BESTELLUNG')
    const recipient = isSprayOrder ? SPRAY_ORDER_RECIPIENT : process.env.CONTACT_RECEIVER

    // Email content construction
    const msg = {
      to: recipient,
      from: process.env.SENDER_EMAIL, // Must be a verified sender in SendGrid
      replyTo: email,
      subject: `Neue Kontaktanfrage von ${name}`,
      text: `
        Neue Kontaktanfrage über das Webseiten-Formular:

        Name: ${name}
        Firma: ${company || '-'}
        Email: ${email}
        Telefon: ${phone || '-'}
        Bereich: ${area || '-'}

        Nachricht/Anforderungen:
        ${message || requirements || '-'}
      `,
      html: `
        <h3>Neue Kontaktanfrage</h3>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Firma:</strong> ${esc(company || '-')}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Telefon:</strong> ${esc(phone || '-')}</p>
        <p><strong>Bereich:</strong> ${esc(area || '-')}</p>
        <br>
        <p><strong>Nachricht/Anforderungen:</strong></p>
        <p>${esc(message || requirements || '-').replace(/\n/g, '<br>')}</p>
      `,
    }

    // Send email
    await sgMail.send(msg)
    console.log('Email sent successfully')

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    if (error.response) {
      console.error(error.response.body)
    }
    res.status(500).json({ success: false, error: 'Failed to send email' })
  }
})

// Support API Endpoint
app.post('/api/support', formLimiter, async (req, res) => {
  try {
    const {
      name,
      email,
      udi,
      swVersion,
      issueType,
      subject,
      description,
      attachment,
      consent,
      _hp,
    } = req.body || {}

    // Honeypot — bots almost always fill it; drop silently without sending.
    if (_hp) {
      console.log('[support] honeypot triggered, silently dropping')
      return res.status(200).json({ success: true })
    }

    // DSGVO: explicit consent is required
    if (consent !== true) {
      return res.status(400).json({ error: 'Consent required.' })
    }

    // Basic validation
    if (!name || !email || !udi || !swVersion || !issueType || !subject) {
      return res.status(400).json({ error: 'Required fields are missing.' })
    }

    // Cheap email shape check (server-side; UI also validates)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return res.status(400).json({ error: 'Invalid email.' })
    }

    const supportText = `
Neue Support-Anfrage über das Webseiten-Formular:

Name: ${name}
Email: ${email}
Igloo Reader UDI: ${udi}
SW-Version: ${swVersion}
Problemtyp: ${issueType}
Betreff: ${subject}

Beschreibung:
${description || '-'}
    `

    const supportHtml = `
<h3>Neue Support-Anfrage</h3>
<table style="border-collapse: collapse; width: 100%; max-width: 600px;">
  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 180px;">Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(name)}</td></tr>
  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(email)}</td></tr>
  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Igloo Reader UDI:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(udi)}</td></tr>
  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">SW-Version:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(swVersion)}</td></tr>
  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Problemtyp:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(issueType)}</td></tr>
  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Betreff:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(subject)}</td></tr>
</table>
<br>
<p><strong>Beschreibung:</strong></p>
<p>${esc(description || '-').replace(/\n/g, '<br>')}</p>
    `

    // Internal notification email to support team (High Priority)
    const msg = {
      to: [
        process.env.CONTACT_RECEIVER,
        'ulrikes@polarisdx.net',
        'adrianoz@polarisdx.net',
        'phillipr@polarisdx.net',
      ],
      from: process.env.SENDER_EMAIL,
      replyTo: email,
      subject: `[HIGH PRIORITY] Support-Anfrage: ${subject}`,
      text: supportText,
      html: supportHtml,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        Importance: 'high',
      },
    }

    // Add attachment if present — bounded by size + MIME allowlist before send.
    if (attachment) {
      const ALLOWED_ATTACHMENT_TYPES = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/gif',
        'text/plain',
      ]
      const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024 // 5 MB

      if (
        typeof attachment.content !== 'string' ||
        !attachment.content ||
        typeof attachment.filename !== 'string' ||
        !attachment.filename ||
        !ALLOWED_ATTACHMENT_TYPES.includes(attachment.type)
      ) {
        return res.status(400).json({ error: 'Invalid attachment.' })
      }

      // Estimate decoded size from base64 length (slight over-estimate; never under-counts).
      const decodedBytes = Math.floor((attachment.content.length * 3) / 4)
      if (decodedBytes > MAX_ATTACHMENT_BYTES) {
        return res.status(400).json({ error: 'Invalid attachment.' })
      }

      msg.attachments = [
        {
          content: attachment.content,
          filename: attachment.filename,
          type: attachment.type,
          disposition: 'attachment',
        },
      ]
    }

    // Confirmation email to the sender
    const confirmationMsg = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: `Ihre Support-Anfrage wurde empfangen: ${subject}`,
      text: `Hallo ${name},\n\nvielen Dank für Ihre Support-Anfrage. Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.\n\nIhre Angaben:\n- Igloo Reader UDI: ${udi}\n- SW-Version: ${swVersion}\n- Problemtyp: ${issueType}\n- Betreff: ${subject}\n\nMit freundlichen Grüßen,\nDas PolarisDX Support-Team\ncontact@polarisdx.net\n+49 151 75011699`,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #083358;">Ihre Support-Anfrage wurde empfangen</h2>
  <p>Hallo ${esc(name)},</p>
  <p>vielen Dank für Ihre Support-Anfrage. Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
  <h3 style="color: #083358; margin-top: 24px;">Ihre Angaben:</h3>
  <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
    <tr><td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-weight: bold;">Igloo Reader UDI:</td><td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${esc(udi)}</td></tr>
    <tr><td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-weight: bold;">SW-Version:</td><td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${esc(swVersion)}</td></tr>
    <tr><td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-weight: bold;">Problemtyp:</td><td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${esc(issueType)}</td></tr>
    <tr><td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-weight: bold;">Betreff:</td><td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${esc(subject)}</td></tr>
  </table>
  <p style="margin-top: 24px;">Mit freundlichen Grüßen,<br><strong>Das PolarisDX Support-Team</strong></p>
  <p style="color: #666; font-size: 13px;">contact@polarisdx.net | +49 151 75011699</p>
</div>
      `,
    }

    // Send both emails
    await Promise.all([sgMail.send(msg), sgMail.send(confirmationMsg)])
    console.log('Support emails sent successfully (team + confirmation)')

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error sending support email:', error)
    if (error.response) {
      console.error(error.response.body)
    }
    res.status(500).json({ success: false, error: 'Failed to send support email' })
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
      // GDPR / spam
      consent,
      _hp,
    } = req.body || {}

    // Honeypot — bots almost always fill all visible/hidden fields
    if (_hp) {
      console.log('[consumer-order] honeypot triggered, silently dropping')
      return res.status(200).json({ success: true })
    }

    // DSGVO: explicit consent is required
    if (consent !== true) {
      return res.status(400).json({ error: 'Consent required.' })
    }

    if (!product || !CONSUMER_PRODUCT_LABELS[product]) {
      return res.status(400).json({ error: 'Unknown product.' })
    }
    if (!name || !email || !quantity) {
      return res.status(400).json({ error: 'Required fields are missing.' })
    }
    // Cheap email shape check (server-side; UI also validates)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return res.status(400).json({ error: 'Invalid email.' })
    }

    const productLabel = CONSUMER_PRODUCT_LABELS[product]

    // Build a one-line address summary (only the parts the customer filled in)
    const addressLine = [street, [postcode, city].filter(Boolean).join(' '), country]
      .map((s) => (s || '').trim())
      .filter(Boolean)
      .join(', ')

    const orderText = `Neue Bestellanfrage über die Consumer-Landingpage

Produkt:     ${productLabel}
Stückzahl:   ${quantity}

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
  ${row('Stückzahl', esc(quantity))}

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
      subject: `Neue Bestellung — ${productLabel} (${quantity}x)`,
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
    res.status(500).json({ success: false, error: 'Failed to send order' })
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

const eur = (n) =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(+n) ? +n : 0)

function buildRoiPdf({ practice, area, inputs = {}, outputs = {} }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 })
      const chunks = []
      doc.on('data', (c) => chunks.push(c))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      doc.fillColor('#083358').fontSize(22).text('IglooPro — ROI-Report')
      doc.moveDown(0.3).fillColor('#0d9488').fontSize(11).text('Point-of-Care-Diagnostik · PolarisDX')
      doc.moveDown(1).fillColor('#334155').fontSize(11)
      if (practice) doc.text(`Praxis: ${practice}`)
      if (area) doc.text(`Fachrichtung: ${area}`)
      doc.moveDown(1)

      doc.fillColor('#083358').fontSize(14).text('Ihre Eingaben')
      doc.moveDown(0.3).fillColor('#334155').fontSize(11)
      doc.text(`• Tests pro Monat: ${inputs.testsPerMonth ?? '-'}`)
      doc.text(`• Preis pro Test: ${eur(inputs.pricePerTest)}`)
      doc.text(`• Materialkosten pro Test: ${eur(inputs.materialCostPerTest)}`)
      doc.text(`• Minuten pro Test: ${inputs.minutesPerTest ?? '-'}`)
      doc.text(`• Personalkosten pro Stunde: ${eur(inputs.staffCostPerHour)}`)
      if (inputs.deviceInvestment) doc.text(`• Geräteinvestition: ${eur(inputs.deviceInvestment)}`)
      doc.moveDown(1)

      doc.fillColor('#083358').fontSize(14).text('Ihr Ergebnis (Beispielrechnung)')
      doc.moveDown(0.3).fillColor('#334155').fontSize(11)
      doc.text(`• Deckungsbeitrag / Monat: ${eur(outputs.dbPerMonth)}`)
      doc.text(`• Selbstzahler-Umsatz / Monat: ${eur(outputs.revenuePerMonth)}`)
      doc.text(`• Deckungsbeitrag / Jahr: ${eur(outputs.dbPerYear)}`)
      doc.text(`• Deckungsbeitrag je Test: ${eur(outputs.dbPerTest)}`)
      if (outputs.payback != null) doc.text(`• Amortisation: ${outputs.payback} Monate`)
      doc.moveDown(1.2)

      doc
        .fillColor('#64748b')
        .fontSize(9)
        .text(
          'Unverbindliche Beispielrechnung auf Basis Ihrer Eingaben. Keine Zusage von Umsatz oder Gewinn — Ergebnisse hängen von Ihren individuellen Praxiswerten ab. IVDR/CE-konform · CV < 2 %.',
        )
      doc.end()
    } catch (e) {
      reject(e)
    }
  })
}

app.post('/api/roi-report', formLimiter, async (req, res) => {
  try {
    const { email, area, practice, consent, _hp, inputs = {}, outputs = {} } = req.body || {}

    if (_hp) {
      console.log('[roi-report] honeypot triggered, silently dropping')
      return res.status(200).json({ success: true })
    }
    if (consent !== true) {
      return res.status(400).json({ error: 'Consent required.' })
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return res.status(400).json({ error: 'Invalid email.' })
    }

    const sanArea = esc(area || '-')
    const sanPractice = esc(practice || '-')
    const rowsIn = `
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">Tests / Monat</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(inputs.testsPerMonth ?? '-')}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">Preis / Test</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${eur(inputs.pricePerTest)}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">Materialkosten / Test</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${eur(inputs.materialCostPerTest)}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">Minuten / Test</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(inputs.minutesPerTest ?? '-')}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">Personalkosten / Std.</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${eur(inputs.staffCostPerHour)}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">Geräteinvestition</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${inputs.deviceInvestment ? eur(inputs.deviceInvestment) : '-'}</td></tr>`
    const rowsOut = `
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">Deckungsbeitrag / Monat</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${eur(outputs.dbPerMonth)}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">Selbstzahler-Umsatz / Monat</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${eur(outputs.revenuePerMonth)}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">Deckungsbeitrag / Jahr</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${eur(outputs.dbPerYear)}</td></tr>
      <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">Deckungsbeitrag je Test</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${eur(outputs.dbPerTest)}</td></tr>
      ${outputs.payback != null ? `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:600;">Amortisation</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(outputs.payback)} Monate</td></tr>` : ''}`

    let attachments
    try {
      const pdf = await buildRoiPdf({ practice, area, inputs, outputs })
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
      text: `Neuer ROI-Rechner-Lead\n\nE-Mail: ${email}\nFachrichtung: ${area || '-'}\nPraxis: ${practice || '-'}\n\nEingaben: ${JSON.stringify(inputs)}\nErgebnis: ${JSON.stringify(outputs)}`,
      html: `<h3>Neuer ROI-Report-Lead</h3>
        <p><strong>E-Mail:</strong> ${esc(email)}<br><strong>Fachrichtung:</strong> ${sanArea}<br><strong>Praxis:</strong> ${sanPractice}</p>
        <h4>Eingaben</h4><table style="border-collapse:collapse;width:100%;max-width:520px;">${rowsIn}</table>
        <h4>Ergebnis</h4><table style="border-collapse:collapse;width:100%;max-width:520px;">${rowsOut}</table>`,
    }

    // 2) Report → Anfragender
    const reportMsg = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: 'Ihr IglooPro ROI-Report',
      text: `Vielen Dank für Ihr Interesse an IglooPro.\n\nIm Anhang finden Sie Ihren persönlichen ROI-Report (unverbindliche Beispielrechnung auf Basis Ihrer Eingaben).\n\nGerne besprechen wir die Zahlen für Ihre Praxis: https://polarisdx.net/contact\n\nMit freundlichen Grüßen\nPolarisDX`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:600px;">
        <h2 style="color:#083358;">Ihr IglooPro ROI-Report</h2>
        <p>vielen Dank für Ihr Interesse. Auf Basis Ihrer Eingaben haben wir Ihre persönliche Beispielrechnung erstellt${attachments ? ' (auch als PDF im Anhang)' : ''}:</p>
        <h3 style="color:#083358;">Ergebnis</h3>
        <table style="border-collapse:collapse;width:100%;max-width:520px;">${rowsOut}</table>
        <p style="margin-top:18px;"><a href="https://polarisdx.net/contact" style="background:#0d9488;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;display:inline-block;">Beratung buchen</a></p>
        <p style="color:#64748b;font-size:12px;margin-top:18px;">Unverbindliche Beispielrechnung auf Basis Ihrer Eingaben. Keine Zusage von Umsatz oder Gewinn.</p>
      </div>`,
      ...(attachments ? { attachments } : {}),
    }

    await Promise.all([sgMail.send(leadMsg), sgMail.send(reportMsg)])
    console.log(`[roi-report] processed lead from ${email} (area=${area || '-'})`)
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error processing ROI report:', error)
    if (error.response) console.error(error.response.body)
    res.status(500).json({ success: false, error: 'Failed to process ROI report' })
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
module.exports = { app, esc }
