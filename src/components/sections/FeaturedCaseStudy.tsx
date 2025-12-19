import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, Trophy } from 'lucide-react'
import Reveal from '../ui/Reveal'
import KristianGrimmAvatar from '../../assets/Testimonials/Dr. Kristian Grimm.jpg'

const FeaturedCaseStudy = () => {
  const { t } = useTranslation('casestudies')

  return (
    <section className="relative py-24 bg-slate-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-container px-4">
        <Reveal>
          <div className="relative grid lg:grid-cols-12 gap-8 lg:gap-0 items-center">

            {/* Image Card (Left on Desktop) */}
            <div className="lg:col-span-7 relative z-10">
              <div className="relative aspect-[16/9] lg:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl group border border-gray-100">
                <img
                  src={KristianGrimmAvatar}
                  alt="Dr. Kristian Grimm - 32reasons"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 to-transparent" />

                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 bg-white/90 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-3 max-w-[calc(100%-3rem)] shadow-lg">
                  <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600 shrink-0">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-sm lg:text-base leading-tight">
                      {t('reasons32.about.award')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Card (Overlapping Right) */}
            <div className="lg:col-span-6 lg:-ml-24 relative z-20 mt-6 lg:mt-0">
              <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-8 lg:p-12 shadow-xl hover:bg-white transition-colors duration-500">
                <span className="inline-block text-primary font-semibold tracking-wider text-sm mb-4 uppercase">
                  {t('reasons32.subtitle')}
                </span>

                <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {t('reasons32.title')}
                </h2>

                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {t('reasons32.intro.text')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/casestudys/32reasons"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-deep px-8 py-3 text-white font-medium shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:scale-105"
                  >
                    {t('teaser.cta')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default FeaturedCaseStudy
