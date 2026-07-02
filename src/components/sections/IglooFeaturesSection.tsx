import { useTranslation } from 'react-i18next'
import { Layers, Battery, Wifi, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import Eyebrow from '../ui/Eyebrow'

/**
 * IglooFeaturesSection — "Warum der IglooPro": zentrierter Kopf plus
 * 4er-Feature-Grid (Methodenbreite, Akku, Konnektivität, Präzision).
 * i18n-Namespace 'products', Keys unter intro.* und features.<k>.*.
 * SSR-sicher (kein window/IntersectionObserver/Date im Render).
 */
type FeatureCard = {
  icon: ReactNode
  k: string
}

const IglooFeaturesSection = () => {
  const { t } = useTranslation('products')

  const cards: FeatureCard[] = [
    { icon: <Layers />, k: 'methods' },
    { icon: <Battery />, k: 'battery' },
    { icon: <Wifi />, k: 'connectivity' },
    { icon: <ShieldCheck />, k: 'precision' },
  ]

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-container px-4 lg:px-0 py-24 lg:py-28">
        {/* Zentrierter Kopf */}
        <div className="mb-14 text-center">
          <Eyebrow>{t('intro.eyebrow', 'WARUM DER IGLOOPRO')}</Eyebrow>
          <h2 className="mt-3 text-3xl lg:text-[42px] font-medium tracking-tight text-heading">
            {t('intro.title', 'Laborqualität im Handformat')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-700">
            {t('intro.subtitle')}
          </p>
        </div>

        {/* Feature-Grid */}
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon, k }) => (
            <div
              key={k}
              className="rounded-xl border border-slate-200 bg-white p-7 flex flex-col"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <span className="h-5 w-5 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
              </span>
              <h3 className="mt-5 text-lg font-medium text-heading">
                {t('features.' + k + '.title')}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                {t('features.' + k + '.description')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default IglooFeaturesSection
