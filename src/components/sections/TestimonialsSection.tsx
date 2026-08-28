import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Pause, Play } from 'lucide-react'
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

const TestimonialsSection = () => {
  const { t } = useTranslation('home')
  const [activeIndex, setActiveIndex] = useState(0)
  // 'auto' = Voreinstellung, 'on'/'off' = ausdrückliche Entscheidung am Pause/Play-Knopf.
  const [autoplayIntent, setAutoplayIntent] = useState<'auto' | 'on' | 'off'>('auto')
  // Hover/Focus hält nur vorübergehend an und überschreibt die Entscheidung nicht.
  const [isHovered, setIsHovered] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // prefers-reduced-motion respektieren (nur Client) - gleiches Muster wie useHeroSlider.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])

  // Läuft der automatische Wechsel wirklich? Genau diesen Zustand zeigt der Knopf an.
  const isPlaying = autoplayIntent === 'on' || (autoplayIntent === 'auto' && !reducedMotion)

  // Autoplay - aus bei Bewegungsreduktion, bei Hover/Focus und nach Klick auf Pause (WCAG 2.2.2).
  useEffect(() => {
    if (!isPlaying || isHovered) return
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [isPlaying, isHovered])

  return (
    <section
      id="testimonials"
      role="region"
      aria-roledescription="carousel"
      aria-label={t('testimonials.aria.carousel', 'Praxis-Stimmen')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="bg-brand-deep py-20 text-white lg:py-24"
    >
      <div className="mx-auto flex max-w-container flex-col items-center gap-8 px-4 lg:px-8">
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
            className="flex transition-transform duration-700 ease-in-out motion-reduce:transition-none"
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
                    {/* Foto LINKS (Mobil oben) — nur wenn wirklich eines vorliegt.
                        Ohne Foto entfällt die Spalte komplett und das Zitat nimmt die
                        volle Breite ein; eine beschriftete Leerfläche wäre schlechter
                        als gar keine. */}
                    {testimonial.avatar && (
                      <div className="bg-slate-100 md:w-1/3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          loading="lazy"
                          decoding="async"
                          className="h-48 w-full object-cover md:h-full"
                        />
                      </div>
                    )}

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

        {/* Slider-Steuerung: Dots + Pause/Play (WCAG 2.2.2) */}
        <div className="flex items-center justify-center gap-4">
          <div
            className="flex gap-2.5"
            role="group"
            aria-label={t('testimonials.aria.dots', 'Bewertung auswählen')}
          >
            {testimonials.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-current={activeIndex === index ? 'true' : undefined}
                // Trefferflaeche = Knopf (24px hoch), sichtbarer Punkt = innerer
                // <span> (unveraendert 10px). Siehe DESIGN-SYSTEM-CONTRACT §6.8.
                className="group/dot flex items-center justify-center py-[7px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label={t('testimonials.goTo', 'Bewertung {{n}} anzeigen', { n: index + 1 })}
              >
                <span
                  className={`block h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                    activeIndex === index ? 'bg-accent' : 'bg-white/30 group-hover/dot:bg-white/50'
                  }`}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAutoplayIntent(isPlaying ? 'off' : 'on')}
            aria-label={
              isPlaying
                ? t('testimonials.aria.pause', 'Automatischen Wechsel pausieren')
                : t('testimonials.aria.play', 'Automatischen Wechsel fortsetzen')
            }
            className="inline-flex h-11 w-11 items-center justify-center rounded text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            {isPlaying ? (
              <Pause size={16} aria-hidden="true" />
            ) : (
              <Play size={16} aria-hidden="true" />
            )}
          </button>
        </div>

        {/* CTA: gefüllt Teal */}
        <Button
          to="/contact"
          variant="secondary"
          size="sm"
          className="!bg-accent-strong !text-white hover:!brightness-110 focus-visible:!ring-accent"
        >
          {t('testimonials.cta', 'Jetzt selbst überzeugen')}
        </Button>
      </div>
    </section>
  )
}

export default TestimonialsSection
