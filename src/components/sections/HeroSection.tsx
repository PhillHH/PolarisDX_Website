import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import PrimaryButton from '../ui/PrimaryButton'
import StatItem from '../ui/StatItem'
import heroDoctor from '../../assets/hero_doctor.png'
import iglooLogoWhite from '../../assets/igloo_logo_white.png'

const HeroSection = () => {
  const { t } = useTranslation('home')

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-deep to-gray-900 text-white"
    >
      {/* noise overlay */}
      <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />

      {/* gradient accents */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[500px] bg-gradient-to-br from-secondary/20 via-primary/10 to-transparent opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[500px] bg-gradient-to-tl from-primary-deep/40 via-primary/20 to-transparent opacity-30 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[490px] max-w-container items-stretch px-6 pt-16 pb-0 sm:px-8 lg:px-0 lg:pt-14 lg:pb-0">
        <div className="grid w-full gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex flex-col justify-center space-y-9 lg:space-y-7">
          <div className="space-y-3 lg:space-y-2">
            <motion.img
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              src={iglooLogoWhite}
              alt="IglooPro Logo"
              className="h-14 w-auto drop-shadow-sm"
            />
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="max-w-3xl font-medium tracking-[-0.02em] text-[clamp(32px,7vw,64px)] leading-[clamp(38px,7.6vw,72px)]"
            >
              {t('hero.title', 'Intelligente Diagnostik: Der neue Maßstab für effiziente POC-Workflows.')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base"
            >
              {t('hero.description', 'Sichern Sie sich das Performance-Paket: Ihr IglooPro ist in 48 Stunden einsatzbereit – garantiert.')}
            </motion.p>
          </div>

          <div className="flex flex-col gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
              className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6"
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-2 flex flex-row items-start gap-6 lg:mt-1"
            >
              <StatItem
                value={t('hero.stat1.value', '48h')}
                label={t('hero.stat1.label', 'Einsatzbereit nach Bestellung')}
                size="sm"
                className="scale-75 origin-top-left py-0"
              />
              <StatItem
                value={t('hero.stat2.value', 'CV < 2%')}
                label={t('hero.stat2.label', 'Präzision über den gesamten Messbereich')}
                size="sm"
                className="scale-75 origin-top-left py-0"
              />
            </motion.div>
          </div>
        </div>

        {/* Bildbereich nur auf Desktop anzeigen */}
        <div className="relative mx-auto hidden h-full max-w-lg items-end justify-center lg:flex">
          {/* Rechteckiger Hintergrund wieder direkt am unteren Rand der Hero-Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="pointer-events-none absolute bottom-0 right-4 h-[520px] w-[280px] bg-secondary lg:bottom-0"
          />
          {/* Ärztin wird zusammen mit dem Hintergrund nach oben geschoben */}
          <motion.img
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            src={heroDoctor}
            alt="PolarisDX doctor holding device"
            className="relative z-10 h-[900px] w-auto object-contain object-bottom -mb-20 right-8"
          />
        </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
