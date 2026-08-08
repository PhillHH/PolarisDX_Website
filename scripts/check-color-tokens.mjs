#!/usr/bin/env node
/**
 * Farb-Guard: erzwingt EINE Navy (#083358) und EINEN Akzent (Teal #0d9488).
 *
 * Geprüft werden alle Flächen, die Marke transportieren:
 *   src/**\/*.{ts,tsx,css} · tailwind.config.js · server.ts (SSR-Fehlerseite)
 *   server/server.js (Kontakt-/ROI-Mails + PDF) · public/*.svg
 *   scripts/og-image-template.html (erzeugt die Share-Karte)
 *
 * Regeln (Verstoß => Exit 1):
 *   1. Kein Raw-Hex ausserhalb der Palette (Tokens statt Literale).
 *   2. Keine Arbitrary-Farbklassen  bg-[#...] / text-[rgb(...)] etc.
 *   3. Kein `gray-900` — das Legacy-Navy #203864 ist abgeschafft.
 *      Headline-/Body-Ink ist `text-heading` (#083358).
 *   4. Keine rohen chromatischen Tailwind-Skalen (teal-600, blue-50, ...).
 *   5. Kein rgb()/rgba()-Literal ausserhalb der Palette — sonst schleichen
 *      sich Farben an den Tokens vorbei in Shadows und Keyframes ein.
 *
 * Neue Tokens sind bewusst nicht "einfach so" moeglich: wer die Palette
 * erweitert, muss PALETTE_HEX hier mitpflegen.
 *
 * Bewusste Ausnahmen:
 *   - `red-*`  : semantische Fehler-/Validierungszustaende (kein Akzent).
 *   - Neutrale Familien gray/slate/zinc/neutral/stone.
 *   - FlagIcon.tsx: Laenderflaggen sind vorgegebene Fremdfarben.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SRC = join(ROOT, 'src')

/** Kanonische Palette (tailwind.config.js). Erweiterung = bewusste Entscheidung. */
const PALETTE_HEX = new Set([
  '#083358', // brand.deep / brand.navy / heading — DIE Navy
  '#0a3f63', // brand.navy-hover / navy-mid
  '#0d527f', // brand.primary / brand.blue / accentBlue — sekundaeres Markenblau
  '#2f6fa0', // brand.secondary / blue-bright
  '#0d9488', // accent (teal-600) — DER Akzent
  '#0f766e', // accent.strong
  '#14b8a6', // accent.line
  '#2dd4bf', // accent.on-dark — Teal auf Navy
  '#99f6e4', // accent.border
  '#f0fdfa', // accent.soft
  '#10b981', // success
  '#047857', // success.strong
  '#ecfdf5', // success.soft
  '#0077b5', // social.linkedin (Fremdmarke)
  '#e2e8f0', // ui.border
  '#cbd5e1', // ui.border-hover
  '#94a3b8', // ui.text-muted
  '#f5f5f5', // gray-100
  '#868c98', // gray-500
  '#f8fafc', // neutraler Seiten-/Panel-Hintergrund
  '#f1f5f9', // neutraler Tabellenkopf
])

/** Erlaubte rgb()-Tripel: Palette + bewusst neutrale Scrims. */
const PALETTE_RGB = new Set([
  '8,51,88',
  '10,63,99',
  '13,82,127',
  '47,111,160',
  '13,148,136',
  '15,118,110',
  '20,184,166',
  '45,212,191',
  '16,185,129',
  '0,0,0',
  '255,255,255',
  '15,23,42', // slate-900 — neutraler Bild-Scrim
])

/**
 * Neutrale Grau-/Slate-Skalen. In Mail-Templates und SVGs gibt es keine
 * Tailwind-Klassen, dort MUESSEN Literale stehen — Grautoene sind erlaubt,
 * Markenfarben nicht.
 */
const NEUTRAL_HEX = new Set([
  '#ffffff',
  '#000000',
  // slate
  '#f8fafc',
  '#f1f5f9',
  '#e2e8f0',
  '#cbd5e1',
  '#94a3b8',
  '#64748b',
  '#475569',
  '#334155',
  '#1e293b',
  '#0f172a',
  // gray
  '#f9fafb',
  '#f3f4f6',
  '#e5e7eb',
  '#d1d5db',
  '#9ca3af',
  '#6b7280',
  '#4b5563',
  '#374151',
  '#1f2937',
  '#111827',
])

/** Dateien mit legitimen Fremdfarben (mit Begruendung). */
const HEX_ALLOWED_FILES = new Set([
  'src/components/ui/FlagIcon.tsx', // Laenderflaggen
  'public/polarisdx-mark.svg', // Firmenlogo — eigener Markenverlauf
])

