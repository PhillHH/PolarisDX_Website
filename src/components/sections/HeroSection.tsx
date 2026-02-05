import { useHeroSlider } from '../../hooks/useHeroSlider'
import { Button } from '../ui/Button'
import StatItem from '../ui/StatItem'
import { useState, useEffect, useRef } from 'react'
import iglooLogoWhite from '../../assets/igloo_logo_white.webp'

/**
 * SSR-safe HeroSection component - NO framer-motion, pure CSS animations
 *
 * CRITICAL FOR SEO & LCP:
 * - h1 and description are ALWAYS visible (no initial opacity:0)
 * - SSR renders content fully visible
 * - Client hydration keeps content visible (no animation on first render)
 * - Animations only play on SLIDE CHANGES, not on initial load
 */
const HeroSection = () => {
  const { currentSlide, setCurrentSlide, slides, t } = useHeroSlider()

  // Track hydration and slide changes for animations
  const [isHydrated, setIsHydrated] = useState(false)
  const [displaySlide, setDisplaySlide] = useState(currentSlide)
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'exiting' | 'entering'>('idle')
  const isFirstRender = useRef(true)

  // Hydration effect
  useEffect(() => {
    setIsHydrated(true)
    isFirstRender.current = false
  }, [])

  // Handle slide change with exit/enter animation phases
  useEffect(() => {
    if (isFirstRender.current || currentSlide === displaySlide) return

    // Start exit animation
    setAnimationPhase('exiting')

    // After exit animation, switch slide and start enter animation
    const exitTimer = setTimeout(() => {
      setDisplaySlide(currentSlide)
      setAnimationPhase('entering')

      // After enter animation, go idle
      const enterTimer = setTimeout(() => {
        setAnimationPhase('idle')
      }, 600) // Match CSS animation duration

      return () => clearTimeout(enterTimer)
    }, 400) // Match CSS exit animation duration

    return () => clearTimeout(exitTimer)
  }, [currentSlide, displaySlide])

  // Get animation classes for content
  const getContentAnimationClass = () => {
    if (!isHydrated || isFirstRender.current) return ''
    if (animationPhase === 'exiting') return 'animate-slide-out-up'
    if (animationPhase === 'entering') return 'animate-slide-in-up'
    return ''
  }

  // Get animation classes for visuals
  const getVisualAnimationClass = () => {
    if (!isHydrated || isFirstRender.current) return ''
    const slide = slides[displaySlide]
    if (slide.type === 'image') {
      if (animationPhase === 'exiting') return 'animate-slide-out-left'
      if (animationPhase === 'entering') return 'animate-slide-in-right'
    } else {
      if (animationPhase === 'exiting') return 'animate-icon-out'
      if (animationPhase === 'entering') return 'animate-icon-in'
    }
    return ''
  }

  const currentDisplaySlide = slides[displaySlide]

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-deep to-gray-900 text-white min-h-[700px] lg:h-[800px]"
    >
      {/* Noise Overlay */}
      <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />

      {/* Dynamic Background Gradients */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute inset-y-0 left-0 w-[500px] bg-gradient-to-br from-brand-secondary/20 via-brand-primary/10 to-transparent blur-3xl" />
        <div className="absolute inset-y-0 right-0 w-[500px] bg-gradient-to-tl from-brand-deep/40 via-brand-primary/20 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-container items-stretch px-6 pt-12 pb-20 sm:px-8 lg:px-0 lg:pt-12 lg:pb-0">
        <div className="grid w-full h-full gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">

          {/* Left Content Area */}
          <div className="flex flex-col justify-center space-y-9 lg:space-y-7 z-20">
            <div className="space-y-3 lg:space-y-2 h-[300px] sm:h-[350px] lg:h-hero-lg flex flex-col justify-center">
              {/* Logo - LCP Element - always visible, no animation delays */}
              <img
                src={iglooLogoWhite}
                alt="IglooPro Logo"
                width={200}
                height={56}
                fetchPriority="high"
                className="h-14 w-auto drop-shadow-sm mb-4 self-start"
              />

              {/* Main Content - CSS animated on slide change */}
              {/* SEO: Only first slide (dental) gets H1, others get H2 */}
              <div className={getContentAnimationClass()}>
                {displaySlide === 0 ? (
                  <h1 className="max-w-3xl font-medium tracking-[-0.02em] text-[clamp(32px,7vw,64px)] leading-[clamp(38px,7.6vw,72px)]">
                    {currentDisplaySlide.content.title}
                  </h1>
                ) : (
                  <h2 className="max-w-3xl font-medium tracking-[-0.02em] text-[clamp(32px,7vw,64px)] leading-[clamp(38px,7.6vw,72px)]">
                    {currentDisplaySlide.content.title}
                  </h2>
                )}
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                  {currentDisplaySlide.content.description}
                </p>
              </div>
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

          {/* Right Visual Area - CSS animated on slide change */}
          <div className="relative mx-auto hidden h-full w-full max-w-lg items-end justify-center lg:flex pointer-events-none">
            <div className={getVisualAnimationClass()}>
              {currentDisplaySlide.type === 'image' ? (
                <div className="relative h-full w-full flex items-end justify-center">
                  <div className="absolute bottom-0 right-4 h-[440px] w-[280px] bg-brand-secondary lg:bottom-0 z-0" />
                  <img
                    src={currentDisplaySlide.visual}
                    alt="PolarisDX doctor"
                    width={390}
                    height={780}
                    fetchPriority="high"
                    className="relative z-10 h-[780px] w-auto object-contain object-bottom -mb-8 right-8"
                  />
                </div>
              ) : (
                <div className="relative h-full w-full flex items-center justify-center">
                  <div className={`absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-60 bg-gradient-to-r ${currentDisplaySlide.color}`} />
                  {currentDisplaySlide.icon && (() => {
                    const Icon = currentDisplaySlide.icon
                    return (
                      <Icon
                        size={600}
                        strokeWidth={0.5}
                        className="text-white/90 drop-shadow-2xl relative z-10"
                      />
                    )
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
