import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { preload } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { HERO_CARD } from '../../assets/home/homeImages'
import { getHomepageSalesTarget } from '../../lib/homepageConversion'
import { Button } from '../ui/Button'

/**
 * Statische, SSR-first Startseiten-Bühne (SC-021, Owner 2026-11-02 — Entwurf 13A-4).
 *
 * Papierfläche statt Navy-Bühne: Eyebrow, H1, ein Satz, zwei Knöpfe; rechts das saubere
 * Praxisfoto als 16:10-Karte (`HERO_CARD`), dekorativ (`alt=""`), das einzige Bild mit
 * `fetchpriority="high"` und auf allen Viewports das LCP-Element. Der Slider mit Termin- und
 * Panel-Folie (SC-020) entfällt: der Termin steht jetzt dauerhaft in der Messe-Zeile der
 * Kopfzeile, die Shops stehen als Zellen im Kopfzeilenraster.
 *
 * DOM-Reihenfolge: Eyebrow → H1 → Satz → Knöpfe → Foto (mobil also beide Aktionen vor dem Bild).
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

  // Das Foto ist das LCP-Element; React 19 legt den Preload frueh in den <head> (vor die
  // modulepreloads), damit die Anfrage unter Drosselung zuerst startet.
  preload(HERO_CARD.preloadHref, {
    as: 'image',
    type: 'image/avif',
    imageSrcSet: HERO_CARD.avif,
    imageSizes: HERO_CARD.sizes,
    fetchPriority: 'high',
  })

  return (
    <section id="hero" aria-labelledby="home-hero-title" data-home-hero className="bg-paper">
      {/* `pt-page-top` raeumt die fixierte Kopfzeile frei (DESIGN-SYSTEM-CONTRACT §6.11/§7.1). */}
      <div className="mx-auto grid max-w-container gap-10 px-4 pb-16 pt-page-top sm:px-6 lg:min-h-[600px] lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,1fr)] lg:items-center lg:gap-14 lg:px-0 lg:pb-20 xl:pt-page-top-xl">
        {/* min-w-0: ein langes H1-Wort (da „Laboratorieværdier.") darf die Spalte nicht aufblasen. */}
        <div className="flex min-w-0 flex-col items-start [container-type:inline-size]">
          <p className="t-eyebrow enter">{t('hero.caption')}</p>
          <h1
            id="home-hero-title"
            className="enter hero-title mt-5 font-semibold leading-[0.98] tracking-[-0.045em] text-heading"
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
          <p className="t-lead enter mt-6 max-w-xl text-pretty">{t('hero.description')}</p>

          <div className="enter mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Button
              to={getHomepageSalesTarget('hero')}
              variant="secondary"
              data-cta-intent="GENERAL_SALES"
              data-cta-source="homepage"
              data-cta-journey="general_sales"
              data-cta-section="hero"
              className="group w-full sm:w-auto"
            >
              {t('hero.cta')}
              <ArrowRight
                className="h-4 w-4 transition group-hover:translate-x-1 motion-reduce:transform-none"
                aria-hidden="true"
              />
            </Button>
            {/* Outline-Pille (DESIGN-SYSTEM-CONTRACT §3.4): Rahmen ist Dekor, erkannt wird die Flaeche. */}
            <Button
              to="/contact"
              variant="ghost"
              data-home-hero-secondary
              className="w-full border border-slate-300 bg-white hover:border-brand-primary sm:w-auto"
            >
              {t('hero.cta_secondary')}
            </Button>
          </div>
        </div>

        <div data-home-hero-visual className="w-full lg:justify-self-end">
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
              className="aspect-[16/10] w-full rounded-card object-cover shadow-card"
            />
          </picture>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
