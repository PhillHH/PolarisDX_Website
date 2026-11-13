import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  FILM_FRONT_IMAGE,
  FILM_SIZES,
  FILM_TOP_IMAGE,
  PILLAR_READER_IMAGE,
} from '../../assets/home/homeImages'
import { Button } from '../ui/Button'
import { ResponsivePicture } from '../ui/ResponsivePicture'
import { HOME_TARGETS } from './homeTargets'
import type { IglooScene } from './igloo3d/iglooScene'
import { prefersReducedMotion } from './motion'

type FilmStep = { title: string; text: string }

const VIEWS = [FILM_FRONT_IMAGE, FILM_TOP_IMAGE, PILLAR_READER_IMAGE]

/**
 * Das 3D-Gerät ist eine Zugabe: nie bei „Bewegung reduzieren", nie im Datensparmodus und nur mit
 * WebGL 2. In allen anderen Fällen bleiben die drei Gerätebilder stehen.
 */
function canShowDevice3d(): boolean {
  if (prefersReducedMotion() || !('WebGL2RenderingContext' in window)) return false
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  if (connection?.saveData) return false
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'))
  } catch {
    return false
  }
}

function headlineLines(title: string): string[] {
  const parts = title.match(/[^.!?]+[.!?]+\s*/g)
  return parts && parts.join('') === title && parts.length === VIEWS.length ? parts : []
}

/**
 * SC-025 Nachtrag „Lichtfilm" (Owner 2026-11-12): Die Bühne bleibt beim Scrollen stehen, der
 * IglooPro wechselt durch drei Ansichten (Probe · Messung · Ergebnis), der Lichtstrahl folgt
 * seinem Lichtring. Ohne JS und bei „Bewegung reduzieren" stehen alle drei Phasen untereinander.
 *
 * SC-026 (Owner 2026-11-13, Lichtstimmung „Dramatisch"): Nach dem Laden der Seite wird der
 * IglooPro als 3D-Modell mit Adapter und Testkassette nachgeladen und blendet über die Bilder.
 */
