import { useTranslation } from 'react-i18next'
import { Microscope, ShieldCheck, Layers, Timer, type LucideIcon } from 'lucide-react'

/**
 * TrustBar — four sourced product signals, not a decorative badge/logo wall.
 *
 * The partner and percentage claims previously shown here were broader than the
 * Homepage evidence supports. Every visible item now maps to the PT11.2 claim
 * register and to existing product/legal content.
 *
 * Relaunch 2026-10-15 (SC-001): rendered as a white signal strip on the paper
 * surface. The four labels are unchanged locale strings (claim lock); only the
 * icon tile and the typography are new.
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
      className="bg-paper"
    >
      <div className="mx-auto max-w-container px-4 pb-6 pt-2 lg:px-0">
        <ul className="grid grid-cols-1 overflow-hidden rounded-card border border-paper-line bg-white shadow-card sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ claimId, icon: Icon, label }) => (
            <li
              key={claimId}
              data-claim-id={claimId}
              className="home-signal sm:[&:nth-child(odd)]:border-r"
            >
              <span className="icon-tile">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold leading-snug text-heading sm:text-[15px]">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default TrustBar
