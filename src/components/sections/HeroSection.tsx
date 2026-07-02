import { useHeroSlider } from '../../hooks/useHeroSlider'
import { Button } from '../ui/Button'
import { useState, useEffect, useRef } from 'react'
import { Pause, Play } from 'lucide-react'
import iglooLogoWhite from '../../assets/igloo_logo_white.webp'

/**
 * SSR-safe HeroSection — NO framer-motion, pure CSS animations.
 * SEO/LCP: h1 + description sind immer sichtbar (kein initiales opacity:0); nur Slide 0 = h1.
 * B2B-Umbau (Phase 3.1): 4 Slides (speed/economics/compliance/segments), Teal-Primaer-CTA
 * "Beratung buchen", Sekundaer-CTA "ROI-Rechner" (#roi-rechner), Proof-Chip-Reihe,
 * Pause-on-hover/focus + prefers-reduced-motion + Dot-ARIA (aria-current/-label) + Pause/Play.
 */
const HeroSection = () => {
  const { currentSlide, setCurrentSlide, slides, t, isPaused, setIsPaused } = useHeroSlider()

  const [isHydrated, setIsHydrated] = useState(false)
  const [displaySlide, setDisplaySlide] = useState(currentSlide)
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'exiting' | 'entering'>('idle')
  const isFirstRender = useRef(true)

  useEffect(() => {
    setIsHydrated(true)
    isFirstRender.current = false
  }, [])

  useEffect(() => {
    if (isFirstRender.current || currentSlide === displaySlide) return
    setAnimationPhase('exiting')
    const exitTimer = setTimeout(() => {
      setDisplaySlide(currentSlide)
      setAnimationPhase('entering')
      const enterTimer = setTimeout(() => setAnimationPhase('idle'), 600)
      return () => clearTimeout(enterTimer)
    }, 400)
    return () => clearTimeout(exitTimer)
  }, [currentSlide, displaySlide])

  const getContentAnimationClass = () => {
    if (!isHydrated || isFirstRender.current) return ''
    if (animationPhase === 'exiting') return 'animate-slide-out-up'
    if (animationPhase === 'entering') return 'animate-slide-in-up'
    return ''
  }

  const currentDisplaySlide = slides[displaySlide]

  return (
    <section
      id="hero"
      role="region"
      aria-roledescription="carousel"
      aria-label={t('hero.aria.carousel', 'IglooPro Highlights')}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className="relative overflow-hidden bg-brand-deep text-white min-h-[700px] lg:h-[800px]"
    >
      {/* Noise Overlay */}
      <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />

      {/* Dekorative Glow-Akzente (geringe Opazitaet, NICHT die Grundflaeche) */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute inset-y-0 left-0 w-[500px] bg-gradient-to-br from-brand-secondary/20 via-brand-primary/10 to-transparent blur-3xl" />
        <div className="absolute inset-y-0 right-0 w-[500px] bg-gradient-to-tl from-accent/20 via-brand-primary/10 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-container items-stretch px-6 pt-16 pb-24 sm:px-8 lg:px-0 lg:pt-16 lg:pb-0">
        <div className="grid w-full h-full gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-8 lg:space-y-6 z-20">
            <div className="space-y-3 lg:space-y-2 min-h-[280px] sm:min-h-[330px] flex flex-col justify-center">
              {/* Logo - LCP-Element - immer sichtbar */}
              <img
                src={iglooLogoWhite}
                alt="IglooPro — Point-of-Care Diagnostiksystem"
                width={200}
                height={56}
                fetchPriority="high"
                className="h-14 w-auto drop-shadow-sm mb-4 self-start"
              />
              {/* SEO: nur Slide 0 = H1, sonst H2 */}
              <div className={getContentAnimationClass()}>
                {displaySlide === 0 ? (
                  <h1 className="max-w-3xl font-medium tracking-[-0.02em] text-[clamp(30px,6vw,56px)] leading-[clamp(36px,6.6vw,64px)]">
                    {currentDisplaySlide.content.title}
                  </h1>
                ) : (
                  <h2 className="max-w-3xl font-medium tracking-[-0.02em] text-[clamp(30px,6vw,56px)] leading-[clamp(36px,6.6vw,64px)]">
                    {currentDisplaySlide.content.title}
                  </h2>
                )}
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                  {currentDisplaySlide.content.description}
                </p>
              </div>
            </div>

            {/* CTAs: Primaer (Teal) Beratung buchen + Sekundaer (Magnet) ROI-Rechner */}
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button
                to="/contact"
                variant="secondary"
                size="sm"
                className="w-full text-center sm:w-auto sm:whitespace-nowrap !bg-accent !text-white !shadow-accent/20 hover:!bg-accent-strong focus-visible:!ring-accent"
              >
                {t('hero.cta', 'Beratung buchen')}
              </Button>
              <Button
                href="#roi-rechner"
                variant="outline"
                size="sm"
                className="w-full text-center sm:w-auto sm:whitespace-nowrap"
              >
                {t('hero.cta_roi', 'ROI-Rechner starten')}
              </Button>
            </div>

            {/* Stat-Zeile */}
            <div>
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-2xl font-medium text-white">
                    {t('hero.stats.margin.value', '+18 %')}
                  </div>
                  <div className="text-xs text-white/70">
                    {t('hero.stats.margin.label', 'Marge pro Test')}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-medium text-white">
                    {t('hero.stats.time.value', '3 Min.')}
                  </div>
                  <div className="text-xs text-white/70">
                    {t('hero.stats.time.label', 'bis zum Ergebnis')}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-medium text-white">
                    {t('hero.stats.ready.value', 'IVDR/CE')}
                  </div>
                  <div className="text-xs text-white/70">
                    {t('hero.stats.ready.label', 'zertifiziert')}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-white/50">
                {t('hero.stats_disclaimer', '* Beispielwert – abhängig von Ihren Praxiswerten.')}
              </p>
            </div>

            {/* Slider-Steuerung: Dots + Pause/Play */}
            <div className="mt-2 flex items-center gap-4">
              <div className="flex space-x-3" role="group" aria-label={t('hero.aria.carousel', 'IglooPro Highlights')}>
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    aria-current={currentSlide === index ? 'true' : undefined}
                    aria-label={t('hero.aria.go_to_slide', { n: index + 1, defaultValue: 'Gehe zu Slide {{n}}' })}
                    className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                      currentSlide === index ? 'w-8 bg-accent' : 'w-2.5 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={
                  isPaused
                    ? t('hero.aria.play', 'Automatischen Wechsel fortsetzen')
                    : t('hero.aria.pause', 'Automatischen Wechsel pausieren')
                }
                className="rounded text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                {isPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Right Visual — statisches Gradient-Panel */}
          <div className="relative mx-auto hidden h-full w-full max-w-lg items-center justify-center lg:flex pointer-events-none">
            <div className="flex min-h-[360px] w-full items-center justify-center rounded-3xl bg-gradient-to-br from-accent to-emerald-600">
              <span className="text-white/70">{t('hero.visual_label', 'IglooPro-Visual')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
