const { createHash, randomUUID } = require('node:crypto')
const {
  DEDUP_POLICIES,
  DELIVERY_CHANNELS,
  LEAD_JOURNEYS,
  LEAD_STATUSES,
  OUTBOX_STATUSES,
  PENDING_DELIVERY_STATUSES,
  RETENTION_POLICY_DAYS,
} = require('./constants')

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

function normalizeQuantity(quantity) {
  if (quantity === undefined || quantity === null || quantity === '') return 0
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 999) {
    throw new TypeError('context.quantity is invalid')
  }
  return quantity
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
    // AP21 PT21.5 — journey-neutrale Bestell-/Vorgangsfelder. `reference` ist
    // die fachliche, dem Absender nennbare Vorgangsnummer (deterministisch aus
    // dem Idempotency-Key abgeleitet, damit ein Replay dieselbe Nummer traegt).
    // `productId`/`variant`/`quantity` sind die serverseitig allowlisteten
    // Bestellfakten — bewusst KEINE freien Client-Labels. Fuer alle anderen
    // Journeys bleiben sie leer bzw. 0. Hier nur Form + Grenzen; die
    // fachliche Allowlist gehoert in den jeweiligen Journey-Slice.
    reference: assertShortString(context.reference, 'context.reference', { max: 64 }),
    productId: assertShortString(context.productId, 'context.productId', { max: 64 }),
    variant: assertShortString(context.variant, 'context.variant', { max: 64 }),
    quantity: normalizeQuantity(context.quantity),
    // AP22 PT22.2 — die beiden Journeys, die bis hierhin kein eigenes
    // Kontextfeld hatten. Bewusst KATEGORIAL und knapp: `reportArea` ist der
    // Fachbereich der ROI-Rechnung, `orgType` die Art der Einrichtung. Weder
    // die Rechenwerte noch ein Praxisname stehen hier — Zahlen gehoeren in
    // den Report-Side-Effect, ein Name ist Kontaktdatum und liegt im Subject.
    reportArea: assertShortString(context.reportArea, 'context.reportArea', { max: 128 }),
    orgType: assertShortString(context.orgType, 'context.orgType', { max: 64 }),
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
    reference: row.reference ?? null,
    idempotencyKey: row.idempotency_key,
    dedupKey: row.dedup_key ?? null,
    journey: row.journey,
    status: row.status,
    subject: JSON.parse(row.subject_json),
    context: JSON.parse(row.context_json),
    consent: JSON.parse(row.consent_json),
    attemptCount: row.attempt_count,
    lastAttemptAt: row.last_attempt_at,
    lastErrorClass: row.last_error_class,
    handoffState: row.handoff_state,
    reconciliationReason: row.reconciliation_reason ?? null,
    retentionDeleteAfter: row.retention_delete_after ?? null,
    // AP22 PT22.8 — Datenschutzzustand des Vorgangs.
    anonymizedAt: row.anonymized_at ?? null,
    legalHoldUntil: row.legal_hold_until ?? null,
    validatedAt: row.validated_at ?? null,
    queuedAt: row.queued_at ?? null,
    deliveredAt: row.delivered_at ?? null,
    terminalAt: row.terminal_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Fachlicher Dedup-Schluessel einer Journey.
 *
 * Der Journey-Name geht IMMER in den Hash ein: dieselbe Person darf am selben
 * Tag eine Supportanfrage stellen und ein Whitepaper laden, ohne dass eines
 * davon als Dublette gilt. Aus den Werten wird nur ein Hash gespeichert —
 * der Schluessel selbst enthaelt PII (E-Mail) und hat in einer indizierten
 * Spalte nichts verloren.
 */
function dedupKeyFor(journey, subject = {}, context = {}) {
  const policy = DEDUP_POLICIES[journey]
  if (!policy) return null
  const source = { ...context, ...subject }
  const parts = policy.fields.map((field) =>
    String(source[field] ?? '')
      .trim()
      .toLowerCase(),
  )
  if (parts.every((part) => part === '')) return null
  return createHash('sha256')
    .update(`${journey}\u0000${parts.join('\u0000')}`)
    .digest('hex')
}

