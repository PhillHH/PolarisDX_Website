const fs = require('node:fs')
const path = require('node:path')
const Database = require('better-sqlite3')

const MIGRATIONS_DIRECTORY = path.join(__dirname, 'migrations')

function resolveLeadDatabasePath(env = process.env) {
  if (env.LEAD_DB_PATH) return path.resolve(env.LEAD_DB_PATH)
  if (env.NODE_ENV === 'production') {
    throw new Error('LEAD_DB_PATH is required in production')
  }
  return path.join(__dirname, '..', 'data', 'leads.sqlite3')
}

function applyMigrations(db, migrationsDirectory = MIGRATIONS_DIRECTORY) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    )
  `)

  const applied = db.prepare('SELECT version FROM schema_migrations').all()
  const appliedVersions = new Set(applied.map(({ version }) => version))
  const migrations = fs
    .readdirSync(migrationsDirectory)
    .filter((name) => name.endsWith('.sql'))
    .sort()

  const migrate = db.transaction((version, sql) => {
    db.exec(sql)
    db.prepare('INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)').run(
      version,
      new Date().toISOString(),
    )
  })

  const pending = migrations.filter((version) => !appliedVersions.has(version))
  if (pending.length === 0) return migrations

  /**
   * AP22 PT22.2 — Fremdschluessel waehrend der Migration abschalten.
   *
   * SQLite kann eine CHECK-Bedingung nicht per ALTER TABLE aendern; ein
   * neuer Statuswert verlangt deshalb einen Tabellenumbau. Bliebe dabei
   * `foreign_keys` aktiv, wuerde `DROP TABLE leads` die Kindzeilen in
   * `lead_outbox`, `lead_events` und `resource_entitlements` per ON DELETE
   * CASCADE mitloeschen — also genau den Datenverlust erzeugen, den eine
   * Migration verhindern soll.
   *
   * `PRAGMA foreign_keys` ist innerhalb einer Transaktion wirkungslos,
   * deshalb wird es AUSSERHALB gesetzt. Nach dem Lauf prueft
   * `foreign_key_check`, dass keine haengende Referenz zurueckbleibt.
   */
  const foreignKeysWereOn = db.pragma('foreign_keys', { simple: true }) === 1
  if (foreignKeysWereOn) db.pragma('foreign_keys = OFF')
  try {
    for (const version of pending) {
      migrate.immediate(version, fs.readFileSync(path.join(migrationsDirectory, version), 'utf8'))
    }
  } finally {
    if (foreignKeysWereOn) db.pragma('foreign_keys = ON')
  }

  const dangling = db.pragma('foreign_key_check')
  if (dangling.length > 0) {
    throw new Error(
      `migration left ${dangling.length} dangling foreign key reference(s): ${dangling
        .map((row) => `${row.table}#${row.rowid}`)
        .slice(0, 5)
        .join(', ')}`,
    )
  }

  return migrations
}

function openLeadDatabase({ filename, readonly = false } = {}) {
  const resolvedFilename = filename || resolveLeadDatabasePath()
  if (resolvedFilename !== ':memory:' && !readonly) {
    fs.mkdirSync(path.dirname(resolvedFilename), { recursive: true, mode: 0o700 })
  }

  const db = new Database(resolvedFilename, { readonly })
  db.pragma('foreign_keys = ON')
  db.pragma('busy_timeout = 5000')
  if (!readonly && resolvedFilename !== ':memory:') db.pragma('journal_mode = WAL')
  if (!readonly) applyMigrations(db)
  return db
}

module.exports = { applyMigrations, openLeadDatabase, resolveLeadDatabasePath }
