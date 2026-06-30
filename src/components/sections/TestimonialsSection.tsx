import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { testimonials } from '../../data/testimonials'
import Eyebrow from '~/components/ui/Eyebrow'
import { Button } from '~/components/ui/Button'

// Teal-Stern (Token text-accent, kein Raw-Hex).
const Star = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="h-5 w-5 text-accent"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const StarRating = () => (
  <div className="flex justify-center gap-0.5" aria-hidden="true">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} />
    ))}
  </div>
)

// Initialen aus dem Namen (Titel wie Dr./Prof. ignorieren) — füllt den
// Avatar-Kreis, keine frei schwebenden Bilder auf der Karte.
const getInitials = (name: string) =>
  name
    .replace(/^(Dr\.|Prof\.)\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

const TestimonialsSection = () => {
  const { t } = useTranslation('home')
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="testimonials" className="bg-brand-deep py-20 text-white lg:py-28">
      <div className="mx-auto flex max-w-container flex-col items-center gap-12 px-4 lg:px-8">
        {/* Kopf: GENAU EIN heller Eyebrow + h2 (kein Dunkel-auf-Dunkel) */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Eyebrow>{t('testimonials.caption', 'PRAXIS-STIMMEN')}</Eyebrow>
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            {t('testimonials.title', 'Was Praxen über das IglooPro-System sagen')}
          </h2>
        </div>

        {/* Weiße Beweis-Karte */}
        <div className="w-full max-w-3xl rounded-xl border border-slate-200 bg-white p-8 text-center lg:p-10">
          {/* Slider-Inhalt */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-1"
                  role="group"
                  aria-roledescription="slide"
                >
                  <StarRating />
                  <blockquote className="mt-5 text-lg leading-relaxed text-gray-700">
                    „{t(`testimonials.${testimonial.id}.text`)}“
                  </blockquote>
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-deep text-base font-semibold text-white">
                      {getInitials(testimonial.name)}
                    </span>
                    <div>
                      <p className="font-semibold text-heading">{testimonial.name}</p>
                      <p className="mt-0.5 text-sm text-gray-700">
                        {t(`testimonials.${testimonial.id}.role`)} ·{' '}
                        {t(`testimonials.${testimonial.id}.title`)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="mt-8 flex justify-center gap-2.5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                  activeIndex === index ? 'bg-accent' : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={t('testimonials.goTo', 'Bewertung {{n}} anzeigen', {
                  n: index + 1,
                })}
              />
            ))}
          </div>

          {/* Stat-Zeile mit Teal-Zahlen */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-slate-200 pt-6 text-sm text-gray-700">
            <span>
              <span className="font-semibold text-accent">
                ★ {t('testimonials.stats.ratingValue', '4.9')}
              </span>{' '}
              {t('testimonials.stats.ratingLabel', 'Gesamt')}
            </span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span>
              <span className="font-semibold text-accent">
                {t('testimonials.stats.positiveValue', '100 %')}
              </span>{' '}
              {t('testimonials.stats.positiveLabel', 'positiv')}
            </span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span>
              <span className="font-semibold text-accent">
                {t('testimonials.stats.reviewsValue', '250+')}
              </span>{' '}
              {t('testimonials.stats.reviewsLabel', 'Rezensionen')}
            </span>
          </div>
        </div>

        {/* CTA: gefüllt Teal */}
        <Button
          to="/contact"
          variant="secondary"
          size="sm"
          className="!bg-accent !text-white hover:!bg-accent-strong focus-visible:!ring-accent"
        >
          {t('testimonials.cta', 'Jetzt selbst überzeugen')}
        </Button>
      </div>
    </section>
  )
}

export default TestimonialsSection
