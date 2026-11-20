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
/** Selbstlauf: so lange dauert die Fahrt zum nächsten Schritt, so lange die Lesepause dort. */
const TRAVEL_MS = 1500
const READ_MS = 3200
/** Der Selbstlauf beginnt, wenn die Seite so lange unberührt und frei oben steht. */
const IDLE_MS = 2400
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
const ease = (t: number) => t * t * (3 - 2 * t)

/**
 * Liegt etwas über der Seite oder ist sie nicht zu sehen? Cookie-Hinweis (`--cookie-banner-height`
 * setzt der CookieBanner, solange er offen ist), ein Dialog, gesperrtes Scrollen (Menü, Suche) oder
 * ein Tab im Hintergrund. Dann wartet der Selbstlauf.
 */
const covered = () => {
  const banner = document.documentElement.style.getPropertyValue('--cookie-banner-height')
  return (
    document.hidden ||
    (banner !== '' && banner !== '0px') ||
    document.body.style.overflow === 'hidden' ||
    document.querySelector('[aria-modal="true"]') !== null
  )
}

/**
 * SC-031 (Owner 2026-11-18, Entwurf „Reise ins Innere"): große Bühne am Kopf des Artikels. Sie
 * bleibt beim Scrollen stehen; die Zeichnung zoomt vom Körper über Zelle, Zellkern und Verpackung
 * bis zur Markierung an der DNA, links wechselt der Text. Alle sieben Textblöcke — die Überschrift
 * der Seite und die sechs Schritte — stehen von Anfang an im HTML und liegen übereinander; sichtbar
 * ist der zum Scroll-Stand passende (`is-on`). So bleibt die Überschrift eine echte, sichtbare
 * `h1`, und Vorleseprogramme lesen die ganze Reise ohne Scrollen. Die Zeichnung wird nachgeladen.
 * `data-sub-stage`: Die Lichtlinie der Unterseiten (SubTrace) beginnt am Fuß der Bühne.
 *
 * SC-033 (Owner 2026-11-19, Entwurf „Geführt": „mehr zum Scrollen animiert … vielleicht mit einer
 * Art Automatismus, vor allem mobil"): Die Reise läuft von selbst. Steht die Seite ein paar
 * Sekunden unberührt und frei oben, scrollt sie sanft von Schritt zu Schritt, mit Pause zum Lesen.
 * Jede Eingabe übernimmt; der Knopf hält an und setzt fort. Wer weniger Bewegung wünscht, bekommt
 * keinen Selbststart — der Knopf blättert dann ohne Fahrt.
 */
