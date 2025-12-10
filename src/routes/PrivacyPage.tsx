import { useTranslation } from 'react-i18next'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

const PrivacyPage = () => {
  const { t } = useTranslation('legal')

  return (
    <PageTransition>
      <div className="pt-32 pb-16 lg:pt-48 lg:pb-32 bg-slate-50">
        <div className="mx-auto max-w-container px-4 lg:px-0">
          <Reveal width="100%" yOffset={20}>
            <h1 className="text-3xl font-bold mb-8 text-gray-900">{t('privacy.title')}</h1>
          </Reveal>

          <Reveal width="100%">
            <div className="space-y-8 text-gray-700 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-sm leading-relaxed sm:text-base">
              <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('privacy.section1.title')}</h2>
            <h3 className="font-semibold mt-4 mb-2">{t('privacy.section1.general.title')}</h3>
            <p>{t('privacy.section1.general.content')}</p>

            <h3 className="font-semibold mt-4 mb-2">{t('privacy.section1.collection.title')}</h3>
            <p><strong>{t('privacy.section1.collection.who_title')}</strong></p>
            <p>{t('privacy.section1.collection.who_content')}</p>

            <p className="mt-2"><strong>{t('privacy.section1.collection.how_title')}</strong></p>
            <p>{t('privacy.section1.collection.how_content1')}</p>
            <p>{t('privacy.section1.collection.how_content2')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('privacy.section2.title')}</h2>
            <p>{t('privacy.section2.content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('privacy.section3.title')}</h2>
            <h3 className="font-semibold mt-4 mb-2">{t('privacy.section3.protection.title')}</h3>
            <p>{t('privacy.section3.protection.content')}</p>

            <h3 className="font-semibold mt-4 mb-2">{t('privacy.section3.responsible.title')}</h3>
            <p>{t('privacy.section3.responsible.content')}</p>
            <p className="mt-2">
              {(t('privacy.section3.responsible.address', { returnObjects: true }) as string[]).map((line, idx) => (
                <span key={idx}>{line}<br /></span>
              ))}
            </p>

            <h3 className="font-semibold mt-4 mb-2">{t('privacy.section3.storage.title')}</h3>
            <p>{t('privacy.section3.storage.content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('privacy.section4.title')}</h2>
            <h3 className="font-semibold mt-4 mb-2">{t('privacy.section4.form.title')}</h3>
            <p>{t('privacy.section4.form.content1')}</p>
            <p className="mt-2"><strong>{t('privacy.section4.form.duration_title')}</strong> {t('privacy.section4.form.duration_content')}</p>
            <p>{t('privacy.section4.form.legal_basis')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('privacy.section5.title')}</h2>
            <p>{t('privacy.section5.content')}</p>
              </section>
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  )
}

export default PrivacyPage
