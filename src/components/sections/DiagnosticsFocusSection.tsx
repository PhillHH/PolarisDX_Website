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
      <section className="bg-paper">
        <div className="mx-auto max-w-container px-4 lg:px-0 py-24 lg:py-24">
          <div className="mb-12 grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-14">
            <div>
              <Eyebrow>{t('services:overview.ia.groups.workflow.eyebrow')}</Eyebrow>
              <h2 className="mt-3 t-h2">{t('services:overview.ia.groups.workflow.title')}</h2>
            </div>
            <p className="text-lg leading-relaxed text-gray-600">
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
          <div className="brand-ring relative flex flex-col gap-4 rounded-card bg-brand-deep p-7 text-white md:flex-row md:items-center md:justify-between lg:p-8">
            <div>
              <p className="text-lg font-semibold">{t('home:igloo_widget.help_title')}</p>
              <p className="text-sm text-white/80">{t('home:igloo_widget.help_text')}</p>
            </div>
            <Link
              to="/contact"
              className="whitespace-nowrap rounded-full bg-white px-6 py-3 font-semibold text-brand-deep transition hover:bg-accent-soft"
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
