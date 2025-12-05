import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { testimonials } from '../../data/testimonials'
import SectionHeader from '~/components/ui/SectionHeader'

// A simple Star SVG component
const Star = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-400'}`}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

// Star rating component
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex justify-center">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} filled={i < rating} />
    ))}
  </div>
)

const TestimonialsSection = () => {
  const { t } = useTranslation('home')
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % testimonials.length)
    }, 8000) // Slower slide change: 8 seconds

    return () => clearInterval(interval)
  }, [])

  const handleDotClick = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <section
      id="testimonials"
      className="relative bg-primary py-16 text-white"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-80 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-80 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

      <div className="relative mx-auto flex max-w-container flex-col items-center gap-16 px-4 lg:gap-12 lg:px-8">
        <div className="flex flex-col items-center gap-8 text-center lg:gap-6">
          <SectionHeader
            caption={t('testimonials.caption', 'KUNDENSTIMMEN')}
            title={t('testimonials.title', 'Was unsere Anwender über das Igloo Pro System sagen')}
            titleClassName="text-white"
          />
        </div>

        {/* Testimonial Card */}
        <div className="w-full max-w-4xl space-y-10 rounded-2xl bg-white/5 p-6 shadow-2xl backdrop-blur lg:space-y-8 lg:p-8">
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
                      <div className="mx-auto h-32 w-32 flex-shrink-0 rounded-full bg-white/20 md:mx-0" />
                      <StarRating rating={5} />
                    </div>

                    {/* Review Content */}
                    <div className="flex-grow space-y-4">
                      <blockquote className="text-lg leading-relaxed text-white/90">
                        “{t(`testimonials.${testimonial.id}.text`)}”
                      </blockquote>
                      <div className="h-10">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-white/70">
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
          <div className="flex justify-center gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                  activeIndex === index
                    ? 'bg-white'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-row justify-center gap-10 text-center md:gap-16">
          <div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-medium tracking-tight sm:text-4xl">4.9</span>
            </div>
            <p className="mt-1 text-xs text-white/80 whitespace-pre-line sm:text-sm">
              {t('testimonials.ratingLabel', 'Overall Rating\nbased on 3500+ reviews')}
            </p>
          </div>
          <div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-medium tracking-tight sm:text-4xl">99</span>
              <span className="text-xl font-medium text-white/80 sm:text-2xl">%</span>
            </div>
            <p className="mt-1 text-xs text-white/80 sm:text-sm">{t('testimonials.positiveLabel', 'Positive Review')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
