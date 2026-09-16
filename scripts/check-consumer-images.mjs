/**
 * AP21 PT21.7 — Drift-Guard fuer die responsiven Consumer-Bilder.
 *
 * Drei Dinge muessen zusammenpassen und tun es sonst irgendwann nicht mehr:
 * der Generator (`build-consumer-images.mjs`), die erzeugten Dateien und das
 * Modul `src/content/consumer/images.ts`, das sie importiert. Faellt eine
 * Variante weg oder wird ein Quellbild ausgetauscht, ohne neu zu generieren,
 * liefert die Seite stillschweigend wieder das Original aus — genau der
 * Zustand, den PT21.7 behoben hat.
 */

import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

import {
  CONSUMER_IMAGE_DIR,
  CONSUMER_IMAGE_SOURCES,
  CONSUMER_IMAGE_WIDTHS,
  variantName,
} from './build-consumer-images.mjs'

const findings = []
const check = (condition, message) => {
  if (!condition) findings.push(message)
}

const moduleSource = await readFile('src/content/consumer/images.ts', 'utf8')

for (const base of CONSUMER_IMAGE_SOURCES) {
  const original = join(CONSUMER_IMAGE_DIR, `${base}.jpeg`)
  const originalStat = await stat(original).catch(() => null)
  check(originalStat, `${base}.jpeg fehlt`)
  if (!originalStat) continue

  const originalMeta = await sharp(await readFile(original)).metadata()

  for (const width of CONSUMER_IMAGE_WIDTHS) {
    const file = join(CONSUMER_IMAGE_DIR, variantName(base, width))
    const info = await stat(file).catch(() => null)
    check(info, `${variantName(base, width)} fehlt — Generator laufen lassen`)
    if (!info) continue

    const meta = await sharp(await readFile(file)).metadata()
    check(meta.format === 'webp', `${variantName(base, width)} ist ${meta.format}, nicht webp`)
    check(
      meta.width === Math.min(width, originalMeta.width),
      `${variantName(base, width)} ist ${meta.width}px breit, erwartet ${Math.min(width, originalMeta.width)}px`,
    )
    // Eine Variante, die nicht kleiner ist als das Original, bringt nichts.
    check(
      info.size < originalStat.size,
      `${variantName(base, width)} (${info.size} B) ist nicht kleiner als das JPEG (${originalStat.size} B)`,
    )
    // Und sie muss im Modul wirklich importiert sein.
    check(
      moduleSource.includes(variantName(base, width)),
      `${variantName(base, width)} wird in images.ts nicht importiert`,
    )
    // Die Variante muss neuer sein als ihre Quelle — sonst ist sie veraltet.
    check(
      info.mtimeMs >= originalStat.mtimeMs,
      `${variantName(base, width)} ist aelter als ${base}.jpeg — neu generieren`,
    )
  }
}

// Die Produktseiten duerfen kein rohes <img src={...jpeg}> mehr rendern.
for (const page of ['SprayPage', 'MaskPage', 'DuoPage']) {
  const source = await readFile(`src/pages/consumer/${page}.tsx`, 'utf8')
  check(!/<img\b/u.test(source), `${page}.tsx rendert noch ein rohes <img> statt <ConsumerPicture>`)
}

if (findings.length) {
  console.error('Consumer-Bild-Guard FAIL:')
  for (const finding of findings) console.error(`  - ${finding}`)
  process.exit(1)
}

console.log(
  `Consumer-Bild-Guard PASS: ${CONSUMER_IMAGE_SOURCES.length} Quellbilder x ${CONSUMER_IMAGE_WIDTHS.length} WebP-Breiten, ` +
    `alle kleiner als ihr JPEG, alle importiert, 0 rohe <img> in den Produktseiten.`,
)
