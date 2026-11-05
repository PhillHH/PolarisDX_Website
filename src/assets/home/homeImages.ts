/**
 * Relaunch 2026-10-15 (SC-001) — Bildwelt der Startseite.
 *
 * Fotografie dort, wo sie traegt — nicht als Tapete. Seit SC-005 (2026-10-16,
 * Owner: „Agentur-Niveau, lockerer Mix, nicht zu viele Fotos") zeigt die
 * Startseite genau zwei generierte Fotos: die Editorial-Buehne (AP34 / SC-002)
 * und ein Detailfoto im Fachbereich-Modul. Alles andere sind Produkt-Render,
 * ein echter Musterbefund, eine Parameter-Tafel, das echte Portraet der
 * Praxisreferenz und ein Artikelfoto. Quelle der Fotos seit 2026-10-16:
 * KI-generierte Praxisszenen (Google Gemini, `assets-src/photos/`, Prompts in
 * PROMPTS.md; Bildnachweis Impressum §8). Zuschnitte und Varianten erzeugt
 * `scripts/build-photo-look.mjs`, nicht per Hotlink — `img-src 'self'` bleibt
 * unberuehrt.
 *
 * Breiten sind aus der Darstellung abgeleitet (CSS-Breite × DPR 1–2), damit
 * das Perf-Budget (`oversizedImages`, `imageBytes` der Startseite) haelt:
 *   - Detailfoto Fachbereich-Modul: bis ~520 px CSS → 480w/960w, 4:5
 *   - Fotokarte der Buehne: siehe HERO_CARD (SC-021)
 */
import type { ArticleImageAsset } from '../articleImages'

import detail480Avif from './detail-capillary-480w.avif'
import detail480Webp from './detail-capillary-480w.webp'
import detail960Avif from './detail-capillary-960w.avif'
import detail960Webp from './detail-capillary-960w.webp'
import heroCard480Avif from './hero-card-480w.avif'
import heroCard480Webp from './hero-card-480w.webp'
import heroCard800Avif from './hero-card-800w.avif'
import heroCard800Webp from './hero-card-800w.webp'
import heroCard1280Avif from './hero-card-1280w.avif'
import heroCard1280Webp from './hero-card-1280w.webp'
import heroCapillary480Avif from './hero-card-capillary-480w.avif'
import heroCapillary480Webp from './hero-card-capillary-480w.webp'
import heroCapillary800Avif from './hero-card-capillary-800w.avif'
import heroCapillary800Webp from './hero-card-capillary-800w.webp'
import heroCapillary1280Avif from './hero-card-capillary-1280w.avif'
import heroCapillary1280Webp from './hero-card-capillary-1280w.webp'
import heroDevice480Avif from './hero-card-device-480w.avif'
import heroDevice480Webp from './hero-card-device-480w.webp'
import heroDevice800Avif from './hero-card-device-800w.avif'
import heroDevice800Webp from './hero-card-device-800w.webp'
import heroDevice1280Avif from './hero-card-device-1280w.avif'
import heroDevice1280Webp from './hero-card-device-1280w.webp'
import eventBand480Avif from './event-band-480w.avif'
import eventBand480Webp from './event-band-480w.webp'
import eventBand960Avif from './event-band-960w.avif'
import eventBand960Webp from './event-band-960w.webp'
import eventHall480Avif from './event-hall-480w.avif'
import eventHall480Webp from './event-hall-480w.webp'
import eventHall800Avif from './event-hall-800w.avif'
import eventHall800Webp from './event-hall-800w.webp'
import eventHall1280Avif from './event-hall-1280w.avif'
import eventHall1280Webp from './event-hall-1280w.webp'
import sample480Avif from './pillar-sample-480w.avif'
import sample480Webp from './pillar-sample-480w.webp'
import sample800Avif from './pillar-sample-800w.avif'
import sample800Webp from './pillar-sample-800w.webp'
import sample1280Avif from './pillar-sample-1280w.avif'
import sample1280Webp from './pillar-sample-1280w.webp'
import reader480Avif from './igloo-reader-480w.avif'
import reader480Webp from './igloo-reader-480w.webp'
import reader800Avif from './igloo-reader-800w.avif'
import reader800Webp from './igloo-reader-800w.webp'

/** Detailfoto des Fachbereich-Moduls — 4:5, 480w fuer DPR 1, 960w fuer DPR 2 und Telefone. */
export const DETAIL_IMAGE: ArticleImageAsset = {
  src: detail960Webp,
  width: 960,
  height: 1200,
  variants: [
    { width: 480, avif: detail480Avif, webp: detail480Webp },
    { width: 960, avif: detail960Avif, webp: detail960Webp },
  ],
}

