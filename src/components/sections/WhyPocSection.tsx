import { Building2, MessagesSquare, TimerReset, UserRoundCheck, Workflow } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { LucideIcon } from 'lucide-react'

type PocSignal = {
  id: 'access' | 'workflow' | 'conversation'
  icon: LucideIcon
}

const signals: PocSignal[] = [
  { id: 'access', icon: TimerReset },
  { id: 'workflow', icon: Workflow },
  { id: 'conversation', icon: MessagesSquare },
]

/**
 * Explains the operational role of Point-of-Care information without making
 * treatment, outcome or revenue promises. Practice and patient/user benefits
 * are deliberately separated and the section has no conversion interaction.
 */
const WhyPocSection = () => {
  const { t } = useTranslation('home')

  return (
    <section id="warum-poc" aria-labelledby="why-poc-title" className="bg-slate-50">
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
            {t('why.caption', 'Point of Care im Arbeitsalltag')}
          </p>
          <h2
            id="why-poc-title"
            className="mt-3 text-3xl font-medium tracking-tight text-heading sm:text-4xl lg:text-[42px]"
          >
            {t('why.title', 'Information dort, wo sie gebraucht wird')}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-700">
            {t(
              'why.intro',
              'Point-of-Care-Messungen stellen zusätzliche Informationen direkt im Praxisablauf bereit. Sie unterstützen die fachliche Einordnung, ohne sie zu automatisieren oder zu ersetzen.',
            )}
          </p>
        </div>

        <dl className="mt-12 grid gap-x-8 gap-y-10 border-y border-slate-200 py-10 md:grid-cols-3">
          {signals.map(({ id, icon: Icon }) => (
            <div key={id} data-poc-signal={id}>
              <Icon aria-hidden="true" className="h-6 w-6 text-accent-strong" />
              <dt className="mt-4 font-medium text-heading">{t(`why.signals.${id}.title`)}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-gray-700">
                {t(`why.signals.${id}.text`)}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article
            data-benefit-audience="practice"
            className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-8"
          >
            <Building2 aria-hidden="true" className="h-7 w-7 text-accent-strong" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
              {t('why.benefits.practice.label', 'Nutzen für die Praxis')}
            </p>
            <h3 className="mt-2 text-xl font-medium text-heading">
              {t('why.benefits.practice.title', 'Strukturiert in den Workflow eingebunden')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              {t(
                'why.benefits.practice.text',
                'Zusätzliche Messwerte stehen im Point-of-Care-Prozess zur Verfügung und können in Beratung und Versorgung eingeordnet werden.',
              )}
            </p>
          </article>

          <article
            data-benefit-audience="patient"
            className="rounded-2xl border border-slate-200 bg-brand-deep p-7 text-white sm:p-8"
          >
            <UserRoundCheck aria-hidden="true" className="h-7 w-7 text-accent-light" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-light">
              {t('why.benefits.patient.label', 'Nutzen für Patientinnen und Patienten')}
            </p>
            <h3 className="mt-2 text-xl font-medium text-white">
              {t('why.benefits.patient.title', 'Ergebnisse verständlich besprechen')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-100">
              {t(
                'why.benefits.patient.text',
                'Verfügbare Werte können im Versorgungskontext erklärt werden. Der Test ergänzt die professionelle Beurteilung; er ersetzt weder Diagnose noch Behandlung.',
              )}
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

export default WhyPocSection
