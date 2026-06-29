#!/usr/bin/env node
// scripts/i18n/sync-home-from-de.mjs
// Synct den home-Namespace von DE -> alle 9 anderen Locales:
//   - fuegt fehlende Keys (rekursiv) mit DE-Wert als PLATZHALTER hinzu (Phase 5 ersetzt sie),
//   - bewahrt bestehende Uebersetzungen + deren Reihenfolge (minimale Diffs),
//   - droppt Keys, die es in DE nicht (mehr) gibt,
//   => jedes Locale-Keyset == DE -> scripts/check-i18n-home.mjs bleibt gruen.
// Reuse nach JEDER de-home.json-Aenderung (z.B. neue Sektion-Keys in Phase 3).
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = join(__dirname, '..', '..', 'public', 'locales')
const REF = 'de'
const LANGS = ['en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs']
const NS = 'home.json'

const clone = (v) => JSON.parse(JSON.stringify(v))

function fill(ref, tgt) {
  if (Array.isArray(ref)) {
    if (!Array.isArray(tgt)) return clone(ref)
    return ref.map((v, i) => (i < tgt.length ? fill(v, tgt[i]) : clone(v)))
  }
  if (ref && typeof ref === 'object') {
    const src = tgt && typeof tgt === 'object' && !Array.isArray(tgt) ? tgt : {}
    const out = {}
    // bestehende Keys (in tgt-Reihenfolge) behalten, sofern in ref vorhanden
    for (const k of Object.keys(src)) if (k in ref) out[k] = fill(ref[k], src[k])
    // fehlende ref-Keys (in ref-Reihenfolge) als Platzhalter anhaengen
    for (const k of Object.keys(ref)) if (!(k in out)) out[k] = clone(ref[k])
    return out
  }
  // Leaf: vorhandenen skalaren Wert behalten, sonst DE-Platzhalter
  return tgt !== undefined && typeof tgt !== 'object' ? tgt : clone(ref)
}

const ref = JSON.parse(readFileSync(join(LOCALES_DIR, REF, NS), 'utf8'))
let changed = 0
for (const lang of LANGS) {
  const p = join(LOCALES_DIR, lang, NS)
  const before = readFileSync(p, 'utf8')
  const tgt = JSON.parse(before)
  const after = JSON.stringify(fill(ref, tgt), null, 2) + '\n'
  if (after !== before) {
    writeFileSync(p, after, 'utf8')
    changed++
    console.log(`✎ ${lang}/${NS} aktualisiert`)
  } else {
    console.log(`= ${lang}/${NS} unveraendert`)
  }
}
console.log(`\nFertig: ${changed} Locale(s) aktualisiert.`)
