import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Eyebrow from '../ui/Eyebrow'

/**
 * IglooParametersSection — verfuegbares Testmenue des Igloo-Pro-Readers.
 * Zentrierter Kopf + 3 Gruppen-Karten (Praevention / Hormone / Infektion)
 * mit Tag-Chips je Parameter. Darunter ein dezenter Anfrage-Hinweis mit
 * Link zur Kontaktseite. i18n-Namespace 'products', Keys unter parameters.*.
 * SSR-sicher (kein window/localStorage/Date im Render).
 */
type ParameterGroup = {
  g: string
  items: string[]
}

const GROUPS: ParameterGroup[] = [
  { g: 'prevention', items: ['vitd3', 'crp', 'hba1c', 'ferritin', 'ddimer', 'troponin'] },
  { g: 'hormones', items: ['cortisol', 'tsh'] },
  { g: 'infection', items: ['flu', 'rsv', 'strep'] },
]

const IglooParametersSection = () => {
  const { t } = useTranslation('products')

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-container px-4 lg:px-0 py-24 lg:py-24">
        <div className="mb-14 text-center">
          <Eyebrow>{t('parameters.eyebrow', 'VERFÜGBARE PARAMETER')}</Eyebrow>
          <h2 className="mt-3 t-h2">
            {t('parameters.headline', 'Ein Reader, ein wachsendes Testmenü')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-700">{t('parameters.subtitle')}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {GROUPS.map(({ g, items }) => (
            <div key={g} className="rounded-xl border border-slate-200 bg-white p-7">
              <h3 className="text-lg font-medium text-heading">{t('parameters.groups.' + g)}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
                  >
                    {t('parameters.list.' + item)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <span className="text-sm text-gray-700">
            {t('parameters.request_text', 'Ein Parameter fehlt in der Liste?')}
          </span>{' '}
          <Link
            to="/contact"
            className="text-sm font-semibold text-accent hover:text-accent-strong"
          >
            {t('parameters.request_cta', 'Aktuelle Testliste anfragen')} →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default IglooParametersSection