const OFF_FAMILIES =
  'teal|emerald|green|blue|indigo|sky|violet|purple|fuchsia|pink|amber|yellow|orange|lime|cyan|rose'

const RE_HEX = /#[0-9a-fA-F]{6}\b/g
const RE_ARBITRARY = /\b[a-z-]+-\[(?:#[0-9a-fA-F]{3,8}|rgb|rgba|hsl)\b[^\]]*\]/g
const RE_LEGACY_NAVY = /\bgray-900\b/g
const RE_OFF_SCALE = new RegExp(
  `\\b(?:${OFF_FAMILIES})-(?:50|100|200|300|400|500|600|700|800|900|950)\\b`,
  'g',
)
const RE_RGB = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*[,)]/g

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.(tsx?|css)$/.test(entry)) out.push(full)
  }
  return out
}

const violations = []
const files = [
  ...walk(SRC),
  join(ROOT, 'tailwind.config.js'),
  // Flaechen ohne Tailwind-Klassen, die trotzdem Marke transportieren:
  join(ROOT, 'server.ts'), // SSR-Fehlerseite
  join(ROOT, 'server/server.js'), // Kontakt-/ROI-Mails + PDF-Report
  join(ROOT, 'public/og-image.svg'), // Share-Karte (Quelle)
  join(ROOT, 'public/polarisdx-mark.svg'), // Logo (allowlisted)
  join(ROOT, 'scripts/og-image-template.html'), // erzeugt public/og-image.jpg
].filter((f) => existsSync(f))

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, '/')
  const isConfig = rel === 'tailwind.config.js'
  // Klassen-Regeln gelten nur fuer die App; Mail/SVG/HTML kennen kein Tailwind.
  const isTailwindLand = rel.startsWith('src/')
  const lines = readFileSync(file, 'utf8').split('\n')

  lines.forEach((line, i) => {
    const at = `${rel}:${i + 1}`
    if (line.includes('data:image/svg+xml')) return
    // Reine Kommentarzeilen erklaeren oft genau die abgeschafften Werte.
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return

    if (!HEX_ALLOWED_FILES.has(rel)) {
      for (const hex of line.match(RE_HEX) ?? []) {
        const h = hex.toLowerCase()
        if (!PALETTE_HEX.has(h) && !NEUTRAL_HEX.has(h)) {
          violations.push([at, `Hex ${hex} ist nicht in der Palette`, line.trim()])
        }
      }
    }
    if (isTailwindLand) {
      for (const m of line.match(RE_ARBITRARY) ?? []) {
        violations.push([at, `Arbitrary-Farbklasse ${m}`, line.trim()])
      }
      for (const m of line.match(RE_OFF_SCALE) ?? []) {
        violations.push([
          at,
          `Off-Token-Farbe ${m} — nutze accent-* / brand-* / success-*`,
          line.trim(),
        ])
      }
    }
    if (isTailwindLand || isConfig) {
      for (const m of line.match(RE_LEGACY_NAVY) ?? []) {
        violations.push([at, `Legacy-Navy ${m} — nutze text-heading / brand-deep`, line.trim()])
      }
    }
    for (const m of line.matchAll(RE_RGB)) {
      const triple = `${+m[1]},${+m[2]},${+m[3]}`
      // Ein rgb()-Wert ist auch dann in Ordnung, wenn seine Hex-Schreibweise erlaubt
      // ist — sonst waere #f8fafc gueltig, rgb(248, 250, 252) aber nicht.
      const asHex = '#' + [+m[1], +m[2], +m[3]].map((v) => v.toString(16).padStart(2, '0')).join('')
      if (!PALETTE_RGB.has(triple) && !PALETTE_HEX.has(asHex) && !NEUTRAL_HEX.has(asHex)) {
        violations.push([at, `rgb(${triple}) ist nicht in der Palette`, line.trim()])
      }
    }
  })
}

if (violations.length) {
  console.error(`\n✖ Farb-Guard: ${violations.length} Verstoß/Verstöße\n`)
  for (const [at, why, src] of violations) {
    console.error(`  ${at}\n    ${why}\n    > ${src.slice(0, 140)}\n`)
  }
  console.error('Erlaubt: brand-*, accent-*, success-*, heading, ui-*, gray-100/500,')
  console.error('neutrale gray/slate/zinc/neutral/stone-Skalen und red-* (Fehlerzustände).')
  console.error('Neue Farbe? Erst Token in tailwind.config.js, dann PALETTE_HEX hier ergänzen.\n')
  process.exit(1)
}

console.log(
  '✓ Farb-Guard: eine Navy (#083358), ein Akzent (Teal), kein Raw-Hex, keine Fremd-rgb().',
)
