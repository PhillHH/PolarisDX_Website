/**
 * AP21 PT21.7 — responsive WebP-Varianten fuer die Consumer-Produktbilder.
 *
 * Die Consumer-Bilder kamen spaeter ins Repository als der Rest und sind nie
 * durch `optimize-images.mjs` gelaufen: 33 WebP-Geschwister im uebrigen
 * `src/assets`, aber KEINES im Consumer-Ordner. Gemessen wurden die Heros
 * dadurch mit 1122px nativ in ein 358–570px breites Feld geliefert — Faktor
 * 2,0x bis 3,1x, und das als JPEG.
 *
 * Dieses Skript erzeugt pro genutztem Bild drei WebP-Breiten. Die JPEG-
 * Originale bleiben als `<picture>`-Fallback erhalten; nichts wird geloescht.
 *
 * Ausfuehren: node scripts/build-consumer-images.mjs
 * Pruefen:    npm run check:consumer-images
 */

import sharp from 'sharp'
import { readFile, writeFile, stat } from 'node:fs/promises'
import { join } from 'node:path'

/** Verzeichnis der Consumer-Produktbilder. */
export const CONSUMER_IMAGE_DIR = 'src/assets/landingpages-consumer'

/**
 * Die tatsaechlich verwendeten Bilder. `spray-hero-office-single` steht
 * bewusst NICHT hier: es wird von keiner Produktivdatei importiert, landet
 * damit auch in keinem Bundle und kostet zur Laufzeit null Bytes. Es bleibt
 * als Rohmaterial liegen und ist als PERF-03 im Contract vermerkt.
 */
export const CONSUMER_IMAGE_SOURCES = [
  'duo-hero-products-together',
  'mask-hero-botanical',
  'spray-hero-12pack-office',
  'spray-still-life',
]

/**
 * Breiten aus der GEMESSENEN Darstellung abgeleitet, nicht geraten:
 * 358–448px auf Mobil/Tablet, 570px auf dem Desktop. 448 deckt die
 * Mobilbreite bei DPR 1, 768 den Desktop bei DPR 1 und Mobil bei DPR 2,
 * 1122 (die native Breite) den Desktop bei DPR 2.
 */
export const CONSUMER_IMAGE_WIDTHS = [448, 768, 1122]

export const WEBP_QUALITY = 78

export const variantName = (base, width) => `${base}-${width}w.webp`

async function main() {
  let total = 0
  for (const base of CONSUMER_IMAGE_SOURCES) {
    const source = join(CONSUMER_IMAGE_DIR, `${base}.jpeg`)
    const original = (await stat(source)).size
    const input = await readFile(source)
    const parts = []
    for (const width of CONSUMER_IMAGE_WIDTHS) {
      const buffer = await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer()
      await writeFile(join(CONSUMER_IMAGE_DIR, variantName(base, width)), buffer)
      parts.push(`${width}w ${(buffer.length / 1024).toFixed(0)}KB`)
      total += buffer.length
    }
    console.log(`${base.padEnd(30)} JPEG ${(original / 1024).toFixed(0)}KB → ${parts.join('  ')}`)
  }
  console.log(
    `\n${CONSUMER_IMAGE_SOURCES.length * CONSUMER_IMAGE_WIDTHS.length} Varianten, ${(total / 1024).toFixed(0)} KB gesamt.`,
  )
}

if (process.argv[1] && process.argv[1].endsWith('build-consumer-images.mjs')) {
  await main()
}
