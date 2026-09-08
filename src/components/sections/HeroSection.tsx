import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import IglooProImage from '../../assets/Igloo-pro-frontal.webp'
import { getHomepageSalesTarget } from '../../lib/homepageConversion'
import { Button } from '../ui/Button'

/**
 * Static, SSR-first Homepage Hero.
 *
 * The complete positioning and both next steps remain visible without client
 * JavaScript. One small product cutout is the only eager Hero medium; its
 * intrinsic dimensions reserve the layout and avoid carousel-driven LCP churn.
 */
const HeroSection = () => {
  const { t } = useTranslation('home')

  return (
    <section
      id="hero"
      aria-labelledby="home-hero-title"
      data-home-hero
      className="relative overflow-hidden bg-slate-50"
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-deep/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-container gap-10 px-6 py-12 sm:px-8 sm:py-16 lg:min-h-[680px] lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-center lg:gap-16 lg:px-0 lg:py-20">
        <div className="flex flex-col items-start">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-accent-strong">
            {t('hero.caption')}
          </p>
          <h1
            id="home-hero-title"
            className="max-w-4xl text-balance text-[clamp(2.4rem,5.5vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.04em] text-brand-deep"
          >
            {t('hero.title')}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
            {t('hero.description')}
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Button
              to={getHomepageSalesTarget('hero')}
              variant="secondary"
              data-cta-intent="GENERAL_SALES"
              data-cta-source="homepage"
              data-cta-journey="general_sales"
              data-cta-section="hero"
              className="w-full justify-center !bg-accent-strong !text-white hover:!brightness-110 focus-visible:!ring-accent sm:w-auto"
            >
              {t('hero.cta')}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              to="/diagnostics"
              variant="ghost"
              data-home-hero-secondary
              className="w-full justify-center text-brand-deep hover:bg-white sm:w-auto"
            >
              {t('hero.cta_secondary')}
            </Button>
          </div>
        </div>

        <div
          data-home-hero-visual
          className="relative order-last mx-auto aspect-square w-full max-w-[520px] self-center"
        >
          <div className="absolute inset-[8%] rounded-full bg-white shadow-[0_32px_80px_-36px_rgba(15,23,42,0.42)]" />
          <img
            src={IglooProImage}
            alt={t('hero.visual_alt')}
            width={650}
            height={650}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="relative h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
