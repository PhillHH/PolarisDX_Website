import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PrimaryButton from '../ui/PrimaryButton'
import StatItem from '../ui/StatItem'
import heroDoctor from '../../assets/hero_doctor.png'

const HeroSection = () => {
  const { t } = useTranslation('home')

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-primary text-white"
    >
      {/* gradient accents */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-80 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-80 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

      <div className="relative z-10 mx-auto flex min-h-[530px] max-w-container items-stretch px-4 pt-16 pb-0 lg:px-0 lg:pt-20 lg:pb-0">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="flex flex-col justify-center space-y-8">
          <div className="inline-flex items-center gap-3">
            <span className="inline-flex items-center rounded bg-accentBlue px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
              {t('hero.caption', 'Point-of-care Performance')}
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="max-w-2xl text-[56px] leading-[64px] font-medium tracking-[-0.02em] sm:text-[56px] sm:leading-[64px] lg:text-[64px] lg:leading-[72px] whitespace-pre-line">
              {t('hero.title', 'IglooPro:\nPoint-of-Care. Perfekt. Sofort.')}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              {t('hero.description', 'Sichern Sie sich das Performance-Paket: Ihr IglooPro ist in 48 Stunden einsatzbereit – garantiert.')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <PrimaryButton as={Link} to="/contact" variant="primary">
              {t('hero.cta', 'Jetzt 15-Minuten Performance-Analyse buchen')}
            </PrimaryButton>
          </div>

          <div className="mt-4 flex flex-wrap gap-10">
            <StatItem
              value={t('hero.stat1.value', '48h')}
              label={t('hero.stat1.label', 'Einsatzbereit nach Bestellung')}
            />
            <StatItem
              value={t('hero.stat2.value', 'CV < 2%')}
              label={t('hero.stat2.label', 'Präzision über den gesamten Messbereich')}
            />
          </div>
        </div>

        {/* Bildbereich nur auf Desktop anzeigen */}
        <div className="relative mx-auto hidden h-full max-w-lg items-end justify-center lg:flex">
          {/* Rechteckiger Hintergrund wieder direkt am unteren Rand der Hero-Section */}
          <div className="pointer-events-none absolute bottom-0 right-4 h-[520px] w-[280px] bg-secondary lg:bottom-0" />
          {/* Ärztin wird zusammen mit dem Hintergrund nach oben geschoben */}
          <img
            src={heroDoctor}
            alt="PolarisDX doctor holding device"
            className="relative z-10 h-[840px] w-auto object-contain object-bottom"
          />
        </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
