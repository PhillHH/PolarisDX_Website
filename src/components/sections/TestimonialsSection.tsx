import { useTranslation } from 'react-i18next'
import { Quote } from 'lucide-react'
import { testimonials } from '../../data/testimonials'
import Eyebrow from '../ui/Eyebrow'

const FEATURED_TESTIMONIAL_ID = 'bastian_wessing'
/** SC-009 (Owner 2026-10-19): weitere Stimmen mit echtem Portraet, je ein woertlicher Satz
 * aus dem lokalisierten Originalzitat (`proof_text`), Claim HCL-017. `martin_fischer` bleibt
 * aussen vor: kein Portraet, keine Quelle. */
const MORE_TESTIMONIAL_IDS = ['richard_pollock', 'kristian_grimm', 'goran_stojanovic']

/**
 * One existing, named and previously productive practice reference.
 *
 * PT11.2 deliberately removes the rating UI, autoplay carousel and four other
 * voices from productive output: the repository proves their content/assets,
 * but does not carry equally strong release evidence for a new Trust surface.
 * The selected quote is reduced to its existing training/support statement and
 * therefore makes no treatment-outcome or comparative performance claim.
 *
 * SC-009 (Owner 2026-10-19, „alte Kundenstimmen wieder aktivieren"): three more named
 * voices with real portraits follow as compact cards, each with one verbatim sentence of
 * the localized original quote and no rating, carousel or link.
 *
 * SC-006 (2026-10-16): the figure enters on scroll, the quotation mark leads
 * larger, the quote is balanced, the portrait sits on a paper-deep surface in
 * a 1:2 split (`sm:grid-cols-3`) — no bespoke grid templates any more.
 */
const TestimonialsSection = () => {
  const { t } = useTranslation('home')
  const testimonial = testimonials.find(({ id }) => id === FEATURED_TESTIMONIAL_ID)

  const more = MORE_TESTIMONIAL_IDS.map((id) => testimonials.find((item) => item.id === id)).filter(
    (item) => item !== undefined,
  )

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

        {more.length > 0 && (
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {more.map((item) => {
              const itemPractice = t(`testimonials.${item.id}.practice`, '')
              return (
                <figure
                  key={item.id}
                  data-testimonial-id={item.id}
                  data-claim-id="HCL-017"
                  className="rv flex flex-col rounded-card border border-paper-line bg-white p-6 shadow-card"
                >
                  <blockquote className="flex-1 font-medium text-heading">
                    <p>„{t(`testimonials.${item.id}.proof_text`)}“</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-4 border-t border-paper-line pt-5">
                    {item.avatar && (
                      <img
                        src={item.avatar}
                        alt=""
                        width={56}
                        height={56}
                        loading="lazy"
                        decoding="async"
                        className="h-14 w-14 rounded-full bg-paper-deep object-cover"
                      />
                    )}
                    <span>
                      <span className="block font-semibold text-heading">{item.name}</span>
                      <span className="mt-0.5 block text-sm text-gray-600">
                        {t(`testimonials.${item.id}.role`)}
                        {itemPractice && ` · ${itemPractice}`}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default TestimonialsSection
