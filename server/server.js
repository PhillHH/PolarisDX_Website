const express = require('express')
const sgMail = require('@sendgrid/mail')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
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
    // Herkunft der Anfrage.
    //
    // Bis hierher lautete der Betreff fuer JEDE Anfrage gleich: "Neue
    // Kontaktanfrage von <Name>". Eine Anfrage aus dem Partnerprogramm war im
    // Posteingang erst nach dem Oeffnen von einer IglooPro-Anfrage zu
    // unterscheiden, und die Herkunft stand ganz unten im Fliesstext.
    //
    // Das Formular haengt sie als letzte Zeile an die Nachricht an (siehe
    // useContactForm.ts): ein eigenes verstecktes Feld, das den Freitext
    // ueberlebt, auch wenn der Absender ihn ueberschreibt, und das das Panel
    // mittraegt. Hier wird sie wieder herausgeloest und nach OBEN gestellt.
    // `area` dient nur als Rueckfallebene — es kann seit dem leeren
    // Voreintrag der Auswahl auch leer sein.
    //
    // Interne Mail, rein deutsch — keine Uebersetzung noetig.
    const treffer = /\n\nHerkunft: (.+)$/s.exec(message || '')
    const herkunft = treffer
      ? treffer[1].trim()
      : area && area.startsWith('Epigenetik')
        ? 'Epigenetik-Strecke'
        : 'Website-Formular'
    const nachricht =
      (treffer ? (message || '').slice(0, treffer.index) : message) || requirements || '-'
    const isEpigenetik =
      herkunft.startsWith('Epigenetik') || Boolean(area && area.startsWith('Epigenetik'))
    const subject = isEpigenetik
      ? `[Epigenetik] Neue Anfrage von ${name}`
      : `Neue Kontaktanfrage von ${name}`

    const msg = {
      to: recipient,
      from: process.env.SENDER_EMAIL, // Must be a verified sender in SendGrid
      replyTo: email,
      subject,
      text: `
        Neue Kontaktanfrage über das Webseiten-Formular:

        Herkunft: ${herkunft}
        Bereich: ${area || '-'}

        Name: ${name}
        Firma: ${company || '-'}
        Email: ${email}
        Telefon: ${phone || '-'}

        Nachricht/Anforderungen:
        ${nachricht}
      `,
      html: `
        <h3>${esc(subject)}</h3>
        <p><strong>Herkunft:</strong> ${esc(herkunft)}</p>
        <p><strong>Bereich:</strong> ${esc(area || '-')}</p>
        <br>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Firma:</strong> ${esc(company || '-')}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Telefon:</strong> ${esc(phone || '-')}</p>
        <br>
        <p><strong>Nachricht/Anforderungen:</strong></p>
        <p>${esc(nachricht).replace(/\n/g, '<br>')}</p>
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

// =============================================================================
// EVENT REGISTRATION ENDPOINT
// =============================================================================
// Anmeldungen zu Veranstaltungen — aktuell das Future Forum Berlin (02.10.2026).
//
// - Empfaenger stehen fest im Backend (kein `to` aus dem Request). Ueber
//   EVENT_REGISTRATION_RECIPIENTS (kommagetrennt) uebersteuerbar, damit sich
//   der Endpunkt gegen ein eigenes Postfach testen laesst, ohne das Team zu
//   belaestigen.
// - DSGVO: explizite Einwilligung im Body, sonst 400.
// - Spam: Honeypot `_hp` (200 ohne Versand) + derselbe Limiter wie Kontakt.
// - Die Veranstaltung kommt als Slug; unbekannte Slugs werden abgewiesen,
//   damit niemand ueber das Formular beliebige Betreffzeilen erzeugen kann.
// - Der Teilnehmer bekommt eine Eingangsbestaetigung. Den Platz bestaetigt
//   das Team persoenlich — die Kapazitaet im NIO House ist begrenzt.
// =============================================================================

const EVENT_REGISTRATION_RECIPIENTS = (
  process.env.EVENT_REGISTRATION_RECIPIENTS || 'ulrikes@polarisdx.net,adrianoz@polarisdx.net'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const EVENTS = {
  'future-forum-berlin-2026': {
    title: 'Future Forum Berlin – The Future Patient',
    subtitle: 'Diagnostics × AI × Implantology',
    date: 'Freitag, 2. Oktober 2026',
    time: '16:30 Uhr · Fachprogramm bis 20:00 Uhr, anschließend After Hours',
    venue: 'NIO House Berlin',
    address: 'Kurfürstendamm 11, 10719 Berlin',
    url: 'https://polarisdx.net/de/events/future-forum-berlin-2026',
    tag: 'Future Forum Berlin',
  },
}

const ATTENDANCE_LABELS = {
  full: 'Fachprogramm + After Hours',
  programme: 'Nur Fachprogramm (16:30 – 20:00 Uhr)',
}

const MAX_EVENT_PERSONS = 5

/**
 * Prueft den Request-Body einer Anmeldung. Liefert genau eines von:
 *   { honeypot: true }             — Bot, still verwerfen (200)
 *   { error: { status, message } } — abweisen
 *   { data }                       — bereinigte Anmeldung
 * Reine Funktion: testbar ohne Express und ohne SendGrid.
 */
function parseEventRegistration(body) {
  const b = body || {}
  if (b._hp) return { honeypot: true }
  if (b.consent !== true) return { error: { status: 400, message: 'Consent required.' } }

  const event = typeof b.event === 'string' ? EVENTS[b.event] : undefined
  if (!event) return { error: { status: 400, message: 'Unknown event.' } }

  const name = String(b.name ?? '').trim()
  const email = String(b.email ?? '').trim()
  if (name.length < 2 || !email) {
    return { error: { status: 400, message: 'Name and email are required.' } }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: { status: 400, message: 'Invalid email.' } }
  }

  const attendanceLabel =
    typeof b.attendance === 'string' ? ATTENDANCE_LABELS[b.attendance] : undefined
  if (!attendanceLabel) return { error: { status: 400, message: 'Invalid attendance option.' } }

  const persons = Number.parseInt(b.persons, 10)
  if (!Number.isInteger(persons) || persons < 1 || persons > MAX_EVENT_PERSONS) {
    return { error: { status: 400, message: 'Invalid number of persons.' } }
  }

  const clip = (v, max) =>
    String(v ?? '')
      .trim()
      .slice(0, max)

  return {
    data: {
      eventSlug: b.event,
      event,
      name: clip(name, 200),
      email: clip(email, 200),
      company: clip(b.company, 200),
      phone: clip(b.phone, 60),
      attendance: b.attendance,
      attendanceLabel,
      persons,
      cme: b.cme === true,
      message: clip(b.message, 4000),
    },
  }
}

app.post('/api/event-registration', formLimiter, async (req, res) => {
  try {
    const parsed = parseEventRegistration(req.body)

    if (parsed.honeypot) {
      console.log('[event-registration] honeypot triggered, silently dropping')
      return res.status(200).json({ success: true })
    }
    if (parsed.error) {
      return res.status(parsed.error.status).json({ error: parsed.error.message })
    }

    const d = parsed.data
    const ev = d.event
    const ja = (v) => (v ? 'ja' : 'nein')

    // ---- Interne Benachrichtigung an das Team --------------------------------
    const teamSubject = `[${ev.tag}] Neue Anmeldung: ${d.name} (${d.persons} Pers.)`

    const teamText = `Neue Anmeldung über die Website

Veranstaltung: ${ev.title}
Datum:         ${ev.date}, ${ev.time}
Ort:           ${ev.venue}, ${ev.address}

— Teilnehmer —
Name:          ${d.name}
Praxis/Firma:  ${d.company || '-'}
E-Mail:        ${d.email}
Telefon:       ${d.phone || '-'}

— Anmeldung —
Teilnahme:     ${d.attendanceLabel}
Personen:      ${d.persons}
Fortbildungspunkte gewünscht: ${ja(d.cme)}

— Nachricht —
${d.message || '-'}

— Hinweis: Der Teilnehmer hat der Datenverarbeitung zur Bearbeitung der
Anmeldung ausdrücklich zugestimmt (DSGVO Art. 6 Abs. 1 lit. b).
Der Teilnehmer hat eine automatische Eingangsbestätigung erhalten;
die Platzbestätigung erfolgt persönlich.
`

    const tr = (label, value) => `
  <tr>
    <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-weight:600;width:200px;color:#083358;font-family:system-ui,sans-serif;">${esc(label)}</td>
    <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;color:#334155;font-family:system-ui,sans-serif;">${value}</td>
  </tr>`
    const trSection = (label) => `
  <tr>
    <td colspan="2" style="padding:14px 10px 6px;font-size:12px;font-weight:700;color:#0d9488;text-transform:uppercase;letter-spacing:1px;font-family:system-ui,sans-serif;">${esc(label)}</td>
  </tr>`

    const teamHtml = `
<h2 style="margin:0 0 4px;font-family:system-ui,sans-serif;color:#083358;">Neue Anmeldung</h2>
<p style="margin:0 0 16px;font-family:system-ui,sans-serif;color:#475569;">${esc(ev.title)}</p>
<table style="border-collapse:collapse;width:100%;max-width:680px;">
  ${trSection('Veranstaltung')}
  ${tr('Datum', esc(`${ev.date}, ${ev.time}`))}
  ${tr('Ort', esc(`${ev.venue}, ${ev.address}`))}

  ${trSection('Teilnehmer')}
  ${tr('Name', esc(d.name))}
  ${tr('Praxis / Firma', esc(d.company || '-'))}
  ${tr('E-Mail', `<a href="mailto:${esc(d.email)}">${esc(d.email)}</a>`)}
  ${tr('Telefon', esc(d.phone || '-'))}

  ${trSection('Anmeldung')}
  ${tr('Teilnahme', esc(d.attendanceLabel))}
  ${tr('Personen', esc(String(d.persons)))}
  ${tr('Fortbildungspunkte gewünscht', esc(ja(d.cme)))}
</table>
${
  d.message
    ? `<p style="margin:18px 0 6px;font-family:system-ui,sans-serif;font-weight:600;color:#083358;">Nachricht</p>
       <p style="margin:0;font-family:system-ui,sans-serif;color:#334155;white-space:pre-line;">${esc(d.message)}</p>`
    : ''
}
<p style="margin:24px 0 0;font-family:system-ui,sans-serif;font-size:12px;color:#64748b;">
  Der Teilnehmer hat der Datenverarbeitung zur Bearbeitung der Anmeldung ausdrücklich zugestimmt
  (DSGVO Art. 6 Abs. 1 lit. b) und eine automatische Eingangsbestätigung erhalten.
  Die Platzbestätigung erfolgt persönlich.
</p>
`

    const teamMsg = {
      to: EVENT_REGISTRATION_RECIPIENTS,
      from: process.env.SENDER_EMAIL,
      replyTo: d.email,
      subject: teamSubject,
      text: teamText,
      html: teamHtml,
    }

    // ---- Eingangsbestaetigung an den Teilnehmer ------------------------------
    const confirmSubject = `Ihre Anmeldung: ${ev.title} (${ev.date})`

    const confirmText = `Hallo ${d.name},

vielen Dank für Ihre Anmeldung zum ${ev.title}.
Wir haben Ihre Anmeldung erhalten und bestätigen Ihren Platz in Kürze persönlich per E-Mail.

Ihre Angaben:
- Teilnahme: ${d.attendanceLabel}
- Personen: ${d.persons}
- Fortbildungspunkte gewünscht: ${ja(d.cme)}

Veranstaltung:
- ${ev.title} · ${ev.subtitle}
- ${ev.date}, ${ev.time}
- ${ev.venue}, ${ev.address}
- ${ev.url}

Fortbildungspunkte: Registrierung bei der KZV Berlin vorgesehen; die finale Punktzahl wird bestätigt.

Fragen zur Anmeldung: contact@polarisdx.net · +49 151 75011699

Mit freundlichen Grüßen
Ihr PolarisDX-Team

—
Thank you for registering for ${ev.title}. We have received your registration and will confirm your seat personally by e-mail shortly.
`

    const confirmHtml = `
<div style="font-family:Arial,system-ui,sans-serif;max-width:600px;margin:0 auto;color:#334155;">
  <h2 style="color:#083358;margin:0 0 12px;">Ihre Anmeldung ist eingegangen</h2>
  <p>Hallo ${esc(d.name)},</p>
  <p>vielen Dank für Ihre Anmeldung zum <strong>${esc(ev.title)}</strong>.
     Wir haben Ihre Anmeldung erhalten und bestätigen Ihren Platz in Kürze persönlich per E-Mail.</p>

  <h3 style="color:#083358;margin:24px 0 8px;">Ihre Angaben</h3>
  <table style="border-collapse:collapse;width:100%;max-width:520px;">
    <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:bold;width:200px;">Teilnahme</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(d.attendanceLabel)}</td></tr>
    <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:bold;">Personen</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(String(d.persons))}</td></tr>
    <tr><td style="padding:6px 8px;border-bottom:1px solid #eee;font-weight:bold;">Fortbildungspunkte gewünscht</td><td style="padding:6px 8px;border-bottom:1px solid #eee;">${esc(ja(d.cme))}</td></tr>
  </table>

  <h3 style="color:#083358;margin:24px 0 8px;">Veranstaltung</h3>
  <p style="margin:0 0 4px;"><strong>${esc(ev.title)}</strong> · ${esc(ev.subtitle)}</p>
  <p style="margin:0 0 4px;">${esc(ev.date)}, ${esc(ev.time)}</p>
  <p style="margin:0 0 4px;">${esc(ev.venue)}, ${esc(ev.address)}</p>
  <p style="margin:0 0 16px;"><a href="${esc(ev.url)}" style="color:#0d527f;">${esc(ev.url)}</a></p>

  <p style="font-size:13px;color:#64748b;">Fortbildungspunkte: Registrierung bei der KZV Berlin vorgesehen; die finale Punktzahl wird bestätigt.</p>

  <p style="margin-top:24px;">Fragen zur Anmeldung: <a href="mailto:contact@polarisdx.net" style="color:#0d527f;">contact@polarisdx.net</a> · +49 151 75011699</p>
  <p>Mit freundlichen Grüßen<br><strong>Ihr PolarisDX-Team</strong></p>

  <p style="margin-top:24px;font-size:12px;color:#94a3b8;border-top:1px solid #eee;padding-top:12px;">
    Thank you for registering for ${esc(ev.title)}. We have received your registration and will confirm your seat personally by e-mail shortly.
  </p>
</div>
`

    const confirmMsg = {
      to: d.email,
      from: process.env.SENDER_EMAIL,
      subject: confirmSubject,
      text: confirmText,
      html: confirmHtml,
    }

    await Promise.all([sgMail.send(teamMsg), sgMail.send(confirmMsg)])
    console.log(
      `[event-registration] sent: event=${d.eventSlug} persons=${d.persons} attendance=${d.attendance} to=${EVENT_REGISTRATION_RECIPIENTS.join(',')}`,
    )
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error sending event registration:', error)
    if (error.response) {
      console.error(error.response.body)
    }
    res.status(500).json({ success: false, error: 'Failed to send registration' })
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
// Listen on 0.0.0.0 to ensure Docker accessibility.
// Guard so importing this module for tests does not start a live server.
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
  })
}

// Exported for unit/endpoint tests (esc is the core HTML-escape XSS control).
module.exports = { app, esc, parseEventRegistration }
