// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'

/**
 * AP28 PT28.5 — Sicherung und Restore-Pruefung (D-T5/D-T6) auf Code-Ebene.
 * Der Restore-Test mit Container und Volume laeuft ueber `deploy.sh
 * restore-test`; hier wird bewiesen, dass Sicherung und Pruefung zusammen-
 * passen und eine beschaedigte Sicherung erkannt wird.
 */

const require = createRequire(import.meta.url)
const { create, verify } = require('./backup.js')
const { openLeadDatabase } = require('../lead-foundation')

const directories = []
const tempDir = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-ap28-backup-'))
  directories.push(dir)
  return dir
}

const withEnv = (env, fn) => {
  const previous = { ...process.env }
  Object.assign(process.env, env)
  try {
    return fn()
  } finally {
    process.env = previous
  }
}

const seed = (dir) => {
  const dbPath = path.join(dir, 'live', 'leads.sqlite3')
  const uploads = path.join(dir, 'live', 'uploads')
  fs.mkdirSync(path.join(uploads, 'case-1'), { recursive: true })
  fs.writeFileSync(path.join(uploads, 'case-1', 'anhang.pdf'), 'pdf')
  const db = openLeadDatabase({ filename: dbPath })
  db.close()
  return { dbPath, uploads }
}

afterEach(() => {
  for (const dir of directories.splice(0)) fs.rmSync(dir, { recursive: true, force: true })
})

describe('AP28 PT28.5 lead backup', () => {
  it('creates a consistent backup that verifies against its manifest', () => {
    const dir = tempDir()
    const { dbPath, uploads } = seed(dir)
    const target = path.join(dir, 'backup')
    const manifest = withEnv({ LEAD_DB_PATH: dbPath, SUPPORT_UPLOAD_DIR: uploads }, () =>
      create(target),
    )
    expect(manifest.database.migrations.length).toBeGreaterThan(0)
    expect(manifest.uploads.files).toBe(1)
    expect(JSON.stringify(manifest)).not.toContain(dir)

    const result = verify(target)
    expect(result).toMatchObject({ ok: true, problems: [] })
  })

  it('refuses to overwrite an existing backup', () => {
    const dir = tempDir()
    const { dbPath } = seed(dir)
    const target = path.join(dir, 'backup')
    fs.mkdirSync(target)
    expect(() => withEnv({ LEAD_DB_PATH: dbPath }, () => create(target))).toThrow(/existiert/)
  })

  it('detects a tampered or incomplete backup', () => {
    const dir = tempDir()
    const { dbPath, uploads } = seed(dir)
    const target = path.join(dir, 'backup')
    withEnv({ LEAD_DB_PATH: dbPath, SUPPORT_UPLOAD_DIR: uploads }, () => create(target))
    fs.rmSync(path.join(target, 'support-uploads'), { recursive: true })
    const manifestPath = path.join(target, 'manifest.json')
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    manifest.database.rows.leads = 7
    fs.writeFileSync(manifestPath, JSON.stringify(manifest))

    const result = verify(target)
    expect(result.ok).toBe(false)
    expect(result.problems.join(' ')).toMatch(/leads: erwartet 7/)
    expect(result.problems.join(' ')).toMatch(/Anhaenge/)
  })
})
