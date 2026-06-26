import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { testimonials } from '../../data/testimonials'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { Button, GradientSurface, SectionHeader } from '~/design-system'

// A simple Star SVG component (decorative — Wert wird per aria-label getragen)
const Star = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={`h-5 w-5 ${filled ? 'text-rating' : 'text-fg-on-dark/40'}`}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

// Star rating component — Rating als Text fuer Screenreader ([FIL]/§2: nie Farbe allein)
const StarRating = ({ rating, label }: { rating: number; label: string }) => (
  <div className="flex justify-center" role="img" aria-label={label}>
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} filled={i < rating} />
    ))}
  </div>
)

const TestimonialsSection = () => {
  const { t } = useTranslation('home')
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    // Kein Auto-Advance bei reduzierter Bewegung (WCAG 2.2.2 / 2.3.3).
    if (prefersReducedMotion) return
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 8000) // Slower slide change: 8 seconds

    return () => clearInterval(interval)
  }, [prefersReducedMotion])

  const handleDotClick = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <GradientSurface id="testimonials" glowWidth="w-80" className="py-16">
      <div className="relative z-10 mx-auto flex max-w-container flex-col items-center gap-16 px-4 lg:gap-12 lg:px-8">
        <div className="flex flex-col items-center gap-8 text-center lg:gap-6">
          <SectionHeader
            caption={t('testimonials.caption', 'Aus der Praxis')}
            title={t('testimonials.title', 'Was unsere Anwender über das Igloo Pro System sagen')}
            titleClassName="text-fg-on-dark"
          />
          {/* Autorität → Stimmen: kurze Brücke vor den Einzelstimmen. */}
          <p className="max-w-2xl text-base leading-relaxed text-fg-on-dark/80">
            {t(
              'testimonials.subtitle',
              'Zahnärztinnen, Zahnärzte und Fachärzte berichten aus dem Praxisalltag.',
            )}
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="w-full max-w-4xl space-y-10 rounded-2xl bg-fg-on-dark/5 p-6 shadow-3 backdrop-blur lg:space-y-8 lg:p-8">
          {/* Slider Content */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0"
                  role="group"
                  aria-roledescription="slide"
                >
                  <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:gap-8 md:text-left">
                    {/* Reviewer Image & Stars */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="mx-auto h-32 w-32 flex-shrink-0 overflow-hidden rounded-full bg-fg-on-dark/20 md:mx-0">
                        {testimonial.avatar ? (
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            width={128}
                            height={128}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <StarRating
                        rating={5}
                        label={t('testimonials.starsAria', '{{count}} out of 5 stars', {
                          count: 5,
                        })}
                      />
                    </div>

                    {/* Review Content */}
                    <div className="flex-grow space-y-4">
                      <blockquote className="text-lg leading-relaxed text-fg-on-dark/90">
                        “{t(`testimonials.${testimonial.id}.text`)}”
                      </blockquote>
                      <div className="h-10">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-fg-on-dark/70">
                          {t(`testimonials.${testimonial.id}.title`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Dots */}
          <div className="flex justify-center">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className="group flex h-[var(--tap-target-min)] w-[var(--tap-target-min)] items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]"
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={activeIndex === index}
              >
                {/* Aktiv = breiter Balken (Form-Cue), nicht nur Farbe (§2 „nie Farbe allein", WCAG 1.4.1). */}
                <span
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? 'w-8 bg-fg-on-dark'
                      : 'w-2.5 bg-fg-on-dark/40 group-hover:bg-fg-on-dark/60'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-row justify-center gap-10 text-center md:gap-16">
          <div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-medium tracking-tight sm:text-4xl">4.9</span>
            </div>
            <p className="mt-1 text-xs text-fg-on-dark/80 whitespace-pre-line sm:text-sm">
              {t('testimonials.ratingLabel', 'Overall Rating\nbased on 500+ reviews')}
            </p>
          </div>
          <div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-medium tracking-tight sm:text-4xl">100</span>
              <span className="text-xl font-medium text-accent-on-dark sm:text-2xl">%</span>
            </div>
            <p className="mt-1 text-xs text-fg-on-dark/80 sm:text-sm">
              {t('testimonials.positiveLabel', 'Positive Review')}
            </p>
          </div>
        </div>

        <Button to="/contact" size="sm">
          {t('testimonials.cta', 'Jetzt selbst überzeugen')}
        </Button>
      </div>
    </GradientSurface>
  )
}

export default TestimonialsSection
