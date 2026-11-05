import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { services } from '../../data/services'
import { getCanonicalRouteEntries } from '../../routing'
import {
  DETAIL_IMAGE,
  PILLAR_PRAXIS,
  PILLAR_READER,
  PILLAR_SAMPLE,
} from '../../assets/home/homeImages'
import { Card } from '../ui/Card'
import Eyebrow from '../ui/Eyebrow'
import { ResponsivePicture } from '../ui/ResponsivePicture'

type PillarId = 'diagnostics' | 'igloo' | 'epigenetics'
type CoreServiceId = 'dental' | 'beauty' | 'longevity'

const registryEntries = getCanonicalRouteEntries()

function requireRegistryPath(routeId: string): string {
  const route = registryEntries.find((entry) => entry.id === routeId)
  if (!route) throw new Error(`Homepage target is missing from the Route Registry: ${routeId}`)
  return route.path
}

const PILLAR_TARGETS: Record<PillarId, { routeId: string; path: string }> = {
  diagnostics: { routeId: 'diagnostics', path: requireRegistryPath('diagnostics') },
  igloo: { routeId: 'igloo-pro', path: requireRegistryPath('igloo-pro') },
  epigenetics: { routeId: 'epigenetics', path: requireRegistryPath('epigenetics') },
}

const CORE_SERVICE_IDS = [
  'dental',
  'beauty',
  'longevity',
] as const satisfies readonly CoreServiceId[]

const CORE_SERVICES = CORE_SERVICE_IDS.map((sourceId) => {
  const service = services.find(({ id }) => id === sourceId)
  if (!service) throw new Error(`Homepage core service is missing from services.tsx: ${sourceId}`)

  const routeId = `service-detail:${sourceId}`
  return { sourceId, routeId, path: requireRegistryPath(routeId) }
})

const DETAIL_SIZES = '(min-width:1024px) 520px,calc(100vw - 2rem)'

/** Die beiden Foto-Kacheln: Praxisfoto (Diagnostik) und Probenentnahme (Epigenetik). */
const PHOTO_PILLARS = [
  { id: 'diagnostics', image: PILLAR_PRAXIS, position: 'object-right' },
  { id: 'epigenetics', image: PILLAR_SAMPLE, position: 'object-left' },
] as const satisfies readonly { id: PillarId; image: unknown; position: string }[]

/**
 * Three business pillars and three selected service entry points (PT11.3).
 *
 * SC-021 Nachtrag 8 (Owner 2026-11-05, Entwurf A2-3 nach Vorbild Apple/Stripe, „den hier mit
 * besseren Visuals“): statt drei gleich großer Karten eine breite IglooPro-Hauptkachel (Text links,
 * Geräte-Render mit Display und Testkassette rechts, Spiegelung in die Fläche ausgeblendet) und
 * darunter zwei volle Foto-Kacheln mit Text im Bild — Praxisfoto für Diagnostik, Probenentnahme für
 * Epigenetik. Jede Kachel bleibt EIN semantischer Link mit `data-business-pillar`/`data-route-id`,
 * H3 = Säulentitel (als Eyebrow gesetzt), große Zeile = `headline`, dann Text und Linktext — alle
 * Strings aus `business_pillars.pillars.*`; die Headlines sind Formulierungen bestehender Claims
 * (HOMEPAGE-CONTRACT §9), keine neuen Aussagen. Snap-Reihe (`rail-x`), Lichtpunkt (`useSpotlight`),
 * Parameter-Tafel und Explosionsbild aus SC-005/SC-006 entfallen. Bilder lazy, unter dem Falz.
 */
