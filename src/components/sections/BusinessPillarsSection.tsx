import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Activity, ArrowRight, Dna, Microscope } from 'lucide-react'
import { services } from '../../data/services'
import { getCanonicalRouteEntries } from '../../routing'
import type { ArticleImageAsset } from '../../assets/articleImages'
import { PILLAR_IMAGES } from '../../assets/home/homeImages'
import IglooExplodeImage from '../../assets/home/igloo-explode-240w.webp'
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
  return {
    sourceId,
    routeId,
    path: requireRegistryPath(routeId),
    icon: service.icon,
  }
})

type Pillar = {
  id: PillarId
  icon: ReactNode
  target: (typeof PILLAR_TARGETS)[PillarId]
  /** Relaunch (SC-001): Foto der Karte — fehlt beim Produkt, dort steht der Reader selbst. */
  photo?: ArticleImageAsset
}

const PILLAR_PHOTO_SIZES = '(min-width:1024px) 384px,(min-width:768px) 30vw,calc(100vw - 2rem)'

const BusinessPillarsSection = () => {
  const { t } = useTranslation('home')

  const pillars: Pillar[] = [
    {
      id: 'diagnostics',
      icon: <Microscope aria-hidden="true" />,
      target: PILLAR_TARGETS.diagnostics,
      photo: PILLAR_IMAGES.diagnostics,
    },
    { id: 'igloo', icon: <Activity aria-hidden="true" />, target: PILLAR_TARGETS.igloo },
    {
      id: 'epigenetics',
      icon: <Dna aria-hidden="true" />,
      target: PILLAR_TARGETS.epigenetics,
      photo: PILLAR_IMAGES.epigenetics,
    },
  ]

  return (
    <section
      aria-labelledby="homepage-pillars-title"
      data-home-business-pillars
      className="bg-paper py-20 lg:py-24"
    >
      <div className="mx-auto max-w-container px-4 lg:px-0">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-12">
          <div>
            <Eyebrow>{t('business_pillars.eyebrow')}</Eyebrow>
            <h2
              id="homepage-pillars-title"
              className="mt-3 text-balance text-[clamp(2rem,4vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-heading"
            >
              {t('business_pillars.title')}
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-gray-700">
            {t('business_pillars.intro')}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillars.map(({ id, icon, target, photo }) => (
            <Card
              key={id}
              to={target.path}
              padding="none"
              data-business-pillar={id}
              data-route-id={target.routeId}
              className="overflow-hidden shadow-card"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-paper-deep">
                {photo ? (
                  <ResponsivePicture
                    image={photo}
                    alt=""
                    lean
                    sizes={PILLAR_PHOTO_SIZES}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                ) : (
                  <img
                    src={IglooExplodeImage}
                    alt=""
                    width={240}
                    height={280}
                    loading="lazy"
                    className="h-full w-full object-contain p-6"
                  />
                )}
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-heading">
                  <span className="text-accent-strong [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
                  {t(`business_pillars.pillars.${id}.title`)}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="text-2xl font-semibold tracking-tight text-heading">
                  {t(`business_pillars.pillars.${id}.title`)}
                </h3>
                <p className="mt-3 text-base leading-7 text-gray-700">
                  {t(`business_pillars.pillars.${id}.text`)}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-accent-strong group-hover:text-brand-deep">
                  {t(`business_pillars.pillars.${id}.cta`)}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 border-t border-paper-line pt-12" data-home-core-services>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end">
            <div>
              <Eyebrow>{t('business_pillars.core.eyebrow')}</Eyebrow>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-heading sm:text-3xl">
                {t('business_pillars.core.title')}
              </h3>
            </div>
            <p className="max-w-2xl text-base leading-7 text-gray-700">
              {t('business_pillars.core.intro')}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {CORE_SERVICES.map(({ sourceId, routeId, path, icon }) => (
              <Card
                key={sourceId}
                to={path}
                padding="sm"
                data-core-service={sourceId}
                data-route-id={routeId}
                className="min-h-[190px] p-5"
              >
                <span className="icon-tile h-11 w-11 [&>svg]:h-5 [&>svg]:w-5" aria-hidden="true">
                  {icon}
                </span>
                <h4 className="mt-4 text-lg font-semibold text-heading">
                  {t(`segments.${sourceId}.title`)}
                </h4>
                <p className="mt-2 text-sm text-gray-600">{t(`segments.${sourceId}.bio`)}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-accent-strong group-hover:text-brand-deep">
                  {t(`segments.${sourceId}.cta`)}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BusinessPillarsSection
