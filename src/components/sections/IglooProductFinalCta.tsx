import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'

export default function IglooProductFinalCta() {
  const { t } = useTranslation('products')

  return (
    <section
      aria-labelledby="igloo-final-cta-title"
      data-igloo-final-cta
      className="bg-brand-deep text-white"
    >
      <div className="mx-auto max-w-container px-4 lg:px-0 py-24 lg:py-24 text-center">
        <h2
          id="igloo-final-cta-title"
          className="mx-auto max-w-3xl font-medium tracking-[-0.02em] text-[clamp(28px,5vw,48px)] leading-[clamp(34px,5.6vw,56px)]"
        >
          {t('cta_bottom.title', 'Bereit, den IglooPro in Ihre Praxis zu holen?')}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl t-body-on-dark">{t('cta_bottom.description')}</p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            to="/contact"
            variant="secondary"
            size="sm"
            data-cta-intent="GENERAL_SALES"
            className="!bg-accent-strong !text-white hover:!brightness-110 focus-visible:!ring-accent"
          >
            {t('cta_bottom.button', 'Angebot anfragen')}
          </Button>
          <Button
            to="/#roi-rechner"
            variant="outline"
            size="sm"
            className="focus-visible:!ring-white"
          >
            {t('cta_bottom.resources')}
          </Button>
        </div>
      </div>
    </section>
  )
}
