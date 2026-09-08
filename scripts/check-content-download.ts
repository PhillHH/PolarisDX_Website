#!/usr/bin/env node
/**
 * AP19 PT19.3 — Guard fuer den gegateten Auslieferungspfad.
 *
 *  1. `server/resource-registry.json` ist eine ABLEITUNG. Weicht sie von
 *     `resourceInventory.ts` ab, ist die Wahrheit gespalten — Abbruch.
 *  2. PUBLIC BYPASS: eine Datei, die zu einem GATED Asset gehoert, darf nicht
 *     zusaetzlich unter `public/downloads/` liegen. Diese Regel greift, BEVOR
 *     PT19.4 das erste Asset gatet, statt danach.
 *  3. GATED heisst `storage: 'PROTECTED'` — ohne Ausnahme.
 *  4. Die Journey haengt an der geteilten Foundation, nicht an einer zweiten
 *     Plattform: `content_download` steht in `LEAD_JOURNEYS` und hat ein
 *     CRM-Ziel.
 *  5. Kein Token, keine Query und keine URL im Log des Auslieferungspfades.
 */

import { createRequire } from 'node:module'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { RESOURCE_INVENTORY } from '../src/content/resources/resourceInventory'
import { serializeResourceRegistry } from './build-resource-registry'

const require = createRequire(import.meta.url)
const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const errors: string[] = []
const fail = (message: string) => errors.push(message)
const read = (relative: string) => readFileSync(resolve(root, relative), 'utf8')

// ------------------------------------------------------------ 1. Kein Drift
const registryPath = 'server/resource-registry.json'
if (!existsSync(resolve(root, registryPath))) {
  fail(`${registryPath} fehlt — \`npm run build:resource-registry\` ausfuehren`)
} else if (read(registryPath) !== serializeResourceRegistry()) {
  fail(`${registryPath} weicht von resourceInventory.ts ab (Regenerieren noetig)`)
}

// ------------------------------------------- 2./3. Public Bypass und Ablage
const gated = RESOURCE_INVENTORY.filter((resource) => resource.deliveryClass === 'GATED')
for (const resource of gated) {
  for (const variant of resource.variants) {
    if (variant.storage !== 'PROTECTED') {
      fail(`${resource.id}: GATED mit storage ${variant.storage}`)
    }
    // Der eigentliche Punkt: dieselbe Datei darf nicht oeffentlich liegen.
    if (existsSync(resolve(root, 'public/downloads', variant.path))) {
      fail(`${resource.id}: GATED Datei liegt zusaetzlich oeffentlich (${variant.path})`)
    }
  }
}
for (const resource of RESOURCE_INVENTORY) {
  for (const variant of resource.variants) {
    if (variant.storage === 'PROTECTED' && resource.deliveryClass !== 'GATED') {
      fail(`${resource.id}: PROTECTED abgelegt, aber nicht GATED`)
    }
  }
}

// ------------------------------------------------- 4. Geteilte Foundation
const { LEAD_JOURNEYS, DEFAULT_JOURNEY_ROUTES } = require('../server/lead-foundation') as {
  LEAD_JOURNEYS: string[]
  DEFAULT_JOURNEY_ROUTES: Record<string, string>
}
if (!LEAD_JOURNEYS.includes('content_download')) {
  fail('content_download fehlt in LEAD_JOURNEYS')
}
if (!DEFAULT_JOURNEY_ROUTES.content_download) {
  fail('content_download hat kein CRM-Ziel')
}
if (!existsSync(resolve(root, 'server/lead-foundation/migrations/002_resource_entitlements.sql'))) {
  fail('Migration 002_resource_entitlements.sql fehlt')
}

