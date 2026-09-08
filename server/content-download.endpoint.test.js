// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fork } from 'node:child_process'
import { fileURLToPath } from 'node:url'

/**
 * PT19.3 — die HTTP-Schicht.
 *
 * Statuscodes, Header, Rate Limit und Honeypot entstehen erst in `server.js`
 * und waeren mit reinen Service-Tests unbelegt. Der Server laeuft hier als
 * echter Prozess gegen ein Fixture-Registry und eine temporaere Datenbank.
 */

const here = path.dirname(fileURLToPath(import.meta.url))
const GATED_ID = 'rsc-fixture-001'
const RELATIVE_PATH = 'fixture/de/gated-fixture.pdf'
const FILE_BODY = Buffer.from('%PDF-1.4\nPT19.3 protected fixture\n%%EOF\n')

const body = (overrides = {}) => ({
  name: 'Dr. Mila Sørensen',
  email: 'mila@praxis.example',
  organization: 'Praxis Nord',
  locale: 'de',
  assetId: GATED_ID,
  source: 'resource-center',
  originRoute: '/de/downloads',
  processingConsent: true,
  consentAcceptedAt: '2026-09-02T09:00:00.000Z',
  ...overrides,
})

describe('AP19 PT19.3 content_download HTTP', () => {
  let directory
  let child
  let baseUrl
  let key = 0

  /**
   * Jeder Fall bekommt eine eigene Absender-IP. Der Limiter erlaubt fuenf
   * Einreichungen je IP und Fenster; ohne diese Trennung wuerde er die
   * spaeteren Faelle abraeumen — was er beim ersten Entwurf auch tat. Dass
   * `X-Forwarded-For` den Eimer bestimmt, ist gewollt: `trust proxy` ist auf
   * genau einen Hop gesetzt.
   */
  const post = (payload, { headers = {}, ip = '203.0.113.1' } = {}) =>
    fetch(`${baseUrl}/api/content-download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': `http-${(key += 1)}`,
        'X-Forwarded-For': ip,
        ...headers,
      },
      body: JSON.stringify(payload),
    })

  beforeAll(async () => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt193-http-'))
    const protectedDir = path.join(directory, 'protected')
    fs.mkdirSync(path.dirname(path.join(protectedDir, RELATIVE_PATH)), { recursive: true })
    fs.writeFileSync(path.join(protectedDir, RELATIVE_PATH), FILE_BODY)

    const registryPath = path.join(directory, 'registry.json')
    fs.writeFileSync(
      registryPath,
      JSON.stringify({
        assets: [
          {
            id: GATED_ID,
            deliveryClass: 'GATED',
            lifecycle: 'ACTIVE_VISIBLE',
            variants: [
              {
                language: 'de',
                storage: 'PROTECTED',
                path: RELATIVE_PATH,
                mime: 'application/pdf',
                bytes: FILE_BODY.length,
                sha256: createHash('sha256').update(FILE_BODY).digest('hex'),
              },
            ],
          },
        ],
      }),
    )

    const port = 4100 + (process.pid % 400)
    child = fork(path.join(here, 'server.js'), {
      env: {
        ...process.env,
        PORT: String(port),
        NODE_ENV: 'test',
        LEAD_DB_PATH: path.join(directory, 'leads.sqlite3'),
        POLARIS_PROTECTED_ASSET_DIR: protectedDir,
        POLARIS_RESOURCE_REGISTRY_PATH: registryPath,
      },
      stdio: 'pipe',
    })
    baseUrl = `http://127.0.0.1:${port}`

    const deadline = Date.now() + 20_000
    for (;;) {
      try {
        await fetch(`${baseUrl}/api/content-download`, { method: 'POST' })
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

  it('nimmt eine gueltige Anfrage mit 202 an und liefert einen Asset-ID-Link', async () => {
    const response = await post(body(), { ip: '203.0.113.10' })
    expect(response.status).toBe(202)
    const json = await response.json()
    expect(json.accepted).toBe(true)
    expect(json.downloadUrl).toContain(`/api/content-download/asset/${GATED_ID}`)
    expect(json.downloadUrl).not.toContain(RELATIVE_PATH)
  })

  it('antwortet 400 auf fehlenden Consent und auf ein unbekanntes Asset', async () => {
    const noConsent = await post(body({ processingConsent: false }), { ip: '203.0.113.11' })
    expect(noConsent.status).toBe(400)
    expect((await noConsent.json()).code).toBe('PROCESSING_CONSENT_REQUIRED')

    const unknown = await post(body({ assetId: '../../etc/passwd' }), { ip: '203.0.113.11' })
    expect(unknown.status).toBe(400)
    expect((await unknown.json()).code).toBe('UNKNOWN_ASSET')
  })

  it('antwortet 409 auf einen wiederverwendeten Key mit anderem Inhalt', async () => {
    const options = { headers: { 'Idempotency-Key': 'http-conflict' }, ip: '203.0.113.12' }
    expect((await post(body(), options)).status).toBe(202)
    const conflict = await post(body({ organization: 'Andere Praxis' }), options)
    expect(conflict.status).toBe(409)
    expect((await conflict.json()).code).toBe('IDEMPOTENCY_CONFLICT')
  })

  it('schluckt Honeypot-Einreichungen mit 200', async () => {
    const response = await post(body({ _hp: 'bot' }), { ip: '203.0.113.13' })
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ accepted: true })
  })

  it('liefert die geschuetzte Datei mit korrekten Headern aus', async () => {
    const submitted = await (
      await post(body({ email: 'header@praxis.example' }), { ip: '203.0.113.14' })
    ).json()
    const response = await fetch(`${baseUrl}${submitted.downloadUrl}`)

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/pdf')
    expect(response.headers.get('content-disposition')).toBe(
      'attachment; filename="gated-fixture.pdf"',
    )
    expect(response.headers.get('cache-control')).toBe('no-store, private')
    expect(response.headers.get('referrer-policy')).toBe('no-referrer')
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow')
    expect(Buffer.from(await response.arrayBuffer())).toEqual(FILE_BODY)
  })

  it('weist manipulierte Links ab, ohne die Datei preiszugeben', async () => {
    const submitted = await (
      await post(body({ email: 'guard@praxis.example' }), { ip: '203.0.113.15' })
    ).json()
    const url = new URL(submitted.downloadUrl, baseUrl)
    const entitlementId = url.searchParams.get('e')
    const token = url.searchParams.get('t')

    const cases = [
      [`/api/content-download/asset/${GATED_ID}?e=${entitlementId}&t=${'x'.repeat(43)}`, 403],
      [`/api/content-download/asset/${GATED_ID}?e=nope&t=${token}`, 403],
      [`/api/content-download/asset/${GATED_ID}`, 403],
      [`/api/content-download/asset/rsc-unbekannt?e=${entitlementId}&t=${token}`, 403],
      [
        `/api/content-download/asset/${encodeURIComponent('../../etc/passwd')}?e=${entitlementId}&t=${token}`,
        403,
      ],
    ]
    for (const [pathname, status] of cases) {
      const response = await fetch(`${baseUrl}${pathname}`)
      expect(response.status, pathname).toBe(status)
      const text = await response.text()
      expect(text).not.toContain('PT19.3 protected fixture')
      expect(text).not.toContain(RELATIVE_PATH)
    }
  })

  it('kann die geschuetzte Datei nicht ueber einen statischen Pfad umgehen', async () => {
    for (const pathname of [
      `/downloads/${RELATIVE_PATH}`,
      `/${RELATIVE_PATH}`,
      '/storage/protected/fixture/de/gated-fixture.pdf',
      '/api/content-download/asset/../../../etc/passwd',
    ]) {
      const response = await fetch(`${baseUrl}${pathname}`)
      expect(response.status, pathname).not.toBe(200)
    }
  })

  it('begrenzt die Einreichungsrate pro IP', async () => {
    const statuses = []
    for (let attempt = 0; attempt < 12; attempt += 1) {
      statuses.push(
        (await post(body({ email: `rate${attempt}@praxis.example` }), { ip: '203.0.113.99' }))
          .status,
      )
    }
    expect(statuses).toContain(429)
  })
})
