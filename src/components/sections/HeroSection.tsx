import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { preload } from 'react-dom'
import { useTranslation } from 'react-i18next'
import IglooProImage from '../../assets/home/Igloo-pro-frontal-320w.webp'
import { HERO_STAGE } from '../../assets/home/homeImages'
import { getHomepageSalesTarget } from '../../lib/homepageConversion'
import { Button } from '../ui/Button'

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
          className="absolute inset-x-0 bottom-0 -z-10 h-auto w-full lg:inset-0 lg:h-full lg:object-cover lg:object-[center_35%]"
        />
      </picture>

      <div className="mx-auto grid max-w-container gap-10 px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:min-h-[820px] lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-end lg:gap-16 lg:px-0 lg:pb-32 lg:pt-40">
        {/* min-w-0: ein langes H1-Wort (da „Laboratorieværdier.") darf die Spalte nicht aufblasen. */}
        <div className="flex min-w-0 flex-col items-start [container-type:inline-size]">
          <p className="enter inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/25 sm:text-sm">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent-line" />
            {t('hero.caption')}
          </p>
          <h1
            id="home-hero-title"
            className="hero-title enter mt-7 max-w-3xl font-semibold leading-[0.98] tracking-[-0.045em]"
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
          <p className="enter mt-7 max-w-xl text-pretty text-lg leading-relaxed text-white/85 sm:text-xl">
            {t('hero.description')}
          </p>

          <div className="enter mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
            <Button
              to={getHomepageSalesTarget('hero')}
              variant="light"
              data-cta-intent="GENERAL_SALES"
              data-cta-source="homepage"
              data-cta-journey="general_sales"
              data-cta-section="hero"
              className="group w-full !py-2.5 !pl-7 !pr-2.5 sm:w-auto"
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
              className="group w-full text-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-brand-deep sm:w-auto"
            >
              {t('hero.cta_secondary')}
              <ArrowRight
                className="h-4 w-4 transition group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Button>
          </div>
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
    </section>
  )
}

export default HeroSection
