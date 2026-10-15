import { useTranslation } from 'react-i18next'
import { getDiagnosticsHubServices } from '../../data/diagnosticsHub'
import Eyebrow from '../ui/Eyebrow'
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
      className={`scroll-mt-28 ${sectionClassName ?? 'bg-white'}`}
    >
      <div className="mx-auto max-w-container px-4 lg:px-0 py-24 lg:py-24">
        <div className="mb-12 grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-14">
          <div>
            <Eyebrow>{eyebrow ?? t('services:overview.ia.groups.practice.eyebrow')}</Eyebrow>
            <h2 className="mt-3 t-h2">
              {title ?? t('services:overview.ia.groups.practice.title')}
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-gray-600">
            {subtitle ?? t('services:overview.ia.groups.practice.text')}
          </p>
        </div>

        <DiagnosticsServiceGrid
          entries={specialtyServices}
          categoryLabel={t('services:overview.ia.groups.practice.eyebrow')}
        />
      </div>
    </section>
  )
}

export default DiagnosticsSpecialtySection
