/**
 * Bildoptimierungs-Skript
 *
 * Konvertiert große PNG-Bilder zu WebP mit deutlich reduzierter Dateigröße.
 * Behält die Original-PNGs als Fallback bei.
 *
 * Ausführen: node scripts/optimize-images.mjs
 */

import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, basename, extname } from 'path'

const ASSETS_DIR = './src/assets'
const MIN_SIZE_KB = 200 // Nur Bilder > 200KB konvertieren
const WEBP_QUALITY = 82 // Gute Balance zwischen Qualität und Größe
const MAX_WIDTH = 1600 // Max Breite für Desktop

async function optimizeImages() {
  console.log('🖼️  Bildoptimierung startet...\n')

  const files = await readdir(ASSETS_DIR)
  const pngFiles = files.filter((f) => f.toLowerCase().endsWith('.png'))

  let totalOriginal = 0
  let totalOptimized = 0

  for (const file of pngFiles) {
    const filePath = join(ASSETS_DIR, file)
    const stats = await stat(filePath)
    const sizeKB = stats.size / 1024

    if (sizeKB < MIN_SIZE_KB) {
      console.log(`⏭️  ${file}: ${sizeKB.toFixed(0)}KB (unter ${MIN_SIZE_KB}KB, übersprungen)`)
      continue
    }

    const webpPath = filePath.replace(/\.png$/i, '.webp')
    const name = basename(file, extname(file))

    try {
      // Lese das Bild und hole Metadaten
      const image = sharp(filePath)
      const metadata = await image.metadata()

      // Resize wenn breiter als MAX_WIDTH
      const resizeOptions =
        metadata.width && metadata.width > MAX_WIDTH ? { width: MAX_WIDTH } : undefined

      // Konvertiere zu WebP
      const webpBuffer = await image
        .resize(resizeOptions)
        .webp({ quality: WEBP_QUALITY })
        .toBuffer()

      // Speichere WebP
      await sharp(webpBuffer).toFile(webpPath)

      const webpSizeKB = webpBuffer.length / 1024
      const savings = ((1 - webpSizeKB / sizeKB) * 100).toFixed(1)

      totalOriginal += sizeKB
      totalOptimized += webpSizeKB

      console.log(
        `✅ ${file}: ${sizeKB.toFixed(0)}KB → ${webpSizeKB.toFixed(0)}KB (-${savings}%)`
      )
    } catch (err) {
      console.error(`❌ ${file}: Fehler - ${err.message}`)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`📊 Gesamt: ${totalOriginal.toFixed(0)}KB → ${totalOptimized.toFixed(0)}KB`)
  console.log(
    `💾 Ersparnis: ${(totalOriginal - totalOptimized).toFixed(0)}KB (${(((totalOriginal - totalOptimized) / totalOriginal) * 100).toFixed(1)}%)`
  )
  console.log('='.repeat(50))
}

optimizeImages().catch(console.error)
