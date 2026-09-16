// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'

/**
 * AP27 PT27.2 — gegatete Ressource ueber alle Schichten.
 *
 *   HTTP-Anfrage → Lead + Anspruch in der Datenbank → Link → Einloesung → Fixture-Datei
 *
 * `content-download.endpoint.test.js` (AP19) prueft die HTTP-Negativfaelle gegen EIN Asset,
 * `content-download.test.js` die Service-Regeln. Hier steht, was erst die Kette zeigt: die
 * Bindung in der Datenbank, ein gueltiges Token gegen ein ZWEITES reales Asset, ein fremder
 * Anspruch, Ablauf/Widerruf/Verbrauch ueber HTTP, Rotation, und dass kein Token im Klartext in
 * Datenbank oder Log steht. Kein Provider: ohne Schluessel meldet die Journey ehrlich
 * NO_PROVIDER_CONFIGURED, das Netz ist trotzdem gesperrt und gezaehlt.
 */

const require = createRequire(import.meta.url)
const harness = require('./lead-foundation/testing/integration-harness')

const ASSETS = {
  a: { id: 'rsc-pt272-a', file: 'fixture/de/pt272-a.pdf', marker: 'PT27.2 fixture A' },
  b: { id: 'rsc-pt272-b', file: 'fixture/de/pt272-b.pdf', marker: 'PT27.2 fixture B' },
}
const fileBody = (asset) => Buffer.from(`%PDF-1.4\n${asset.marker}\n%%EOF\n`)

let tmp
let protectedDir
let registryPath
let env
let transport
let logs
let server
let store
const issuedTokens = []
const clientAssetIds = new Set()

let emailCounter = 0
const submit = async (asset, key = `pt272-gate-${(emailCounter += 1)}`, overrides = {}) => {
  const response = await harness.postJson(
    server.baseUrl,
    '/api/content-download',
    {
      name: 'Dr. Mila Synthetik',
      email: `gate${emailCounter}@praxis.example`,
      organization: 'Praxis Nord',
      locale: 'de',
      assetId: asset.id,
      source: 'resource-center',
      originRoute: '/de/downloads',
      processingConsent: true,
      consentAcceptedAt: '2026-09-15T09:00:00.000Z',
      ...overrides,
    },
    { key },
  )
  expect(response.status).toBe(202)
  const url = new URL(response.json.data.downloadUrl, server.baseUrl)
  const link = {
    key,
    leadId: response.json.leadId,
    entitlementId: url.searchParams.get('e'),
    token: url.searchParams.get('t'),
  }
  issuedTokens.push(link.token)
  return link
}
const assetUrl = (assetId, entitlementId, token) =>
  `/api/content-download/asset/${assetId}?e=${encodeURIComponent(entitlementId)}&t=${encodeURIComponent(token)}`
const fetchAsset = (assetId, entitlementId, token) =>
  harness.getRaw(server.baseUrl, assetUrl(assetId, entitlementId, token))
const errorCode = (response) => JSON.parse(response.body.toString('utf8')).code

beforeAll(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt272-gate-'))
  protectedDir = path.join(tmp, 'protected')
  registryPath = path.join(tmp, 'registry.json')
  for (const asset of Object.values(ASSETS)) {
    const target = path.join(protectedDir, asset.file)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, fileBody(asset))
  }
  fs.writeFileSync(
    registryPath,
    JSON.stringify({
      assets: Object.values(ASSETS).map((asset) => ({
        id: asset.id,
        deliveryClass: 'GATED',
        lifecycle: 'ACTIVE_VISIBLE',
        variants: [
          {
            language: 'de',
            storage: 'PROTECTED',
            path: asset.file,
            mime: 'application/pdf',
            bytes: fileBody(asset).length,
            sha256: createHash('sha256').update(fileBody(asset)).digest('hex'),
          },
        ],
      })),
    }),
  )

  env = harness.isolateProviderEnv({
    NODE_ENV: 'test',
    LEAD_DB_PATH: path.join(tmp, 'leads.sqlite3'),
    SUPPORT_UPLOAD_DIR: path.join(tmp, 'uploads'),
    LEAD_DISPATCHER_DISABLED: '1',
    POLARIS_PROTECTED_ASSET_DIR: protectedDir,
    POLARIS_RESOURCE_REGISTRY_PATH: registryPath,
  })
  transport = harness.instrumentMailTransport()
  logs = harness.captureConsole()
  const { app } = require('./server.js')
  server = await harness.listen(app)
  store = harness.openStore(process.env.LEAD_DB_PATH)
}, 30_000)

