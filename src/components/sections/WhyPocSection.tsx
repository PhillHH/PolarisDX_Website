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
    <section id="warum-poc" aria-labelledby="why-poc-title" className="bg-white">
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
            {t('why.caption', 'Point of Care im Arbeitsalltag')}
          </p>
          <h2
            id="why-poc-title"
            className="mt-3 text-balance text-[clamp(2rem,4vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-heading"
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

        <dl className="mt-12 grid gap-x-8 gap-y-10 border-y border-paper-line py-10 md:grid-cols-3">
          {signals.map(({ id, icon: Icon }) => (
            <div key={id} data-poc-signal={id}>
              <dt className="text-lg font-semibold text-heading">
                <span className="icon-tile mb-4 h-11 w-11">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="block">{t(`why.signals.${id}.title`)}</span>
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-gray-700">
                {t(`why.signals.${id}.text`)}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article
            data-benefit-audience="practice"
            className="rounded-card border border-paper-line bg-paper p-7 sm:p-8"
          >
            <Building2 aria-hidden="true" className="h-7 w-7 text-accent-strong" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
              {t('why.benefits.practice.label', 'Nutzen für die Praxis')}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-heading">
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
            className="rounded-card bg-brand-deep p-7 text-white sm:p-8"
          >
            <UserRoundCheck aria-hidden="true" className="h-7 w-7 text-accent-on-dark" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-accent-on-dark">
              {t('why.benefits.patient.label', 'Nutzen für Patientinnen und Patienten')}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              {t('why.benefits.patient.title', 'Ergebnisse verständlich besprechen')}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
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
