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
 *
 * SC-006 (2026-10-16): the three signals stand on ruled columns (one hairline
 * per column instead of one band), icon tile and title share a row on every
 * breakpoint, the navy benefit card carries the aurora glow. Nothing here is
 * interactive, so nothing reacts to the pointer — surfaces enter on scroll.
 */
const WhyPocSection = () => {
  const { t } = useTranslation('home')

  return (
    <section id="warum-poc" aria-labelledby="why-poc-title" className="bg-white">
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0">
        <div className="rv max-w-3xl">
          <p className="t-eyebrow">{t('why.caption', 'Point of Care im Arbeitsalltag')}</p>
          <h2 id="why-poc-title" className="mt-3 t-display">
            {t('why.title', 'Information dort, wo sie gebraucht wird')}
          </h2>
          <p className="mt-4 max-w-2xl t-body">
            {t(
              'why.intro',
              'Point-of-Care-Messungen stellen zusätzliche Informationen direkt im Praxisablauf bereit. Sie unterstützen die fachliche Einordnung, ohne sie zu automatisieren oder zu ersetzen.',
            )}
          </p>
        </div>

        <dl className="rv mt-12 grid gap-6 border-b border-paper-line pb-12 md:grid-cols-3">
          {signals.map(({ id, icon: Icon }) => (
            <div key={id} data-poc-signal={id} className="border-t border-paper-line pt-6">
              <dt className="flex items-center gap-3 t-h3">
                <span className="icon-tile h-11 w-11">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                {t(`why.signals.${id}.title`)}
              </dt>
              <dd className="mt-3 t-small">{t(`why.signals.${id}.text`)}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article
            data-benefit-audience="practice"
            className="rv rounded-card border border-accent-border bg-paper p-7 sm:p-8"
          >
            <span className="icon-tile h-14 w-14">
              <Building2 aria-hidden="true" className="h-7 w-7" />
            </span>
            <p className="mt-5 t-eyebrow">
              {t('why.benefits.practice.label', 'Nutzen für die Praxis')}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-heading">
              {t('why.benefits.practice.title', 'Strukturiert in den Workflow eingebunden')}
            </h3>
            <p className="mt-3 t-small">
              {t(
                'why.benefits.practice.text',
                'Zusätzliche Messwerte stehen im Point-of-Care-Prozess zur Verfügung und können in Beratung und Versorgung eingeordnet werden.',
              )}
            </p>
          </article>

          <article
            data-benefit-audience="patient"
            className="aurora rv rounded-card bg-brand-deep p-7 text-white sm:p-8"
          >
            <span className="icon-tile h-14 w-14 bg-white/10 text-accent-on-dark">
              <UserRoundCheck aria-hidden="true" className="h-7 w-7" />
            </span>
            <p className="mt-5 t-eyebrow-dark">
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
