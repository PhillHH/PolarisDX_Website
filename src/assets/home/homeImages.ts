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
export const HERO_CARD = {
  src: heroCard1280Webp,
  width: 1280,
  height: 800,
  /** Erste mobile AVIF-Stufe fuer DPR 2 — `href` des Preloads (LCP unter Drosselung). */
  preloadHref: heroCard800Avif,
  sizes: '(min-width: 1024px) 560px, calc(100vw - 2rem)',
  avif: `${heroCard480Avif} 480w, ${heroCard800Avif} 800w, ${heroCard1280Avif} 1280w`,
  webp: `${heroCard480Webp} 480w, ${heroCard800Webp} 800w, ${heroCard1280Webp} 1280w`,
} as const