/**
 * Suchschluessel fuer eine Auskunfts-/Loeschanfrage (AP22 PT22.8).
 *
 * Eine DSAR-Anfrage kommt mit einer Adresse, nicht mit einer Lead-ID.
 * Gespeichert wird nur der Hash der normalisierten Adresse — dieselbe
 * Entscheidung wie bei `dedupKeyFor`. Der Hash ist ein SUCHSCHLUESSEL und
 * kein Schutz: die Adresse steht im Klartext im Subject, und genau deshalb
 * gibt es die Anonymisierung.
 */
function subjectEmailHash(email) {
  const normalized = String(email ?? '')
    .trim()
    .toLowerCase()
  if (!normalized) return null
  return createHash('sha256').update(`subject-email\u0000${normalized}`).digest('hex')
}

/**
 * Loeschdatum aus der Journey-Politik. `null`, wo keine Frist entschieden ist.
 *
 * AP22 PT22.8 — die Politik ist jetzt einspeisbar. Fuer sechs der sieben
 * Journeys gibt es keine freigegebene Frist (`LDC-11`); eine hier fest
 * verdrahtete Zahl waere eine erfundene Rechtsaussage. Der Betrieb kann
 * stattdessen eine Frist KONFIGURIEREN, und woher sie kommt, bleibt
 * nachvollziehbar (siehe `privacy.js`).
 */
