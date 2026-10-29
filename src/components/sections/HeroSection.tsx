import { lazy, Suspense, useEffect, useState, type CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { preload } from 'react-dom'
import { useTranslation } from 'react-i18next'
import IglooProImage from '../../assets/home/Igloo-pro-frontal-320w.webp'
import { HERO_STAGE } from '../../assets/home/homeImages'
import { getNextHomeEvent } from '../../data/events'
import { isPanelsPromoActive } from '../../lib/shop'
import { getHomepageSalesTarget } from '../../lib/homepageConversion'
import { Button } from '../ui/Button'
import { STAGE } from './heroStage'

// SC-020: Folien 2/3 und Bedienung laden erst im Browser nach dem ersten Bild (eigener Chunk).
const HeroSlides = lazy(() => import('./HeroSlides'))
const HERO_SLIDES_DELAY_MS = 1500

/**
 * Static, SSR-first Homepage Hero — „Editorial" (AP34 / SC-002).
 *
 * The complete positioning and both next steps remain visible without client
 * JavaScript. The stage is one art-directed practice photograph with the navy
 * gradient and the PolarisDX dot ring baked into the file (desktop 2:1,
 * mobile 4:9). It is decorative (`alt=""`), the only `fetchpriority="high"`
 * image and the LCP element on every viewport; both crops stay below the
 * `lcpImageBytes` budget because the gradient side compresses to almost nothing.
 *
 * The IglooPro product keeps its locale-aware alt text in a white card after
 * both actions (DOM order caption → H1 → benefit → CTAs → visual). It is a
 * 320-px cutout, lazy, because the card sits below the fold on phones.
 */

/**
 * Splits the headline into sentences so each one can sit on its own line.
 * The trailing whitespace stays inside the span: the text content of the H1 is
 * therefore byte-identical to the locale string (the e2e contract compares it).
 */
const headlineLines = (title: string): string[] => {
  const parts = title.match(/[^.!?]+[.!?]+\s*/g)
  if (!parts || parts.join('') !== title || parts.length < 2) return [title]
  return parts
}

const DESKTOP_MEDIA = '(min-width: 1024px)'

const HeroSection = () => {
  const { t } = useTranslation('home')
  const title = t('hero.title')
  const lines = headlineLines(title)
  // SC-013: laengste Zeile in Zeichen -> Schriftgroesse per CSS (`.hero-title`, index.css).
  const longestLine = Math.max(...lines.map((line) => line.trim().length))
  const { desktop, mobile } = HERO_STAGE
  // SC-020 (Owner 2026-10-27): Slider. Folie 1 ist dieses serverseitige Markup (H1, LCP-Foto);
  // weitere Folien kommen nach dem ersten Bild als Overlay dazu. Gibt es weder Termin noch
  // Panel-Aktion, bleibt die Buehne statisch — dann auch kein Platzhalter fuer die Bedienung.
  const hasSlides = Boolean(getNextHomeEvent()) || isPanelsPromoActive()
  const [active, setActive] = useState(0)
  const [slides, setSlides] = useState(false)
  const [controlsHost, setControlsHost] = useState<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!hasSlides) return
    const id = window.setTimeout(() => setSlides(true), HERO_SLIDES_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [hasSlides])

  // Telefone: das Buehnenfoto ist dort das LCP-Element und konkurriert unter
  // Drosselung mit dem JS um Bandbreite. React 19 legt diesen Preload frueh in
  // den <head> (vor die modulepreloads), damit die Anfrage zuerst startet. Ein
  // <img> in <picture> leitet React nicht selbst ab. Desktop braucht ihn nicht
  // (LCP dort ~0,2 s ungedrosselt) — das spart HTML-Bytes.
  preload(mobile.preloadHref, {
    as: 'image',
    type: 'image/avif',
    imageSrcSet: mobile.avif,
    imageSizes: '100vw',
    media: '(max-width: 1023px)',
    fetchPriority: 'high',
  })

  return (
    <section
      id="hero"
      aria-labelledby="home-hero-title"
      data-home-hero
      aria-roledescription={slides ? 'carousel' : undefined}
      className="aurora bg-brand-deep text-white"
    >
      {/* Ohne `sizes`: bei w-Deskriptoren ist 100vw der Standard. Desktop nur AVIF
          (alle aktuellen Browser); aeltere fallen auf die mobile WebP-Datei des
          <img> zurueck. Beides haelt das htmlBytes-Budget der Startseite. */}
      <picture data-home-hero-photo>
        <source type="image/avif" media={DESKTOP_MEDIA} srcSet={desktop.avif} />
        <source type="image/avif" srcSet={mobile.avif} />
        <img
          src={mobile.src}
          srcSet={mobile.webp}
          alt=""
          width={mobile.width}
          height={mobile.height}
          loading="eager"
          fetchPriority="high"
          className={`absolute inset-x-0 bottom-0 -z-10 h-auto w-full lg:inset-0 lg:h-full lg:object-cover lg:object-[center_35%] ${STAGE.fade} ${active === 0 ? '' : 'opacity-0'}`}
        />
      </picture>

      <div
        data-hero-slide="main"
        aria-hidden={active !== 0 || undefined}
        inert={active !== 0 || undefined}
        className={`${STAGE.grid} ${STAGE.fade} ${active === 0 ? '' : 'opacity-0'}`}
      >
        {/* min-w-0: ein langes H1-Wort (da „Laboratorieværdier.") darf die Spalte nicht aufblasen. */}
        <div className={`${STAGE.column} [container-type:inline-size]`}>
          <p className={STAGE.eyebrow}>
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent-line" />
            {t('hero.caption')}
          </p>
          <h1
            id="home-hero-title"
            className={`${STAGE.title} hero-title max-w-3xl`}
            style={{ '--hl': longestLine } as CSSProperties}
          >
            {lines.map((line, index) => (
              <span
                key={index}
                className={
                  index === lines.length - 1 && lines.length > 1
                    ? 'block text-accent-on-dark'
                    : 'block'
                }
              >
                {line}
              </span>
            ))}
          </h1>
          <p className={STAGE.lead}>{t('hero.description')}</p>

          <div className={STAGE.actions}>
            <Button
              to={getHomepageSalesTarget('hero')}
              variant="light"
              data-cta-intent="GENERAL_SALES"
              data-cta-source="homepage"
              data-cta-journey="general_sales"
              data-cta-section="hero"
              className={`${STAGE.primary} !py-2.5 !pl-7 !pr-2.5`}
            >
              {t('hero.cta')}
              <span
                aria-hidden="true"
                className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white transition group-hover:translate-x-1"
              >
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
            <Button
              to="/diagnostics"
              variant="ghost"
              data-home-hero-secondary
              className={STAGE.ghost}
            >
              {t('hero.cta_secondary')}
              <ArrowRight
                className="h-4 w-4 transition group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Button>
          </div>
          {/* SC-020: fester Platz fuer die Slider-Bedienung (HeroSlides setzt sie per Portal ein) */}
          {hasSlides && <div ref={setControlsHost} className="mt-7 h-11" />}
        </div>

        {/* Produktkarte: auf Telefonen nach einem Fotofenster, damit der Arzt im
            Bild sichtbar bleibt; ab lg unten rechts auf der Buehne. Mobil sitzt
            das Foto in natuerlicher Hoehe am unteren Rand (oben flaches Navy),
            damit die Texte nie auf hellem Bildgrund stehen. */}
        <div
          data-home-hero-visual
          className="mt-64 w-full max-w-md sm:mt-72 lg:mt-0 lg:justify-self-end"
        >
          <div className="flex items-center gap-5 rounded-card bg-white p-4 text-heading shadow-card sm:p-6">
            <img
              src={IglooProImage}
              alt={t('hero.visual_alt')}
              width={320}
              height={320}
              loading="lazy"
              className="h-auto w-20 shrink-0 object-contain sm:w-32"
            />
            <div className="min-w-0">
              <p className="t-eyebrow">{t('business_pillars.pillars.igloo.title')}</p>
              <p className="mt-2 text-sm font-semibold leading-snug tracking-tight sm:text-base">
                {t('business_pillars.pillars.igloo.text')}
              </p>
            </div>
          </div>
        </div>
      </div>
      {slides && (
        <Suspense fallback={null}>
          <HeroSlides active={active} onChange={setActive} stage={STAGE} host={controlsHost} />
        </Suspense>
      )}
    </section>
  )
}

export default HeroSection
