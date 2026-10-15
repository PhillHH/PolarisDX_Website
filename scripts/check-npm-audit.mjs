#!/usr/bin/env node
/**
 * AP27-CLOSURE — Laufzeit-Audit mit Ausnahmeregister (SECURITY-CONTRACT §17.1, §17.4, §17.5).
 *
 * Blockiert wie bisher jede Laufzeit-Advisory ab `high` in Root und Server
 * (`npm audit --omit=dev`). Ausgenommen ist nur, was in `scripts/npm-audit-exceptions.json`
 * mit Advisory-ID, Paket und Scope steht — und auch das nur, solange
 *   - der Review-Termin nicht abgelaufen ist,
 *   - das Paket keine neuere Version veroeffentlicht hat als die geprueft (sie kann den Fix
 *     enthalten; dann muss aktualisiert oder neu bewertet werden),
 *   - die Advisory im Audit tatsaechlich noch auftaucht (kein Eintrag ohne Befund).
 * Keine Wildcards, keine Severity-Absenkung, keine Ausnahme fuer Advisories mit Fix.
 *
 *   node scripts/check-npm-audit.mjs              # Root + Server gegen das Register
 *   node scripts/check-npm-audit.mjs --self-test  # Erkennung beweisen
 */
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

export const REGISTER = 'scripts/npm-audit-exceptions.json'
const BLOCKING = new Set(['high', 'critical'])
const SCOPES = { root: [], server: ['--prefix', 'server'] }

/**
 * Advisories ab `high` aus einem `npm audit --json`-Bericht. Gezaehlt werden nur die Advisories
 * selbst; Pakete, die nur ueber eine Abhaengigkeit betroffen sind (`via` als String), erben die
 * Severity und waeren sonst doppelt gezaehlt.
 */
export function blockingAdvisories(report, scope) {
  const found = new Map()
  for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
    for (const via of vulnerability.via ?? []) {
      if (typeof via !== 'object' || !BLOCKING.has(via.severity)) continue
      const id = String(via.url ?? via.source)
        .split('/')
        .pop()
      found.set(`${scope}:${id}:${via.name}`, {
        scope,
        id,
        package: via.name,
        severity: via.severity,
        range: via.range,
      })
    }
  }
  return [...found.values()]
}

export function evaluate({ advisories, exceptions, today, latestVersions }) {
  const problems = []
  const used = new Set()
  for (const advisory of advisories) {
    const label = `${advisory.scope}: ${advisory.package} ${advisory.id} (${advisory.severity})`
    const exception = exceptions.find(
      (entry) =>
        entry.advisory === advisory.id &&
        entry.package === advisory.package &&
        entry.scope === advisory.scope,
    )
    if (!exception) {
      problems.push(`${label} — nicht im Ausnahmeregister`)
      continue
    }
    used.add(exception)
    if (exception.review < today) {
      problems.push(`${label} — Review-Termin ${exception.review} abgelaufen`)
    }
    const latest = latestVersions[exception.package]
    if (latest !== exception.latestChecked) {
      problems.push(
        `${label} — neueste Version ${latest ?? 'unbekannt'}, geprueft war ${exception.latestChecked}: Fix pruefen, Register neu bewerten`,
      )
    }
  }
  for (const exception of exceptions) {
    if (!used.has(exception)) {
      problems.push(
        `${exception.scope}: ${exception.package} ${exception.advisory} — Ausnahme ohne Befund, Eintrag entfernen`,
      )
    }
  }
  return { ok: problems.length === 0, problems }
}

function audit(scope) {
  const result = spawnSync('npm', ['audit', '--omit=dev', '--json', ...SCOPES[scope]], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
  // `npm audit` endet mit Exit 1, sobald es irgendetwas findet; massgeblich ist der Bericht.
  if (!result.stdout) throw new Error(`npm audit (${scope}) ohne Bericht: ${result.stderr}`)
  const report = JSON.parse(result.stdout)
  if (report.error) throw new Error(`npm audit (${scope}): ${JSON.stringify(report.error)}`)
  return report
}

function latestVersion(name) {
  const result = spawnSync('npm', ['view', name, 'version'], { encoding: 'utf8' })
  if (result.status !== 0) throw new Error(`npm view ${name}: ${result.stderr}`)
  return result.stdout.trim()
}

function selfTest() {
  const advisory = (name, severity, id) => ({
    name,
    severity,
    url: `https://github.com/advisories/${id}`,
    range: '<=1.0.0',
  })
  const report = {
    vulnerabilities: {
      a: { via: [advisory('a', 'high', 'GHSA-aaaa')] },
      parent: { via: ['a'] },
      low: { via: [advisory('low', 'low', 'GHSA-low')] },
    },
  }
  const found = blockingAdvisories(report, 'root')
  const exception = {
    advisory: 'GHSA-aaaa',
    package: 'a',
    scope: 'root',
    review: '2026-11-15',
    latestChecked: '1.0.0',
  }
  const base = { advisories: found, today: '2026-10-15', latestVersions: { a: '1.0.0' } }
  const cases = [
    ['nur die Advisory zaehlt, nicht der abgeleitete Elternknoten', found.length === 1],
    ['low/moderate blockiert nicht', found.every((entry) => entry.package !== 'low')],
    ['ohne Register blockiert high', !evaluate({ ...base, exceptions: [] }).ok],
    ['gueltige Ausnahme laesst durch', evaluate({ ...base, exceptions: [exception] }).ok],
    [
      'abgelaufener Review blockiert',
      !evaluate({ ...base, exceptions: [exception], today: '2026-11-16' }).ok,
    ],
    [
      'neue Version blockiert',
      !evaluate({ ...base, exceptions: [exception], latestVersions: { a: '1.0.1' } }).ok,
    ],
    [
      'anderer Scope ist nicht ausgenommen',
      !evaluate({ ...base, exceptions: [{ ...exception, scope: 'server' }] }).ok,
    ],
    [
      'Ausnahme ohne Befund blockiert',
      !evaluate({ ...base, advisories: [], exceptions: [exception] }).ok,
    ],
  ]
  const failed = cases.filter(([, passed]) => !passed)
  for (const [name, passed] of cases) console.log(`${passed ? 'PASS' : 'FAIL'} ${name}`)
  if (failed.length > 0) process.exit(1)
  console.log(`npm-audit-gate self-test: ${cases.length}/${cases.length}`)
}

const args = process.argv.slice(2)
if (args.includes('--self-test')) {
  selfTest()
} else {
  const { exceptions } = JSON.parse(readFileSync(REGISTER, 'utf8'))
  const advisories = Object.keys(SCOPES).flatMap((scope) => blockingAdvisories(audit(scope), scope))
  const latestVersions = Object.fromEntries(
    [...new Set(exceptions.map((entry) => entry.package))].map((name) => [
      name,
      latestVersion(name),
    ]),
  )
  const today = new Date().toISOString().slice(0, 10)
  const { ok, problems } = evaluate({ advisories, exceptions, today, latestVersions })
  for (const advisory of advisories) {
    const excepted = exceptions.some(
      (entry) => entry.advisory === advisory.id && entry.scope === advisory.scope,
    )
    console.log(
      `${excepted ? 'AUSNAHME' : 'BEFUND  '} ${advisory.scope}: ${advisory.package} ${advisory.id} (${advisory.severity}, ${advisory.range})`,
    )
  }
  if (!ok) {
    for (const problem of problems) console.error(`FAIL ${problem}`)
    process.exit(1)
  }
  console.log(
    `npm-audit-gate: PASS — ${advisories.length} Advisory ab high, alle im Register (${REGISTER})`,
  )
}
