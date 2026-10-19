/**
 * PanelsPromoSection — zeitlich begrenzte Hervorhebung des Panel-Shops.
 *
 * SC-009 (Owner 2026-10-19): „Teasere den Panelshop zeitlich limitiert auf der
 * Startseite prominent." Navy-Flaeche direkt unter der Bühne, eine Aktion,
 * kein Bild (Startseiten-HTML und Bildbudget werden nicht gelockert). Bewusst
 * kein Slider in der Bühne: Autoplay und Karussell schliesst der
 * HOMEPAGE-CONTRACT aus, und die Bühne bleibt das LCP-Element.
 *
 * Waehrend der Aktion ersetzt die Flaeche das Shop-Band (HomePage): der
 * Praxis-Shop (HCL-015) steht hier als zweite Aktion, damit die Startseite
 * keinen Shop verliert und das htmlBytes-Budget nicht gelockert wird (gemessen).
 * Ab dem Tag nach PANELS_PROMO_LAST_DAY rendert die Sektion nichts und das
 * Shop-Band kehrt zurueck (SC-007). Claims HCL-016 und HCL-015.
 */
import { useTranslation } from 'react-i18next'
import { ArrowUpRight } from 'lucide-react'
import { isPanelsPromoActive, panelsUrl, shopUrl } from '../../lib/shop'

const PanelsPromoSection = () => {
  const { t, i18n } = useTranslation('home')

  if (!isPanelsPromoActive()) return null

  return (
    <section
      aria-labelledby="panels-promo-title"
      data-home-panels-promo
      className="bg-paper px-4 pb-16 pt-12 lg:px-0 lg:pb-20 lg:pt-16"
    >
      <div className="brand-ring rv mx-auto flex max-w-container flex-col gap-8 rounded-band bg-brand-deep px-6 py-10 text-white sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14">
        <div>
          <p className="t-eyebrow-dark">{t('shop_teaser.promo_eyebrow')}</p>
          <h2
            id="panels-promo-title"
            className="mt-3 text-balance text-[clamp(26px,3.6vw,40px)] font-semibold leading-[1.1] tracking-[-0.03em]"
          >
            {t('shop_teaser.promo_title')}
          </h2>
          <p className="mt-3 max-w-2xl text-white/80 sm:text-lg">{t('shop_teaser.promo_text')}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <a
            href={panelsUrl(i18n.language)}
            data-shop="panels"
            data-claim-id="HCL-016"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-brand-deep transition hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
          >
            {t('shop_teaser.cta_panels')}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={shopUrl(i18n.language)}
            data-shop="practice"
            data-claim-id="HCL-015"
            className="inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3.5 font-semibold ring-1 ring-inset ring-white/25 transition hover:bg-white/10"
          >
            {t('shop_teaser.cta')}
          </a>
        </div>
      </div>
    </section>
  )
}

export default PanelsPromoSection
