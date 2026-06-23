const express = require('express')
const sgMail = require('@sendgrid/mail')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const app = express()

// Behind one proxy hop (SSR server / nginx) so req.ip reflects the client.
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
    <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-weight:600;width:180px;color:#0a2f55;font-family:system-ui,sans-serif;">${esc(label)}</td>
    <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;color:#334155;font-family:system-ui,sans-serif;">${value}</td>
  </tr>`
    const sectionRow = (label) => `
  <tr>
    <td colspan="2" style="padding:14px 10px 6px;font-size:12px;font-weight:700;color:#0d9488;text-transform:uppercase;letter-spacing:1px;font-family:system-ui,sans-serif;">${esc(label)}</td>
  </tr>`

    const orderHtml = `
<h2 style="margin:0 0 12px;font-family:system-ui,sans-serif;color:#0a2f55;">
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
    ? `<p style="margin:18px 0 6px;font-family:system-ui,sans-serif;font-weight:600;color:#0a2f55;">Nachricht / Kontext</p>
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

// Start Server
const PORT = process.env.PORT || 5000
// Listen on 0.0.0.0 to ensure Docker accessibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
