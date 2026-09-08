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
const { EntitlementRepository, TOKEN_PATTERN } = require('./lead-foundation/entitlements')
const { AssetResolutionError, createAssetResolver } = require('./protected-assets')
const {
  ContentDownloadValidationError,
  createContentDownloadService,
} = require('./content-download')

/**
 * PT19.3 — der gegatete Vertical Slice.
 *
 * Es gibt heute kein gegatetes Launch-Asset (die Auswahl ist PT19.4). Damit
 * der Auslieferungspfad trotzdem BEWIESEN und nicht nur geschrieben ist,
 * laeuft die identische Aufloesungslogik gegen ein Fixture-Asset, das echt auf
 * der Platte liegt — ausserhalb von `public/`.
 */

const GATED_ID = 'rsc-fixture-001'
const FREE_ID = 'rsc-fixture-free'
const RELATIVE_PATH = 'fixture/de/gated-fixture.pdf'
const FILE_BODY = Buffer.from('%PDF-1.4\nPT19.3 protected fixture\n%%EOF\n')

const BASE_BODY = Object.freeze({
  name: 'Dr. Mila Sørensen',
  email: 'Mila@Praxis.example ',
  organization: 'Praxis Nord',
  locale: 'de',
  assetId: GATED_ID,
  source: 'resource-center',
  campaign: 'launch',
  originRoute: '/de/downloads',
  processingConsent: true,
  marketingConsent: false,
  consentAcceptedAt: '2026-09-02T09:00:00.000Z',
})

