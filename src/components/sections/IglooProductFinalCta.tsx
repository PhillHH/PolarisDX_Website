import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import IglooProFlyer from '../../assets/downloads/igloo-pro-flyer.pdf'

export default function IglooProductFinalCta() {
  const { t } = useTranslation('products')

  return (
    <section className="bg-brand-deep text-white">
      <div className="mx-auto max-w-container px-4 lg:px-0 py-24 lg:py-24 text-center">
        <h2 className="mx-auto max-w-3xl font-medium tracking-[-0.02em] text-[clamp(28px,5vw,48px)] leading-[clamp(34px,5.6vw,56px)]">
          {t('cta_bottom.title', 'Bereit, den IglooPro in Ihre Praxis zu holen?')}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80">
          {t('cta_bottom.description')}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            to="/contact"
            variant="secondary"
            size="sm"
            className="!bg-accent-strong !text-white hover:!brightness-110 focus-visible:!ring-accent"
          >
            {t('cta_bottom.button', 'Angebot anfragen')}
          </Button>
          <a
            href={IglooProFlyer}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-white/25 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
          >
            {t('cta_bottom.datasheet', 'Datenblatt (PDF)')}
          </a>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
            {t('cta_bottom.chips.free')}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
            {t('cta_bottom.chips.reply')}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
            {t('cta_bottom.chips.delivery')}
          </span>
        </div>
      </div>
    </section>
  )
}
