// @vitest-environment node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import {
  buildContentSecurityPolicy,
  contentSecurityPolicyDirectives,
  CSP_REMOVED_SOURCES,
  CSP_THIRD_PARTY_SOURCES,
  cspHeaderName,
  resolveCspMode,
} from './contentSecurityPolicy'

/**
 * AP26 PT26.2 — statischer CSP-Guard.
 *
 * Geprueft wird die Policy, die `server.ts` ausliefert (einzige Quelle), plus
 * der Quellbaum: keine entfernte Provider-Domain darf in Code oder
 * Konfiguration zurueckkehren, und `server.ts` darf keine zweite CSP bauen.
 * Die Laufzeitmessung derselben Policy steht in `e2e/pt26.2.spec.ts`.
 */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8')
// Kommentare duerfen eine Entfernung begruenden; geprueft wird Code.
const stripComments = (text: string) =>
  text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\s\/\/ .*$/gm, '')

const HASH = 'q1w2e3r4t5y6u7i8o9p0asdfghjklzxcvbnmQWERTYU='
const directives = new Map(contentSecurityPolicyDirectives({ styleHashes: [HASH] }))

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules') walk(rel, out)
    } else if (/\.(ts|tsx|js|mjs|cjs|html|json|conf|ya?ml)$/.test(entry.name)) out.push(rel)
  }
  return out
}

