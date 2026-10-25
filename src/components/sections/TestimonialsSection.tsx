import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Quote } from 'lucide-react'
import { testimonials } from '../../data/testimonials'
import Eyebrow from '../ui/Eyebrow'

/**
 * Praxisstimmen der Startseite als Slider (SC-014, Owner 2026-10-19: „Diese Section
 * dynamisieren bitte. Slider wäre schön").
 *
 * Reihenfolge und Belege unverändert: Wessing zuerst (HCL-006, Schulungs-/Support-Satz),
 * dann Pollock, Grimm, Stojanovic (HCL-017, je ein wörtlicher Satz aus dem lokalisierten
 * Originalzitat, SC-009). `martin_fischer` bleibt außen vor: kein Porträt, keine Quelle.
 * Keine Bewertung, keine Sterne, keine Links.
 *
 * Bedienung: Pfeile (Tastatur), Wischen per CSS-Scroll-Snap, Zaehler „1 / 4". Bewusst KEIN
 * automatisches Weiterlaufen — ohne Pausenknopf verstößt das gegen WCAG 2.2.2 und kostet
 * JavaScript. Alle Folien stehen im SSR-HTML (ohne JS bleibt es eine wischbare Reihe);
 * eine einheitliche Folienstruktur hält das gzip-HTML klein (htmlBytes-Budget, PT25.5).
 *
 * Anführungszeichen je Sprache aus `testimonials.q_open`/`q_close` (vorher in allen zehn
 * Sprachen deutsche „…").
 */
const SLIDE_IDS = ['bastian_wessing', 'richard_pollock', 'kristian_grimm', 'goran_stojanovic']

const CONTROL =
  'inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper-line bg-white text-heading shadow-card transition hover:border-accent hover:text-accent disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'

const TestimonialsSection = () => {
  const { t } = useTranslation('home')
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const slides = SLIDE_IDS.map((id) => testimonials.find((item) => item.id === id)).filter(
    (item) => item !== undefined,
  )
  if (slides.length === 0) return null

  const go = (index: number) => {
    const el = track.current
    if (!el) return
    const next = Math.max(0, Math.min(slides.length - 1, index))
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: next * el.clientWidth, behavior: reduce ? 'auto' : 'smooth' })
    setActive(next)
  }

  const onScroll = () => {
    const el = track.current
    if (el && el.clientWidth) setActive(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <section
      id="testimonials"
      aria-labelledby="homepage-proof-title"
      data-home-proof
      className="bg-paper pb-16 lg:pb-20"
    >
      <div className="mx-auto max-w-container px-4 lg:px-0">
        <div className="rv flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <Eyebrow>{t('testimonials.caption')}</Eyebrow>
            <h2 id="homepage-proof-title" className="mt-3 t-display">
              {t('testimonials.title')}
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className={CONTROL}
              aria-controls="testimonial-track"
              aria-label={t('testimonials.prev')}
              disabled={active === 0}
              onClick={() => go(active - 1)}
            >
              {/* Dasselbe Pfeil-Markup wie Buehne und Kopfzeile: komprimiert im HTML fast auf null. */}
              <span className="inline-flex rotate-180">
                <ArrowRight className="h-4 w-4" />
              </span>
            </button>
            <button
              type="button"
              className={CONTROL}
              aria-controls="testimonial-track"
              aria-label={t('testimonials.next')}
              disabled={active === slides.length - 1}
              onClick={() => go(active + 1)}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          id="testimonial-track"
          ref={track}
          onScroll={onScroll}
          // Scrollbarer Bereich muss per Tastatur erreichbar sein (axe scrollable-region-focusable);
          // fokussiert blaettern auch die Pfeiltasten. Wie EpigeneticsPage/BefundBlocks.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label={t('testimonials.aria.carousel')}
          className="rv mt-10 flex snap-x snap-mandatory overflow-x-auto rounded-band [scrollbar-width:none] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
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
                className="grid w-full shrink-0 snap-start overflow-hidden rounded-band border border-paper-line bg-white sm:grid-cols-3"
              >
                {item.avatar && (
                  <img
                    src={item.avatar}
                    alt=""
                    width={300}
                    height={300}
                    loading="lazy"
                    decoding="async"
                    className="h-64 w-full bg-paper-deep object-cover sm:h-full"
                  />
                )}
                <div className="flex flex-col justify-center p-7 sm:col-span-2 sm:p-10 lg:p-12">
                  <Quote className="h-10 w-10 text-accent" aria-hidden="true" />
                  <blockquote className="mt-4 text-balance text-xl font-medium leading-snug tracking-tight text-heading sm:text-2xl">
                    <p>
                      {t('testimonials.q_open')}
                      {t(`testimonials.${item.id}.proof_text`)}
                      {t('testimonials.q_close')}
                    </p>
                  </blockquote>
                  <figcaption className="mt-7 border-t border-paper-line pt-5">
                    <p className="font-semibold text-heading">{item.name}</p>
                    <p className="mt-1 text-sm text-gray-600">
                      {t(`testimonials.${item.id}.role`)}
                      {practice && ` · ${practice}`}
                    </p>
                  </figcaption>
                </div>
              </figure>
            )
          })}
        </div>

        {/* Zaehler statt Punkt-Knoepfen (htmlBytes-Budget); `aria-live` sagt den Wechsel an. */}
        <p aria-live="polite" className="mt-5 text-center text-sm font-semibold text-gray-600">
          {active + 1} / {slides.length}
        </p>
      </div>
    </section>
  )
}

export default TestimonialsSection
