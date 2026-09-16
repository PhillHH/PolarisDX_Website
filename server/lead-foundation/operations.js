const fs = require('node:fs')
const path = require('node:path')

const { LEAD_STATUSES, OUTBOX_STATUSES } = require('./constants')
const { describeRuntimeIsolation } = require('./environment')

/**
 * AP22 PT22.8 — Betriebssicht, Alarme, Sicherung.
 *
 * Kennzahlen gab es seit PT22.4 (`collectQueueMetrics`). Was fehlte, war der
 * Schritt davon zur HANDLUNG: eine Zahl in einer JSON-Ausgabe alarmiert
 * niemanden. Dieses Modul bewertet die Kennzahlen gegen Schwellen und macht
 * aus den Zustaenden, in denen ein Lead verloren geht oder liegen bleibt,
 * benannte Alarme mit einem Empfaenger.
 *
 * Absichtlich klein gehalten: kein Dashboardprodukt, kein Metrik-Backend.
 * Die Betriebssicht ist die CLI (`scripts/lead-ops.mjs`), die Alarmsenke ist
 * einspeisbar. AP28 haengt daran ein echtes Monitoring.
 */

/** Schwellen, ab denen ein Zustand gemeldet wird. Alle ueberschreibbar. */
const DEFAULT_ALERT_THRESHOLDS = Object.freeze({
  /** Ein einziger endgueltig gescheiterter Vorgang ist bereits ein Alarm. */
  failedTerminal: 1,
  reconciliationRequired: 1,
  /** Wartende Zustellung, die aelter ist als das hier, laeuft nicht mehr. */
  queueAgeMs: 30 * 60_000,
  queueDepth: 50,
  /** Faellige Loeschungen, die niemand ausfuehrt. */
  retentionOverdue: 1,
})

const SEVERITIES = Object.freeze({ CRITICAL: 'critical', WARNING: 'warning' })

/**
 * Aus Kennzahlen werden Alarme.
 *
 * Die Auswahl folgt einer Frage: geht hier ein Lead verloren oder bleibt er
 * ungelesen liegen? Alles andere ist eine Zahl, kein Alarm.
 */
function evaluateAlerts({
  queueMetrics,
  privacyMetrics = null,
  isolation = null,
  thresholds = {},
} = {}) {
  const limits = { ...DEFAULT_ALERT_THRESHOLDS, ...thresholds }
  const alerts = []
  const leads = queueMetrics?.leads ?? {}

  const failed = leads[LEAD_STATUSES.FAILED_TERMINAL] ?? 0
  if (failed >= limits.failedTerminal) {
    alerts.push({
      code: 'LEADS_FAILED_TERMINAL',
      severity: SEVERITIES.CRITICAL,
      count: failed,
      // Der Vorgang ist gespeichert, aber niemand hat ihn je gesehen.
      detail: 'Endgueltig nicht zugestellte Vorgaenge — manuelle Wiedervorlage noetig.',
    })
  }

  const reconcile = leads[LEAD_STATUSES.RECONCILIATION_REQUIRED] ?? 0
  if (reconcile >= limits.reconciliationRequired) {
    alerts.push({
      code: 'LEADS_RECONCILIATION_REQUIRED',
      severity: SEVERITIES.CRITICAL,
      count: reconcile,
      detail: 'Providerergebnis unbekannt — vor jedem Replay pruefen, ob die Nachricht ankam.',
    })
  }

  const providerless = (queueMetrics?.providerFailures ?? []).find(
    (row) => row.errorClass === 'NO_PROVIDER_CONFIGURED',
  )
  if (providerless?.count > 0) {
    alerts.push({
      code: 'NO_PROVIDER_CONFIGURED',
      severity: SEVERITIES.CRITICAL,
      count: providerless.count,
      detail: 'Fuer mindestens ein Ziel ist kein Adapter konfiguriert; Vorgaenge bleiben liegen.',
    })
  }

  const age = queueMetrics?.queue?.oldestAgeMs ?? 0
  if (age > limits.queueAgeMs) {
    alerts.push({
      code: 'QUEUE_STALLED',
      severity: SEVERITIES.CRITICAL,
      ageMs: age,
      detail:
        'Aeltester faelliger Auftrag ueberschreitet die Altersgrenze — laeuft der Dispatcher?',
    })
  }

  const depth = queueMetrics?.queue?.depth ?? 0
  if (depth >= limits.queueDepth) {
    alerts.push({
      code: 'QUEUE_DEPTH_HIGH',
      severity: SEVERITIES.WARNING,
      count: depth,
      detail: 'Ungewoehnlich viele faellige Auftraege.',
    })
  }

  if ((privacyMetrics?.dueForDeletion ?? 0) >= limits.retentionOverdue) {
    alerts.push({
      code: 'RETENTION_OVERDUE',
      severity: SEVERITIES.WARNING,
      count: privacyMetrics.dueForDeletion,
      detail: 'Faellige Loeschungen, die kein Lauf ausgefuehrt hat.',
    })
  }

  for (const finding of isolation?.findings ?? []) {
    alerts.push({
      code: finding.code,
      severity: finding.severity === 'critical' ? SEVERITIES.CRITICAL : SEVERITIES.WARNING,
      detail: finding.detail,
    })
  }

  return alerts
}

