/**
 * ShopTeaserSection — Hinweis auf den Online-Shop (shop.polarisdx.net).
 *
 * Owner-Entscheidung O1 (2026-10-16): Shop-Menuepunkt und Startseiten-Hinweis
 * aus `main@e66a562` bleiben im Relaunch (hebt DEC-RL-015 auf). Texte wie auf
 * `main`, Claim HCL-015 (HOMEPAGE-CONTRACT).
 *
 * Bewusst ein schmales Band ohne Bild, Fliesstext und zweiten Knopf: das
 * Startseiten-HTML hat rund 200 Byte gzip Puffer (Budget wird nicht
 * gelockert), die volle main-Fassung kostet etwa 440. Der Hinweis soll nicht
 * mit der Hauptaufforderung (Angebot anfordern) konkurrieren.
 *
 * Volle Seitenladung statt <Link>: das Ziel ist eine andere Domain; Klicks
 * zaehlt useOutboundTracking ueber OUTBOUND_DOMAINS.
 */
import { useTranslation } from 'react-i18next'
import { shopUrl } from '../../lib/shop'
import Eyebrow from '../ui/Eyebrow'

const ShopTeaserSection = () => {
  const { t, i18n } = useTranslation('home')

  return (
    <section aria-labelledby="shop-teaser-title" className="bg-paper px-4 pb-20 lg:px-0 lg:pb-24">
      <div className="rv mx-auto flex max-w-container flex-col gap-6 rounded-card border border-accent-border bg-white px-6 py-7 shadow-card lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <Eyebrow className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent-line" />
            {t('shop_teaser.badge')} · {t('shop_teaser.eyebrow')}
          </Eyebrow>
          <h2 id="shop-teaser-title" className="mt-3 text-2xl font-semibold tracking-tight">
            {t('shop_teaser.title')}
          </h2>
          <p className="mt-3 text-sm text-gray-600">{t('shop_teaser.note')}</p>
        </div>
        <a
          href={shopUrl(i18n.language)}
          className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-deep px-6 py-3 font-semibold text-white hover:bg-brand-deep/90"
        >
          {t('shop_teaser.cta')} <span className="transition group-hover:translate-x-1">→</span>
        </a>
      </div>
    </section>
  )
}

export default ShopTeaserSection
