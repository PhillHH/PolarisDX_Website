/**
 * OG Image Conversion Script
 *
 * Rendert scripts/og-image-template.html zu public/og-image.jpg (1200x630).
 *
 * Voraussetzung (bewusst NICHT in package.json, damit der Prod-Build nicht
 * Chromium mitzieht):
 *   npm install --no-save puppeteer
 *
 * Aufruf:
 *   node scripts/convert-og-image.mjs
 *
 * Farben der Vorlage werden vom Farb-Guard geprueft
 * (npm run check:colors) — eine Navy #083358, ein Akzent Teal.
 */
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function generateOGImage() {
  const templatePath = path.join(__dirname, 'og-image-template.html')
  const outputPath = path.join(__dirname, '../public/og-image.jpg')

  console.log('Launching browser...')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })

  console.log('Loading template...')
  await page.goto(`file://${templatePath}`, { waitUntil: 'networkidle0' })
  await page.evaluateHandle('document.fonts.ready')

  console.log('Capturing screenshot...')
  await page.screenshot({
    path: outputPath,
    type: 'jpeg',
    quality: 90,
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  })

  await browser.close()

  const fileSizeKB = Math.round(fs.statSync(outputPath).size / 1024)
  console.log(`\nOG Image generated: ${outputPath}`)
  console.log(`Size: ${fileSizeKB} KB`)
  if (fileSizeKB > 300) {
    console.log('Warning: File size exceeds 300KB. Consider reducing quality.')
  }
}

generateOGImage().catch((err) => {
  console.error(err)
  process.exit(1)
})
