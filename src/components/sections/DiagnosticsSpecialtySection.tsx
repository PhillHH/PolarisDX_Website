import { useTranslation } from 'react-i18next'
import { getDiagnosticsHubServices } from '../../data/diagnosticsHub'
import SubHead from '../sub/SubHead'
import { DiagnosticsServiceGrid } from './DiagnosticsServiceCard'

const specialtyServices = getDiagnosticsHubServices('PRACTICE_CONTEXT')

const DiagnosticsSpecialtySection = ({
  eyebrow,
  title,
  subtitle,
  sectionClassName,
}: {
  eyebrow?: string
  title?: string
  subtitle?: string
  sectionClassName?: string
} = {}) => {
  const { t } = useTranslation(['home', 'services'])

  return (
    <section
      id="diagnostics-services"
      data-diagnostics-services
      data-sub-section
      className={`sc025-s scroll-mt-28 ${sectionClassName ?? ''}`}
    >
      <div className="sc025-inner">
        <SubHead
          kicker={eyebrow ?? t('services:overview.ia.groups.practice.eyebrow')}
          title={title ?? t('services:overview.ia.groups.practice.title')}
          lead={subtitle ?? t('services:overview.ia.groups.practice.text')}
        />
        <DiagnosticsServiceGrid
          entries={specialtyServices}
          categoryLabel={t('services:overview.ia.groups.practice.eyebrow')}
        />
      </div>
    </section>
  )
}

export default DiagnosticsSpecialtySection
