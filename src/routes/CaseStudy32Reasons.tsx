import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, MapPin, Award, Activity, Globe } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import SectionHeader from '../components/ui/SectionHeader'
import Reveal from '../components/ui/Reveal'
import KristianGrimmAvatar from '../assets/Testimonials/Dr. Kristian Grimm.jpg'

const CaseStudy32Reasons = () => {
  const { t } = useTranslation('casestudies')

  const philosophyPoints = useMemo(() => {
    const result = t('reasons32.philosophy.points', { returnObjects: true })
    return Array.isArray(result) ? result : []
  }, [t])

  const rolePoints = useMemo(() => {
    const result = t('reasons32.role.points', { returnObjects: true })
    return Array.isArray(result) ? result : []
  }, [t])

  const heroTitle = useMemo(() => t('reasons32.title'), [t])
  const heroSubtitle = useMemo(() => t('reasons32.subtitle'), [t])

  return (
    <PageTransition>
      {/* Hero im globalen Stil */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-deep to-gray-900 text-white">
        <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-container px-4 text-center lg:px-0 pt-32 pb-16 lg:pt-48 lg:pb-28">
          <Reveal width="100%" yOffset={20}>
            <div className="flex justify-center">
              <div className="inline-block rounded p-px bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-deep shadow-lg shadow-brand-primary/20 mb-3">
                <div className="rounded-sm bg-slate-50 px-3 py-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-900">
                {heroSubtitle}
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl text-white max-w-4xl mx-auto">
              {heroTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              {t('reasons32.role.text')}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-container px-4 py-16 lg:py-24 flex flex-col gap-20 lg:px-0">
        {/* Intro */}
        <section className="grid gap-12 lg:grid-cols-[1.1fr,1fr] lg:items-center lg:gap-16">
          <Reveal>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100 relative group">
              <img
                src={KristianGrimmAvatar}
                alt="Dr. Kristian Grimm"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-medium text-lg">Dr. Kristian Grimm</p>
                <p className="text-white/80 text-sm">32reasons Zahnteam</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-6 lg:-ml-12 lg:-translate-y-6 lg:max-w-xl lg:relative">
              <h2 className="text-3xl font-bold text-gray-900">{t('reasons32.intro.title')}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('reasons32.intro.text')}
              </p>
            </div>
          </Reveal>
        </section>

        {/* Philosophie */}
        <section className="rounded-3xl bg-white p-8 lg:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <SectionHeader
              caption={t('reasons32.philosophy.caption', 'Philosophie')}
              title={t('reasons32.philosophy.title')}
              titleClassName="text-gray-900 mb-10 text-center"
            />
            <div className="grid gap-6 md:grid-cols-2">
              {philosophyPoints.map((point, i) => (
                <Reveal key={point} delay={i * 0.08}>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-gray-100">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-brand-primary">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="text-gray-600">{point}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Rolle von Polaris DX */}
        <section className="flex flex-col gap-10">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">{t('reasons32.role.title')}</h2>
            <p className="text-lg text-gray-600">
              {t('reasons32.role.text')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {rolePoints.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.1}>
                <div className="h-full rounded-2xl bg-white p-8 border border-gray-200 shadow-md hover:shadow-lg hover:border-brand-primary/30 transition-all">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Quote */}
        <section>
          <Reveal>
            <div className="relative rounded-3xl bg-gradient-to-r from-brand-deep to-brand-primary p-12 text-center shadow-xl">
              <blockquote className="text-2xl font-medium leading-relaxed text-white md:text-3xl lg:text-4xl font-display italic">
                &ldquo;{t('reasons32.quote')}&rdquo;
              </blockquote>
            </div>
          </Reveal>
        </section>

        {/* About + CTA */}
        <section className="grid gap-12 lg:grid-cols-2 items-stretch">
          <Reveal>
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg h-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">{t('reasons32.about.title')}</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-brand-primary shrink-0" />
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">{t('reasons32.about.location_label')}</span>
                    <span className="text-gray-900 text-lg">{t('reasons32.about.location')}</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Award className="w-6 h-6 text-brand-primary shrink-0" />
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">{t('reasons32.about.award_label')}</span>
                    <span className="text-gray-900 text-lg">{t('reasons32.about.award')}</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Activity className="w-6 h-6 text-brand-primary shrink-0" />
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">{t('reasons32.about.focus_label')}</span>
                    <span className="text-gray-900 text-lg">{t('reasons32.about.focus')}</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Globe className="w-6 h-6 text-brand-primary shrink-0" />
                  <div>
                    <span className="block text-sm text-gray-500 mb-1">{t('reasons32.about.web_label')}</span>
                    <a
                      href="https://www.32reasons.de"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:text-brand-deep text-lg transition-colors underline decoration-brand-primary/30 hover:decoration-brand-primary"
                    >
                      www.32reasons.de
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-col justify-center h-full rounded-2xl bg-gradient-to-br from-brand-primary to-brand-deep p-10 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <h3 className="text-2xl font-bold text-white">
                  {t('reasons32.cta.title')}
                </h3>
                <p className="text-blue-100">
                  {t('reasons32.role.text')}
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-brand-deep transition-transform hover:scale-105 hover:bg-gray-50"
                >
                  {t('reasons32.cta.button')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </PageTransition>
  )
}

export default CaseStudy32Reasons
