import { useTranslation } from 'react-i18next'
import SubHead from '../sub/SubHead'

const proofItems = ['reader', 'audience', 'enquiry'] as const

/**
 * Evidence-bounded product context for PT14.2.
 *
 * These signals describe the real product, audience and enquiry path. Numeric
 * specifications, certifications and customer proof stay absent until their
 * later AP14 evidence owners have verified them.
 *
 * SC-028: drei nummerierte Spalten mit Linie statt Karten mit Symbolkachel.
 */
export default function IglooProductProof() {
  const { t } = useTranslation('products')

  return (
    <section
      aria-labelledby="igloo-proof-title"
      aria-label={t('proof.aria_label')}
      data-igloo-proof
      data-sub-section
      className="sc025-s"
    >
      <div className="sc025-inner">
        <SubHead
          kicker={t('proof.eyebrow')}
          title={t('proof.title')}
          titleId="igloo-proof-title"
          lead={t('proof.description')}
        />
        <ul className="sc028-cols grid gap-12 md:grid-cols-3">
          {proofItems.map((key, index) => (
            <li key={key} data-proof-signal={key} className="rv">
              <span className="sc028-n" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{t(`proof.items.${key}.title`)}</h3>
              <p className="sc025-text">{t(`proof.items.${key}.text`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
