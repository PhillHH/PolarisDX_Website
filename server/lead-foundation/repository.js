const { createHash, randomUUID } = require('node:crypto')
const { DELIVERY_CHANNELS, LEAD_JOURNEYS, LEAD_STATUSES, OUTBOX_STATUSES } = require('./constants')

const SUPPORTED_LOCALES = new Set(['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'])
const ERROR_CLASS_PATTERN = /^[A-Z][A-Z0-9_]{0,63}$/

class IdempotencyConflictError extends Error {
  constructor() {
    super('Idempotency key already represents a different request')
    this.name = 'IdempotencyConflictError'
    this.code = 'IDEMPOTENCY_CONFLICT'
  }
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stableValue(value[key])]),
    )
  }
  return value
}

function requestHash(value) {
  return createHash('sha256')
    .update(JSON.stringify(stableValue(value)))
    .digest('hex')
}

function assertShortString(value, name, { required = false, max = 256 } = {}) {
  if (value == null || value === '') {
    if (required) throw new TypeError(`${name} is required`)
    return ''
  }
  if (typeof value !== 'string' || value.length > max) throw new TypeError(`${name} is invalid`)
  return value
}

function normalizeAttachmentRefs(attachments) {
  if (attachments === undefined || attachments === null) return []
  if (!Array.isArray(attachments)) throw new TypeError('context.attachments must be an array')
  if (attachments.length > 10) throw new TypeError('context.attachments is too large')
  return attachments.map((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new TypeError('context.attachments items must be objects')
    }
    return {
      originalName: assertShortString(item.originalName, 'attachments.originalName', { max: 120 }),
      mime: assertShortString(item.mime, 'attachments.mime', { max: 128 }),
      extension: assertShortString(item.extension, 'attachments.extension', { max: 16 }),
      size: Number.isInteger(item.size) && item.size > 0 ? item.size : 0,
      storageId: assertShortString(item.storageId, 'attachments.storageId', { max: 80 }),
    }
  })
}

function normalizeRetention(retention) {
  if (retention === undefined || retention === null) return null
  if (typeof retention !== 'object' || Array.isArray(retention)) {
    throw new TypeError('context.retention must be an object')
  }
  const days = (value) => (Number.isInteger(value) && value > 0 ? value : 0)
  return {
    caseDays: days(retention.caseDays),
    attachmentDays: days(retention.attachmentDays),
    deleteAfter: assertShortString(retention.deleteAfter, 'retention.deleteAfter', { max: 10 }),
  }
}

function normalizeContext(context = {}) {
  const locale = assertShortString(context.locale, 'context.locale', { required: true, max: 2 })
  if (!SUPPORTED_LOCALES.has(locale)) throw new TypeError('context.locale is unsupported')
  return {
    locale,
    source: assertShortString(context.source, 'context.source', { max: 128 }),
    campaign: assertShortString(context.campaign, 'context.campaign', { max: 128 }),
    // AP20 PT20.2 — erlaubte journey-Attribution (z. B. 'general_sales') und
    // Sektionskontext. Nur allowlisted Werte; fuer alle anderen Journeys leer.
    journey: assertShortString(context.journey, 'context.journey', { max: 128 }),
    section: assertShortString(context.section, 'context.section', { max: 128 }),
    panel: assertShortString(context.panel, 'context.panel', { max: 128 }),
    focus: assertShortString(context.focus, 'context.focus', { max: 128 }),
    originRoute: assertShortString(context.originRoute, 'context.originRoute', { max: 512 }),
    // AP19 PT19.3 — journey-neutrale Ressourcenfelder. Fuer alle anderen
    // Journeys bleiben sie leer; `content_download` traegt hier die
    // ANGEFRAGTE und die TATSAECHLICH gelieferte Sprache getrennt, damit eine
    // Sprachabweichung im Lead nachweisbar bleibt statt still zu verschwinden.
    assetId: assertShortString(context.assetId, 'context.assetId', { max: 64 }),
    requestedLanguage: assertShortString(context.requestedLanguage, 'context.requestedLanguage', {
      max: 2,
    }),
    deliveredLanguage: assertShortString(context.deliveredLanguage, 'context.deliveredLanguage', {
      max: 2,
    }),
    // AP20 PT20.3 — Support-Case-Felder: opaker Storage-Ordner (generierte
    // UUID, nie ein User-Filename), Attachment-Metadaten (Originalname nur
    // Display, Storage-ID generiert) und Retention-Metadaten. Streng
    // gebounded; die Attachment-POLITIK (Allowlist/Limits) bleibt im
    // Support-Journey-Slice, hier nur Form + Groesse.
    caseDir: assertShortString(context.caseDir, 'context.caseDir', { max: 64 }),
    attachments: normalizeAttachmentRefs(context.attachments),
    retention: normalizeRetention(context.retention),
  }
}

