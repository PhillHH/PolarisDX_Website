/**
 * Kartenbilder der Musterbefunde — /epigenetics
 *
 * Es sind Ausschnitte der PDF-Deckblaetter (oberes Drittel, 3:2). Der untere
 * Teil des Deckblatts ist absichtlich nicht dabei: dort steht nur der
 * Beispielpatient, und als Kachel wirkt die leere Mitte des Blatts wie ein
 * Ladefehler.
 *
 * Import statt Pfad-String, damit Vite hasht und der SSR-Lauf keine file://
 * URLs erzeugt — dieselbe Regel wie in articleImages.ts.
 */

import metabolicHealth from './befund-metabolic-health.webp'
import metabolicHealth2x from './befund-metabolic-health@2x.webp'
import healthyAging from './befund-healthy-aging.webp'
import healthyAging2x from './befund-healthy-aging@2x.webp'
import biologischeAltersuhr from './befund-biologische-altersuhr.webp'
import biologischeAltersuhr2x from './befund-biologische-altersuhr@2x.webp'
import telomerAnalyse from './befund-telomer-analyse.webp'
import telomerAnalyse2x from './befund-telomer-analyse@2x.webp'
import stressMonitor from './befund-stress-monitor.webp'
import stressMonitor2x from './befund-stress-monitor@2x.webp'
import healthySport from './befund-healthy-sport.webp'
import healthySport2x from './befund-healthy-sport@2x.webp'

export interface BefundImage {
  src: string
  src2x: string
}

/** Schluessel = slug aus epigenetics.json → samples.items[].slug */
export const BEFUND_IMAGES: Record<string, BefundImage> = {
  'metabolic-health': { src: metabolicHealth, src2x: metabolicHealth2x },
  'healthy-aging': { src: healthyAging, src2x: healthyAging2x },
  'biologische-altersuhr': { src: biologischeAltersuhr, src2x: biologischeAltersuhr2x },
  'telomer-analyse': { src: telomerAnalyse, src2x: telomerAnalyse2x },
  'stress-monitor': { src: stressMonitor, src2x: stressMonitor2x },
  'healthy-sport': { src: healthySport, src2x: healthySport2x },
}

/** Intrinsische Groesse der 1x-Variante — verhindert Layout-Shift. */
export const BEFUND_IMAGE_SIZE = { width: 640, height: 427 }
