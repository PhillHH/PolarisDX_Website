import { useTranslation } from 'react-i18next'
import Eyebrow from '../ui/Eyebrow'

type ProcessStep = {
  id: 'application' | 'result' | 'context'
  number: string
}

const processSteps: ProcessStep[] = [
  { id: 'application', number: '01' },
  { id: 'result', number: '02' },
  { id: 'context', number: '03' },
]

/**
 * A semantic, non-interactive Point-of-Care workflow. The DOM order is the
 * reading order on every breakpoint and visible numbers keep it independent
 * from icon or colour perception.
 *
 * SC-005 (2026-10-16): drawn as a timeline instead of three white cards — the
 * numbered navy tiles are joined by a hairline from `md`, the copy stands
 * directly on the paper surface. Same list, same copy, less markup.
 */
const StepsSection = () => {
  const { t } = useTranslation('home')

  return (
    <section id="ablauf" aria-labelledby="process-title" className="bg-paper">
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-12">
          <div>
            <Eyebrow className="mb-4">{t('steps.caption', 'Der POC-Prozess')}</Eyebrow>
            <h2
              id="process-title"
              className="text-balance text-[clamp(2rem,4vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-heading"
            >
              {t('steps.title', 'Von der Anwendung zur fachlichen Einordnung')}
            </h2>
          </div>
          <p className="max-w-xl leading-relaxed text-gray-700">
            {t(
              'steps.intro',
              'Ein klarer Ablauf macht Messinformationen im Praxisalltag nutzbar und lässt die medizinische Verantwortung bei den behandelnden Fachpersonen.',
            )}
          </p>
        </div>

        <ol
          className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8"
          aria-label={t('steps.aria_label')}
        >
          {processSteps.map(({ id, number }, index) => (
            <li key={id} data-process-step={id} className="relative">
              <div className="flex items-center gap-4">
                <span className="icon-tile h-12 w-12 bg-brand-deep text-sm font-semibold tracking-[0.08em] text-white">
                  {number}
                </span>
                {index < processSteps.length - 1 && (
                  <span aria-hidden="true" className="hidden h-px flex-1 bg-paper-line md:block" />
                )}
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-heading">
                {t(`steps.items.${id}.title`)}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-700">
                {t(`steps.items.${id}.text`)}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-12 max-w-3xl border-l-[3px] border-accent pl-5 text-sm leading-relaxed text-gray-700">
          {t(
            'steps.safety_note',
            'Messwerte liefern zusätzliche Informationen. Die fachliche Bewertung und alle daraus abgeleiteten nächsten Schritte bleiben Aufgabe der verantwortlichen Fachperson.',
          )}
        </p>
      </div>
    </section>
  )
}

export default StepsSection
