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
 * numbered navy tiles are joined by a hairline, the copy stands directly on
 * the paper surface. Same list, same copy, less markup.
 *
 * SC-006: one rail, two directions. Below `lg` every item is a row (tile left,
 * copy right) and the rail runs vertically from tile to tile; from `lg` the
 * items are columns and the same rail joins the tiles horizontally, drawing
 * itself as it scrolls into view (`rv-rail`). The number stays the first
 * span of every item.
 */
const StepsSection = () => {
  const { t } = useTranslation('home')

  return (
    <section id="ablauf" aria-labelledby="process-title" className="bg-paper">
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0">
        <div className="rv grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-12">
          <div>
            <Eyebrow className="mb-4">{t('steps.caption', 'Der POC-Prozess')}</Eyebrow>
            <h2 id="process-title" className="t-display">
              {t('steps.title', 'Von der Anwendung zur fachlichen Einordnung')}
            </h2>
          </div>
          <p className="max-w-xl t-body">
            {t(
              'steps.intro',
              'Ein klarer Ablauf macht Messinformationen im Praxisalltag nutzbar und lässt die medizinische Verantwortung bei den behandelnden Fachpersonen.',
            )}
          </p>
        </div>

        <ol className="mt-14 grid lg:grid-cols-3 lg:gap-8" aria-label={t('steps.aria_label')}>
          {processSteps.map(({ id, number }, index) => {
            const joined = index < processSteps.length - 1
            return (
              <li key={id} data-process-step={id} className="rv flex gap-5 lg:flex-col lg:gap-6">
                <div className="flex flex-col items-center gap-4 lg:flex-row">
                  <span className="icon-tile h-14 w-14 bg-brand-deep font-semibold text-white">
                    {number}
                  </span>
                  {joined && (
                    <span aria-hidden="true" className="rv-rail h-px w-px flex-1 bg-accent-line" />
                  )}
                </div>
                <div className={joined ? 'mt-3.5 pb-12 lg:mt-0 lg:pb-0' : 'mt-3.5 lg:mt-0'}>
                  <h3 className="text-xl font-semibold tracking-tight text-heading">
                    {t(`steps.items.${id}.title`)}
                  </h3>
                  <p className="mt-3 max-w-sm t-small">{t(`steps.items.${id}.text`)}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <p className="mt-12 max-w-3xl border-l-[3px] border-accent pl-5 t-small">
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
