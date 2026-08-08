import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { Breadcrumbs } from '../ui/Breadcrumbs'
import IglooProFlyer from '../../assets/downloads/igloo-pro-flyer.pdf'
import IglooProImage from '../../assets/Igloo-pro-frontal.webp'

export default function IglooProHero() {
  const { t } = useTranslation(['products', 'common'])

  const titleParts = t('products:hero.title').split('\n')

  return (
    <section className="relative overflow-hidden bg-brand-deep text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-noise opacity-10"
      />

      <div className="relative mx-auto max-w-container px-4 lg:px-0 pt-24 pb-16 lg:pt-28 grid lg:grid-cols-2 gap-8 items-center">
        {/* LEFT */}
        <div>
          <Breadcrumbs
            variant="dark"
            className="mb-4"
            items={[{ label: t('common:nav.home', 'Home'), href: '/' }, { label: 'IglooPro' }]}
          />

          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
            {t('products:hero.caption')}
          </span>

          <h1 className="mt-5 text-4xl lg:text-5xl font-medium tracking-tight leading-[1.05]">
            {titleParts.map((part, index) => (
              <span key={index}>
                {index > 0 && <br />}
                {part}
              </span>
            ))}
          </h1>

          <p className="mt-4 max-w-xl text-white/80 leading-relaxed">
            {t('products:hero.description')}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              to="/contact"
              variant="secondary"
              size="sm"
              className="!bg-accent-strong !text-white hover:!brightness-110 focus-visible:!ring-accent"
            >
              {t('products:hero.cta_order')}
            </Button>
            <a
              href={IglooProFlyer}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-white/25 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
            >
              {t('products:hero.cta_datasheet')}
            </a>
          </div>

          <p className="mt-4 text-xs text-white/60">{t('products:hero.subline')}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
              {t('products:hero.chip_ivdr')}
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
              {t('products:hero.chip_lis')}
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
              {t('products:hero.chip_cross')}
            </span>
          </div>
        </div>

        {/* RIGHT — Produktfoto des Geräts, umrahmt von den Kennzahlen-Karten.
            Vorher stand hier ein Ring-Diagramm mit der Zahl "36°", für die sich
            weder im Datenblatt noch in den technischen Daten eine Bedeutung
            belegen ließ — ersetzt statt beschriftet. */}
        <div className="relative hidden min-h-[300px] items-center justify-center rounded-2xl bg-white/5 p-7 ring-1 ring-white/10 lg:flex">
          <img
            src={IglooProImage}
            alt={t('products:hero.visual.device_alt', 'IglooPro POC-Reader')}
            width={650}
            height={650}
            decoding="async"
            className="h-auto w-full max-w-[240px] object-contain xl:max-w-[320px]"
          />

          {/* Floating cards — dekorative Wiederholung der technischen Daten */}
          <div
            aria-hidden="true"
            className="absolute left-4 top-6 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-brand-deep"
          >
            <Check size={14} className="text-accent" />
            <span>
              <span className="block text-sm font-semibold">
                {t('products:hero.visual.portable_val')}
              </span>
              <span className="block text-xs text-gray-700">
                {t('products:hero.visual.portable_label')}
              </span>
            </span>
          </div>

          <div
            aria-hidden="true"
            className="absolute right-5 top-1/2 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-brand-deep"
          >
            <Check size={14} className="text-accent" />
            <span>
              <span className="block text-sm font-semibold">
                {t('products:hero.visual.cv_val')}
              </span>
              <span className="block text-xs text-gray-700">
                {t('products:hero.visual.cv_label')}
              </span>
            </span>
          </div>

          <div
            aria-hidden="true"
            className="absolute bottom-8 left-10 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-brand-deep"
          >
            <Check size={14} className="text-accent" />
            <span>
              <span className="block text-sm font-semibold">
                {t('products:hero.visual.time_val')}
              </span>
              <span className="block text-xs text-gray-700">
                {t('products:hero.visual.time_label')}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
