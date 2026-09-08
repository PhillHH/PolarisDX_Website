import { useTranslation } from 'react-i18next'
import Eyebrow from '../ui/Eyebrow'

/**
 * The only currently publishable IglooPro specification.
 *
 * The value is a locked product/content decision. The surrounding copy keeps
 * that decision distinct from scientific validation, accuracy, regulatory or
 * outcome proof. Other historical values stay owner-bound in the AP14 contract.
 */
export default function IglooSpecsSection() {
  const { t } = useTranslation('products')

  return (
    <section
      aria-labelledby="igloo-specification-title"
      data-igloo-specification
      className="bg-slate-50"
    >
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0">
        <div className="max-w-3xl">
          <Eyebrow>{t('specification.eyebrow')}</Eyebrow>
          <h2 id="igloo-specification-title" className="mt-3 t-h2">
            {t('specification.title')}
          </h2>
          <p id="igloo-specification-description" className="mt-4 text-gray-700">
            {t('specification.description')}
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table
            aria-describedby="igloo-specification-description"
            className="w-full table-fixed border-collapse text-left"
          >
            <caption className="sr-only">{t('specification.caption')}</caption>
            <thead className="bg-brand-deep text-white">
              <tr>
                <th
                  scope="col"
                  className="w-[30%] break-words px-3 py-4 text-sm font-semibold sm:px-5"
                >
                  {t('specification.headers.metric')}
                </th>
                <th
                  scope="col"
                  className="w-[22%] break-words px-3 py-4 text-sm font-semibold sm:px-5"
                >
                  {t('specification.headers.value')}
                </th>
                <th
                  scope="col"
                  className="w-[48%] break-words px-3 py-4 text-sm font-semibold sm:px-5"
                >
                  {t('specification.headers.context')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="break-words px-3 py-5 font-medium text-heading sm:px-5">
                  {t('specification.metric')}
                </th>
                <td className="break-words px-3 py-5 text-base font-semibold text-heading sm:px-5 sm:text-lg">
                  {t('specification.value')}
                </td>
                <td className="break-words px-3 py-5 text-sm leading-relaxed text-gray-700 sm:px-5">
                  {t('specification.context')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
