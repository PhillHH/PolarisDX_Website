import { useHeroSlider } from '../../hooks/useHeroSlider'
import { Button } from '../ui/Button'
import StatItem from '../ui/StatItem'
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import iglooLogoWhite from '../../assets/igloo_logo_white.webp'

/**
 * SSR-safe HeroSection component
 *
 * CRITICAL FOR SEO & LCP:
 * - h1 and description are ALWAYS visible (no initial opacity:0)
 * - SSR renders content fully visible
 * - Client hydration keeps content visible (no animation on first render)
 * - Animations only play on SLIDE CHANGES, not on initial load
 */
const HeroSection = () => {
  const { currentSlide, setCurrentSlide, slides, t } = useHeroSlider()

  // Track hydration and whether this is the first render after hydration
  const [isHydrated, setIsHydrated] = useState(false)
  const isFirstRender = useRef(true)
  const previousSlide = useRef(currentSlide)

  useEffect(() => {
    setIsHydrated(true)
    // After first effect, mark first render as complete
    isFirstRender.current = false
  }, [])

  // Detect if this is a slide change (not first render)
  const isSlideChange = previousSlide.current !== currentSlide && !isFirstRender.current
  previousSlide.current = currentSlide

  // Custom easing curve for smooth animations
  const smoothEase = [0.22, 1, 0.36, 1] as const

  // Animation variants - only animate on slide changes, not on initial render
  const contentVariants = {
    // For initial render after hydration: no animation (instant visible)
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: smoothEase },
    },
    // For slide exits
    exit: {
      opacity: 0,
      y: -10,
      filter: 'blur(8px)',
      transition: { duration: 0.4, ease: 'easeIn' as const },
    },
  }

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-deep to-gray-900 text-white min-h-[700px] lg:h-[800px]"
    >
      {/* Noise Overlay */}
      <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />

      {/* Dynamic Background Gradients - always visible, animation only on client */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute inset-y-0 left-0 w-[500px] bg-gradient-to-br from-brand-secondary/20 via-brand-primary/10 to-transparent blur-3xl" />
        <div className="absolute inset-y-0 right-0 w-[500px] bg-gradient-to-tl from-brand-deep/40 via-brand-primary/20 to-transparent blur-3xl" />
      </div>


      <div className="relative z-10 mx-auto flex h-full max-w-container items-stretch px-6 pt-12 pb-20 sm:px-8 lg:px-0 lg:pt-12 lg:pb-0">
        <div className="grid w-full h-full gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">

          {/* Left Content Area */}
          <div className="flex flex-col justify-center space-y-9 lg:space-y-7 z-20">
            <div className="space-y-3 lg:space-y-2 h-[300px] sm:h-[350px] lg:h-hero-lg flex flex-col justify-center">
              {/* Logo - always visible, no animation delays */}
              <img
                src={iglooLogoWhite}
                alt="IglooPro Logo"
                width={200}
                height={56}
                className="h-14 w-auto drop-shadow-sm mb-4 self-start"
              />

              {/* Main Content - CRITICAL FOR LCP: H1 must be immediately visible */}
              {isHydrated ? (
                <LazyMotion features={domAnimation}>
                  <AnimatePresence mode="wait">
                    <m.div
                      key={slides[currentSlide].id}
                      // CRITICAL: initial={false} prevents animation on first render
                      // This keeps H1 visible immediately for LCP
                      initial={isSlideChange ? { opacity: 0 } : false}
                      animate="visible"
                      exit="exit"
                      variants={{
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.15, delayChildren: isSlideChange ? 0.1 : 0 },
                        },
                        exit: {
                          opacity: 0,
                          transition: { staggerChildren: 0.05, staggerDirection: -1 },
                        },
                      }}
                    >
                      {/* H1 - LCP Element - MUST be visible immediately */}
                      <m.h1
                        initial={isSlideChange ? { opacity: 0, y: 20, filter: 'blur(10px)' } : false}
                        animate="visible"
                        variants={contentVariants}
                        className="max-w-3xl font-medium tracking-[-0.02em] text-[clamp(32px,7vw,64px)] leading-[clamp(38px,7.6vw,72px)]"
                      >
                        {slides[currentSlide].content.title}
                      </m.h1>
                      <m.p
                        initial={isSlideChange ? { opacity: 0, y: 20, filter: 'blur(10px)' } : false}
                        animate="visible"
                        variants={contentVariants}
                        className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base"
                      >
                        {slides[currentSlide].content.description}
                      </m.p>
                    </m.div>
                  </AnimatePresence>
                </LazyMotion>
              ) : (
                /* SSR: Render first slide content fully visible - no opacity:0! */
                <div>
                  <h1 className="max-w-3xl font-medium tracking-[-0.02em] text-[clamp(32px,7vw,64px)] leading-[clamp(38px,7.6vw,72px)]">
                    {slides[0].content.title}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                    {slides[0].content.description}
                  </p>
                </div>
              )}
            </div>

            {/* Buttons and Stats - always visible */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
                <Button
                  to="/contact"
                  variant="primary"
                  size="sm"
                  className="w-full text-center sm:w-auto sm:whitespace-nowrap"
                >
                  {t('hero.cta', 'Termin buchen')}
                </Button>
                <Button
                  to="/downloads"
                  variant="outline-light"
                  size="sm"
                  className="w-full text-center sm:w-auto sm:whitespace-nowrap"
                >
                  {t('hero.cta_downloads', 'Infomaterialien herunterladen')}
                </Button>
              </div>

              <div className="mt-6 flex flex-row items-start gap-6 lg:mt-4">
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
              </div>
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

          {/* Right Visual Area - always visible on SSR, animations only for slide changes */}
          <div className="relative mx-auto hidden h-full w-full max-w-lg items-end justify-center lg:flex pointer-events-none">
             {isHydrated && isSlideChange ? (
               <LazyMotion features={domAnimation}>
                 <AnimatePresence mode="wait">
                    {slides[currentSlide].type === 'image' ? (
                         <m.div
                            key="image-slide"
                            className="relative h-full w-full flex items-end justify-center"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.6 }}
                         >
                            <div className="absolute bottom-0 right-4 h-[440px] w-[280px] bg-brand-secondary lg:bottom-0 z-0" />
                            <img
                                src={slides[currentSlide].visual}
                                alt="PolarisDX doctor"
                                width={390}
                                height={780}
                                className="relative z-10 h-[780px] w-auto object-contain object-bottom -mb-8 right-8"
                            />
                         </m.div>
                    ) : (
                        <m.div
                            key={`icon-slide-${slides[currentSlide].id}`}
                            className="relative h-full w-full flex items-center justify-center"
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                            transition={{ duration: 0.6, ease: "backOut" }}
                        >
                             <div className={`absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-60 bg-gradient-to-r ${slides[currentSlide].color}`} />
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
                        </m.div>
                    )}
                 </AnimatePresence>
               </LazyMotion>
             ) : (
               /* SSR + First client render: Show image immediately, no animation */
               <div className="relative h-full w-full flex items-end justify-center">
                  <div className="absolute bottom-0 right-4 h-[440px] w-[280px] bg-brand-secondary lg:bottom-0 z-0" />
                  <img
                      src={slides[currentSlide]?.visual || slides[0].visual}
                      alt="PolarisDX doctor"
                      width={390}
                      height={780}
                      fetchPriority="high"
                      className="relative z-10 h-[780px] w-auto object-contain object-bottom -mb-8 right-8"
                  />
               </div>
             )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
