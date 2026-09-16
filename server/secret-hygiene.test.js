// @vitest-environment node
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

/**
 * AP26 PT26.4 — statischer Secret-Guard fuer den versionierten Stand.
 *
 * Er gibt nie einen Wert aus: Treffer werden als `Datei:Zeile` gemeldet. Die Muster sind
 * hochspezifisch (Providerpraefixe, Schluesselbloecke); die Laufzeit-Belege fuer Images und
 * Env stehen in `building-docs/SECURITY-CONTRACT.md` §16.
 */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const git = (...args) =>
  execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8')

const SECRET_PATTERNS = [
  'SG\\.[A-Za-z0-9_-]{16,}\\.[A-Za-z0-9_-]{16,}',
  'AKIA[0-9A-Z]{16}',
  '-----BEGIN [A-Z ]*PRIVATE KEY-----',
  'gh[pousr]_[A-Za-z0-9]{30,}',
  'xox[baprs]-[A-Za-z0-9-]{10,}',
  'AIza[0-9A-Za-z_-]{35}',
  'sk_live_[A-Za-z0-9]{20,}',
]

describe('PT26.4 — versionierte Dateien', () => {
  const tracked = git('ls-files').split('\n').filter(Boolean)

  it('keine Env-Dateien, Schluessel oder Datenbanken im Repository', () => {
    const forbidden = tracked.filter(
      (file) =>
        (/(^|\/)\.env(\.|$)/.test(file) && !file.endsWith('.example')) ||
        /\.(pem|key|p12|pfx|sqlite3?|sqlite3?-(wal|shm)|db)$/.test(file) ||
        /(^|\/)id_(rsa|ed25519)$/.test(file),
    )
    expect(forbidden).toEqual([])
  })

  it('kein hochspezifisches Secret-Muster in versionierten Textdateien', () => {
    let hits = ''
    try {
      hits = git('grep', '-nIE', '--', SECRET_PATTERNS.join('|'), '--', '.', ':!package-lock.json')
    } catch (error) {
      // git grep endet mit Status 1, wenn nichts gefunden wird.
      if (error.status !== 1) throw error
    }
    const locations = hits
      .split('\n')
      .filter(Boolean)
      .map((line) => line.split(':').slice(0, 2).join(':'))
    expect(locations).toEqual([])
  })

  it('Env-Beispiele enthalten nur Namen und Platzhalter', () => {
    for (const file of ['.env.example', 'server/.env.example', 'email/.env.example']) {
      if (!fs.existsSync(path.join(ROOT, file))) continue
      for (const line of read(file).split('\n')) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/)
        if (!match) continue
        const [, name, value] = match
        if (/(KEY|SECRET|TOKEN|PASSWORD)/.test(name)) {
          // Nur ein Boolean: auch ein Platzhalter wird nie in eine Testausgabe geschrieben.
          const candidate = value.trim().replace(/^['"]|['"]$/g, '')
          const placeholder =
            candidate === '' || /^(SG\.)?(x+|your[-_a-z]*|<[^>]+>|changeme)$/i.test(candidate)
          const looksReal =
            !placeholder &&
            (/^SG\.[A-Za-z0-9_-]{16,}\./.test(candidate) ||
              /^[A-Za-z0-9_\-.]{20,}$/.test(candidate))
          expect(looksReal, `${file}: ${name} wirkt wie ein echter Wert`).toBe(false)
        }
      }
    }
  })
})

describe('PT26.4 — Build- und Deploy-Grenze', () => {
  it('beide Build-Kontexte schliessen Env-Dateien und Lead-Daten aus', () => {
    const root = read('.dockerignore')
    expect(root).toMatch(/^\.env$/m)
    expect(root).toMatch(/^\.env\.\*$/m)
    const backend = read('server/.dockerignore')
    for (const pattern of ['.env', 'data', '*.sqlite3', '*.sqlite3-wal']) {
      expect(backend.split('\n')).toContain(pattern)
    }
  })

  it('Dockerfiles backen keine Secrets per ARG/ENV und kopieren keine Env-Datei', () => {
    for (const file of ['Dockerfile', 'server/Dockerfile']) {
      const source = read(file)
      expect(source, file).not.toMatch(/^\s*(ARG|ENV)\s+[A-Z_]*(KEY|SECRET|TOKEN|PASSWORD)/m)
      expect(source, file).not.toMatch(/^\s*(COPY|ADD)\s+[^\n]*\.env\b/m)
    }
  })

  it('Compose uebergibt Provider-Secrets nur per env_file zur Laufzeit', () => {
    const compose = read('docker-compose.yml')
    expect(compose).not.toMatch(/SENDGRID_API_KEY\s*[:=]/)
    expect(compose).toMatch(/env_file:\s*\n\s*-\s*\.\/server\/\.env/)
    expect(compose).not.toMatch(/^\s*(VITE_[A-Z_]*(KEY|SECRET|TOKEN))/m)
  })

  it('Client-Code liest keine Server-Secrets', () => {
    let hits = ''
    try {
      hits = git(
        'grep',
        '-nE',
        'SENDGRID|CONTACT_RECEIVER|SENDER_EMAIL|process\\.env\\.[A-Z_]*(KEY|SECRET|TOKEN)',
        '--',
        'src',
      )
    } catch (error) {
      if (error.status !== 1) throw error
    }
    expect(
      hits
        .split('\n')
        .filter(Boolean)
        .map((line) => line.split(':')[0]),
    ).toEqual([])
  })
})
