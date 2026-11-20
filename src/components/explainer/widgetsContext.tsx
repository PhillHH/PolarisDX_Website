import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { fill } from '../../content/articles/was-ist-epigenetik'
import { prefersReducedMotion } from '../home/motion'
import { withLabels, type CoachStep } from './useCoach'
import { CoachHost, WidgetFrame, type UiTexts, type WidgetTexts } from './widgetParts'

type Props = { texts: WidgetTexts; ui: UiTexts }

/** Lage der sechs Einflüsse um die Mitte: x, y, Textanker, Versatz der Beschriftung. */
const RING: Array<[number, number, 'start' | 'middle' | 'end', number, number]> = [
  [300, 46, 'middle', 0, -18],
  [470, 112, 'start', 16, 5],
  [470, 238, 'start', 16, 5],
  [300, 304, 'middle', 0, 28],
  [130, 238, 'end', -16, 5],
  [130, 112, 'end', -16, 5],
]

/** Sechs Einflüsse um die Genregulation: antippen, eine Linie läuft zur Mitte. */
const RingInner = ({ texts, ui }: Props) => {
  const t = texts.ring
  const [picked, setPicked] = useState<{ index: number; turn: number } | null>(null)
  /** Schon angetippte Einflüsse bleiben markiert. */
  const [seen, setSeen] = useState<number[]>([])
  const pick = (index: number) => {
    setPicked((current) => ({ index, turn: (current?.turn ?? 0) + 1 }))
    setSeen((current) => (current.includes(index) ? current : [...current, index]))
  }
  // Geführt: zuerst der vierte Einfluss, dann einer, der noch nicht angetippt wurde.
  const second = seen.includes(2) ? (seen.includes(3) ? 0 : 3) : 2
  const steps: CoachStep[] = [
    { target: '.xp-ring g:nth-of-type(4)', watch: '.xp-ring .core' },
    { target: `.xp-ring g:nth-of-type(${second + 1})`, watch: '.xp-ring .core' },
  ]
  const onKey = (event: KeyboardEvent<SVGGElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      pick(index)
    }
  }
  return (
    <WidgetFrame
      name="ring"
      ui={ui}
      title={t.title}
      guide={withLabels(
        t.guide,
        { label: texts.influences.short[3] },
        { label: texts.influences.short[second] },
      )}
      steps={steps}
      done={[seen.length >= 1, seen.length >= 2]}
      say={picked ? fill(t.sayPick, { name: texts.influences.full[picked.index] }) : t.sayIdle}
      sayKey={picked?.turn ?? 0}
      cap={t.cap}
      tried={picked !== null}
    >
      <svg viewBox="0 0 600 350" className="xp-ring" role="group" aria-label={t.aria}>
        {RING.map(([x, y], index) => (
          <path
            key={`${index}-${picked?.index === index ? picked.turn : 0}`}
            className={
              picked?.index === index ? 'ln is-on' : seen.includes(index) ? 'ln is-seen' : 'ln'
            }
            pathLength={1}
            d={`M${x} ${y}L300 175`}
          />
        ))}
        <circle
          key={picked?.turn ?? 0}
          className={picked ? 'core is-hit' : 'core'}
          cx="300"
          cy="175"
          r="56"
        />
        <text className="ct" x="300" y="171" textAnchor="middle">
          {t.core[0]}
        </text>
        <text className="ct" x="300" y="189" textAnchor="middle">
          {t.core[1]}
        </text>
        {RING.map(([x, y, anchor, dx, dy], index) => (
          <g
            key={index}
            role="button"
            tabIndex={0}
            aria-label={texts.influences.full[index]}
            aria-pressed={picked?.index === index}
            className={
              picked?.index === index ? 'is-on' : seen.includes(index) ? 'is-seen' : undefined
            }
            onClick={() => pick(index)}
            onKeyDown={(event) => onKey(event, index)}
          >
            <circle className="hit" cx={x} cy={y} r="30" />
            <circle className="dt" cx={x} cy={y} r="8" />
            <text x={x + dx} y={y + dy} textAnchor={anchor}>
              {texts.influences.short[index]}
            </text>
          </g>
        ))}
      </svg>
    </WidgetFrame>
  )
}
export const Ring = (props: Props) => (
  <CoachHost>
    <RingInner {...props} />
  </CoachHost>
)

