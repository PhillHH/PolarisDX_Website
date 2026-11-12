import { useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { testimonials } from '../../data/testimonials'
import { prefersReducedMotion } from './motion'

const SLIDE_IDS = ['bastian_wessing', 'richard_pollock', 'kristian_grimm', 'goran_stojanovic']

const PracticeVoices = () => {
  const { t } = useTranslation('home')
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const slides = SLIDE_IDS.map((id) => testimonials.find((item) => item.id === id)).filter(
    (item) => item !== undefined,
  )

  const go = (index: number) => {
    const element = track.current
    if (!element) return
    const next = Math.max(0, Math.min(slides.length - 1, index))
    setActive(next)
    if (typeof element.scrollTo === 'function') {
      element.scrollTo({
        left: next * element.clientWidth,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    }
  }

  return (
    <div
      className="sc025-voices"
      data-home-proof
      role="region"
      aria-label={t('testimonials.aria.carousel')}
    >
      <div className="sc025-voice-controls">
        <button
          type="button"
          aria-controls="testimonial-track"
          aria-label={t('testimonials.prev')}
          disabled={active === 0}
          onClick={() => go(active - 1)}
        >
          <ArrowRight aria-hidden="true" className="sc025-back" />
        </button>
        <span aria-live="polite">
          {active + 1} / {slides.length}
        </span>
        <button
          type="button"
          aria-controls="testimonial-track"
          aria-label={t('testimonials.next')}
          disabled={active === slides.length - 1}
          onClick={() => go(active + 1)}
        >
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
      <div
        id="testimonial-track"
        ref={track}
        onScroll={(event) => {
          const element = event.currentTarget
          if (element.clientWidth) setActive(Math.round(element.scrollLeft / element.clientWidth))
        }}
        // Native keyboard scrolling keeps all four SSR voices available without JavaScript.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label={t('testimonials.aria.carousel')}
        className="sc025-voice-track"
      >
        {slides.map((item, index) => {
          const practice = t(`testimonials.${item.id}.practice`, '')
          return (
            <figure
              key={item.id}
              data-testimonial-id={item.id}
              data-claim-id={index === 0 ? 'HCL-006' : 'HCL-017'}
              role="group"
              aria-roledescription="slide"
              aria-label={t('testimonials.slide', { n: index + 1, total: slides.length })}
              className="sc025-quote"
            >
              {item.avatar && (
                <img src={item.avatar} alt="" width={300} height={300} loading="lazy" />
              )}
              <div>
                <blockquote>
                  {t('testimonials.q_open')}
                  {t(`testimonials.${item.id}.proof_text`)}
                  {t('testimonials.q_close')}
                </blockquote>
                <figcaption>
                  {item.name} · {t(`testimonials.${item.id}.role`)}
                  {practice && ` · ${practice}`}
                </figcaption>
              </div>
            </figure>
          )
        })}
      </div>
    </div>
  )
}

export default PracticeVoices
