// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fork } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

/**
 * AP22 PT22.7 — Chat-Entfernung.
 *
 * `/api/chat` war KEINE Journey: ein Mock-Echo-Handler ohne Frontend-Aufrufer,
 * ohne Persistenz, ohne Consent und als einziger POST-Endpunkt OHNE
 * `formLimiter`. Er ist entfernt (`DEC-RL-007`, Gate 5).
 *
 * Gemessen wird hier BEIDES: der laufende Server (POST laeuft in den 404 von
 * Express, waehrend eine echte Journey daneben weiter antwortet — sonst wuerde
 * ein kaputter Server denselben 404 liefern und der Test nichts beweisen) und
 * der Quellbaum (kein Handler, keine Provider-Referenz, keine Chat-Domain in
 * der CSP, keine Chat-Config, keine Chat-Abhaengigkeit).
 */

const require = createRequire(import.meta.url)
const here = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(here, '..')
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8')

// Kommentare duerfen die Entfernung BEGRUENDEN, ohne einen Test auszuloesen,
// der nach dem entfernten Namen sucht. Geprueft wird Code, nicht Prosa.
const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

describe('AP22 PT22.7 — /api/chat ist am laufenden Server absent', () => {
  let directory
  let child
  let baseUrl

  beforeAll(async () => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt227-'))
    const net = await import('node:net')
    const port = await new Promise((resolve) => {
      const server = net.createServer().listen(0, '127.0.0.1', () => {
        const { port: free } = server.address()
        server.close(() => resolve(free))
      })
    })
    child = fork(path.join(here, 'server.js'), {
      env: {
        ...process.env,
        PORT: String(port),
        NODE_ENV: 'test',
        SENDGRID_API_KEY: '',
        CONTACT_RECEIVER: 'team@polarisdx.example',
        SENDER_EMAIL: 'web@polarisdx.example',
        LEAD_DB_PATH: path.join(directory, 'leads.sqlite3'),
        LEAD_DISPATCHER_DISABLED: '1',
      },
      stdio: 'pipe',
    })
    baseUrl = `http://127.0.0.1:${port}`

    const deadline = Date.now() + 20_000
    for (;;) {
      try {
        await fetch(`${baseUrl}/api/contact`, { method: 'POST' })
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

  it('beantwortet POST /api/chat mit 404 und ohne Chat-Nutzlast', async () => {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'hallo' }),
    })
    expect(response.status).toBe(404)
    const text = await response.text()
    expect(text).not.toMatch(/reply/i)
    // Die Mock-Antworten des alten Handlers duerfen nirgends mehr auftauchen.
    expect(text).not.toMatch(/Mitarbeiter wird sich/i)
    expect(text).not.toMatch(/Wie kann ich Ihnen heute helfen/i)
  })

  it('auch GET und OPTIONS auf /api/chat sind 404 — kein Rest-Handler', async () => {
    for (const method of ['GET', 'PUT', 'DELETE']) {
      const response = await fetch(`${baseUrl}/api/chat`, { method })
      expect(response.status).toBe(404)
    }
  })

  it('Gegenprobe: eine echte Journey antwortet weiterhin (der 404 ist kein toter Server)', async () => {
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    // 400 (Validierung greift) — entscheidend ist: NICHT 404.
    expect(response.status).not.toBe(404)
    expect(response.status).toBe(400)
  })
})

describe('AP22 PT22.7 — keine Chat-Reste im Quellbaum', () => {
  it('server/server.js enthaelt weder Route noch Mock-Logik noch Chat-Prosa', () => {
    const source = read('server/server.js')
    expect(source).not.toMatch(/api\/chat/)
    expect(source).not.toMatch(/chat/i)
    expect(source).not.toMatch(/botbuilder|botframework|directline/i)
  })

  it('die CSP fuehrt keine Chat-Domain mehr — in KEINER Direktive', () => {
    // Seit AP26 PT26.2 liegt die Policy in src/security/contentSecurityPolicy.ts.
    for (const rel of ['server.ts', 'src/security/contentSecurityPolicy.ts']) {
      const code = stripComments(read(rel))
      expect(code).not.toMatch(/hihuman/i)
      // Auch keine Wildcard-Restform.
      expect(code).not.toMatch(/\*\.hihuman/i)
    }
    // Der consent-gegatete GTM-Eintrag bleibt; die veraltete Google-Fonts-Origin ist mit
    // PT26.2 entfernt (Schrift selbstgehostet, NETWORK-ALLOWLIST N-02/N-09).
    const policy = stripComments(read('src/security/contentSecurityPolicy.ts'))
    expect(policy).toContain('https://www.googletagmanager.com')
    expect(stripComments(read('server.ts'))).not.toContain('https://fonts.gstatic.com')
  })

  it('kein Chat-Provider und keine Chat-Abhaengigkeit im Paketmanifest', () => {
    for (const manifest of ['package.json', 'server/package.json']) {
      const pkg = JSON.parse(read(manifest))
      const names = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
      expect(names.filter((n) => /chat|hihuman|botbuilder|botframework/i.test(n))).toEqual([])
    }
  })

  it('keine Chat-Env-Variable und kein Chat-Secret in Konfiguration oder Deployment', () => {
    const candidates = [
      '.env.example',
      'docker-compose.yml',
      'docker-compose.preview.yml',
      'Dockerfile',
      'Dockerfile.preview',
    ]
    for (const rel of candidates) {
      const file = path.join(ROOT, rel)
      if (!fs.existsSync(file)) continue
      const text = fs.readFileSync(file, 'utf8')
      // Namen, keine Werte — es wird nie ein Secret ausgegeben.
      expect(text).not.toMatch(/CHAT_[A-Z_]*|HIHUMAN[A-Z_]*|DIRECTLINE[A-Z_]*/)
    }
  })

  it('kein produktiver Frontend-Aufrufer und keine ChatWidget-Datei mehr', () => {
    expect(fs.existsSync(path.join(ROOT, 'src/components/ui/ChatWidget.tsx'))).toBe(false)
    const clients = fs
      .readdirSync(path.join(ROOT, 'src/api'))
      .map((name) => stripComments(read(path.join('src/api', name))))
    expect(clients.filter((text) => /\/api\/chat/.test(text))).toEqual([])
  })

  it('die Journey-Registry kennt Chat nicht — sieben Journeys, keine achte', () => {
    const { LEAD_JOURNEYS } = require('./lead-foundation/constants.js')
    expect(LEAD_JOURNEYS).toHaveLength(7)
    expect(LEAD_JOURNEYS).not.toContain('chat')
  })

  it('die aktuelle Dokumentation behauptet keinen aktiven Chat mehr', () => {
    expect(fs.existsSync(path.join(ROOT, 'CHAT_INTEGRATION.md'))).toBe(false)
    expect(stripComments(read('README.md'))).not.toMatch(/api\/chat/)
    expect(read('docs/design-system.md')).not.toMatch(/ChatWidget/)
  })
})