/**
 * Alarme an die konfigurierten Senken geben.
 *
 * Eine Senke, die wirft, darf die uebrigen nicht verhindern — ein kaputter
 * Webhook waere sonst ein stiller Ausfall der gesamten Alarmierung.
 */
function dispatchAlerts(alerts, { sinks = [], logger = { warn() {}, error() {} } } = {}) {
  const delivered = []
  const failed = []
  for (const alert of alerts) {
    for (const sink of sinks) {
      try {
        sink.notify(alert)
        delivered.push({ sink: sink.name ?? 'unnamed', code: alert.code })
      } catch (error) {
        failed.push({ sink: sink.name ?? 'unnamed', code: alert.code })
        logger.error('lead_alert_sink_failed', {
          sink: typeof sink.name === 'string' ? sink.name.slice(0, 64) : 'unnamed',
          errorClass: error?.code || error?.name || 'UNCLASSIFIED_ERROR',
        })
      }
    }
  }
  return { alerts: alerts.length, delivered, failed }
}

/** Die Standardsenke: strukturiert ins Log, ohne einen einzigen Personenbezug. */
function createLoggerAlertSink(logger = console) {
  return {
    name: 'logger',
    notify(alert) {
      const line = { code: alert.code, severity: alert.severity }
      if (Number.isInteger(alert.count)) line.count = alert.count
      if (Number.isInteger(alert.ageMs)) line.ageMs = alert.ageMs
      logger.warn('[lead-alert]', JSON.stringify(line))
    },
  }
}

// =============================================================================
// Sicherung und Wiederherstellung — die AP22-Grenze
// =============================================================================

/**
 * Was gesichert werden muss, damit ein Lead einen Ausfall ueberlebt.
 *
 * Bewusst als Datenstruktur und nicht als Prosa: ein Backup-Umfang, der nur
 * in einem Dokument steht, ist nicht pruefbar. Ein Test liest das hier und
 * vergleicht es mit den Tabellen, die es wirklich gibt.
 */
