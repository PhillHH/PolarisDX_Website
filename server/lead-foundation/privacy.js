const fs = require('node:fs')
const path = require('node:path')

const { LEAD_JOURNEYS, RETENTION_POLICY_DAYS } = require('./constants')

/**
 * AP22 PT22.8 — Aufbewahrung und Betroffenenrechte.
 *
 * Der Ausgangszustand, ehrlich benannt: Aufbewahrung existierte als
 * METADATUM. AP20 PT20.3 hat fuer Support 90 Tage festgelegt, PT22.2 hat
 * daraus eine indizierte Spalte gemacht — und danach hat sie niemand
 * gelesen. `findDueForDeletion()` gab es, aufgerufen hat es nichts. Eine
 * Loeschfrist, die nur in der Datenbank steht, ist keine Loeschung.
 *
 * Zwei Dinge, die hier bewusst NICHT passieren:
 *
 *  1. **Es wird keine gesetzliche Frist erfunden.** Fuer sechs der sieben
 *     Journeys gibt es keine freigegebene Aufbewahrungsdauer (`LDC-11`).
 *     Sie bleiben ohne Loeschdatum — nicht „unbegrenzt", sondern
 *     „unentschieden", und genau so wird es gemeldet. Der Betrieb kann eine
 *     Dauer KONFIGURIEREN; woher sie kommt, steht dann in der Politik.
 *  2. **Es wird nicht hart geloescht.** Anonymisiert wird der Personenbezug;
 *     die Zeile bleibt als Beleg stehen. Ein `DELETE` auf `leads` raeumt per
 *     `ON DELETE CASCADE` auch `lead_events` ab — also genau den Nachweis,
 *     dass ordnungsgemaess geloescht wurde.
 */

/** Umgebungsname fuer die konfigurierbare Frist einer Journey. */
const retentionEnvName = (journey) => `LEAD_RETENTION_DAYS_${journey.toUpperCase()}`

const RETENTION_POLICY_SOURCES = Object.freeze({
  /** In einem AP beschlossen und in `constants.js` festgehalten. */
  APPROVED: 'APPROVED_POLICY',
  /** Vom Betrieb gesetzt, weil eine rechtliche Freigabe noch fehlt. */
  CONFIGURED: 'OPERATIONAL_OVERRIDE',
  /** Keine Entscheidung. Es wird nichts geloescht — und das ist sichtbar. */
  UNDECIDED: 'UNDECIDED',
})

/**
 * Die geltende Aufbewahrungspolitik, mit Herkunft je Journey.
 *
 * Eine Konfiguration kann eine beschlossene Frist nur VERKUERZEN, nicht
 * verlaengern: eine laengere Aufbewahrung als beschlossen waere eine
 * rechtliche Aussage, die eine Umgebungsvariable nicht treffen darf.
 */
function resolveRetentionPolicy(env = process.env) {
  const entries = LEAD_JOURNEYS.map((journey) => {
    const approved = RETENTION_POLICY_DAYS[journey]
    const raw = env[retentionEnvName(journey)]
    const configured = raw === undefined || String(raw).trim() === '' ? null : Number(raw)

    if (configured !== null && (!Number.isInteger(configured) || configured <= 0)) {
      throw new TypeError(`${retentionEnvName(journey)} must be a positive integer number of days`)
    }
    if (configured !== null && Number.isInteger(approved) && configured > approved) {
      throw new TypeError(
        `${retentionEnvName(journey)} may not exceed the approved retention of ${approved} days`,
      )
    }
    if (configured !== null) {
      return [journey, { days: configured, source: RETENTION_POLICY_SOURCES.CONFIGURED }]
    }
    if (Number.isInteger(approved) && approved > 0) {
      return [journey, { days: approved, source: RETENTION_POLICY_SOURCES.APPROVED }]
    }
    return [journey, { days: null, source: RETENTION_POLICY_SOURCES.UNDECIDED }]
  })
  return Object.fromEntries(entries)
}

/** Die Politik in der Form, die `LeadRepository` erwartet: nur Tage. */
function retentionDaysFromPolicy(policy) {
  return Object.freeze(
    Object.fromEntries(Object.entries(policy).map(([journey, entry]) => [journey, entry.days])),
  )
}

/**
 * Pfad innerhalb des Storage aufloesen — oder gar nicht.
 *
 * Ein Loeschjob, der einen Pfad aus der Datenbank ohne Pruefung an
 * `rm -rf` reicht, ist die gefaehrlichste Zeile im ganzen Task. `caseDir`
 * ist zwar eine generierte UUID, aber die Pruefung haengt nicht daran,
 * sondern am Ergebnis.
 */
function resolveInsideRoot(root, ...segments) {
  const resolvedRoot = path.resolve(root)
  const target = path.resolve(resolvedRoot, ...segments)
  if (target !== resolvedRoot && !target.startsWith(resolvedRoot + path.sep)) {
    throw new Error('resolved path escapes storage root')
  }
  return target
}

/**
 * Die Dateien eines Support-Falls loeschen.
 *
 * Getrennt von der Anonymisierung, weil nur der Aufrufer den Storage kennt —
 * das Repository hat mit dem Dateisystem nichts zu tun.
 */
function deleteCaseFiles({ storageRoot, caseDir }) {
  if (!storageRoot || !caseDir) return { deleted: false, reason: 'NO_FILES' }
  let target
  try {
    target = resolveInsideRoot(storageRoot, caseDir)
  } catch {
    // Ein Pfad, der aus dem Storage fuehrt, wird gemeldet und NICHT geloescht.
    return { deleted: false, reason: 'PATH_ESCAPES_ROOT' }
  }
  if (!fs.existsSync(target)) return { deleted: false, reason: 'ALREADY_GONE' }
  fs.rmSync(target, { recursive: true, force: true })
  return { deleted: true, reason: 'DELETED' }
}

/**
 * Der Aufbewahrungslauf.
 *
 * `apply: false` ist der Standard: der Lauf BERICHTET, was er tun wuerde.
 * Ein Loeschjob, der beim ersten Aufruf ungefragt loescht, ist im Betrieb
 * nicht zu verantworten — und im Test nicht zu beobachten.
 */
function runRetention({
  repository,
  storageRoot = null,
  now = new Date().toISOString(),
  apply = false,
  limit = 500,
  actor = 'retention-job',
  reason = 'RETENTION_POLICY',
  logger = { info() {}, warn() {} },
}) {
  const due = repository.findDueForDeletion(now).slice(0, Math.max(0, limit))
  const summary = {
    observedAt: now,
    applied: apply,
    due: due.length,
    anonymized: [],
    deferred: [],
    files: { deleted: 0, missing: 0, refused: 0 },
  }

  for (const entry of due) {
    if (!apply) {
      summary.deferred.push({ leadId: entry.id, journey: entry.journey, reason: 'DRY_RUN_REPORT' })
      continue
    }
    const result = repository.anonymizeLead({ leadId: entry.id, actor, reason, now })
    if (!result.anonymized) {
      summary.deferred.push({ leadId: entry.id, journey: entry.journey, reason: result.reason })
      logger.warn('lead_retention_deferred', { journey: entry.journey, reason: result.reason })
      continue
    }
    summary.anonymized.push({ leadId: entry.id, journey: entry.journey })
    const files = deleteCaseFiles({ storageRoot, caseDir: result.caseDir })
    if (files.deleted) summary.files.deleted += 1
    else if (files.reason === 'PATH_ESCAPES_ROOT') summary.files.refused += 1
    else if (files.reason === 'ALREADY_GONE') summary.files.missing += 1
    logger.info('lead_retention_anonymized', { journey: entry.journey, files: files.reason })
  }

  return summary
}

/**
 * Auskunft, Datenkopie und Loeschung fuer eine betroffene Person.
 *
 * Der Einstieg ist immer der Hash der Adresse, nie eine Textsuche: ein
 * `LIKE '%name%'` wuerde fremde Datensaetze treffen, und eine Loeschung, die
 * fremde Datensaetze trifft, ist schlimmer als gar keine.
 */
class LeadPrivacyService {
  constructor({ repository, storageRoot = null, clock = () => new Date() }) {
    if (!repository) throw new TypeError('repository is required')
    this.repository = repository
    this.storageRoot = storageRoot
    this.clock = clock
    // Zeilen aus der Zeit vor der Spalte bekommen ihren Suchschluessel, bevor
    // die erste Auskunft laeuft — sonst waere die Antwort still unvollstaendig.
    this.repository.backfillSubjectEmailHashes()
  }

  now() {
    return this.clock().toISOString()
  }

  /** Welche Vorgaenge gibt es zu dieser Adresse? Ohne Inhalt, nur Bestand. */
  lookup(email) {
    return this.repository.findLeadsBySubjectEmail(email).map((lead) => ({
      leadId: lead.id,
      reference: lead.reference,
      journey: lead.journey,
      status: lead.status,
      createdAt: lead.createdAt,
      retentionDeleteAfter: lead.retentionDeleteAfter,
      anonymizedAt: lead.anonymizedAt,
      legalHoldUntil: lead.legalHoldUntil,
    }))
  }

  /** Die vollstaendige Datenkopie zu dieser Adresse. */
  export(email) {
    const leads = this.repository.findLeadsBySubjectEmail(email)
    return {
      generatedAt: this.now(),
      matchedRecords: leads.length,
      records: leads.map((lead) => this.repository.exportLead(lead.id)),
    }
  }

  /**
   * Loeschersuchen ausfuehren.
   *
   * Drei Ausgaenge, alle drei sichtbar:
   *  - anonymisiert,
   *  - aufgeschoben, weil eine eingetragene Aufbewahrungspflicht gilt oder
   *    der Vorgang gerade zugestellt wird,
   *  - nichts gefunden.
   *
   * Was NICHT passiert: ein Vorgang einer anderen Person. Die Auswahl kommt
   * ausschliesslich aus dem Hash-Treffer.
   */
  erase({ email, actor, reason }) {
    const now = this.now()
    const leads = this.repository.findLeadsBySubjectEmail(email)
    const result = {
      requestedAt: now,
      matchedRecords: leads.length,
      anonymized: [],
      deferred: [],
      files: { deleted: 0, missing: 0, refused: 0 },
    }
    for (const lead of leads) {
      const outcome = this.repository.anonymizeLead({ leadId: lead.id, actor, reason, now })
      if (!outcome.anonymized) {
        result.deferred.push({
          leadId: lead.id,
          journey: lead.journey,
          reason: outcome.reason,
          legalHoldUntil: outcome.legalHoldUntil ?? null,
          status: outcome.status ?? null,
        })
        continue
      }
      result.anonymized.push({ leadId: lead.id, journey: lead.journey })
      const files = deleteCaseFiles({ storageRoot: this.storageRoot, caseDir: outcome.caseDir })
      if (files.deleted) result.files.deleted += 1
      else if (files.reason === 'PATH_ESCAPES_ROOT') result.files.refused += 1
      else if (files.reason === 'ALREADY_GONE') result.files.missing += 1
    }
    return result
  }
}

module.exports = {
  LeadPrivacyService,
  RETENTION_POLICY_SOURCES,
  deleteCaseFiles,
  resolveRetentionPolicy,
  retentionDaysFromPolicy,
  retentionEnvName,
  runRetention,
}
