// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

/**
 * AP22 PT22.8 — Datenschutz- und Betriebsfunktionen.
 *
 * Alle Identitaeten in dieser Datei sind offensichtlich synthetisch:
 * `example.com` und `polarisdx.example` sind nach RFC 2606 reserviert und
 * koennen keiner realen Person gehoeren. Das ist keine Kosmetik — ein
 * Loeschtest, der eine echte Adresse traegt, ist ein Datenschutzvorfall im
 * Testlauf.
 */

const require = createRequire(import.meta.url)
const here = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(here, '..')

const {
  DELIVERY_RESULTS,
  CrmRouter,
  LeadPrivacyService,
  LeadDispatcher,
  LeadRepository,
  RETENTION_POLICY_SOURCES,
  createLeadBackup,
  describeBackupScope,
  describeRuntimeIsolation,
  dispatchAlerts,
  evaluateAlerts,
  openLeadDatabase,
  resolveDeliveryMode,
  resolveRetentionPolicy,
  retentionDaysFromPolicy,
  runRetention,
  verifyBackup,
} = require('./lead-foundation')

let directory
let db
let repository

const consent = () => ({
  processingAccepted: true,
  acceptedAt: '2026-09-09T08:00:00.000Z',
  version: 'v1',
})

const seed = ({
  journey = 'support',
  email = 'mila@example.com',
  key,
  caseDir = null,
  context = {},
} = {}) =>
  repository.createLead({
    journey,
    idempotencyKey: key ?? `key-${Math.random().toString(16).slice(2)}`,
    subject: { name: 'Mila Sorensen', email, message: 'Bitte um Rueckruf.' },
    context: { locale: 'de', ...(caseDir ? { caseDir } : {}), ...context },
    consent: consent(),
  })

/** Einen Vorgang in einen Endzustand bringen, ohne den Worker zu bemuehen. */
const forceStatus = (leadId, status) =>
  db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, leadId)

const setDueYesterday = (leadId) =>
  db.prepare('UPDATE leads SET retention_delete_after = ? WHERE id = ?').run('2026-09-08', leadId)

beforeEach(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt228-'))
  db = openLeadDatabase({ filename: path.join(directory, 'leads.sqlite3') })
  repository = new LeadRepository(db)
})

afterEach(() => {
  db?.close()
  fs.rmSync(directory, { recursive: true, force: true })
})

// =============================================================================

describe('PT22.8 — Migration 004 ist additiv', () => {
  it('ergaenzt drei Spalten und einen Index, ohne Daten zu verlieren', () => {
    const lead = seed({ key: 'migration-1' })
    const columns = db
      .prepare('PRAGMA table_info(leads)')
      .all()
      .map((row) => row.name)
    expect(columns).toContain('subject_email_hash')
    expect(columns).toContain('anonymized_at')
    expect(columns).toContain('legal_hold_until')
    expect(repository.getLead(lead.id).subject.email).toBe('mila@example.com')

    const versions = db
      .prepare('SELECT version FROM schema_migrations ORDER BY version')
      .all()
      .map((row) => row.version)
    expect(versions).toContain('004_privacy_operations.sql')
    // Der Umbau aus 003 darf sich nicht wiederholt haben.
    expect(db.pragma('foreign_key_check')).toEqual([])
  })

  it('setzt den Suchschluessel beim Schreiben und nicht erst im Nachlauf', () => {
    const lead = seed({ key: 'hash-1' })
    const row = db.prepare('SELECT subject_email_hash FROM leads WHERE id = ?').get(lead.id)
    expect(row.subject_email_hash).toMatch(/^[a-f0-9]{64}$/)
    // Die Adresse selbst steht NICHT in der indizierten Spalte.
    expect(row.subject_email_hash).not.toContain('mila')
    expect(repository.backfillSubjectEmailHashes()).toEqual({ examined: 0, filled: 0 })
  })

  it('holt den Suchschluessel fuer Zeilen aus der Zeit davor nach', () => {
    const lead = seed({ key: 'backfill-1' })
    db.prepare('UPDATE leads SET subject_email_hash = NULL WHERE id = ?').run(lead.id)
    expect(repository.findLeadsBySubjectEmail('mila@example.com')).toHaveLength(0)
    expect(repository.backfillSubjectEmailHashes()).toEqual({ examined: 1, filled: 1 })
    expect(repository.findLeadsBySubjectEmail('mila@example.com')).toHaveLength(1)
  })
})

