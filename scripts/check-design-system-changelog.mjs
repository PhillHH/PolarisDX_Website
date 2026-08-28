#!/usr/bin/env node
/**
 * Design-System-Changelog-Gate (AP05 / PT05.5).
 *
 * Zweck: **kein stiller Bruch des Token-/Komponentenvertrags.** Wer die
 * oeffentliche Oberflaeche des Design-Systems aendert, muss das im Changelog
 * festhalten — sonst faellt eine entfernte Farbrolle oder eine umbenannte
 * Komponente erst irgendwann auf einer Seite auf.
 *
 * WARUM KEIN DIFF-GATE: ein Vergleich gegen `origin/main` braucht einen
 * Basis-Ref, ist in flachen Klons und in dieser Worktree-Umgebung unzuverlaessig
 * und sagt nichts ueber den Ist-Zustand. Dieses Gate vergleicht stattdessen die
 * TATSAECHLICHE Oberflaeche im Code mit der im Changelog dokumentierten. Das
 * ist deterministisch, ohne Git ausfuehrbar und beschreibt genau das, was gilt.
 *
 * Geprueft wird die Oberflaeche, an der Aufrufstellen haengen:
 *   1. Farb-Token-Pfade aus `tailwind.config.js` (z. B. `accent.on-dark`);
 *   2. Typografie-/Link-Rollen `.t-*` aus `src/index.css`;
 *   3. exportierte Bausteine der AP05-eigenen Komponenten (Liste `OWNED`).
 *
 * Abweichung => Exit 1 mit der konkreten Differenz.
 *
 * Bewusst NICHT hier: Testabdeckung, Visual-Regression-Verdrahtung und
 * Release-Notes-Prozess. Das ist AP27 und wird nicht vorweggenommen.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const CHANGELOG = join(ROOT, 'building-docs/DESIGN-SYSTEM-CHANGELOG.md')

/** Farb-Token-Pfade aus der Tailwind-Config. */
async function colorTokens() {
  const mod = await import(join(ROOT, 'tailwind.config.js'))
  const colors = mod.default.theme.extend.colors
  const out = []
  for (const [name, value] of Object.entries(colors)) {
    if (typeof value === 'string') {
      out.push(name)
      continue
    }
    for (const [sub, subValue] of Object.entries(value)) {
      if (typeof subValue === 'string') {
        out.push(sub === 'DEFAULT' ? name : `${name}.${sub}`)
      } else {
        for (const leaf of Object.keys(subValue)) {
          out.push(leaf === 'DEFAULT' ? `${name}.${sub}` : `${name}.${sub}.${leaf}`)
        }
      }
    }
  }
  return out
}

/** Typografie-/Link-Rollen aus der Komponentenschicht. */
function typographyRoles() {
  const css = readFileSync(join(ROOT, 'src/index.css'), 'utf8')
  return [...css.matchAll(/^\s{2}\.(t-[a-z0-9-]+)\s*\{/gm)].map((m) => m[1])
}

/**
 * Exportierte Bausteine der Design-System-Schicht.
 *
 * BEWUSST EINE EXPLIZITE LISTE und kein Verzeichnis-Scan: `src/components/ui/`
 * enthaelt auch Bausteine, die AP05 nicht besitzt (Suche, Sprachumschalter,
 * Flaggen, Chat-Rest). Die mit einem Verzeichnis-Scan wuerde jede spaetere
 * AP06+-Arbeit dieses Gate ausloesen, ohne dass sich am Design-System-Vertrag
 * etwas geaendert haette. Wer hier einen Baustein ergaenzt, erweitert bewusst
 * den Vertrag.
 */
const OWNED = [
  'src/components/ui/Alert.tsx',
  'src/components/ui/Button.tsx',
  'src/components/ui/Card.tsx',
  'src/components/ui/Choice.tsx',
  'src/components/ui/Dialog.tsx',
  'src/components/ui/Eyebrow.tsx',
  'src/components/ui/FormField.tsx',
  'src/components/ui/Input.tsx',
  'src/components/ui/LoadingSpinner.tsx',
  'src/components/ui/SectionHeader.tsx',
  'src/components/ui/StateBlock.tsx',
  'src/components/ui/Textarea.tsx',
  'src/components/layout/Section.tsx',
]

function components() {
  const out = []
  for (const file of OWNED) {
    const src = readFileSync(join(ROOT, file), 'utf8')
    for (const m of src.matchAll(/^export const ([A-Za-z][A-Za-z0-9_]*)/gm)) out.push(m[1])
    for (const m of src.matchAll(/^export default function ([A-Z][A-Za-z0-9_]*)/gm)) out.push(m[1])
    for (const m of src.matchAll(/^export default ([A-Z][A-Za-z0-9_]*)\s*$/gm)) out.push(m[1])
    for (const m of src.matchAll(/^export \{ ([^}]+) \}/gm)) {
      for (const name of m[1].split(',')) {
        const clean = name
          .trim()
          .split(/\s+as\s+/)
          .pop()
          .trim()
        // Auch klein geschriebene Exporte zaehlen: `buttonVariants` und
        // `textareaVariants` sind oeffentliche API, an der Aufrufstellen haengen.
        if (/^[A-Za-z]/.test(clean)) out.push(clean)
      }
    }
  }
  return out
}

/** Die im Changelog dokumentierte Oberflaeche. */
function documented(section) {
  const md = readFileSync(CHANGELOG, 'utf8')
  const re = new RegExp(`<!-- SURFACE:${section} -->([\\s\\S]*?)<!-- /SURFACE:${section} -->`)
  const block = md.match(re)
  if (!block) {
    console.error(`✖ Changelog: Block SURFACE:${section} fehlt in DESIGN-SYSTEM-CHANGELOG.md`)
    process.exit(1)
  }
  return [...block[1].matchAll(/`([^`]+)`/g)].map((m) => m[1])
}

const uniqSort = (a) => [...new Set(a)].sort()

const checks = [
  ['colors', uniqSort(await colorTokens())],
  ['typography', uniqSort(typographyRoles())],
  ['components', uniqSort(components())],
]

let failed = false
for (const [section, actual] of checks) {
  const expected = uniqSort(documented(section))
  const added = actual.filter((x) => !expected.includes(x))
  const removed = expected.filter((x) => !actual.includes(x))
  if (added.length || removed.length) {
    failed = true
    console.error(`\n✖ Design-System-Oberflaeche "${section}" weicht vom Changelog ab:`)
    if (added.length) console.error(`   NEU im Code, fehlt im Changelog: ${added.join(', ')}`)
    if (removed.length) console.error(`   IM CHANGELOG, fehlt im Code:    ${removed.join(', ')}`)
  }
}

if (failed) {
  console.error(
    '\nEine Aenderung an Tokens, Typo-Rollen oder Komponenten ist ein Vertragsereignis.',
  )
  console.error(
    'Bitte building-docs/DESIGN-SYSTEM-CHANGELOG.md ergaenzen: Change Note + SURFACE-Block.\n',
  )
  process.exit(1)
}

console.log(
  `✓ Design-System-Changelog: Oberflaeche dokumentiert (${checks[0][1].length} Farb-Token, ` +
    `${checks[1][1].length} Typo-Rollen, ${checks[2][1].length} Komponenten).`,
)
