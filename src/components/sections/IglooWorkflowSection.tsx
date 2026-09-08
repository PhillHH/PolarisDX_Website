import { ClipboardCheck, ListChecks, MessagesSquare, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Eyebrow from '../ui/Eyebrow'

const steps: ReadonlyArray<{ key: string; icon: LucideIcon }> = [
  { key: 'context', icon: ClipboardCheck },
  { key: 'scope', icon: ListChecks },
  { key: 'decision', icon: MessagesSquare },
]

/**
 * A truthful evaluation workflow, not an invented device operating manual.
 * Product operation remains omitted while instructions and supported scope
 * are owner-bound.
 */
export default function IglooWorkflowSection() {
  const { t } = useTranslation('products')

  return (
    <section aria-labelledby="igloo-workflow-title" data-igloo-workflow className="bg-slate-50">
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0">
        <div className="max-w-3xl">
          <Eyebrow>{t('workflow.eyebrow')}</Eyebrow>
          <h2 id="igloo-workflow-title" className="mt-3 t-h2">
            {t('workflow.title')}
          </h2>
          <p className="mt-4 text-gray-700">{t('workflow.description')}</p>
        </div>

        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map(({ key, icon: Icon }, index) => (
            <li
              key={key}
              data-workflow-step={key}
              className="relative rounded-xl border border-slate-200 bg-white p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent-strong"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-ui-field">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-medium text-heading">
                {t(`workflow.steps.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                {t(`workflow.steps.${key}.text`)}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-8 max-w-3xl rounded-lg border-l-4 border-accent bg-white px-5 py-4 text-sm leading-relaxed text-gray-700">
          {t('workflow.boundary')}
        </p>
      </div>
    </section>
  )
}