describe('PT22.8 — Aufbewahrungspolitik erfindet keine Frist', () => {
  it('meldet sechs Journeys als unentschieden und Support als beschlossen', () => {
    const policy = resolveRetentionPolicy({})
    expect(policy.support).toEqual({ days: 90, source: RETENTION_POLICY_SOURCES.APPROVED })
    const undecided = Object.entries(policy)
      .filter(([, entry]) => entry.source === RETENTION_POLICY_SOURCES.UNDECIDED)
      .map(([journey]) => journey)
    expect(undecided).toHaveLength(6)
    // `null` heisst unentschieden, nicht "unbegrenzt" — und nicht 0.
    expect(policy.contact.days).toBeNull()
  })

  it('nimmt eine konfigurierte Frist an, wo keine beschlossen ist', () => {
    const policy = resolveRetentionPolicy({ LEAD_RETENTION_DAYS_CONTACT: '365' })
    expect(policy.contact).toEqual({ days: 365, source: RETENTION_POLICY_SOURCES.CONFIGURED })
  })

  it('laesst eine Konfiguration eine beschlossene Frist verkuerzen, aber nicht verlaengern', () => {
    expect(resolveRetentionPolicy({ LEAD_RETENTION_DAYS_SUPPORT: '30' }).support.days).toBe(30)
    expect(() => resolveRetentionPolicy({ LEAD_RETENTION_DAYS_SUPPORT: '400' })).toThrow(
      /may not exceed/,
    )
    expect(() => resolveRetentionPolicy({ LEAD_RETENTION_DAYS_CONTACT: '-5' })).toThrow(
      /positive integer/,
    )
    expect(() => resolveRetentionPolicy({ LEAD_RETENTION_DAYS_CONTACT: 'bald' })).toThrow()
  })

  it('schreibt das Loeschdatum aus der geltenden Politik in den Vorgang', () => {
    const configured = new LeadRepository(db, {
      retentionPolicy: retentionDaysFromPolicy(
        resolveRetentionPolicy({ LEAD_RETENTION_DAYS_CONTACT: '10' }),
      ),
    })
    const lead = configured.createLead({
      journey: 'contact',
      idempotencyKey: 'policy-1',
      subject: { name: 'Ines Roth', email: 'ines@example.com' },
      context: { locale: 'de' },
      consent: consent(),
    })
    expect(lead.retentionDeleteAfter).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    // Ohne Konfiguration bleibt dieselbe Journey ohne Datum.
    expect(seed({ journey: 'contact', key: 'policy-2' }).retentionDeleteAfter).toBeNull()
  })
})

