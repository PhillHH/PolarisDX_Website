// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import { fork } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'

/**
 * AP22 PT22.2 — das konsolidierte Lead-Datenmodell.
 *
 * Geprueft wird das Modell selbst, nicht eine einzelne Journey: dass die
 * Migration bestehende Daten uebernimmt statt sie zu verlieren, dass alle
 * sieben Journeys schreibbar sind, dass Identitaet, Kontext, Consent und
 * Zustand einen Neustart ueberleben, und dass Dedup fachlich je Journey
 * greift statt global ueber die E-Mail.
 */

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3')
const {
  DEDUP_POLICIES,
  IdempotencyConflictError,
  JOURNEY_REGISTRY,
  LEAD_JOURNEYS,
  LEAD_STATUSES,
  LeadRepository,
  RETENTION_POLICY_DAYS,
  applyMigrations,
  dedupKeyFor,
  openLeadDatabase,
} = require('./lead-foundation')

const MIGRATIONS_DIR = path.join(__dirname, 'lead-foundation', 'migrations')

const temps = []
const tempFile = (name = 'leads.sqlite3') => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pt222-'))
  temps.push(dir)
  return path.join(dir, name)
}
afterEach(() => {
  while (temps.length) fs.rmSync(temps.pop(), { recursive: true, force: true })
})

const consent = {
  processingAccepted: true,
  acceptedAt: '2026-09-09T08:00:00.000Z',
  version: 'test-2026-09',
  marketing: 'GRANTED',
}

/** Ein gueltiger Eingang je Journey — die sieben unterscheiden sich fachlich. */
const inputFor = (journey, overrides = {}) => {
  const perJourney = {
    contact: { subject: { email: 'a@example.com', message: 'Angebot?' }, context: {} },
    support: {
      subject: { email: 'a@example.com', udi: 'S0DA1', subject: 'Bluetooth' },
      context: {},
    },
    consumer_order: {
      subject: { email: 'a@example.com', productId: 'inside-out-duo', variant: 'set', quantity: 1 },
      context: {
        reference: 'PDX-AAAA1111',
        productId: 'inside-out-duo',
        variant: 'set',
        quantity: 1,
      },
    },
    roi_report: {
      subject: { email: 'a@example.com', area: 'implantologie' },
      context: { reportArea: 'implantologie' },
    },
    practice_order: {
      subject: { email: 'a@example.com', organization: 'Praxis Nord', productId: 'spray-12' },
      context: { orgType: 'praxis', productId: 'spray-12', quantity: 2 },
    },
    epigenetics_inquiry: {
      subject: { email: 'a@example.com', panel: 'healthy-aging' },
      context: { panel: 'healthy-aging' },
    },
    content_download: {
      subject: { email: 'a@example.com', assetId: 'whitepaper-01' },
      context: { assetId: 'whitepaper-01' },
    },
  }[journey]
  return {
    journey,
    idempotencyKey: `${journey}-key`,
    subject: perJourney.subject,
    context: { locale: 'de', ...perJourney.context },
    consent,
    channels: ['CRM'],
    ...overrides,
  }
}

