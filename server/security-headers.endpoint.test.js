// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fork } from 'node:child_process'
import { fileURLToPath } from 'node:url'

/**
 * AP26 PT26.1 — Security-Baseline der API als echter Prozess.
 *
 * Der Server laeuft OHNE NODE_ENV, genau wie der Compose-Dienst: in diesem Modus
 * lieferte Express vor PT26.1 bei kaputtem JSON und zu grosser Nutzlast seine
 * HTML-Fehlerseite mit Stacktrace und Dateipfaden, und jede Antwort trug
 * `X-Powered-By: Express`.
 */

const here = path.dirname(fileURLToPath(import.meta.url))

describe('AP26 PT26.1 API security baseline', () => {
  let directory
  let child
  let baseUrl

  beforeAll(async () => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt261-api-'))
    const port = 4600 + (process.pid % 300)
    const env = {
      ...process.env,
      PORT: String(port),
      LISTEN_HOST: '127.0.0.1',
      LEAD_DB_PATH: path.join(directory, 'leads.sqlite3'),
      SUPPORT_UPLOAD_DIR: path.join(directory, 'uploads'),
      LEAD_DISPATCHER_DISABLED: '1',
      APP_ENV: 'preview',
    }
    delete env.NODE_ENV
    child = fork(path.join(here, 'server.js'), { env, stdio: 'pipe' })
    baseUrl = `http://127.0.0.1:${port}`

    const deadline = Date.now() + 20_000
    for (;;) {
      try {
        await fetch(`${baseUrl}/api/pt26-bereit`)
        break
      } catch {
        if (Date.now() > deadline) throw new Error('server did not start')
        await new Promise((resolve) => setTimeout(resolve, 150))
      }
    }
  }, 40_000)

  afterAll(() => {
    child?.kill()
    fs.rmSync(directory, { recursive: true, force: true })
  })

  const expectSafeJson = async (response, { status, code }) => {
    expect(response.status).toBe(status)
    expect(response.headers.get('x-powered-by')).toBeNull()
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
    expect(response.headers.get('content-type')).toContain('application/json')
    const text = await response.text()
    expect(text).not.toMatch(/\bat\s+\S+\s+\(|node_modules|\/home\/|\/app\/|Error:|<html/i)
    if (code) expect(JSON.parse(text)).toEqual({ accepted: false, code })
    return text
  }

  it('beantwortet unbekannte API-Pfade mit JSON-404 statt Express-Standardseite', async () => {
    await expectSafeJson(await fetch(`${baseUrl}/api/pt26-unbekannt`), {
      status: 404,
      code: 'NOT_FOUND',
    })
  })

  it('verraet bei kaputtem JSON weder Stacktrace noch Pfad', async () => {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.61' },
      body: '{"name":',
    })
    await expectSafeJson(response, { status: 400, code: 'INVALID_JSON' })
  })

  it('beantwortet eine zu grosse Nutzlast mit 413 ohne Interna', async () => {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.62' },
      body: JSON.stringify({ padding: 'a'.repeat(11 * 1024 * 1024) }),
    })
    await expectSafeJson(response, { status: 413, code: 'PAYLOAD_TOO_LARGE' })
  })

  it('setzt die Baseline auch auf fachliche 400-Antworten einer Journey', async () => {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.63' },
      body: '{}',
    })
    const text = await expectSafeJson(response, { status: 400 })
    expect(JSON.parse(text).success).toBe(false)
  })
})