describe('PT22.8 — der Aufbewahrungslauf', () => {
  it('berichtet standardmaessig und loescht nichts', () => {
    const lead = seed({ key: 'ret-1' })
    forceStatus(lead.id, 'DELIVERED')
    setDueYesterday(lead.id)

    const summary = runRetention({ repository, now: '2026-09-09T10:00:00.000Z' })
    expect(summary.applied).toBe(false)
    expect(summary.due).toBe(1)
    expect(summary.anonymized).toEqual([])
    expect(repository.getLead(lead.id).subject.email).toBe('mila@example.com')
  })

  it('anonymisiert mit --apply, loescht die Anhaenge und laesst nicht faellige in Ruhe', () => {
    const uploads = path.join(directory, 'uploads')
    const caseDir = 'aaaabbbbccccdddd'
    fs.mkdirSync(path.join(uploads, caseDir), { recursive: true })
    fs.writeFileSync(path.join(uploads, caseDir, 'report.pdf'), 'synthetic')

    const due = seed({ key: 'ret-2', caseDir })
    forceStatus(due.id, 'DELIVERED')
    setDueYesterday(due.id)
    const notDue = seed({ key: 'ret-3', email: 'ada@example.com' })
    forceStatus(notDue.id, 'DELIVERED')

    const summary = runRetention({
      repository,
      storageRoot: uploads,
      apply: true,
      now: '2026-09-09T10:00:00.000Z',
    })
    expect(summary.anonymized).toEqual([{ leadId: due.id, journey: 'support' }])
    expect(summary.files.deleted).toBe(1)
    expect(fs.existsSync(path.join(uploads, caseDir))).toBe(false)

    expect(repository.getLead(due.id).subject).toEqual({ anonymized: true })
    // Der nicht faellige Vorgang ist unberuehrt — auch derselbe Journey-Typ.
    expect(repository.getLead(notDue.id).subject.email).toBe('ada@example.com')
  })

  it('meldet einen bereits anonymisierten Vorgang nicht jede Nacht erneut als faellig', () => {
    const lead = seed({ key: 'ret-4' })
    forceStatus(lead.id, 'DELIVERED')
    setDueYesterday(lead.id)
    runRetention({ repository, apply: true, now: '2026-09-09T10:00:00.000Z' })
    expect(repository.findDueForDeletion('2026-09-09T10:00:00.000Z')).toEqual([])
    expect(runRetention({ repository, apply: true, now: '2026-09-09T10:00:00.000Z' }).due).toBe(0)
  })

  it('loescht keine Datei ausserhalb des Storage, sondern verweigert', () => {
    const uploads = path.join(directory, 'uploads')
    fs.mkdirSync(uploads, { recursive: true })
    const outside = path.join(directory, 'secret.txt')
    fs.writeFileSync(outside, 'nicht anfassen')

    const lead = seed({ key: 'ret-5' })
    forceStatus(lead.id, 'DELIVERED')
    setDueYesterday(lead.id)
    // Ein Traversal-Pfad kaeme nie durch die Validierung — der Loeschjob
    // verlaesst sich trotzdem nicht darauf.
    db.prepare(
      `UPDATE leads SET context_json = json_set(context_json, '$.caseDir', '../secret.txt')
       WHERE id = ?`,
    ).run(lead.id)

    const summary = runRetention({
      repository,
      storageRoot: uploads,
      apply: true,
      now: '2026-09-09T10:00:00.000Z',
    })
    expect(summary.files.refused).toBe(1)
    expect(fs.existsSync(outside)).toBe(true)
  })
})

