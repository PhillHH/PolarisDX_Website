import { ArrowRight, Dna, MonitorSmartphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { diagnosticsContextTargets, diagnosticsFocusAreas } from '../../data/diagnosticsHub'
import Eyebrow from '../ui/Eyebrow'

const DiagnosticsUseCasesSection = () => {
  const { t } = useTranslation(['home', 'services'])

  return (
    <section
      aria-labelledby="diagnostics-focus-title"
      data-diagnostics-focus-areas
      className="bg-white"
    >
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0 lg:py-28">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <Eyebrow>{t('services:overview.focus.eyebrow')}</Eyebrow>
          <h2 id="diagnostics-focus-title" className="mt-3 t-h2">
            {t('services:overview.focus.title')}
          </h2>
          <p className="mt-4 text-gray-700">{t('services:overview.focus.intro')}</p>
        </div>

        <div data-diagnostics-focus-grid className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {diagnosticsFocusAreas.map(({ id, entry, requiredTag }) => {
            const title = t(`home:services.${entry.service.translationKey}.title`)
            return (
              <article
                key={id}
                data-diagnostics-focus-area={id}
                data-focus-service={entry.service.id}
                data-focus-tag={requiredTag}
                className="flex min-h-[250px] flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white text-accent shadow-sm [&>svg]:h-5 [&>svg]:w-5"
                  aria-hidden="true"
                >
                  {entry.service.icon}
                </span>
                <h3 className="mt-5 text-xl font-medium leading-snug text-heading">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">
                  {t(`services:overview.ia.cards.${entry.service.translationKey}`)}
                </p>
                <Link
                  to={entry.route.path}
                  data-focus-link
                  data-route-id={entry.route.id}
                  className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-sm font-semibold text-accent-strong underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                >
                  {t('services:overview.ia.card_cta')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            )
          })}
        </div>

        <div data-diagnostics-context-boundaries className="mt-12 grid gap-5 lg:grid-cols-2">
          <article
            data-diagnostics-boundary="igloo"
            className="rounded-2xl border border-accent/30 bg-accent/5 p-7"
          >
            <MonitorSmartphone className="h-7 w-7 text-accent" aria-hidden="true" />
            <h3 className="mt-5 text-2xl font-medium text-heading">
              {t('home:business_pillars.pillars.igloo.title')}
            </h3>
            <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-gray-700">
              {t('home:business_pillars.pillars.igloo.text')}
            </p>
            <Link
              to={diagnosticsContextTargets.igloo.path}
              data-context-link="igloo"
              data-route-id={diagnosticsContextTargets.igloo.id}
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent-strong underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              {t('home:business_pillars.pillars.igloo.cta')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>

          <article
            data-diagnostics-boundary="epigenetics"
            className="rounded-2xl border border-slate-200 bg-slate-50 p-7"
          >
            <Dna className="h-7 w-7 text-accent" aria-hidden="true" />
            <h3 className="mt-5 text-2xl font-medium text-heading">
              {t('home:business_pillars.pillars.epigenetics.title')}
            </h3>
            <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-gray-700">
              {t('home:business_pillars.pillars.epigenetics.text')}
            </p>
            <Link
              to={diagnosticsContextTargets.epigenetics.path}
              data-context-link="epigenetics"
              data-route-id={diagnosticsContextTargets.epigenetics.id}
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent-strong underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              {t('home:business_pillars.pillars.epigenetics.cta')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  )
}

export default DiagnosticsUseCasesSection
