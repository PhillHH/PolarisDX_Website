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
  <div className="flex gap-0.5" aria-hidden="true">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} />
    ))}
  </div>
)

// Sprach-neutrales Personen-Icon für den Kundenbild-Platzhalter (kein Bild vorhanden).
const PersonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
    className="h-10 w-10"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
  </svg>
)

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
    <section id="testimonials" className="bg-brand-deep py-20 text-white lg:py-24">
      <div className="mx-auto flex max-w-container flex-col items-center gap-10 px-4 lg:px-8">
        {/* Kopf: GENAU EIN Eyebrow + h2 (helle Sektion) */}
        <div className="flex flex-col items-center gap-3 text-center">
          <Eyebrow tone="dark">{t('testimonials.caption', 'PRAXIS-STIMMEN')}</Eyebrow>
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            {t('testimonials.title', 'Was Praxen über das IglooPro-System sagen')}
          </h2>
        </div>

        {/* Carousel: gerahmte Split-Karten */}
        <div className="w-full max-w-4xl overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => {
              const role = t(`testimonials.${testimonial.id}.role`)
              const practice = t(`testimonials.${testimonial.id}.practice`, '')
              return (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-1"
                  role="group"
                  aria-roledescription="slide"
                >
                  <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white md:flex-row">
                    {/* Foto LINKS (Mobil oben) */}
                    <div className="bg-slate-100 md:w-1/3">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          loading="lazy"
                          decoding="async"
                          className="h-48 w-full object-cover md:h-full"
                        />
                      ) : (
                        <div className="flex h-48 w-full flex-col items-center justify-center gap-2 text-slate-400 md:h-full">
                          <PersonIcon />
                          <span className="text-sm font-medium">
                            {t('testimonials.photo_placeholder', 'Kundenbild')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Zitat RECHTS */}
                    <div className="flex flex-1 flex-col justify-center p-6 text-left lg:p-8">
                      <StarRating />
                      <blockquote className="mt-3 line-clamp-4 text-base leading-relaxed text-gray-700">
                        „{t(`testimonials.${testimonial.id}.text`)}“
                      </blockquote>
                      <div className="mt-5">
                        <p className="font-semibold text-heading">{testimonial.name}</p>
                        <p className="mt-0.5 text-sm text-gray-600">
                          {role}
                          {practice ? ` · ${practice}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2.5">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                activeIndex === index ? 'bg-accent' : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={t('testimonials.goTo', 'Bewertung {{n}} anzeigen', { n: index + 1 })}
            />
          ))}
        </div>

        {/* CTA: gefüllt Teal */}
        <Button
          to="/contact"
          variant="secondary"
          size="sm"
          className="!bg-accent-strong !text-white hover:!bg-brand-deep focus-visible:!ring-accent"
        >
          {t('testimonials.cta', 'Jetzt selbst überzeugen')}
        </Button>
      </div>
    </section>
  )
}

export default TestimonialsSection