const HomeHero = () => {
  const { t } = useTranslation('home')
  const title = t('hero.title')
  const lines = headlineLines(title)
  const rawSteps = t('sc025.hero.steps', { returnObjects: true }) as FilmStep[] | string
  const steps = Array.isArray(rawSteps) ? rawSteps.slice(0, VIEWS.length) : []
  const deviceStart = t('sc025.hero.device.start')
  const deviceRunning = t('sc025.hero.device.running')
  const deviceAnalyte = t('sc025.hero.device.analyte')
  const deviceVerdict = t('sc025.hero.device.verdict')
  const deviceRange = t('sc025.hero.device.range')
  // Wechselt die Sprache, bekommt die Szene eine frische Zeichenfläche.
  const deviceKey = [deviceStart, deviceRunning, deviceAnalyte, deviceVerdict, deviceRange].join(
    '|',
  )
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const phasesRef = useRef<HTMLDivElement>(null)
  const viewsRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState(0)
  const [started, setStarted] = useState(false)
  const [ready, setReady] = useState(false)
  const [device3d, setDevice3d] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const readyFrame = window.requestAnimationFrame(() => setReady(true))
    if (!section || prefersReducedMotion()) return () => window.cancelAnimationFrame(readyFrame)

    let frame = 0
    const update = () => {
      frame = 0
      const range = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = Math.max(0, Math.min(1, (window.scrollY - section.offsetTop) / range))
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`
      setPhase(Math.min(VIEWS.length - 1, Math.floor(progress * VIEWS.length)))
      setStarted(progress > 0.04)
    }
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    request()
    return () => {
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(readyFrame)
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const views = viewsRef.current
    const canvas = canvasRef.current
    if (import.meta.env.SSR || !section || !pin || !views || !canvas || !canShowDevice3d()) return

    let cancelled = false
    let scene: IglooScene | null = null
    let timer = 0
    const load = () => {
      void import('./igloo3d/iglooScene')
        .then(({ createIglooScene }) => {
          if (cancelled) return
          scene = createIglooScene({
            section,
            pin,
            views,
            phases: phasesRef.current,
            canvas,
            labels: {
              start: deviceStart,
              running: deviceRunning,
              analyte: deviceAnalyte,
              verdict: deviceVerdict,
              range: deviceRange,
            },
            fontFamily: window.getComputedStyle(document.body).fontFamily,
            // Grafikkontext verloren: Szene abräumen, die Bilder übernehmen wieder.
            onLost: () => {
              scene?.dispose()
              scene = null
              setDevice3d(false)
              window.dispatchEvent(new Event('resize'))
            },
          })
          if (!scene) return
          setDevice3d(true)
          // Die Seitenlinie setzt jetzt am Lichtring des 3D-Geräts an.
          window.dispatchEvent(new Event('resize'))
        })
        .catch(() => undefined)
    }
    // Erst nach dem Laden der Seite und in einer ruhigen Phase: der erste Seitenaufbau bleibt
    // unberührt.
    const schedule = () => {
      timer = window.setTimeout(load, 350)
    }
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })
    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.removeEventListener('load', schedule)
      scene?.dispose()
      setDevice3d(false)
    }
  }, [deviceStart, deviceRunning, deviceAnalyte, deviceVerdict, deviceRange])

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="home-hero-title"
      data-home-hero
      data-home-section
      data-phase={phase}
      data-animation-ready={ready ? 'true' : undefined}
      data-started={started ? 'true' : 'false'}
      data-gl={device3d ? 'on' : undefined}
      className="sc025-film sc025-dark"
    >
      <div className="sc025-film-pin" ref={pinRef}>
        <canvas
          key={deviceKey}
          ref={canvasRef}
          className="sc025-film-gl"
          aria-hidden="true"
          data-home-film-gl
        />
        <div className="sc025-inner sc025-film-grid">
          <div className="sc025-film-copy">
            <h1 id="home-hero-title" className="sr-only">
              {title}
            </h1>
            <div ref={phasesRef} className="sc025-film-phases" data-home-film-phases>
              {VIEWS.map((_, index) => (
                <div key={index} className={index === phase ? 'is-on' : undefined}>
                  <span className="sc025-label">
                    0{index + 1} · {steps[index]?.title}
                  </span>
                  <div className="sc025-film-word" aria-hidden="true">
                    {(lines[index] ?? steps[index]?.title ?? '').trim()}
                  </div>
                  <p>{steps[index]?.text}</p>
                </div>
              ))}
            </div>
            <Button
              to={HOME_TARGETS.contact}
              variant="secondary"
              data-home-hero-cta
              className="sc025-button"
            >
              {t('hero.cta_secondary')}
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
          <div ref={viewsRef} className="sc025-film-views" data-home-film-views data-phase={phase}>
            <div className="sc025-film-beam" aria-hidden="true" />
            <div className="sc025-film-glow" aria-hidden="true" />
            {VIEWS.map((image, index) => (
              <ResponsivePicture
                key={image.src}
                image={image}
                alt={index === 0 ? t('business_pillars.pillars.igloo.title') : ''}
                sizes={FILM_SIZES}
                priority={index === 0}
                className={index === phase ? 'is-on' : index < phase ? 'is-past' : undefined}
              />
            ))}
            <div className="sc025-film-progress" aria-hidden="true">
              <i ref={progressRef} />
            </div>
          </div>
          <ol className="sc025-film-rail" aria-hidden="true">
            {steps.map((step, index) => (
              <li key={step.title} className={index <= phase ? 'is-on' : undefined}>
                {step.title}
              </li>
            ))}
          </ol>
        </div>
        <p className="sc025-film-hint" aria-hidden="true">
          {t('sc025.hero.hint')}
        </p>
      </div>
    </section>
  )
}

export default HomeHero
