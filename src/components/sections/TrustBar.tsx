import { useTranslation } from 'react-i18next'
import { ShieldCheck, Activity, Clock, Layers, Truck, type LucideIcon } from 'lucide-react'

/**
 * TrustBar — schmale, helle FULL-WIDTH Vertrauens-Leiste direkt unter dem Hero.
 * SSR-sicher (kein window/localStorage). Nur belegbare Trust-Items (HWG/Wahrheit):
 * IVDR/CE-konform, CV < 2 % Laborpräzision, Ergebnis in Minuten,
 * Herstellerübergreifend kompatibel, Einsatzbereit in 3–5 Werktagen.
 */
const TrustBar = () => {
  const { t } = useTranslation('home')

  const items: { icon: LucideIcon; label: string }[] = [
    { icon: ShieldCheck, label: t('trustbar.ivdr', 'IVDR/CE-konform') },
    { icon: Activity, label: t('trustbar.cv', 'CV < 2 % Laborpräzision') },
    { icon: Clock, label: t('trustbar.minutes', 'Ergebnis in Minuten') },
    { icon: Layers, label: t('trustbar.compat', 'Herstellerübergreifend kompatibel') },
    { icon: Truck, label: t('trustbar.delivery', 'Einsatzbereit in 3–5 Werktagen') },
  ]

  return (
    <section
      aria-label={t('trustbar.aria', 'Vertrauensmerkmale')}
      className="border-y border-slate-200 bg-slate-50"
    >
      <div className="mx-auto max-w-container px-4 lg:px-0 py-6">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {items.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-2">
              <Icon size={18} className="text-accent" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-600">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default TrustBar