describe('PT22.8 — Anonymisierung', () => {
  it('entfernt alle drei Verkettungen zur Person und behaelt den Beleg', () => {
    const lead = seed({ key: 'anon-1' })
    forceStatus(lead.id, 'DELIVERED')
    const before = db.prepare('SELECT * FROM leads WHERE id = ?').get(lead.id)
    expect(before.dedup_key).not.toBeNull()

    const result = repository.anonymizeLead({
      leadId: lead.id,
      actor: 'datenschutz',
      reason: 'DSAR',
    })
    expect(result.anonymized).toBe(true)

    const after = db.prepare('SELECT * FROM leads WHERE id = ?').get(lead.id)
    expect(after.subject_json).toBe('{"anonymized":true}')
    expect(after.dedup_key).toBeNull()
    expect(after.subject_email_hash).toBeNull()
    expect(after.request_hash).toBe('ANONYMIZED')
    expect(after.anonymized_at).not.toBeNull()
    // Der Beleg bleibt: Journey, Zustand, Zeitpunkte und das Protokoll.
    expect(after.journey).toBe('support')
    expect(after.created_at).toBe(before.created_at)
    const events = repository.getEvents(lead.id).map((event) => event.eventType)
    expect(events).toContain('LEAD_RECEIVED')
    expect(events).toContain('SUBJECT_ANONYMIZED')
  })

  it('ist idempotent — eine zweite Loeschanfrage ist kein Fehler', () => {
    const lead = seed({ key: 'anon-2' })
    forceStatus(lead.id, 'DELIVERED')
    repository.anonymizeLead({ leadId: lead.id, actor: 'a', reason: 'r' })
    const second = repository.anonymizeLead({ leadId: lead.id, actor: 'a', reason: 'r' })
    expect(second).toMatchObject({ anonymized: false, reason: 'ALREADY_ANONYMIZED' })
  })

  it('verweigert ohne Person und Grund', () => {
    const lead = seed({ key: 'anon-3' })
    expect(() => repository.anonymizeLead({ leadId: lead.id, reason: 'r' })).toThrow()
    expect(() => repository.anonymizeLead({ leadId: lead.id, actor: 'a' })).toThrow()
  })

  it('schiebt einen Vorgang auf, der gerade zugestellt wird', () => {
    const lead = seed({ key: 'anon-4' })
    // Frisch angelegt heisst QUEUED — die Zustellung steht noch aus.
    expect(lead.status).toBe('QUEUED')
    const result = repository.anonymizeLead({ leadId: lead.id, actor: 'a', reason: 'r' })
    expect(result).toMatchObject({ anonymized: false, reason: 'DELIVERY_PENDING' })
    expect(repository.getLead(lead.id).subject.email).toBe('mila@example.com')
  })

  it('respektiert eine eingetragene Aufbewahrungspflicht und protokolliert sie', () => {
    const lead = seed({ key: 'anon-5' })
    forceStatus(lead.id, 'DELIVERED')
    expect(
      repository.setLegalHold({
        leadId: lead.id,
        until: '2030-01-01',
        actor: 'buchhaltung',
        reason: 'Aufbewahrungspflicht geltend gemacht',
      }).applied,
    ).toBe(true)

    const blocked = repository.anonymizeLead({ leadId: lead.id, actor: 'a', reason: 'r' })
    expect(blocked).toMatchObject({ anonymized: false, reason: 'LEGAL_HOLD' })
    expect(repository.getEvents(lead.id).map((e) => e.eventType)).toContain('LEGAL_HOLD_SET')

    repository.setLegalHold({ leadId: lead.id, until: null, actor: 'a', reason: 'erledigt' })
    expect(repository.anonymizeLead({ leadId: lead.id, actor: 'a', reason: 'r' }).anonymized).toBe(
      true,
    )
  })

  it('widerruft einen ausgestellten Downloadanspruch', () => {
    const lead = seed({ journey: 'content_download', key: 'anon-6', context: { assetId: 'wp-1' } })
    forceStatus(lead.id, 'DELIVERED')
    db.prepare(
      `INSERT INTO resource_entitlements (
        id, token_hash, lead_id, journey, asset_id, asset_language, issued_at, expires_at,
        max_downloads, created_at, updated_at
      ) VALUES ('ent-1','hash-1',?,'content_download','wp-1','de','2026-09-09','2026-10-09',3,
        '2026-09-09','2026-09-09')`,
    ).run(lead.id)

    repository.anonymizeLead({ leadId: lead.id, actor: 'a', reason: 'r' })
    expect(
      db.prepare('SELECT revoked_at FROM resource_entitlements').get().revoked_at,
    ).not.toBeNull()
  })
})

