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
 */
const StepsSection = () => {
  const { t } = useTranslation('home')

  return (
    <section id="ablauf" aria-labelledby="process-title" className="bg-paper">
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0">
        <div className="max-w-3xl">
          <Eyebrow className="mb-4">{t('steps.caption', 'Der POC-Prozess')}</Eyebrow>
          <h2
            id="process-title"
            className="text-balance text-[clamp(2rem,4vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-heading"
          >
            {t('steps.title', 'Von der Anwendung zur fachlichen Einordnung')}
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-gray-700">
            {t(
              'steps.intro',
              'Ein klarer Ablauf macht Messinformationen im Praxisalltag nutzbar und lässt die medizinische Verantwortung bei den behandelnden Fachpersonen.',
            )}
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3" aria-label={t('steps.aria_label')}>
          {processSteps.map(({ id, number }) => (
            <li
              key={id}
              data-process-step={id}
              className="relative flex flex-col rounded-card border border-paper-line bg-white p-7 shadow-card md:min-h-64"
            >
              <span className="icon-tile h-11 w-11 text-sm font-semibold tracking-[0.08em]">
                {number}
              </span>
              <h3 className="mt-5 text-xl font-semibold text-heading">
                {t(`steps.items.${id}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">
                {t(`steps.items.${id}.text`)}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-8 max-w-3xl rounded-r-xl border-l-[3px] border-accent bg-white py-3 pl-5 pr-5 text-sm leading-relaxed text-gray-700">
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
