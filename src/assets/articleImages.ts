/**
 * Zentrale Bild-Imports für Artikel
 *
 * WICHTIG: Vite-Imports werden hier verwendet statt dynamischer URLs.
 * Das garantiert:
 * - Korrekte Pfade im SSR (keine file:// URLs)
 * - Cache-Busting durch Hashing (green.webp → green-5c7fg3qe.webp)
 * - Optimierung durch Vite Build Pipeline
 *
 * WebP-Bilder werden verwendet für ~95% kleinere Dateigrößen.
 * Die Dateinamen in articles.ts bleiben .png für Kompatibilität,
 * werden aber auf .webp gemappt.
 */

// Artikel-Bilder (WebP-optimiert)
import greenImg from './green.webp'
import homeclinicImg from './homeclinic.webp'
import makemoneyImg from './makemoney.webp'
import testbild1Img from './Testbild1.webp'
import aboveTheFoldImg from './above_the_fold.webp'

// Produkt-Bilder (WebP-optimiert)
import iglooProFrontalImg from './Igloo-pro-frontal.webp'

// AP25 PT25.3: responsive Varianten (scripts/build-article-images.mjs). AVIF q60 ist gemessen
// 20–30 % kleiner als WebP q80 bei hoeherer PSNR; WebP bleibt Fallback-Quelle. Die
// Einzelbilder oben bleiben unveraendert — sie tragen OG/Structured Data, den <img src> und
// sind die WebP-Kandidaten der groessten Stufe (gemessen kleiner als eine Neukodierung).
import green400Avif from './green-400w.avif'
import green400Webp from './green-400w.webp'
import green800Avif from './green-800w.avif'
import green800Webp from './green-800w.webp'
import green1200Avif from './green-1200w.avif'
import homeclinic400Avif from './homeclinic-400w.avif'
import homeclinic400Webp from './homeclinic-400w.webp'
import homeclinic800Avif from './homeclinic-800w.avif'
import homeclinic800Webp from './homeclinic-800w.webp'
import homeclinic1024Avif from './homeclinic-1024w.avif'
import makemoney400Avif from './makemoney-400w.avif'
import makemoney400Webp from './makemoney-400w.webp'
import makemoney800Avif from './makemoney-800w.avif'
import makemoney800Webp from './makemoney-800w.webp'
import makemoney1024Avif from './makemoney-1024w.avif'
import testbild1400Avif from './Testbild1-400w.avif'
import testbild1400Webp from './Testbild1-400w.webp'
import testbild1800Avif from './Testbild1-800w.avif'
import testbild1800Webp from './Testbild1-800w.webp'
import testbild11024Avif from './Testbild1-1024w.avif'
import vitaminD3SprayImg from './VITAMIND_D3_SPRAY.jpg'
import vitaminD3Spray320Avif from './VITAMIND_D3_SPRAY-320w.avif'
import vitaminD3Spray320Webp from './VITAMIND_D3_SPRAY-320w.webp'
import vitaminD3Spray618Avif from './VITAMIND_D3_SPRAY-618w.avif'
import vitaminD3Spray618Webp from './VITAMIND_D3_SPRAY-618w.webp'

// Map für dynamischen Zugriff per Dateiname
// Keys bleiben .png für Backward-Kompatibilität mit articles.ts
export const articleImageMap: Record<string, string> = {
  'green.png': greenImg,
  'homeclinic.png': homeclinicImg,
  'makemoney.png': makemoneyImg,
  'Testbild1.png': testbild1Img,
  'above_the_fold.png': aboveTheFoldImg,
  'Igloo-pro-frontal.png': iglooProFrontalImg,
}

/** Eine Breitenvariante in beiden Formaten. */
export interface ResponsiveImageVariant {
  width: number
  avif: string
  webp: string
}

export interface ArticleImageAsset {
  /** Unveraendertes Einzelbild: `<img src>`-Fallback, OG und Structured Data. */
  src: string
  /** Native Abmessungen fuer `width`/`height` (Layout-Reservierung). */
  width: number
  height: number
  /** AP25 PT25.3: responsive AVIF/WebP-Varianten, aufsteigend nach Breite. */
  variants: readonly ResponsiveImageVariant[]
}

const variants = (...list: [number, string, string][]): readonly ResponsiveImageVariant[] =>
  list.map(([width, avif, webp]) => ({ width, avif, webp }))

const articleImageAssetMap: Record<string, ArticleImageAsset> = {
  'green.png': {
    src: greenImg,
    width: 1200,
    height: 800,
    variants: variants(
      [400, green400Avif, green400Webp],
      [800, green800Avif, green800Webp],
      [1200, green1200Avif, greenImg],
    ),
  },
  'homeclinic.png': {
    src: homeclinicImg,
    width: 1024,
    height: 1024,
    variants: variants(
      [400, homeclinic400Avif, homeclinic400Webp],
      [800, homeclinic800Avif, homeclinic800Webp],
      [1024, homeclinic1024Avif, homeclinicImg],
    ),
  },
  'makemoney.png': {
    src: makemoneyImg,
    width: 1024,
    height: 1024,
    variants: variants(
      [400, makemoney400Avif, makemoney400Webp],
      [800, makemoney800Avif, makemoney800Webp],
      [1024, makemoney1024Avif, makemoneyImg],
    ),
  },
  'Testbild1.png': {
    src: testbild1Img,
    width: 1024,
    height: 1024,
    variants: variants(
      [400, testbild1400Avif, testbild1400Webp],
      [800, testbild1800Avif, testbild1800Webp],
      [1024, testbild11024Avif, testbild1Img],
    ),
  },
}

/**
 * AP25 PT25.3: Produktbild der B2B-Seite /vitamin-d3-spray. Native Abmessungen 618 × 931 —
 * vorher standen 380 × 500 im Markup (Seitenverhaeltnis 0,76 statt 0,664), das Feld
 * reservierte also die falsche Breite, bis das Bild geladen war.
 */
export const VITAMIN_D3_SPRAY_IMAGE: ArticleImageAsset = {
  src: vitaminD3SprayImg,
  width: 618,
  height: 931,
  variants: variants(
    [320, vitaminD3Spray320Avif, vitaminD3Spray320Webp],
    [618, vitaminD3Spray618Avif, vitaminD3Spray618Webp],
  ),
}

/**
 * Gibt die korrekte URL für ein Artikelbild zurück.
 * Funktioniert sowohl im SSR als auch im Client.
 *
 * @param imageName - Der Dateiname (z.B. 'green.png')
 * @returns Die gehashte URL oder undefined wenn nicht gefunden
 */
export function getArticleImageUrl(imageName: string | undefined): string | undefined {
  if (!imageName) return undefined
  return articleImageMap[imageName]
}

export function getArticleImageAsset(imageName: string | undefined): ArticleImageAsset | undefined {
  if (!imageName) return undefined
  return articleImageAssetMap[imageName]
}

// Direkte Exports für typisierte Verwendung
export { greenImg, homeclinicImg, makemoneyImg, testbild1Img, aboveTheFoldImg, iglooProFrontalImg }
