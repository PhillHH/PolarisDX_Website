/**
 * Relaunch 2026-10-15 (SC-001) — Bildwelt der Startseite.
 *
 * Fotografie statt Icon-Kacheln: vier Praxis-/Labor-Motive im Hero-Mosaik und
 * zwei Motive auf den Saeulen-Karten. Quelle: Unsplash (Unsplash-Lizenz, frei
 * fuer kommerzielle Nutzung, keine Namensnennung noetig); Zuschnitte und
 * Varianten entstehen aus den Originalen im Workspace-Scratchpad, nicht per
 * Hotlink — `img-src 'self'` bleibt unberuehrt.
 *
 * Breiten sind aus der Darstellung abgeleitet (CSS-Breite × DPR 1–2), damit
 * das Perf-Budget (`oversizedImages`, `imageBytes` der Startseite) haelt:
 *   - Hero-Kachel: 110–180 px CSS → 240w/480w, quadratisch
 *   - Saeulen-Karte: 320–384 px CSS → 400w/640w, 3:2
 * AVIF q52–58 als Erstquelle, WebP als Rueckfall — wie `articleImages.ts`.
 */
import type { ArticleImageAsset } from '../articleImages'

import practiceDental240Avif from './practice-dental-240w.avif'
import practiceDental240Webp from './practice-dental-240w.webp'
import practiceDental480Avif from './practice-dental-480w.avif'
import practiceDental480Webp from './practice-dental-480w.webp'
import practiceBeauty240Avif from './practice-beauty-240w.avif'
import practiceBeauty240Webp from './practice-beauty-240w.webp'
import practiceBeauty480Avif from './practice-beauty-480w.avif'
import practiceBeauty480Webp from './practice-beauty-480w.webp'
import practiceLongevity240Avif from './practice-longevity-240w.avif'
import practiceLongevity240Webp from './practice-longevity-240w.webp'
import practiceLongevity480Avif from './practice-longevity-480w.avif'
import practiceLongevity480Webp from './practice-longevity-480w.webp'
import labTubes240Avif from './lab-tubes-240w.avif'
import labTubes240Webp from './lab-tubes-240w.webp'
import labTubes480Avif from './lab-tubes-480w.avif'
import labTubes480Webp from './lab-tubes-480w.webp'
import practiceConsult400Avif from './practice-consult-400w.avif'
import practiceConsult400Webp from './practice-consult-400w.webp'
import practiceConsult640Avif from './practice-consult-640w.avif'
import practiceConsult640Webp from './practice-consult-640w.webp'
import labAnalyst400Avif from './lab-analyst-400w.avif'
import labAnalyst400Webp from './lab-analyst-400w.webp'
import labAnalyst640Avif from './lab-analyst-640w.avif'
import labAnalyst640Webp from './lab-analyst-640w.webp'

const square = (small: [string, string], large: [string, string]): ArticleImageAsset => ({
  // `src` ist die groesste WebP-Stufe — der <img>-Rueckfall ohne <source>-Support.
  src: large[1],
  width: 480,
  height: 480,
  variants: [
    { width: 240, avif: small[0], webp: small[1] },
    { width: 480, avif: large[0], webp: large[1] },
  ],
})

const landscape = (small: [string, string], large: [string, string]): ArticleImageAsset => ({
  src: large[1],
  width: 640,
  height: 427,
  variants: [
    { width: 400, avif: small[0], webp: small[1] },
    { width: 640, avif: large[0], webp: large[1] },
  ],
})

/** Hero-Mosaik — quadratische Kacheln. */
export const HERO_TILE_IMAGES = {
  dental: square(
    [practiceDental240Avif, practiceDental240Webp],
    [practiceDental480Avif, practiceDental480Webp],
  ),
  beauty: square(
    [practiceBeauty240Avif, practiceBeauty240Webp],
    [practiceBeauty480Avif, practiceBeauty480Webp],
  ),
  longevity: square(
    [practiceLongevity240Avif, practiceLongevity240Webp],
    [practiceLongevity480Avif, practiceLongevity480Webp],
  ),
  epigenetics: square([labTubes240Avif, labTubes240Webp], [labTubes480Avif, labTubes480Webp]),
} as const

/** Saeulen-Karten — 3:2. */
export const PILLAR_IMAGES = {
  diagnostics: landscape(
    [practiceConsult400Avif, practiceConsult400Webp],
    [practiceConsult640Avif, practiceConsult640Webp],
  ),
  epigenetics: landscape(
    [labAnalyst400Avif, labAnalyst400Webp],
    [labAnalyst640Avif, labAnalyst640Webp],
  ),
} as const
