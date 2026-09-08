import type { ReactNode } from 'react'
import { Building2, MessagesSquare, ScanLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Eyebrow from '../ui/Eyebrow'

/**
 * Evidence-bounded product characteristics.
 *
 * Numeric specifications, connectivity, regulation and performance remain
 * deliberately absent until their later AP14 evidence owners have verified
 * them. This section describes only the current product, audience and real
 * enquiry path established by PT14.1/PT14.2.
 */
type FeatureCard = {
  icon: ReactNode
  k: string
}

const IglooFeaturesSection = () => {
  const { t } = useTranslation('products')

  const cards: FeatureCard[] = [
    { icon: <ScanLine />, k: 'reader' },
    { icon: <Building2 />, k: 'context' },
    { icon: <MessagesSquare />, k: 'scope' },
  ]

  return (
    <section aria-labelledby="igloo-features-title" data-igloo-features className="bg-white">
      <div className="mx-auto max-w-container px-4 lg:px-0 py-24 lg:py-24">
        <div className="mb-14 text-center">
          <Eyebrow>{t('product_story.eyebrow')}</Eyebrow>
          <h2 id="igloo-features-title" className="mt-3 t-h2">
            {t('product_story.title')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-700">{t('product_story.description')}</p>
        </div>

        <ul className="grid gap-8 md:grid-cols-3">
          {cards.map(({ icon, k }) => (
            <li
              key={k}
              data-product-characteristic={k}
              className="rounded-xl border border-slate-200 bg-white p-7 flex flex-col"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent"
              >
                <span className="h-5 w-5 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
              </span>
              <h3 className="mt-5 text-lg font-medium text-heading">
                {t(`product_story.items.${k}.title`)}
              </h3>
              <p className="mt-2 t-small">{t(`product_story.items.${k}.text`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default IglooFeaturesSection
