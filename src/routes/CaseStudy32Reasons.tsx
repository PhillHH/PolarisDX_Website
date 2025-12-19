import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, MapPin, Award, Activity, Globe } from 'lucide-react'
import SectionHeader from '../components/ui/SectionHeader'
import KristianGrimmAvatar from '../assets/Testimonials/Dr. Kristian Grimm.jpg'
import Reveal from '../components/ui/Reveal'

const CaseStudy32Reasons = () => {
  const { t } = useTranslation('casestudies')

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-deep to-gray-900 opacity-50" />
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

        <div className="relative mx-auto max-w-container px-4">
          <Reveal>
            <div className="flex flex-col items-center text-center gap-6">
              <span className="inline-block rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 backdrop-blur-sm border border-blue-500/20">
                {t('reasons32.subtitle')}
              </span>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl max-w-4xl">
                {t('reasons32.title')}
              </h1>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="relative mx-auto max-w-container px-4 py-16 lg:py-24">

        {/* Intro Section */}
        <section className="mb-24 grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/5 border border-white/10 relative group">
              <img
                src={KristianGrimmAvatar}
                alt="Dr. Kristian Grimm"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 right-6">
                 <p className="text-white font-medium text-lg">Dr. Kristian Grimm</p>
                 <p className="text-white/70 text-sm">32reasons Zahnteam</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">{t('reasons32.intro.title')}</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                {t('reasons32.intro.text')}
              </p>
            </div>
          </Reveal>
        </section>

        {/* Philosophy Section */}
        <section className="mb-24 rounded-3xl bg-white/5 p-8 lg:p-12 border border-white/10 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <SectionHeader
              caption={t('reasons32.philosophy.caption', 'Philosophie')}
              title={t('reasons32.philosophy.title')}
              titleClassName="text-white mb-12 text-center"
            />

            <div className="grid gap-6 md:grid-cols-2">
              {(t('reasons32.philosophy.points', { returnObjects: true }) as string[]).map((point, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="text-gray-300">{point}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Role of Polaris DX */}
        <section className="mb-24">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">{t('reasons32.role.title')}</h2>
            <p className="text-lg text-gray-300">
              {t('reasons32.role.text')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {(t('reasons32.role.points', { returnObjects: true }) as any[]).map((item, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <div className="h-full rounded-2xl bg-gradient-to-b from-white/10 to-white/5 p-8 border border-white/10 hover:border-blue-500/30 transition-all group">
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Quote Block */}
        <section className="mb-24">
          <Reveal>
            <div className="relative rounded-3xl bg-gradient-to-r from-blue-900/40 to-primary-deep/40 p-12 text-center border border-blue-500/20">
              <div className="relative z-10">
                <blockquote className="text-2xl font-medium leading-relaxed text-white md:text-3xl lg:text-4xl font-display italic">
                  &ldquo;{t('reasons32.quote')}&rdquo;
                </blockquote>
              </div>
            </div>
          </Reveal>
        </section>

        {/* About 32reasons Info */}
        <section className="grid gap-12 lg:grid-cols-2 mb-24">
          <Reveal>
             <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-8">{t('reasons32.about.title')}</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-blue-400 shrink-0" />
                    <div>
                      <span className="block text-sm text-gray-500 mb-1">{t('reasons32.about.location_label')}</span>
                      <span className="text-white text-lg">{t('reasons32.about.location')}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Award className="w-6 h-6 text-blue-400 shrink-0" />
                    <div>
                      <span className="block text-sm text-gray-500 mb-1">{t('reasons32.about.award_label')}</span>
                      <span className="text-white text-lg">{t('reasons32.about.award')}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Activity className="w-6 h-6 text-blue-400 shrink-0" />
                    <div>
                      <span className="block text-sm text-gray-500 mb-1">{t('reasons32.about.focus_label')}</span>
                      <span className="text-white text-lg">{t('reasons32.about.focus')}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Globe className="w-6 h-6 text-blue-400 shrink-0" />
                    <div>
                      <span className="block text-sm text-gray-500 mb-1">{t('reasons32.about.web_label')}</span>
                      <a href="https://www.32reasons.de" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-lg transition-colors underline decoration-blue-500/30 hover:decoration-blue-500">
                        www.32reasons.de
                      </a>
                    </div>
                  </li>
                </ul>
             </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-col justify-center h-full rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-10 text-center shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold text-white mb-4">
                   {t('reasons32.cta.title')}
                 </h3>
                 <p className="text-blue-100 mb-8">
                   {t('reasons32.role.text')}
                 </p>
                 <Link
                   to="/contact"
                   className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-blue-900 transition-transform hover:scale-105 hover:bg-blue-50"
                 >
                   {t('reasons32.cta.button')}
                   <ArrowRight className="h-5 w-5" />
                 </Link>
               </div>
            </div>
          </Reveal>
        </section>

      </div>
    </div>
  )
}

export default CaseStudy32Reasons
