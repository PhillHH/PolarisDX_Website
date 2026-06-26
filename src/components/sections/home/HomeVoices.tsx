import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Quote } from 'lucide-react'
import { Button } from '~/design-system'
import { testimonials } from '../../../data/testimonials'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import SectionIntro from './SectionIntro'

/** Einzelner Stern — Wert wird per aria-label der Gruppe getragen (nie Farbe allein). */
const Star = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={`h-5 w-5 ${filled ? 'text-rating' : 'text-border'}`}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const StarRating = ({ rating, label }: { rating: number; label: string }) => (
  <div className="flex" role="img" aria-label={label}>
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} filled={i < rating} />
    ))}
  </div>
)

/**
 * HomeVoices — Stimmen aus der Praxis, hell neu (§NEWLOOK-HOME §4.7).
 *
 * Heller Slider mit einer zentrierten Zitat-Karte auf Weiß (Avatar, 5-Sterne,
 * Zitat, Name/Funktion). Inhalt aus `testimonials.*` + `data/testimonials`.
 * A11y: Sterne als Bild-Rolle mit Label, Dots als Form-Cue (breiter Balken),
 * Auto-Advance respektiert prefers-reduced-motion.
 */
const HomeVoices = () => {
  const { t } = useTranslation('home')
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  return (
    <section id="testimonials" className="bg-surface">
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0 lg:py-32">
        <SectionIntro
          align="center"
          eyebrow={t('testimonials.caption', 'Aus der Praxis')}
          title={t('testimonials.title', 'Was unsere Anwender über das Igloo Pro System sagen')}
          subtitle={t(
            'testimonials.subtitle',
            'Zahnärztinnen, Zahnärzte und Fachärzte berichten aus dem Praxisalltag.',
          )}
        />

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="rounded-3xl border border-border bg-bg-subtle/50 p-6 shadow-1 sm:p-10">
            <Quote
              className="h-10 w-10 text-brand-blue/30"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div className="mt-4 overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <figure
                    key={index}
                    className="w-full flex-shrink-0"
                    role="group"
                    aria-roledescription="slide"
                  >
                    <blockquote className="text-lg leading-relaxed text-fg sm:text-xl">
                      {t(`testimonials.${testimonial.id}.text`)}
                    </blockquote>
                    <figcaption className="mt-8 flex items-center gap-4">
                      <span className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-bg-subtle ring-1 ring-border">
                        {testimonial.avatar ? (
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            width={56}
                            height={56}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </span>
                      <div>
                        <p className="font-semibold text-fg-heading">{testimonial.name}</p>
                        <p className="text-sm text-fg-muted">
                          {t(`testimonials.${testimonial.id}.title`)}
                        </p>
                        <div className="mt-1.5">
                          <StarRating
                            rating={5}
                            label={t('testimonials.starsAria', '{{count}} out of 5 stars', {
                              count: 5,
                            })}
                          />
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="mt-8 flex justify-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className="group flex h-[var(--tap-target-min)] w-[var(--tap-target-min)] items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
                  aria-label={`Stimme ${index + 1} anzeigen`}
                  aria-current={activeIndex === index}
                >
                  <span
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? 'w-8 bg-brand-navy'
                        : 'w-2.5 bg-border group-hover:bg-border-strong'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Rating-Stats */}
          <div className="mt-12 flex flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-16">
            <div className="flex flex-row justify-center gap-10 text-center sm:gap-16">
              <div>
                <p className="text-3xl font-semibold tracking-tight text-fg-heading sm:text-4xl">4.9</p>
                <p className="mt-1 whitespace-pre-line text-xs text-fg-muted sm:text-sm">
                  {t('testimonials.ratingLabel', 'Gesamtbewertung\nbasierend auf 250+ Rezensionen')}
                </p>
              </div>
              <div>
                <p className="text-3xl font-semibold tracking-tight text-fg-heading sm:text-4xl">
                  100<span className="text-brand-blue">%</span>
                </p>
                <p className="mt-1 text-xs text-fg-muted sm:text-sm">
                  {t('testimonials.positiveLabel', 'Positive Bewertung')}
                </p>
              </div>
            </div>
            <Button to="/contact" variant="primary" size="lg">
              {t('testimonials.cta', 'Jetzt selbst überzeugen')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeVoices
