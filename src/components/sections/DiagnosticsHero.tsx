import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import IglooProImage from '../../assets/Igloo-pro-frontal.webp'
import { diagnosticsGeneralSalesTarget } from '../../data/diagnosticsHub'
import { Breadcrumbs } from '../ui/Breadcrumbs'
import { Button } from '../ui/Button'

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

  // AP34 PT34.2d (SC-003): Editorial-Buehne wie auf der Startseite — Navy-Flaeche,
  // weisse Pille, Produktkarte rechts. Das IglooPro-Bild bleibt das einzige
  // Vorrang-Bild (Desktop-LCP, 650×650); mobil steht es nach den Aktionen.
  // SC-006 (Editorial Motion): `aurora` legt den driftenden Lichtschein auf die
  // Section, `enter` staffelt die Textspalte (der Pfad bleibt ohne Eintritt); die
  // Produktkarte traegt keinen Eintritt (LCP-Bild). Der Pfeilkreis antwortet auf
  // `group`-Hover wie auf der Startseite.
  return (
    <section
      aria-labelledby="diagnostics-hero-title"
      data-diagnostics-hero
      className="aurora bg-brand-deep text-white"
    >
      <div className="mx-auto grid max-w-container gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-0 lg:pb-20 lg:pt-32">
        <div className="min-w-0">
          <Breadcrumbs
            variant="dark"
            className="mb-8"
            ariaLabel={t('services:overview.hero.entry.breadcrumb_label')}
            items={[
              { label: t('common:nav.home', 'Home'), href: '/' },
              { label: t('services:overview.hero.title', 'Diagnostik') },
            ]}
          />

          <p className="enter inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold ring-1 ring-inset ring-white/25">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-accent-line" />
            {t('services:overview.hero.entry.eyebrow')}
          </p>
          <h1 id="diagnostics-hero-title" className="enter mt-6 max-w-3xl t-stage-h1">
            {t('services:overview.hero.entry.title')}
          </h1>
          <p className="enter mt-6 max-w-[60ch] text-pretty text-lg leading-relaxed text-white/85">
            {t('services:overview.hero.entry.description')}
          </p>

          <div className="enter mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
            <Button
              to={diagnosticsGeneralSalesTarget}
              variant="light"
              data-cta-intent="GENERAL_SALES"
              data-cta-source="diagnostics"
              data-cta-journey="general_sales"
              data-cta-section="hero"
              className="group w-full justify-between !py-2.5 !pl-7 !pr-2.5 shadow-card sm:w-auto"
            >
              {t('services:overview.hero.entry.primary_cta')}
              <span
                aria-hidden="true"
                className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white transition group-hover:translate-x-1"
              >
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
            <Button
              href="#diagnostics-services"
              variant="ghost"
              data-diagnostics-secondary-entry
              className="w-full justify-center !text-white ring-1 ring-inset ring-white/25 hover:!bg-white/10 focus-visible:!ring-white focus-visible:!ring-offset-brand-deep sm:w-auto"
            >
              {t('services:overview.hero.entry.secondary_cta')}
            </Button>
          </div>

          <aside
            aria-label={t('services:overview.hero.entry.trust_label')}
            data-diagnostics-hero-trust
            className="enter mt-10 border-t border-white/15 pt-6"
          >
            <p className="text-sm font-semibold text-white">
              {t('services:overview.hero.entry.trust_label')}
            </p>
            <ul className="mt-3 grid gap-3 text-sm leading-6 text-white/80 sm:grid-cols-3">
              {trustSignals.map((signal) => (
                <li key={signal} className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-1 h-4 w-4 shrink-0 text-accent-on-dark"
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
          className="relative mx-auto w-full max-w-[480px] overflow-hidden rounded-card bg-white p-6 text-heading shadow-card sm:p-8"
        >
          <img
            src={IglooProImage}
            alt={t('services:overview.hero.entry.visual.alt')}
            width={650}
            height={650}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="mx-auto aspect-square h-auto w-full max-w-[340px] object-contain"
          />
          <figcaption className="mt-3 rounded-2xl bg-paper p-5">
            <p className="t-eyebrow">{t('services:overview.hero.entry.visual.eyebrow')}</p>
            <p className="mt-2 text-lg font-semibold text-heading">
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