const BusinessPillarsSection = () => {
  const { t } = useTranslation('home')

  return (
    <section
      aria-labelledby="homepage-pillars-title"
      data-home-business-pillars
      className="bg-white py-16 lg:py-24"
    >
      <div className="mx-auto max-w-container px-4 lg:px-0">
        <div className="rv grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-12">
          <div>
            <Eyebrow>{t('business_pillars.eyebrow')}</Eyebrow>
            <h2 id="homepage-pillars-title" className="mt-3 t-display">
              {t('business_pillars.title')}
            </h2>
          </div>
          <p className="hidden max-w-xl text-lg leading-relaxed text-gray-700 md:block">
            {t('business_pillars.intro')}
          </p>
        </div>

        <div className="mt-12 grid gap-5">
          {/* Hauptkachel IglooPro: helle Fläche, Text links, Render rechts. */}
          <Card
            to={PILLAR_TARGETS.igloo.path}
            padding="none"
            data-business-pillar="igloo"
            data-route-id={PILLAR_TARGETS.igloo.routeId}
            className="group rv grid overflow-hidden border-transparent bg-paper lg:grid-cols-2"
          >
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <h3 className="t-eyebrow">{t('business_pillars.pillars.igloo.title')}</h3>
              <p className="mt-3 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-heading lg:text-4xl">
                {t('business_pillars.pillars.igloo.headline')}
              </p>
              <p className="mt-4 max-w-md text-base leading-7 text-gray-700">
                {t('business_pillars.pillars.igloo.text')}
              </p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent-strong group-hover:text-brand-deep">
                {t('business_pillars.pillars.igloo.cta')}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto">
              <picture>
                <source type="image/avif" srcSet={PILLAR_READER.avif} sizes={PILLAR_READER.sizes} />
                <img
                  src={PILLAR_READER.src}
                  srcSet={PILLAR_READER.webp}
                  sizes={PILLAR_READER.sizes}
                  alt=""
                  width={PILLAR_READER.width}
                  height={PILLAR_READER.height}
                  loading="lazy"
                  className="h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none"
                />
              </picture>
              {/* Die eingebackene Spiegelung des Renders läuft in die Fläche aus. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent via-paper/85 to-paper"
              />
            </div>
          </Card>

          {/* Foto-Kacheln: Diagnostik und Epigenetik, Text im Bild auf Navy-Verlauf. */}
          <div className="grid gap-5 md:grid-cols-2">
            {PHOTO_PILLARS.map(({ id, image, position }) => (
              <Card
                key={id}
                to={PILLAR_TARGETS[id].path}
                padding="none"
                data-business-pillar={id}
                data-route-id={PILLAR_TARGETS[id].routeId}
                className="group rv relative aspect-[4/5] overflow-hidden border-transparent bg-brand-deep text-white md:aspect-[16/10]"
              >
                <picture>
                  <source type="image/avif" srcSet={image.avif} sizes={image.sizes} />
                  <img
                    src={image.src}
                    srcSet={image.webp}
                    sizes={image.sizes}
                    alt=""
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover ${position} transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none`}
                  />
                </picture>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-deep via-brand-deep/55 to-transparent p-7 pt-24 sm:p-8 sm:pt-24">
                  <h3 className="t-eyebrow-dark">{t(`business_pillars.pillars.${id}.title`)}</h3>
                  <p className="mt-2 text-balance text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                    {t(`business_pillars.pillars.${id}.headline`)}
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                    {t(`business_pillars.pillars.${id}.text`)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white">
                    {t(`business_pillars.pillars.${id}.cta`)}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Fachbereiche: Text zuerst, dann die Liste, das Foto zuletzt (mobil) —
            ab lg steht das Foto links neben Kopf und Liste. */}
        <div
          className="mt-16 grid gap-8 border-t border-paper-line pt-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-x-14 lg:gap-y-8"
          data-home-core-services
        >
          <div>
            <Eyebrow>{t('business_pillars.core.eyebrow')}</Eyebrow>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              {t('business_pillars.core.title')}
            </h3>
            <p className="mt-4 hidden max-w-xl text-base leading-7 text-gray-700 md:block">
              {t('business_pillars.core.intro')}
            </p>
          </div>

          <ol className="rv divide-y divide-paper-line border-y border-paper-line">
            {CORE_SERVICES.map(({ sourceId, routeId, path }, index) => (
              <li key={sourceId}>
                <Link
                  to={path}
                  data-core-service={sourceId}
                  data-route-id={routeId}
                  className="group flex items-center gap-5 py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 sm:gap-7"
                >
                  <span className="text-sm font-semibold tabular-nums text-accent-strong">
                    0{index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <h4 className="text-xl font-semibold tracking-tight group-hover:text-brand-deep">
                      {t(`segments.${sourceId}.title`)}
                    </h4>
                    <span className="mt-1 block text-sm text-gray-600">
                      {t(`segments.${sourceId}.bio`)}
                    </span>
                  </span>
                  <span className="icon-tile transition-colors group-hover:bg-accent group-hover:text-white">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          {/* SC-021 Nachtrag 9: das Detailfoto nur ab lg — mobil kostete es 400 px Scrollweg ohne Inhalt. */}
          <figure className="rv hidden overflow-hidden rounded-card bg-paper-deep lg:order-first lg:row-span-2 lg:block">
            <ResponsivePicture
              image={DETAIL_IMAGE}
              alt=""
              lean
              sizes={DETAIL_SIZES}
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </figure>
        </div>
      </div>
    </section>
  )
}

export default BusinessPillarsSection