describe('PT22.8 — DSAR trifft nur die eigene Person', () => {
  let service

  beforeEach(() => {
    service = new LeadPrivacyService({ repository })
  })

  it('findet die eigenen Vorgaenge und keinen fremden', () => {
    const mine = seed({ key: 'dsar-1', email: 'mila@example.com' })
    seed({ key: 'dsar-2', email: 'mila.k@example.com' })
    seed({ key: 'dsar-3', email: 'ada@example.com' })

    const found = service.lookup('  MILA@Example.COM  ')
    expect(found.map((row) => row.leadId)).toEqual([mine.id])
  })

  it('gibt die vollstaendige Datenkopie mit Einwilligung und Lebenslauf aus', () => {
    const lead = seed({ key: 'dsar-4' })
    const dump = service.export('mila@example.com')
    expect(dump.matchedRecords).toBe(1)
    const record = dump.records[0]
    expect(record.leadId).toBe(lead.id)
    expect(record.subject.email).toBe('mila@example.com')
    expect(record.consent.processingAccepted).toBe(true)
    expect(record.events.length).toBeGreaterThan(0)
    // Interne Betriebsdaten gehoeren nicht in eine Auskunft.
    expect(JSON.stringify(record)).not.toContain('claimed_by')
  })

  it('loescht ausschliesslich die Vorgaenge der anfragenden Person', () => {
    const mine = seed({ key: 'dsar-5', email: 'mila@example.com' })
    const foreign = seed({ key: 'dsar-6', email: 'ada@example.com' })
    forceStatus(mine.id, 'DELIVERED')
    forceStatus(foreign.id, 'DELIVERED')

    const result = service.erase({ email: 'mila@example.com', actor: 'dsb', reason: 'Art. 17' })
    expect(result.anonymized.map((row) => row.leadId)).toEqual([mine.id])
    expect(repository.getLead(foreign.id).subject.email).toBe('ada@example.com')
  })

  it('meldet ehrlich, was NICHT geloescht wurde, statt es zu verschweigen', () => {
    const pending = seed({ key: 'dsar-7' })
    const held = seed({ key: 'dsar-8', email: 'mila@example.com' })
    forceStatus(held.id, 'FAILED_TERMINAL')
    repository.setLegalHold({ leadId: held.id, until: '2030-01-01', actor: 'a', reason: 'r' })

    const result = service.erase({ email: 'mila@example.com', actor: 'dsb', reason: 'Art. 17' })
    expect(result.anonymized).toEqual([])
    expect(result.deferred.map((row) => row.reason).sort()).toEqual([
      'DELIVERY_PENDING',
      'LEGAL_HOLD',
    ])
    expect(result.deferred.find((row) => row.reason === 'DELIVERY_PENDING').leadId).toBe(pending.id)
  })

  it('antwortet auf eine unbekannte Adresse mit leerem Ergebnis statt mit allem', () => {
    seed({ key: 'dsar-9' })
    expect(service.lookup('niemand@example.com')).toEqual([])
    expect(service.export('niemand@example.com').matchedRecords).toBe(0)
    expect(service.erase({ email: '', actor: 'a', reason: 'r' }).matchedRecords).toBe(0)
  })
})