function retentionDeleteAfter(journey, now, policy = RETENTION_POLICY_DAYS) {
  const days = policy?.[journey]
  if (!Number.isInteger(days) || days <= 0) return null
  return new Date(Date.parse(now) + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

function normalizeErrorClass(errorClass) {
  if (!ERROR_CLASS_PATTERN.test(String(errorClass || ''))) return 'UNCLASSIFIED_PROVIDER_ERROR'
  return String(errorClass)
}

class LeadRepository {
  constructor(
    db,
    {
      clock = () => new Date(),
      idFactory = randomUUID,
      /**
       * AP22 PT22.8 — Aufbewahrungsfristen in Tagen je Journey. Standard ist
       * das, was wirklich entschieden ist; der Betrieb kann sie ersetzen,
       * ohne dass hier eine Frist erfunden wird.
       */
      retentionPolicy = RETENTION_POLICY_DAYS,
    } = {},
  ) {
    this.db = db
    this.clock = clock
    this.idFactory = idFactory
    this.retentionPolicy = retentionPolicy
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
            id, reference, idempotency_key, request_hash, journey, dedup_key, status,
            subject_json, context_json, consent_json, handoff_state,
            retention_delete_after, subject_email_hash, validated_at, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          id,
          // Die Vorgangsnummer ist ab PT22.2 eine Spalte, nicht mehr nur ein
          // Kontextfeld. Journeys ohne eigene Nummer schreiben NULL.
          normalizedContext.reference || null,
          idempotencyKey,
          hash,
          journey,
          dedupKeyFor(journey, subject, normalizedContext),
          LEAD_STATUSES.RECEIVED,
          subjectJson,
          JSON.stringify(normalizedContext),
          JSON.stringify(normalizedConsent),
          OUTBOX_STATUSES.PENDING,
          retentionDeleteAfter(journey, now, this.retentionPolicy),
          // AP22 PT22.8 — der DSAR-Suchschluessel entsteht beim Schreiben.
          // Ein spaeterer Nachlauf ueber alle `subject_json` waere ein
          // zweiter Weg zur selben Wahrheit.
          subjectEmailHash(subject.email),
          now,
          now,
          now,
        )
      this.addEvent(id, null, 'LEAD_RECEIVED', LEAD_STATUSES.RECEIVED, null, null, now)

      // Die Validierung ist an dieser Stelle bereits gelaufen — der Slice
      // wirft vorher. `VALIDATED` macht diesen Schritt im Protokoll sichtbar,
      // statt ihn zwischen RECEIVED und PERSISTED verschwinden zu lassen.
      this.setLeadStatus(id, LEAD_STATUSES.VALIDATED, OUTBOX_STATUSES.PENDING, now)
      this.addEvent(id, null, 'LEAD_VALIDATED', LEAD_STATUSES.VALIDATED, null, null, now)

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

      this.setLeadStatus(id, LEAD_STATUSES.QUEUED, OUTBOX_STATUSES.PENDING, now)
      this.db.prepare('UPDATE leads SET queued_at = ? WHERE id = ?').run(now, id)
      // Der Ereignisname bleibt `HANDOFF_PENDING`: er benennt das Ereignis,
      // nicht den Zustand, und aeltere Auswertungen lesen ihn.
      this.addEvent(id, null, 'HANDOFF_PENDING', LEAD_STATUSES.QUEUED, null, null, now)
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

  /**
   * Fachliche Dublette im Zeitfenster der Journey.
   *
   * Erkennt, sperrt aber nicht: was mit dem Fund geschieht, entscheidet die
   * Journey. Ein hartes UNIQUE waere falsch, weil eine Wiederholung nach dem
   * Fenster eine legitime neue Anfrage ist.
   */
  findRecentDuplicate({ journey, subject = {}, context = {}, now = this.now() }) {
    const policy = DEDUP_POLICIES[journey]
    const key = dedupKeyFor(journey, subject, context)
    if (!policy || !key) return null
    const since = new Date(Date.parse(now) - policy.windowMs).toISOString()
    return parseLeadRow(
      this.db
        .prepare(
          `SELECT * FROM leads
           WHERE journey = ? AND dedup_key = ? AND created_at >= ?
           ORDER BY created_at DESC, id LIMIT 1`,
        )
        .get(journey, key, since),
    )
  }

  /** Vorgaenge, deren Loeschfrist abgelaufen ist. Der Loeschjob selbst ist AP22. */
  findDueForDeletion(asOf = this.now()) {
    return this.db
      .prepare(
        `SELECT id, journey, retention_delete_after AS retentionDeleteAfter,
           legal_hold_until AS legalHoldUntil, status
         FROM leads
         WHERE retention_delete_after IS NOT NULL AND retention_delete_after <= ?
           -- AP22 PT22.8: ein bereits anonymisierter Vorgang ist erledigt und
           -- taucht nicht jede Nacht erneut als faellig auf.
           AND anonymized_at IS NULL
         ORDER BY retention_delete_after, id`,
      )
      .all(asOf.slice(0, 10))
  }

  /**
   * Dead Letter — endgueltig nicht zugestellte Vorgaenge, sichtbar mit allem,
   * was fuer eine Entscheidung noetig ist. AP22 PT22.4.
   *
   * Bewusst OHNE Subject: eine Betriebsliste braucht Vorgangsnummer, Journey,
   * Versuche, Fehlerklasse und Zeitpunkt — nicht die Kontaktdaten.
   */
  findDeadLetters({ journey = null, limit = 100 } = {}) {
    const params = []
    let filter = ''
    if (journey) {
      if (!LEAD_JOURNEYS.includes(journey)) throw new TypeError('journey is unsupported')
      filter = ' AND l.journey = ?'
      params.push(journey)
    }
    return this.db
      .prepare(
        `SELECT l.id AS leadId, l.reference, l.journey, l.status,
           l.attempt_count AS attempts, l.last_error_class AS errorClass,
           l.reconciliation_reason AS reconciliationReason,
           l.terminal_at AS terminalAt, l.updated_at AS updatedAt,
           o.id AS deliveryKey, o.channel, o.status AS outboxStatus
         FROM leads l
         LEFT JOIN lead_outbox o ON o.lead_id = l.id
         WHERE l.status IN (?, ?)${filter}
         ORDER BY l.updated_at DESC, l.id
         LIMIT ?`,
      )
      .all(
        LEAD_STATUSES.FAILED_TERMINAL,
        LEAD_STATUSES.RECONCILIATION_REQUIRED,
        ...params,
        Math.max(1, Math.min(1000, limit)),
      )
  }

  /**
   * Manuelle Wiedervorlage eines liegengebliebenen Auftrags.
   *
   * Ausdruecklich, nachvollziehbar und wiederholungssicher:
   *
   *  - `actor` und `reason` sind Pflicht. Eine Wiedervorlage ohne Grund waere
   *    im Nachhinein nicht zu beurteilen.
   *  - Nur aus einem Endzustand. Einen laufenden oder wartenden Auftrag
   *    anzustossen wuerde eine zweite gleichzeitige Zustellung riskieren.
   *  - Idempotent: eine zweite Wiedervorlage desselben Auftrags, der bereits
   *    wieder wartet, tut nichts und meldet das ehrlich.
   *  - Die Versuchszahl bleibt STEHEN. Sie auf 0 zu setzen wuerde die
   *    Historie faelschen; der Auftrag bekommt damit genau einen weiteren
   *    Versuch, und das ist die ehrliche Bedeutung von "manuell freigegeben".
   */
  requeueForDelivery({ leadId, channel = DELIVERY_CHANNELS.CRM, actor, reason }) {
    assertShortString(actor, 'actor', { required: true, max: 128 })
    assertShortString(reason, 'reason', { required: true, max: 256 })
    const requeue = this.db.transaction(() => {
      const lead = this.getLead(leadId)
      if (!lead) return { requeued: false, reason: 'LEAD_NOT_FOUND' }
      const terminal = [LEAD_STATUSES.FAILED_TERMINAL, LEAD_STATUSES.RECONCILIATION_REQUIRED]
      if (!terminal.includes(lead.status)) {
        return { requeued: false, reason: 'NOT_IN_TERMINAL_STATE', status: lead.status }
      }
      const now = this.now()
      const update = this.db
        .prepare(
          `UPDATE lead_outbox SET status = ?, available_at = ?, claimed_at = NULL,
             claimed_by = NULL, terminal_at = NULL, updated_at = ?
           WHERE lead_id = ? AND channel = ? AND status = ?`,
        )
        .run(OUTBOX_STATUSES.PENDING, now, now, leadId, channel, OUTBOX_STATUSES.FAILED_TERMINAL)
      if (update.changes === 0) {
        return { requeued: false, reason: 'NO_TERMINAL_OUTBOX_ENTRY' }
      }
      this.setLeadStatus(leadId, LEAD_STATUSES.QUEUED, OUTBOX_STATUSES.PENDING, now)
      this.db
        .prepare('UPDATE leads SET queued_at = ?, terminal_at = NULL WHERE id = ?')
        .run(now, leadId)
      // Der Eingriff steht im Protokoll — mit Person und Grund.
      this.addEvent(
        leadId,
        `${leadId}:${String(channel).toLowerCase()}`,
        'MANUAL_REQUEUE',
        LEAD_STATUSES.QUEUED,
        lead.attemptCount,
        `BY:${actor.slice(0, 64)}`,
        now,
      )
      return { requeued: true, leadId, status: LEAD_STATUSES.QUEUED, actor, reason }
    })
    return requeue.immediate()
  }

  /**
   * Betriebskennzahlen der Warteschlange. Reine Zaehlungen und Alter —
   * keine Kontaktdaten, kein Inhalt.
   */
  collectQueueMetrics(now = this.now()) {
    const byLeadStatus = Object.fromEntries(
      this.db
        .prepare('SELECT status, COUNT(*) AS count FROM leads GROUP BY status')
        .all()
        .map((row) => [row.status, row.count]),
    )
    const byOutboxStatus = Object.fromEntries(
      this.db
        .prepare('SELECT status, COUNT(*) AS count FROM lead_outbox GROUP BY status')
        .all()
        .map((row) => [row.status, row.count]),
    )
    const due = this.db
      .prepare(
        `SELECT COUNT(*) AS depth, MIN(available_at) AS oldest FROM lead_outbox
         WHERE status IN (?, ?) AND available_at <= ?`,
      )
      .get(OUTBOX_STATUSES.PENDING, OUTBOX_STATUSES.RETRY_PENDING, now)
    const byJourney = this.db
      .prepare('SELECT journey, status, COUNT(*) AS count FROM leads GROUP BY journey, status')
      .all()
    const providerFailures = this.db
      .prepare(
        `SELECT last_error_class AS errorClass, COUNT(*) AS count FROM leads
         WHERE last_error_class IS NOT NULL GROUP BY last_error_class ORDER BY count DESC`,
      )
      .all()

    return {
      observedAt: now,
      leads: byLeadStatus,
      outbox: byOutboxStatus,
      queue: {
        depth: due.depth ?? 0,
        oldestAvailableAt: due.oldest ?? null,
        oldestAgeMs: due.oldest ? Math.max(0, Date.parse(now) - Date.parse(due.oldest)) : 0,
      },
      byJourney,
      providerFailures,
    }
  }

  /** Vorgaenge, die menschliche Klaerung brauchen — sichtbar und auffindbar. */
  findReconciliationRequired() {
    return this.db
      .prepare(
        `SELECT id, journey, reconciliation_reason AS reconciliationReason,
           last_error_class AS lastErrorClass, updated_at AS updatedAt
         FROM leads WHERE status = ? ORDER BY updated_at, id`,
      )
      .all(LEAD_STATUSES.RECONCILIATION_REQUIRED)
  }

  // ===========================================================================
  // AP22 PT22.8 — Datenschutz: Auskunft, Loeschung, Aufbewahrung
  // ===========================================================================

  /**
   * Suchschluessel fuer Zeilen, die vor PT22.8 geschrieben wurden.
   *
   * Die Spalte kam additiv dazu; SQLite kann sha256 nicht, eine Backfill im
   * SQL der Migration ist also unmoeglich. Statt eines Einmal-Skripts, das
   * jemand vergessen kann, faellt der Nachlauf hier an — er fasst nur Zeilen
   * mit leerem Hash an und ist damit nach dem ersten Lauf ein reiner Zaehler.
   */
  backfillSubjectEmailHashes() {
    const rows = this.db
      .prepare(
        `SELECT id, subject_json FROM leads
         WHERE subject_email_hash IS NULL AND anonymized_at IS NULL`,
      )
      .all()
    const update = this.db.prepare('UPDATE leads SET subject_email_hash = ? WHERE id = ?')
    const run = this.db.transaction((items) => {
      let filled = 0
      for (const row of items) {
        let email = null
        try {
          email = JSON.parse(row.subject_json)?.email
        } catch {
          email = null
        }
        const hash = subjectEmailHash(email)
        if (!hash) continue
        update.run(hash, row.id)
        filled += 1
      }
      return filled
    })
    return { examined: rows.length, filled: run.immediate(rows) }
  }

  /**
   * Alle Vorgaenge einer betroffenen Person — die Grundlage jeder Auskunft.
   *
   * Bewusst ueber den Hash und nicht ueber `LIKE` auf dem Subject: eine
   * Textsuche wuerde Teiltreffer fremder Adressen liefern, und genau das
   * darf eine Auskunft nicht (fremde Datensaetze).
   */
  findLeadsBySubjectEmail(email) {
    const hash = subjectEmailHash(email)
    if (!hash) return []
    return this.db
      .prepare('SELECT * FROM leads WHERE subject_email_hash = ? ORDER BY created_at, id')
      .all(hash)
      .map(parseLeadRow)
  }

  /**
   * Vollstaendige Auskunft zu EINEM Vorgang.
   *
   * Enthaelt, was ueber diese Person gespeichert ist: Subject, Kontext,
   * Einwilligung, Lebenslauf und Zustellzustand. Der Zustellschluessel und
   * interne Claim-Felder gehoeren nicht dazu — sie sagen nichts ueber die
   * Person, sondern ueber unseren Betrieb.
   */
  exportLead(leadId) {
    const lead = this.getLead(leadId)
    if (!lead) return null
    return {
      leadId: lead.id,
      reference: lead.reference,
      journey: lead.journey,
      status: lead.status,
      subject: lead.subject,
      context: lead.context,
      consent: lead.consent,
      retentionDeleteAfter: lead.retentionDeleteAfter,
      anonymizedAt: lead.anonymizedAt,
      legalHoldUntil: lead.legalHoldUntil,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
      events: this.getEvents(lead.id),
      delivery: this.getOutboxForLead(lead.id).map(
        ({ channel, status, attempts, deliveredAt }) => ({
          channel,
          status,
          attempts,
          deliveredAt,
        }),
      ),
    }
  }

  /**
   * Aufbewahrungspflicht eintragen — die EINZIGE Ausnahme von der Loeschung.
   *
   * Ausdruecklich von einer Person gesetzt, mit Grund, und im Protokoll.
   * Es wird keine gesetzliche Frist abgeleitet: ohne Eintrag gibt es keine
   * Ausnahme.
   */
  setLegalHold({ leadId, until, actor, reason }) {
    assertShortString(actor, 'actor', { required: true, max: 128 })
    assertShortString(reason, 'reason', { required: true, max: 256 })
    const holdUntil = until === null ? null : assertShortString(until, 'until', { max: 10 })
    if (holdUntil && Number.isNaN(Date.parse(holdUntil))) throw new TypeError('until is invalid')
    const apply = this.db.transaction(() => {
      const lead = this.getLead(leadId)
      if (!lead) return { applied: false, reason: 'LEAD_NOT_FOUND' }
      const now = this.now()
      this.db
        .prepare('UPDATE leads SET legal_hold_until = ?, updated_at = ? WHERE id = ?')
        .run(holdUntil, now, leadId)
      this.addEvent(
        leadId,
        null,
        holdUntil ? 'LEGAL_HOLD_SET' : 'LEGAL_HOLD_CLEARED',
        lead.status,
        null,
        `BY:${actor.slice(0, 64)}`,
        now,
      )
      return { applied: true, leadId, legalHoldUntil: holdUntil }
    })
    return apply.immediate()
  }

  /**
   * Personenbezug entfernen, Vorgang als Beleg behalten.
   *
   * Warum anonymisieren statt loeschen: die Zeile ist zugleich der NACHWEIS,
   * dass es den Vorgang gab und was mit ihm geschah. Ein hartes DELETE
   * loescht ueber `ON DELETE CASCADE` auch das Ereignisprotokoll — also
   * genau den Beleg dafuer, dass ordnungsgemaess geloescht wurde. Was
   * bleibt, ist ohne Personenbezug: Journey, Zustand, Zeitpunkte, Versuche.
   *
   * Entfernt werden ALLE drei Verkettungen zur Person, nicht nur das
   * Subject: `dedup_key`, `subject_email_hash` und `request_hash` sind
   * ungesalzene Hashes ueber die Adresse — wer eine Adresse raet, koennte
   * sonst pruefen, ob sie hier lag. Folge, bewusst in Kauf genommen: ein
   * Replay des alten Idempotency-Keys kann nicht mehr gegen den
   * urspruenglichen Request verglichen werden und meldet einen Konflikt.
   *
   * Nicht anwendbar auf einen Vorgang, der noch zugestellt wird: den
   * Personenbezug mitten in der Bearbeitung zu entfernen wuerde eine leere
   * Nachricht verschicken. Solche Vorgaenge werden ehrlich als aufgeschoben
   * gemeldet, nicht still uebersprungen.
   */
  anonymizeLead({ leadId, actor, reason, now = this.now(), allowPending = false }) {
    assertShortString(actor, 'actor', { required: true, max: 128 })
    assertShortString(reason, 'reason', { required: true, max: 256 })
    const anonymize = this.db.transaction(() => {
      const lead = this.getLead(leadId)
      if (!lead) return { anonymized: false, reason: 'LEAD_NOT_FOUND' }
      if (lead.anonymizedAt) {
        // Idempotent: eine zweite Loeschanfrage ist kein Fehler.
        return { anonymized: false, reason: 'ALREADY_ANONYMIZED', leadId, at: lead.anonymizedAt }
      }
      if (lead.legalHoldUntil && lead.legalHoldUntil > now.slice(0, 10)) {
        return {
          anonymized: false,
          reason: 'LEGAL_HOLD',
          leadId,
          legalHoldUntil: lead.legalHoldUntil,
        }
      }
      if (!allowPending && PENDING_DELIVERY_STATUSES.includes(lead.status)) {
        return { anonymized: false, reason: 'DELIVERY_PENDING', leadId, status: lead.status }
      }

      // Der Kontext ist per Konstruktion kategorial (kein Name, keine
      // Adresse). Entfernt werden nur die Zeiger auf Dateien: die Dateien
      // selbst loescht der Aufrufer, der als Einziger den Storage kennt.
      const context = { ...lead.context, caseDir: '', attachments: [] }
      this.db
        .prepare(
          `UPDATE leads SET subject_json = ?, context_json = ?, dedup_key = NULL,
             subject_email_hash = NULL, request_hash = 'ANONYMIZED',
             anonymized_at = ?, updated_at = ? WHERE id = ?`,
        )
        .run(JSON.stringify({ anonymized: true }), JSON.stringify(context), now, now, leadId)

      // Ein ausgestellter Downloadanspruch ueberlebt die Loeschung nicht.
      this.db
        .prepare(
          `UPDATE resource_entitlements SET revoked_at = COALESCE(revoked_at, ?), updated_at = ?
           WHERE lead_id = ?`,
        )
        .run(now, now, leadId)

      this.addEvent(
        leadId,
        null,
        'SUBJECT_ANONYMIZED',
        lead.status,
        null,
        `BY:${actor.slice(0, 64)}`,
        now,
      )
      return {
        anonymized: true,
        leadId,
        journey: lead.journey,
        caseDir: lead.context?.caseDir || null,
        attachments: lead.context?.attachments ?? [],
      }
    })
    return anonymize.immediate()
  }

  /** Zaehlungen zum Datenschutzzustand — ohne einen einzigen Personenbezug. */
  collectPrivacyMetrics(now = this.now()) {
    const today = now.slice(0, 10)
    const one = (sql, ...params) => this.db.prepare(sql).get(...params)?.count ?? 0
    return {
      observedAt: now,
      total: one('SELECT COUNT(*) AS count FROM leads'),
      anonymized: one('SELECT COUNT(*) AS count FROM leads WHERE anonymized_at IS NOT NULL'),
      withRetentionDate: one(
        'SELECT COUNT(*) AS count FROM leads WHERE retention_delete_after IS NOT NULL',
      ),
      withoutRetentionDate: one(
        'SELECT COUNT(*) AS count FROM leads WHERE retention_delete_after IS NULL',
      ),
      dueForDeletion: one(
        `SELECT COUNT(*) AS count FROM leads
         WHERE retention_delete_after IS NOT NULL AND retention_delete_after <= ?
           AND anonymized_at IS NULL`,
        today,
      ),
      underLegalHold: one(
        'SELECT COUNT(*) AS count FROM leads WHERE legal_hold_until IS NOT NULL AND legal_hold_until > ?',
        today,
      ),
      missingSearchKey: one(
        `SELECT COUNT(*) AS count FROM leads
         WHERE subject_email_hash IS NULL AND anonymized_at IS NULL`,
      ),
    }
  }

  /**
   * Naechsten faelligen Auftrag atomar uebernehmen.
   *
   * AP22 PT22.4 — `journeys` ist neu und behebt einen gemessenen Defekt:
   * fuenf Journey-Slices betreiben je einen eigenen Worker gegen DIESELBE
   * Outbox, und bis hierhin griff sich jeder alles. Ein Worker mit nur einem
   * Adapter loeste die fremde Journey auf, fand dort keinen Adapter und legte
   * den Vorgang als FAILED_TERMINAL / NO_PROVIDER_CONFIGURED ab.
   *
   * Nachgestellt: ein wartender Support-Vorgang starb, sobald irgendwo eine
   * Kontaktanfrage abgeschickt wurde — obwohl die Support-Strecke einen
   * funktionierenden Adapter hat. Ein Worker uebernimmt deshalb nur noch
   * Journeys, fuer die er zustaendig ist.
   */
  claimNext({ workerId, leaseMs = 30_000, channel = DELIVERY_CHANNELS.CRM, journeys = null }) {
    assertShortString(workerId, 'workerId', { required: true, max: 128 })
    const scope = journeys === null ? null : [...new Set(journeys)]
    if (scope) {
      if (scope.length === 0) return null
      for (const journey of scope) {
        if (!LEAD_JOURNEYS.includes(journey)) throw new TypeError('journey is unsupported')
      }
    }
    const claim = this.db.transaction(() => {
      const now = this.now()
      const staleBefore = new Date(Date.parse(now) - leaseMs).toISOString()
      const journeyFilter = scope
        ? ` AND lead_id IN (SELECT id FROM leads WHERE journey IN (${scope.map(() => '?').join(', ')}))`
        : ''

      /**
       * AP26 PT26.4 — ein abgelaufener Claim ist ein UNBEKANNTES Ergebnis.
       *
       * Vorher wurde ein Auftrag, dessen Worker nach der Uebernahme verschwand,
       * nach 30 s erneut zugestellt. Ob der verschwundene Worker die Mail schon
       * abgeschickt hatte, weiss niemand; SendGrid kennt keinen Idempotenzschluessel,
       * und die Kanal-Idempotenz aus LDV-11 existiert nicht. Die Wiederholung waere
       * damit genau die blinde Nachsendung, die `PROVIDER_RESULT_UNKNOWN` verhindert.
       * Der Auftrag geht deshalb in die Klaerung (`RECONCILIATION_REQUIRED`) und
       * bleibt ueber `requeueForDelivery` bewusst wiederholbar — verloren geht nichts.
       */
      const staleRows = this.db
        .prepare(
          `SELECT * FROM lead_outbox
           WHERE channel = ? AND status = ? AND claimed_at <= ?${journeyFilter}`,
        )
        .all(channel, OUTBOX_STATUSES.PROCESSING, staleBefore, ...(scope ?? []))
      for (const stale of staleRows) {
        const expired = this.db
          .prepare(
            `UPDATE lead_outbox SET status = ?, claimed_at = NULL, claimed_by = NULL,
              last_error_class = ?, terminal_at = ?, updated_at = ?
            WHERE id = ? AND status = ?`,
          )
          .run(
            OUTBOX_STATUSES.FAILED_TERMINAL,
            'PROVIDER_RESULT_UNKNOWN',
            now,
            now,
            stale.id,
            OUTBOX_STATUSES.PROCESSING,
          )
        if (expired.changes === 0) continue
        this.setLeadStatus(
          stale.lead_id,
          LEAD_STATUSES.RECONCILIATION_REQUIRED,
          OUTBOX_STATUSES.FAILED_TERMINAL,
          now,
          { attemptCount: stale.attempts, lastErrorClass: 'PROVIDER_RESULT_UNKNOWN' },
        )
        this.db
          .prepare('UPDATE leads SET terminal_at = ?, reconciliation_reason = ? WHERE id = ?')
          .run(now, 'HANDOFF_LEASE_EXPIRED', stale.lead_id)
        this.addEvent(
          stale.lead_id,
          stale.id,
          'HANDOFF_LEASE_EXPIRED',
          LEAD_STATUSES.RECONCILIATION_REQUIRED,
          stale.attempts,
          'PROVIDER_RESULT_UNKNOWN',
          now,
        )
      }

      const row = this.db
        .prepare(
          `SELECT * FROM lead_outbox
           WHERE channel = ? AND status IN (?, ?) AND available_at <= ?${journeyFilter}
           ORDER BY available_at, created_at, id
           LIMIT 1`,
        )
        .get(channel, OUTBOX_STATUSES.PENDING, OUTBOX_STATUSES.RETRY_PENDING, now, ...(scope ?? []))
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
      if (status === LEAD_STATUSES.DELIVERED) {
        this.db.prepare('UPDATE leads SET delivered_at = ? WHERE id = ?').run(now, claim.lead.id)
      }
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
      /**
       * Ein UNBEKANNTES Providerergebnis ist kein Fehlschlag.
       *
       * Bisher landete ein Timeout in `FAILED_TERMINAL` — das behauptet
       * Wissen, das es nicht gibt: bei `ETIMEDOUT` ist offen, ob die Mail
       * rausging. Der Vorgang wird deshalb als klaerungsbeduerftig gefuehrt.
       * Die Outbox bleibt trotzdem terminal, damit nichts automatisch
       * nachgesendet wird und keine doppelte Zustellung entsteht.
       */
      const resultUnknown = !willRetry && normalizedError === 'PROVIDER_RESULT_UNKNOWN'
      const leadStatus = willRetry
        ? LEAD_STATUSES.RETRY_PENDING
        : resultUnknown
          ? LEAD_STATUSES.RECONCILIATION_REQUIRED
          : LEAD_STATUSES.FAILED_TERMINAL
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
      if (!willRetry) {
        this.db
          .prepare('UPDATE leads SET terminal_at = ?, reconciliation_reason = ? WHERE id = ?')
          .run(now, resultUnknown ? normalizedError : null, claim.lead.id)
      }
      this.addEvent(
        claim.lead.id,
        claim.id,
        willRetry
          ? 'HANDOFF_RETRY_SCHEDULED'
          : resultUnknown
            ? 'HANDOFF_RESULT_UNKNOWN'
            : 'HANDOFF_FAILED_TERMINAL',
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
  dedupKeyFor,
  IdempotencyConflictError,
  LeadRepository,
  normalizeConsent,
  normalizeContext,
  requestHash,
  retentionDeleteAfter,
  subjectEmailHash,
}
