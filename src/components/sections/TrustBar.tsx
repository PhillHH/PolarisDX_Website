import { useTranslation } from 'react-i18next'
import { Microscope, ShieldCheck, Layers, Timer, type LucideIcon } from 'lucide-react'

/**
 * TrustBar — four sourced product signals, not a decorative badge/logo wall.
 *
 * The partner and percentage claims previously shown here were broader than the
 * Homepage evidence supports. Every visible item now maps to the PT11.2 claim
 * register and to existing product/legal content.
 */
const TrustBar = () => {
  const { t } = useTranslation('home')

  const items: { claimId: string; icon: LucideIcon; label: string }[] = [
    { claimId: 'HCL-002', icon: Microscope, label: t('trustbar.cv') },
    { claimId: 'HCL-003', icon: ShieldCheck, label: t('trustbar.ivdr') },
    { claimId: 'HCL-004', icon: Timer, label: t('trustbar.minutes') },
    { claimId: 'HCL-005', icon: Layers, label: t('trustbar.compat') },
  ]

  return (
    <section
      aria-label={t('trustbar.aria', 'Vertrauensmerkmale')}
      data-home-trustbar
      className="border-y border-slate-200 bg-slate-50"
    >
      <div className="mx-auto max-w-container px-4 lg:px-0 py-7">
        <ul className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
          {items.map(({ claimId, icon: Icon, label }) => (
            <li key={claimId} data-claim-id={claimId} className="inline-flex items-center gap-2">
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