describe('PT22.2 · Migration', () => {
  it('uebernimmt bestehende Daten, statt sie zu verlieren', () => {
    const filename = tempFile()

    // Schritt 1: eine Datenbank auf dem ALTEN Stand (001 + 002) aufbauen.
    const oldDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pt222-mig-'))
    temps.push(oldDir)
    for (const name of ['001_shared_lead_foundation.sql', '002_resource_entitlements.sql']) {
      fs.copyFileSync(path.join(MIGRATIONS_DIR, name), path.join(oldDir, name))
    }
    let db = new Database(filename)
    db.pragma('foreign_keys = ON')
    applyMigrations(db, oldDir)

    // Zeilen im Altformat, inklusive Kindzeilen und PENDING_HANDOFF.
    const now = '2026-09-01T10:00:00.000Z'
    db.prepare(
      `INSERT INTO leads (id, idempotency_key, request_hash, journey, status, subject_json,
        context_json, consent_json, handoff_state, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      'old-1',
      'old-key-1',
      'hash-1',
      'support',
      'PENDING_HANDOFF',
      JSON.stringify({ email: 'alt@example.com' }),
      JSON.stringify({ locale: 'de', retention: { deleteAfter: '2026-11-30' } }),
      JSON.stringify(consent),
      'PENDING',
      now,
      now,
    )
    db.prepare(
      `INSERT INTO leads (id, idempotency_key, request_hash, journey, status, subject_json,
        context_json, consent_json, handoff_state, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      'old-2',
      'old-key-2',
      'hash-2',
      'consumer_order',
      'DELIVERED',
      JSON.stringify({ email: 'zwei@example.com' }),
      JSON.stringify({ locale: 'cs', reference: 'PDX-OLD00002' }),
      JSON.stringify(consent),
      'DELIVERED',
      now,
      now,
    )
    db.prepare(
      `INSERT INTO lead_outbox (id, lead_id, channel, status, attempts, available_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run('old-1:crm', 'old-1', 'CRM', 'PENDING', 0, now, now, now)
    db.prepare(
      `INSERT INTO lead_events (lead_id, event_type, status, occurred_at) VALUES (?, ?, ?, ?)`,
    ).run('old-1', 'LEAD_RECEIVED', 'RECEIVED', now)
    db.close()

    // Schritt 2: mit dem ECHTEN Migrationsverzeichnis oeffnen — 003 laeuft.
    db = openLeadDatabase({ filename })

    expect(
      db
        .prepare('SELECT version FROM schema_migrations ORDER BY version')
        .all()
        .map((r) => r.version),
    ).toContain('003_lead_model_consolidation.sql')

    // Kein Datenverlust — auch nicht in den Kindtabellen (ON DELETE CASCADE!).
    expect(db.prepare('SELECT COUNT(*) AS n FROM leads').get().n).toBe(2)
    expect(db.prepare('SELECT COUNT(*) AS n FROM lead_outbox').get().n).toBe(1)
    expect(db.prepare('SELECT COUNT(*) AS n FROM lead_events').get().n).toBe(1)
    expect(db.pragma('foreign_key_check')).toEqual([])
    expect(db.pragma('foreign_keys', { simple: true })).toBe(1)

    const migrated = db.prepare('SELECT * FROM leads WHERE id = ?').get('old-1')
    // PENDING_HANDOFF ist auf den kanonischen Namen gehoben.
    expect(migrated.status).toBe('QUEUED')
    // Die Loeschfrist wurde aus dem JSON gehoben, nicht erfunden.
    expect(migrated.retention_delete_after).toBe('2026-11-30')
    // Alles andere unveraendert.
    expect(JSON.parse(migrated.subject_json).email).toBe('alt@example.com')
    expect(migrated.created_at).toBe(now)

    const second = db.prepare('SELECT * FROM leads WHERE id = ?').get('old-2')
    expect(second.status).toBe('DELIVERED')
    // Die Vorgangsnummer wurde aus dem Kontext in die Spalte gehoben.
    expect(second.reference).toBe('PDX-OLD00002')
    expect(second.retention_delete_after).toBeNull()
    db.close()
  })

  it('ist wiederholbar: ein zweites Oeffnen aendert nichts', () => {
    const filename = tempFile()
    let db = openLeadDatabase({ filename })
    const repository = new LeadRepository(db)
    repository.createLead(inputFor('contact'))
    const before = db.prepare('SELECT * FROM leads').all()
    const versions = db.prepare('SELECT COUNT(*) AS n FROM schema_migrations').get().n
    db.close()

    db = openLeadDatabase({ filename })
    expect(db.prepare('SELECT COUNT(*) AS n FROM schema_migrations').get().n).toBe(versions)
    expect(db.prepare('SELECT * FROM leads').all()).toEqual(before)
    db.close()
  })

  it('ist deterministisch: zwei frische Datenbanken bekommen dasselbe Schema', () => {
    const shape = (db) =>
      db
        .prepare(
          "SELECT type, name, sql FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY type, name",
        )
        .all()
    const a = openLeadDatabase({ filename: ':memory:' })
    const b = openLeadDatabase({ filename: ':memory:' })
    expect(shape(a)).toEqual(shape(b))
    // Und das Schema traegt wirklich die neun Zustaende plus den Altwert.
    const leadsSql = shape(a).find((row) => row.name === 'leads').sql
    for (const status of Object.values(LEAD_STATUSES)) {
      expect(leadsSql, status).toContain(`'${status}'`)
    }
    a.close()
    b.close()
  })
})

describe('PT22.2 · Laufzeit- und Containerkompatibilitaet', () => {
  it('faehrt den echten Server auf einer ALTBESTAND-Datenbank hoch und nimmt an', async () => {
    // Das ist der Containerfall: das Volume enthaelt eine Datenbank im alten
    // Schema, der Prozess startet neu, die Migration laeuft beim Oeffnen.
    const filename = tempFile()
    const oldDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pt222-rt-'))
    temps.push(oldDir)
    for (const name of ['001_shared_lead_foundation.sql', '002_resource_entitlements.sql']) {
      fs.copyFileSync(path.join(MIGRATIONS_DIR, name), path.join(oldDir, name))
    }
    let db = new Database(filename)
    db.pragma('foreign_keys = ON')
    applyMigrations(db, oldDir)
    const now = '2026-09-01T10:00:00.000Z'
    db.prepare(
      `INSERT INTO leads (id, idempotency_key, request_hash, journey, status, subject_json,
        context_json, consent_json, handoff_state, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      'legacy-1',
      'legacy-key',
      'hash',
      'contact',
      'PENDING_HANDOFF',
      JSON.stringify({ email: 'bestand@example.com', name: 'Bestand' }),
      JSON.stringify({ locale: 'de' }),
      JSON.stringify(consent),
      'PENDING',
      now,
      now,
    )
    db.close()

    const net = await import('node:net')
    const port = await new Promise((resolve) => {
      const probe = net.createServer().listen(0, '127.0.0.1', () => {
        const { port: free } = probe.address()
        probe.close(() => resolve(free))
      })
    })
    const child = fork(path.join(__dirname, 'server.js'), {
      env: {
        ...process.env,
        PORT: String(port),
        NODE_ENV: 'test',
        SENDGRID_API_KEY: '',
        CONTACT_RECEIVER: 'team@polarisdx.example',
        SENDER_EMAIL: 'web@polarisdx.example',
        LEAD_DB_PATH: filename,
      },
      stdio: 'pipe',
    })
    try {
      const base = `http://127.0.0.1:${port}`
      const deadline = Date.now() + 20_000
      for (;;) {
        try {
          await fetch(`${base}/api/contact`, { method: 'POST' })
          break
        } catch {
          if (Date.now() > deadline) throw new Error('server did not start')
          await new Promise((resolve) => setTimeout(resolve, 150))
        }
      }

      const response = await fetch(`${base}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `rt-${Date.now()}`,
          'X-Forwarded-For': '203.0.113.201',
        },
        body: JSON.stringify({
          name: 'Neue Anfrage',
          email: 'neu@example.com',
          message: 'Nach der Migration',
          locale: 'de',
          processingConsent: true,
          consentAcceptedAt: '2026-09-09T09:00:00.000Z',
        }),
      })
      expect(response.status).toBe(202)

      const check = new Database(filename, { readonly: true })
      // Der Altbestand ist noch da und auf den kanonischen Zustand gehoben.
      const legacy = check.prepare('SELECT * FROM leads WHERE id = ?').get('legacy-1')
      expect(legacy.status).toBe('QUEUED')
      expect(JSON.parse(legacy.subject_json).email).toBe('bestand@example.com')
      // Und der neue Vorgang liegt daneben, nicht darueber.
      expect(check.prepare('SELECT COUNT(*) AS n FROM leads').get().n).toBe(2)
      expect(check.pragma('foreign_key_check')).toEqual([])
      check.close()
    } finally {
      child.kill()
    }
  }, 40_000)
})

describe('PT22.2 · Schema traegt 7/7 Journeys', () => {
  it('nimmt jede der sieben Journeys mit ihrem eigenen Kontext auf', () => {
    const db = openLeadDatabase({ filename: ':memory:' })
    const repository = new LeadRepository(db)
    const created = LEAD_JOURNEYS.map((journey) => repository.createLead(inputFor(journey)))

    expect(created).toHaveLength(7)
    expect(created.map((lead) => lead.journey).sort()).toEqual([...LEAD_JOURNEYS].sort())
    for (const lead of created) {
      // Stabile, eindeutige Identitaet.
      expect(lead.id).toMatch(/^[0-9a-f-]{36}$/u)
      expect(lead.status).toBe(LEAD_STATUSES.QUEUED)
      expect(lead.consent.processingAccepted).toBe(true)
      expect(lead.consent.marketing).toBe('GRANTED')
      expect(lead.context.locale).toBe('de')
      expect(lead.queuedAt).toBeTruthy()
      expect(lead.validatedAt).toBeTruthy()
    }
    expect(new Set(created.map((lead) => lead.id)).size).toBe(7)
    db.close()
  })

  it('haelt den journeyspezifischen Kontext ueber Speichern und Lesen unveraendert', () => {
    const db = openLeadDatabase({ filename: ':memory:' })
    const repository = new LeadRepository(db)
    const cases = [
      [
        'consumer_order',
        { productId: 'inside-out-duo', variant: 'set', quantity: 1, reference: 'PDX-AAAA1111' },
      ],
      ['roi_report', { reportArea: 'implantologie' }],
      ['practice_order', { orgType: 'praxis', productId: 'spray-12', quantity: 2 }],
      ['epigenetics_inquiry', { panel: 'healthy-aging' }],
      ['content_download', { assetId: 'whitepaper-01' }],
    ]
    for (const [journey, expected] of cases) {
      const lead = repository.createLead(inputFor(journey))
      const roundtrip = repository.getLead(lead.id).context
      for (const [key, value] of Object.entries(expected)) {
        expect(roundtrip[key], `${journey}.${key}`).toBe(value)
      }
    }
    db.close()
  })

  it('hebt die Vorgangsnummer in die Spalte — eindeutig ueber alle Journeys', () => {
    const db = openLeadDatabase({ filename: ':memory:' })
    const repository = new LeadRepository(db)
    const lead = repository.createLead(inputFor('consumer_order'))
    expect(repository.getLead(lead.id).reference).toBe('PDX-AAAA1111')
    // Journeys ohne Nummer schreiben NULL statt einer erfundenen.
    expect(repository.createLead(inputFor('contact')).reference).toBeNull()
    // Und dieselbe Nummer laesst sich nicht zweimal vergeben.
    expect(() =>
      repository.createLead(
        inputFor('practice_order', {
          idempotencyKey: 'dup-ref',
          context: { locale: 'de', reference: 'PDX-AAAA1111' },
        }),
      ),
    ).toThrow(/UNIQUE/u)
    db.close()
  })
})

describe('PT22.2 · Idempotenz und fachliches Dedup', () => {
  it('liefert bei gleichem Schluessel und gleichem Rumpf denselben Vorgang', () => {
    const db = openLeadDatabase({ filename: ':memory:' })
    const repository = new LeadRepository(db)
    const first = repository.createLead(inputFor('support'))
    const replay = repository.createLead(inputFor('support'))
    expect(replay.id).toBe(first.id)
    expect(db.prepare('SELECT COUNT(*) AS n FROM leads').get().n).toBe(1)
    db.close()
  })

  it('meldet einen Konflikt, wenn derselbe Schluessel etwas anderes traegt', () => {
    const db = openLeadDatabase({ filename: ':memory:' })
    const repository = new LeadRepository(db)
    repository.createLead(inputFor('contact'))
    expect(() =>
      repository.createLead(
        inputFor('contact', { subject: { email: 'b@example.com', message: 'anders' } }),
      ),
    ).toThrow(IdempotencyConflictError)
    db.close()
  })

  it('dedupliziert fachlich JE JOURNEY — niemals global ueber die E-Mail', () => {
    const db = openLeadDatabase({ filename: ':memory:' })
    const repository = new LeadRepository(db)

    // Dieselbe Person, sieben verschiedene Journeys: keine davon ist eine
    // Dublette der anderen. Genau das haette ein globales E-Mail-Dedup kaputt gemacht.
    for (const journey of LEAD_JOURNEYS) repository.createLead(inputFor(journey))
    for (const journey of LEAD_JOURNEYS) {
      const other = LEAD_JOURNEYS.filter((candidate) => candidate !== journey)
      for (const candidate of other) {
        const found = repository.findRecentDuplicate({
          journey: candidate,
          subject: inputFor(journey).subject,
          context: inputFor(journey).context,
        })
        // Ein Fund waere nur dann korrekt, wenn die Felder der Journey
        // zufaellig identisch sind — bei diesen Eingaben nie.
        if (found) expect(found.journey).toBe(candidate)
      }
    }

    // Dieselbe Anfrage in derselben Journey wird dagegen erkannt.
    const duplicate = repository.findRecentDuplicate({
      journey: 'consumer_order',
      subject: inputFor('consumer_order').subject,
      context: inputFor('consumer_order').context,
    })
    expect(duplicate).toBeTruthy()
    expect(duplicate.journey).toBe('consumer_order')
    db.close()
  })

  it('vergisst die Dublette nach dem Fenster der Journey', () => {
    const db = openLeadDatabase({ filename: ':memory:' })
    const repository = new LeadRepository(db)
    repository.createLead(inputFor('contact'))
    const policy = DEDUP_POLICIES.contact
    const later = new Date(Date.now() + policy.windowMs + 60_000).toISOString()
    const found = repository.findRecentDuplicate({
      journey: 'contact',
      subject: inputFor('contact').subject,
      context: inputFor('contact').context,
      now: later,
    })
    // Eine Wiederholung nach dem Fenster ist eine legitime neue Anfrage.
    expect(found).toBeNull()
    db.close()
  })

  it('speichert vom Dedup-Schluessel nur den Hash, nie die E-Mail', () => {
    const db = openLeadDatabase({ filename: ':memory:' })
    const repository = new LeadRepository(db)
    const lead = repository.createLead(inputFor('contact'))
    const row = db.prepare('SELECT dedup_key FROM leads WHERE id = ?').get(lead.id)
    expect(row.dedup_key).toMatch(/^[0-9a-f]{64}$/u)
    expect(row.dedup_key).not.toContain('example.com')
    // Der Journey-Name geht in den Hash ein: gleiche Felder, andere Journey,
    // anderer Schluessel.
    expect(dedupKeyFor('contact', { email: 'ada@example.com' })).not.toBe(
      dedupKeyFor('support', { email: 'ada@example.com' }),
    )
    db.close()
  })

  it('hat fuer jede der sieben Journeys eine Dedup-Regel mit mehr als der E-Mail', () => {
    for (const journey of LEAD_JOURNEYS) {
      const policy = DEDUP_POLICIES[journey]
      expect(policy, journey).toBeTruthy()
      expect(policy.windowMs, journey).toBeGreaterThan(0)
      expect(policy.fields.length, `${journey}: mehr als nur E-Mail`).toBeGreaterThan(1)
      expect(policy.fields, journey).toContain('email')
    }
  })
})

describe('PT22.2 · Zustand, Audit und Aufbewahrung', () => {
  it('haelt Zustand, Zeitstempel und Protokoll ueber einen Neustart hinweg', () => {
    const filename = tempFile()
    let db = openLeadDatabase({ filename })
    let repository = new LeadRepository(db)
    const lead = repository.createLead(inputFor('roi_report'))
    db.close()

    db = openLeadDatabase({ filename })
    repository = new LeadRepository(db)
    const reopened = repository.getLead(lead.id)
    expect(reopened.status).toBe(LEAD_STATUSES.QUEUED)
    expect(reopened.journey).toBe('roi_report')
    expect(reopened.context.reportArea).toBe('implantologie')
    expect(reopened.consent.acceptedAt).toBe(consent.acceptedAt)
    expect(reopened.validatedAt).toBeTruthy()
    expect(reopened.queuedAt).toBeTruthy()
    expect(repository.getEvents(lead.id).map((event) => event.eventType)).toEqual([
      'LEAD_RECEIVED',
      'LEAD_VALIDATED',
      'LEAD_PERSISTED',
      'HANDOFF_PENDING',
    ])
    db.close()
  })

  it('setzt die Loeschfrist nur, wo sie wirklich entschieden ist', () => {
    const db = openLeadDatabase({ filename: ':memory:' })
    const repository = new LeadRepository(db)
    for (const journey of LEAD_JOURNEYS) {
      const lead = repository.createLead(inputFor(journey))
      const stored = repository.getLead(lead.id).retentionDeleteAfter
      if (RETENTION_POLICY_DAYS[journey]) {
        expect(stored, journey).toMatch(/^\d{4}-\d{2}-\d{2}$/u)
      } else {
        // `null` heisst: die Entscheidung fehlt. Eine Frist zu erfinden waere
        // eine datenschutzrechtliche Aussage, die dieser Task nicht trifft.
        expect(stored, journey).toBeNull()
      }
    }
    // Nur support hat heute eine Frist — und sie ist abfragbar.
    const due = repository.findDueForDeletion('2099-01-01T00:00:00.000Z')
    expect(due.map((row) => row.journey)).toEqual(['support'])
    db.close()
  })

  it('fuehrt jede Journey der Registry mit ihrem CRM-Ziel und Zustand', () => {
    expect(JOURNEY_REGISTRY).toHaveLength(7)
    for (const journey of JOURNEY_REGISTRY) {
      expect(LEAD_JOURNEYS).toContain(journey.id)
      expect(DEDUP_POLICIES[journey.id], `${journey.id}: Dedup`).toBeTruthy()
      expect(journey.id in RETENTION_POLICY_DAYS, `${journey.id}: Retention`).toBe(true)
    }
  })
})
