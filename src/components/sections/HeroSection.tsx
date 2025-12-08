import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PrimaryButton from '../ui/PrimaryButton'
import StatItem from '../ui/StatItem'
import heroDoctor from '../../assets/hero_doctor.png'
import iglooLogoWhite from '../../assets/igloo_logo_white.png'

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

      <div className="relative z-10 mx-auto flex min-h-[490px] max-w-container items-stretch px-6 pt-16 pb-0 sm:px-8 lg:px-0 lg:pt-14 lg:pb-0">
        <div className="grid w-full gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex flex-col justify-center space-y-8 lg:space-y-6">
          <div className="space-y-2 lg:space-y-1.5">
            <img
              src={iglooLogoWhite}
              alt="IglooPro Logo"
              className="h-16 w-auto drop-shadow-sm"
            />
            <h1 className="max-w-3xl font-medium tracking-[-0.02em] text-[clamp(32px,7vw,64px)] leading-[clamp(38px,7.6vw,72px)]">
              {t('hero.title', 'Intelligente Diagnostik: Der neue Maßstab für effiziente POC-Workflows.')}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
              {t('hero.description', 'Sichern Sie sich das Performance-Paket: Ihr IglooPro ist in 48 Stunden einsatzbereit – garantiert.')}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
              <PrimaryButton
                as={Link}
                to="/contact"
                variant="primary"
                size="sm"
                className="w-full text-center sm:w-auto sm:whitespace-nowrap"
              >
                {t('hero.cta', 'Termin buchen')}
              </PrimaryButton>
              <PrimaryButton
                as={Link}
                to="/downloads"
                variant="outline-light"
                size="sm"
                className="w-full text-center sm:w-auto sm:whitespace-nowrap"
              >
                {t('hero.cta_downloads', 'Infomaterialien herunterladen')}
              </PrimaryButton>
            </div>

            <div className="mt-1 flex flex-row items-start gap-4 lg:mt-0">
              <StatItem
                value={t('hero.stat1.value', '48h')}
                label={t('hero.stat1.label', 'Einsatzbereit nach Bestellung')}
                size="sm"
                className="scale-90 origin-top-left py-0"
              />
              <StatItem
                value={t('hero.stat2.value', 'CV < 2%')}
                label={t('hero.stat2.label', 'Präzision über den gesamten Messbereich')}
                size="sm"
                className="scale-90 origin-top-left py-0"
              />
            </div>
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
            className="relative z-10 h-[900px] w-auto object-contain object-bottom -mb-10"
          />
        </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
