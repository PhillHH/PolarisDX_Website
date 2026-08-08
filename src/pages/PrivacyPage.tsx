import { useTranslation } from 'react-i18next'
import { ShieldCheck } from 'lucide-react'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import LegalLayout from '../components/layout/LegalLayout'

const PrivacyPage = () => {
  const { t, i18n } = useTranslation(['legal', 'common'])

  const headingClass = 'text-xl font-semibold tracking-tight text-heading mb-4'
  const subHeadingClass = 'mt-4 mb-2 font-semibold text-heading'

  // Sichtbarer Breadcrumb und BreadcrumbList aus DERSELBEN Quelle - beide
  // Beschriftungen kommen aus dem i18n-Katalog, nichts ist hier hartkodiert.
  const crumbHome = t('common:nav.home', 'Home')
  const crumbPrivacy = t('privacy.title')

  return (
    <PageTransition>
      <SEOHead
        title={t('privacy.seo.title', 'Datenschutzerklärung')}
        description={t(
          'privacy.seo.description',
          'Datenschutzerklärung der Polaris Diagnostics Europe GmbH - Informationen zur Datenverarbeitung.',
        )}
        noindex={true}
        structuredData={createBreadcrumbSchema(
          [
            { name: crumbHome, url: '/' },
            { name: crumbPrivacy, url: '/privacy' },
          ],
          i18n.language,
        )}
      />
      <LegalLayout
        breadcrumbs={[{ label: crumbHome, href: '/' }, { label: crumbPrivacy }]}
        eyebrow={t('eyebrow', 'Rechtliches')}
        title={t('privacy.title')}
        subtitle={t('privacy.subtitle', '')}
        icon={<ShieldCheck />}
        valueChips={[
          {
            value: t('privacy.hero.gdprValue', 'DSGVO'),
            label: t('privacy.hero.gdprLabel', 'konform'),
          },
          { value: t('privacy.hero.euValue', 'EU'), label: t('privacy.hero.euLabel', 'Hosting') },
        ]}
      >
        <section>
          <h2 className={headingClass}>{t('privacy.section1.title')}</h2>
          <h3 className={subHeadingClass}>{t('privacy.section1.general.title')}</h3>
          <p>{t('privacy.section1.general.content')}</p>

          <h3 className={subHeadingClass}>{t('privacy.section1.collection.title')}</h3>
          <p>
            <strong>{t('privacy.section1.collection.who_title')}</strong>
          </p>
          <p>{t('privacy.section1.collection.who_content')}</p>

          <p className="mt-2">
            <strong>{t('privacy.section1.collection.how_title')}</strong>
          </p>
          <p>{t('privacy.section1.collection.how_content1')}</p>
          <p>{t('privacy.section1.collection.how_content2')}</p>
        </section>

        <section>
          <h2 className={headingClass}>{t('privacy.section2.title')}</h2>
          <p>{t('privacy.section2.content')}</p>
        </section>

        <section>
          <h2 className={headingClass}>{t('privacy.section3.title')}</h2>
          <h3 className={subHeadingClass}>{t('privacy.section3.protection.title')}</h3>
          <p>{t('privacy.section3.protection.content')}</p>

          <h3 className={subHeadingClass}>{t('privacy.section3.responsible.title')}</h3>
          <p>{t('privacy.section3.responsible.content')}</p>
          <p className="mt-2">
            {(t('privacy.section3.responsible.address', { returnObjects: true }) as string[]).map(
              (line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ),
            )}
          </p>

          <h3 className={subHeadingClass}>{t('privacy.section3.storage.title')}</h3>
          <p>{t('privacy.section3.storage.content')}</p>
        </section>

        <section>
          <h2 className={headingClass}>{t('privacy.section4.title')}</h2>
          <h3 className={subHeadingClass}>{t('privacy.section4.form.title')}</h3>
          <p>{t('privacy.section4.form.content1')}</p>
          <p className="mt-2">
            <strong>{t('privacy.section4.form.duration_title')}</strong>{' '}
            {t('privacy.section4.form.duration_content')}
          </p>
          <p>{t('privacy.section4.form.legal_basis')}</p>
        </section>

        <section>
          <h2 className={headingClass}>{t('privacy.section5.title')}</h2>
          <p>{t('privacy.section5.content')}</p>
        </section>
      </LegalLayout>
    </PageTransition>
  )
}

export default PrivacyPage
