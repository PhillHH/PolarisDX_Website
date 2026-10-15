import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'

/**
 * AP34 PT34.2a (SC-003) — „Nächster Schritt" am Ende jeder Bereichsseite.
 * Zurueck · Weiter · Abschluss: keine Seite des Bereichs endet in einer
 * Sackgasse.
 */
export interface StepLink {
  to: string
  kicker: string
  title: string
  text?: string
}

interface NextStepsProps {
  label: string
  previous?: StepLink
  next?: StepLink
  cta?: { title: string; text?: string; action: ReactNode }
}

const card =
  'flex h-full flex-col gap-1.5 rounded-card border border-paper-line bg-white p-6 hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'

const Kicker = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-600">
    {children}
  </span>
)

const NextSteps = ({ label, previous, next, cta }: NextStepsProps) => (
  <section aria-label={label} className="border-t border-paper-line bg-white">
    <div className="mx-auto max-w-container px-4 py-14 sm:px-6 lg:px-0 lg:py-16">
      <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent-line" />
        {label}
      </p>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {previous ? (
          <Link to={previous.to} className={card}>
            <Kicker>
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {previous.kicker}
            </Kicker>
            <span className="text-lg font-semibold tracking-tight text-heading">
              {previous.title}
            </span>
            {previous.text ? (
              <span className="text-[15px] text-gray-600">{previous.text}</span>
            ) : null}
          </Link>
        ) : null}
        {next ? (
          <Link to={next.to} className={card}>
            <Kicker>
              {next.kicker}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Kicker>
            <span className="text-lg font-semibold tracking-tight text-heading">{next.title}</span>
            {next.text ? <span className="text-[15px] text-gray-600">{next.text}</span> : null}
          </Link>
        ) : null}
        {cta ? (
          <div className="brand-ring relative rounded-card bg-brand-deep p-6 text-white">
            <p className="text-lg font-semibold tracking-tight">{cta.title}</p>
            {cta.text ? (
              <p className="mt-2 text-[15px] leading-relaxed text-white/80">{cta.text}</p>
            ) : null}
            <div className="mt-5">{cta.action}</div>
          </div>
        ) : null}
      </div>
    </div>
  </section>
)

export default NextSteps
