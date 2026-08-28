import { useTranslation } from 'react-i18next'
import Eyebrow from '../ui/Eyebrow'
const IglooProFlyer = '/downloads/igloo-pro-flyer.pdf'

/**
 * IglooSpecsSection — technische Datentabelle (links) + Navy-Highlight-Karte
 * (rechts) für den IglooPro Reader.
 * SSR-sicher: kein window/Date/IntersectionObserver im Render; nur Tokens.
 */

// [labelKey, valueKey] — je Zeile eine Spec.
const SPEC_ROWS: ReadonlyArray<readonly [string, string]> = [
  ['methods', 'methods_value'],
  ['samples', 'samples_value'],
  ['speed', 'speed_value'],
  ['weight', 'weight_value'],
  ['battery', 'battery_value'],
  ['communication', 'communication_value'],
]

const IglooSpecsSection = () => {
  const { t } = useTranslation('products')

  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-container px-4 lg:px-0 py-24 lg:py-24">
        <div className="mb-14 text-center">
          <Eyebrow>{t('specs.eyebrow', 'TECHNISCHE DATEN')}</Eyebrow>
          <h2 className="mt-3 t-h2">{t('specs.headline', 'Die Specs, die zählen')}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-700">{t('specs.subtitle')}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-stretch">
          {/* LINKS: Spec-Tabelle */}
          <div>
            <div className="rounded-2xl border border-slate-200 bg-white p-2">
              {SPEC_ROWS.map(([labelKey, valueKey]) => (
                <div
                  key={labelKey}
                  className="grid grid-cols-1 md:grid-cols-2 gap-1 px-4 py-3 border-b border-slate-100 last:border-0"
                >
                  <span className="text-sm text-gray-500">{t('specs.' + labelKey)}</span>
                  <span className="text-sm font-medium text-heading">
                    <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1">
                      {t('specs.' + valueKey)}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-gray-400">{t('specs.manufacturer_note')}</p>
          </div>

          {/* RECHTS: Navy-Highlight-Karte */}
          <div className="rounded-2xl bg-brand-deep text-white p-7 flex flex-col justify-center">
            <p className="text-xs font-medium text-white/60">
              {t('specs.highlights.label', 'Highlights')}
            </p>
            <div className="space-y-6 mt-6">
              <div>
                <p className="text-3xl font-medium">{t('specs.highlights.cv_value', 'CV < 2 %')}</p>
                <p className="text-sm text-white/70">{t('specs.highlights.cv_label')}</p>
              </div>
              <div>
                <p className="text-3xl font-medium">
                  {t('specs.highlights.records_value', '10.000')}
                </p>
                <p className="text-sm text-white/70">{t('specs.highlights.records_label')}</p>
              </div>
              <div>
                <p className="text-3xl font-medium">
                  {t('specs.highlights.time_value', '3–15 Min.')}
                </p>
                <p className="text-sm text-white/70">{t('specs.highlights.time_label')}</p>
              </div>
            </div>
            <a
              href={IglooProFlyer}
              target="_blank"
              rel="noopener noreferrer"
              hrefLang="de"
              className="mt-8 block rounded-md bg-accent-strong px-5 py-3 text-center font-medium text-white hover:brightness-110"
            >
              {t('specs.highlights.datasheet', 'Datenblatt (PDF)')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default IglooSpecsSection