describe('PT22.8 — Preview/Staging kann den Produktionsprovider nicht treffen', () => {
  it('erzwingt den Trockenlauf, den kein Flag aufheben kann', () => {
    const preview = resolveDeliveryMode({
      APP_ENV: 'preview',
      NODE_ENV: 'production',
      DRY_RUN: '0',
    })
    expect(preview).toMatchObject({
      dryRun: true,
      forced: true,
      reason: 'NON_PRODUCTION_ENVIRONMENT',
    })
    expect(resolveDeliveryMode({ DEPLOY_ENV: 'staging' }).dryRun).toBe(true)
  })

  it('laesst die Produktion zustellen und das Flag weiterhin wirken', () => {
    expect(resolveDeliveryMode({ NODE_ENV: 'production' })).toMatchObject({
      dryRun: false,
      reason: 'LIVE_DELIVERY',
    })
    expect(resolveDeliveryMode({ NODE_ENV: 'production', DRY_RUN: '1' })).toMatchObject({
      dryRun: true,
      forced: false,
      reason: 'DRY_RUN_FLAG',
    })
  })

  it('ruft den Adapter in einer Vorschau ueberhaupt nicht auf', async () => {
    let calls = 0
    const router = new CrmRouter({
      adapters: {
        support: {
          async deliver() {
            calls += 1
            return { status: DELIVERY_RESULTS.DELIVERED }
          },
        },
      },
      dryRun: resolveDeliveryMode({ APP_ENV: 'preview' }).dryRun,
    })
    const { adapter } = router.resolve({ journey: 'support' })
    const result = await adapter.deliver({ lead: { id: 'x' } })
    expect(result.status).toBe(DELIVERY_RESULTS.DRY_RUN)
    // Kein Netzwerk, kein Provider, kein halber Weg.
    expect(calls).toBe(0)
  })

  it('meldet die betrieblich falschen Kombinationen als Befund', () => {
    const previewLive = describeRuntimeIsolation({ APP_ENV: 'preview' })
    // Erzwungen — deshalb ist genau dieser Befund NICHT moeglich.
    expect(previewLive.dryRun).toBe(true)
    expect(previewLive.findings.map((f) => f.code)).not.toContain('PREVIEW_WITH_LIVE_DELIVERY')

    expect(
      describeRuntimeIsolation({ NODE_ENV: 'production', DRY_RUN: '1' }).findings.map(
        (f) => f.code,
      ),
    ).toContain('PRODUCTION_IN_DRY_RUN')
    expect(
      describeRuntimeIsolation({ NODE_ENV: 'production', SENDGRID_API_KEY: 'SG.x' }).findings.map(
        (f) => f.code,
      ),
    ).toContain('UNDECLARED_ENVIRONMENT_WITH_PROVIDER')
  })
})

describe('PT22.8 — Betriebssicht und Alarme', () => {
  it('macht aus den lead-kritischen Zustaenden benannte Alarme', () => {
    const alerts = evaluateAlerts({
      queueMetrics: {
        leads: { FAILED_TERMINAL: 2, RECONCILIATION_REQUIRED: 1 },
        queue: { depth: 3, oldestAgeMs: 60 * 60_000 },
        providerFailures: [{ errorClass: 'NO_PROVIDER_CONFIGURED', count: 4 }],
      },
      privacyMetrics: { dueForDeletion: 5 },
      isolation: describeRuntimeIsolation({ NODE_ENV: 'production', DRY_RUN: '1' }),
    })
    const codes = alerts.map((alert) => alert.code)
    expect(codes).toContain('LEADS_FAILED_TERMINAL')
    expect(codes).toContain('LEADS_RECONCILIATION_REQUIRED')
    expect(codes).toContain('NO_PROVIDER_CONFIGURED')
    expect(codes).toContain('QUEUE_STALLED')
    expect(codes).toContain('RETENTION_OVERDUE')
    expect(codes).toContain('PRODUCTION_IN_DRY_RUN')
  })

  it('schweigt bei einer gesunden Warteschlange', () => {
    expect(
      evaluateAlerts({
        queueMetrics: {
          leads: { DELIVERED: 12 },
          queue: { depth: 0, oldestAgeMs: 0 },
          providerFailures: [],
        },
        privacyMetrics: { dueForDeletion: 0 },
        isolation: describeRuntimeIsolation({ NODE_ENV: 'production' }),
      }),
    ).toEqual([])
  })

  it('gibt Alarme ohne Personenbezug aus und ueberlebt eine kaputte Senke', () => {
    const seen = []
    const result = dispatchAlerts([{ code: 'QUEUE_STALLED', severity: 'critical', ageMs: 1 }], {
      sinks: [
        {
          name: 'broken',
          notify() {
            throw new Error('sink down')
          },
        },
        { name: 'good', notify: (alert) => seen.push(alert.code) },
      ],
      logger: { error() {}, warn() {} },
    })
    expect(seen).toEqual(['QUEUE_STALLED'])
    expect(result.failed).toHaveLength(1)
    expect(result.delivered).toHaveLength(1)
  })

  it('zaehlt den Datenschutzstand ohne einen einzigen Personenbezug', () => {
    const lead = seed({ key: 'metrics-1' })
    forceStatus(lead.id, 'DELIVERED')
    setDueYesterday(lead.id)
    const metrics = repository.collectPrivacyMetrics('2026-09-09T10:00:00.000Z')
    expect(metrics).toMatchObject({ total: 1, anonymized: 0, dueForDeletion: 1, underLegalHold: 0 })
    expect(JSON.stringify(metrics)).not.toContain('example.com')
  })
})

