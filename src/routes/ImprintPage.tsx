import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { SEOHead } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

const ImprintPage = () => {
  const { t } = useTranslation('legal')
  const toSafeArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

  const londonAddress = useMemo(() => toSafeArray(t('imprint.section1.london.address', { returnObjects: true })), [t])
  const hamburgAddress = useMemo(() => toSafeArray(t('imprint.section1.hamburg.address', { returnObjects: true })), [t])
  const section3Content = useMemo(() => toSafeArray(t('imprint.section3.content', { returnObjects: true })), [t])
  const section4Content = useMemo(() => toSafeArray(t('imprint.section4.content', { returnObjects: true })), [t])
  const section5Content = useMemo(() => toSafeArray(t('imprint.section5.content', { returnObjects: true })), [t])

  return (
    <PageTransition>
      <SEOHead
        title={t('imprint.seo.title', 'Impressum')}
        description={t('imprint.seo.description', 'Impressum der Polaris Diagnostics Europe UG - Kontakt und rechtliche Informationen.')}
        canonical="https://polarisdx.net/imprint"
        noindex={true}
      />
      <div className="pt-32 pb-16 lg:pt-48 lg:pb-32 bg-slate-50">
        <div className="mx-auto max-w-container px-4 lg:px-0">
          <Reveal width="100%" yOffset={20}>
            <h1 className="text-3xl font-bold mb-8 text-gray-900">{t('imprint.title')}</h1>
          </Reveal>

          <Reveal width="100%">
            <div className="space-y-8 text-gray-700 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('imprint.section1.title')}</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">{t('imprint.section1.london.title')}</h3>
                <p><strong>{t('imprint.section1.london.company')}</strong></p>
                {londonAddress.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
                <p className="mt-2"><strong>{t('imprint.section1.london.contact.label')}</strong></p>
                <p>{t('imprint.section1.london.contact.phone')}</p>
                <p>{t('imprint.section1.london.contact.email')}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t('imprint.section1.hamburg.title')}</h3>
                <p><strong>{t('imprint.section1.hamburg.company')}</strong></p>
                {hamburgAddress.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
                <p className="mt-2"><strong>{t('imprint.section1.hamburg.contact.label')}</strong></p>
                <p>{t('imprint.section1.hamburg.contact.email')}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('imprint.section2.title')}</h2>
            <p><strong>{t('imprint.section2.name')}</strong></p>
            <p>{t('imprint.section2.email')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('imprint.section3.title')}</h2>
            {section3Content.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('imprint.section4.title')}</h2>
            {section4Content.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('imprint.section5.title')}</h2>
            {section5Content.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('imprint.section6.title')}</h2>
            <p>
              <span dangerouslySetInnerHTML={{
                __html: t('imprint.section6.content').replace('<1>', '<a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" class="text-brand-secondary hover:underline">').replace('</1>', '</a>')
              }} />
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('imprint.section7.title')}</h2>
            <p>{t('imprint.section7.content')}</p>
              </section>
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  )
}

export default ImprintPage
