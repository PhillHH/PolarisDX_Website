#!/usr/bin/env node
/**
 * Erzeugt `server/resource-registry.json` aus der kanonischen TS-Wahrheit.
 *
 * Der Express-Server ist CommonJS und kann `resourceInventory.ts` nicht
 * importieren. Statt dort eine zweite Liste zu pflegen, wird sie ABGELEITET —
 * und `scripts/check-content-download.ts` laesst den Build scheitern, sobald
 * die abgeleitete Datei von der Quelle abweicht. RI-01 bleibt damit gueltig:
 * es gibt weiterhin genau eine Wahrheit.
 *
 * `--write` schreibt, ohne Flag wird nur die erwartete Fassung ausgegeben.
 */

import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { RESOURCE_INVENTORY } from '../src/content/resources/resourceInventory'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))

export const buildResourceRegistry = () => ({
  generatedFrom: 'src/content/resources/resourceInventory.ts',
  assets: RESOURCE_INVENTORY.map((resource) => ({
    id: resource.id,
    deliveryClass: resource.deliveryClass,
    lifecycle: resource.lifecycle,
    variants: resource.variants.map((variant) => ({
      language: variant.language,
      storage: variant.storage,
      path: variant.path,
      mime: variant.mime,
      bytes: variant.bytes,
      sha256: variant.sha256,
    })),
  })),
})

export const serializeResourceRegistry = (): string =>
  `${JSON.stringify(buildResourceRegistry(), null, 2)}\n`

if (process.argv.includes('--write')) {
  writeFileSync(resolve(root, 'server/resource-registry.json'), serializeResourceRegistry())
  console.log('server/resource-registry.json geschrieben')
}