describe('AP19 PT19.3 content_download', () => {
  let directory
  let protectedDir
  let db
  let repository
  let entitlements
  let router
  let worker
  let service
  let adapter
  let env

  const fixtureRegistry = () => ({
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
      {
        id: FREE_ID,
        deliveryClass: 'FREE_PUBLIC',
        lifecycle: 'ACTIVE_VISIBLE',
        variants: [
          {
            language: 'de',
            storage: 'PUBLIC_STATIC',
            path: 'fixture/de/free.pdf',
            mime: 'application/pdf',
            bytes: 3,
            sha256: 'x',
          },
        ],
      },
    ],
  })

  const build = ({ adapters, clock, tokenFactory, ttlMs } = {}) => {
    adapter = adapters ?? {
      resources: { deliver: vi.fn(async () => ({ status: DELIVERY_RESULTS.DELIVERED })) },
    }
    router = new CrmRouter({ adapters: adapter })
    worker = new LeadHandoffWorker({
      repository,
      router,
      workerId: 'test-worker',
      retryDelayMs: 0,
    })
    entitlements = new EntitlementRepository(db, {
      clock: clock ?? (() => new Date('2026-09-02T09:00:00.000Z')),
      ...(tokenFactory ? { tokenFactory } : {}),
      ...(ttlMs ? { ttlMs } : {}),
    })
    const resolver = createAssetResolver(fixtureRegistry())
    service = createContentDownloadService({
      repository,
      entitlements,
      worker,
      resolveAsset: (assetId, language) => resolver.resolve(assetId, language, env),
    })
    return resolver
  }

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt193-'))
    protectedDir = path.join(directory, 'protected')
    fs.mkdirSync(path.dirname(path.join(protectedDir, RELATIVE_PATH)), { recursive: true })
    fs.writeFileSync(path.join(protectedDir, RELATIVE_PATH), FILE_BODY)
    env = { POLARIS_PROTECTED_ASSET_DIR: protectedDir }

    db = openLeadDatabase({ filename: path.join(directory, 'leads.sqlite3') })
    repository = new LeadRepository(db)
    build()
  })

  afterEach(() => {
    if (db?.open) db.close()
    fs.rmSync(directory, { recursive: true, force: true })
  })

  // ------------------------------------------------------------------ Gate
  it('nimmt eine gueltige Anfrage an und liefert einen geschuetzten Link', async () => {
    const result = await service.submit({ body: BASE_BODY, idempotencyKey: 'key-1' })

    expect(result.accepted).toBe(true)
    expect(result.assetId).toBe(GATED_ID)
    expect(result.deliveredLanguage).toBe('de')
    expect(result.entitlementId).toBeTruthy()
    expect(result.downloadUrl).toMatch(
      new RegExp(`^/api/content-download/asset/${GATED_ID}\\?e=[^&]+&t=[A-Za-z0-9_%-]+$`),
    )
    // Der Link zeigt nie auf eine Datei, sondern immer auf die Asset-ID.
    expect(result.downloadUrl).not.toContain(RELATIVE_PATH)
    expect(result.downloadUrl).not.toContain('.pdf')
  })

  it('validiert serverseitig und normalisiert nicht vertrauenswuerdige Felder', async () => {
    await expect(
      service.submit({ body: { ...BASE_BODY, email: 'keine-mail' }, idempotencyKey: 'k' }),
    ).rejects.toMatchObject({ code: 'VALIDATION_FAILED', fields: ['email'] })

    await expect(service.submit({ body: BASE_BODY })).rejects.toMatchObject({
      code: 'IDEMPOTENCY_KEY_REQUIRED',
    })

    await service.submit({
      body: { ...BASE_BODY, originRoute: 'https://evil.example/steal' },
      idempotencyKey: 'key-origin',
    })
    const lead = repository.getLeadByIdempotencyKey('key-origin')
    expect(lead.context.originRoute).toBe('/de/downloads')
    expect(lead.subject.email).toBe('mila@praxis.example')
  })

  it('weist unbekannte und nicht gegatete Assets ab, ohne einen Lead anzulegen', async () => {
    for (const assetId of [
      'rsc-does-not-exist',
      '../../etc/passwd',
      '%2e%2e%2fetc%2fpasswd',
      '/etc/passwd',
      '..\\windows\\win.ini',
      FREE_ID,
    ]) {
      await expect(
        service.submit({ body: { ...BASE_BODY, assetId }, idempotencyKey: `k-${assetId}` }),
      ).rejects.toBeInstanceOf(ContentDownloadValidationError)
    }
    expect(db.prepare('SELECT COUNT(*) AS c FROM leads').get().c).toBe(0)
  })

  it('verlangt Verarbeitungs-Consent und trennt ihn von Marketing', async () => {
    await expect(
      service.submit({
        body: { ...BASE_BODY, processingConsent: false },
        idempotencyKey: 'k-consent',
      }),
    ).rejects.toMatchObject({ code: 'PROCESSING_CONSENT_REQUIRED' })
    await expect(
      service.submit({
        body: { ...BASE_BODY, consentAcceptedAt: 'gestern' },
        idempotencyKey: 'k-evidence',
      }),
    ).rejects.toMatchObject({ code: 'INVALID_CONSENT_EVIDENCE' })
    expect(db.prepare('SELECT COUNT(*) AS c FROM leads').get().c).toBe(0)

    await service.submit({ body: BASE_BODY, idempotencyKey: 'k-denied' })
    await service.submit({
      body: { ...BASE_BODY, marketingConsent: true, email: 'zwei@praxis.example' },
      idempotencyKey: 'k-granted',
    })
    expect(repository.getLeadByIdempotencyKey('k-denied').consent).toMatchObject({
      processingAccepted: true,
      marketing: 'DENIED',
    })
    expect(repository.getLeadByIdempotencyKey('k-granted').consent).toMatchObject({
      processingAccepted: true,
      marketing: 'GRANTED',
    })
  })

  it('ignoriert Honeypot-Einreichungen ohne Persistenz', async () => {
    const result = await service.submit({
      body: { ...BASE_BODY, _hp: 'bot' },
      idempotencyKey: 'k-hp',
    })
    expect(result).toEqual({ ignored: true })
    expect(db.prepare('SELECT COUNT(*) AS c FROM leads').get().c).toBe(0)
    expect(db.prepare('SELECT COUNT(*) AS c FROM resource_entitlements').get().c).toBe(0)
  })

  // ------------------------------------------------- Persistenz und Journey
  it('persistiert Journey, Asset-Kontext und beide Sprachen', async () => {
    await service.submit({
      body: { ...BASE_BODY, locale: 'pl' },
      idempotencyKey: 'k-context',
    })
    const lead = repository.getLeadByIdempotencyKey('k-context')
    expect(lead.journey).toBe('content_download')
    expect(lead.context).toMatchObject({
      locale: 'pl',
      source: 'resource-center',
      campaign: 'launch',
      assetId: GATED_ID,
      // Angefragt polnisch, geliefert deutsch — beides steht im Lead.
      requestedLanguage: 'pl',
      deliveredLanguage: 'de',
    })
  })

  it('persistiert vor jedem externen Handoff', async () => {
    const seen = []
    build({
      adapters: {
        resources: {
          deliver: vi.fn(async ({ lead }) => {
            // Zum Zeitpunkt des Provider-Aufrufs muss der Lead bereits
            // dauerhaft und mit Audit-Spur in der Datenbank stehen.
            const row = db.prepare('SELECT status FROM leads WHERE id = ?').get(lead.id)
            seen.push({
              persisted: Boolean(row),
              status: row?.status,
              events: repository.getEvents(lead.id).map(({ eventType }) => eventType),
            })
            return { status: DELIVERY_RESULTS.DELIVERED }
          }),
        },
      },
    })

    await service.submit({ body: BASE_BODY, idempotencyKey: 'k-order' })
    expect(seen).toHaveLength(1)
    expect(seen[0].persisted).toBe(true)
    expect(seen[0].events).toEqual([
      'LEAD_RECEIVED',
      'LEAD_PERSISTED',
      'HANDOFF_PENDING',
      'HANDOFF_ATTEMPT',
    ])
  })

  it('routet ueber die geteilte CRM-Grenze auf den Ressourcen-Zielkanal', async () => {
    await service.submit({ body: BASE_BODY, idempotencyKey: 'k-crm' })
    expect(adapter.resources.deliver).toHaveBeenCalledTimes(1)
    expect(adapter.resources.deliver.mock.calls[0][0].target).toBe('resources')
    const lead = repository.getLeadByIdempotencyKey('k-crm')
    expect(lead.status).toBe('DELIVERED')
  })

  it('behaelt Lead und Auslieferung, wenn der Provider nur voruebergehend faellt', async () => {
    const deliver = vi
      .fn()
      .mockResolvedValueOnce({ status: DELIVERY_RESULTS.RETRYABLE_ERROR, errorClass: 'ETIMEDOUT' })
      .mockResolvedValueOnce({ status: DELIVERY_RESULTS.DELIVERED })
    build({ adapters: { resources: { deliver } } })

    const result = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-retry' })
    let lead = repository.getLeadByIdempotencyKey('k-retry')
    expect(lead.status).toBe('RETRY_PENDING')
    expect(lead.lastErrorClass).toBe('ETIMEDOUT')
    // Der Leser bekommt seinen Link trotzdem — der Download haengt nicht am CRM.
    expect(result.downloadUrl).toContain(GATED_ID)
    expect(result.providerConfigured).toBeUndefined()

    await service.processNext()
    lead = repository.getLeadByIdempotencyKey('k-retry')
    expect(lead.status).toBe('DELIVERED')
    expect(deliver).toHaveBeenCalledTimes(2)
  })

  it('behauptet keinen CRM-Erfolg, wenn kein Provider konfiguriert ist', async () => {
    build({ adapters: {} })
    const result = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-noprovider' })
    expect(result.providerConfigured).toBe(false)
    expect(repository.getLeadByIdempotencyKey('k-noprovider').lastErrorClass).toBe(
      'NO_PROVIDER_CONFIGURED',
    )
    // Kein Provider heisst trotzdem: Lead da, Link da.
    expect(result.accepted).toBe(true)
    expect(result.downloadUrl).toContain(GATED_ID)
  })

  // ------------------------------------------------------------ Idempotency
  it('erzeugt bei Doppel-Submit genau einen Lead, einen Handoff und einen Anspruch', async () => {
    const first = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-double' })
    const second = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-double' })

    expect(db.prepare('SELECT COUNT(*) AS c FROM leads').get().c).toBe(1)
    expect(db.prepare('SELECT COUNT(*) AS c FROM lead_outbox').get().c).toBe(1)
    expect(db.prepare('SELECT COUNT(*) AS c FROM resource_entitlements').get().c).toBe(1)
    expect(adapter.resources.deliver).toHaveBeenCalledTimes(1)
    expect(second.leadId).toBe(first.leadId)
    expect(second.entitlementId).toBe(first.entitlementId)
    // Rotation: der zweite Link gilt, der erste nicht mehr.
    expect(second.downloadUrl).not.toBe(first.downloadUrl)
  })

  it('lehnt einen wiederverwendeten Idempotency-Key mit anderem Inhalt ab', async () => {
    await service.submit({ body: BASE_BODY, idempotencyKey: 'k-conflict' })
    await expect(
      service.submit({
        body: { ...BASE_BODY, organization: 'Andere Praxis' },
        idempotencyKey: 'k-conflict',
      }),
    ).rejects.toMatchObject({ code: 'IDEMPOTENCY_CONFLICT' })
  })

  it('haelt einen Worker-Replay aus, ohne doppelt auszuliefern', async () => {
    await service.submit({ body: BASE_BODY, idempotencyKey: 'k-worker' })
    expect(await service.processNext()).toBeNull()
    expect(adapter.resources.deliver).toHaveBeenCalledTimes(1)
    const outbox = repository.getOutboxForLead(repository.getLeadByIdempotencyKey('k-worker').id)
    expect(outbox).toHaveLength(1)
    expect(outbox[0].status).toBe('DELIVERED')
    expect(outbox[0].attempts).toBe(1)
  })

  // ----------------------------------------------------------- Entitlement
  it('bindet den Anspruch an Lead, Asset und Ablaufzeit', async () => {
    const result = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-ent' })
    const row = db
      .prepare('SELECT * FROM resource_entitlements WHERE id = ?')
      .get(result.entitlementId)

    expect(row.lead_id).toBe(result.leadId)
    expect(row.journey).toBe('content_download')
    expect(row.asset_id).toBe(GATED_ID)
    expect(Date.parse(row.expires_at)).toBeGreaterThan(Date.parse(row.issued_at))
    // Das Klartext-Token steht NIRGENDWO in der Datenbank.
    const token = new URL(result.downloadUrl, 'https://x.test').searchParams.get('t')
    expect(TOKEN_PATTERN.test(token)).toBe(true)
    expect(row.token_hash).toBe(createHash('sha256').update(token).digest('hex'))
    expect(JSON.stringify(row)).not.toContain(token)
    const dump = fs.readFileSync(path.join(directory, 'leads.sqlite3'))
    expect(dump.includes(Buffer.from(token))).toBe(false)
  })

  it('loest nur mit gueltigem Token und passendem Asset ein', async () => {
    const first = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-redeem' })
    const token = new URL(first.downloadUrl, 'https://x.test').searchParams.get('t')

    const ok = service.redeem({
      assetId: GATED_ID,
      entitlementId: first.entitlementId,
      token,
      env,
    })
    expect(ok.asset.absolutePath).toBe(path.join(protectedDir, RELATIVE_PATH))
    expect(fs.readFileSync(ok.asset.absolutePath)).toEqual(FILE_BODY)

    const bad = [
      { token: 'x'.repeat(43), code: 'INVALID_TOKEN' },
      { token: '', code: 'INVALID_TOKEN' },
      { token, entitlementId: 'nicht-existent', code: 'INVALID_TOKEN' },
      { token, assetId: FREE_ID, code: 'ASSET_MISMATCH' },
      { token, assetId: 'rsc-does-not-exist', code: 'ASSET_MISMATCH' },
      { token, assetId: '../../etc/passwd', code: 'ASSET_MISMATCH' },
    ]
    for (const variant of bad) {
      expect(() =>
        service.redeem({
          assetId: variant.assetId ?? GATED_ID,
          entitlementId: variant.entitlementId ?? first.entitlementId,
          token: variant.token,
          env,
        }),
      ).toThrowError(expect.objectContaining({ code: variant.code }))
    }
  })

  it('laesst abgelaufene und aufgebrauchte Ansprueche nicht mehr durch', async () => {
    let now = new Date('2026-09-02T09:00:00.000Z')
    build({ clock: () => now, ttlMs: 60_000 })
    const result = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-expiry' })
    const token = new URL(result.downloadUrl, 'https://x.test').searchParams.get('t')
    const args = { assetId: GATED_ID, entitlementId: result.entitlementId, token, env }

    expect(service.redeem(args).entitlement.downloadCount).toBe(1)

    now = new Date('2026-09-02T09:02:00.000Z')
    expect(() => service.redeem(args)).toThrowError(
      expect.objectContaining({ code: 'ENTITLEMENT_EXPIRED' }),
    )

    now = new Date('2026-09-02T09:00:30.000Z')
    db.prepare('UPDATE resource_entitlements SET download_count = max_downloads WHERE id = ?').run(
      result.entitlementId,
    )
    expect(() => service.redeem(args)).toThrowError(
      expect.objectContaining({ code: 'ENTITLEMENT_EXHAUSTED' }),
    )

    db.prepare('UPDATE resource_entitlements SET download_count = 0 WHERE id = ?').run(
      result.entitlementId,
    )
    entitlements.revoke(result.entitlementId)
    expect(() => service.redeem(args)).toThrowError(
      expect.objectContaining({ code: 'ENTITLEMENT_REVOKED' }),
    )
  })

  it('macht ein rotiertes Token unbrauchbar', async () => {
    const first = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-rot' })
    const firstToken = new URL(first.downloadUrl, 'https://x.test').searchParams.get('t')
    const second = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-rot' })
    const secondToken = new URL(second.downloadUrl, 'https://x.test').searchParams.get('t')

    expect(secondToken).not.toBe(firstToken)
    expect(() =>
      service.redeem({
        assetId: GATED_ID,
        entitlementId: first.entitlementId,
        token: firstToken,
        env,
      }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_TOKEN' }))
    expect(
      service.redeem({
        assetId: GATED_ID,
        entitlementId: second.entitlementId,
        token: secondToken,
        env,
      }).asset.assetId,
    ).toBe(GATED_ID)
  })

  // ------------------------------------------------- Aufloesung und Ablage
  it('akzeptiert keinen Dateipfad aus dem Request', () => {
    const resolver = createAssetResolver(fixtureRegistry())
    const traversals = [
      '../../etc/passwd',
      '../fixture/de/gated-fixture.pdf',
      '%2e%2e%2ffixture%2fde%2fgated-fixture.pdf',
      '/etc/passwd',
      'C:\\Windows\\win.ini',
      '..\\fixture\\de\\gated-fixture.pdf',
      'fixture/de/gated-fixture.pdf',
      `${GATED_ID}/../../etc/passwd`,
      `${GATED_ID}\u0000.pdf`,
      ` ${GATED_ID}`,
    ]
    for (const candidate of traversals) {
      expect(() => resolver.resolve(candidate, 'de', env), candidate).toThrowError(
        expect.objectContaining({ code: 'UNKNOWN_ASSET' }),
      )
    }
    // Eine Sprache, die es nicht gibt, liefert die reale Variante — und sagt
    // welche. Sie waehlt keinen Pfad.
    expect(resolver.resolve(GATED_ID, 'cs', env).language).toBe('de')
  })

  it('liefert nichts aus, wenn die geschuetzte Datei fehlt oder oeffentlich liegt', () => {
    const resolver = createAssetResolver(fixtureRegistry())
    fs.rmSync(path.join(protectedDir, RELATIVE_PATH))
    expect(() => resolver.resolve(GATED_ID, 'de', env)).toThrowError(
      expect.objectContaining({ code: 'ASSET_FILE_MISSING' }),
    )

    const publicRegistry = fixtureRegistry()
    publicRegistry.assets[0].variants[0].storage = 'PUBLIC_STATIC'
    expect(() => createAssetResolver(publicRegistry).resolve(GATED_ID, 'de', env)).toThrowError(
      expect.objectContaining({ code: 'ASSET_NOT_PROTECTED' }),
    )
  })

  it('haelt die Fehlerklassen frei von Token und Pfad', async () => {
    const result = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-log' })
    const token = new URL(result.downloadUrl, 'https://x.test').searchParams.get('t')
    try {
      service.redeem({
        assetId: GATED_ID,
        entitlementId: result.entitlementId,
        token: 'y'.repeat(43),
        env,
      })
      throw new Error('sollte werfen')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      const serialized = `${error.message} ${error.code} ${error.stack ?? ''}`
      expect(serialized).not.toContain(token)
      expect(serialized).not.toContain(protectedDir)
      expect(serialized).not.toContain(RELATIVE_PATH)
    }
    expect(AssetResolutionError.name).toBe('AssetResolutionError')
  })
})
