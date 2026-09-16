/**
 * AP25 PT25.3 — Drift-, Groessen- und Dimensions-Guard fuer die responsiven Artikel-/Produktbilder.
 *
 * Prueft: jede Variante existiert, hat Format und Breite laut Generator, ist nicht groesser als
 * das bisher ausgelieferte Einzelbild, ist neuer als ihre Quelle und wird im Bildmodul importiert;
 * AVIF ist je Breite nicht groesser als WebP; die groesste WebP-Stufe ist die unveraenderte
 * Originaldatei; kein beruehrtes Bauteil rendert mehr ein rohes `<img>` fuer diese Bilder.
 */
import { readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import {
  ARTICLE_IMAGE_DIR,
  ARTICLE_IMAGE_SOURCES,
  reusesShippedWebp,
  variantName,
} from './build-article-images.mjs'

const findings = []
const check = (condition, message) => {
  if (!condition) findings.push(message)
}

const moduleSource = await readFile('src/assets/articleImages.ts', 'utf8')
let variants = 0
for (const entry of ARTICLE_IMAGE_SOURCES) {
  const { base, source, widths } = entry
  const sourcePath = join(ARTICLE_IMAGE_DIR, source)
  const sourceStat = await stat(sourcePath).catch(() => null)
  check(sourceStat, `${source} fehlt`)
  if (!sourceStat) continue
  const sourceMeta = await sharp(await readFile(sourcePath)).metadata()
  // Referenz „vorher": das bisher ausgelieferte Einzelbild (WebP bzw. das JPEG selbst).
  const shipped = source.endsWith('.jpg') ? source : `${base}.webp`
  const shippedPath = join(ARTICLE_IMAGE_DIR, shipped)
  const shippedStat = await stat(shippedPath).catch(() => null)
  check(shippedStat, `${shipped} (bisher ausgeliefert, fuer OG/Fallback) fehlt`)
  const shippedMeta = shippedStat ? await sharp(await readFile(shippedPath)).metadata() : null
  check(
    moduleSource.includes(`'./${shipped}'`),
    `${shipped} wird in articleImages.ts nicht importiert`,
  )
  for (const width of widths) {
    const expectedWidth = Math.min(width, sourceMeta.width)
    const sizes = {}
    for (const format of ['avif', 'webp']) {
      const name = variantName(base, width, format)
      const info = await stat(join(ARTICLE_IMAGE_DIR, name)).catch(() => null)
      if (format === 'webp' && reusesShippedWebp(entry, width)) {
        check(!info, `${name} existiert, obwohl die groesste Stufe ${shipped} wiederverwendet`)
        check(
          shippedMeta?.width === expectedWidth,
          `${shipped} ist ${shippedMeta?.width}px breit, erwartet ${expectedWidth}px`,
        )
        sizes.webp = shippedStat?.size
        variants += 1
        continue
      }
      check(info, `${name} fehlt — npm run build:article-images`)
      if (!info) continue
      variants += 1
      sizes[format] = info.size
      const meta = await sharp(await readFile(join(ARTICLE_IMAGE_DIR, name))).metadata()
      check(
        meta.format === (format === 'avif' ? 'heif' : 'webp'),
        `${name} ist ${meta.format}, nicht ${format}`,
      )
      check(
        meta.width === expectedWidth,
        `${name} ist ${meta.width}px breit, erwartet ${expectedWidth}px`,
      )
      if (shippedStat)
        check(
          info.size <= shippedStat.size,
          `${name} (${info.size} B) ist groesser als ${shipped} (${shippedStat.size} B)`,
        )
      check(info.mtimeMs >= sourceStat.mtimeMs, `${name} ist aelter als ${source} — neu generieren`)
      check(
        moduleSource.includes(`'./${name}'`),
        `${name} wird in articleImages.ts nicht importiert`,
      )
    }
    if (sizes.avif && sizes.webp)
      check(
        sizes.avif <= sizes.webp,
        `${base} ${width}w: AVIF (${sizes.avif} B) groesser als WebP (${sizes.webp} B)`,
      )
  }
}

// Kein rohes <img> mehr fuer Artikel-/Produktbilder in den beruehrten Bauteilen.
for (const file of [
  'src/pages/ArticlePage.tsx',
  'src/pages/ArticlesIndexPage.tsx',
  'src/components/ui/BlogCard.tsx',
  'src/pages/VitaminD3SprayPage.tsx',
  'src/components/sections/DiagnosticsRelatedArticlesSection.tsx',
]) {
  const content = await readFile(file, 'utf8')
  check(!/<img\b/u.test(content), `${file} rendert noch ein rohes <img> statt <ResponsivePicture>`)
}

if (findings.length) {
  console.error('Artikel-Bild-Guard FAIL:')
  for (const finding of findings) console.error(`  - ${finding}`)
  process.exit(1)
}
console.log(
  `Artikel-Bild-Guard PASS: ${variants} Kandidaten (${ARTICLE_IMAGE_SOURCES.length} Bilder × Breiten × AVIF/WebP), Groesse/Breite/Aktualitaet/Import ok, groesste WebP-Stufe = Original, keine rohen <img> in den beruehrten Bauteilen`,
)
