#!/usr/bin/env node
/**
 * AP27 PT27.6 — Changelog-Gate fuer visuelle Baselines.
 *
 * Wer eine Screenshot-Baseline (`e2e/*-snapshots/*.png`) aendert, muss denselben Change im
 * `DESIGN-SYSTEM-CHANGELOG.md` begruenden (Ursache, betroffene Screenshots, Design-Delta,
 * Reviewer). Die Token-Oberflaeche prueft bereits `check:ds-changelog`. Aenderungen ausserhalb
 * dieser Pfade — Backend, Doku, Tests ohne Baseline — sind nicht betroffen.
 *
 *   node scripts/check-visual-baseline-changelog.mjs --base <ref>   # CI: gegen den Basis-Commit
 *   node scripts/check-visual-baseline-changelog.mjs --worktree      # lokal: inklusive Arbeitsbaum
 *   node scripts/check-visual-baseline-changelog.mjs --self-test     # Erkennung beweisen
 */
import { execFileSync } from 'node:child_process'

export const CHANGELOG = 'building-docs/DESIGN-SYSTEM-CHANGELOG.md'
// Nur Screenshot-Baselines. Die Design-Token-Oberflaeche (Farben, Typo-Rollen, Bausteine) haelt
// bereits `check:ds-changelog` gegen den Changelog; eine zweite Pflicht fuer jede CSS-Zeile waere
// Buerokratie ohne Mehrwert.
export const DESIGN_PATHS = [/^e2e\/[^/]+-snapshots\/.+\.png$/]

export function evaluate(files) {
  const touched = files.filter((file) => DESIGN_PATHS.some((pattern) => pattern.test(file)))
  if (touched.length === 0) return { ok: true, reason: 'NOT_AFFECTED', touched }
  return files.includes(CHANGELOG)
    ? { ok: true, reason: 'CHANGELOG_PRESENT', touched }
    : { ok: false, reason: 'CHANGELOG_MISSING', touched }
}

const git = (args) =>
  execFileSync('git', args, { encoding: 'utf8' })
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

function resolveBase(requested) {
  // Ein neuer Branch liefert bei `push` als Vorgaenger 000…0 — dann gilt die Hauptlinie.
  const candidates = [requested, process.env.VISUAL_CHANGELOG_BASE, 'origin/main'].filter(
    (ref) => ref && !/^0+$/.test(ref),
  )
  for (const ref of candidates) {
    try {
      git(['rev-parse', '--verify', `${ref}^{commit}`])
      return ref
    } catch {
      // naechster Kandidat
    }
  }
  return null
}

function changedFiles({ base, worktree }) {
  const files = new Set()
  if (base) for (const file of git(['diff', '--name-only', `${base}...HEAD`])) files.add(file)
  if (worktree) {
    for (const file of git(['diff', '--name-only', 'HEAD'])) files.add(file)
    for (const file of git(['ls-files', '--others', '--exclude-standard'])) files.add(file)
  }
  return [...files]
}

function selfTest() {
  const cases = [
    [['server/server.js', 'building-docs/state/AP-STATE.md'], true, 'NOT_AFFECTED'],
    [['e2e/pt27.6-visual.spec.ts-snapshots/home-desktop-linux.png'], false, 'CHANGELOG_MISSING'],
    [
      ['e2e/pt27.6-visual.spec.ts-snapshots/home-desktop-linux.png', CHANGELOG],
      true,
      'CHANGELOG_PRESENT',
    ],
    [['e2e/design-system.spec.ts-snapshots/buttons-desktop-linux.png'], false, 'CHANGELOG_MISSING'],
    [['tailwind.config.js', 'src/index.css'], true, 'NOT_AFFECTED'],
  ]
  for (const [files, ok, reason] of cases) {
    const result = evaluate(files)
    if (result.ok !== ok || result.reason !== reason) {
      console.error(`Visual-Changelog-Gate Self-Test FAIL: ${files.join(', ')} → ${result.reason}`)
      process.exit(1)
    }
  }
  console.log(`Visual-Changelog-Gate Self-Test PASS: ${cases.length} Faelle erkannt`)
}

const args = process.argv.slice(2)
if (args.includes('--self-test')) {
  selfTest()
} else {
  const baseIndex = args.indexOf('--base')
  const worktree = args.includes('--worktree')
  const base = resolveBase(baseIndex >= 0 ? args[baseIndex + 1] : undefined)
  if (!base && !worktree) {
    console.error('Visual-Changelog-Gate: kein Basis-Commit ermittelbar (--base oder origin/main)')
    process.exit(2)
  }
  const result = evaluate(changedFiles({ base, worktree }))
  if (!result.ok) {
    console.error(
      `Visual-Changelog-Gate FAIL: ${result.touched.length} Design-/Baseline-Datei(en) ohne Eintrag in ${CHANGELOG}:`,
    )
    for (const file of result.touched) console.error(`- ${file}`)
    process.exit(1)
  }
  console.log(
    `Visual-Changelog-Gate PASS (${result.reason}; Basis ${base ?? 'keine'}${worktree ? ' + Arbeitsbaum' : ''}; ${result.touched.length} betroffene Datei(en))`,
  )
}
