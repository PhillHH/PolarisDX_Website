import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { fill } from '../../content/articles/was-ist-epigenetik'
import { prefersReducedMotion } from '../home/motion'
import { withLabels, type CoachStep } from './useCoach'
import {
  CoachHost,
  InfluenceIcon,
  WidgetFrame,
  type UiTexts,
  type WidgetTexts,
} from './widgetParts'

type Props = { texts: WidgetTexts; ui: UiTexts }

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

/** Buchstaben der gezeigten Sequenz; sie ändern sich nie — das ist die Aussage des Bausteins. */
const SEQUENCE = 'ATGCCGTACGATCGGA'.split('')
/**
 * Ausgangslage der 16 Regler und Ausschlag je Reiz. Fest hinterlegt (kein Zufall zur Laufzeit) und
 * rein schematisch: Der Baustein zeigt das Prinzip, keine Messdaten und keine Wirkrichtung.
 */
const FADERS = (() => {
  let seed = 7
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  const base = SEQUENCE.map(() => 0.3 + random() * 0.4)
  const shift = Array.from({ length: 6 }, () =>
    SEQUENCE.map(() => (random() < 0.42 ? (random() - 0.5) * 0.7 : 0)),
  )
  return { base, shift }
})()

/** Mischpult: Reize zuschalten, die Regler bewegen sich, die Sequenz bleibt stehen. */
const PultInner = ({ texts, ui }: Props) => {
  const t = texts.pult
  const [active, setActive] = useState<boolean[]>(() => Array<boolean>(6).fill(false))
  const [touched, setTouched] = useState(false)
  const levels = FADERS.base.map((start, index) =>
    clamp(
      start + active.reduce((sum, on, reiz) => sum + (on ? FADERS.shift[reiz][index] : 0), 0),
      0.06,
      0.94,
    ),
  )
  const moved = levels.map((level, index) => Math.abs(level - FADERS.base[index]) > 0.02)
  const count = active.filter(Boolean).length
  const say = !touched
    ? t.sayIdle
    : count
      ? fill(t.sayActive, { n: count, m: moved.filter(Boolean).length })
      : t.sayNone
  // Zweiter Handgriff: ein Reiz, der noch aus ist — am liebsten der vierte, sonst der erste.
  const second = active[3] ? (active[0] ? 1 : 0) : 3
  const steps: CoachStep[] = [
    { target: '.xp-pult-sw li:nth-child(1) button', watch: '.xp-faders' },
    { target: `.xp-pult-sw li:nth-child(${second + 1}) button`, watch: '.xp-seq' },
  ]

  return (
    <WidgetFrame
      name="pult"
      ui={ui}
      title={t.title}
      guide={withLabels(
        t.guide,
        { label: texts.influences.short[0] },
        { label: texts.influences.short[second] },
      )}
      steps={steps}
      done={[count >= 1, count >= 2]}
      say={say}
      sayKey={active.join()}
      cap={t.cap}
      tried={touched}
      className="xp-pult"
    >
      <ul className="xp-pult-sw">
        {texts.influences.short.map((name, index) => (
          <li key={name}>
            <button
              type="button"
              role="switch"
              aria-checked={active[index]}
              onClick={() => {
                setTouched(true)
                setActive((current) => current.map((on, i) => (i === index ? !on : on)))
              }}
            >
              <InfluenceIcon index={index} />
              <span>{name}</span>
              <i aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <div>
        <div className="xp-faders" aria-hidden="true">
          {levels.map((level, index) => (
            <i
              key={index}
              className={moved[index] ? 'is-moved' : undefined}
              style={{ '--v': level.toFixed(3) } as CSSProperties}
            />
          ))}
        </div>
        <div className="xp-seq" aria-hidden="true">
          {SEQUENCE.map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </div>
        <p className="xp-legend">
          <span>{t.legendActivity}</span>
          <span>{t.legendSequence}</span>
        </p>
      </div>
    </WidgetFrame>
  )
}
export const Pult = (props: Props) => (
  <CoachHost>
    <PultInner {...props} />
  </CoachHost>
)

/**
 * Wirkung einer Methylgruppe je Stelle (−1 geringer, +1 stärker). Frei gewählt: Der Artikel sagt
 * nur, dass die Wirkung von der Position abhängt — genau das lässt der Baustein erleben.
 */
const SITE_EFFECT = [-1, -1, 1, -1, 1, -1, -1, 1]
/** Geführt werden Stelle 1 (stellt schwächer) und Stelle 3 (stellt stärker): der Gegensatz. */
const METHYL_STEPS: CoachStep[] = [
  { target: '.xp-sites button:nth-of-type(1)', watch: '.xp-meter' },
  { target: '.xp-sites button:nth-of-type(3)', watch: '.xp-meter' },
]

const Methyl = ({ texts, ui }: Props) => {
  const t = texts.methyl
  const [marks, setMarks] = useState<boolean[]>(() => Array<boolean>(8).fill(false))
  const [say, setSay] = useState({ text: t.sayIdle, turn: 0 })
  const level = clamp(
    50 + marks.reduce((sum, on, index) => sum + (on ? SITE_EFFECT[index] * 13 : 0), 0),
    5,
    95,
  )
  const toggle = (index: number) => {
    const next = !marks[index]
    setMarks((current) => current.map((on, i) => (i === index ? next : on)))
    const template = next ? (SITE_EFFECT[index] < 0 ? t.saySetLower : t.saySetHigher) : t.sayRemoved
    setSay((current) => ({ text: fill(template, { n: index + 1 }), turn: current.turn + 1 }))
  }
  return (
    <WidgetFrame
      name="methyl"
      ui={ui}
      title={t.title}
      guide={withLabels(
        t.guide,
        { label: fill(t.site, { n: 1 }) },
        { label: fill(t.site, { n: 3 }) },
      )}
      steps={METHYL_STEPS}
      done={[marks[0], marks[2]]}
      say={say.text}
      sayKey={say.turn}
      cap={t.cap}
      tried={say.turn > 0}
    >
      <div className="xp-sites" role="group" aria-label={t.group}>
        {marks.map((on, index) => (
          <button
            key={index}
            type="button"
            aria-pressed={on}
            aria-label={fill(t.site, { n: index + 1 })}
            onClick={() => toggle(index)}
          >
            <i aria-hidden="true" />
            <small aria-hidden="true">{index + 1}</small>
          </button>
        ))}
      </div>
      <div className="xp-meter">
        <span>{t.meter}</span>
        <div>
          <i style={{ '--v': `${level}%` } as CSSProperties} />
        </div>
        <p>
          <span>{t.lower}</span>
          <span>{t.higher}</span>
        </p>
      </div>
    </WidgetFrame>
  )
}

/** Lage der fünf Spulen: locker verteilt und dicht gepackt. */
const SPOOLS_LOOSE = [90, 195, 300, 405, 510]
const SPOOLS_DENSE = [222, 261, 300, 339, 378]
const HISTONE_STEPS: CoachStep[] = [
  { target: '.xp-range input', watch: '.xp-histone', drag: true },
  { target: '.xp-range input', watch: '.xp-histone', drag: true },
]

const Histone = ({ texts, ui }: Props) => {
  const t = texts.histone
  const [value, setValue] = useState(12)
  const [touched, setTouched] = useState(false)
  const valueRef = useRef(12)
  const svgRef = useRef<SVGSVGElement>(null)
  const readerRef = useRef<SVGCircleElement>(null)
  const trailRef = useRef<SVGPathElement>(null)
  const dense = value > 55
  const packed = value / 100

  // Der Punkt „liest" die DNA von links nach rechts. Ist sie dicht gepackt, kommt er nicht durch.
  useEffect(() => {
    const svg = svgRef.current
    const reader = readerRef.current
    const trail = trailRef.current
    if (!svg || !reader || !trail || prefersReducedMotion()) return undefined
    let frame = 0
    let x = 20
    let direction = 1
    let wait = 0
    let last = performance.now()
    let visible = false
    const tick = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000)
      last = now
      const ratio = valueRef.current / 100
      const blocked = ratio > 0.55
      if (wait > 0) wait -= delta
      else {
        x += direction * 150 * delta
        const stop = blocked
          ? SPOOLS_LOOSE[0] + (SPOOLS_DENSE[0] - SPOOLS_LOOSE[0]) * ratio - 40
          : 580
        if (direction > 0 && x >= stop) {
          x = stop
          direction = -1
          wait = blocked ? 0.5 : 0.2
        } else if (direction < 0 && x <= 20) {
          x = 20
          direction = 1
          wait = 0.3
        }
      }
      reader.setAttribute('cx', x.toFixed(1))
      trail.setAttribute('d', `M20 80H${x.toFixed(1)}`)
      if (visible) frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false
      cancelAnimationFrame(frame)
      if (visible) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    })
    observer.observe(svg)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <WidgetFrame
      name="histone"
      ui={ui}
      title={t.title}
      guide={withLabels(t.guide, { label: t.dense }, { label: t.loose })}
      steps={HISTONE_STEPS}
      done={[dense, !dense]}
      say={dense ? t.sayDense : t.sayLoose}
      sayKey={dense ? 'dense' : 'loose'}
      cap={t.cap}
      tried={touched}
    >
      <svg ref={svgRef} viewBox="0 0 600 150" className="xp-histone" aria-hidden="true">
        <path className="dna" d="M20 80H580" />
        <path ref={trailRef} className="trail" d="M20 80H20" />
        {SPOOLS_LOOSE.map((loose, index) => (
          <circle
            key={loose}
            className="spool"
            r="27"
            cy="80"
            cx={loose + (SPOOLS_DENSE[index] - loose) * packed}
          />
        ))}
        <circle ref={readerRef} className="reader" r="7" cx="20" cy="80" />
        <text className="lb" x="300" y="140" textAnchor="middle">
          {dense ? t.stateDense : t.stateLoose}
        </text>
      </svg>
      <label className="xp-range">
        <span>{t.loose}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          aria-label={t.aria}
          onChange={(event) => {
            const next = Number(event.target.value)
            valueRef.current = next
            setValue(next)
            setTouched(true)
          }}
        />
        <span>{t.dense}</span>
      </label>
    </WidgetFrame>
  )
}

const RNA_STEPS: CoachStep[] = [{ target: '.xp-w-body > .xp-btn', watch: '.xp-rna' }]

const Rna = ({ texts, ui }: Props) => {
  const t = texts.rna
  const [docked, setDocked] = useState(false)
  const [touched, setTouched] = useState(false)
  return (
    <WidgetFrame
      name="rna"
      ui={ui}
      title={t.title}
      guide={withLabels(t.guide, { label: t.dock })}
      steps={RNA_STEPS}
      done={[docked]}
      say={!touched ? t.sayIdle : docked ? t.sayDocked : t.sayFree}
      sayKey={`${touched}-${docked}`}
      cap={t.cap}
      tried={touched}
    >
      <svg
        viewBox="0 0 600 150"
        className={docked ? 'xp-rna is-docked' : 'xp-rna'}
        aria-hidden="true"
      >
        <path
          className="mrna"
          d="M30 96q22.5 -24 45 0t45 0t45 0t45 0t45 0t45 0t45 0t45 0t45 0t45 0t45 0t45 0"
        />
        <rect className="hl" x="246" y="66" width="108" height="56" />
        <g className="mi">
          <path d="M255 80q22.5 -24 45 0t45 0" />
        </g>
        <text className="lb" x="30" y="140">
          {t.mrna}
        </text>
        <text className="lb is-acc" x="570" y="140" textAnchor="end">
          {t.mirna}
        </text>
      </svg>
      <button
        type="button"
        className="xp-btn is-pri"
        aria-pressed={docked}
        onClick={() => {
          setDocked((current) => !current)
          setTouched(true)
        }}
      >
        {docked ? t.undock : t.dock}
      </button>
    </WidgetFrame>
  )
}

/** Die drei Mechanismen als Reiter: Methylierung, Histone, RNA. */
export const Mechanisms = ({ texts, ui }: Props) => {
  const [tab, setTab] = useState(0)
  const tabs = [texts.methyl.tab, texts.histone.tab, texts.rna.tab]
  return (
    <div data-explainer-widget="mechanisms">
      <div className="xp-tabs" role="tablist">
        {tabs.map((name, index) => (
          <button
            key={name}
            type="button"
            role="tab"
            id={`xp-tab-${index}`}
            aria-selected={tab === index}
            aria-controls="xp-tabpanel"
            onClick={() => setTab(index)}
          >
            <small aria-hidden="true">0{index + 1}</small>
            {name}
          </button>
        ))}
      </div>
      <div
        className="xp-tabpanel"
        id="xp-tabpanel"
        role="tabpanel"
        aria-labelledby={`xp-tab-${tab}`}
      >
        {/* Jeder Reiter hat seine eigene Führung; sie beginnt beim Wechsel von vorn. */}
        <CoachHost key={tab}>
          {tab === 0 ? (
            <Methyl texts={texts} ui={ui} />
          ) : tab === 1 ? (
            <Histone texts={texts} ui={ui} />
          ) : (
            <Rna texts={texts} ui={ui} />
          )}
        </CoachHost>
      </div>
    </div>
  )
}
