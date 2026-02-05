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

// Direkte Exports für typisierte Verwendung
export {
  greenImg,
  homeclinicImg,
  makemoneyImg,
  testbild1Img,
  aboveTheFoldImg,
  iglooProFrontalImg,
}
