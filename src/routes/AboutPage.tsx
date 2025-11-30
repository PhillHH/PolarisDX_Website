import { useTranslation } from 'react-i18next'
import AboutSection from '../components/sections/AboutSection'
import TeamSection from '../components/sections/TeamSection'
import SectionHeader from '../components/ui/SectionHeader'

const AboutPage = () => {
  const { t } = useTranslation(['about', 'home'])

  return (
    <>
      <div className="pt-32 pb-16 lg:pt-48 lg:pb-32 bg-primary text-white">
        <div className="mx-auto max-w-container px-4 text-center lg:px-0">
             <SectionHeader
                caption={t('about:hero.caption', 'ÜBER UNS')}
                title={t('about:hero.title', 'Wir definieren Diagnostik neu')}
                align="center"
                className="text-white"
            />
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
                {t('about:hero.description', 'PolarisDX steht für Innovation, Präzision und Verlässlichkeit in der Medizintechnik. Lernen Sie die Menschen hinter unserer Mission kennen.')}
            </p>
        </div>
      </div>

      <main className="mx-auto flex max-w-container flex-col gap-32 px-4 py-24 lg:px-0 lg:gap-32 lg:py-32">
        <AboutSection />
        <TeamSection />
      </main>
    </>
  )
}

export default AboutPage
