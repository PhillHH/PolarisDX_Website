import { useTranslation } from 'react-i18next'
import TeamSection from '../components/sections/TeamSection'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

const AboutPage = () => {
  const { t } = useTranslation(['about', 'home'])

  return (
    <PageTransition>
      <div className="pt-32 pb-16 lg:pt-48 lg:pb-32 bg-primary text-white">
        <div className="mx-auto max-w-container px-4 text-center lg:px-0">
            <Reveal width="100%" yOffset={20}>
              <div className="flex justify-center">
                <div className="inline-block rounded p-[1px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-2">
                    <div className="rounded-sm bg-slate-50 px-3 py-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-900">
                        {t('about:hero.caption', 'ÜBER UNS')}
                    </span>
                    </div>
                </div>
              </div>
              <h1 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl text-white">
                  {t('about:hero.title', 'Wir definieren Diagnostik neu')}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
                  {t('about:hero.description', 'PolarisDX steht für Innovation, Präzision und Verlässlichkeit in der Medizintechnik. Lernen Sie die Menschen hinter unserer Mission kennen.')}
              </p>
            </Reveal>
        </div>
      </div>

      <main className="mx-auto flex max-w-container flex-col gap-32 px-4 py-24 lg:px-0 lg:gap-32 lg:py-32">
        <Reveal width="100%">
          <TeamSection />
        </Reveal>
      </main>
    </PageTransition>
  )
}

export default AboutPage
