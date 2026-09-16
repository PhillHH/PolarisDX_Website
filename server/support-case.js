const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')

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
const { resolveMailLocale, getMailCopy } = require('./system-i18n')

/**
 * `support` — Support-Anfrage (Igloo Reader) als eigene persistente Journey.
 *
 * REIHENFOLGE (Persistenz vor jedem externen Handoff):
 *
 *   validieren (inkl. Attachment-Gates) → Processing-Consent pruefen
 *   → Attachments auf Disk schreiben (opaque IDs, nicht oeffentlich)
 *   → PERSISTIEREN (Lead + Outbox) → CRM-Handoff (Team- + Bestaetigungsmail)
 *
 * - Persistenz, Idempotency, Outbox, Retry und CRM-Routing sind die
 *   geteilten lead-foundation-Primitive; diese Datei ist EIN Journey-Slice.
 * - Attachments: serverseitige Allowlist, MIME/Extension-Konsistenz,
 *   Magic-Byte-Check fuer Binaerformate, Count-/Per-File-/Total-Limits,
 *   Originalname nur Display-Metadatum, Storage-ID generiert, kein
 *   User-Filename als Pfad, keine Traversal-Sequenzen. Der Storage liegt
 *   ausserhalb aller statischen Auslieferung — nicht oeffentlich ausfuehrbar.
 * - Kein Malware-Scanner/Quarantine-Primitiv im Fundament vorhanden
 *   (geprueft PT20.3): enge Allowlist + Magic-Bytes statt Plattform-Neubau;
 *   Hardening-Erweiterung (z. B. ClamAV) ist AP22/ spaeterer Owner.
 * - Retention: Metadaten (deleteAfter) liegen am Case; der globale
 *   Delete-Job ist bewusst AP22 — nicht als operational complete behauptet.
 * - Ohne konfigurierten Provider sagt der Status ehrlich
 *   NO_PROVIDER_CONFIGURED — kein Fake-SENT.
 */

const JOURNEY = 'support'
const CONSENT_VERSION = 'support-2026-09'
const SUPPORTED_LOCALES = new Set(['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'])
const ISSUE_TYPES = new Set([
  'hardware',
  'software',
  'connectivity',
  'test_kit',
  'calibration',
  'other',
])
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Team-Verteiler fuer Support (wie bisher im Endpoint hart hinterlegt).
const SUPPORT_TEAM_RECIPIENTS = [
  'ulrikes@polarisdx.net',
  'adrianoz@polarisdx.net',
  'phillipr@polarisdx.net',
]

// Attachment-Politik — serverseitig authoritativ, Client-`accept` nur UX.
const ALLOWED_ATTACHMENT_TYPES = Object.freeze([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/gif',
  'text/plain',
])
const EXTENSIONS_BY_MIME = Object.freeze({
  'application/pdf': ['pdf'],
  'image/png': ['png'],
  'image/jpeg': ['jpg', 'jpeg'],
  'image/gif': ['gif'],
  'text/plain': ['txt', 'log'],
})
const MAX_ATTACHMENTS = 3
const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5 MB je Datei
const MAX_TOTAL_BYTES = 10 * 1024 * 1024 // 10 MB gesamt
const RETENTION_DAYS = 90

