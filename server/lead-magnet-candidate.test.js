// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const {
  CrmRouter,
  DELIVERY_RESULTS,
  LeadHandoffWorker,
  LeadRepository,
  openLeadDatabase,
} = require('./lead-foundation')
const { EntitlementRepository } = require('./lead-foundation/entitlements')
const { createContentDownloadService } = require('./content-download')
const registry = require('./resource-registry.json')

/**
 * PT19.4 — der aktive Lead-Magnet, gegen die ECHTE Registry und die ECHTE
 * Datei. Kein Fixture: hier laeuft genau die Konfiguration, die auch produktiv
 * gilt — `resource-registry.json` und `storage/protected/`.
 */

const ASSET_ID = 'rsc-epi-019'
const PROTECTED_ROOT = path.resolve('storage/protected')
const env = { POLARIS_PROTECTED_ASSET_DIR: PROTECTED_ROOT }

const asset = registry.assets.find((entry) => entry.id === ASSET_ID)
const variant = asset?.variants[0]

const body = (overrides = {}) => ({
  name: 'Dr. Mila Sørensen',
  email: 'mila@praxis.example',
  organization: 'Praxis Nord',
  locale: 'de',
  assetId: ASSET_ID,
  source: 'resource-center',
  campaign: 'launch',
  originRoute: '/de/downloads',
  processingConsent: true,
  marketingConsent: false,
  consentAcceptedAt: '2026-09-02T09:00:00.000Z',
  ...overrides,
})

const tokenOf = (result) => new URL(result.downloadUrl, 'https://x.test').searchParams.get('t')

