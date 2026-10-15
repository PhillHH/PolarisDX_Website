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
      className="bg-paper pb-16 lg:pb-20"
    >
      <div className="mx-auto max-w-container px-4 lg:px-0">
        <div className="max-w-3xl">
          <Eyebrow>{t('testimonials.caption')}</Eyebrow>
          <h2
            id="homepage-proof-title"
            className="mt-3 text-balance text-[clamp(2rem,4vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-heading"
          >
            {t('testimonials.title')}
          </h2>
        </div>

        <figure
          data-testimonial-id={testimonial.id}
          data-claim-id="HCL-006"
          className="mt-10 grid overflow-hidden rounded-band border border-paper-line bg-white text-heading shadow-card sm:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[340px_minmax(0,1fr)]"
        >
          {testimonial.avatar && (
            <img
              src={testimonial.avatar}
              alt=""
              width={300}
              height={300}
              loading="lazy"
              decoding="async"
              className="h-64 w-full object-cover sm:h-full"
            />
          )}
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <Quote className="h-7 w-7 text-accent" aria-hidden="true" />
            <blockquote className="mt-4 text-xl font-medium leading-snug tracking-tight text-heading sm:text-2xl">
              <p>„{t(`testimonials.${testimonial.id}.proof_text`)}“</p>
            </blockquote>
            <figcaption className="mt-7 border-t border-paper-line pt-5">
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
