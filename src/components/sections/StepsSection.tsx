import { useTranslation } from 'react-i18next'
import Eyebrow from '../ui/Eyebrow'
import { Button } from '../ui/Button'

/**
 * StepsSection —"So einfach starten Sie": validierte POC-Diagnostik in 3 Schritten.
 * Helle Sektion (bg-slate-50), zentrierter Kopf + 3 nummerierte Karten mit Teal-Badge,
 * darunter zentrierter gefüllt-Teal CTA zur Kontaktseite.
 * i18n-Namespace 'home', Keys unter steps.*. SSR-sicher (kein window/localStorage).
 */
type Step = {
  number: string
  badge: string
  title: string
  text: string
}

const StepsSection = () => {
  const { t } = useTranslation('home')

  const steps: Step[] = [
    {
      number: '1',
      badge: t('steps.step1.badge', 'Bedarf klären'),
      title: t('steps.step1.title', 'Kostenloses Erstgespräch'),
      text: t(
        'steps.step1.text',
        'Wir analysieren Ihren Praxisalltag und zeigen, welche POC-Tests sich für Ihr Patientenspektrum wirtschaftlich lohnen.',
      ),
    },
    {
      number: '2',
      badge: t('steps.step2.badge', 'Einrichten'),
      title: t('steps.step2.title', 'Reader und Schulung vor Ort'),
      text: t(
        'steps.step2.text',
        'Sie erhalten Gerät und Assays inklusive Einweisung — nach kurzer Schulung ist Ihr Team startklar für die erste Messung.',
      ),
    },
    {
      number: '3',
      badge: t('steps.step3.badge', 'Loslegen'),
      title: t('steps.step3.title', 'Validierte Ergebnisse in Minuten'),
      text: t(
        'steps.step3.text',
        'Ab dem ersten Tag messen Sie direkt am Behandlungsplatz und besprechen den nächsten Schritt im selben Termin.',
      ),
    },
  ]

  return (
    <section id="ablauf" className="bg-slate-50">
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0">
        {/* Kopf */}
        <div className="mb-14 text-center">
          <Eyebrow className="mb-4">{t('steps.caption', 'SO EINFACH STARTEN SIE')}</Eyebrow>
          <h2 className="text-3xl font-medium tracking-tight text-heading sm:text-4xl">
            {t('steps.title', 'Validierte POC-Diagnostik in 3 Schritten')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-700">
            {t(
              'steps.intro',
              'Vom ersten Gespräch bis zur Messung am Behandlungsplatz begleiten wir Sie — ohne Laborversand, ohne lange Wartezeit.',
            )}
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-deep font-medium text-white">
                  {step.number}
                </span>
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                  {step.badge}
                </span>
              </div>
              <h3 className="mt-4 font-medium text-heading">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{step.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button
            to="/contact"
            variant="secondary"
            size="sm"
            className="!bg-accent-strong !text-white hover:!brightness-110 focus-visible:!ring-accent"
          >
            {t('steps.cta', 'Beratung buchen')}
          </Button>
        </div>
      </div>
    </section>
  )
}

export default StepsSection
