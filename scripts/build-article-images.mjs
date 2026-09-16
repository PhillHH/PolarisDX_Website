/**
 * AP25 PT25.3 — responsive AVIF- und WebP-Varianten fuer Artikel- und Produktbilder.
 *
 * Gemessen (PT25.3, `scripts/perf/image-inventory.mjs`): die Artikelbilder wurden als eine
 * einzige 1024–1200-px-WebP in 350–650 px breite Felder geliefert (bis Faktor 3,19 auf dem
 * Desktop), das Vitamin-D3-Produktbild als 93-KB-JPEG in ein 212 px breites Feld.
 *
 * Formatwahl ebenfalls gemessen, nicht angenommen: AVIF q60 ist gegenueber WebP q80 20–30 %
 * kleiner UND hat 1–2 dB mehr PSNR gegen die gleich skalierte Quelle. WebP bleibt als
 * `<source>`-Fallback, die unveraenderten Original-WebP/JPEG bleiben fuer OG/Structured Data
 * und als `<img src>`. Nichts wird geloescht.
 *
 * Groesste WebP-Stufe: die bisher ausgelieferte `<base>.webp` hat genau diese Breite und war
 * gemessen 5–6 % kleiner als eine Neukodierung mit q80 — sie IST der WebP-Kandidat dieser Stufe.
 *
 * Ausfuehren: npm run build:article-images   ·   Pruefen: npm run check:article-images
 */
import sharp from 'sharp'
import { readFile, writeFile, stat } from 'node:fs/promises'
import { join } from 'node:path'

export const ARTICLE_IMAGE_DIR = 'src/assets'

/** Quelle = unkomprimiertes Original; `widths` aus der gemessenen Darstellung (CSS-Breite × DPR 1–3). */
export const ARTICLE_IMAGE_SOURCES = [
  { base: 'green', source: 'green.png', widths: [400, 800, 1200] },
  { base: 'homeclinic', source: 'homeclinic.png', widths: [400, 800, 1024] },
  { base: 'makemoney', source: 'makemoney.png', widths: [400, 800, 1024] },
  { base: 'Testbild1', source: 'Testbild1.png', widths: [400, 800, 1024] },
  // Produktbild: 212 px CSS-Breite (max-h-80), DPR 1–3 → 212–636 px; nativ 618 px. Kein WebP-Original.
  { base: 'VITAMIND_D3_SPRAY', source: 'VITAMIND_D3_SPRAY.jpg', widths: [320, 618] },
]

export const AVIF_QUALITY = 60
export const WEBP_QUALITY = 80

export const variantName = (base, width, format) => `${base}-${width}w.${format}`

/** true, wenn die groesste Stufe die bisher ausgelieferte `<base>.webp` wiederverwendet. */
export const reusesShippedWebp = (entry, width) =>
  !entry.source.endsWith('.jpg') && width === Math.max(...entry.widths)

async function main() {
  let total = 0
  for (const entry of ARTICLE_IMAGE_SOURCES) {
    const { base, source, widths } = entry
    const input = await readFile(join(ARTICLE_IMAGE_DIR, source))
    const original = (await stat(join(ARTICLE_IMAGE_DIR, source))).size
    const parts = []
    for (const width of widths) {
      const resized = sharp(input).resize({ width, withoutEnlargement: true })
      const avif = await resized.clone().avif({ quality: AVIF_QUALITY }).toBuffer()
      await writeFile(join(ARTICLE_IMAGE_DIR, variantName(base, width, 'avif')), avif)
      total += avif.length
      if (reusesShippedWebp(entry, width)) {
        parts.push(`${width}w avif ${(avif.length / 1024).toFixed(0)}KB webp=${base}.webp`)
        continue
      }
      const webp = await resized.clone().webp({ quality: WEBP_QUALITY }).toBuffer()
      await writeFile(join(ARTICLE_IMAGE_DIR, variantName(base, width, 'webp')), webp)
      total += webp.length
      parts.push(
        `${width}w avif ${(avif.length / 1024).toFixed(0)}KB webp ${(webp.length / 1024).toFixed(0)}KB`,
      )
    }
    console.log(`${base.padEnd(18)} Quelle ${(original / 1024).toFixed(0)}KB → ${parts.join('  ')}`)
  }
  console.log(`\nGesamt ${(total / 1024).toFixed(0)} KB neue Varianten.`)
}

if (process.argv[1] && process.argv[1].endsWith('build-article-images.mjs')) {
  await main()
}