afterAll(async () => {
  await server?.close()
  store?.close()
  logs?.restore()
  transport?.restore()
  for (const name of ['POLARIS_PROTECTED_ASSET_DIR', 'POLARIS_RESOURCE_REGISTRY_PATH']) {
    delete process.env[name]
  }
  env?.restore()
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true })
})

describe('PT27.2 · Anspruch, Bindung und Auslieferung', () => {
  it('bindet den Anspruch in der Datenbank an Lead und Asset und liefert genau diese Datei', async () => {
    const link = await submit(ASSETS.a)
    const entitlement = store.entitlements.getById(link.entitlementId)
    expect(entitlement).toMatchObject({
      leadId: link.leadId,
      journey: 'content_download',
      assetId: ASSETS.a.id,
      assetLanguage: 'de',
      downloadCount: 0,
    })
    expect(store.leads.getLead(link.leadId)).toMatchObject({ journey: 'content_download' })
    expect(store.leads.getLead(link.leadId).context.assetId).toBe(ASSETS.a.id)
    const row = store.db
      .prepare('SELECT token_hash FROM resource_entitlements WHERE id = ?')
      .get(link.entitlementId)
    expect(row.token_hash).toBe(harness.hashToken(link.token))

    const response = await fetchAsset(ASSETS.a.id, link.entitlementId, link.token)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(fileBody(ASSETS.a))
    expect(response.headers.get('cache-control')).toBe('no-store, private')
    expect(store.entitlements.getById(link.entitlementId).downloadCount).toBe(1)
  })

  it('ein gueltiges Token oeffnet kein anderes, real existierendes Asset', async () => {
    const link = await submit(ASSETS.a)
    const response = await fetchAsset(ASSETS.b.id, link.entitlementId, link.token)
    expect(response.status).toBe(403)
    expect(errorCode(response)).toBe('ASSET_MISMATCH')
    expect(response.body.toString('utf8')).not.toContain(ASSETS.b.marker)
    expect(store.entitlements.getById(link.entitlementId).downloadCount).toBe(0)
  })

  it('der Anspruch eines anderen Leads ist mit fremdem Token wertlos', async () => {
    const first = await submit(ASSETS.a)
    const second = await submit(ASSETS.a)
    for (const [entitlementId, token] of [
      [first.entitlementId, second.token],
      [second.entitlementId, first.token],
    ]) {
      const response = await fetchAsset(ASSETS.a.id, entitlementId, token)
      expect(response.status).toBe(403)
      expect(errorCode(response)).toBe('INVALID_TOKEN')
    }
  })
})

