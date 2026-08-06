#!/usr/bin/env node
/**
 * Farb-Guard: erzwingt EINE Navy und EINEN Akzent.
 *
 * Regeln (Verstoß => Exit 1):
 *   1. Kein Raw-Hex in src/ (Tokens statt Literale).
 *   2. Keine Arbitrary-Farbklassen  bg-[#...] / text-[rgb(...)] etc.
 *   3. Kein `gray-900` — das Legacy-Navy #203864 ist abgeschafft.
 *      Headline-/Body-Ink ist `text-heading` (#083358).
 *   4. Keine rohen chromatischen Tailwind-Skalen (teal-600, blue-50, ...).
 *      Erlaubt sind ausschließlich die Tokens aus tailwind.config.js:
 *      brand-*, accent-*, success-*, heading, ui-*, gray-100/500.
 *
 * Bewusste Ausnahmen:
 *   - `red-*`  : semantische Fehler-/Validierungszustände (kein Akzent).
 *                Es gibt dafür (noch) keine Token-Gruppe.
 *   - Neutrale Familien gray/slate/zinc/neutral/stone: Grautöne, kein Navy.
 *   - FlagIcon.tsx: Länderflaggen sind vorgegebene Fremdfarben.
 *   - Neutrale Flächen-Hexes in index.css (Seiten-Hintergrund).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SRC = join(ROOT, 'src')

/** Dateien, in denen Raw-Hex erlaubt ist (mit Begründung). */
const HEX_ALLOWED_FILES = new Set(['src/components/ui/FlagIcon.tsx'])
/** Neutrale Flächen-Hexes, die kein Marken-Token haben. */
const HEX_ALLOWED_VALUES = new Set(['#f8fafc', '#f1f5f9'])

/** Chromatische Tailwind-Familien, die nicht roh verwendet werden dürfen. */
const OFF_FAMILIES =
  'teal|emerald|green|blue|indigo|sky|violet|purple|fuchsia|pink|amber|yellow|orange|lime|cyan|rose'

const RE_HEX = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g
const RE_ARBITRARY = /\b[a-z-]+-\[(?:#[0-9a-fA-F]{3,8}|rgb|rgba|hsl)\b[^\]]*\]/g
const RE_LEGACY_NAVY = /\bgray-900\b/g
const RE_OFF_SCALE = new RegExp(`\\b(?:${OFF_FAMILIES})-(?:50|100|200|300|400|500|600|700|800|900|950)\\b`, 'g')

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.(tsx?|css)$/.test(entry)) out.push(full)
  }
  return out
}

const violations = []

for (const file of walk(SRC)) {
  const rel = relative(ROOT, file).replace(/\\/g, '/')
  const lines = readFileSync(file, 'utf8').split('\n')

  lines.forEach((line, i) => {
    const at = `${rel}:${i + 1}`
    // Inline-SVG-Datenurls und Kommentarzeilen mit Erklärtext ausklammern
    const isDataUrl = line.includes('data:image/svg+xml')

    if (!HEX_ALLOWED_FILES.has(rel) && !isDataUrl) {
      for (const hex of line.match(RE_HEX) ?? []) {
        if (!HEX_ALLOWED_VALUES.has(hex.toLowerCase())) {
          violations.push([at, `Raw-Hex ${hex} — stattdessen Token verwenden`, line.trim()])
        }
      }
    }
    for (const m of line.match(RE_ARBITRARY) ?? []) {
      violations.push([at, `Arbitrary-Farbklasse ${m}`, line.trim()])
    }
    for (const m of line.match(RE_LEGACY_NAVY) ?? []) {
      violations.push([at, `Legacy-Navy ${m} — nutze text-heading / brand-deep`, line.trim()])
    }
    for (const m of line.match(RE_OFF_SCALE) ?? []) {
      violations.push([at, `Off-Token-Farbe ${m} — nutze accent-* / brand-* / success-*`, line.trim()])
    }
  })
}

if (violations.length) {
  console.error(`\n✖ Farb-Guard: ${violations.length} Verstoß/Verstöße\n`)
  for (const [at, why, src] of violations) {
    console.error(`  ${at}\n    ${why}\n    > ${src.slice(0, 140)}\n`)
  }
  console.error('Erlaubt: brand-*, accent-*, success-*, heading, ui-*, gray-100/500,')
  console.error('neutrale gray/slate/zinc/neutral/stone-Skalen und red-* (Fehlerzustände).\n')
  process.exit(1)
}

console.log('✓ Farb-Guard: eine Navy (#083358), ein Akzent (Teal), kein Raw-Hex.')
