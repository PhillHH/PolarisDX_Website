/**
 * Zentrale Bild-Imports für Artikel
 *
 * WICHTIG: Vite-Imports werden hier verwendet statt dynamischer URLs.
 * Das garantiert:
 * - Korrekte Pfade im SSR (keine file:// URLs)
 * - Cache-Busting durch Hashing (article-precision.webp → article-precision-5c7fg3qe.webp)
 * - Optimierung durch Vite Build Pipeline
 *
 * Schluessel = Dateiname aus articles.ts (seit 2026-10-16 durchgehend .webp).
 */

// Artikel-Bilder: fuenf Fotos aus dem gemeinsamen Pool im Polaris-Look (16:9, 1200w WebP =
// Original fuer OG/Fallback; scripts/build-photo-look.mjs) und der echte IglooPro-Render (8:3).
import iglooHeroImg from './article-hero-igloopro.webp'
import iglooHero400Avif from './article-hero-igloopro-400w.avif'
import iglooHero400Webp from './article-hero-igloopro-400w.webp'
import iglooHero800Avif from './article-hero-igloopro-800w.avif'
import iglooHero800Webp from './article-hero-igloopro-800w.webp'
import iglooHero1600Avif from './article-hero-igloopro-1600w.avif'
import greenPracticeImg from './article-green-practice.webp'
import greenPractice400Avif from './article-green-practice-400w.avif'
import greenPractice400Webp from './article-green-practice-400w.webp'
import greenPractice800Avif from './article-green-practice-800w.avif'
import greenPractice800Webp from './article-green-practice-800w.webp'
import greenPractice1200Avif from './article-green-practice-1200w.avif'
import invisiblePatientImg from './article-invisible-patient.webp'
import invisiblePatient400Avif from './article-invisible-patient-400w.avif'
import invisiblePatient400Webp from './article-invisible-patient-400w.webp'
import invisiblePatient800Avif from './article-invisible-patient-800w.avif'
import invisiblePatient800Webp from './article-invisible-patient-800w.webp'
import invisiblePatient1200Avif from './article-invisible-patient-1200w.avif'
import fiveMinuteImg from './article-five-minute.webp'
import fiveMinute400Avif from './article-five-minute-400w.avif'
import fiveMinute400Webp from './article-five-minute-400w.webp'
import fiveMinute800Avif from './article-five-minute-800w.avif'
import fiveMinute800Webp from './article-five-minute-800w.webp'
import fiveMinute1200Avif from './article-five-minute-1200w.avif'
import rapidSetupImg from './article-rapid-setup.webp'
import rapidSetup400Avif from './article-rapid-setup-400w.avif'
import rapidSetup400Webp from './article-rapid-setup-400w.webp'
import rapidSetup800Avif from './article-rapid-setup-800w.avif'
import rapidSetup800Webp from './article-rapid-setup-800w.webp'
import rapidSetup1200Avif from './article-rapid-setup-1200w.avif'
import precisionImg from './article-precision.webp'
import precision400Avif from './article-precision-400w.avif'
import precision400Webp from './article-precision-400w.webp'
import precision800Avif from './article-precision-800w.avif'
import precision800Webp from './article-precision-800w.webp'
import precision1200Avif from './article-precision-1200w.avif'

// Produkt-Bilder (WebP-optimiert)
import iglooProFrontalImg from './Igloo-pro-frontal.webp'

// AP25 PT25.3: responsive Varianten. AVIF q58–60 ist gemessen 20–30 % kleiner als WebP q80 bei
// hoeherer PSNR; WebP bleibt Fallback-Quelle. Die Einzelbilder oben tragen OG/Structured Data,
// den <img src> und sind die WebP-Kandidaten der groessten Stufe.

import vitaminD3SprayImg from './VITAMIND_D3_SPRAY.jpg'
import vitaminD3Spray320Avif from './VITAMIND_D3_SPRAY-320w.avif'
import vitaminD3Spray320Webp from './VITAMIND_D3_SPRAY-320w.webp'
import vitaminD3Spray618Avif from './VITAMIND_D3_SPRAY-618w.avif'
import vitaminD3Spray618Webp from './VITAMIND_D3_SPRAY-618w.webp'

// Map für dynamischen Zugriff per Dateiname
// Keys bleiben .png für Backward-Kompatibilität mit articles.ts
export const articleImageMap: Record<string, string> = {
  'article-green-practice.webp': greenPracticeImg,
  'article-invisible-patient.webp': invisiblePatientImg,
  'article-five-minute.webp': fiveMinuteImg,
  'article-rapid-setup.webp': rapidSetupImg,
  'article-precision.webp': precisionImg,
  'article-hero-igloopro.webp': iglooHeroImg,
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
  'article-green-practice.webp': {
    src: greenPracticeImg,
    width: 1200,
    height: 675,
    variants: variants(
      [400, greenPractice400Avif, greenPractice400Webp],
      [800, greenPractice800Avif, greenPractice800Webp],
      [1200, greenPractice1200Avif, greenPracticeImg],
    ),
  },
  'article-invisible-patient.webp': {
    src: invisiblePatientImg,
    width: 1200,
    height: 675,
    variants: variants(
      [400, invisiblePatient400Avif, invisiblePatient400Webp],
      [800, invisiblePatient800Avif, invisiblePatient800Webp],
      [1200, invisiblePatient1200Avif, invisiblePatientImg],
    ),
  },
  'article-five-minute.webp': {
    src: fiveMinuteImg,
    width: 1200,
    height: 675,
    variants: variants(
      [400, fiveMinute400Avif, fiveMinute400Webp],
      [800, fiveMinute800Avif, fiveMinute800Webp],
      [1200, fiveMinute1200Avif, fiveMinuteImg],
    ),
  },
  'article-rapid-setup.webp': {
    src: rapidSetupImg,
    width: 1200,
    height: 675,
    variants: variants(
      [400, rapidSetup400Avif, rapidSetup400Webp],
      [800, rapidSetup800Avif, rapidSetup800Webp],
      [1200, rapidSetup1200Avif, rapidSetupImg],
    ),
  },
  'article-precision.webp': {
    src: precisionImg,
    width: 1200,
    height: 675,
    variants: variants(
      [400, precision400Avif, precision400Webp],
      [800, precision800Avif, precision800Webp],
      [1200, precision1200Avif, precisionImg],
    ),
  },
  'article-hero-igloopro.webp': {
    src: iglooHeroImg,
    width: 1600,
    height: 600,
    variants: variants(
      [400, iglooHero400Avif, iglooHero400Webp],
      [800, iglooHero800Avif, iglooHero800Webp],
      [1600, iglooHero1600Avif, iglooHeroImg],
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
 * @param imageName - Der Dateiname (z.B. 'article-precision.webp')
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
export { iglooHeroImg, iglooProFrontalImg }
