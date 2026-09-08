import { useTranslation } from 'react-i18next'
import { Quote } from 'lucide-react'
import { testimonials } from '../../data/testimonials'
import Eyebrow from '../ui/Eyebrow'

const FEATURED_TESTIMONIAL_ID = 'bastian_wessing'

/**
 * One existing, named and previously productive practice reference.
 *
 * PT11.2 deliberately removes the rating UI, autoplay carousel and four other
 * voices from productive output: the repository proves their content/assets,
 * but does not carry equally strong release evidence for a new Trust surface.
 * The selected quote is reduced to its existing training/support statement and
 * therefore makes no treatment-outcome or comparative performance claim.
 */
const TestimonialsSection = () => {
  const { t } = useTranslation('home')
  const testimonial = testimonials.find(({ id }) => id === FEATURED_TESTIMONIAL_ID)

  if (!testimonial) return null

  const role = t(`testimonials.${testimonial.id}.role`)
  const practice = t(`testimonials.${testimonial.id}.practice`)

  return (
    <section
      id="testimonials"
      aria-labelledby="homepage-proof-title"
      data-home-proof
      className="bg-brand-deep py-16 text-white lg:py-20"
    >
      <div className="mx-auto grid max-w-container items-center gap-10 px-6 sm:px-8 lg:grid-cols-[minmax(220px,0.65fr)_minmax(0,1.35fr)] lg:px-0">
        <div>
          <Eyebrow tone="dark">{t('testimonials.caption')}</Eyebrow>
          <h2
            id="homepage-proof-title"
            className="mt-3 max-w-xl text-3xl font-medium tracking-tight text-white sm:text-4xl"
          >
            {t('testimonials.title')}
          </h2>
        </div>

        <figure
          data-testimonial-id={testimonial.id}
          data-claim-id="HCL-006"
          className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white text-heading shadow-lg sm:grid-cols-[180px_minmax(0,1fr)]"
        >
          {testimonial.avatar && (
            <img
              src={testimonial.avatar}
              alt=""
              width={300}
              height={300}
              loading="lazy"
              decoding="async"
              className="h-52 w-full object-cover sm:h-full"
            />
          )}
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <Quote className="h-7 w-7 text-accent" aria-hidden="true" />
            <blockquote className="mt-4 text-lg leading-relaxed text-gray-700">
              <p>„{t(`testimonials.${testimonial.id}.proof_text`)}“</p>
            </blockquote>
            <figcaption className="mt-6 border-t border-slate-200 pt-4">
              <p className="font-semibold text-heading">{testimonial.name}</p>
              <p className="mt-1 text-sm text-gray-600">
                {role} · {practice}
              </p>
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  )
}

export default TestimonialsSection
