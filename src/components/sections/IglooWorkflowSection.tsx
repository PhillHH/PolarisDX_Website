import { useTranslation } from 'react-i18next'
import SubHead from '../sub/SubHead'

const steps = ['context', 'scope', 'decision'] as const

/**
 * A truthful evaluation workflow, not an invented device operating manual.
 * Product operation remains omitted while instructions and supported scope
 * are owner-bound.
 *
 * SC-028: nummerierte Spalten mit Linie; der Grenzhinweis steht als Randnotiz darunter.
 */
export default function IglooWorkflowSection() {
  const { t } = useTranslation('products')

  return (
    <section
      aria-labelledby="igloo-workflow-title"
      data-igloo-workflow
      data-sub-section
      className="sc025-s sc025-tint"
    >
      <div className="sc025-inner">
        <SubHead
          kicker={t('workflow.eyebrow')}
          title={t('workflow.title')}
          titleId="igloo-workflow-title"
          lead={t('workflow.description')}
        />
        <ol className="sc028-cols grid gap-12 lg:grid-cols-3">
          {steps.map((key, index) => (
            <li key={key} data-workflow-step={key} className="rv">
              <span className="sc028-n" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{t(`workflow.steps.${key}.title`)}</h3>
              <p className="sc025-text">{t(`workflow.steps.${key}.text`)}</p>
            </li>
          ))}
        </ol>
        <p className="sc025-note">{t('workflow.boundary')}</p>
      </div>
    </section>
  )
}
