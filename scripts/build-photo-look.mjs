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

const mark = fs
  .readFileSync(path.join(ROOT, 'public/polarisdx-mark.svg'), 'utf8')
  .replace(/fill="#[0-9a-fA-F]{6}"/g, 'fill="#ffffff"')
const ringSvg = (size, opacity) =>
  Buffer.from(mark.replace('<svg ', `<svg width="${size}" height="${size}" opacity="${opacity}" `))
const svgRect = (w, h, defs) =>
  Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs><rect width="${w}" height="${h}" fill="url(#g)"/></svg>`,
  )

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

/** Desktop-Buehne: Navy-Verlauf links (Textseite), weicher Fuss, Punktring des Signets. */
function stageOverlays(w, h) {
  const g = svgRect(
    w,
    h,
    `<linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${NAVY}" stop-opacity="0.97"/>
      <stop offset="0.42" stop-color="${NAVY}" stop-opacity="0.93"/>
      <stop offset="0.68" stop-color="${NAVY}" stop-opacity="0.4"/>
      <stop offset="1" stop-color="${NAVY}" stop-opacity="0.08"/></linearGradient>`,
  )
  const b = svgRect(
    w,
    h,
    `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.7" stop-color="${NAVY}" stop-opacity="0"/>
      <stop offset="1" stop-color="${NAVY}" stop-opacity="0.45"/></linearGradient>`,
  )
  const size = Math.round(w * 0.46)
  return [
    { input: g, left: 0, top: 0 },
    { input: b, left: 0, top: 0 },
    { input: ringSvg(size, 0.06), left: Math.round(-w * 0.14), top: Math.round(h * 0.34) },
  ]
}

/**
 * Folien 2/3 des Hero-Sliders (SC-020; Owner 2026-10-29: „Das Herobild darf nicht das gleiche wie
 * der Startseite sein" — Auswahl: vorhandene Artikelmotive, kein neues KI-Bild). Nur Desktop
 * (ab lg), 2:1, eine Stufe 1440w AVIF: die Quellen sind 1376 px breit, eine 2400er waere 1,75-fach
 * hochskaliert. Verlauf und Ring wie die Buehne, damit die Textseite links Navy bleibt. Ziel ist
 * `public/home/` mit festen kurzen Namen: der Slider-Chunk traegt die Pfade als Literal (Budget
 * `home.jsBytes`), ein Import ueber `homeImages.ts` kostete rund 100 B gzip mehr.
 *   - event: lab-tubes.jpg (IglooPro auf dem Tresen rechts) — MEDICA „IglooPro live"
 *   - panels: lab-micro.jpg gespiegelt (Haende mit Probenroehrchen rechts) — Panels aus
 *     einem Tropfen Blut
 */
const SLIDES = [
  { base: 'event', source: 'lab-tubes.jpg', flip: false },
  { base: 'panels', source: 'lab-micro.jpg', flip: true },
]
async function slides() {
  const w = 1440
  const h = w / 2
  for (const { base, source, flip } of SLIDES) {
    const src = path.join(SRC, source)
    const { width: SW, height: SH } = await sharp(src).metadata()
    const ch = Math.min(SH, Math.round(SW / 2))
    // Ausschnitt etwas unterhalb der Mitte: Geraet bzw. Haende liegen im unteren Bilddrittel.
    let img = sharp(src).extract({
      left: 0,
      top: Math.round((SH - ch) * 0.7),
      width: SW,
      height: ch,
    })
    if (flip) img = img.flop()
    const photo = await look(img.resize(w, h), w, h)
    const raw = sharp(await photo.png().toBuffer()).composite(stageOverlays(w, h))
    await encode(raw, path.join(ROOT, 'public', 'home', base), { avif: 46 })
  }
}

/** Buehne der Startseite (AP34 / SC-002) — Verlauf und Punktring eingebacken. */
async function stage() {
  const src = path.join(SRC, 'practice-dental-2600.jpg')
  // Zuschnitte relativ zur Quellgroesse (Quelle 16:9, Motiv im rechten Drittel, links ruhige
  // Flaeche fuer den Text) — die Pixelwerte der ersten Fassung galten nur fuer die 2600-px-Datei.
  const { width: SW, height: SH } = await sharp(src).metadata()
  const desktop = async (w, q) => {
    const h = w / 2
    const ch = Math.min(SH, Math.round(SW / 2))
    const photo = await look(
      sharp(src)
        .extract({ left: 0, top: Math.round((SH - ch) / 2), width: SW, height: ch })
        .resize(w, h),
      w,
      h,
    )
    const raw = sharp(await photo.png().toBuffer()).composite(stageOverlays(w, h))
    await encode(raw, path.join(HOME, `hero-desktop-${w}w`), { avif: q })
  }
  const mobile = async (w, q, wq) => {
    const h = Math.round(w * 2.25)
    // Hochkant-Ausschnitt um die Person (Mitte bei ~73 % der Breite), Verhaeltnis ~0,775.
    const rw = Math.round(SW * 0.42)
    const rh = Math.min(SH, Math.round(rw / 0.775))
    const region = {
      left: Math.round(SW * 0.73 - rw / 2),
      top: Math.round((SH - rh) / 2),
      width: rw,
      height: rh,
    }
    const ph = Math.round((w * region.height) / region.width)
    const photo = await look(sharp(src).extract(region).resize(w, ph), w, ph)
    const top = h - ph
    const base = sharp({
      create: { width: w, height: h, channels: 3, background: NAVY },
    }).composite([{ input: await photo.png().toBuffer(), left: 0, top }])
    const g = svgRect(
      w,
      h,
      `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${NAVY}" stop-opacity="1"/>
      <stop offset="${(top / h + 0.02).toFixed(3)}" stop-color="${NAVY}" stop-opacity="1"/>
      <stop offset="${(top / h + 0.1).toFixed(3)}" stop-color="${NAVY}" stop-opacity="0.82"/>
      <stop offset="${(top / h + 0.17).toFixed(3)}" stop-color="${NAVY}" stop-opacity="0.5"/>
      <stop offset="1" stop-color="${NAVY}" stop-opacity="0.3"/></linearGradient>`,
    )
    const size = Math.round(w * 0.9)
    const raw = sharp(await base.png().toBuffer()).composite([
      { input: g, left: 0, top: 0 },
      { input: ringSvg(size, 0.06), left: Math.round(w * 0.38), top: Math.round(-h * 0.05) },
    ])
    await encode(raw, path.join(HOME, `hero-mobile-${w}w`), { avif: q, webp: wq })
  }
  await desktop(1440, 46)
  await desktop(2400, 44)
  await mobile(800, 46, 62)
  await mobile(1200, 44, 58)
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
  await stage()
  await slides()
  for (const { base, source } of ARTICLE_PHOTOS) await article(source, base)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main()
