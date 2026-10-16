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
 *
 * SC-006 (2026-10-16): the figure enters on scroll, the quotation mark leads
 * larger, the quote is balanced, the portrait sits on a paper-deep surface in
 * a 1:2 split (`sm:grid-cols-3`) — no bespoke grid templates any more.
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
        <div className="rv max-w-3xl">
          <Eyebrow>{t('testimonials.caption')}</Eyebrow>
          <h2 id="homepage-proof-title" className="mt-3 t-display">
            {t('testimonials.title')}
          </h2>
        </div>

        <figure
          data-testimonial-id={testimonial.id}
          data-claim-id="HCL-006"
          className="rv mt-10 grid overflow-hidden rounded-band border border-paper-line bg-white shadow-card sm:grid-cols-3"
        >
          {testimonial.avatar && (
            <img
              src={testimonial.avatar}
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
