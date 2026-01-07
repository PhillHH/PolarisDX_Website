import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import PrimaryButton from '../ui/PrimaryButton'
import StatItem from '../ui/StatItem'
import { Sparkles, Infinity as InfinityIcon } from 'lucide-react'
import heroDoctor from '../../assets/hero_doctor.png'
import iglooLogoWhite from '../../assets/igloo_logo_white.png'

const HeroSection = () => {
  const { t } = useTranslation('home')
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 'dental',
      type: 'image',
      content: {
        title: t('hero.dental.title', 'Intelligente Diagnostik: Der neue Maßstab für effiziente POC-Workflows.'),
        description: t('hero.dental.description', 'Sichern Sie sich das Performance-Paket: Ihr IglooPro ist in 48 Stunden einsatzbereit – garantiert.'),
      },
      visual: heroDoctor,
    },
    {
      id: 'beauty',
      type: 'icon',
      icon: Sparkles,
      color: 'from-pink-500 to-purple-500', // Gradient for glow
      content: {
        title: t('hero.beauty.title', 'Wissenschaftliche Ästhetik: Messergebnisse statt Vermutungen.'),
        description: t('hero.beauty.description', 'Visualisieren Sie den Erfolg Ihrer Behandlungen. Der IglooPro liefert präzise Daten zu Anti-Aging-Markern und Hautgesundheit in Laborqualität.'),
      },
    },
    {
      id: 'longevity',
      type: 'icon',
      icon: InfinityIcon,
      color: 'from-green-400 to-emerald-600', // Gradient for glow
      content: {
        title: t('hero.longevity.title', 'Prävention neu definiert: Vitalität messbar machen.'),
        description: t('hero.longevity.description', 'Erkennen Sie Trends frühzeitig. Hochpräzises Monitoring von Entzündungs- und Stoffwechselmarkern für ein langes, gesundes Leben.'),
      },
    },
  ]

  // Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-deep to-gray-900 text-white min-h-[700px] lg:h-[800px]"
    >
      {/* Noise Overlay */}
      <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />

      {/* Dynamic Background Gradients based on Slide */}
      <AnimatePresence mode="wait">
        <motion.div
            key={slides[currentSlide].id + "-bg"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="pointer-events-none absolute inset-0"
        >
             {/* Default Blue/Deep Blue accents - adjusted per slide if needed in future */}
            <div className="absolute inset-y-0 left-0 w-[500px] bg-gradient-to-br from-brand-secondary/20 via-brand-primary/10 to-transparent blur-3xl" />
            <div className="absolute inset-y-0 right-0 w-[500px] bg-gradient-to-tl from-brand-deep/40 via-brand-primary/20 to-transparent blur-3xl" />
        </motion.div>
      </AnimatePresence>


      <div className="relative z-10 mx-auto flex h-full max-w-container items-stretch px-6 pt-12 pb-20 sm:px-8 lg:px-0 lg:pt-12 lg:pb-0">
        <div className="grid w-full h-full gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">

          {/* Left Content Area */}
          <div className="flex flex-col justify-center space-y-9 lg:space-y-7 z-20">
            <div className="space-y-3 lg:space-y-2 h-[300px] sm:h-[350px] lg:h-hero-lg flex flex-col justify-center">
              <motion.img
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                src={iglooLogoWhite}
                alt="IglooPro Logo"
                className="h-14 w-auto drop-shadow-sm mb-4 self-start"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={slides[currentSlide].id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
                    },
                    exit: {
                      opacity: 0,
                      transition: { staggerChildren: 0.05, staggerDirection: -1 },
                    },
                  }}
                >
                  <motion.h1
                    variants={{
                      hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
                      visible: {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                      },
                      exit: {
                        opacity: 0,
                        y: -10,
                        filter: 'blur(8px)',
                        transition: { duration: 0.4, ease: 'easeIn' },
                      },
                    }}
                    className="max-w-3xl font-medium tracking-[-0.02em] text-[clamp(32px,7vw,64px)] leading-[clamp(38px,7.6vw,72px)]"
                  >
                    {slides[currentSlide].content.title}
                  </motion.h1>
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
                      visible: {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                      },
                      exit: {
                        opacity: 0,
                        y: -10,
                        filter: 'blur(8px)',
                        transition: { duration: 0.4, ease: 'easeIn' },
                      },
                    }}
                    className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base"
                  >
                    {slides[currentSlide].content.description}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
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
                className="mt-6 flex flex-row items-start gap-6 lg:mt-4"
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

             {/* Slider Navigation Dots */}
            <div className="flex space-x-3 mt-8">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                            currentSlide === index ? "w-8 bg-brand-secondary" : "w-2.5 bg-white/30 hover:bg-white/50"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

          </div>

          {/* Right Visual Area (Image or Fancy Icon) */}
          <div className="relative mx-auto hidden h-full w-full max-w-lg items-end justify-center lg:flex pointer-events-none">
             <AnimatePresence mode="wait">
                {slides[currentSlide].type === 'image' ? (
                     <motion.div
                        key="image-slide"
                        className="relative h-full w-full flex items-end justify-center"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }} // Slide out to left
                        transition={{ duration: 0.6 }}
                     >
                        {/* Background Rect for Image */}
                        <div className="absolute bottom-0 right-4 h-[440px] w-[280px] bg-brand-secondary lg:bottom-0 z-0" />
                        <img
                            src={slides[currentSlide].visual}
                            alt="PolarisDX doctor"
                            className="relative z-10 h-[780px] w-auto object-contain object-bottom -mb-8 right-8"
                        />
                     </motion.div>
                ) : (
                    <motion.div
                        key={`icon-slide-${slides[currentSlide].id}`}
                        className="relative h-full w-full flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                        transition={{ duration: 0.6, ease: "backOut" }}
                    >
                         {/* Glow Effect */}
                         <div className={`absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-60 bg-gradient-to-r ${slides[currentSlide].color}`} />

                         {/* Icon */}
                         {slides[currentSlide].icon && (() => {
                             const Icon = slides[currentSlide].icon
                             return (
                                 <Icon
                                    size={600}
                                    strokeWidth={0.5}
                                    className="text-white/90 drop-shadow-2xl relative z-10"
                                 />
                             )
                         })()}
                    </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
