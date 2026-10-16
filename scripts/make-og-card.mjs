/**
 * Standard-Share-Karte rendern: scripts/og-image-template.html → public/og-image.jpg
 *
 * Ersetzt seit 2026-10-16 den alten Generator (convert-og-image.mjs). Die alte Karte
 * hat Logo und Gerät in CSS nachgebaut — eine getippte Wortmarke und ein gezeichnetes
 * Kästchen mit dem erfundenen Messwert „45.2 ng/mL Vitamin D" (auf `main` am
 * 2026-09-10 entfernt, 6908b61). Diese Karte nutzt nur echte Dateien und Texte aus
 * home.json, die im Claim-Register stehen (HOMEPAGE-CONTRACT HCL-001..005).
 *
 * Aufruf: node scripts/make-og-card.mjs   (Playwright-Chromium, sharp — beide Dev-Abhängigkeiten)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (rel) => fs.readFileSync(path.join(ROOT, rel))
const dataUri = (buffer, mime) => `data:${mime};base64,${buffer.toString('base64')}`
const esc = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const home = JSON.parse(read('public/locales/de/home.json'))
const lines = home.hero.title.match(/[^.!?]+[.!?]+\s*/g) ?? [home.hero.title]
const { cv, ivdr, minutes, compat } = home.trustbar

// Ausschnitt des Produktrenders ohne den hellen Rand des Originals (wie auf `main`).
const device = await sharp(path.join(ROOT, 'src/assets/Igloo-pro-frontal.png'))
  .extract({ left: 205, top: 252, width: 668, height: 664 })
  .png()
  .toBuffer()

const html = read('scripts/og-image-template.html')
  .toString()
  .replace(
    '{{FONT}}',
    dataUri(
      read('node_modules/@fontsource-variable/inter/files/inter-latin-standard-normal.woff2'),
      'font/woff2',
    ),
  )
  .replace('{{LOGO}}', dataUri(read('src/assets/polaris_white.webp'), 'image/webp'))
  .replace('{{DEVICE}}', dataUri(device, 'image/png'))
  .replace('{{CAPTION}}', esc(home.hero.caption))
  .replace('{{TITLE}}', lines.map((line) => `<span>${esc(line.trim())}</span>`).join(''))
  .replace('{{SIGNALS}}', [cv, ivdr, minutes, compat].map((s) => `<span>${esc(s)}</span>`).join(''))

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
const png = await page.screenshot({ type: 'png' })
await browser.close()

const out = path.join(ROOT, 'public/og-image.jpg')
await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(out)
console.log(`public/og-image.jpg ${fs.statSync(out).size} B`)