function describeBackupScope() {
  return Object.freeze({
    database: Object.freeze({
      // Reihenfolge = Wiederherstellungsreihenfolge. `leads` zuerst, weil die
      // drei anderen Tabellen per FOREIGN KEY daran haengen; die Sicherung
      // ueber `VACUUM INTO` haelt das ohnehin konsistent, aber ein manueller
      // Teilrestore muss die Reihenfolge kennen.
      restoreOrder: Object.freeze([
        'schema_migrations',
        'leads',
        'lead_outbox',
        'lead_events',
        'resource_entitlements',
      ]),
      walMode: true,
      note: 'WAL: eine Dateikopie ohne Checkpoint ist unvollstaendig. VACUUM INTO ist konsistent.',
    }),
    filesystem: Object.freeze([
      Object.freeze({
        what: 'SUPPORT_UPLOAD_DIR',
        why: 'Support-Anhaenge liegen auf Platte; die Datenbank haelt nur Metadaten.',
        required: true,
      }),
    ]),
    excluded: Object.freeze([
      Object.freeze({
        what: 'Provider-Secrets',
        why: 'Gehoeren in die Secrets-Verwaltung, nicht in ein Datenbackup. Owner AP28.',
      }),
      Object.freeze({
        what: 'Download-Token',
        why: 'Werden nie gespeichert (nur sha256) und koennen deshalb nicht gesichert werden.',
      }),
    ]),
  })
}

/**
 * Konsistente Sicherung der Lead-Datenbank.
 *
 * `VACUUM INTO` statt Dateikopie: die Datenbank laeuft im WAL-Modus, und
 * eine `cp`-Kopie waere ohne Checkpoint ein Stand irgendwo zwischen zwei
 * Transaktionen.
 */
function createLeadBackup({ db, destination }) {
  if (!destination) throw new TypeError('destination is required')
  const target = path.resolve(destination)
  if (fs.existsSync(target)) throw new Error('backup destination already exists')
  fs.mkdirSync(path.dirname(target), { recursive: true, mode: 0o700 })
  db.prepare('VACUUM INTO ?').run(target)
  return { destination: target, sizeBytes: fs.statSync(target).size }
}

/**
 * Begrenzter Wiederherstellungs-Smoke — ausdruecklich NICHT AP28.
 *
 * Geprueft wird, was auf AP22-Ebene beweisbar ist: die Sicherung laesst sich
 * oeffnen, sie traegt denselben Migrationsstand, dieselben Zeilen, und die
 * Warteschlange ist danach wieder bedienbar. Was hier NICHT bewiesen wird:
 * ein Produktionsrestore mit Volume, Downtime und Reihenfolge ueber mehrere
 * Dienste. Das ist AP28 PT28.5 und wird hier nicht behauptet.
 */
function verifyBackup({ openDatabase, sourceDb, backupPath }) {
  const tables = describeBackupScope().database.restoreOrder
  const countOf = (database, table) =>
    database.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count

  const restored = openDatabase({ filename: backupPath, readonly: true })
  try {
    const differences = []
    for (const table of tables) {
      const expected = countOf(sourceDb, table)
      const actual = countOf(restored, table)
      if (expected !== actual) differences.push({ table, expected, actual })
    }
    const migrations = restored
      .prepare('SELECT version FROM schema_migrations ORDER BY version')
      .all()
      .map((row) => row.version)
    const sourceMigrations = sourceDb
      .prepare('SELECT version FROM schema_migrations ORDER BY version')
      .all()
      .map((row) => row.version)

    const claimable = restored
      .prepare(`SELECT COUNT(*) AS count FROM lead_outbox WHERE status IN (?, ?)`)
      .get(OUTBOX_STATUSES.PENDING, OUTBOX_STATUSES.RETRY_PENDING).count

    return {
      ok: differences.length === 0 && migrations.join() === sourceMigrations.join(),
      differences,
      migrations,
      migrationsMatch: migrations.join() === sourceMigrations.join(),
      pendingDeliveries: claimable,
      scope: 'AP22_BOUNDED_SMOKE',
    }
  } finally {
    restored.close()
  }
}

module.exports = {
  DEFAULT_ALERT_THRESHOLDS,
  SEVERITIES,
  createLeadBackup,
  createLoggerAlertSink,
  describeBackupScope,
  describeRuntimeIsolation,
  dispatchAlerts,
  evaluateAlerts,
  verifyBackup,
}
