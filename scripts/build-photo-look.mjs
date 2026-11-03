/**
 * „Polaris-Look" — eine Farbbehandlung fuer alle Fotos der Website (2026-10-16, Owner-Wunsch:
 * Bilder wirken uneinheitlich; die KI-Collagen der Artikel sollen weg).
 *
 * Alle Motive kommen aus demselben Pool (`assets-src/photos/`, KI-generiert, siehe PROMPTS.md) und bekommen dieselbe
 * Behandlung, damit Startseite, Bereiche und Artikel wie EINE Bildwelt wirken:
 *   1. Saettigung 0,92 — leicht zuruecknehmen (bis Runde 1 0,78; seit den warmen KI-Motiven der
 *      Runde 2 am 2026-10-16 bewusst milder, damit Eiche, Haut und Pflanzen lebendig bleiben),
 *   2. Navy `#083358` als Soft-Light-Lage (Alpha 0,12; vorher 0,26) — Schatten in Markenrichtung,
 *   3. leichter Kontrast (`linear 1.04, −5`),
 *   4. einheitliche Zuschnitte: Karten 4:3 / 3:2, Artikel 16:9, Buehne wie AP34 (Verlauf und
 *      Punktring eingebacken, Textseite flaches Navy).
 * Kein Motiv wird erfunden, kein Geraet gemalt, kein Messwert eingesetzt (main 6908b61).
 *
 * Ausgaben (Dateinamen wie bisher, Code unveraendert):
 *   src/assets/home/detail-capillary-{480,960}w.{avif,webp}                    4:5 (Fachbereich-Modul)
 *   src/assets/home/report-preview-{400,800}w.webp                               Musterbefund (Saeule Epigenetik)
 *   src/assets/home/hero-desktop-{1440,2400}w.avif, hero-mobile-{800,1200}w.{avif,webp}
 *   src/assets/article-<motiv>.webp (1200w, Original fuer OG/Fallback) + -{400,800}w.{avif,webp}
 *   + -1200w.avif  (Artikel, 16:9; Registrierung in scripts/build-article-images.mjs)
 *
 * Ausfuehren: npm run build:photo-look   ·   Pruefen: npm run check:article-images
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'assets-src/photos')
const HOME = path.join(ROOT, 'src/assets/home')
const ASSETS = path.join(ROOT, 'src/assets')
const NAVY = '#083358'

/** Der Look: wird auf das fertig zugeschnittene, skalierte Foto angewendet. */
async function look(pipeline, width, height) {
  const base = await pipeline.modulate({ saturation: 0.92 }).linear(1.04, -5).toBuffer()
  const tint = await sharp({
    create: { width, height, channels: 4, background: { ...hex(NAVY), alpha: 0.12 } },
  })
    .png()
    .toBuffer()
  return sharp(base).composite([{ input: tint, blend: 'soft-light' }])
}
const hex = (h) => ({
  r: parseInt(h.slice(1, 3), 16),
  g: parseInt(h.slice(3, 5), 16),
  b: parseInt(h.slice(5, 7), 16),
})

async function encode(image, outBase, { avif, webp, effort = 6 }) {
  const out = {}
  if (avif !== undefined) {
    // 4:2:0-Chroma: bei Fotos kaum sichtbar, spart 15–25 % — noetig seit den detailreichen
    // KI-Motiven der Runde 2 (Budgets: Startseite imageBytes, Artikel lcpImageBytes).
    const buf = await image
      .clone()
      .avif({ quality: avif, effort: 9, chromaSubsampling: '4:2:0' })
      .toBuffer()
    fs.writeFileSync(`${outBase}.avif`, buf)
    out.avif = buf.length
  }
  if (webp !== undefined) {
    const buf = await image.clone().webp({ quality: webp, effort }).toBuffer()
    fs.writeFileSync(`${outBase}.webp`, buf)
    out.webp = buf.length
  }
  console.log(path.relative(ROOT, outBase), JSON.stringify(out))
}

/** Karte: Zuschnitt auf Seitenverhaeltnis, Look, Stufen. */
async function card(source, outName, ratio, widths, q, position = 'attention') {
  for (const [i, w] of widths.entries()) {
    const h = Math.round(w / ratio)
    const graded = await look(
      sharp(path.join(SRC, source)).resize(w, h, { fit: 'cover', position }),
      w,
      h,
    )
    await encode(graded, path.join(HOME, `${outName}-${w}w`), { avif: q[i], webp: q[i] + 24 })
  }
}