describe('PT22.8 — manuelle Wiedervorlage bleibt der Weg zurueck', () => {
  it('ist ausdruecklich, protokolliert und wiederholungssicher', () => {
    const lead = seed({ key: 'recover-1' })
    db.prepare('UPDATE lead_outbox SET status = ? WHERE lead_id = ?').run(
      'FAILED_TERMINAL',
      lead.id,
    )
    forceStatus(lead.id, 'FAILED_TERMINAL')

    expect(() => repository.requeueForDelivery({ leadId: lead.id, actor: 'ops' })).toThrow()
    const first = repository.requeueForDelivery({
      leadId: lead.id,
      actor: 'ops',
      reason: 'Provider wieder erreichbar',
    })
    expect(first).toMatchObject({ requeued: true, status: 'QUEUED' })
    expect(repository.getEvents(lead.id).map((e) => e.eventType)).toContain('MANUAL_REQUEUE')

    const second = repository.requeueForDelivery({
      leadId: lead.id,
      actor: 'ops',
      reason: 'nochmal',
    })
    expect(second.requeued).toBe(false)
  })

  it('macht einen liegengebliebenen Vorgang ueber die Betriebsliste auffindbar', () => {
    const lead = seed({ key: 'recover-2' })
    forceStatus(lead.id, 'FAILED_TERMINAL')
    const rows = repository.findDeadLetters({ journey: 'support' })
    expect(rows.map((row) => row.leadId)).toContain(lead.id)
    // Eine Betriebsliste enthaelt keine Kontaktdaten.
    expect(JSON.stringify(rows)).not.toContain('example.com')
  })
})

describe('PT22.8 — Sicherung und begrenzter Restore-Smoke', () => {
  it('benennt den Sicherungsumfang so, dass er pruefbar ist', () => {
    const scope = describeBackupScope()
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")
      .all()
      .map((row) => row.name)
      .sort()
    // Jede existierende Tabelle steht im Umfang — sonst faellt bei einem
    // Restore genau die Tabelle heraus, die niemand aufgeschrieben hat.
    expect([...scope.database.restoreOrder].sort()).toEqual(tables)
    expect(scope.database.restoreOrder[0]).toBe('schema_migrations')
    expect(scope.filesystem.map((entry) => entry.what)).toContain('SUPPORT_UPLOAD_DIR')
  })

  it('sichert konsistent und stellt Zeilen, Migrationsstand und Warteschlange wieder her', () => {
    seed({ key: 'backup-1' })
    seed({ key: 'backup-2', email: 'ada@example.com' })
    const target = path.join(directory, 'backup', 'leads.backup.sqlite3')

    const backup = createLeadBackup({ db, destination: target })
    expect(backup.sizeBytes).toBeGreaterThan(0)

    const verified = verifyBackup({
      openDatabase: openLeadDatabase,
      sourceDb: db,
      backupPath: target,
    })
    expect(verified.ok).toBe(true)
    expect(verified.differences).toEqual([])
    expect(verified.migrationsMatch).toBe(true)
    expect(verified.pendingDeliveries).toBe(2)
    // Ausdruecklich nicht mehr als das.
    expect(verified.scope).toBe('AP22_BOUNDED_SMOKE')
  })

  it('ueberschreibt niemals eine bestehende Sicherung', () => {
    const target = path.join(directory, 'existing.sqlite3')
    fs.writeFileSync(target, 'alt')
    expect(() => createLeadBackup({ db, destination: target })).toThrow(/already exists/)
    expect(fs.readFileSync(target, 'utf8')).toBe('alt')
  })

  it('bemerkt eine unvollstaendige Sicherung, statt sie durchzuwinken', () => {
    seed({ key: 'backup-3' })
    const target = path.join(directory, 'partial.sqlite3')
    createLeadBackup({ db, destination: target })
    // Nach der Sicherung entsteht ein weiterer Vorgang: die Kopie ist damit
    // aelter als die Quelle, und genau das muss auffallen.
    seed({ key: 'backup-4', email: 'ada@example.com' })
    const verified = verifyBackup({
      openDatabase: openLeadDatabase,
      sourceDb: db,
      backupPath: target,
    })
    expect(verified.ok).toBe(false)
    expect(verified.differences.map((row) => row.table)).toContain('leads')
  })
})

