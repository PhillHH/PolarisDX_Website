import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import IglooProImage from '../../assets/Igloo-pro-frontal.webp'
import { diagnosticsGeneralSalesTarget } from '../../data/diagnosticsHub'
import { Breadcrumbs } from '../ui/Breadcrumbs'
import { Button } from '../ui/Button'
import Eyebrow from '../ui/Eyebrow'

/**
 * Registry-backed, SSR-first Diagnostics entry surface.
 * One real, dimensioned WebP is the sole Hero media candidate; there is no
 * carousel, direct tracking call or duplicated service/detail content.
 */
const DiagnosticsHero = () => {
  const { t } = useTranslation(['common', 'services'])
  const trustSignals = [
    t('services:overview.hero.entry.trust.services'),
    t('services:overview.hero.entry.trust.audience'),
    t('services:overview.hero.entry.trust.context'),
  ]

  return (
    <section
      aria-labelledby="diagnostics-hero-title"
      data-diagnostics-hero
      className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
    >
      <div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-container gap-10 px-4 pb-16 pt-24 md:pt-44 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-center lg:px-0 lg:pb-20 lg:pt-28">
        <div className="min-w-0">
          <Breadcrumbs
            className="mb-7"
            ariaLabel={t('services:overview.hero.entry.breadcrumb_label')}
            items={[
              { label: t('common:nav.home', 'Home'), href: '/' },
              { label: t('services:overview.hero.title', 'Diagnostik') },
            ]}
          />

          <Eyebrow>{t('services:overview.hero.entry.eyebrow')}</Eyebrow>
          <h1
            id="diagnostics-hero-title"
            className="mt-4 max-w-3xl text-balance text-[clamp(2.35rem,5vw,4.25rem)] font-medium leading-[1.04] tracking-[-0.035em] text-brand-deep"
          >
            {t('services:overview.hero.entry.title')}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-text-secondary sm:text-lg">
            {t('services:overview.hero.entry.description')}
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Button
              to={diagnosticsGeneralSalesTarget}
              variant="secondary"
              data-cta-intent="GENERAL_SALES"
              data-cta-source="diagnostics"
              data-cta-journey="general_sales"
              data-cta-section="hero"
              className="w-full justify-center !bg-accent-strong !text-white hover:!brightness-110 focus-visible:!ring-accent sm:w-auto"
            >
              {t('services:overview.hero.entry.primary_cta')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              href="#diagnostics-services"
              variant="ghost"
              data-diagnostics-secondary-entry
              className="w-full justify-center border border-slate-300 bg-white text-brand-deep hover:bg-slate-100 sm:w-auto"
            >
              {t('services:overview.hero.entry.secondary_cta')}
            </Button>
          </div>

          <aside
            aria-label={t('services:overview.hero.entry.trust_label')}
            data-diagnostics-hero-trust
            className="mt-9 border-t border-slate-200 pt-6"
          >
            <p className="text-sm font-semibold text-heading">
              {t('services:overview.hero.entry.trust_label')}
            </p>
            <ul className="mt-3 grid gap-3 text-sm leading-6 text-gray-700 sm:grid-cols-3">
              {trustSignals.map((signal) => (
                <li key={signal} className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-1 h-4 w-4 shrink-0 text-accent-strong"
                    aria-hidden="true"
                  />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <figure
          data-diagnostics-hero-visual
          className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8"
        >
          <div
            className="absolute inset-x-12 top-10 aspect-square rounded-full bg-accent/10"
            aria-hidden="true"
          />
          <img
            src={IglooProImage}
            alt={t('services:overview.hero.entry.visual.alt')}
            width={650}
            height={650}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="relative mx-auto aspect-square h-auto w-full max-w-[390px] object-contain"
          />
          <figcaption className="relative mt-3 rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
              {t('services:overview.hero.entry.visual.eyebrow')}
            </p>
            <p className="mt-2 text-lg font-medium text-heading">
              {t('services:overview.hero.entry.visual.title')}
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              {t('services:overview.hero.entry.visual.text')}
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

export default DiagnosticsHero
