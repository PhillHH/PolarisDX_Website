import type { ReactNode } from 'react'
import type { ExplainerContent } from '../../content/articles/was-ist-epigenetik'

export type WidgetTexts = ExplainerContent['widgets']
export type UiTexts = ExplainerContent['ui']

type FrameProps = {
  /** Kennung für Tests (`data-explainer-widget`). */
  name: string
  kicker: string
  title: string
  how: string
  /** Der Satz, der erklärt, was gerade passiert ist. */
  say: ReactNode
  /** Wechselt mit jeder neuen Aussage, damit sie neu eingeblendet wird. */
  sayKey: string | number
  cap?: string
  tried: boolean
  className?: string
  children: ReactNode
}

/**
 * SC-031: gemeinsamer Rahmen der Bausteine zum Ausprobieren — Titel, eine Zeile Anleitung, der
 * Baustein und darunter ein Satz in einfachen Worten, der auf jede Eingabe antwortet
 * (`aria-live`, wird vorgelesen).
 */
export const WidgetFrame = ({
  name,
  kicker,
  title,
  how,
  say,
  sayKey,
  cap,
  tried,
  className,
  children,
}: FrameProps) => (
  <div className={tried ? 'xp-w is-tried' : 'xp-w'} data-explainer-widget={name}>
    <div className="xp-w-head">
      <small>{kicker}</small>
      <h3>{title}</h3>
      <p className="xp-how">{how}</p>
    </div>
    <div className={className ? `xp-w-body ${className}` : 'xp-w-body'}>{children}</div>
    <p className="xp-say" aria-live="polite">
      <span key={sayKey}>{say}</span>
    </p>
    {cap ? <p className="xp-cap">{cap}</p> : null}
  </div>
)

/** Zeichen der sechs Einflüsse, in der Reihenfolge von `widgets.influences`. */
const INFLUENCE_PATHS: ReactNode[] = [
  <>
    <circle cx="14" cy="4.5" r="2" />
    <path d="M6 21l4-6 1-5 4 3 4 1M11 10l-4 1-2 4M13 13l2 4v4" />
  </>,
  <path d="M12 7c-2-3-7-2-7 3 0 5 4 10 7 10s7-5 7-10c0-5-5-6-7-3zM12 7c0-2 1-4 3-4" />,
  <path d="M2 12h4l2-6 4 12 3-9 2 3h5" />,
  <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />,
  <>
    <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </>,
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </>,
]

export const InfluenceIcon = ({ index }: { index: number }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {INFLUENCE_PATHS[index]}
  </svg>
)
