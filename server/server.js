const express = require('express');
const nodemailer = require('nodemailer');
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
const requiredEnvVars = ['M365_EMAIL_USER', 'M365_PASSWORD', 'CONTACT_RECEIVER'];
const missingEnvVars = requiredEnvVars.filter(key => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.warn(`WARNING: Missing environment variables for email service: ${missingEnvVars.join(', ')}`);
}

// Nodemailer Transporter Configuration for M365
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.M365_EMAIL_USER,
    pass: process.env.M365_PASSWORD
  },
  tls: {
    ciphers: 'SSLv3'
  }
});

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
    const mailOptions = {
      from: process.env.M365_EMAIL_USER, // Must be the authenticated user
      to: process.env.CONTACT_RECEIVER,
      replyTo: email, // Reply to the form submitter
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
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.messageId);

    res.status(200).json({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
