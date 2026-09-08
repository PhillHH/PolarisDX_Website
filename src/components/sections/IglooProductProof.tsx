import { Building2, MessagesSquare, ScanLine, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const proofItems: ReadonlyArray<{ key: string; icon: LucideIcon }> = [
  { key: 'reader', icon: ScanLine },
  { key: 'audience', icon: Building2 },
  { key: 'enquiry', icon: MessagesSquare },
]

/**
 * Evidence-bounded product context for PT14.2.
 *
 * These signals describe the real product, audience and enquiry path. Numeric
 * specifications, certifications and customer proof stay absent until their
 * later AP14 evidence owners have verified them.
 */
export default function IglooProductProof() {
  const { t } = useTranslation('products')

  return (
    <section
      aria-labelledby="igloo-proof-title"
      aria-label={t('proof.aria_label')}
      data-igloo-proof
      className="border-y border-slate-200 bg-white"
    >
      <div className="mx-auto max-w-container px-6 py-16 sm:px-8 lg:px-0 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent-strong">
            {t('proof.eyebrow')}
          </p>
          <h2 id="igloo-proof-title" className="mt-3 t-h2">
            {t('proof.title')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-700">{t('proof.description')}</p>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {proofItems.map(({ key, icon: Icon }) => (
            <li
              key={key}
              data-proof-signal={key}
              className="rounded-xl border border-slate-200 bg-slate-50 p-6"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent-strong"
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-medium text-heading">
                {t(`proof.items.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                {t(`proof.items.${key}.text`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
