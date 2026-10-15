import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ArticleImageAsset } from '../../assets/articleImages'
import { HERO_TILE_IMAGES } from '../../assets/home/homeImages'
import IglooProImage from '../../assets/Igloo-pro-frontal.webp'
import { getHomepageSalesTarget } from '../../lib/homepageConversion'
import { Button } from '../ui/Button'
import { ResponsivePicture } from '../ui/ResponsivePicture'

/**
 * Static, SSR-first Homepage Hero.
 *
 * The complete positioning and both next steps remain visible without client
 * JavaScript. One small product cutout is the only eager Hero medium; its
 * intrinsic dimensions reserve the layout and avoid carousel-driven LCP churn.
 *
 * Relaunch 2026-10-15 (SC-001): the product cutout sits inside a photo mosaic
 * (four practice/lab motifs, decorative `alt=""`, lazy AVIF/WebP at 240/480 px).
 * The product image keeps its 650×650 eager/high-priority contract and is the
 * only eager image on the page.
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

type TileProps = {
  image: ArticleImageAsset
  label: string
  className?: string
}

const Tile = ({ image, label, className = '' }: TileProps) => (
  <div className={className ? `home-tile ${className}` : 'home-tile'}>
    <ResponsivePicture
      image={image}
      alt=""
      lean
      sizes="(min-width:1024px) 180px,30vw"
      className="h-full w-full object-cover"
    />
    <span className="home-tile-label">{label}</span>
  </div>
)

const HeroSection = () => {
  const { t } = useTranslation('home')
  const title = t('hero.title')
  const lines = headlineLines(title)

  return (
    <section
      id="hero"
      aria-labelledby="home-hero-title"
      data-home-hero
      className="relative overflow-hidden bg-paper"
    >
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-deep/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-container gap-12 px-4 pb-10 pt-28 sm:px-6 sm:pt-32 lg:min-h-[720px] lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:items-center lg:gap-16 lg:px-0 lg:pb-16 lg:pt-36">
        <div className="flex flex-col items-start">
          <p className="inline-flex items-center gap-2 rounded-full border border-paper-line bg-white px-3.5 py-1.5 text-sm font-semibold text-heading">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />
            {t('hero.caption')}
          </p>
          <h1
            id="home-hero-title"
            className="mt-7 max-w-3xl text-[clamp(2.75rem,7vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-heading"
          >
            {lines.map((line, index) => (
              <span
                key={index}
                className={
                  index === lines.length - 1 && lines.length > 1
                    ? 'block text-accent-strong'
                    : 'block'
                }
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-gray-700 sm:text-xl">
            {t('hero.description')}
          </p>

          <div className="mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
            <Button
              to={getHomepageSalesTarget('hero')}
              variant="secondary"
              data-cta-intent="GENERAL_SALES"
              data-cta-source="homepage"
              data-cta-journey="general_sales"
              data-cta-section="hero"
              className="w-full justify-center !py-2.5 !pl-7 !pr-2.5 shadow-card sm:w-auto"
            >
              {t('hero.cta')}
              <span
                aria-hidden="true"
                className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white"
              >
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
            <Button
              to="/diagnostics"
              variant="ghost"
              data-home-hero-secondary
              className="w-full justify-center sm:w-auto"
            >
              {t('hero.cta_secondary')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Mosaik: Produkt (2 Spalten, damit das 650-px-Bild nie "oversized" ist)
            und vier Praxis-/Labor-Motive. Spalte 1 und 3 sitzen 16 px tiefer. */}
        <div
          data-home-hero-visual
          className="relative order-last mx-auto grid w-full max-w-[560px] grid-cols-3 gap-3 self-center pb-4 sm:gap-4"
        >
          <div className="relative col-span-2 flex aspect-[16/10] items-center justify-center overflow-hidden rounded-card bg-white shadow-card">
            <div className="pointer-events-none absolute inset-0 bg-paper-deep/60" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[82%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            <img
              src={IglooProImage}
              alt={t('hero.visual_alt')}
              width={650}
              height={650}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="relative h-full max-h-full w-full object-contain p-4 sm:p-6"
            />
            <span className="absolute left-2 top-2 rounded-lg bg-accent-strong px-2 py-1 text-[10px] font-semibold uppercase leading-tight tracking-[0.08em] text-white sm:text-[11px]">
              {t('business_pillars.pillars.igloo.title')}
            </span>
          </div>
          <Tile
            image={HERO_TILE_IMAGES.dental}
            label={t('segments.dental.title')}
            className="!aspect-auto h-full translate-y-4"
          />
          <Tile
            image={HERO_TILE_IMAGES.beauty}
            label={t('segments.beauty.title')}
            className="translate-y-4"
          />
          <Tile image={HERO_TILE_IMAGES.longevity} label={t('segments.longevity.title')} />
          <Tile
            image={HERO_TILE_IMAGES.epigenetics}
            label={t('business_pillars.pillars.epigenetics.title')}
            className="translate-y-4"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