describe('PT22.8 — Wartung laeuft auf dem Takt des Dispatchers', () => {
  it('fuehrt einen Job im Durchlauf aus und beachtet den Mindestabstand', async () => {
    let runs = 0
    const dispatcher = new LeadDispatcher({
      handles: [{ name: 'contact', processNext: async () => null }],
      jobs: [{ name: 'retention', everyMs: 60_000, run: async () => ({ runs: (runs += 1) }) }],
    })
    const first = await dispatcher.runOnce()
    expect(first.jobRuns.map((entry) => entry.name)).toEqual(['retention'])
    expect(runs).toBe(1)
    // Sofort danach nochmal: der Abstand ist nicht verstrichen.
    await dispatcher.runOnce()
    expect(runs).toBe(1)
  })

  it('laesst einen kaputten Job den Durchlauf nicht beenden', async () => {
    let delivered = 0
    const dispatcher = new LeadDispatcher({
      handles: [
        {
          name: 'contact',
          processNext: async () => (delivered++ === 0 ? { id: 'l1', journey: 'contact' } : null),
        },
      ],
      jobs: [
        {
          name: 'broken',
          run: async () => {
            throw new Error('job down')
          },
        },
      ],
      logger: { info() {}, warn() {} },
    })
    const result = await dispatcher.runOnce()
    expect(result.processed).toBe(1)
    expect(result.failures).toContain('broken')
  })

  it('verlangt ein aufrufbares run() statt es stillschweigend zu ignorieren', () => {
    expect(
      () =>
        new LeadDispatcher({
          handles: [{ name: 'contact', processNext: async () => null }],
          jobs: [{ name: 'kaputt' }],
        }),
    ).toThrow(/run\(\)/)
  })
})

describe('PT22.8 — Testdaten sind offensichtlich synthetisch', () => {
  it('verwendet in keiner Server-Testdatei eine Adresse ausserhalb der reservierten Domains', () => {
    // RFC 2606/6761: `example.*`, `.example`, `.invalid`, `.test`, `localhost`
    // koennen keiner realen Person gehoeren.
    const allowed = /@([a-z0-9-]+\.)*(example\.(com|org|net)|example|invalid|test|localhost)$/i
    const files = fs
      .readdirSync(path.join(ROOT, 'server'))
      .filter((name) => name.endsWith('.test.js'))
      .map((name) => path.join('server', name))
    files.push('server/lead-foundation/lead-foundation.test.js')

    // EINE begruendete Ausnahme: der produktive Team-Empfaenger. Er ist keine
    // Testidentitaet, sondern eine Zusicherung ueber die Konfiguration — der
    // Test prueft, dass die Bestellmail wirklich dort landet. Jede weitere
    // reale Adresse ist ein Befund.
    const configurationAssertions = new Set(['contact@polarisdx.net'])

    const offenders = []
    for (const file of files) {
      const text = fs.readFileSync(path.join(ROOT, file), 'utf8')
      for (const match of text.matchAll(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi)) {
        const address = match[0]
        if (allowed.test(address) || configurationAssertions.has(address.toLowerCase())) continue
        offenders.push(`${file}: ${address}`)
      }
    }
    expect(offenders).toEqual([])
  })
})
