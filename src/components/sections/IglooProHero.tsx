import { ArrowRight, Calculator } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import IglooProImage from '../../assets/Igloo-pro-frontal.webp'
import { Button } from '../ui/Button'
import { Breadcrumbs } from '../ui/Breadcrumbs'

/**
 * Claim-safe, SSR-first IglooPro product entry.
 *
 * The hero deliberately carries no specification or certification wall. The
 * real reader cutout is the only eager medium; intrinsic dimensions reserve
 * its layout on every viewport. Technical proof remains in the serial AP14
 * tasks that own its source verification.
 */
export default function IglooProHero() {
  const { t } = useTranslation(['products', 'common'])

  return (
    <section
      aria-labelledby="igloo-hero-title"
      data-igloo-hero
      className="relative overflow-hidden bg-slate-50"
    >
      <div
        aria-hidden="true"
        data-igloo-header-contrast
        className="absolute inset-x-0 top-0 h-20 bg-brand-deep"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-12 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-brand-deep/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-container gap-10 px-6 py-12 sm:px-8 sm:py-16 lg:min-h-[680px] lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-center lg:gap-16 lg:px-0 lg:py-20">
        <div className="flex min-w-0 flex-col items-start">
          <Breadcrumbs
            className="mb-6"
            items={[{ label: t('common:nav.home'), href: '/' }, { label: 'IglooPro' }]}
          />

          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-strong">
            {t('products:hero.caption')}
          </p>
          <h1
            id="igloo-hero-title"
            className="mt-5 max-w-4xl text-balance text-[clamp(2.4rem,5.5vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.04em] text-brand-deep"
          >
            {t('products:hero.title')}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
            {t('products:hero.description')}
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Button
              to="/contact"
              variant="secondary"
              data-cta-intent="GENERAL_SALES"
              className="w-full justify-center !bg-accent-strong !text-white hover:!brightness-110 focus-visible:!ring-accent sm:w-auto"
            >
              {t('products:hero.cta_order')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              to="/#roi-rechner"
              variant="ghost"
              data-igloo-hero-secondary
              className="w-full justify-center text-brand-deep hover:bg-white sm:w-auto"
            >
              <Calculator className="h-4 w-4" aria-hidden="true" />
              {t('products:hero.cta_secondary')}
            </Button>
          </div>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-600">
            {t('products:hero.subline')}
          </p>
        </div>

        <figure
          data-igloo-hero-visual
          className="relative order-last mx-auto aspect-square w-full max-w-[520px] self-center"
        >
          <div
            aria-hidden="true"
            className="absolute inset-[8%] rounded-full bg-white shadow-[0_32px_80px_-36px_rgba(15,23,42,0.42)]"
          />
          <img
            src={IglooProImage}
            alt={t('products:hero.visual.device_alt')}
            width={650}
            height={650}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="relative h-full w-full object-contain"
          />
          <figcaption className="sr-only">{t('products:hero.visual.context')}</figcaption>
        </figure>
      </div>
    </section>
  )
}
