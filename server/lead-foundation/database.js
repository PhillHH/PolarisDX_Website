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

  for (const version of migrations) {
    if (!appliedVersions.has(version)) {
      migrate.immediate(version, fs.readFileSync(path.join(migrationsDirectory, version), 'utf8'))
    }
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
