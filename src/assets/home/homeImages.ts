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
 *   - Buehne: siehe HERO_STAGE
 */
import type { ArticleImageAsset } from '../articleImages'

import detail480Avif from './detail-capillary-480w.avif'
import detail480Webp from './detail-capillary-480w.webp'
import detail960Avif from './detail-capillary-960w.avif'
import detail960Webp from './detail-capillary-960w.webp'
import heroDesktop1440Avif from './hero-desktop-1440w.avif'
import heroDesktop2400Avif from './hero-desktop-2400w.avif'
import heroMobile800Avif from './hero-mobile-800w.avif'
import heroMobile800Webp from './hero-mobile-800w.webp'
import heroMobile1200Avif from './hero-mobile-1200w.avif'
import heroMobile1200Webp from './hero-mobile-1200w.webp'

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
 * Editorial-Buehne der Startseite (AP34 / SC-002) — art-directed.
 *
 * Ein Praxisfoto, Navy-Verlauf und Punktring des Signets sind IN die Datei
 * eingebacken: die Textseite ist nahezu flaches Navy und kostet kaum Bytes.
 *   - Desktop 2:1, ab 1024 px, nur AVIF: 1440w / 2400w fuer DPR 2
 *   - Mobil 4:9, Motiv unten im Bild: 800w / 1200w
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
