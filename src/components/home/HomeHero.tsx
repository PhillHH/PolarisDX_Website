import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { HOME_TARGETS } from './homeTargets'
import { prefersReducedMotion } from './motion'

const STEP_MS = 2600
const LAST_STEP_MS = 4600

function headlineLines(title: string): string[] {
  const parts = title.match(/[^.!?]+[.!?]+\s*/g)
  return parts && parts.join('') === title && parts.length > 1 ? parts : [title]
}

const HomeHero = () => {
  const { t } = useTranslation('home')
  const title = t('hero.title')
  const lines = headlineLines(title)
  const [step, setStep] = useState(lines.length - 1)
  const [paused, setPaused] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setReady(true)
      setStep(prefersReducedMotion() ? lines.length - 1 : 0)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [lines.length])

  useEffect(() => {
    if (prefersReducedMotion() || paused) return

    let timer = 0
    const schedule = () => {
      timer = window.setTimeout(
        () => {
          setStep((current) => (current >= lines.length - 1 ? 0 : current + 1))
          schedule()
        },
        step >= lines.length - 1 ? LAST_STEP_MS : STEP_MS,
      )
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [lines.length, paused, step])

  return (
    <section
      id="hero"
      aria-labelledby="home-hero-title"
      data-home-hero
      data-animation-ready={ready ? 'true' : undefined}
      data-paused={paused ? 'true' : 'false'}
      className="sc025-hero sc025-dark"
      data-home-section
    >
      <div className="sc025-inner sc025-hero-inner">
        <h1 id="home-hero-title" className="sc025-hero-title">
          <span className="sr-only">{title}</span>
          <span aria-hidden="true" className="sc025-hero-words">
            {lines.map((line, index) => (
              <span key={line} className={index <= step || paused ? 'is-on' : undefined}>
                {line.trim()}
              </span>
            ))}
          </span>
        </h1>
        <p className="sc025-hero-sub">{t('hero.description')}</p>
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
      <div className="sc025-hero-controls">
        <div className="sc025-dashes" aria-hidden="true">
          {lines.map((line, index) => (
            <i
              key={line}
              className={
                index < step || paused ? 'is-done' : index === step ? 'is-running' : undefined
              }
            />
          ))}
        </div>
        <button
          type="button"
          className="sc025-pause"
          aria-pressed={paused}
          data-home-hero-pause={paused ? 'true' : 'false'}
          onClick={() => setPaused((current) => !current)}
        >
          {paused ? t('sc025.hero.play') : t('sc025.hero.pause')}
        </button>
      </div>
    </section>
  )
}

export default HomeHero
