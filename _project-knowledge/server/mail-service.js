const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10mb' }));

// Validation of required environment variables
const requiredEnvVars = ['SENDGRID_API_KEY', 'CONTACT_RECEIVER', 'SENDER_EMAIL'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.warn(`WARNING: Missing environment variables for email service: ${missingEnvVars.join(', ')}`);
}

// Set SendGrid API Key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// API Endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const {
      name,
      email,
      message,
      company,
      phone,
      area,
      requirements
    } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    // Route Vitamin D3+K2 Spray orders to dedicated address
    const SPRAY_ORDER_RECIPIENT = 'ulrikes@polarisdx.net';
    const isSprayOrder = area && area.includes('Vitamin D3+K2 Spray BESTELLUNG');
    const recipient = isSprayOrder ? SPRAY_ORDER_RECIPIENT : process.env.CONTACT_RECEIVER;

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
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Firma:</strong> ${company || '-'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || '-'}</p>
        <p><strong>Bereich:</strong> ${area || '-'}</p>
        <br>
        <p><strong>Nachricht/Anforderungen:</strong></p>
        <p>${(message || requirements || '-').replace(/\n/g, '<br>')}</p>
      `
    };

    // Send email
    await sgMail.send(msg);
    console.log('Email sent successfully');

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

// Support API Endpoint
app.post('/api/support', async (req, res) => {
  try {
    const {
      name,
      email,
      udi,
      swVersion,
      issueType,
      subject,
      description,
      attachment
    } = req.body;

    // Basic validation
    if (!name || !email || !udi || !swVersion || !issueType || !subject) {
      return res.status(400).json({ error: 'Required fields are missing.' });
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
    `;

    const supportHtml = `
<h3>Neue Support-Anfrage</h3>
<table style="border-collapse: collapse; width: 100%; max-width: 600px;">
  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 180px;">Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Igloo Reader UDI:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${udi}</td></tr>
  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">SW-Version:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${swVersion}</td></tr>
  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Problemtyp:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${issueType}</td></tr>
  <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Betreff:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${subject}</td></tr>
</table>
<br>
<p><strong>Beschreibung:</strong></p>
<p>${(description || '-').replace(/\n/g, '<br>')}</p>
    `;

    // Internal notification email to support team (High Priority)
    const msg = {
      to: [
        process.env.CONTACT_RECEIVER,
        'ulrikes@polarisdx.net',
        'adrianoz@polarisdx.net',
        'phillipr@polarisdx.net'
      ],
      from: process.env.SENDER_EMAIL,
      replyTo: email,
      subject: `[HIGH PRIORITY] Support-Anfrage: ${subject}`,
      text: supportText,
      html: supportHtml,
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    // Add attachment if present
    if (attachment && attachment.content && attachment.filename) {
      msg.attachments = [{
        content: attachment.content,
        filename: attachment.filename,
        type: attachment.type || 'application/octet-stream',
        disposition: 'attachment'
      }];
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
  <p>Hallo ${name},</p>
  <p>vielen Dank für Ihre Support-Anfrage. Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
  <h3 style="color: #083358; margin-top: 24px;">Ihre Angaben:</h3>
  <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
    <tr><td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-weight: bold;">Igloo Reader UDI:</td><td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${udi}</td></tr>
    <tr><td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-weight: bold;">SW-Version:</td><td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${swVersion}</td></tr>
    <tr><td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-weight: bold;">Problemtyp:</td><td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${issueType}</td></tr>
    <tr><td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-weight: bold;">Betreff:</td><td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${subject}</td></tr>
  </table>
  <p style="margin-top: 24px;">Mit freundlichen Grüßen,<br><strong>Das PolarisDX Support-Team</strong></p>
  <p style="color: #666; font-size: 13px;">contact@polarisdx.net | +49 151 75011699</p>
</div>
      `
    };

    // Send both emails
    await Promise.all([
      sgMail.send(msg),
      sgMail.send(confirmationMsg)
    ]);
    console.log('Support emails sent successfully (team + confirmation)');

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error sending support email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    res.status(500).json({ success: false, error: 'Failed to send support email' });
  }
});

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
    const { message } = req.body;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock Response Logic
    let reply = "Vielen Dank für Ihre Nachricht. Ein Mitarbeiter wird sich in Kürze bei Ihnen melden.";

    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('hallo') || lowerMsg.includes('hi')) {
      reply = "Hallo! Wie kann ich Ihnen heute helfen?";
    } else if (lowerMsg.includes('preis') || lowerMsg.includes('kosten')) {
      reply = "Für Preisanfragen wenden Sie sich bitte direkt an unseren Vertrieb oder nutzen Sie das Kontaktformular.";
    } else if (lowerMsg.includes('termin')) {
      reply = "Gerne! Sie können einen Termin direkt über unsere Kontaktseite buchen.";
    }

    // TODO: Connect to MS Teams Webhook or OpenAI API here
    // Example (Pseudo-code):
    // const aiResponse = await openai.createCompletion({ ... });
    // reply = aiResponse.choices[0].text;

    res.status(200).json({ reply });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Chat service error' });
  }
});

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
const PORT = process.env.PORT || 5000;
// Listen on 0.0.0.0 to ensure Docker accessibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
