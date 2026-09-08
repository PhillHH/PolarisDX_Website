// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-epi-endpoint-'))
const databasePath = path.join(directory, 'leads.sqlite3')
process.env.LEAD_DB_PATH = databasePath
process.env.NODE_ENV = 'test'

const { app } = require('./server')
const { openLeadDatabase } = require('./lead-foundation')

describe('POST /api/epigenetics-inquiry', () => {
  let server
  let baseUrl

  beforeAll(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        baseUrl = `http://127.0.0.1:${server.address().port}`
        resolve()
      })
    })
  })

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve))
    fs.rmSync(directory, { recursive: true, force: true })
  })

  it('accepts a real request only after persistence and exposes provider truth', async () => {
    const response = await fetch(`${baseUrl}/api/epigenetics-inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': 'http-request-1' },
      body: JSON.stringify({
        name: 'Ada Example',
        email: 'ada@example.test',
        organization: 'Example Practice',
        facilityType: 'practice',
        casesPerMonth: '1-10',
        message: 'Please contact me.',
        locale: 'en',
        source: 'epigenetics',
        campaign: 'endpoint-test',
        panel: 'metabolic-health',
        focus: 'nutrition',
        originRoute: '/en/epigenetics?panel=metabolic-health&focus=nutrition',
        processingConsent: true,
        marketingConsent: false,
        consentAcceptedAt: '2026-09-01T10:00:00.000Z',
      }),
    })
    expect(response.status).toBe(202)
    expect(await response.json()).toMatchObject({
      accepted: true,
      status: 'FAILED_TERMINAL',
      providerConfigured: false,
    })

    const db = openLeadDatabase({ filename: databasePath })
    const row = db.prepare('SELECT journey, status, context_json, consent_json FROM leads').get()
    db.close()
    expect(row.journey).toBe('epigenetics_inquiry')
    expect(row.status).toBe('FAILED_TERMINAL')
    expect(JSON.parse(row.context_json)).toMatchObject({
      locale: 'en',
      source: 'epigenetics',
      campaign: 'endpoint-test',
      panel: 'metabolic-health',
      focus: 'nutrition',
    })
    expect(JSON.parse(row.consent_json)).toMatchObject({
      processingAccepted: true,
      marketing: 'DENIED',
    })
  })

  it('rejects missing processing consent and missing idempotency without persistence', async () => {
    const response = await fetch(`${baseUrl}/api/epigenetics-inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': 'http-request-2' },
      body: JSON.stringify({
        name: 'Ada Example',
        email: 'ada@example.test',
        organization: 'Example Practice',
        facilityType: 'practice',
        locale: 'de',
        processingConsent: false,
      }),
    })
    expect(response.status).toBe(400)
    expect(await response.json()).toMatchObject({
      accepted: false,
      code: 'PROCESSING_CONSENT_REQUIRED',
    })
  })
})
