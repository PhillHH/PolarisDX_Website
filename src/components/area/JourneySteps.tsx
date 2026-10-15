import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

/**
 * AP34 PT34.2a (SC-003) — Wegweiser einer Bereichsstrecke: vier verbundene
 * Karten im Hub, jede ein Sprungziel. Die kompakte Schrittanzeige der
 * Leseseiten steht in JourneyMini.tsx — getrennt, damit die Vertiefungen
 * diesen Code nicht mitladen (routeJsGzip-Budget §29).
 */
export interface JourneyStep {
  key: string
  title: string
  text?: string
  cta?: string
  to: string
}

interface JourneyStepsProps {
  steps: JourneyStep[]
  currentKey?: string
  label: string
}

const JourneySteps = ({ steps, currentKey, label }: JourneyStepsProps) => (
  <nav aria-label={label}>
    <ol className="grid overflow-hidden rounded-card border border-paper-line bg-white lg:grid-cols-4">
      {steps.map((step, i) => {
        const current = step.key === currentKey
        return (
          <li
            key={step.key}
            className={`${i > 0 ? 'border-t border-paper-line lg:border-l lg:border-t-0' : ''} ${
              current ? 'bg-brand-deep text-white' : ''
            }`}
          >
            <Link
              to={step.to}
              className="group flex h-full gap-4 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent lg:flex-col lg:p-7"
            >
              <span
                aria-hidden="true"
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold ${
                  current ? 'bg-accent text-white' : 'bg-accent-soft text-accent-strong'
                }`}
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                <span
                  className={`block text-lg font-semibold tracking-tight ${
                    current ? 'text-white' : 'text-heading'
                  }`}
                >
                  {step.title}
                </span>
                {step.text ? (
                  <span
                    className={`mt-1 block text-[15px] leading-relaxed ${
                      current ? 'text-white/80' : 'text-gray-600'
                    }`}
                  >
                    {step.text}
                  </span>
                ) : null}
                {step.cta ? (
                  <span
                    className={`mt-3 inline-flex items-center gap-1.5 text-[15px] font-semibold ${
                      current ? 'text-accent-on-dark' : 'text-accent-strong'
                    }`}
                  >
                    {step.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                ) : null}
              </span>
            </Link>
          </li>
        )
      })}
    </ol>
  </nav>
)

export default JourneySteps