// Magic-Byte-Signaturen fuer die Binaerformate. text/plain hat kein
// verlaessliches Magic — dort traegt die Extension-Regel allein.
const MAGIC_SIGNATURES = [
  {
    mime: 'image/png',
    match: (b) => b.length >= 4 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  {
    mime: 'image/jpeg',
    match: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    mime: 'image/gif',
    match: (b) =>
      b.length >= 6 && ['GIF87a', 'GIF89a'].includes(b.subarray(0, 6).toString('latin1')),
  },
  {
    mime: 'application/pdf',
    match: (b) => b.length >= 5 && b.subarray(0, 5).toString('latin1') === '%PDF-',
  },
]

class SupportValidationError extends Error {
  constructor(code, fields = []) {
    super(code)
    this.name = 'SupportValidationError'
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

function optionalEnum(value, values) {
  const normalized = text(value, 128)
  return normalized && values.has(normalized) ? normalized : ''
}

/**
 * Originalname ist NUR ein Display-Metadatum. Traversal-Sequenzen und
 * Pfadbestandteile werden hart abgelehnt — niemals wird ein User-Filename
 * als Dateisystempfad verwendet (Storage-IDs werden generiert).
 */
function sanitizeOriginalName(value) {
  const name = text(value, 120)
  if (!name) throw new SupportValidationError('ATTACHMENT_FILENAME', ['attachments'])
  if (
    name.includes('..') ||
    name.includes('/') ||
    name.includes('\\') ||
    name.includes('\0') ||
    /^\.+$/.test(name.trim())
  ) {
    throw new SupportValidationError('ATTACHMENT_TRAVERSAL', ['attachments'])
  }
  return name
}

function extensionOf(filename) {
  const dot = filename.lastIndexOf('.')
  return dot > 0 ? filename.slice(dot + 1).toLowerCase() : ''
}

function decodeBase64(content) {
  const cleaned = String(content).replace(/\s+/g, '')
  if (!cleaned || !/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned) || cleaned.length % 4 !== 0) {
    throw new SupportValidationError('ATTACHMENT_INVALID', ['attachments'])
  }
  return Buffer.from(cleaned, 'base64')
}

/**
 * Ein einzelnes Attachment durch alle Sicherheitsgates:
 * Shape → MIME-Allowlist → Extension↔MIME-Konsistenz (spoofed MIME faellt
 * hier in beide Richtungen auf die Nase) → Filename/Traversal → Groesse
 * (reale Bytezahl nach Dekodierung, nicht nur Base64-Laenge) → Magic Bytes.
 */
function validateAttachment(raw, index, idempotencyKey = '') {
  if (!raw || typeof raw !== 'object') {
    throw new SupportValidationError('ATTACHMENT_INVALID', ['attachments'])
  }
  const originalName = sanitizeOriginalName(raw.filename)
  const mime = text(raw.type, 128)
  if (!ALLOWED_ATTACHMENT_TYPES.includes(mime)) {
    throw new SupportValidationError('ATTACHMENT_TYPE', ['attachments'])
  }
  const allowedExtensions = EXTENSIONS_BY_MIME[mime] || []
  const extension = extensionOf(originalName)
  if (!allowedExtensions.includes(extension)) {
    // Erweiterung passt nicht zur behaupteten MIME — klassischer Spoofing-Fall.
    throw new SupportValidationError('ATTACHMENT_TYPE', ['attachments'])
  }
  const buffer = decodeBase64(raw.content)
  if (buffer.length === 0) {
    throw new SupportValidationError('ATTACHMENT_INVALID', ['attachments'])
  }
  if (buffer.length > MAX_FILE_BYTES) {
    throw new SupportValidationError('ATTACHMENT_SIZE', ['attachments'])
  }
  const signature = MAGIC_SIGNATURES.find((entry) => entry.mime === mime)
  if (signature && !signature.match(buffer)) {
    throw new SupportValidationError('ATTACHMENT_SPOOFED', ['attachments'])
  }
  // AP26 PT26.3 — der Inhalt gehoert zur Identitaet. Vorher bestimmten nur Key,
  // Index und Name Speicherort und Request-Hash: derselbe Key mit gleich
  // benannter, gleich grosser, aber ANDERER Datei galt als Replay und
  // ueberschrieb die gespeicherte Datei des Originalvorgangs.
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex')
  return {
    originalName,
    mime,
    extension,
    size: buffer.length,
    sha256,
    buffer,
    storageId: `${crypto.createHash('sha256').update(`support-file:${idempotencyKey}:${index}:${originalName}:${sha256}`).digest('hex').slice(0, 32)}.${extension}`,
  }
}

/**
 * Attachments normalisieren: `attachments` (Array) primaer, das bisherige
 * singulaere `attachment` wird als Ein-Element-Array akzeptiert.
 */
function normalizeAttachments(body = {}, idempotencyKey = '') {
  const rawList = Array.isArray(body.attachments)
    ? body.attachments
    : body.attachment
      ? [body.attachment]
      : []
  if (rawList.length === 0) return []
  if (rawList.length > MAX_ATTACHMENTS) {
    throw new SupportValidationError('ATTACHMENT_COUNT', ['attachments'])
  }
  const attachments = rawList.map((raw, index) => validateAttachment(raw, index, idempotencyKey))
  const totalBytes = attachments.reduce((sum, item) => sum + item.size, 0)
  if (totalBytes > MAX_TOTAL_BYTES) {
    throw new SupportValidationError('ATTACHMENT_TOTAL_SIZE', ['attachments'])
  }
  return attachments
}

function normalizeRequest(body = {}) {
  const name = text(body.name, 160)
  const email = text(body.email, 254).toLowerCase()
  const udi = text(body.udi, 64)
  const swVersion = text(body.swVersion, 64)
  const issueType = optionalEnum(body.issueType, ISSUE_TYPES)
  const issueTypeLabel = text(body.issueTypeLabel, 160)
  const subject = text(body.subject, 240)
  const description = text(body.description, 4000)
  const locale = optionalEnum(body.locale, SUPPORTED_LOCALES) || 'de'

  const invalid = []
  if (name.length < 2) invalid.push('name')
  if (!EMAIL_RE.test(email)) invalid.push('email')
  if (!udi) invalid.push('udi')
  if (!swVersion) invalid.push('swVersion')
  if (!issueType) invalid.push('issueType')
  if (!subject) invalid.push('subject')
  if (invalid.length) throw new SupportValidationError('VALIDATION_FAILED', invalid)

  return {
    subject: { name, email, udi, swVersion, issueType, issueTypeLabel, subject, description },
    locale,
  }
}

/**
 * Consent GETRENNT: ohne Verarbeitungs-Einwilligung laeuft gar nichts;
 * Marketing ist fuer Support nicht Teil des Flows und bleibt DENIED.
 */
function normalizeConsentEvidence(body = {}) {
  if (body.processingConsent !== true && body.consent !== true) {
    throw new SupportValidationError('PROCESSING_CONSENT_REQUIRED', ['processingConsent'])
  }
  const acceptedAt = text(body.consentAcceptedAt, 64)
  if (!acceptedAt || Number.isNaN(Date.parse(acceptedAt))) {
    throw new SupportValidationError('INVALID_CONSENT_EVIDENCE', ['consentAcceptedAt'])
  }
  return {
    processingAccepted: true,
    acceptedAt,
    version: CONSENT_VERSION,
    marketing: 'DENIED',
  }
}

function publicCaseState(lead) {
  return {
    accepted: Boolean(lead?.id),
    leadId: lead?.id,
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

function resolveInsideRoot(root, ...segments) {
  const resolved = path.resolve(root, ...segments)
  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    throw new Error('PATH_OUTSIDE_STORAGE_ROOT')
  }
  return resolved
}

/**
 * Schreibt die validierten Attachments unter `<root>/<caseDir>/` — generierte
 * Namen, Originalname kommt nur in die Metadaten. Der Root liegt im
 * Server-Verzeichnis und wird von keiner Route statisch ausgeliefert.
 *
 * Nie ueberschreiben (`wx`): eine bereits vorhandene Datei traegt wegen des
 * Inhalts-Hashs im Namen denselben Inhalt. Zurueck kommen nur die Dateien, die
 * DIESER Aufruf angelegt hat — nur die darf ein Fehlschlag wieder entfernen.
 */
function writeAttachmentFiles(storageRoot, caseDir, attachments) {
  const dir = resolveInsideRoot(storageRoot, caseDir)
  fs.mkdirSync(dir, { recursive: true })
  const created = []
  try {
    for (const attachment of attachments) {
      const target = resolveInsideRoot(dir, attachment.storageId)
      try {
        fs.writeFileSync(target, attachment.buffer, { flag: 'wx' })
        created.push(target)
      } catch (error) {
        if (error?.code !== 'EEXIST') throw error
      }
    }
  } catch (error) {
    removeCreatedFiles(created)
    throw error
  }
  return created
}

function removeCreatedFiles(files) {
  for (const file of files) {
    try {
      fs.unlinkSync(file)
    } catch {
      // Bereits weg — nichts zu tun.
    }
  }
}

/**
 * CRM-Adapter der `support`-Route: Team-Mail (High-Priority, mit den
 * gespeicherten Attachments) + Absender-Bestaetigung (ohne Attachments,
 * lokalisiert ueber system-i18n). Beide Mails bilden eine Einheit — ein
 * Retry kann die Paarung wiederholen (at-least-once), der Case selbst ist
 * durch Idempotency geschuetzt. `send` wird injiziert (DRY_RUN-bewusste
 * sgMail-Instanz aus server.js, in Tests ein Fake).
 */
class SendGridSupportMailAdapter extends CrmAdapter {
  constructor({ send, recipient, sender, storageRoot, teamRecipients = SUPPORT_TEAM_RECIPIENTS }) {
    super()
    if (typeof send !== 'function') throw new TypeError('send is required')
    if (!recipient || !sender) throw new TypeError('recipient and sender are required')
    this.send = send
    this.recipient = recipient
    this.sender = sender
    this.storageRoot = storageRoot
    this.teamRecipients = teamRecipients
  }

  async deliver({ lead }) {
    const subject = lead.subject || {}
    const context = lead.context || {}
    const attachments = Array.isArray(context.attachments) ? context.attachments : []
    const mailLocale = resolveMailLocale(context.locale, 'support')
    const copy = getMailCopy(mailLocale).support

    const teamAttachments = attachments.map((meta) => ({
      filename: meta.originalName,
      content: fs
        .readFileSync(resolveInsideRoot(this.storageRoot, context.caseDir, meta.storageId))
        .toString('base64'),
      type: meta.mime,
      disposition: 'attachment',
    }))

    const detailRows = [
      ['Name', subject.name],
      ['Email', subject.email],
      ['Igloo Reader UDI', subject.udi],
      ['SW-Version', subject.swVersion],
      ['Problemtyp', subject.issueTypeLabel || subject.issueType],
      ['Betreff', subject.subject],
    ]
      .map(
        ([label, value]) =>
          `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 180px;">${esc(label)}:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(value || '-')}</td></tr>`,
      )
      .join('')

    const teamMail = {
      to: [this.recipient, ...this.teamRecipients],
      from: this.sender,
      replyTo: subject.email,
      subject: `[HIGH PRIORITY] Support-Anfrage: ${subject.subject}`,
      text: [
        'Neue Support-Anfrage ueber das Webseiten-Formular:',
        '',
        `Name: ${subject.name}`,
        `Email: ${subject.email}`,
        `Igloo Reader UDI: ${subject.udi}`,
        `SW-Version: ${subject.swVersion}`,
        `Problemtyp: ${subject.issueTypeLabel || subject.issueType}`,
        `Betreff: ${subject.subject}`,
        `Anhaenge: ${attachments.length}`,
        ...attachments.map(
          (meta) => `- ${meta.originalName} (${meta.mime}, ${meta.size} B, ${meta.storageId})`,
        ),
        '',
        'Beschreibung:',
        subject.description || '-',
      ].join('\n'),
      html: `<h3>Neue Support-Anfrage</h3><table style="border-collapse: collapse; width: 100%; max-width: 600px;">${detailRows}</table><p><strong>Anhaenge:</strong> ${attachments.length}</p><p><strong>Beschreibung:</strong></p><p>${esc(subject.description || '-').replace(/\n/g, '<br>')}</p>`,
      attachments: teamAttachments,
      headers: { 'X-Priority': '1', 'X-MSMail-Priority': 'High', Importance: 'high' },
    }

    const confirmationMail = {
      to: subject.email,
      from: this.sender,
      subject: `${copy.subject}: ${subject.subject}`,
      text: `${copy.greeting} ${subject.name},\n\n${copy.received}\n\n${copy.details}:\n- Igloo Reader UDI: ${subject.udi}\n- SW-Version: ${subject.swVersion}\n- ${copy.issueType}: ${subject.issueTypeLabel || subject.issueType}\n- ${copy.subjectLabel}: ${subject.subject}\n\n${copy.regards},\n${copy.team}\ncontact@polarisdx.net\n+49 151 75011699`,
      html: `<div lang="${mailLocale}" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;"><h2 style="color: #083358;">${esc(copy.title)}</h2><p>${esc(copy.greeting)} ${esc(subject.name)},</p><p>${esc(copy.received)}</p><h3 style="color: #083358; margin-top: 24px;">${esc(copy.details)}:</h3><table style="border-collapse: collapse; width: 100%; max-width: 500px;"><tr><td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-weight: bold;">Igloo Reader UDI:</td><td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${esc(subject.udi)}</td></tr><tr><td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-weight: bold;">SW-Version:</td><td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${esc(subject.swVersion)}</td></tr><tr><td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-weight: bold;">${esc(copy.issueType)}:</td><td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${esc(subject.issueTypeLabel || subject.issueType)}</td></tr><tr><td style="padding: 6px 8px; border-bottom: 1px solid #eee; font-weight: bold;">${esc(copy.subjectLabel)}:</td><td style="padding: 6px 8px; border-bottom: 1px solid #eee;">${esc(subject.subject)}</td></tr></table><p style="margin-top: 24px;">${esc(copy.regards)},<br><strong>${esc(copy.team)}</strong></p><p style="color: #666; font-size: 13px;">contact@polarisdx.net | +49 151 75011699</p></div>`,
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

function createSupportCaseService({ repository, worker, storageRoot }) {
  if (!repository || !worker) throw new TypeError('repository and worker are required')
  if (!storageRoot) throw new TypeError('storageRoot is required')

  return {
    async submit({ body, idempotencyKey }) {
      const key = text(idempotencyKey, 200)
      if (!key) throw new SupportValidationError('IDEMPOTENCY_KEY_REQUIRED', ['idempotencyKey'])
      // Honeypot: still annehmen, nichts persistieren, nichts zustellen.
      if (body?._hp) return { ignored: true }

      const request = normalizeRequest(body)
      const consent = normalizeConsentEvidence(body)
      const attachments = normalizeAttachments(body, key)

      // Dateien vor der Persistenz auf Disk — die Metadaten am Case
      // referenzieren damit nur bereits existierende, gepruefte Dateien.
      // Deterministisch aus dem Idempotency-Key abgeleitet: ein Replay
      // mit demselben Key schreibt dieselben Dateien nochmals (stabile
      // Storage-IDs, kein Datenmuell) und erzeugt denselben Kontext —
      // erst der requestHash-Vergleich unterscheidet Replay von Konflikt.
      const caseDir = `case-${crypto.createHash('sha256').update(`support:${key}`).digest('hex').slice(0, 32)}`
      const createdFiles = writeAttachmentFiles(storageRoot, caseDir, attachments)

      const retention = {
        caseDays: RETENTION_DAYS,
        attachmentDays: RETENTION_DAYS,
        deleteAfter: new Date(Date.now() + RETENTION_DAYS * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
      }

      let lead
      try {
        lead = repository.createLead({
          journey: JOURNEY,
          idempotencyKey: key,
          subject: request.subject,
          context: {
            locale: request.locale,
            source: 'support_center',
            originRoute: `/${request.locale}/support`,
            caseDir,
            attachments: attachments.map(({ buffer: _buffer, ...meta }) => meta),
            retention,
          },
          consent,
          channels: ['CRM'],
        })
      } catch (error) {
        // Konflikt oder Speicherfehler: kein Vorgang referenziert die eben
        // geschriebenen Dateien. Dateien eines bestehenden Vorgangs bleiben.
        removeCreatedFiles(createdFiles)
        throw error
      }

      // Erst jetzt darf der externe Handoff laufen. Der Case ist committet —
      // ein Provider-Fehler verliert ihn nicht.
      await worker.processNext()

      return publicCaseState(repository.getLead(lead.id))
    },

    async processNext() {
      return worker.processNext()
    },
  }
}

let runtime
function getRuntimeSupportCaseService({ mailer, env = process.env } = {}) {
  if (runtime) return runtime
  const db = openLeadDatabase()
  const repository = new LeadRepository(db)
  const storageRoot = env.SUPPORT_UPLOAD_DIR
    ? path.resolve(env.SUPPORT_UPLOAD_DIR)
    : path.resolve(__dirname, 'storage', 'support-uploads')

  const adapters = {}
  if (env.SENDGRID_API_KEY && env.CONTACT_RECEIVER && env.SENDER_EMAIL) {
    adapters['support'] = new SendGridSupportMailAdapter({
      send: (msg) => mailer.send(msg),
      recipient: env.CONTACT_RECEIVER,
      sender: env.SENDER_EMAIL,
      storageRoot,
    })
  }
  // Ohne konfigurierten Provider bewusst KEIN Adapter registriert: CrmRouter
  // loest dann ehrlich NO_PROVIDER_CONFIGURED auf — kein Fake-SENT.
  const worker = new LeadHandoffWorker({
    repository,
    router: new CrmRouter({ adapters }),
    workerId: `support-${process.pid}`,
    // Nur die eigene Journey: sonst uebernimmt dieser Worker fremde
    // Auftraege, fuer die sein Router keinen Adapter hat.
    journeys: [JOURNEY],
  })
  runtime = createSupportCaseService({ repository, worker, storageRoot })
  return runtime
}

module.exports = {
  ALLOWED_ATTACHMENT_TYPES,
  CONSENT_VERSION,
  IdempotencyConflictError,
  JOURNEY,
  MAX_ATTACHMENTS,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  RETENTION_DAYS,
  SendGridSupportMailAdapter,
  SupportValidationError,
  createSupportCaseService,
  getRuntimeSupportCaseService,
  normalizeAttachments,
}
