import { useTranslation } from 'react-i18next'
import { ShieldCheck, Award, Layers, Star, type LucideIcon } from 'lucide-react'

/**
 * TrustBar — schmale, helle FULL-WIDTH Credibility-Leiste direkt unter dem Hero.
 * SSR-sicher (kein window/localStorage). Eigenständiger Inhalt, NICHT identisch zu
 * den Hero-Chips: genau 4 Vertrauenspunkte (IVDR·CE, Premium-Partner Nobel Biocare,
 * 90 % LFA-Kompatibilität, ★ 4.9 · 250+ Bewertungen).
 */
const TrustBar = () => {
  const { t } = useTranslation('home')

  const items: { icon: LucideIcon; label: string }[] = [
    { icon: ShieldCheck, label: t('trustbar.ivdr', 'IVDR · CE') },
    { icon: Award, label: t('trustbar.partner', 'Premium-Partner: Nobel Biocare') },
    { icon: Layers, label: t('trustbar.compat', '90 % LFA-Kompatibilität') },
    { icon: Star, label: t('trustbar.reviews', '★ 4.9 · 250+ Bewertungen') },
  ]

  return (
    <section
      aria-label={t('trustbar.aria', 'Vertrauensmerkmale')}
      className="border-y border-slate-200 bg-slate-50"
    >
      <div className="mx-auto max-w-container px-4 lg:px-0 py-7">
        <ul className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          {items.map(({ icon: Icon, label }) => (
            <li key={label} className="inline-flex items-center gap-2">
              <Icon size={18} className="text-accent" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default TrustBar
