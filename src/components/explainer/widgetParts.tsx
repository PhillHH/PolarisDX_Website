import { Fragment, useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { fill, type ExplainerContent } from '../../content/articles/was-ist-epigenetik'
import { CoachRestart, useCoach, type CoachStep, type GuideTexts } from './useCoach'

export type WidgetTexts = ExplainerContent['widgets']
export type UiTexts = ExplainerContent['ui']

type FrameProps = {
  /** Kennung für Tests (`data-explainer-widget`). */
  name: string
  ui: UiTexts
  title: string
  guide: GuideTexts
  /** Die Handgriffe in derselben Reihenfolge wie `guide.steps`. */
  steps: readonly CoachStep[]
  /** Je Handgriff: erledigt? Kommt aus dem Zustand des Bausteins. */
  done: readonly boolean[]
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
 * Hülle um einen geführten Baustein: „Noch einmal von vorn" setzt ihn neu auf (neuer `key`, der
 * Baustein beginnt in seinem Anfangszustand).
 */
export const CoachHost = ({ children }: { children: ReactNode }) => {
  const [run, setRun] = useState(0)
  const restart = useCallback(() => setRun((current) => current + 1), [])
  const value = useMemo(() => ({ run, restart }), [run, restart])
  return (
    <CoachRestart.Provider value={value}>
      <Fragment key={run}>{children}</Fragment>
    </CoachRestart.Provider>
  )
}

/**
 * SC-031/SC-033: gemeinsamer Rahmen der Bausteine zum Ausprobieren. Er sagt in dieser Reihenfolge,
 * was der Baustein zeigt, welcher Handgriff ansteht (Hinweiszeile, das Bedienelement ist markiert)
 * und was daraufhin passiert ist (`aria-live`, wird vorgelesen). Nach dem letzten Handgriff steht
 * in der Hinweiszeile der Merksatz.
 */
export const WidgetFrame = ({
  name,
  ui,
  title,
  guide,
  steps,
  done,
  say,
  sayKey,
  cap,
  tried,
  className,
  children,
}: FrameProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLSpanElement>(null)
  const coach = useCoach(rootRef, tagRef, steps, done)
  const x = ui.guide
  const total = steps.length
  const nextLabel = coach.index + 1 >= total ? x.understood : x.next

  // Hinweiszeile: der nächste Handgriff, der Blick auf das Ergebnis oder der Merksatz.
  let label = total > 1 ? fill(x.step, { n: coach.index + 1, total }) : x.how
  let text = guide.steps[Math.min(coach.index, guide.steps.length - 1)]
  if (coach.phase === 'see') text = x.look
  if (coach.phase === 'learn') {
    label = x.learn
    text = `${guide.learn} ${x.free}`
  }

  return (
    <div
      ref={rootRef}
      className={tried ? 'xp-w is-tried' : 'xp-w'}
      data-explainer-widget={name}
      data-phase={coach.phase}
    >
      <div className="xp-w-head">
        <small>{ui.tryout}</small>
        <h3>{title}</h3>
        <p className="xp-shows">
          <b>{x.shows}</b>
          {guide.shows}
        </p>
      </div>

      <div className="xp-coach">
        <i className="xp-coach-n" aria-hidden="true">
          {coach.phase === 'learn' ? '✓' : coach.index + 1}
        </i>
        <p className={coach.phase === 'see' ? 'has-say' : undefined} aria-live="polite">
          <small>{label}</small>
          <span key={`${coach.phase}-${coach.index}`} className="xp-coach-look">
            {text}
          </span>
          {/* Am Telefon liegt der Ergebnissatz unter dem Bild oft außerhalb des Bildschirms — dort
              steht er zusätzlich hier oben (vorgelesen wird er einmal, über `.xp-say`). */}
          {coach.phase === 'see' ? (
            <span className="xp-coach-say" aria-hidden="true">
              {say}
            </span>
          ) : null}
        </p>
        <div className="xp-coach-a">
          {/* Derselbe Knopf wie unter dem Ergebnis — am Telefon ist dieser hier zu sehen. */}
          {coach.phase === 'see' ? (
            <button type="button" className="xp-btn is-pri xp-coach-next" onClick={coach.next}>
              {nextLabel} <span aria-hidden="true">→</span>
            </button>
          ) : null}
          {coach.phase === 'learn' ? (
            <button type="button" className="xp-btn" onClick={coach.restart}>
              {x.again}
            </button>
          ) : null}
        </div>
        {total > 1 ? (
          <span className="xp-coach-dots" aria-hidden="true">
            {steps.map((_, index) => (
              <i
                key={index}
                className={
                  coach.phase === 'learn' || index < coach.index
                    ? 'is-done'
                    : index === coach.index
                      ? 'is-on'
                      : undefined
                }
              />
            ))}
          </span>
        ) : null}
      </div>

      <div className={className ? `xp-w-body ${className}` : 'xp-w-body'}>{children}</div>

      <div className="xp-res">
        <b className="xp-res-k">{x.result}</b>
        <p className="xp-say" aria-live="polite">
          <span key={sayKey}>{say}</span>
        </p>
        {coach.phase === 'see' ? (
          <button type="button" className="xp-btn is-pri xp-res-next" onClick={coach.next}>
            {nextLabel} <span aria-hidden="true">→</span>
          </button>
        ) : null}
      </div>
      {cap ? <p className="xp-cap">{cap}</p> : null}

      {coach.tag ? (
        <span
          ref={tagRef}
          className={`xp-tag is-${coach.tag.place}`}
          style={{ left: coach.tag.x, top: coach.tag.y }}
          aria-hidden="true"
        >
          {coach.step.drag ? x.drag : x.tap}
        </span>
      ) : null}
    </div>
  )
}

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
