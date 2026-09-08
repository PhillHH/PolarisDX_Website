// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const require = createRequire(import.meta.url)
const {
  CrmRouter,
  LeadHandoffWorker,
  LeadRepository,
  openLeadDatabase,
  IdempotencyConflictError,
} = require('./lead-foundation')
const {
  MAX_ATTACHMENTS,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  RETENTION_DAYS,
  SendGridSupportMailAdapter,
  SupportValidationError,
  createSupportCaseService,
} = require('./support-case')

/**
 * AP20 PT20.3 — Support als eigene, persistente, retryfaehige und
 * idempotente Journey inkl. Attachment-Sicherheitsgates.
 */

const BASE_BODY = Object.freeze({
  name: 'Dr. Ada Beispiel',
  email: 'ada@praxis.example',
  udi: 'S0DA25000TEST1',
  swVersion: '1.8.42',
  issueType: 'hardware',
  issueTypeLabel: 'Hardware-Problem',
  subject: 'Reader startet nicht',
  description: 'Geraet bleibt im Boot-Screen haengen.',
  locale: 'de',
  processingConsent: true,
  consentAcceptedAt: '2026-09-07T10:00:00.000Z',
})

const PNG_BYTES = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4])
const PDF_BYTES = Buffer.from('%PDF-1.4\nfake\n%%EOF')
const GIF_BYTES = Buffer.from('GIF89a0001')

const attachment = (filename, type, bytes) => ({
  filename,
  type,
  content: Buffer.from(bytes).toString('base64'),
})