/**
 * Fotokarte der Startseiten-Bühne (SC-021, Kopfzeile 13A-4 — Owner 2026-11-02).
 *
 * Das saubere Praxisfoto als 16:10-Karte neben dem Text, ohne eingebackenen Verlauf.
 * Breiten aus der Darstellung: Desktop 560 px CSS (480w DPR 1 / 1280w DPR 2), Telefon volle
 * Breite (480w / 800w). Die 800w-AVIF-Stufe bleibt unter `lcpImageBytes` (19 438 B).
 */
/** Messe-Band (SC-021 Nachtrag): 12:5-Foto, 420 px CSS ab lg (480w / 960w), lazy. */
export const EVENT_BAND = {
  src: eventBand960Webp,
  width: 960,
  height: 400,
  sizes: '(min-width: 1024px) 420px, calc(100vw - 2rem)',
  avif: `${eventBand480Avif} 480w, ${eventBand960Avif} 960w`,
  webp: `${eventBand480Webp} 480w, ${eventBand960Webp} 960w`,
} as const

/**
 * Diashow der Folie 1 (SC-021 Nachtrag, Owner 2026-11-02 „die Bilder nacheinander gezeigt"):
 * Reihenfolge Probe (Kapillarblut, `HERO_CARD`, SSR/LCP) → Messung (IglooPro auf dem Tresen) →
 * Ergebnis (Praxis); Bild 2/3 laden nur im Browser mit dem Slider-Chunk.
 */
export const HERO_SHOW = [
  {
    src: heroDevice1280Webp,
    avif: `${heroDevice480Avif} 480w, ${heroDevice800Avif} 800w, ${heroDevice1280Avif} 1280w`,
    webp: `${heroDevice480Webp} 480w, ${heroDevice800Webp} 800w, ${heroDevice1280Webp} 1280w`,
  },
  {
    src: heroCard1280Webp,
    avif: `${heroCard480Avif} 480w, ${heroCard800Avif} 800w, ${heroCard1280Avif} 1280w`,
    webp: `${heroCard480Webp} 480w, ${heroCard800Webp} 800w, ${heroCard1280Webp} 1280w`,
  },
] as const

/** MEDICA-Folie der Buehne (SC-021 Nachtrag 3): Messehalle mit PolarisDX-Stand, 16:10, lazy. */
export const HERO_EVENT = {
  src: eventHall1280Webp,
  width: 1280,
  height: 800,
  avif: `${eventHall480Avif} 480w, ${eventHall800Avif} 800w, ${eventHall1280Avif} 1280w`,
  webp: `${eventHall480Webp} 480w, ${eventHall800Webp} 800w, ${eventHall1280Webp} 1280w`,
} as const

/**
 * Säulen-Sektion (SC-021 Nachtrag 8, Entwurf A2-3): IglooPro-Render mit Display und Kassette (transparent,
 * 1:1), Praxisfoto (= Bild 3 der Diashow) und Probenentnahme — alle lazy, unter dem Falz.
 */
export const PILLAR_READER = {
  src: reader800Webp,
  width: 800,
  height: 800,
  sizes: '(min-width: 1024px) 440px, 70vw',
  avif: `${reader480Avif} 480w, ${reader800Avif} 800w`,
  webp: `${reader480Webp} 480w, ${reader800Webp} 800w`,
} as const

export const PILLAR_PRAXIS = {
  src: heroCard1280Webp,
  width: 1280,
  height: 800,
  sizes: '(min-width: 768px) 50vw, 100vw',
  avif: `${heroCard480Avif} 480w, ${heroCard800Avif} 800w, ${heroCard1280Avif} 1280w`,
  webp: `${heroCard480Webp} 480w, ${heroCard800Webp} 800w, ${heroCard1280Webp} 1280w`,
} as const

export const PILLAR_SAMPLE = {
  src: sample1280Webp,
  width: 1280,
  height: 800,
  sizes: '(min-width: 768px) 50vw, 100vw',
  avif: `${sample480Avif} 480w, ${sample800Avif} 800w, ${sample1280Avif} 1280w`,
  webp: `${sample480Webp} 480w, ${sample800Webp} 800w, ${sample1280Webp} 1280w`,
} as const

export const HERO_CARD = {
  // Bild 1 = Schritt „Probe" (Kapillarblut): serverseitig, LCP. Praxisfoto und Geraet folgen (HERO_SHOW).
  src: heroCapillary1280Webp,
  width: 1280,
  height: 800,
  /** Erste mobile AVIF-Stufe fuer DPR 2 — `href` des Preloads (LCP unter Drosselung). */
  preloadHref: heroCapillary800Avif,
  sizes: '(min-width: 1024px) 560px, calc(100vw - 2rem)',
  avif: `${heroCapillary480Avif} 480w, ${heroCapillary800Avif} 800w, ${heroCapillary1280Avif} 1280w`,
  webp: `${heroCapillary480Webp} 480w, ${heroCapillary800Webp} 800w, ${heroCapillary1280Webp} 1280w`,
} as const
