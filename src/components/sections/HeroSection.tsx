import { lazy, Suspense, useEffect, useState, type CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { preload } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { HERO_CARD } from '../../assets/home/homeImages'
import { getNextHomeEvent } from '../../data/events'
import { isPanelsPromoActive } from '../../lib/shop'
import { Button } from '../ui/Button'
import { STAGE } from './heroStage'

// SC-020/SC-021: Folien 2/3 und Bedienung laden erst im Browser nach dem ersten Bild (eigener Chunk).
const HeroSlides = lazy(() => import('./HeroSlides'))
const HERO_SLIDES_DELAY_MS = 1500

/**
 * SSR-first Startseiten-Bühne (SC-021, Owner 2026-11-02 — Entwurf 13A-4, als Slider).
 *
 * Weißes Band auf der Papierseite („Hero, das sich abgrenzt"): Eyebrow, H1, ein Satz, ein
 * Knopf (SC-023, Owner 2026-11-03: „Angebot anfragen" aus Kopfzeile und Hero entfernt — es bleibt
 * „Infotermin buchen" → /contact, ohne Verkaufs-Attribution); rechts das saubere Praxisfoto als 16:10-Karte (`HERO_CARD`), dekorativ (`alt=""`),
 * das einzige Bild mit `fetchpriority="high"` und auf allen Viewports das LCP-Element.
 * Folie 1 ist dieses serverseitige Markup; 1,5 s nach dem Laden kommen Folie 2 (nächster Termin
 * mit Navy-Kachel) und Folie 3 (Panel-Aktion) als Overlay dazu (`HeroSlides`). Owner 2026-11-02
 * („die Bilder nacheinander gezeigt“): Folie 1 ist selbst eine Diashow — drei Motive (Probe,
 * Messung, Ergebnis) wechseln alle 4 s im Fotorahmen, die Zeitleiste darunter läuft mit; nach
 * dem dritten Motiv geht es zu Folie 2. Gibt es weder
 * Termin noch Aktion, bleibt die Bühne statisch — dann auch kein Platz für die Bedienung.
 *
 * DOM-Reihenfolge: Eyebrow → H1 → Satz → Knopf → Foto (mobil also die Aktion vor dem Bild).
 */

/**
 * Teilt den Titel in Sätze, damit jeder auf einer eigenen Zeile steht. Der Leerraum bleibt im
 * Span: der Textinhalt des H1 ist byte-gleich mit dem Locale-String (der e2e-Vertrag vergleicht ihn).
 */
const headlineLines = (title: string): string[] => {
  const parts = title.match(/[^.!?]+[.!?]+\s*/g)
  if (!parts || parts.join('') !== title || parts.length < 2) return [title]
  return parts
}

const HeroSection = () => {
  const { t } = useTranslation('home')
  const title = t('hero.title')
  const lines = headlineLines(title)
  // SC-013: laengste Zeile in Zeichen -> Schriftgroesse per CSS (`.hero-title`, index.css).
  const longestLine = Math.max(...lines.map((line) => line.trim().length))
  const hasSlides = Boolean(getNextHomeEvent()) || isPanelsPromoActive()
  const [active, setActive] = useState(0)
  // SC-021 Nachtrag: Folie 1 zeigt drei Motive nacheinander (Probe · Messung · Ergebnis).
  const [photo, setPhoto] = useState(0)
  const [slides, setSlides] = useState(false)
  const [controlsHost, setControlsHost] = useState<HTMLDivElement | null>(null)
  const [frameHost, setFrameHost] = useState<HTMLDivElement | null>(null)
  const [stepsHost, setStepsHost] = useState<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!hasSlides) return
    const id = window.setTimeout(() => setSlides(true), HERO_SLIDES_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [hasSlides])

  // Das Foto ist das LCP-Element; React 19 legt den Preload frueh in den <head> (vor die
  // modulepreloads), damit die Anfrage unter Drosselung zuerst startet.
  preload(HERO_CARD.preloadHref, {
    as: 'image',
    type: 'image/avif',
    imageSrcSet: HERO_CARD.avif,
    imageSizes: HERO_CARD.sizes,
    fetchPriority: 'high',
  })

  const hidden = active !== 0

  return (
    <section
      id="hero"
      aria-labelledby="home-hero-title"
      data-home-hero
      aria-roledescription={slides ? 'carousel' : undefined}
      // Owner 2026-11-02: „Hero, das sich abgrenzt" — weisses Band mit Haarlinie auf der Papierseite.
      className="relative border-b border-ui-border bg-white"
    >
      <div
        data-hero-slide="main"
        aria-hidden={hidden || undefined}
        inert={hidden || undefined}
        className={`${STAGE.grid} ${STAGE.fade} ${hidden ? 'opacity-0' : ''}`}
      >
        {/* min-w-0: ein langes H1-Wort (da „Laboratorieværdier.") darf die Spalte nicht aufblasen. */}
        <div className={STAGE.column}>
          <p className={STAGE.eyebrow}>{t('hero.caption')}</p>
          <h1
            id="home-hero-title"
            className={`${STAGE.title} hero-title`}
            style={{ '--hl': longestLine } as CSSProperties}
          >
            {lines.map((line, index) => (
              <span
                key={index}
                className={
                  index === lines.length - 1 && lines.length > 1 ? 'block text-accent' : 'block'
                }
              >
                {line}
              </span>
            ))}
          </h1>
          <p className={STAGE.lead}>{t('hero.description')}</p>

          <div className={STAGE.actions}>
            <Button to="/contact" variant="secondary" data-home-hero-cta className={STAGE.primary}>
              {t('hero.cta_secondary')}
              <ArrowRight
                className="h-4 w-4 transition group-hover:translate-x-1 motion-reduce:transform-none"
                aria-hidden="true"
              />
            </Button>
          </div>
          {/* SC-020: fester Platz fuer die Slider-Bedienung (HeroSlides setzt sie per Portal ein) */}
          {hasSlides && <div ref={setControlsHost} className="mt-7 h-11" />}
        </div>

        <div data-home-hero-visual className="w-full min-w-0 lg:justify-self-end">
          {/* Diashow-Rahmen: Bild 1 serverseitig (LCP); Bild 2/3, Bildzeile und Restzeit-Balken
              setzt HeroSlides per Portal in `frameHost` — kein Layoutsprung, die Hoehe steht. */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card bg-brand-deep shadow-card">
            <picture data-home-hero-photo>
              <source type="image/avif" srcSet={HERO_CARD.avif} sizes={HERO_CARD.sizes} />
              <img
                src={HERO_CARD.src}
                srcSet={HERO_CARD.webp}
                sizes={HERO_CARD.sizes}
                alt=""
                width={HERO_CARD.width}
                height={HERO_CARD.height}
                loading="eager"
                fetchPriority="high"
                className={`absolute inset-0 h-full w-full object-cover ${STAGE.fade} ${photo === 0 ? '' : 'opacity-0'}`}
              />
            </picture>
            <div ref={setFrameHost} className="absolute inset-0" />
          </div>
          {/* Zeitleiste der drei Schritte: fester Platz (kein Layoutsprung); HeroSlides setzt sie per
              Portal ein — so bleibt das Markup aus dem Hauptbuendel und dem Startseiten-HTML. */}
          {hasSlides && <div ref={setStepsHost} className="mt-5 h-11" />}
        </div>
      </div>
      {slides && (
        <Suspense fallback={null}>
          <HeroSlides
            active={active}
            onChange={setActive}
            photo={photo}
            onPhoto={setPhoto}
            stage={STAGE}
            host={controlsHost}
            frameHost={frameHost}
            stepsHost={stepsHost}
          />
        </Suspense>
      )}
    </section>
  )
}

export default HeroSection