describe('AP20 PT20.3 support journey', () => {
  let db
  let repository
  let storageRoot
  let sent
  let send

  const mailerFor = (impl) => (msg) => {
    sent.push(msg)
    return impl ? impl(msg) : Promise.resolve([{ statusCode: 202, headers: {} }, {}])
  }

  const setup = ({ mailer, retryDelayMs = 0 } = {}) => {
    db = openLeadDatabase({ filename: ':memory:' })
    repository = new LeadRepository(db)
    sent = []
    send = mailerFor(mailer)
    storageRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt203-'))
    const router = new CrmRouter({
      adapters: {
        support: new SendGridSupportMailAdapter({
          send,
          recipient: 'team@polarisdx.example',
          sender: 'web@polarisdx.example',
          storageRoot,
        }),
      },
    })
    const worker = new LeadHandoffWorker({
      repository,
      router,
      workerId: 'pt203-test',
      retryDelayMs,
    })
    return createSupportCaseService({ repository, worker, storageRoot })
  }

  beforeEach(() => {
    sent = []
  })

  afterEach(() => {
    db?.close()
    if (storageRoot) fs.rmSync(storageRoot, { recursive: true, force: true })
  })

  it('nimmt eine gueltige Anfrage an, persistiert den Case und liefert Team- + Bestaetigungsmail', async () => {
    const service = setup()
    const result = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-1' })

    expect(result.accepted).toBe(true)
    expect(result.journey).toBe('support')
    expect(result.status).toBe('DELIVERED')
    expect(result.providerConfigured).toBe(true)
    expect(sent).toHaveLength(2)

    const lead = repository.getLead(result.leadId)
    expect(lead.journey).toBe('support')
    const context = lead.context
    expect(context.locale).toBe('de')
    expect(context.source).toBe('support_center')
    expect(context.retention.caseDays).toBe(RETENTION_DAYS)
    expect(context.retention.deleteAfter).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    const consent = lead.consent
    expect(consent.processingAccepted).toBe(true)
    expect(consent.marketing).toBe('DENIED')

    const team = sent.find((msg) => String(msg.subject).includes('[HIGH PRIORITY]'))
    const confirmation = sent.find((msg) => msg.to === BASE_BODY.email)
    expect(team).toBeTruthy()
    expect(confirmation).toBeTruthy()
    expect(team.attachments ?? []).toHaveLength(0)
  })

  it('speichert ein erlaubtes Attachment opak und haengt es nur an die Team-Mail', async () => {
    const service = setup()
    const body = {
      ...BASE_BODY,
      attachments: [attachment('befund.png', 'image/png', PNG_BYTES)],
    }
    const result = await service.submit({ body, idempotencyKey: 'k-2' })

    expect(result.status).toBe('DELIVERED')
    const lead = repository.getLead(result.leadId)
    const [meta] = lead.context.attachments
    expect(meta.originalName).toBe('befund.png')
    expect(meta.mime).toBe('image/png')
    expect(meta.size).toBe(PNG_BYTES.length)
    expect(meta.storageId).toMatch(/^[0-9a-f]{32}\.png$/)
    // Datei liegt unter generiertem Namen im Case-Dir, Originalname nie im Pfad.
    const stored = fs.readdirSync(path.join(storageRoot, lead.context.caseDir))
    expect(stored).toEqual([meta.storageId])
    const team = sent.find((msg) => String(msg.subject).includes('[HIGH PRIORITY]'))
    expect(team.attachments).toHaveLength(1)
    expect(team.attachments[0].filename).toBe('befund.png')
    expect(team.attachments[0].content).toBe(PNG_BYTES.toString('base64'))
    const confirmation = sent.find((msg) => msg.to === BASE_BODY.email)
    expect(confirmation.attachments ?? []).toHaveLength(0)
  })

  it('akzeptiert das bisherige singulaere attachment-Feld als Ein-Element-Array', async () => {
    const service = setup()
    const body = {
      ...BASE_BODY,
      attachment: attachment('log.txt', 'text/plain', Buffer.from('INFO ok')),
    }
    const result = await service.submit({ body, idempotencyKey: 'k-2b' })
    expect(result.status).toBe('DELIVERED')
    const lead = repository.getLead(result.leadId)
    expect(lead.context.attachments).toHaveLength(1)
  })

  it('lehnt fehlende Pflichtangaben mit Feldliste ab', async () => {
    const service = setup()
    await expect(
      service.submit({
        body: {
          ...BASE_BODY,
          name: 'A',
          email: 'ungueltig',
          udi: '',
          swVersion: '',
          issueType: 'unknown_x',
          subject: '',
        },
        idempotencyKey: 'k-3',
      }),
    ).rejects.toMatchObject({
      name: 'SupportValidationError',
      code: 'VALIDATION_FAILED',
      fields: expect.arrayContaining(['name', 'email', 'udi', 'swVersion', 'issueType', 'subject']),
    })
  })

  it('verlangt den Processing-Consent und trennt Marketing', async () => {
    const service = setup()
    await expect(
      service.submit({ body: { ...BASE_BODY, processingConsent: false }, idempotencyKey: 'k-4' }),
    ).rejects.toMatchObject({ code: 'PROCESSING_CONSENT_REQUIRED' })
  })

  it('verlangt valide Consent-Evidence (acceptedAt)', async () => {
    const service = setup()
    await expect(
      service.submit({
        body: { ...BASE_BODY, consentAcceptedAt: 'kein-datum' },
        idempotencyKey: 'k-5',
      }),
    ).rejects.toMatchObject({ code: 'INVALID_CONSENT_EVIDENCE' })
  })

  it('ist idempotent: Replay mit gleichem Key liefert denselben Case', async () => {
    const service = setup()
    const first = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-6' })
    const replay = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-6' })
    expect(replay.leadId).toBe(first.leadId)
    // Nur ein Lead persistiert, genau eine Zustell-Einheit.
    expect(sent).toHaveLength(2)
  })

  it('wirft IdempotencyConflict bei gleichem Key mit anderem Inhalt', async () => {
    const service = setup()
    await service.submit({ body: BASE_BODY, idempotencyKey: 'k-7' })
    await expect(
      service.submit({ body: { ...BASE_BODY, subject: 'Anderer Betreff' }, idempotencyKey: 'k-7' }),
    ).rejects.toBeInstanceOf(IdempotencyConflictError)
  })

  it('klassifiziert 5xx als retryable und landet in RETRY_PENDING', async () => {
    const service = setup({
      mailer: () =>
        Promise.reject(Object.assign(new Error('boom'), { response: { statusCode: 503 } })),
    })
    const result = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-8' })
    expect(result.deliveryPending).toBe(true)
    const lead = repository.getLead(result.leadId)
    expect(lead.status).toBe('RETRY_PENDING')
  })

  it('meldet ohne konfigurierten Provider ehrlich NO_PROVIDER_CONFIGURED', async () => {
    db = openLeadDatabase({ filename: ':memory:' })
    repository = new LeadRepository(db)
    storageRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt203-'))
    const worker = new LeadHandoffWorker({
      repository,
      router: new CrmRouter({ adapters: {} }),
      workerId: 'pt203-noprovider',
      retryDelayMs: 0,
    })
    const service = createSupportCaseService({ repository, worker, storageRoot })
    const result = await service.submit({ body: BASE_BODY, idempotencyKey: 'k-9' })
    expect(result.providerConfigured).toBe(false)
    expect(repository.getLead(result.leadId).lastErrorClass).toBe('NO_PROVIDER_CONFIGURED')
  })

  it('laesst Honeypot-Einreichungen verschwinden, ohne etwas zu persistieren', async () => {
    const service = setup()
    const result = await service.submit({
      body: { ...BASE_BODY, _hp: 'filled' },
      idempotencyKey: 'k-10',
    })
    expect(result.ignored).toBe(true)
    expect(sent).toHaveLength(0)
  })

  it('akzeptiert pdf/gif/txt mit konsistentem Typ und lehnt Executables ab', async () => {
    const service = setup()
    for (const [filename, type, bytes, key] of [
      ['doku.pdf', 'application/pdf', PDF_BYTES, 'k-11a'],
      ['anim.gif', 'image/gif', GIF_BYTES, 'k-11b'],
      ['console.log', 'text/plain', Buffer.from('INFO ok'), 'k-11c'],
      ['foto.jpg', 'image/jpeg', Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0]), 'k-11d'],
    ]) {
      const result = await service.submit({
        body: { ...BASE_BODY, attachments: [attachment(filename, type, bytes)] },
        idempotencyKey: key,
      })
      expect(result.status).toBe('DELIVERED')
    }
    await expect(
      setup().submit({
        body: {
          ...BASE_BODY,
          attachments: [attachment('tool.exe', 'application/x-msdownload', Buffer.from('MZ'))],
        },
        idempotencyKey: 'k-11e',
      }),
    ).rejects.toMatchObject({ code: 'ATTACHMENT_TYPE' })
    await expect(
      setup().submit({
        body: {
          ...BASE_BODY,
          attachments: [attachment('script.sh', 'text/plain', Buffer.from('#!/bin/sh'))],
        },
        idempotencyKey: 'k-11f',
      }),
    ).rejects.toMatchObject({ code: 'ATTACHMENT_TYPE' })
  })

  it('lehnt spoofed MIME (falscher Magic-Byte-Inhalt) ab', async () => {
    const service = setup()
    // PNG behauptet, enthaelt aber PDF-Daten.
    await expect(
      service.submit({
        body: { ...BASE_BODY, attachments: [attachment('foto.png', 'image/png', PDF_BYTES)] },
        idempotencyKey: 'k-12a',
      }),
    ).rejects.toMatchObject({ code: 'ATTACHMENT_SPOOFED' })
    // PDF behauptet, enthaelt aber PNG-Daten.
    await expect(
      service.submit({
        body: { ...BASE_BODY, attachments: [attachment('doku.pdf', 'application/pdf', PNG_BYTES)] },
        idempotencyKey: 'k-12b',
      }),
    ).rejects.toMatchObject({ code: 'ATTACHMENT_SPOOFED' })
  })

  it('lehnt MIME/Extension-Mismatch ab', async () => {
    const service = setup()
    await expect(
      service.submit({
        body: { ...BASE_BODY, attachments: [attachment('foto.png', 'application/pdf', PDF_BYTES)] },
        idempotencyKey: 'k-13',
      }),
    ).rejects.toMatchObject({ code: 'ATTACHMENT_TYPE' })
  })

  it('lehnt ubergrosse Dateien, zu viele Dateien und zu grosse Summe ab', async () => {
    const service = setup()
    const big = Buffer.alloc(MAX_FILE_BYTES + 1)
    big[0] = 0x89
    big.set([0x50, 0x4e, 0x47], 1)
    await expect(
      service.submit({
        body: { ...BASE_BODY, attachments: [attachment('big.png', 'image/png', big)] },
        idempotencyKey: 'k-14a',
      }),
    ).rejects.toMatchObject({ code: 'ATTACHMENT_SIZE' })

    const many = Array.from({ length: MAX_ATTACHMENTS + 1 }, (_, i) =>
      attachment(`f${i}.txt`, 'text/plain', Buffer.from('x')),
    )
    await expect(
      service.submit({ body: { ...BASE_BODY, attachments: many }, idempotencyKey: 'k-14b' }),
    ).rejects.toMatchObject({ code: 'ATTACHMENT_COUNT' })

    const perFile = Math.floor(MAX_TOTAL_BYTES / 3) + 1024
    const heavy = Array.from({ length: 3 }, (_, i) => {
      const bytes = Buffer.alloc(perFile)
      bytes[0] = 0x89
      bytes.set([0x50, 0x4e, 0x47], 1)
      return attachment(`h${i}.png`, 'image/png', bytes)
    })
    await expect(
      service.submit({ body: { ...BASE_BODY, attachments: heavy }, idempotencyKey: 'k-14c' }),
    ).rejects.toMatchObject({ code: 'ATTACHMENT_TOTAL_SIZE' })
  })

  it('lehnt Traversal-Filenames ab und nie mit einem User-Pfad zu schreiben', async () => {
    const service = setup()
    for (const [filename, key] of [
      ['../../etc/passwd.png', 'k-15a'],
      ['..\\..\\win.ini', 'k-15b'],
      ['a/../../b.pdf', 'k-15c'],
    ]) {
      await expect(
        service.submit({
          body: {
            ...BASE_BODY,
            attachments: [
              attachment(
                filename,
                filename.endsWith('.png') ? 'image/png' : 'application/pdf',
                filename.endsWith('.png') ? PNG_BYTES : PDF_BYTES,
              ),
            ],
          },
          idempotencyKey: key,
        }),
      ).rejects.toMatchObject({ code: 'ATTACHMENT_TRAVERSAL' })
    }
    // Nichts wurde ausserhalb des Storage-Roots angelegt.
    expect(fs.readdirSync(storageRoot)).toHaveLength(0)
  })

  it('lehnt unbekannte Typen und ungueltiges Base64 ab', async () => {
    const service = setup()
    await expect(
      service.submit({
        body: {
          ...BASE_BODY,
          attachments: [attachment('paket.zip', 'application/zip', Buffer.from('PK'))],
        },
        idempotencyKey: 'k-16a',
      }),
    ).rejects.toMatchObject({ code: 'ATTACHMENT_TYPE' })
    await expect(
      service.submit({
        body: {
          ...BASE_BODY,
          attachments: [
            { filename: 'kaputt.pdf', type: 'application/pdf', content: '!!!kein-base64!!!' },
          ],
        },
        idempotencyKey: 'k-16b',
      }),
    ).rejects.toMatchObject({ code: 'ATTACHMENT_INVALID' })
  })

  it('exportiert SupportValidationError als eigene Fehlerklasse', () => {
    expect(new SupportValidationError('X', ['y']).fields).toEqual(['y'])
  })
})
