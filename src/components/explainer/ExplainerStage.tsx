import { useEffect, useRef, useState } from 'react'
import { StageCrumbs } from '../sub/SubStage'
import type { BreadcrumbItem } from '../ui/Breadcrumbs'
import { prefersReducedMotion } from '../home/motion'
import type { ExplainerContent } from '../../content/articles/was-ist-epigenetik'

type Props = {
  title: string
  breadcrumbs: BreadcrumbItem[]
  stage: ExplainerContent['stage']
  /** Anker des Artikels unter der Bühne. */
  bodyId: string
}

/** Sieben Zustände: der Titel und die sechs Schritte der Reise. */
const STATES = 7

/**
 * SC-031 (Owner 2026-11-18, Entwurf „Reise ins Innere"): große Bühne am Kopf des Artikels. Sie
 * bleibt beim Scrollen stehen; die Zeichnung zoomt vom Körper über Zelle, Zellkern und Verpackung
 * bis zur Markierung an der DNA, links wechselt der Text. Alle sieben Textblöcke — die Überschrift
 * der Seite und die sechs Schritte — stehen von Anfang an im HTML und liegen übereinander; sichtbar
 * ist der zum Scroll-Stand passende (`is-on`). So bleibt die Überschrift eine echte, sichtbare
 * `h1`, und Vorleseprogramme lesen die ganze Reise ohne Scrollen. Die Zeichnung wird nachgeladen.
 * `data-sub-stage`: Die Lichtlinie der Unterseiten (SubTrace) beginnt am Fuß der Bühne.
 */
const ExplainerStage = ({ title, breadcrumbs, stage, bodyId }: Props) => {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const footRef = useRef<HTMLDivElement>(null)
  const tickRefs = useRef<Array<HTMLElement | null>>([])
  const progressRef = useRef(0)
  const [state, setState] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return undefined
    const still = prefersReducedMotion()
    let scene: { resize: () => void; draw: (progress: number, now: number) => void } | null = null
    let frame = 0
    let visible = true
    let alive = true

    const loop = (now: number) => {
      scene?.draw(progressRef.current, now)
      if (visible && !still) frame = requestAnimationFrame(loop)
    }
    const kick = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(loop)
    }
    const measure = () => {
      const bounds = section.getBoundingClientRect()
      const total = bounds.height - innerHeight
      const progress = Math.max(0, Math.min(0.9999, total > 0 ? -bounds.top / total : 0)) * STATES
      progressRef.current = progress
      tickRefs.current.forEach((tick, index) => {
        tick?.style.setProperty('--f', String(Math.max(0, Math.min(1, progress - (index + 1)))))
      })
      setState(Math.floor(progress))
      if (still) kick()
    }
    const onResize = () => {
      scene?.resize()
      measure()
      kick()
    }
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false
      if (visible) kick()
      else cancelAnimationFrame(frame)
    })
    observer.observe(section)
    addEventListener('scroll', measure, { passive: true })
    addEventListener('resize', onResize)
    measure()

    void import('./zoomScene').then(({ createZoomScene }) => {
      if (!alive) return
      scene = createZoomScene(canvas, {
        labels: stage.canvas,
        headerHeight: () => document.querySelector('header')?.getBoundingClientRect().height ?? 0,
        textTop: () =>
          (textRef.current?.getBoundingClientRect().top ?? innerHeight * 0.5) -
          canvas.getBoundingClientRect().top,
        footTop: () =>
          (footRef.current?.getBoundingClientRect().top ?? innerHeight - 122) -
          canvas.getBoundingClientRect().top,
        still,
      })
      scene?.resize()
      kick()
    })

    return () => {
      alive = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      removeEventListener('scroll', measure)
      removeEventListener('resize', onResize)
    }
  }, [stage.canvas])

  const jump = (index: number) => {
    const section = sectionRef.current
    if (!section) return
    const total = section.offsetHeight - innerHeight
    scrollTo({
      top: scrollY + section.getBoundingClientRect().top + ((index + 0.45) / STATES) * total,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  return (
    <section
      ref={sectionRef}
      className="xp-stage"
      aria-labelledby="explainer-title"
      data-explainer-stage
      data-sub-stage
      data-state={state}
    >
      <div className="xp-pin">
        <canvas ref={canvasRef} className="xp-cv" aria-hidden="true" />
        <div className="sc025-inner xp-top pt-page-top xl:pt-page-top-xl">
          <StageCrumbs items={breadcrumbs} />
        </div>
        <div className="sc025-inner xp-mid">
          <div className="xp-txt" ref={textRef}>
            <div className={state === 0 ? 'xp-st is-on' : 'xp-st'}>
              <p className="sc025-kicker">{stage.eyebrow}</p>
              <h1 id="explainer-title" className="xp-word">
                {title}
              </h1>
              <p className="xp-sen">{stage.intro}</p>
            </div>
            {stage.steps.map((item, index) => (
              <div
                key={item.tick}
                className={state === index + 1 ? 'xp-st is-on' : 'xp-st'}
                data-explainer-step={index + 1}
              >
                <p className="sc025-kicker">
                  0{index + 1} · {item.tick}
                </p>
                <p className="xp-word">{item.word}</p>
                <p className="xp-sen">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="sc025-inner xp-bar" ref={footRef}>
          <ol className="xp-ticks" aria-label={stage.label}>
            {stage.steps.map((item, index) => (
              <li key={item.tick} className={index + 1 === state ? 'is-on' : undefined}>
                <button
                  type="button"
                  aria-label={`${index + 1} · ${item.tick}`}
                  aria-current={index + 1 === state ? 'step' : undefined}
                  onClick={() => jump(index + 1)}
                >
                  <i
                    ref={(element) => {
                      tickRefs.current[index] = element
                    }}
                  />
                  <span aria-hidden="true">
                    0{index + 1} · {item.tick}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="xp-stage-foot">
            <p className="xp-hint" aria-hidden="true">
              {stage.hint}
            </p>
            <span className="xp-cnt" aria-hidden="true">
              0{state} / 0{stage.steps.length}
            </span>
            <a href={`#${bodyId}`} className="xp-skip">
              {stage.skip} <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExplainerStage
