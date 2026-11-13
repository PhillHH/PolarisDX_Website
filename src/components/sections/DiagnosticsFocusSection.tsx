import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getDiagnosticsHubServices } from '../../data/diagnosticsHub'
import SubHead from '../sub/SubHead'
import { DiagnosticsServiceGrid } from './DiagnosticsServiceCard'

const focusServices = getDiagnosticsHubServices('DIAGNOSTIC_WORKFLOW')

const DiagnosticsFocusSection = () => {
  const { t } = useTranslation(['home', 'services'])

  return (
    <section data-sub-section className="sc025-s sc025-tint">
      <div className="sc025-inner">
        <SubHead
          kicker={t('services:overview.ia.groups.workflow.eyebrow')}
          title={t('services:overview.ia.groups.workflow.title')}
          lead={t('services:overview.ia.groups.workflow.text')}
        />
        <DiagnosticsServiceGrid
          entries={focusServices}
          categoryLabel={t('services:overview.ia.groups.workflow.eyebrow')}
        />
        <div className="sc028-sales">
          <div>
            <b>{t('home:igloo_widget.help_title')}</b>
            <p>{t('home:igloo_widget.help_text')}</p>
          </div>
          <Link
            to="/contact"
            className="sc025-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-dark focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
          >
            {t('home:igloo_widget.help_cta', 'Angebot anfragen')}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default DiagnosticsFocusSection
