import { useTranslation } from 'react-i18next'
import SubHead from '../sub/SubHead'

/**
 * Evidence-bounded product characteristics.
 *
 * Numeric specifications, connectivity, regulation and performance remain
 * deliberately absent until their later AP14 evidence owners have verified
 * them. This section describes only the current product, audience and real
 * enquiry path established by PT14.1/PT14.2.
 *
 * SC-028: Zeilen mit dünner Überschrift auf Nacht-Navy statt Karten mit Symbolkachel.
 */
const characteristics = ['reader', 'context', 'scope'] as const

const IglooFeaturesSection = () => {
  const { t } = useTranslation('products')

  return (
    <section
      aria-labelledby="igloo-features-title"
      data-igloo-features
      data-sub-section
      className="sc025-s sc025-dark"
    >
      <div className="sc025-inner">
        <SubHead
          kicker={t('product_story.eyebrow')}
          title={t('product_story.title')}
          titleId="igloo-features-title"
          lead={t('product_story.description')}
        />
        <ul className="sc028-cols grid gap-12 md:grid-cols-3">
          {characteristics.map((k, index) => (
            <li key={k} data-product-characteristic={k} className="rv">
              <span className="sc028-n" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{t(`product_story.items.${k}.title`)}</h3>
              <p className="sc025-text">{t(`product_story.items.${k}.text`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default IglooFeaturesSection
