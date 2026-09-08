#!/usr/bin/env node
/**
 * AP19 PT19.4 — Guard fuer die Lead-Magnet-Kandidatenmatrix.
 *
 *  1. Die Matrix stimmt mit dem Inventar ueberein. Ein Kandidat kann sich
 *     nicht als aktiv gegatet ausweisen, waehrend die Ressource oeffentlich
 *     ausgeliefert wird — und umgekehrt.
 *  2. Es gibt mindestens einen ECHTEN aktiven gegateten Kandidaten.
 *  3. Kein erfundener Kandidat: jede Asset-ID existiert, und der eine Eintrag
 *     ohne Asset-ID ist ausdruecklich als solcher gefuehrt.
 *  4. Das aktive gegatete Asset liegt geschuetzt, nicht oeffentlich, und wird
 *     auf keiner produktiven Seite als Dateiname gerendert.
 *  5. Die Gate-Copy des aktiven Kandidaten existiert in allen zehn Locales.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { findResource } from '../src/content/resources/resourceInventory'
import {
  assertCandidateMatrix,
  LEAD_MAGNET_CANDIDATES,
} from '../src/content/resources/leadMagnetCandidates'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const errors: string[] = [...assertCandidateMatrix()]
const fail = (message: string) => errors.push(message)
const read = (relative: string) => readFileSync(resolve(root, relative), 'utf8')

const active = LEAD_MAGNET_CANDIDATES.filter(
  (candidate) => candidate.status === 'GATED_LAUNCH_ACTIVE',
)
if (active.length === 0) fail('Kein GATED_LAUNCH_ACTIVE Kandidat')

// ------------------------------------------- Ablage und fehlende Umgehung
for (const candidate of active) {
  const resource = candidate.assetId ? findResource(candidate.assetId) : undefined
  if (!resource) {
    fail(`${candidate.key}: aktiver Kandidat ohne Ressource`)
    continue
  }
  for (const variant of resource.variants) {
    if (!existsSync(resolve(root, 'storage/protected', variant.path))) {
      fail(`${candidate.key}: Datei fehlt in der geschuetzten Ablage (${variant.path})`)
    }
    if (existsSync(resolve(root, 'public/downloads', variant.path))) {
      fail(`${candidate.key}: Datei liegt zusaetzlich oeffentlich (${variant.path})`)
    }
  }
}

// Kein produktiver Quelltext darf den Dateinamen eines aktiven gegateten
// Assets tragen — weder als Link noch als Konstante.
const productiveSources = readdirSync(resolve(root, 'src'), {
  recursive: true,
  withFileTypes: true,
})
  .filter(
    (entry) =>
      entry.isFile() &&
      /\.(?:ts|tsx)$/u.test(entry.name) &&
      !/\.test\.tsx?$/u.test(entry.name) &&
      // Das Inventar MUSS den Pfad kennen — es ist die Registry.
      entry.name !== 'resourceInventory.ts',
  )
  .map((entry) => resolve(entry.parentPath, entry.name))
for (const candidate of active) {
  const resource = candidate.assetId ? findResource(candidate.assetId) : undefined
  for (const variant of resource?.variants ?? []) {
    const filename = variant.path.split('/').pop() as string
    for (const file of productiveSources) {
      if (readFileSync(file, 'utf8').includes(filename)) {
        fail(`${file.slice(root.length + 1)}: nennt den Dateinamen eines gegateten Assets`)
      }
    }
  }
}

// ------------------------------------------------------- Gate-Copy x10
const GATE_KEYS = [
  'title',
  'intro',
  'name',
  'email',
  'organization',
  'processingConsent',
  'marketingConsent',
  'submit',
  'submitting',
  'close',
  'successTitle',
  'successText',
  'downloadCta',
  'expiryNote',
  'errorGeneric',
  'errorValidation',
  'errorConsent',
]
for (const locale of SUPPORTED_LANGUAGES) {
  const bundle = JSON.parse(read(`public/locales/${locale}/downloads.json`)) as {
    gate?: Record<string, string>
  }
  for (const key of GATE_KEYS) {
    const value = bundle.gate?.[key]
    if (typeof value !== 'string' || !value.trim()) fail(`${locale}: gate.${key} fehlt`)
  }
  // Beschriftung des aktiven Kandidaten kommt aus dem Epigenetik-Bestand.
  const epigenetics = JSON.parse(read(`public/locales/${locale}/epigenetics.json`)) as {
    samples?: { zipLabel?: string }
  }
  if (!epigenetics.samples?.zipLabel?.trim()) fail(`${locale}: samples.zipLabel fehlt`)
}

// ------------------------------------------------ Der Einstieg ist einer
const trigger = read('src/components/resources/ResourceGateTrigger.tsx')
if (!trigger.includes("deliveryClass !== 'GATED'")) {
  fail('Gate-Einstieg prueft die Auslieferungsklasse nicht')
}
for (const page of [
  'src/pages/EpigeneticsDocsPage.tsx',
  'src/components/sections/EpigeneticsPanels.tsx',
]) {
  if (!read(page).includes('ResourceGateTrigger')) {
    fail(`${page}: gegatetes Asset ohne wiederverwendbaren Gate-Einstieg`)
  }
}

// ------------------------------------------------------------------ Ergebnis
if (errors.length) {
  console.error(`PT19.4 Lead-Magnet-Kandidaten: FAIL (${errors.length})`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

const byStatus = (status: string) =>
  LEAD_MAGNET_CANDIDATES.filter((candidate) => candidate.status === status).length
console.log('PT19.4 Lead-Magnet-Kandidaten: PASS')
console.log(`- Kandidaten geprueft: ${LEAD_MAGNET_CANDIDATES.length} · erfundene: 0`)
console.log(
  `- GATED_LAUNCH_ACTIVE ${byStatus('GATED_LAUNCH_ACTIVE')} · FREE_LAUNCH_ACTIVE ${byStatus('FREE_LAUNCH_ACTIVE')} · READY_NOT_ACTIVE ${byStatus('READY_NOT_ACTIVE')} · DEFERRED ${byStatus('DEFERRED')} · NOT_EXISTS ${byStatus('NOT_EXISTS')}`,
)
console.log(`- Aktiver Lead-Magnet: ${active.map((c) => `${c.key} (${c.assetId})`).join(', ')}`)
console.log('- Matrix gegen Inventar abgeglichen: keine Abweichung')
console.log('- Geschuetzt abgelegt, nicht oeffentlich, kein Dateiname im Markup')
console.log(`- Gate-Copy: ${GATE_KEYS.length} Schluessel x ${SUPPORTED_LANGUAGES.length} Locales`)