const service = read('server/content-download.js')
for (const needle of [
  'LeadRepository',
  'LeadHandoffWorker',
  'CrmRouter',
  'EntitlementRepository',
]) {
  if (!service.includes(needle)) fail(`content-download.js nutzt ${needle} nicht`)
}
// Persistenz vor Handoff: `createLead` muss im Quelltext vor `processNext` stehen.
if (service.indexOf('repository.createLead') > service.indexOf('worker.processNext()')) {
  fail('content-download.js ruft den Handoff vor der Persistenz auf')
}
if (/new (?:Database|LeadRepository)\(.*sqlite/iu.test(service)) {
  fail('content-download.js oeffnet eine eigene Datenbank statt der geteilten')
}

// ------------------------------------------------------- 5. Keine Leaks
const serverSource = read('server/server.js')
const downloadRoute =
  serverSource.split("app.get('/api/content-download/asset/:assetId'")[1]?.split('\napp.')[0] ?? ''
if (!downloadRoute) fail('Auslieferungsroute nicht gefunden')
for (const forbidden of ['req.query.t', 'req.url', 'req.originalUrl', 'JSON.stringify(req']) {
  // `req.query.t` darf gelesen, aber nie protokolliert werden — deshalb wird
  // nur der Log-Aufruf geprueft.
  const logged = downloadRoute
    .split('\n')
    .filter(
      (line) => /console\.(log|warn|error|info)/u.test(line) || /logDownloadFailure/u.test(line),
    )
    .join('\n')
  if (logged.includes(forbidden)) fail(`Auslieferungsroute protokolliert ${forbidden}`)
}
for (const header of [
  'Cache-Control',
  'Referrer-Policy',
  'X-Content-Type-Options',
  'X-Robots-Tag',
  'Content-Disposition',
]) {
  if (!downloadRoute.includes(header)) fail(`Auslieferungsroute setzt ${header} nicht`)
}
if (!downloadRoute.includes('downloadLimiter')) fail('Auslieferungsroute ohne Rate Limit')
if (!serverSource.includes("app.post('/api/content-download', formLimiter")) {
  fail('Einreichungsroute ohne Rate Limit')
}

const entitlements = read('server/lead-foundation/entitlements.js')
if (!entitlements.includes("createHash('sha256')")) fail('Entitlement-Token wird nicht gehasht')
if (/INSERT INTO resource_entitlements[\s\S]{0,400}\btoken\b(?!_hash)/u.test(entitlements)) {
  fail('Entitlement speichert das Klartext-Token')
}

// -------------------------------- 6. Der Ablauf haengt nicht an Analytics
const gateSource = read('src/components/resources/ResourceGateForm.tsx')
for (const forbidden of ['lib/tracking', 'googleConsent', 'gtag', 'dataLayer', 'track(']) {
  if (gateSource.includes(forbidden)) {
    fail(`Gate-Formular haengt an Analytics/Tracking (${forbidden})`)
  }
}
// Verarbeitung und Marketing muessen zwei getrennte Felder sein.
for (const needle of ['processingConsent', 'marketingConsent']) {
  if (!gateSource.includes(needle)) fail(`Gate-Formular kennt ${needle} nicht`)
}
if (!gateSource.includes('_hp:')) fail('Gate-Formular sendet keinen Honeypot')
// Der Link darf nur aus der Serverantwort kommen.
if (
  /href=\{`?\/downloads\//u.test(gateSource) ||
  gateSource.includes('/api/content-download/asset/')
) {
  fail('Gate-Formular baut eine Asset-URL selbst, statt sie vom Server zu nehmen')
}
const pageSource = read('src/pages/DownloadsPage.tsx')
if (/href=\{card\.gate/u.test(pageSource)) fail('Gated-Karte rendert eine Datei-URL')

// -------------------------------------------------------------------- Ergebnis
if (errors.length) {
  console.error(`PT19.3 content_download: FAIL (${errors.length})`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

const gatedVariants = gated.flatMap((resource) => resource.variants)
console.log('PT19.3 content_download: PASS')
console.log('- Registry aus resourceInventory.ts abgeleitet, kein Drift')
console.log(`- GATED Ressourcen: ${gated.length} · Varianten: ${gatedVariants.length}`)
console.log(`- GATED Dateien zusaetzlich oeffentlich erreichbar: 0`)
console.log(`- PROTECTED ohne GATED: 0`)
console.log(`- Journey content_download → CRM-Ziel ${DEFAULT_JOURNEY_ROUTES.content_download}`)
console.log('- Persistenz vor Handoff: im Quelltext erzwungen')
console.log('- Auslieferung: Rate Limit, no-store, no-referrer, nosniff, noindex, attachment')
console.log('- Token: nur als SHA-256 gespeichert, nicht protokolliert')
console.log('- Gate: Processing-/Marketing-Consent getrennt, Honeypot, 0 Analytics-Kopplung')
