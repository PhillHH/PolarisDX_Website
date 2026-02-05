import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Sparkles, Infinity as InfinityIcon } from 'lucide-react'
import heroDoctor from '../assets/hero_doctor.webp'

export const useHeroSlider = () => {
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  return {
    currentSlide,
    setCurrentSlide,
    slides,
    t // Export t in case the view needs it for other things
  }
}
