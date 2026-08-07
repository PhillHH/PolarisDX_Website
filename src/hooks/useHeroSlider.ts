import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Calculator, ShieldCheck, Stethoscope } from 'lucide-react'
import heroDoctor from '../assets/hero_doctor.webp'

/**
 * B2B-Hero (Phase 3.1): 4 Slides — speed (image) · economics · compliance · segments (icon).
 * Autoplay 6s, pausiert bei Hover/Focus (setIsHovered aus der View), per Pause-Knopf
 * und bei prefers-reduced-motion. `isPlaying` bildet den tatsaechlichen Zustand ab,
 * `reducedMotion` schaltet in der View die Slide-Keyframes ab.
 * Discriminated Union per `type` ('image' | 'icon').
 */
export const useHeroSlider = () => {
  const { t } = useTranslation('home')
  const [currentSlide, setCurrentSlide] = useState(0)
  // 'auto' = Voreinstellung, 'on'/'off' = ausdrückliche Entscheidung am Pause/Play-Knopf.
  const [autoplayIntent, setAutoplayIntent] = useState<'auto' | 'on' | 'off'>('auto')
  // Hover/Focus hält nur vorübergehend an und überschreibt die Entscheidung nicht.
  const [isHovered, setIsHovered] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const slides = [
    {
      id: 'speed',
      type: 'image',
      content: {
        title: t('hero.speed.title', 'Laborwerte in Minuten – der Patient bleibt im Stuhl.'),
        description: t(
          'hero.speed.description',
          'Der IglooPro liefert das Messergebnis chairside in wenigen Minuten – ohne Laborversand und ohne Warten auf einen Befund. So besprechen Sie Werte und nächsten Schritt im selben Termin.',
        ),
      },
      visual: heroDoctor,
    },
    {
      id: 'economics',
      type: 'icon',
      icon: Calculator,
      color: 'from-accent-line to-accent-strong',
      content: {
        title: t(
          'hero.economics.title',
          'Diagnostik, die sich rechnet – neuer Selbstzahler-Umsatz, ohne Laborabhängigkeit.',
        ),
        description: t(
          'hero.economics.description',
          'POC-Diagnostik erschließt neue Selbstzahler-Leistungen, statt Umsätze ans Labor abzugeben. Was das für Ihren Praxisumsatz bedeutet, rechnen Sie im ROI-Rechner aus.',
        ),
      },
    },
    {
      id: 'compliance',
      type: 'icon',
      icon: ShieldCheck,
      color: 'from-brand-secondary to-brand-primary',
      content: {
        title: t(
          'hero.compliance.title',
          'Geprüfte Laborpräzision: IVDR/CE und CV < 2 % – validiert ab Tag 1.',
        ),
        description: t(
          'hero.compliance.description',
          'Der IglooPro ist IVDR/CE-konform und erreicht CV < 2 % Präzision über den gesamten Messbereich. Wir nehmen das Gerät validiert in Betrieb, damit Sie ab dem ersten Patienten sicher messen.',
        ),
      },
    },
    {
      id: 'segments',
      type: 'icon',
      icon: Stethoscope,
      color: 'from-brand-primary to-brand-deep',
      content: {
        title: t('hero.segments.title', 'Eine Plattform für Dental, Beauty und Longevity.'),
        description: t(
          'hero.segments.description',
          'Vom Vitamin-D-Check am Behandlungsstuhl bis zum Longevity-Monitoring – der IglooPro deckt herstellerübergreifend die fachspezifischen Biomarker-Panels Ihrer Fachrichtung ab. Wählen Sie Ihren Bereich: Dental, Beauty oder Longevity.',
        ),
      },
    },
  ]

  // prefers-reduced-motion respektieren (nur Client)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])

  // Läuft der automatische Wechsel wirklich? Genau diesen Zustand zeigt der
  // Pause/Play-Knopf an - bei Bewegungsreduktion steht er von sich aus still.
  const isPlaying = autoplayIntent === 'on' || (autoplayIntent === 'auto' && !reducedMotion)

  // Autoplay - aus bei Bewegungsreduktion, bei Hover/Focus und nach Klick auf Pause
  useEffect(() => {
    if (!isPlaying || isHovered) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isPlaying, isHovered, slides.length])

  // Ein Klick ist eine ausdrückliche Nutzerentscheidung und darf den automatischen
  // Wechsel auch bei Bewegungsreduktion starten - die Slide-Animationen bleiben aus.
  const toggleAutoplay = () => setAutoplayIntent(isPlaying ? 'off' : 'on')

  return {
    currentSlide,
    setCurrentSlide,
    slides,
    t,
    isPlaying,
    toggleAutoplay,
    setIsHovered,
    reducedMotion,
  }
}
