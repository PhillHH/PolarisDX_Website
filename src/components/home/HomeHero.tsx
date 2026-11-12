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
import { prefersReducedMotion } from './motion'

type FilmStep = { title: string; text: string }

const VIEWS = [FILM_FRONT_IMAGE, FILM_TOP_IMAGE, PILLAR_READER_IMAGE]

function headlineLines(title: string): string[] {
  const parts = title.match(/[^.!?]+[.!?]+\s*/g)
  return parts && parts.join('') === title && parts.length === VIEWS.length ? parts : []
}

/**
 * SC-025 Nachtrag „Lichtfilm" (Owner 2026-11-12): Die Bühne bleibt beim Scrollen stehen, der
 * IglooPro wechselt durch drei Ansichten (Probe · Messung · Ergebnis), der Lichtstrahl folgt
 * seinem Lichtring. Ohne JS und bei „Bewegung reduzieren" stehen alle drei Phasen untereinander.
 */
const HomeHero = () => {
  const { t } = useTranslation('home')
  const title = t('hero.title')
  const lines = headlineLines(title)
  const rawSteps = t('sc025.hero.steps', { returnObjects: true }) as FilmStep[] | string
  const steps = Array.isArray(rawSteps) ? rawSteps.slice(0, VIEWS.length) : []
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState(0)
  const [started, setStarted] = useState(false)
  const [ready, setReady] = useState(false)

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
      className="sc025-film sc025-dark"
    >
      <div className="sc025-film-pin">
        <div className="sc025-inner sc025-film-grid">
          <div className="sc025-film-copy">
            <h1 id="home-hero-title" className="sr-only">
              {title}
            </h1>
            <div className="sc025-film-phases" data-home-film-phases>
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
          <div className="sc025-film-views" data-home-film-views data-phase={phase}>
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
