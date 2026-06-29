#!/usr/bin/env node
// scripts/check-i18n-home.mjs
// Keyset-Guard fuer den home-Namespace: jede der 10 Locales muss exakt dasselbe
// (auch verschachtelte) Keyset wie DE haben. Dependency-frei (nur node: builtins).
// Exit-Code 1 bei jeder Abweichung (fehlende ODER zusaetzliche Keys).
//
// Gebaut in Phase 2.3 (es existierte kein Vorbild im Repo).
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, '..', 'public', 'locales');
const REF = 'de';
const LANGS = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'];
const NS = 'home.json';

function flatten(value, prefix, out) {
  if (Array.isArray(value)) {
    value.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out));
  } else if (value && typeof value === 'object') {
    for (const k of Object.keys(value)) {
      flatten(value[k], prefix ? `${prefix}.${k}` : k, out);
    }
  } else {
    out.add(prefix);
  }
  return out;
}

function loadKeys(lang) {
  const p = join(LOCALES_DIR, lang, NS);
  const json = JSON.parse(readFileSync(p, 'utf8'));
  return flatten(json, '', new Set());
}

const refKeys = loadKeys(REF);
let failed = false;

for (const lang of LANGS) {
  if (lang === REF) continue;
  let keys;
  try {
    keys = loadKeys(lang);
  } catch (e) {
    console.error(`✖ ${lang}/${NS}: nicht lesbar/parsebar — ${e.message}`);
    failed = true;
    continue;
  }
  const missing = [...refKeys].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !refKeys.has(k));
  if (missing.length || extra.length) {
    failed = true;
    console.error(`✖ ${lang}: ${missing.length} fehlend, ${extra.length} zusaetzlich`);
    if (missing.length) console.error(`    fehlend: ${missing.slice(0, 20).join(', ')}${missing.length > 20 ? ' …' : ''}`);
    if (extra.length) console.error(`    zusaetzlich: ${extra.slice(0, 20).join(', ')}${extra.length > 20 ? ' …' : ''}`);
  } else {
    console.log(`✓ ${lang}: ${keys.size} Keys (== de)`);
  }
}

console.log(`\nReferenz de: ${refKeys.size} Keys.`);
if (failed) {
  console.error('\n❌ i18n-Keyset-Guard FEHLGESCHLAGEN.');
  process.exit(1);
}
console.log('✅ i18n-Keyset-Guard gruen (0 fehlend / 0 zusaetzlich ueber 10 Locales).');
