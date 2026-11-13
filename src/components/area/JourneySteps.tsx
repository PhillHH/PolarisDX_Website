import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

/**
 * AP34 PT34.2a (SC-003) — Wegweiser einer Bereichsstrecke: vier Schritte im
 * Hub, jeder ein Sprungziel. Die kompakte Schrittanzeige der
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
    {/* SC-028: vier nummerierte Spalten mit Linie statt verbundener Karten; der aktuelle Schritt
        trägt die Akzentlinie. Die Klassen kommen aus sub.css — der Wegweiser steht nur im Hub. */}
    <ol className="sc028-journey">
      {steps.map((step, i) => (
        <li key={step.key} data-current={step.key === currentKey ? 'true' : undefined}>
          <Link
            to={step.to}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
          >
            <span aria-hidden="true" className="sc028-n">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="sc028-journey-title">{step.title}</span>
            {step.text ? <span className="sc028-journey-text">{step.text}</span> : null}
            {step.cta ? (
              <span className="sc025-underlink">
                <span>{step.cta}</span>
                <ArrowRight aria-hidden="true" />
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ol>
  </nav>
)

export default JourneySteps