describe('AP19 PT19.4 aktiver Lead-Magnet', () => {
  let directory
  let db
  let repository
  let entitlements
  let service
  let adapter

  const build = (adapters) => {
    adapter = adapters ?? {
      resources: { deliver: vi.fn(async () => ({ status: DELIVERY_RESULTS.DELIVERED })) },
    }
    entitlements = new EntitlementRepository(db)
    service = createContentDownloadService({
      repository,
      entitlements,
      worker: new LeadHandoffWorker({
        repository,
        router: new CrmRouter({ adapters: adapter }),
        workerId: 'pt194-worker',
        retryDelayMs: 0,
      }),
      resolveAsset: (assetId, language) =>
        require('./protected-assets').resolveProtectedAsset(assetId, language, env),
    })
  }

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt194-'))
    db = openLeadDatabase({ filename: path.join(directory, 'leads.sqlite3') })
    repository = new LeadRepository(db)
    build()
  })

  afterEach(() => {
    if (db?.open) db.close()
    fs.rmSync(directory, { recursive: true, force: true })
  })

  it('ist in der ausgelieferten Registry wirklich gegatet und geschuetzt abgelegt', () => {
    expect(asset).toBeTruthy()
    expect(asset.deliveryClass).toBe('GATED')
    expect(variant.storage).toBe('PROTECTED')
    expect(fs.existsSync(path.join(PROTECTED_ROOT, variant.path))).toBe(true)
    // Genau das ist die Umgehung, die es nicht geben darf.
    expect(fs.existsSync(path.resolve('public/downloads', variant.path))).toBe(false)
  })

  it('vollstaendiger Pfad: Gate → Lead → Outbox → CRM → Entitlement → echte Datei', async () => {
    const result = await service.submit({ body: body(), idempotencyKey: 'pt194-full' })

    // Gate akzeptiert und traegt den Asset-Kontext.
    expect(result.accepted).toBe(true)
    expect(result.assetId).toBe(ASSET_ID)

    // Lead ist dauerhaft, mit Journey und Asset-Kontext.
    const lead = repository.getLeadByIdempotencyKey('pt194-full')
    expect(lead.journey).toBe('content_download')
    expect(lead.context).toMatchObject({
      assetId: ASSET_ID,
      requestedLanguage: 'de',
      deliveredLanguage: 'de',
      source: 'resource-center',
      originRoute: '/de/downloads',
    })
    expect(lead.consent).toMatchObject({ processingAccepted: true, marketing: 'DENIED' })

    // Outbox und CRM.
    const outbox = repository.getOutboxForLead(lead.id)
    expect(outbox).toHaveLength(1)
    expect(outbox[0]).toMatchObject({ channel: 'CRM', status: 'DELIVERED' })
    expect(adapter.resources.deliver.mock.calls[0][0].target).toBe('resources')
    expect(lead.status).toBe('DELIVERED')

    // Entitlement, an Lead und Asset gebunden.
    const entitlement = entitlements.getById(result.entitlementId)
    expect(entitlement).toMatchObject({
      leadId: lead.id,
      assetId: ASSET_ID,
      journey: 'content_download',
    })

    // Und schliesslich die echte Datei — Byte fuer Byte.
    const { asset: delivered } = service.redeem({
      assetId: ASSET_ID,
      entitlementId: result.entitlementId,
      token: tokenOf(result),
      env,
    })
    const bytes = fs.readFileSync(delivered.absolutePath)
    expect(bytes.length).toBe(variant.bytes)
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(variant.sha256)
    expect(delivered.mime).toBe('application/zip')
  })

  it('Providerausfall: derselbe Lead, ein Retry, keine doppelte Auslieferung', async () => {
    const deliver = vi
      .fn()
      .mockResolvedValueOnce({ status: DELIVERY_RESULTS.RETRYABLE_ERROR, errorClass: 'ETIMEDOUT' })
      .mockResolvedValueOnce({ status: DELIVERY_RESULTS.DELIVERED })
    build({ resources: { deliver } })

    const result = await service.submit({ body: body(), idempotencyKey: 'pt194-retry' })
    const first = repository.getLeadByIdempotencyKey('pt194-retry')
    expect(first.status).toBe('RETRY_PENDING')
    // Der Download haengt nicht am CRM.
    expect(result.downloadUrl).toContain(ASSET_ID)

    await service.processNext()
    const second = repository.getLeadByIdempotencyKey('pt194-retry')
    expect(second.id).toBe(first.id)
    expect(second.status).toBe('DELIVERED')
    expect(deliver).toHaveBeenCalledTimes(2)

    // Kein weiterer Lauf, kein dritter Zustellversuch, ein Outbox-Eintrag.
    expect(await service.processNext()).toBeNull()
    expect(deliver).toHaveBeenCalledTimes(2)
    expect(db.prepare('SELECT COUNT(*) AS c FROM lead_outbox').get().c).toBe(1)
    expect(db.prepare('SELECT COUNT(*) AS c FROM leads').get().c).toBe(1)
  })

  it('Sprache: passendes und nicht passendes Locale, beide ehrlich aufgeloest', async () => {
    const matching = await service.submit({
      body: body({ locale: 'de' }),
      idempotencyKey: 'pt194-de',
    })
    expect(matching.deliveredLanguage).toBe('de')
    expect(repository.getLeadByIdempotencyKey('pt194-de').context).toMatchObject({
      requestedLanguage: 'de',
      deliveredLanguage: 'de',
    })

    // Polnisch: es gibt keine polnische Datei. Ausgeliefert wird Deutsch, und
    // das steht so in der Antwort UND im Lead — nicht still.
    const mismatch = await service.submit({
      body: body({ locale: 'pl', email: 'pl@praxis.example' }),
      idempotencyKey: 'pt194-pl',
    })
    expect(mismatch.deliveredLanguage).toBe('de')
    expect(repository.getLeadByIdempotencyKey('pt194-pl').context).toMatchObject({
      requestedLanguage: 'pl',
      deliveredLanguage: 'de',
    })

    const { asset: delivered } = service.redeem({
      assetId: ASSET_ID,
      entitlementId: mismatch.entitlementId,
      token: tokenOf(mismatch),
      env,
    })
    expect(delivered.language).toBe('de')
  })

  it('Entitlement-Negative: falsches Token, fremdes Asset, fremder Anspruch, Widerruf', async () => {
    const mine = await service.submit({ body: body(), idempotencyKey: 'pt194-neg-a' })
    const other = await service.submit({
      body: body({ email: 'other@praxis.example' }),
      idempotencyKey: 'pt194-neg-b',
    })
    const token = tokenOf(mine)

    const cases = [
      { label: 'falsches Token', args: { token: 'z'.repeat(43) }, code: 'INVALID_TOKEN' },
      { label: 'leeres Token', args: { token: '' }, code: 'INVALID_TOKEN' },
      {
        label: 'fremder Anspruch mit eigenem Token',
        args: { entitlementId: other.entitlementId },
        code: 'INVALID_TOKEN',
      },
      { label: 'fremdes Asset', args: { assetId: 'rsc-epi-001' }, code: 'ASSET_MISMATCH' },
      {
        label: 'unbekanntes Asset',
        args: { assetId: 'rsc-gibt-es-nicht' },
        code: 'ASSET_MISMATCH',
      },
      {
        label: 'Traversal als Asset',
        args: { assetId: '../../etc/passwd' },
        code: 'ASSET_MISMATCH',
      },
    ]
    for (const testCase of cases) {
      expect(() =>
        service.redeem({
          assetId: ASSET_ID,
          entitlementId: mine.entitlementId,
          token,
          env,
          ...testCase.args,
        }),
      ).toThrowError(expect.objectContaining({ code: testCase.code }))
    }

    // Widerruf wirkt sofort.
    entitlements.revoke(mine.entitlementId)
    expect(() =>
      service.redeem({ assetId: ASSET_ID, entitlementId: mine.entitlementId, token, env }),
    ).toThrowError(expect.objectContaining({ code: 'ENTITLEMENT_REVOKED' }))
  })

  it('freie Geschwister bleiben frei — das Gate nimmt keinen Inhalt weg', () => {
    // Alle acht Mitglieder des gegateten Pakets sind einzeln oeffentlich.
    const members = ['10', '11', '12', '13', '14', '15', '16', '17']
    const publicFiles = fs.readdirSync(path.resolve('public/downloads/epigenetics/de'))
    for (const prefix of members) {
      expect(
        publicFiles.some((file) => file.startsWith(`${prefix}_`)),
        prefix,
      ).toBe(true)
    }
    // Und keiner von ihnen ist gegatet.
    const gated = registry.assets.filter((entry) => entry.deliveryClass === 'GATED')
    expect(gated).toHaveLength(1)
    expect(gated[0].id).toBe(ASSET_ID)
  })
})
