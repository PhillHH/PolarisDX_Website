/**
 * ShopTeaserSection — Hinweis auf die beiden Online-Shops.
 *
 * Owner-Entscheidung O1 (2026-10-16): Shop-Menuepunkt und Startseiten-Hinweis
 * aus `main@e66a562` bleiben im Relaunch (hebt DEC-RL-015 auf). Texte wie auf
 * `main`, Claim HCL-015 (HOMEPAGE-CONTRACT).
 *
 * SC-007 (Owner 2026-10-17): „Der Panelshop muss unbedingt von der Hauptseite
 * und auch von der Startseite aus erreichbar sein." Das Band fuehrt deshalb
 * zwei Ziele: den Praxis-Shop fuer Fachkreise (shop.polarisdx.net, Claim
 * HCL-015) und den Panel-Shop fuer Epigenetik-Panels (panels.polarisdx.net,
 * Claim HCL-016). Der Netto-Preis-Hinweis gilt nur dem Praxis-Shop; die
 * `note` benennt beide Shops getrennt.
 *
 * Bewusst ein schmales Band ohne Bild und Fliesstext: das Startseiten-HTML
 * hat wenige hundert Byte gzip Puffer (Budget wird nicht gelockert). Der
 * Hinweis soll nicht mit der Hauptaufforderung (Angebot anfordern)
 * konkurrieren — darum keine Primaer-Pille aus `Button`, sondern zwei ruhige
 * Pillen (Navy gefuellt, Navy umrandet) mit dem SC-006-Lift.
 *
 * Volle Seitenladung statt <Link>: die Ziele sind andere Domains; Klicks
 * zaehlt useOutboundTracking ueber OUTBOUND_DOMAINS.
 */
import { useTranslation } from 'react-i18next'
import { panelsUrl, shopUrl } from '../../lib/shop'
import Eyebrow from '../ui/Eyebrow'

const PILL =
  'group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2'

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
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <a
            href={shopUrl(i18n.language)}
            data-shop="practice"
            className={`${PILL} bg-brand-deep text-white hover:bg-brand-deep/90`}
          >
            {t('shop_teaser.cta')} <span className="transition group-hover:translate-x-1">→</span>
          </a>
          <a
            href={panelsUrl(i18n.language)}
            data-shop="panels"
            className={`${PILL} border border-paper-line text-brand-deep hover:border-brand-deep`}
          >
            {t('shop_teaser.cta_panels')}{' '}
            <span className="transition group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default ShopTeaserSection
