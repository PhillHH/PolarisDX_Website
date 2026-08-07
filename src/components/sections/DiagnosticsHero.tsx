import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Breadcrumbs } from '../ui/Breadcrumbs'

/**
 * DiagnosticsHero — Navy-Hero fuer die Diagnostik-Uebersichtsseite.
 * Links: Breadcrumb, H1, Untertitel und drei Kennzahl-Chips.
 * Rechts: rein dekoratives Reader-Visual (runde Teal-Gauge + drei
 * schwebende weisse Ergebnis-Kaertchen). SSR-sicher, nur Design-Tokens.
 * i18n-Namespaces 'common' + 'services', Keys unter services:overview.hero.*.
 */
const DiagnosticsHero = () => {
  const { t } = useTranslation(['common', 'services'])

  return (
    <section className="relative overflow-hidden bg-brand-deep text-white">
      <div className="mx-auto max-w-container px-4 lg:px-0 pt-24 pb-16 lg:pt-28 grid lg:grid-cols-2 gap-8 items-center">
        {/* Links: Textspalte */}
        <div>
          <Breadcrumbs
            variant="dark"
            className="mb-4"
            items={[
              { label: t('common:nav.home', 'Home'), href: '/' },
              { label: t('services:overview.hero.title', 'Diagnostik') },
            ]}
          />

          <h1 className="text-4xl lg:text-5xl font-medium tracking-tight">
            {t('services:overview.hero.title', 'Diagnostik')}
          </h1>

          <p className="mt-4 max-w-xl text-white/80 leading-relaxed">
            {t('services:overview.hero.subtitle')}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 ring-1 ring-white/15">
              {t('services:overview.hero.chip_cv', 'CV < 2 %')}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 ring-1 ring-white/15">
              {t('services:overview.hero.chip_results')}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/90 ring-1 ring-white/15">
              {t('services:overview.hero.chip_lfa')}
            </span>
          </div>
        </div>

        {/* Rechts: dekoratives Reader-Visual */}
        <div className="hidden lg:block" aria-hidden="true">
          <div className="relative rounded-2xl bg-white/5 ring-1 ring-white/10 p-7 min-h-[300px]">
            {/* Kreisfoermige Gauge */}
            <div className="relative mx-auto h-40 w-40">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  strokeWidth="10"
                  className="stroke-white/10"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  strokeWidth="10"
                  strokeLinecap="round"
                  className="stroke-accent"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * 0.3}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-medium text-white">
                {t('services:overview.hero.visual.gauge', '36°')}
              </span>
            </div>

            {/* Schwebende Ergebnis-Kaertchen */}
            <div className="absolute top-6 left-4 rounded-lg bg-white px-3 py-2 text-brand-deep flex items-center gap-2">
              <Check size={14} className="text-accent" />
              <span>
                <span className="block font-medium">
                  {t('services:overview.hero.visual.vitd_name', 'Vitamin D')}
                </span>
                <span className="block text-xs text-gray-500">
                  {t('services:overview.hero.visual.vitd_val')}
                </span>
              </span>
            </div>

            <div className="absolute top-1/2 right-4 rounded-lg bg-white px-3 py-2 text-brand-deep flex items-center gap-2">
              <Check size={14} className="text-accent" />
              <span>
                <span className="block font-medium">
                  {t('services:overview.hero.visual.time_val')}
                </span>
                <span className="block text-xs text-gray-500">
                  {t('services:overview.hero.visual.time_label')}
                </span>
              </span>
            </div>

            <div className="absolute bottom-6 left-10 rounded-lg bg-white px-3 py-2 text-brand-deep flex items-center gap-2">
              <Check size={14} className="text-accent" />
              <span>
                <span className="block font-medium">
                  {t('services:overview.hero.visual.crp_name', 'CRP')}
                </span>
                <span className="block text-xs text-gray-500">
                  {t('services:overview.hero.visual.crp_val')}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DiagnosticsHero
