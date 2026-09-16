// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import https from 'node:https'
import { createRequire } from 'node:module'

/**
 * AP26 PT26.4 — eine Vorschau-Instanz MIT Providerschluessel erzeugt keinen Provider-Aufruf.
 *
 * Nachgestellt wird der gemessene Preview-Betrieb: derselbe Schluessel wie in der
 * Produktion. Der Server laeuft in diesem Prozess mit `APP_ENV=preview`. Jeder Weg zum
 * Provider ist instrumentiert (SendGrid-Client, `https.request`, `setApiKey`); ein Aufruf
 * wuerde gezaehlt und scheitern, bevor er das Netz erreicht.
 */

const require = createRequire(import.meta.url)
const FAKE_KEY = 'SG.pt264-preview-fake-key-not-real'
const CONSENT = { processingConsent: true, consentAcceptedAt: '2026-09-15T09:00:00.000Z' }

let tmp
let server
let baseUrl
let db
const calls = { client: 0, https: 0, setApiKey: 0 }
const logs = []
let ip = 1

const post = async (route, body, key) => {
  const response = await fetch(`${baseUrl}${route}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': key,
      'X-Forwarded-For': `198.51.100.${(ip += 1)}`,
    },
    body: JSON.stringify(body),
  })
  return { status: response.status, json: await response.json() }
}

beforeAll(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt264-preview-'))
  Object.assign(process.env, {
    APP_ENV: 'preview',
    NODE_ENV: 'production',
    LEAD_DB_PATH: path.join(tmp, 'leads.sqlite3'),
    SUPPORT_UPLOAD_DIR: path.join(tmp, 'uploads'),
    SENDGRID_API_KEY: FAKE_KEY,
    CONTACT_RECEIVER: 'team@polarisdx.example',
    SENDER_EMAIL: 'web@polarisdx.example',
  })
  for (const name of ['DRY_RUN', 'DEPLOY_ENV', 'FRONTEND_URL']) delete process.env[name]
  for (const level of ['log', 'info', 'warn', 'error']) {
    console[level] = (...args) =>
      logs.push(args.map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg))).join(' '))
  }

  const client = require('@sendgrid/client')
  client.request = async () => {
    calls.client += 1
    throw new Error('provider call in preview')
  }
  const originalHttpsRequest = https.request
  https.request = (...args) => {
    const target = String(args[0]?.hostname ?? args[0]?.host ?? args[0] ?? '')
    if (target.includes('sendgrid')) {
      calls.https += 1
      throw new Error('provider call in preview')
    }
    return originalHttpsRequest(...args)
  }
  const mail = require('@sendgrid/mail')
  const originalSetApiKey = mail.setApiKey.bind(mail)
  mail.setApiKey = (key) => {
    calls.setApiKey += 1
    return originalSetApiKey(key)
  }

  const { app } = require('./server.js')
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve)
  })
  baseUrl = `http://127.0.0.1:${server.address().port}`
}, 30_000)

afterAll(async () => {
  db?.close()
  await new Promise((resolve) => server?.close(resolve))
  fs.rmSync(tmp, { recursive: true, force: true })
})

describe('PT26.4 — Preview-Isolation mit Produktions-aehnlichem Schluessel', () => {
  it('nimmt Vorgaenge an, stellt aber ueber keine Journey zu', async () => {
    const results = [
      await post(
        '/api/contact',
        {
          name: 'Dr. Preview',
          email: 'preview@praxis.example',
          message: 'PT26.4',
          locale: 'de',
          ...CONSENT,
        },
        'pt264-preview-contact',
      ),
      await post(
        '/api/support',
        {
          name: 'Dr. Preview',
          email: 'preview@praxis.example',
          udi: 'IGL-1',
          swVersion: '1.0',
          issueType: 'software',
          subject: 'PT26.4',
          locale: 'de',
          attachments: [],
          ...CONSENT,
        },
        'pt264-preview-support',
      ),
      await post(
        '/api/epigenetics-inquiry',
        {
          name: 'Dr. Preview',
          email: 'preview@praxis.example',
          organization: 'Praxis',
          facilityType: 'practice',
          locale: 'de',
          ...CONSENT,
        },
        'pt264-preview-epigenetics',
      ),
    ]
    for (const result of results) {
      expect(result.status, JSON.stringify(result.json.code)).toBe(202)
      expect(result.json.state).not.toBe('DELIVERED')
    }

    const Database = require('better-sqlite3')
    db = new Database(process.env.LEAD_DB_PATH, { readonly: true, fileMustExist: true })
    const rows = db.prepare('SELECT journey, status, last_error_class FROM leads').all()
    expect(rows).toHaveLength(3)
    for (const row of rows) {
      expect(row.status, row.journey).not.toBe('DELIVERED')
      expect(row.last_error_class, row.journey).toBe('DRY_RUN')
    }
  })

  it('kein Provider-Aufruf, kein Schluessel im Mail-Client, Befund im Log', () => {
    expect(calls).toEqual({ client: 0, https: 0, setApiKey: 0 })
    const joined = logs.join('\n')
    expect(joined).toContain('DRY_RUN_WITH_PROVIDER_CREDENTIAL')
    expect(joined).not.toContain(FAKE_KEY)
    expect(joined).not.toContain('preview@praxis.example')
  })
})
