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
app.use(express.json());

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

    // Email content construction
    const msg = {
      to: process.env.CONTACT_RECEIVER,
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

// Start Server
const PORT = process.env.PORT || 5000;
// Listen on 0.0.0.0 to ensure Docker accessibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
