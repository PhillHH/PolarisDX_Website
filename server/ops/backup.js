/**
 * AP28 PT28.5 — Sicherung und Wiederherstellungspruefung der Lead-Daten.
 *
 * Laeuft IM Backend-Container (dort liegen better-sqlite3 und das Volume),
 * aufgerufen von `deploy.sh backup` bzw. `deploy.sh restore-test`:
 *
 *   node ops/backup.js create <zielordner>   konsistente Sicherung + Manifest
 *   node ops/backup.js verify <ordner>       Restore-Pruefung gegen das Manifest
 *
 * Umfang = `describeBackupScope()` (AP22): die Lead-Datenbank per `VACUUM INTO`
 * (WAL-sicher, keine Dateikopie) und die Support-Anhaenge aus SUPPORT_UPLOAD_DIR.
 * Secrets und Download-Token gehoeren nicht in eine Datensicherung.
 *
 * Das Manifest haelt fest, was die Wiederherstellung beweisen muss: Migrations-
 * stand, Zeilen je Tabelle, Pruefsumme der Datenbankdatei und die Anzahl der
 * Anhaenge. Es enthaelt keine personenbezogenen Inhalte (DEP-52).
 */

const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')

const { createLeadBackup, describeBackupScope, openLeadDatabase } = require('../lead-foundation')

const DB_FILE = 'leads.sqlite3'
const UPLOADS_DIR = 'support-uploads'
const MANIFEST = 'manifest.json'

const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')

const countFiles = (dir) => {
  if (!fs.existsSync(dir)) return 0
  let total = 0
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    total += entry.isDirectory() ? countFiles(path.join(dir, entry.name)) : 1
  }
  return total
}

const describeDatabase = (db) => {
  const tables = describeBackupScope().database.restoreOrder
  return {
    migrations: db
      .prepare('SELECT version FROM schema_migrations ORDER BY version')
      .all()
      .map((row) => row.version),
    rows: Object.fromEntries(
      tables.map((table) => [table, db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get().c]),
    ),
  }
}

function create(target) {
  if (!target) throw new TypeError('Zielordner fehlt')
  const directory = path.resolve(target)
  if (fs.existsSync(directory)) throw new Error('Zielordner existiert bereits')
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 })

  const db = openLeadDatabase({ readonly: true })
  try {
    createLeadBackup({ db, destination: path.join(directory, DB_FILE) })
  } finally {
    db.close()
  }
  // Gezaehlt wird in der Sicherung selbst, nicht in der laufenden Datenbank:
  // das Manifest beschreibt genau den gesicherten Stand, auch wenn parallel
  // Leads eingehen (`VACUUM INTO` laeuft nicht in einer Transaktion).
  const copy = openLeadDatabase({ filename: path.join(directory, DB_FILE), readonly: true })
  let state
  try {
    state = describeDatabase(copy)
  } finally {
    copy.close()
  }

  const uploadSource = process.env.SUPPORT_UPLOAD_DIR
  if (uploadSource && fs.existsSync(uploadSource)) {
    fs.cpSync(uploadSource, path.join(directory, UPLOADS_DIR), { recursive: true })
  }

  const manifest = {
    format: 'polarisdx-lead-backup/1',
    createdAt: new Date().toISOString(),
    release: process.env.RELEASE_SHA || 'unknown',
    database: { file: DB_FILE, sha256: sha256(path.join(directory, DB_FILE)), ...state },
    uploads: { directory: UPLOADS_DIR, files: countFiles(path.join(directory, UPLOADS_DIR)) },
  }
  fs.writeFileSync(path.join(directory, MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`, {
    mode: 0o600,
  })
  return manifest
}

function verify(source) {
  const directory = path.resolve(source || '')
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, MANIFEST), 'utf8'))
  const dbFile = path.join(directory, manifest.database.file)
  const problems = []

  if (sha256(dbFile) !== manifest.database.sha256)
    problems.push('Pruefsumme der Datenbank weicht ab')

  const db = openLeadDatabase({ filename: dbFile, readonly: true })
  let actual
  try {
    const integrity = db.pragma('integrity_check', { simple: true })
    if (integrity !== 'ok') problems.push(`integrity_check: ${integrity}`)
    if (db.pragma('foreign_key_check').length > 0) problems.push('haengende Fremdschluessel')
    actual = describeDatabase(db)
  } finally {
    db.close()
  }

  if (actual.migrations.join() !== manifest.database.migrations.join()) {
    problems.push('Migrationsstand weicht ab')
  }
  for (const [table, expected] of Object.entries(manifest.database.rows)) {
    if (actual.rows[table] !== expected) {
      problems.push(`${table}: erwartet ${expected}, gefunden ${actual.rows[table]}`)
    }
  }
  const uploads = countFiles(path.join(directory, manifest.uploads.directory))
  if (uploads !== manifest.uploads.files) {
    problems.push(`Anhaenge: erwartet ${manifest.uploads.files}, gefunden ${uploads}`)
  }

  return {
    ok: problems.length === 0,
    problems,
    rows: actual.rows,
    migrations: actual.migrations.length,
  }
}

if (require.main === module) {
  const [command, target] = process.argv.slice(2)
  try {
    if (command === 'create') {
      const manifest = create(target)
      console.log(
        JSON.stringify({ ok: true, rows: manifest.database.rows, uploads: manifest.uploads.files }),
      )
    } else if (command === 'verify') {
      const result = verify(target)
      console.log(JSON.stringify(result))
      process.exitCode = result.ok ? 0 : 1
    } else {
      console.error('Aufruf: node ops/backup.js create|verify <ordner>')
      process.exitCode = 2
    }
  } catch (error) {
    console.error(JSON.stringify({ ok: false, error: error.message }))
    process.exitCode = 1
  }
}

module.exports = { create, verify }