describe('PT26.2 — Zielpolicy', () => {
  it('fuehrt keine Schema-Quelle und keine Wildcard', () => {
    for (const [name, sources] of directives) {
      for (const source of sources) {
        expect(source, `${name}: ${source}`).not.toMatch(/^(https?|wss?):$/)
        expect(source, `${name}: ${source}`).not.toContain('*')
        expect(source, `${name}: ${source}`).not.toMatch(/^http:/)
      }
    }
  })

  it('kennt kein unsafe-eval und kein unsafe-inline fuer Skripte oder Stylesheet-Elemente', () => {
    const policy = buildContentSecurityPolicy({ styleHashes: [HASH] })
    expect(policy).not.toContain("'unsafe-eval'")
    expect(policy).not.toContain("'unsafe-hashes'")
    for (const name of ['script-src', 'style-src', 'style-src-elem', 'default-src']) {
      expect(directives.get(name), name).not.toContain("'unsafe-inline'")
    }
    // Die einzige Inline-Freigabe ist die dokumentierte Attribut-Ausnahme.
    expect(policy.match(/'unsafe-inline'/g)).toHaveLength(1)
    expect(directives.get('style-src-attr')).toEqual(["'unsafe-inline'"])
  })

  it('haelt die festen Schutzdirektiven', () => {
    expect(directives.get('default-src')).toEqual(["'self'"])
    expect(directives.get('base-uri')).toEqual(["'self'"])
    expect(directives.get('object-src')).toEqual(["'none'"])
    expect(directives.get('frame-ancestors')).toEqual(["'self'"])
    expect(directives.get('form-action')).toEqual(["'self'"])
    expect(directives.get('frame-src')).toEqual(["'none'"])
    expect(directives.get('font-src')).toEqual(["'self'"])
  })

  it('gibt das Inline-Stylesheet nur per Hash frei und behauptet keinen Report-Empfaenger', () => {
    expect(directives.get('style-src')).toEqual(["'self'", `'sha256-${HASH}'`])
    expect(directives.get('style-src-elem')).toEqual(["'self'", `'sha256-${HASH}'`])
    expect(buildContentSecurityPolicy()).not.toContain('sha256-')
    const policy = buildContentSecurityPolicy({ styleHashes: [HASH] })
    expect(policy).not.toMatch(/report-uri|report-to/)
  })

  it('jede fremde Origin steht mit Grund in der Allowlist — und nur diese', () => {
    const allowed = new Set(CSP_THIRD_PARTY_SOURCES.map((source) => source.origin))
    const foreign = [...directives.values()].flat().filter((source) => /^https:\/\//.test(source))
    expect(new Set(foreign)).toEqual(allowed)
    for (const source of CSP_THIRD_PARTY_SOURCES) {
      expect(source.origin).toMatch(/^https:\/\/[a-z0-9.-]+$/)
      expect(source.reason.length).toBeGreaterThan(20)
      expect(source.classification).toBe('CONSENT_ANALYTICS')
    }
    expect([...allowed].sort()).toEqual([
      'https://region1.google-analytics.com',
      'https://www.googletagmanager.com',
    ])
  })

  it('der GTM-Eintrag hat einen Verwender: den consent-gegateten Loader', () => {
    const loader = stripComments(read('src/lib/googleConsent.ts'))
    expect(loader).toContain('https://www.googletagmanager.com/gtm.js')
    // Der Loader kehrt ohne Zustimmung vor jedem Seiteneffekt zurueck (AP23).
    expect(loader).toMatch(/if \(!granted && !providerAlreadyLoaded\)/)
  })

  it('entfernte Quellen stehen in keiner Direktive', () => {
    const policy = buildContentSecurityPolicy({ styleHashes: [HASH] })
    for (const removed of CSP_REMOVED_SOURCES) expect(policy).not.toContain(removed)
  })
})

describe('PT26.2 — Modus', () => {
  it('Produktion setzt durch, Entwicklung meldet nur im Browser', () => {
    expect(resolveCspMode({ NODE_ENV: 'production' })).toBe('enforce')
    expect(resolveCspMode({})).toBe('report-only')
    expect(resolveCspMode({ NODE_ENV: 'development' })).toBe('report-only')
  })

  it('der Rueckfallschalter ist explizit; ein Tippfehler schaltet den Schutz nicht ab', () => {
    expect(resolveCspMode({ NODE_ENV: 'production', POLARIS_CSP_MODE: 'report-only' })).toBe(
      'report-only',
    )
    expect(resolveCspMode({ NODE_ENV: 'production', POLARIS_CSP_MODE: 'reportonly' })).toBe(
      'enforce',
    )
    expect(resolveCspMode({ NODE_ENV: 'production', POLARIS_CSP_MODE: '' })).toBe('enforce')
    expect(cspHeaderName('enforce')).toBe('Content-Security-Policy')
    expect(cspHeaderName('report-only')).toBe('Content-Security-Policy-Report-Only')
  })
})

describe('PT26.2 — Quellbaum ohne Chat-/Legacy-Provider', () => {
  it('server.ts baut keine eigene Policy und nutzt das Modul', () => {
    const server = stripComments(read('server.ts'))
    expect(server).toContain("from './src/security/contentSecurityPolicy'")
    expect(server).not.toMatch(/script-src|default-src|unsafe-eval|unsafe-inline/)
    expect(server).not.toMatch(/'Content-Security-Policy(-Report-Only)?'/)
  })

  it('keine entfernte Provider-Domain in Code, Konfiguration oder Deployment', () => {
    const files = [
      ...walk('src'),
      ...walk('server'),
      ...walk('deploy'),
      'server.ts',
      'index.html',
      'vite.config.ts',
      'docker-compose.yml',
      'Dockerfile',
      '.env.example',
      'server/.env.example',
    ].filter((rel) => fs.existsSync(path.join(ROOT, rel)) && !/\.test\.[jt]sx?$/.test(rel))
    const hits: string[] = []
    for (const rel of files) {
      const code = stripComments(read(rel))
      if (/hihuman/i.test(code)) hits.push(`${rel}: chat provider`)
      // Das Modul fuehrt die Liste selbst; seine Policy prueft der Test oben.
      if (rel === path.join('src', 'security', 'contentSecurityPolicy.ts')) continue
      for (const removed of CSP_REMOVED_SOURCES) {
        if (code.includes(removed)) hits.push(`${rel}: ${removed}`)
      }
    }
    expect(hits).toEqual([])
  })
})
