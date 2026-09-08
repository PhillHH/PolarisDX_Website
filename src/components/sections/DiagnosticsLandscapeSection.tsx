import { useTranslation } from 'react-i18next'
import Eyebrow from '../ui/Eyebrow'

const DiagnosticsLandscapeSection = () => {
  const { t } = useTranslation('services')

  return (
    <section
      aria-labelledby="diagnostics-landscape-title"
      data-diagnostics-landscape
      className="bg-slate-50 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-container px-4 lg:px-0">
        <div className="max-w-3xl">
          <Eyebrow>{t('overview.ia.eyebrow')}</Eyebrow>
          <h2 id="diagnostics-landscape-title" className="mt-3 t-h2">
            {t('overview.ia.title')}
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-700">{t('overview.ia.intro')}</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-xl border border-ui-border bg-white p-7">
            <h3 className="text-xl font-medium text-heading">{t('overview.ia.poc.title')}</h3>
            <p className="mt-3 text-base leading-7 text-gray-700">{t('overview.ia.poc.text')}</p>
          </article>
          <article className="rounded-xl border border-ui-border bg-white p-7">
            <h3 className="text-xl font-medium text-heading">{t('overview.ia.extended.title')}</h3>
            <p className="mt-3 text-base leading-7 text-gray-700">
              {t('overview.ia.extended.text')}
            </p>
          </article>
        </div>

        <p className="mt-6 max-w-4xl rounded-lg border-l-4 border-accent bg-white px-5 py-4 text-sm leading-6 text-gray-700">
          <strong className="font-semibold text-heading">{t('overview.ia.term.label')}</strong>{' '}
          {t('overview.ia.term.text')}
        </p>
      </div>
    </section>
  )
}

export default DiagnosticsLandscapeSection