/**
 * Artikelbild 16:9. Zuerst das 1200w-WebP als „Original" (OG, <img src>, groesste WebP-Stufe),
 * danach die Stufen — check-article-images verlangt Stufen, die nicht aelter als ihre Quelle sind.
 * Budget (PT25.5): Artikelseite `lcpImageBytes` 21 938 B, Index `imageBytes` 161 477 B mobil —
 * deshalb AVIF 800w q46 und 1200w q40; der Index zeigt mobil 800w (sizes ohne 1200w-Treffer).
 */
async function article(source, base, position = 'attention') {
  const W = 1200
  const crop = (w) => {
    const h = Math.round((w * 9) / 16)
    return [sharp(path.join(SRC, source)).resize(w, h, { fit: 'cover', position }), w, h]
  }
  const [full, fw, fh] = crop(W)
  const original = await look(full, fw, fh)
  await encode(original, path.join(ASSETS, base), { webp: 78 })
  await encode(original, path.join(ASSETS, `${base}-${W}w`), { avif: 34 })
  for (const [w, q] of [
    [400, 42],
    [800, 36],
  ]) {
    const [img, cw, ch] = crop(w)
    await encode(await look(img, cw, ch), path.join(ASSETS, `${base}-${w}w`), { avif: q, webp: 78 })
  }
}

/**
 * SC-021 (Owner 2026-11-02, Kopfzeile 13A-4): Startseiten-Buehne als Fotokarte 16:10 neben dem
 * Text — das saubere Praxisfoto ohne Navy-Verlauf und Punktring (der Schleier des alten
 * Startbilds war ausdruecklich unerwuenscht). 480w (DPR 1 mobil), 800w (DPR 2 mobil, muss unter
 * `lcpImageBytes` 19 438 B der Startseite bleiben) und 1280w (Desktop DPR 2; Desktop zeigt 560 px).
 */
/**
 * SC-021 Nachtrag: Messe-Band (EventBand) — `lab-tubes.jpg` (IglooPro auf dem Tresen, Pool
 * 2026-10-16) als 12:5-Karte, 480w (DPR 1) und 960w (DPR 2); lazy, nie LCP.
 */
async function eventBand() {
  await card('lab-tubes.jpg', 'event-band', 12 / 5, [480, 960], [44, 40])
}

async function heroCard() {
  await card('practice-dental-2600.jpg', 'hero-card', 16 / 10, [480, 800, 1280], [44, 40, 36])
  // SC-021 Nachtrag (Owner: Diashow in Folie 1): zwei weitere 16:10-Karten, nur im Browser (lazy).
  await card('detail-capillary.jpg', 'hero-card-capillary', 16 / 10, [480, 800, 1280], [44, 40, 36], 'centre')
  await card('lab-tubes.jpg', 'hero-card-device', 16 / 10, [480, 800, 1280], [44, 40, 36], 'right')
}

/** Motivzuordnung der Artikel (src/data/articles.ts). */
export const ARTICLE_PHOTOS = [
  { base: 'article-green-practice', source: 'reception.jpg' },
  { base: 'article-invisible-patient', source: 'doctor-tablet.jpg' },
  { base: 'article-five-minute', source: 'lab-tubes.jpg' },
  { base: 'article-rapid-setup', source: 'clinic-modern.jpg' },
  { base: 'article-precision', source: 'lab-micro.jpg' },
]

async function main() {
  // SC-005 (2026-10-16): die Startseite traegt noch EIN Detailfoto (Fachbereich-Modul, 4:5);
  // die fuenf Karten-Motive der Saeulen und Fachbereiche sind durch Parameter-Tafel,
  // Produkt-Render und Musterbefund ersetzt (HOMEPAGE-CONTRACT §4).
  await card('detail-capillary.jpg', 'detail-capillary', 4 / 5, [480, 960], [40, 44])
  // Musterbefund-Vorschau der Epigenetik-Saeule: echtes Dokument aus src/assets/epigenetics,
  // auf Kartenbreite skaliert (384 px CSS → 400w/800w), sonst meldet das Budget „oversized".
  for (const [w, q] of [
    [400, 80],
    [800, 76],
  ]) {
    const buf = await sharp(path.join(ASSETS, 'epigenetics/befund-biologische-altersuhr@2x.webp'))
      .resize(w)
      .webp({ quality: q, effort: 6 })
      .toBuffer()
    fs.writeFileSync(path.join(HOME, `report-preview-${w}w.webp`), buf)
    console.log(
      path.relative(ROOT, path.join(HOME, `report-preview-${w}w`)),
      JSON.stringify({ webp: buf.length }),
    )
  }
  await heroCard()
  await eventBand()
  for (const { base, source } of ARTICLE_PHOTOS) await article(source, base)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const only = { 'hero-card': heroCard, 'event-band': eventBand }[process.argv[2]]
  await (only ? only() : main())
}