function normalizeConsent(consent = {}) {
  if (consent.processingAccepted !== true) throw new TypeError('processing consent is required')
  const acceptedAt = assertShortString(consent.acceptedAt, 'consent.acceptedAt', {
    required: true,
    max: 64,
  })
  if (Number.isNaN(Date.parse(acceptedAt))) throw new TypeError('consent.acceptedAt is invalid')
  return {
    processingAccepted: true,
    acceptedAt: new Date(acceptedAt).toISOString(),
    version: assertShortString(consent.version, 'consent.version', { required: true, max: 128 }),
    marketing: consent.marketing === 'GRANTED' ? 'GRANTED' : 'DENIED',
  }
}

function parseLeadRow(row) {
  if (!row) return null
  return {
    id: row.id,
    idempotencyKey: row.idempotency_key,
    journey: row.journey,
    status: row.status,
    subject: JSON.parse(row.subject_json),
    context: JSON.parse(row.context_json),
    consent: JSON.parse(row.consent_json),
    attemptCount: row.attempt_count,
    lastAttemptAt: row.last_attempt_at,
    lastErrorClass: row.last_error_class,
    handoffState: row.handoff_state,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function normalizeErrorClass(errorClass) {
  if (!ERROR_CLASS_PATTERN.test(String(errorClass || ''))) return 'UNCLASSIFIED_PROVIDER_ERROR'
  return String(errorClass)
}

class LeadRepository {
  constructor(db, { clock = () => new Date(), idFactory = randomUUID } = {}) {
    this.db = db
    this.clock = clock
    this.idFactory = idFactory
  }

  now() {
    return this.clock().toISOString()
  }

  createLead({ journey, idempotencyKey, subject = {}, context, consent, channels = ['CRM'] }) {
    if (!LEAD_JOURNEYS.includes(journey)) throw new TypeError('journey is unsupported')
    assertShortString(idempotencyKey, 'idempotencyKey', { required: true, max: 200 })
    if (!subject || typeof subject !== 'object' || Array.isArray(subject)) {
      throw new TypeError('subject must be an object')
    }
    const subjectJson = JSON.stringify(subject)
    if (Buffer.byteLength(subjectJson, 'utf8') > 32 * 1024)
      throw new TypeError('subject is too large')
    const normalizedContext = normalizeContext(context)
    const normalizedConsent = normalizeConsent(consent)
    const normalizedChannels = [...new Set(channels)]
    if (
      normalizedChannels.length === 0 ||
      normalizedChannels.some((channel) => !Object.values(DELIVERY_CHANNELS).includes(channel))
    ) {
      throw new TypeError('channels are invalid')
    }

    const hash = requestHash({
      journey,
      subject,
      context: normalizedContext,
      consent: normalizedConsent,
      channels: normalizedChannels,
    })

    const create = this.db.transaction(() => {
      const existing = this.db
        .prepare('SELECT * FROM leads WHERE idempotency_key = ?')
        .get(idempotencyKey)
      if (existing) {
        if (existing.request_hash !== hash) throw new IdempotencyConflictError()
        return parseLeadRow(existing)
      }

      const id = this.idFactory()
      const now = this.now()
      this.db
        .prepare(
          `INSERT INTO leads (
            id, idempotency_key, request_hash, journey, status, subject_json, context_json,
            consent_json, handoff_state, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          id,
          idempotencyKey,
          hash,
          journey,
          LEAD_STATUSES.RECEIVED,
          subjectJson,
          JSON.stringify(normalizedContext),
          JSON.stringify(normalizedConsent),
          OUTBOX_STATUSES.PENDING,
          now,
          now,
        )
      this.addEvent(id, null, 'LEAD_RECEIVED', LEAD_STATUSES.RECEIVED, null, null, now)

      this.setLeadStatus(id, LEAD_STATUSES.PERSISTED, OUTBOX_STATUSES.PENDING, now)
      this.addEvent(id, null, 'LEAD_PERSISTED', LEAD_STATUSES.PERSISTED, null, null, now)

      for (const channel of normalizedChannels) {
        this.db
          .prepare(
            `INSERT INTO lead_outbox (
              id, lead_id, channel, status, available_at, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          )
          .run(
            `${id}:${channel.toLowerCase()}`,
            id,
            channel,
            OUTBOX_STATUSES.PENDING,
            now,
            now,
            now,
          )
      }

      this.setLeadStatus(id, LEAD_STATUSES.PENDING_HANDOFF, OUTBOX_STATUSES.PENDING, now)
      this.addEvent(id, null, 'HANDOFF_PENDING', LEAD_STATUSES.PENDING_HANDOFF, null, null, now)
      return this.getLead(id)
    })

    return create.immediate()
  }

  setLeadStatus(id, status, handoffState, now, details = {}) {
    this.db
      .prepare(
        `UPDATE leads SET status = ?, handoff_state = ?, attempt_count = COALESCE(?, attempt_count),
          last_attempt_at = COALESCE(?, last_attempt_at), last_error_class = ?, updated_at = ?
        WHERE id = ?`,
      )
      .run(
        status,
        handoffState,
        details.attemptCount ?? null,
        details.lastAttemptAt ?? null,
        details.lastErrorClass ?? null,
        now,
        id,
      )
  }

  addEvent(leadId, outboxId, eventType, status, attempt, errorClass, occurredAt = this.now()) {
    this.db
      .prepare(
        `INSERT INTO lead_events (
          lead_id, outbox_id, event_type, status, attempt, error_class, occurred_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(leadId, outboxId, eventType, status, attempt, errorClass, occurredAt)
  }

  getLead(id) {
    return parseLeadRow(this.db.prepare('SELECT * FROM leads WHERE id = ?').get(id))
  }

  getLeadByIdempotencyKey(idempotencyKey) {
    return parseLeadRow(
      this.db.prepare('SELECT * FROM leads WHERE idempotency_key = ?').get(idempotencyKey),
    )
  }

  getEvents(leadId) {
    return this.db
      .prepare(
        `SELECT event_type AS eventType, status, attempt, error_class AS errorClass,
          occurred_at AS occurredAt FROM lead_events WHERE lead_id = ? ORDER BY id`,
      )
      .all(leadId)
  }

  getOutboxForLead(leadId) {
    return this.db
      .prepare(
        `SELECT id, lead_id AS leadId, channel, status, attempts, available_at AS availableAt,
          claimed_at AS claimedAt, claimed_by AS claimedBy, last_attempt_at AS lastAttemptAt,
          last_error_class AS lastErrorClass, delivered_at AS deliveredAt,
          terminal_at AS terminalAt FROM lead_outbox WHERE lead_id = ? ORDER BY channel`,
      )
      .all(leadId)
  }

  claimNext({ workerId, leaseMs = 30_000, channel = DELIVERY_CHANNELS.CRM }) {
    assertShortString(workerId, 'workerId', { required: true, max: 128 })
    const claim = this.db.transaction(() => {
      const now = this.now()
      const staleBefore = new Date(Date.parse(now) - leaseMs).toISOString()
      const row = this.db
        .prepare(
          `SELECT * FROM lead_outbox
           WHERE channel = ? AND (
             (status IN (?, ?) AND available_at <= ?)
             OR (status = ? AND claimed_at <= ?)
           )
           ORDER BY available_at, created_at, id
           LIMIT 1`,
        )
        .get(
          channel,
          OUTBOX_STATUSES.PENDING,
          OUTBOX_STATUSES.RETRY_PENDING,
          now,
          OUTBOX_STATUSES.PROCESSING,
          staleBefore,
        )
      if (!row) return null

      const attempt = row.attempts + 1
      this.db
        .prepare(
          `UPDATE lead_outbox SET status = ?, attempts = ?, claimed_at = ?, claimed_by = ?,
            last_attempt_at = ?, updated_at = ? WHERE id = ?`,
        )
        .run(OUTBOX_STATUSES.PROCESSING, attempt, now, workerId, now, now, row.id)
      this.setLeadStatus(row.lead_id, LEAD_STATUSES.PROCESSING, OUTBOX_STATUSES.PROCESSING, now, {
        attemptCount: attempt,
        lastAttemptAt: now,
      })
      this.addEvent(
        row.lead_id,
        row.id,
        'HANDOFF_ATTEMPT',
        LEAD_STATUSES.PROCESSING,
        attempt,
        null,
        now,
      )
      return {
        id: row.id,
        lead: this.getLead(row.lead_id),
        channel: row.channel,
        attempt,
        claimedBy: workerId,
        deliveryKey: row.id,
      }
    })
    return claim.immediate()
  }

  markDelivered(claim) {
    const complete = this.db.transaction(() => {
      const now = this.now()
      const update = this.db
        .prepare(
          `UPDATE lead_outbox SET status = ?, delivered_at = ?, claimed_at = NULL,
            claimed_by = NULL, last_error_class = NULL, updated_at = ?
          WHERE id = ? AND status = ? AND attempts = ? AND claimed_by = ?`,
        )
        .run(
          OUTBOX_STATUSES.DELIVERED,
          now,
          now,
          claim.id,
          OUTBOX_STATUSES.PROCESSING,
          claim.attempt,
          claim.claimedBy,
        )
      if (update.changes === 0) return this.getLead(claim.lead.id)
      const counts = this.db
        .prepare(
          `SELECT COUNT(*) AS total,
             SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS delivered,
             SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS terminal
           FROM lead_outbox WHERE lead_id = ?`,
        )
        .get(OUTBOX_STATUSES.DELIVERED, OUTBOX_STATUSES.FAILED_TERMINAL, claim.lead.id)
      const status =
        counts.terminal > 0
          ? LEAD_STATUSES.FAILED_TERMINAL
          : counts.delivered === counts.total
            ? LEAD_STATUSES.DELIVERED
            : LEAD_STATUSES.PENDING_HANDOFF
      const handoffState =
        status === LEAD_STATUSES.DELIVERED
          ? OUTBOX_STATUSES.DELIVERED
          : status === LEAD_STATUSES.FAILED_TERMINAL
            ? OUTBOX_STATUSES.FAILED_TERMINAL
            : OUTBOX_STATUSES.PENDING
      this.setLeadStatus(claim.lead.id, status, handoffState, now, {
        attemptCount: claim.attempt,
        lastAttemptAt: now,
      })
      this.addEvent(claim.lead.id, claim.id, 'HANDOFF_DELIVERED', status, claim.attempt, null, now)
      return this.getLead(claim.lead.id)
    })
    return complete.immediate()
  }

  markFailed(claim, { retryable, errorClass, maxAttempts = 3, retryDelayMs = 1_000 }) {
    const fail = this.db.transaction(() => {
      const now = this.now()
      const normalizedError = normalizeErrorClass(errorClass)
      const willRetry = retryable && claim.attempt < maxAttempts
      const outboxStatus = willRetry
        ? OUTBOX_STATUSES.RETRY_PENDING
        : OUTBOX_STATUSES.FAILED_TERMINAL
      const leadStatus = willRetry ? LEAD_STATUSES.RETRY_PENDING : LEAD_STATUSES.FAILED_TERMINAL
      const availableAt = new Date(Date.parse(now) + retryDelayMs).toISOString()
      const update = this.db
        .prepare(
          `UPDATE lead_outbox SET status = ?, available_at = ?, claimed_at = NULL,
            claimed_by = NULL, last_error_class = ?, terminal_at = ?, updated_at = ?
          WHERE id = ? AND status = ? AND attempts = ? AND claimed_by = ?`,
        )
        .run(
          outboxStatus,
          availableAt,
          normalizedError,
          willRetry ? null : now,
          now,
          claim.id,
          OUTBOX_STATUSES.PROCESSING,
          claim.attempt,
          claim.claimedBy,
        )
      if (update.changes === 0) return this.getLead(claim.lead.id)
      this.setLeadStatus(claim.lead.id, leadStatus, outboxStatus, now, {
        attemptCount: claim.attempt,
        lastAttemptAt: now,
        lastErrorClass: normalizedError,
      })
      this.addEvent(
        claim.lead.id,
        claim.id,
        willRetry ? 'HANDOFF_RETRY_SCHEDULED' : 'HANDOFF_FAILED_TERMINAL',
        leadStatus,
        claim.attempt,
        normalizedError,
        now,
      )
      return this.getLead(claim.lead.id)
    })
    return fail.immediate()
  }
}

module.exports = {
  IdempotencyConflictError,
  LeadRepository,
  normalizeConsent,
  normalizeContext,
  requestHash,
}
