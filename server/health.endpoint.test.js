// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fork } from 'node:child_process'
import { fileURLToPath } from 'node:url'

/**
 * AP28 PT28.2 — `GET /api/health` als echter Prozess.
 *
 * Der Compose-Healthcheck und das Deploy-Gate fragen diesen Endpunkt. Er muss
 * die Lead-Datenbank pruefen (ohne Persistenz kein gesundes Backend), darf
 * dabei nichts schreiben (DEP-48 / D-T21) und nichts Internes preisgeben.
 */

const here = path.dirname(fileURLToPath(import.meta.url))

const startServer = async (env, port) => {
  const child = fork(path.join(here, 'server.js'), { env, stdio: 'pipe' })
  const baseUrl = `http://127.0.0.1:${port}`
  const deadline = Date.now() + 20_000
  for (;;) {
    try {
      await fetch(`${baseUrl}/api/ap28-bereit`)
      return { child, baseUrl }
    } catch {
      if (Date.now() > deadline) throw new Error('server did not start')
      await new Promise((resolve) => setTimeout(resolve, 150))
    }
  }
}

describe('AP28 PT28.2 backend health', () => {
  let directory
  let server
  let databasePath

  beforeAll(async () => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-ap28-health-'))
    databasePath = path.join(directory, 'leads.sqlite3')
    const env = {
      ...process.env,
      PORT: String(4900 + (process.pid % 90)),
      LISTEN_HOST: '127.0.0.1',
      LEAD_DB_PATH: databasePath,
      SUPPORT_UPLOAD_DIR: path.join(directory, 'uploads'),
      LEAD_DISPATCHER_DISABLED: '1',
      APP_ENV: 'preview',
    }
    delete env.NODE_ENV
    server = await startServer(env, env.PORT)
  }, 40_000)

  afterAll(() => {
    server?.child.kill()
    fs.rmSync(directory, { recursive: true, force: true })
  })

  it('answers 200 with database ok and nothing internal', async () => {
    // Der Start legt die Datenbank an und migriert sie; danach liest der
    // Healthcheck nur.
    expect(fs.existsSync(databasePath)).toBe(true)

    const response = await fetch(`${server.baseUrl}/api/health`)
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    const body = await response.json()
    expect(body.status).toBe('ok')
    expect(body.database).toBe('ok')
    expect(body.migrations).toBeGreaterThan(0)
    const text = JSON.stringify(body)
    expect(text).not.toContain(directory)
    expect(text).not.toMatch(/key|secret|token|sqlite/i)
  })

  it('has no side effect on the lead tables', async () => {
    const { openLeadDatabase } = await import('./lead-foundation/index.js')
    const count = () => {
      const db = openLeadDatabase({ filename: databasePath, readonly: true })
      try {
        return ['leads', 'lead_outbox', 'lead_events'].map(
          (table) => db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get().c,
        )
      } finally {
        db.close()
      }
    }
    const before = count()
    for (let i = 0; i < 3; i += 1) await fetch(`${server.baseUrl}/api/health`)
    expect(count()).toEqual(before)
  })

  it('reports 503 without exposing the error when the database is unreadable', async () => {
    fs.rmSync(directory, { recursive: true, force: true })
    const response = await fetch(`${server.baseUrl}/api/health`)
    expect(response.status).toBe(503)
    const body = await response.json()
    expect(body).toEqual({ status: 'unavailable', database: 'unavailable' })
  })
})