const ExplainerStage = ({ title, breadcrumbs, stage, bodyId }: Props) => {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const footRef = useRef<HTMLDivElement>(null)
  const tickRefs = useRef<Array<HTMLElement | null>>([])
  const progressRef = useRef(0)
  const controls = useRef<{ toggle: () => void; jump: (index: number) => void }>({
    toggle: () => {},
    jump: () => {},
  })
  const [state, setState] = useState(0)
  const [playing, setPlaying] = useState(false)

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
    const span = () => section.offsetHeight - innerHeight
    const top = () => scrollY + section.getBoundingClientRect().top
    const measure = () => {
      const bounds = section.getBoundingClientRect()
      const total = bounds.height - innerHeight
      const progress = clamp(total > 0 ? -bounds.top / total : 0, 0, 0.9999) * STATES
      progressRef.current = progress
      tickRefs.current.forEach((tick, index) => {
        tick?.style.setProperty('--f', String(clamp(progress - (index + 1), 0, 1)))
      })
      setState(Math.floor(progress))
      if (still) kick()
    }
    const onResize = () => {
      scene?.resize()
      measure()
      kick()
    }

    // ---- Selbstlauf: Die Seite scrollt von Schritt zu Schritt, mit Pause zum Lesen. ----
    /** Kennung des laufenden Selbstlaufs; 0 = es läuft keiner. */
    let run = 0
    let runs = 0
    let pause = 0
    let glide = 0
    /** Die Scroll-Lage, die der Selbstlauf zuletzt selbst gesetzt hat. */
    let ownY = 0
    /** Darf der Selbstlauf noch von selbst beginnen? */
    let armed = !still
    let idleSince = performance.now()

    const stop = () => {
      if (!run) return
      run = 0
      window.clearTimeout(pause)
      cancelAnimationFrame(glide)
      setPlaying(false)
    }
    /** Hat jemand anderes gescrollt (Scrollleiste, Tastatur, Sprungmarke, Suche im Browser)? */
    const moved = () => Math.abs(scrollY - ownY) > 2
    const glideTo = (to: number, duration: number, then: () => void) => {
      const mine = run
      const from = scrollY
      const begin = performance.now()
      ownY = from
      const step = (now: number) => {
        if (run !== mine) return
        if (moved() || covered()) {
          stop()
          return
        }
        const t = duration > 0 ? clamp((now - begin) / duration, 0, 1) : 1
        scrollTo(0, from + (to - from) * ease(t))
        ownY = scrollY
        if (t < 1) glide = requestAnimationFrame(step)
        else then()
      }
      glide = requestAnimationFrame(step)
    }
    const next = () => {
      const mine = run
      if (!mine) return
      if (moved() || covered()) {
        stop()
        return
      }
      const current = Math.floor(progressRef.current)
      if (current >= STATES - 1) {
        stop()
        return
      }
      glideTo(top() + ((current + 1.45) / STATES) * span(), still ? 0 : TRAVEL_MS, () => {
        pause = window.setTimeout(() => {
          if (run === mine) next()
        }, READ_MS)
      })
    }
    const start = () => {
      armed = false
      runs += 1
      run = runs
      const mine = run
      ownY = scrollY
      setPlaying(true)
      // Am Ende angekommen: zurück an den Anfang und von vorn.
      if (Math.floor(progressRef.current) >= STATES - 1) {
        glideTo(top(), still ? 0 : 700, () => {
          pause = window.setTimeout(() => {
            if (run === mine) next()
          }, 900)
        })
      } else next()
    }
    /** Jede echte Eingabe übernimmt: Der Selbstlauf hält an. */
    const takeOver = (event: Event) => {
      if (!event.isTrusted) return
      idleSince = performance.now()
      // Scrollrad und Tastatur zeigen: Hier steuert jemand selbst — kein Selbststart mehr.
      if (event.type === 'wheel' || event.type === 'keydown') armed = false
      if ((event.target as Element | null)?.closest?.('[data-stage-control]')) return
      stop()
    }
    const onHide = () => {
      if (document.hidden) stop()
    }
    // Selbststart: sobald die Seite frei, sichtbar und eine Weile unberührt oben steht.
    const watch = still
      ? 0
      : window.setInterval(() => {
          if (scrollY >= 40) armed = false
          if (!armed) {
            window.clearInterval(watch)
            return
          }
          if (covered()) idleSince = performance.now()
          else if (performance.now() - idleSince >= IDLE_MS) start()
        }, 400)

    controls.current = {
      toggle: () => {
        if (run) stop()
        else start()
      },
      jump: (index: number) => {
        armed = false
        stop()
        scrollTo({
          top: top() + ((index + 0.45) / STATES) * span(),
          behavior: still ? 'auto' : 'smooth',
        })
      },
    }

    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false
      if (visible) kick()
      else cancelAnimationFrame(frame)
    })
    observer.observe(section)
    addEventListener('scroll', measure, { passive: true })
    addEventListener('resize', onResize)
    addEventListener('wheel', takeOver, { passive: true })
    addEventListener('touchstart', takeOver, { passive: true })
    addEventListener('keydown', takeOver)
    addEventListener('mousedown', takeOver)
    document.addEventListener('visibilitychange', onHide)
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
      stop()
      window.clearInterval(watch)
      cancelAnimationFrame(frame)
      observer.disconnect()
      removeEventListener('scroll', measure)
      removeEventListener('resize', onResize)
      removeEventListener('wheel', takeOver)
      removeEventListener('touchstart', takeOver)
      removeEventListener('keydown', takeOver)
      removeEventListener('mousedown', takeOver)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [stage.canvas])

  /** Am letzten Schritt angekommen und nichts läuft: Der Hinweis zeigt nach unten zum Artikel. */
  const ended = state === STATES - 1 && !playing
  const cueName = ended ? ' is-on is-end' : playing ? ' is-on is-auto' : state === 0 ? ' is-on' : ''

  return (
    <section
      ref={sectionRef}
      className="xp-stage"
      aria-labelledby="explainer-title"
      data-explainer-stage
      data-sub-stage
      data-state={state}
      data-playing={playing ? 'true' : undefined}
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
                  data-stage-control
                  onClick={() => controls.current.jump(index + 1)}
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
            <button
              type="button"
              className={playing ? 'xp-play is-on' : 'xp-play'}
              aria-label={playing ? stage.pause : stage.play}
              data-stage-control
              onClick={() => controls.current.toggle()}
            >
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path d={playing ? 'M2 1h3v10H2zM7 1h3v10H7z' : 'M2.5 1l8.5 5-8.5 5z'} />
              </svg>
              <span className="xp-play-t">{playing ? stage.pause : stage.play}</span>
            </button>
            {/* Hinweis in einfachen Worten; Maus und Finger bekommen je ihren Satz (CSS). Für
                Vorleseprogramme stehen der Knopf und die sechs Schritte bereit. */}
            <p className={`xp-cue${cueName}`} aria-hidden="true">
              <i className="xp-cue-i">
                <b />
                <b />
                <b />
              </i>
              {ended ? (
                stage.cueEnd
              ) : playing ? (
                <span className="xp-touch">{stage.cueAuto}</span>
              ) : (
                <>
                  <span className="xp-mouse">{stage.hint}</span>
                  <span className="xp-touch">{stage.cueTouch}</span>
                </>
              )}
            </p>
            <span className="xp-cnt" aria-hidden="true">
              0{state} / 0{stage.steps.length}
            </span>
            <a href={`#${bodyId}`} className={ended ? 'xp-skip is-end' : 'xp-skip'}>
              {stage.skip} <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExplainerStage
