import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Trophy } from 'lucide-react'
import Reveal from '../ui/Reveal'
import KristianGrimmAvatar from '../../assets/Testimonials/Dr. Kristian Grimm.webp'

const FeaturedCaseStudy = () => {
  const { t } = useTranslation('casestudies')

  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      {/* Hintergrund-Akzent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-container px-4">
        <Reveal>
          <div className="relative z-20 flex justify-center mb-8 md:mb-10">
            <span className="inline-block rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-primary border border-white/60 shadow-sm backdrop-blur">
              Case Study
            </span>
          </div>

          <div className="relative z-10 grid gap-0 md:grid-cols-2 items-stretch md:min-h-[420px]">
            {/* Bild-Karte (stärker nach oben/links verschoben) */}
            <div className="relative h-full min-h-[360px] md:min-h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white md:-mr-20 md:-mb-24 md:translate-y-[-72px] md:translate-x-[-48px]">
              <img
                src={KristianGrimmAvatar}
                alt="Dr. Kristian Grimm — Zahnarzt und IglooPro Anwender bei 32reasons"
                width={600}
                height={460}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 to-transparent" />
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg">
                <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600 shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <p className="text-gray-900 font-semibold text-sm">
                  {t('reasons32.about.award')}
                </p>
              </div>
            </div>

            {/* Content-Karte (stärker nach unten/rechts verschoben) */}
            <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/50 p-8 lg:p-12 shadow-[0_30px_70px_-35px_rgba(15,23,42,0.45)] flex flex-col justify-center h-full min-h-[360px] md:min-h-[460px] md:-ml-20 md:-mt-24 md:translate-y-[72px] md:translate-x-[48px]">
              <span className="inline-block text-brand-primary font-semibold tracking-wider text-sm mb-4 uppercase">
                {t('reasons32.subtitle')}
              </span>

              <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {t('reasons32.title')}
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {t('reasons32.intro.text')}
              </p>

              <div>
                <Link
                  to="/casestudys/32reasons"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-deep px-8 py-3 text-white font-medium shadow-lg shadow-brand-primary/25 transition-all hover:shadow-brand-primary/40 hover:scale-105"
                >
                  {t('teaser.cta')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default FeaturedCaseStudy
