#!/usr/bin/env node
// scripts/check-meta-descriptions.mjs
// Meta-Guard fuer den home-Namespace. Pruefung pro Locale:
//   - seo.title vorhanden + nicht leer
//   - seo.description vorhanden + nicht leer + Laenge in [DESC_MIN, DESC_MAX]
//   - (non-de) seo.description NICHT byte-identisch zu de  -> Schutz vor
//     untranslated DE-Platzhaltern, die nach Prod lecken (Phase 3 nutzt
//     bewusst DE-Platzhalter, die spaetestens in Phase 5 ersetzt werden).
//   - (non-de) seo.title identisch zu de -> nur WARNUNG (Titel sind oft
//     brand-/zahlenlastig und koennen legitim aehneln).
//
// HINWEIS: Bewusst NICHT die im alten Playbook erwaehnte "DE-Gleichheit" —
// Ground Truth (Phase 0): Descriptions sind je Locale echt uebersetzt, ein
// "muss == de"-Check waere falsch. Gebaut in Phase 2.3 (kein Vorbild im Repo).
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, '..', 'public', 'locales');
const REF = 'de';
const LANGS = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'];
const DESC_MIN = 40;
const DESC_MAX = 185;

function loadSeo(lang) {
  const p = join(LOCALES_DIR, lang, 'home.json');
  const j = JSON.parse(readFileSync(p, 'utf8'));
  return j.seo || {};
}

const ref = loadSeo(REF);
const refTitle = (ref.title || '').trim();
const refDesc = (ref.description || '').trim();
let failed = false;

function fail(msg) {
  failed = true;
  console.error('  ✖ ' + msg);
}

for (const lang of LANGS) {
  let seo;
  try {
    seo = loadSeo(lang);
  } catch (e) {
    fail(`${lang}: home.json nicht lesbar/parsebar — ${e.message}`);
    continue;
  }
  const t = (seo.title || '').trim();
  const d = (seo.description || '').trim();
  console.log(`— ${lang}: title ${t.length} chars, description ${d.length} chars`);
  if (!t) fail(`${lang}: seo.title fehlt/leer`);
  if (!d) fail(`${lang}: seo.description fehlt/leer`);
  if (d && (d.length < DESC_MIN || d.length > DESC_MAX))
    fail(`${lang}: seo.description Laenge ${d.length} ausserhalb [${DESC_MIN}, ${DESC_MAX}]`);
  if (lang !== REF) {
    if (d && d === refDesc) fail(`${lang}: seo.description identisch zu de (untranslated Platzhalter?)`);
    if (t && t === refTitle) console.warn(`  ⚠ ${lang}: seo.title identisch zu de (pruefen, ob beabsichtigt)`);
  }
}

if (failed) {
  console.error('\n❌ Meta-Guard FEHLGESCHLAGEN.');
  process.exit(1);
}
console.log('\n✅ Meta-Guard gruen (title+description in 10 Locales vorhanden, uebersetzt, Laenge ok).');