const CAUSE_STEPS: CoachStep[] = [
  { target: '.xp-cause-op button:nth-child(2)', watch: '.xp-cause svg' },
  { target: '.xp-cause-op button:nth-child(3)', watch: '.xp-cause svg' },
]

/** Ursache, Folge oder Begleiterscheinung: drei Lesarten desselben Zusammenhangs. */
const CauseInner = ({ texts, ui }: Props) => {
  const t = texts.cause
  const [option, setOption] = useState(0)
  const [touched, setTouched] = useState(false)
  /** Welche Lesarten schon angesehen wurden (für die Führung). */
  const [visited, setVisited] = useState([true, false, false])
  return (
    <WidgetFrame
      name="cause"
      ui={ui}
      title={t.title}
      guide={withLabels(t.guide, { label: t.options[1] }, { label: t.options[2] })}
      steps={CAUSE_STEPS}
      done={[visited[1], visited[2]]}
      say={
        <>
          {t.say[option]} <span className="xp-tail">{t.tail}</span>
        </>
      }
      sayKey={option}
      tried={touched}
      className="xp-cause"
    >
      <div className="xp-cause-op" role="group" aria-label={t.aria}>
        {t.options.map((name, index) => (
          <button
            key={name}
            type="button"
            className="xp-btn"
            aria-pressed={option === index}
            onClick={() => {
              setOption(index)
              setTouched(true)
              setVisited((current) => current.map((was, i) => was || i === index))
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 600 150" aria-hidden="true">
        <rect className="bx" x="20" y="45" width="210" height="60" />
        <text x="125" y="72" textAnchor="middle">
          {t.marker[0]}
        </text>
        <text x="125" y="91" textAnchor="middle">
          {t.marker[1]}
        </text>
        <rect className="bx" x="370" y="45" width="210" height="60" />
        <text x="475" y="81" textAnchor="middle">
          {t.disease}
        </text>
        <g key={option}>
          {option === 0 ? (
            <>
              <path className="draw" d="M240 75H352" />
              <path d="M342 66l12 9-12 9" />
            </>
          ) : option === 1 ? (
            <>
              <path className="draw" d="M360 75H248" />
              <path d="M258 66l-12 9 12 9" />
            </>
          ) : (
            <>
              <path className="ds" d="M240 75H360" />
              <text className="sm" x="300" y="62" textAnchor="middle">
                {t.together}
              </text>
            </>
          )}
        </g>
      </svg>
    </WidgetFrame>
  )
}

export const Cause = (props: Props) => (
  <CoachHost>
    <CauseInner {...props} />
  </CoachHost>
)

type ChainProps = Props & { chain: 'chainPsy' | 'chainTrain' }
/** Ein Handgriff: „Weiter" drücken, bis die letzte Stufe erreicht ist. */
const CHAIN_STEPS: CoachStep[] = [
  { target: '.xp-ctl .xp-btn.is-pri', watch: '.xp-chain', tag: 'right' },
]

/** Eine Kette in fünf Schritten zum Durchklicken (Umwelt → Verhalten, Training → Anpassung). */
const ChainInner = ({ texts, ui, chain }: ChainProps) => {
  const t = texts[chain]
  const [step, setStep] = useState(0)
  const [touched, setTouched] = useState(false)
  const last = t.steps.length - 1
  const go = (next: number) => {
    setStep(Math.max(0, Math.min(last, next)))
    setTouched(true)
  }
  return (
    <WidgetFrame
      name={chain}
      ui={ui}
      title={t.title}
      guide={withLabels(t.guide, { label: ui.next })}
      steps={CHAIN_STEPS}
      done={[step === last]}
      say={t.steps[step].text}
      sayKey={step}
      cap={t.cap}
      tried={touched}
    >
      <ol className="xp-chain">
        {t.steps.map((item, index) => (
          <li
            key={item.label}
            className={index === step ? 'is-on' : index < step ? 'is-done' : undefined}
          >
            <button type="button" aria-pressed={index === step} onClick={() => go(index)}>
              <small aria-hidden="true">0{index + 1}</small>
              <b>{item.label}</b>
            </button>
          </li>
        ))}
      </ol>
      <div className="xp-ctl">
        <button
          type="button"
          className="xp-btn"
          aria-label={ui.back}
          disabled={step === 0}
          onClick={() => go(step - 1)}
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="xp-btn is-pri"
          onClick={() => go(step === last ? 0 : step + 1)}
        >
          {step === last ? ui.restart : ui.next}{' '}
          <span aria-hidden="true">{step === last ? '↺' : '→'}</span>
        </button>
        <span className="xp-ctl-count" aria-hidden="true">
          {step + 1} / {t.steps.length}
        </span>
      </div>
    </WidgetFrame>
  )
}

export const Chain = (props: ChainProps) => (
  <CoachHost>
    <ChainInner {...props} />
  </CoachHost>
)

const MUSCLE_STEPS: CoachStep[] = [1, 2, 3].map((n) => ({
  target: `.xp-ctl button:nth-of-type(${n})`,
  watch: '.xp-muscle',
}))

/** Muscle Memory: Trainieren, Pause, Wiedereinstieg — die Kurve baut sich Stück für Stück auf. */
const MuscleInner = ({ texts, ui }: Props) => {
  const t = texts.muscle
  const [phase, setPhase] = useState(0)
  const [reset, setReset] = useState(false)
  const shown = (index: number, name: string) => (phase > index ? `${name} is-shown` : name)
  return (
    <WidgetFrame
      name="muscle"
      ui={ui}
      title={t.title}
      guide={withLabels(
        t.guide,
        ...t.buttons.map((name, index) => ({ label: `${index + 1} · ${name}` })),
      )}
      steps={MUSCLE_STEPS}
      done={[phase >= 1, phase >= 2, phase >= 3]}
      say={phase ? t.say[phase - 1] : reset ? t.sayReset : t.sayIdle}
      sayKey={`${phase}-${reset}`}
      cap={t.cap}
      tried={phase > 0 || reset}
    >
      <svg viewBox="0 0 620 240" className="xp-muscle" role="img" aria-label={t.aria}>
        <rect className="band" x="250" y="20" width="130" height="180" />
        <path className="axis" d="M40 20V200H600" />
        <path className={shown(0, 'sg')} pathLength={1} d="M40 190 C110 182 180 92 250 68" />
        <path className={shown(1, 'sg')} pathLength={1} d="M250 68 C300 86 345 122 380 138" />
        <path
          className={shown(2, 'sg s3')}
          pathLength={1}
          d="M380 138 C408 96 440 64 500 50 L590 42"
        />
        <text className={shown(0, 'th')} x="52" y="40">
          {t.labels[0]}
        </text>
        <text className={shown(1, 'th')} x="262" y="40">
          {t.labels[1]}
        </text>
        <text className={shown(2, 'th')} x="392" y="40">
          {t.labels[2]}
        </text>
        <text className="tk" x="600" y="222" textAnchor="end">
          {t.axisTime} →
        </text>
        <text className="tk" x="40" y="222">
          {t.axisLevel} ↑
        </text>
      </svg>
      <div className="xp-ctl">
        {t.buttons.map((name, index) => (
          <button
            key={name}
            type="button"
            className={index === phase ? 'xp-btn is-pri' : 'xp-btn'}
            disabled={index !== phase}
            onClick={() => setPhase(index + 1)}
          >
            {index + 1} · {name}
          </button>
        ))}
        {phase === 3 ? (
          <button
            type="button"
            className="xp-btn"
            onClick={() => {
              setPhase(0)
              setReset(true)
            }}
          >
            {t.reset}
          </button>
        ) : null}
      </div>
    </WidgetFrame>
  )
}

export const Muscle = (props: Props) => (
  <CoachHost>
    <MuscleInner {...props} />
  </CoachHost>
)

/** Fünf schematische Messpunkte; keine Messdaten. */
const TREND_POINTS = [
  [100, 104],
  [220, 116],
  [340, 88],
  [460, 72],
  [580, 46],
]

/** Das Schildchen sitzt unter dem Regler — darüber stehen die Namen der Messungen. */
const TREND_STEPS: CoachStep[] = [
  { target: '.xp-range input', watch: '.xp-trend', drag: true, tag: 'below' },
]

/** Einzelwert oder Verlauf: mit dem Regler kommen Messungen dazu. */
const TrendInner = ({ texts, ui }: Props) => {
  const t = texts.trend
  const [count, setCount] = useState(1)
  const [touched, setTouched] = useState(false)
  return (
    <WidgetFrame
      name="trend"
      ui={ui}
      title={t.title}
      guide={t.guide}
      steps={TREND_STEPS}
      done={[count >= 3]}
      say={count > 1 ? fill(t.sayMany, { n: count }) : t.sayOne}
      sayKey={count}
      cap={t.cap}
      tried={touched}
    >
      <svg viewBox="0 0 640 210" className="xp-trend" role="img" aria-label={t.aria}>
        <path className="grid" d="M40 30H620M40 90H620M40 150H620" />
        <path className="axis" d="M40 10V180H620" />
        <polyline
          points={TREND_POINTS.slice(0, count)
            .map(([x, y]) => `${x},${y}`)
            .join(' ')}
        />
        {TREND_POINTS.map(([x, y], index) => (
          <g key={x} className={index < count ? 'is-on' : undefined}>
            <circle cx={x} cy={y} r="7" />
            <text x={x} y="200" textAnchor="middle">
              {fill(t.point, { n: index + 1 })}
            </text>
          </g>
        ))}
      </svg>
      <label className="xp-range">
        <span>{t.count}</span>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={count}
          aria-label={t.countAria}
          onChange={(event) => {
            setCount(Number(event.target.value))
            setTouched(true)
          }}
        />
        <output>{count}</output>
      </label>
    </WidgetFrame>
  )
}

export const Trend = (props: Props) => (
  <CoachHost>
    <TrendInner {...props} />
  </CoachHost>
)

const EXER_STEPS: CoachStep[] = [
  { target: '.xp-exer > div:first-child button:first-of-type', watch: '.xp-exer > div:last-child' },
]

/**
 * Exerkine: ein Organ antippen, Botenstoffe laufen zu den Zielen. Welches Organ welchen Botenstoff
 * bildet, sagt der Artikel nicht — deshalb gehen von jedem Organ dieselben Punkte aus.
 */
const ExerkinesInner = ({ texts, ui }: Props) => {
  const t = texts.exer
  const boxRef = useRef<HTMLDivElement>(null)
  const targetRefs = useRef<Array<HTMLDivElement | null>>([])
  const [sent, setSent] = useState<{ index: number; turn: number } | null>(null)

  const send = (index: number, button: HTMLButtonElement) => {
    setSent((current) => ({ index, turn: (current?.turn ?? 0) + 1 }))
    const box = boxRef.current
    if (!box) return
    const frame = box.getBoundingClientRect()
    const from = button.getBoundingClientRect()
    const x0 = from.right - frame.left - 4
    const y0 = from.top + from.height / 2 - frame.top
    targetRefs.current.forEach((target, position) => {
      if (!target) return
      const hit = () => {
        target.classList.add('is-hit')
        window.setTimeout(() => target.classList.remove('is-hit'), 650)
      }
      if (prefersReducedMotion() || !box.animate) {
        hit()
        return
      }
      const to = target.getBoundingClientRect()
      const x1 = to.left - frame.left + 4
      const y1 = to.top + to.height / 2 - frame.top
      const dot = document.createElement('i')
      dot.className = position === 3 ? 'xp-dot is-maybe' : 'xp-dot'
      box.append(dot)
      dot.animate(
        [
          { transform: `translate(${x0}px,${y0}px) scale(.4)`, opacity: 0 },
          {
            transform: `translate(${x0 + (x1 - x0) * 0.5}px,${y0 + (y1 - y0) * 0.5 - 22}px)`,
            opacity: 1,
            offset: 0.5,
          },
          { transform: `translate(${x1}px,${y1}px) scale(.8)`, opacity: 1 },
        ],
        { duration: 900, delay: position * 110, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' },
      ).onfinish = () => {
        dot.remove()
        hit()
      }
    })
  }

  const say = !sent
    ? t.sayIdle
    : `${sent.index === 3 ? t.sayOther : fill(t.saySent, { name: t.sources[sent.index] })} ${t.sayTail}`

  return (
    <WidgetFrame
      name="exer"
      ui={ui}
      title={t.title}
      guide={withLabels(t.guide, { label: t.sources[0] })}
      steps={EXER_STEPS}
      done={[sent !== null]}
      say={say}
      sayKey={sent?.turn ?? 0}
      cap={t.cap}
      tried={sent !== null}
    >
      <div className="xp-exer" ref={boxRef}>
        <div>
          <small>{t.from}</small>
          {t.sources.map((name, index) => (
            <button
              key={name}
              type="button"
              className="xp-btn"
              onClick={(event) => send(index, event.currentTarget)}
            >
              {name}
            </button>
          ))}
        </div>
        <div>
          <small>{t.to}</small>
          {t.targets.map((name, index) => (
            <div
              key={name}
              ref={(element) => {
                targetRefs.current[index] = element
              }}
              className={index === 3 ? 'xp-target is-maybe' : 'xp-target'}
            >
              {name}
              {index === 3 ? <i>{t.maybe}</i> : null}
            </div>
          ))}
        </div>
      </div>
      <p className="xp-chips">
        {t.studied}
        {t.molecules.map((name) => (
          <span key={name}>{name}</span>
        ))}
      </p>
    </WidgetFrame>
  )
}

export const Exerkines = (props: Props) => (
  <CoachHost>
    <ExerkinesInner {...props} />
  </CoachHost>
)

const SORT_STEPS: CoachStep[] = [{ target: '.xp-sort-bt', watch: '.xp-sort-pg' }]

/** Sinnvoll oder nicht: sechs Aussagen einordnen, danach die Übersicht. */
const SorterInner = ({ texts, ui }: Props) => {
  const t = texts.sort
  // abwechselnd sinnvoll / nicht sinnvoll
  const statements = t.usefulItems.flatMap((text, index) => [
    { text, useful: true },
    { text: t.notUsefulItems[index], useful: false },
  ])
  const [answers, setAnswers] = useState<boolean[]>([])
  const [shownCount, setShownCount] = useState(0)

  const total = statements.length
  const done = shownCount >= total
  const waiting = answers.length > shownCount
  const right = answers.filter(Boolean).length
  // Nach jeder Antwort bleibt die Rückmeldung kurz stehen, dann folgt die nächste Aussage.
  useEffect(() => {
    if (!waiting) return undefined
    const timer = window.setTimeout(
      () => setShownCount((current) => current + 1),
      prefersReducedMotion() ? 200 : 1100,
    )
    return () => window.clearTimeout(timer)
  }, [waiting])
  const answer = (useful: boolean) => {
    if (waiting || done) return
    setAnswers((current) => [...current, statements[shownCount].useful === useful])
  }
  const lastAnswered = answers.length - 1
  const say =
    answers.length === 0
      ? t.sayIdle
      : done
        ? fill(t.result, { right, total })
        : `${answers[lastAnswered] ? t.right : t.wrong} ${
            statements[lastAnswered].useful ? t.isUseful : t.isNotUseful
          }`

  return (
    <WidgetFrame
      name="sort"
      ui={ui}
      title={t.title}
      guide={withLabels(t.guide, { label: t.useful, other: t.notUseful })}
      steps={SORT_STEPS}
      done={[answers.length >= 1]}
      say={say}
      sayKey={`${answers.length}-${done}`}
      tried={answers.length > 0}
    >
      {done ? (
        <div className="xp-sort-res">
          <div>
            <b>{t.useful}</b>
            <ul>
              {t.usefulItems.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
          <div>
            <b>{t.notUseful}</b>
            <ul>
              {t.notUsefulItems.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
          <div>
            <b>{t.important}</b>
            <ul>
              {t.importantItems.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            className="xp-btn"
            onClick={() => {
              setAnswers([])
              setShownCount(0)
            }}
          >
            {t.again}
          </button>
        </div>
      ) : (
        <>
          <div className="xp-sort-pg" aria-hidden="true">
            {statements.map((item, index) => (
              <i
                key={item.text}
                className={
                  index < answers.length
                    ? answers[index]
                      ? 'is-right'
                      : 'is-wrong'
                    : index === shownCount
                      ? 'is-now'
                      : undefined
                }
              />
            ))}
          </div>
          <p className="xp-sort-st">{statements[shownCount].text}</p>
          <div className="xp-sort-bt">
            <button
              type="button"
              className="xp-btn"
              disabled={waiting}
              onClick={() => answer(true)}
            >
              {t.useful}
            </button>
            <button
              type="button"
              className="xp-btn"
              disabled={waiting}
              onClick={() => answer(false)}
            >
              {t.notUseful}
            </button>
          </div>
        </>
      )}
    </WidgetFrame>
  )
}
export const Sorter = (props: Props) => (
  <CoachHost>
    <SorterInner {...props} />
  </CoachHost>
)
