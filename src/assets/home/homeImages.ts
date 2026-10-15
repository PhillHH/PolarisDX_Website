/**
 * Relaunch 2026-10-15 (SC-001) — Bildwelt der Startseite.
 *
 * Fotografie statt Icon-Kacheln: drei Praxis-Motive als Fachbereich-Einstiege,
 * zwei Motive auf den Saeulen-Karten und die Editorial-Buehne (AP34 / SC-002). Quelle: Unsplash (Unsplash-Lizenz, frei
 * fuer kommerzielle Nutzung, keine Namensnennung noetig); Zuschnitte und
 * Varianten entstehen aus den Originalen im Workspace-Scratchpad, nicht per
 * Hotlink — `img-src 'self'` bleibt unberuehrt.
 *
 * Breiten sind aus der Darstellung abgeleitet (CSS-Breite × DPR 1–2), damit
 * das Perf-Budget (`oversizedImages`, `imageBytes` der Startseite) haelt:
 *   - Fachbereich-Karte: bis 384 px CSS → 400w/800w, 4:3
 *   - Saeulen-Karte: 320–384 px CSS → 400w/640w, 3:2
 * AVIF q52–58 als Erstquelle, WebP als Rueckfall — wie `articleImages.ts`.
 */
import type { ArticleImageAsset } from '../articleImages'

import serviceDental400Avif from './service-dental-400w.avif'
import serviceDental400Webp from './service-dental-400w.webp'
import serviceDental800Avif from './service-dental-800w.avif'
import serviceDental800Webp from './service-dental-800w.webp'
import serviceBeauty400Avif from './service-beauty-400w.avif'
import serviceBeauty400Webp from './service-beauty-400w.webp'
import serviceBeauty800Avif from './service-beauty-800w.avif'
import serviceBeauty800Webp from './service-beauty-800w.webp'
import serviceLongevity400Avif from './service-longevity-400w.avif'
import serviceLongevity400Webp from './service-longevity-400w.webp'
import serviceLongevity800Avif from './service-longevity-800w.avif'
import serviceLongevity800Webp from './service-longevity-800w.webp'
import practiceConsult400Avif from './practice-consult-400w.avif'
import practiceConsult400Webp from './practice-consult-400w.webp'
import practiceConsult640Avif from './practice-consult-640w.avif'
import practiceConsult640Webp from './practice-consult-640w.webp'
import labAnalyst400Avif from './lab-analyst-400w.avif'
import labAnalyst400Webp from './lab-analyst-400w.webp'
import labAnalyst640Avif from './lab-analyst-640w.avif'
import labAnalyst640Webp from './lab-analyst-640w.webp'
import heroDesktop1440Avif from './hero-desktop-1440w.avif'
import heroDesktop2400Avif from './hero-desktop-2400w.avif'
import heroMobile800Avif from './hero-mobile-800w.avif'
import heroMobile800Webp from './hero-mobile-800w.webp'
import heroMobile1200Avif from './hero-mobile-1200w.avif'
import heroMobile1200Webp from './hero-mobile-1200w.webp'

/** Fachbereich-Karte 4:3 — 400w fuer DPR 1 am Desktop, 800w fuer Telefone (DPR 1,75–3). */
const card = (small: [string, string], large: [string, string]): ArticleImageAsset => ({
  src: large[1],
  width: 800,
  height: 600,
  variants: [
    { width: 400, avif: small[0], webp: small[1] },
    { width: 800, avif: large[0], webp: large[1] },
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

/**
 * Fachbereich-Einstiege (Zahnarztpraxis, Aesthetik, Longevity) — 4:3-Foto-Karten
 * unter einem Navy-Verlauf (AP34). Motive aus dem SC-001-Mosaik, neu
 * zugeschnitten: die Karte ist querformatig und der Verlauf deckt die untere
 * Haelfte, deshalb reicht eine niedrigere AVIF-Qualitaet (400w q42, 800w q46).
 */
export const SERVICE_IMAGES = {
  dental: card(
    [serviceDental400Avif, serviceDental400Webp],
    [serviceDental800Avif, serviceDental800Webp],
  ),
  beauty: card(
    [serviceBeauty400Avif, serviceBeauty400Webp],
    [serviceBeauty800Avif, serviceBeauty800Webp],
  ),
  longevity: card(
    [serviceLongevity400Avif, serviceLongevity400Webp],
    [serviceLongevity800Avif, serviceLongevity800Webp],
  ),
} as const

/**
 * Editorial-Buehne der Startseite (AP34 / SC-002) — art-directed.
 *
 * Ein Praxisfoto, Navy-Verlauf und Punktring des Signets sind IN die Datei
 * eingebacken: die Textseite ist nahezu flaches Navy und kostet kaum Bytes.
 *   - Desktop 2:1, ab 1024 px, nur AVIF: 1440w (12,4 KB) / 2400w fuer DPR 2
 *   - Mobil 4:9, Arzt unten im Bild: 800w (AVIF 15,1 KB) / 1200w
 * Beide Erststufen liegen unter `lcpImageBytes` (19 438 B) der Startseite.
 */
export const HERO_STAGE = {
  desktop: {
    avif: `${heroDesktop1440Avif} 1440w, ${heroDesktop2400Avif} 2400w`,
  },
  mobile: {
    src: heroMobile800Webp,
    /** Erste AVIF-Stufe — `href` des mobilen Preloads (AP34, LCP unter Drosselung). */
    preloadHref: heroMobile800Avif,
    width: 800,
    height: 1800,
    avif: `${heroMobile800Avif} 800w, ${heroMobile1200Avif} 1200w`,
    webp: `${heroMobile800Webp} 800w, ${heroMobile1200Webp} 1200w`,
  },
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
