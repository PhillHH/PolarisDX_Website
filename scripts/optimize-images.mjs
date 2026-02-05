/**
 * Bildoptimierungs-Skript
 *
 * Konvertiert ALLE PNG/JPG-Bilder zu WebP mit optimaler Größe.
 * Behält die Originale als Fallback bei.
 *
 * Ausführen: node scripts/optimize-images.mjs
 */

import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, basename, extname } from 'path'

const ASSETS_DIR = './src/assets'
const WEBP_QUALITY = 80

// Größen-Mapping basierend auf Verwendungszweck
const SIZE_RULES = [
  // Logos - max 400px breit
  { pattern: /polaris_white|polarisdx_logo|igloo_logo_white|PolarisDX_Logo_main/i, maxWidth: 400 },
  // Produkt-Bilder - max 650px breit
  { pattern: /igloo_front|Igloo-pro-frontal|igloo_explode|Igloo.*Reader|hero_device/i, maxWidth: 650 },
  // Testimonial-Fotos - max 300px breit
  { pattern: /Richard-Pollock|Kristian.*Grimm|goran|Bastian|Frank.*Stoffels|Ulrike|Adriano/i, maxWidth: 300 },
  // Hero-Bilder - max 800px breit
  { pattern: /hero_doctor/i, maxWidth: 800 },
  // Blog-Bilder - max 1200px breit
  { pattern: /green|homeclinic|makemoney|Testbild|above_the_fold/i, maxWidth: 1200 },
  // Avatar - max 400px breit
  { pattern: /avatar/i, maxWidth: 400 },
  // Hintergrundbilder
  { pattern: /background|bg_|Logo_Icon/i, maxWidth: 800 },
]

const DEFAULT_MAX_WIDTH = 1200

function getMaxWidth(filename) {
  for (const rule of SIZE_RULES) {
    if (rule.pattern.test(filename)) {
      return rule.maxWidth
    }
  }
  return DEFAULT_MAX_WIDTH
}

async function findImages(dir) {
  const images = []

  async function scan(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)
      if (entry.isDirectory()) {
        await scan(fullPath)
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase()
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
          images.push(fullPath)
        }
      }
    }
  }

  await scan(dir)
  return images
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function optimizeImages() {
  console.log('Bildoptimierung startet...\n')
  console.log(`Verzeichnis: ${ASSETS_DIR}\n`)

  const images = await findImages(ASSETS_DIR)
  console.log(`${images.length} Bilder gefunden\n`)

  let totalOriginal = 0
  let totalOptimized = 0
  let count = 0

  for (const filePath of images) {
    const filename = basename(filePath)
    const ext = extname(filePath)
    const webpPath = filePath.replace(ext, '.webp')
    const maxWidth = getMaxWidth(filename)

    try {
      const stats = await stat(filePath)
      const inputSize = stats.size

      const image = sharp(filePath)
      const metadata = await image.metadata()

      // Resize wenn breiter als maxWidth
      let pipeline = image
      if (metadata.width > maxWidth) {
        pipeline = pipeline.resize(maxWidth, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
      }

      // Konvertiere zu WebP
      const webpBuffer = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer()
      await sharp(webpBuffer).toFile(webpPath)

      const outputSize = webpBuffer.length
      const savings = ((1 - outputSize / inputSize) * 100).toFixed(1)

      totalOriginal += inputSize
      totalOptimized += outputSize
      count++

      const resizeInfo = metadata.width > maxWidth ? ` [${metadata.width}px -> ${maxWidth}px]` : ''
      console.log(`${filename}: ${formatSize(inputSize)} -> ${formatSize(outputSize)} (-${savings}%)${resizeInfo}`)
    } catch (err) {
      console.error(`FEHLER ${filename}: ${err.message}`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('ZUSAMMENFASSUNG')
  console.log('='.repeat(60))
  console.log(`Optimiert: ${count} Bilder`)
  console.log(`Original:  ${formatSize(totalOriginal)}`)
  console.log(`WebP:      ${formatSize(totalOptimized)}`)
  console.log(`Ersparnis: ${formatSize(totalOriginal - totalOptimized)} (${((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1)}%)`)
  console.log('='.repeat(60))
}

optimizeImages().catch(console.error)
