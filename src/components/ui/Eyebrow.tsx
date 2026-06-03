/**
 * Eyebrow — die kanonische gradient-umrandete Pill (Section-Label).
 *
 * EINE Quelle für alle Pill-Renderings. SectionHeader nutzt die Default-
 * Variante; spätere Migrationen (3b-ii) von Heroes/IglooWidget greifen
 * dieselbe Komponente, ohne ein erzwungenes <h2> oder eine Titelfarbe
 * mitzuschleppen.
 *
 * Varianten stammen 1:1 aus dem Live-Repo (kein erfundener Stil):
 *  - size="default": responsive Pill aus SectionHeader (px-4 py-2 lg:px-3
 *    lg:py-1 / text-sm lg:text-xs). Auch IglooWidgetSection (+ mb-8 margin).
 *  - size="sm": fixe kleine Pill aus den Hero-Sektionen (AboutPage,
 *    EventsPage): px-3 py-1 / text-xs.
 * Beide nutzen denselben Gradient-Rand + bg-slate-50 + text-gray-900.
 * Eine "on-dark"/weiße Caption-Variante existiert im Live-Repo NICHT.
 */

import type { ReactNode } from 'react'

type EyebrowSize = 'default' | 'sm'

type EyebrowProps = {
  children: ReactNode
  /** Größe der Pill — reproduziert die zwei live gefundenen Varianten. */
  size?: EyebrowSize
  /** Passthrough am äußeren Wrapper (z. B. Layout-Margins wie mb-2 / mb-8). */
  className?: string
}

const innerBySize: Record<EyebrowSize, string> = {
  default: 'rounded-sm bg-slate-50 px-4 py-2 lg:px-3 lg:py-1',
  sm: 'rounded-sm bg-slate-50 px-3 py-1',
}

const captionBySize: Record<EyebrowSize, string> = {
  default: 'text-sm font-semibold uppercase tracking-wide text-gray-900 lg:text-xs',
  sm: 'text-xs font-semibold uppercase tracking-wide text-gray-900',
}

const Eyebrow = ({ children, size = 'default', className }: EyebrowProps) => {
  // Plain template statt cn(): garantiert byte-identischen Klassen-Output
  // für den Default-Fall (kein className) — SectionHeader-Parität.
  const outerClass =
    'inline-block rounded p-px bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-deep shadow-lg shadow-brand-primary/20' +
    (className ? ` ${className}` : '')

  return (
    <div className={outerClass}>
      <div className={innerBySize[size]}>
        <span className={captionBySize[size]}>{children}</span>
      </div>
    </div>
  )
}

export default Eyebrow
