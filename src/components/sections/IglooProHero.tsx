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

  // AP34 PT34.2e (SC-003): Produkt-Buehne auf Navy — das Geraet mit Halo ist
  // das einzige Vorrang-Bild (LCP, 650×650), Text steht davor.
  // SC-006 (Editorial Motion): `aurora` auf der Section, `enter` staffelt die
  // Textspalte (Pfad ohne Eintritt); Geraet und Halo bleiben ruhig (LCP-Bild).
  return (
    <section
      aria-labelledby="igloo-hero-title"
      data-igloo-hero
      className="aurora bg-brand-deep text-white"
    >
      <div className="mx-auto grid max-w-container gap-10 px-4 pb-16 pt-28 sm:px-6 lg:min-h-[680px] lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-0 lg:pb-20 lg:pt-32">
        <div className="flex min-w-0 flex-col items-start">
          <Breadcrumbs
            variant="dark"
            className="mb-8"
            items={[{ label: t('common:nav.home'), href: '/' }, { label: 'IglooPro' }]}
          />

          <p className="enter inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold ring-1 ring-inset ring-white/25">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-accent-line" />
            {t('products:hero.caption')}
          </p>
          <h1 id="igloo-hero-title" className="enter mt-6 max-w-4xl t-stage-h1">
            {t('products:hero.title')}
          </h1>
          <p className="enter mt-6 max-w-[60ch] text-pretty text-lg leading-relaxed text-white/85">
            {t('products:hero.description')}
          </p>

          <div className="enter mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
            <Button
              to="/contact"
              variant="light"
              data-cta-intent="GENERAL_SALES"
              className="group w-full justify-between !py-2.5 !pl-7 !pr-2.5 shadow-card sm:w-auto"
            >
              {t('products:hero.cta_order')}
              <span
                aria-hidden="true"
                className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white transition group-hover:translate-x-1"
              >
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
            <Button
              to="/#roi-rechner"
              variant="ghost"
              data-igloo-hero-secondary
              className="w-full justify-center !text-white ring-1 ring-inset ring-white/25 hover:!bg-white/10 focus-visible:!ring-white focus-visible:!ring-offset-brand-deep sm:w-auto"
            >
              <Calculator className="h-4 w-4" aria-hidden="true" />
              {t('products:hero.cta_secondary')}
            </Button>
          </div>

          <p className="enter mt-5 max-w-xl text-sm leading-relaxed text-white/70">
            {t('products:hero.subline')}
          </p>
        </div>

        <figure
          data-igloo-hero-visual
          className="relative order-last mx-auto aspect-square w-full max-w-[520px] self-center"
        >
          <div
            aria-hidden="true"
            className="absolute inset-[8%] rounded-full bg-white/5 ring-1 ring-white/15"
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