describe('PT27.2 · Lebenszyklus ueber HTTP', () => {
  it('abgelaufen → 410, widerrufen → 403, aufgebraucht → 410', async () => {
    const expired = await submit(ASSETS.a)
    store.db
      .prepare('UPDATE resource_entitlements SET expires_at = ? WHERE id = ?')
      .run('2000-01-01T00:00:00.000Z', expired.entitlementId)
    const expiredResponse = await fetchAsset(ASSETS.a.id, expired.entitlementId, expired.token)
    expect([expiredResponse.status, errorCode(expiredResponse)]).toEqual([
      410,
      'ENTITLEMENT_EXPIRED',
    ])

    const revoked = await submit(ASSETS.a)
    store.entitlements.revoke(revoked.entitlementId)
    const revokedResponse = await fetchAsset(ASSETS.a.id, revoked.entitlementId, revoked.token)
    expect([revokedResponse.status, errorCode(revokedResponse)]).toEqual([
      403,
      'ENTITLEMENT_REVOKED',
    ])

    const used = await submit(ASSETS.b)
    const { maxDownloads } = store.entitlements.getById(used.entitlementId)
    for (let index = 0; index < maxDownloads; index += 1) {
      expect((await fetchAsset(ASSETS.b.id, used.entitlementId, used.token)).status).toBe(200)
    }
    const exhausted = await fetchAsset(ASSETS.b.id, used.entitlementId, used.token)
    expect([exhausted.status, errorCode(exhausted)]).toEqual([410, 'ENTITLEMENT_EXHAUSTED'])
  })

  it('ein erneuter Submit rotiert: der alte Link ist tot, der neue gueltig, ein Anspruch', async () => {
    // Mit festem Key zaehlt `submit` nicht weiter: beide Aufrufe tragen denselben Inhalt.
    const original = await submit(ASSETS.a, 'pt272-rotation')
    const rotated = await submit(ASSETS.a, 'pt272-rotation')

    expect(rotated.leadId).toBe(original.leadId)
    expect(rotated.entitlementId).toBe(original.entitlementId)
    expect(rotated.token).not.toBe(original.token)
    expect(store.entitlements.listForLead(original.leadId)).toHaveLength(1)

    const stale = await fetchAsset(ASSETS.a.id, original.entitlementId, original.token)
    expect([stale.status, errorCode(stale)]).toEqual([403, 'INVALID_TOKEN'])
    expect((await fetchAsset(ASSETS.a.id, rotated.entitlementId, rotated.token)).status).toBe(200)
  })
})

describe('PT27.2 · Pfad-, Log- und Speichergrenze', () => {
  it('ein Pfad an Stelle der Asset-ID wird mit gueltigem Anspruch abgewiesen', async () => {
    const link = await submit(ASSETS.a)
    const attempts = [
      encodeURIComponent('../registry.json'),
      '..%2F..%2Fetc%2Fpasswd',
      encodeURIComponent(path.join(protectedDir, ASSETS.b.file)),
      encodeURIComponent(`${ASSETS.a.id}/../${ASSETS.b.id}`),
      encodeURIComponent(`${ASSETS.a.id}\\..\\${ASSETS.b.id}`),
      encodeURIComponent(ASSETS.a.file),
    ]
    for (const assetId of attempts) {
      // Der Ablehnungs-Log nennt die vom CLIENT gesendete ID (gekuerzt auf 64 Zeichen).
      clientAssetIds.add(decodeURIComponent(assetId).slice(0, 64))
      const response = await harness.getRaw(
        server.baseUrl,
        `/api/content-download/asset/${assetId}?e=${link.entitlementId}&t=${link.token}`,
      )
      expect(response.status, assetId).not.toBe(200)
      expect([403, 404], assetId).toContain(response.status)
      const text = response.body.toString('utf8')
      expect(text).not.toContain(ASSETS.a.marker)
      expect(text).not.toContain(ASSETS.b.marker)
      expect(text).not.toContain(tmp)
    }
    expect(store.entitlements.getById(link.entitlementId).downloadCount).toBe(0)
  })

  it('kein ausgestelltes Token steht im Klartext in Datenbank oder Log; kein Providerkontakt', () => {
    expect(issuedTokens.length).toBeGreaterThanOrEqual(8)
    const database = harness.dumpDatabaseText(store.db)
    const output = logs.text()
    for (const token of issuedTokens) {
      expect(database.includes(token)).toBe(false)
      expect(output.includes(token)).toBe(false)
    }
    // Der Server verraet keinen eigenen Pfad. Eine Zeile mit dem Temp-Pfad ist nur zulaessig als
    // Echo einer vom Client gesendeten Asset-ID im Ablehnungs-Log (Befund, TESTING-CONTRACT §11).
    for (const line of logs.lines.filter((entry) => entry.includes(tmp))) {
      const refusal = line.match(/^\[content_download\] delivery refused (\{.*\})$/)
      expect(refusal, line).toBeTruthy()
      expect(clientAssetIds.has(JSON.parse(refusal[1]).assetId), line).toBe(true)
    }
    expect(output).not.toMatch(/gate\d+@praxis\.example/)
    expect(transport.sends).toHaveLength(0)
    expect(transport.network).toEqual({ client: 0, https: 0 })
  })
})
