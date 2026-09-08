import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getDiagnosticsHubServices } from '../../data/diagnosticsHub'
import Eyebrow from '../ui/Eyebrow'
import { DiagnosticsServiceGrid } from './DiagnosticsServiceCard'

const focusServices = getDiagnosticsHubServices('DIAGNOSTIC_WORKFLOW')

const DiagnosticsFocusSection = () => {
  const { t } = useTranslation(['home', 'services'])

  return (
    <>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-container px-4 lg:px-0 py-24 lg:py-24">
          <div className="mb-14 text-center">
            <Eyebrow>{t('services:overview.ia.groups.workflow.eyebrow')}</Eyebrow>
            <h2 className="mt-3 t-h2">{t('services:overview.ia.groups.workflow.title')}</h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-700">
              {t('services:overview.ia.groups.workflow.text')}
            </p>
          </div>

          <DiagnosticsServiceGrid
            entries={focusServices}
            categoryLabel={t('services:overview.ia.groups.workflow.eyebrow')}
          />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-container px-4 lg:px-0 pb-24 lg:pb-28">
          <div className="rounded-2xl bg-accent-strong p-7 lg:p-7 text-white flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium">{t('home:igloo_widget.help_title')}</p>
              <p className="text-sm text-white">{t('home:igloo_widget.help_text')}</p>
            </div>
            <Link
              to="/contact"
              className="whitespace-nowrap rounded-md bg-white px-5 py-3 font-medium text-brand-deep transition hover:bg-white/90"
            >
              {t('home:igloo_widget.help_cta', 'Angebot anfragen')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default DiagnosticsFocusSection
