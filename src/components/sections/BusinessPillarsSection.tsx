import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Activity, ArrowRight, Dna, Microscope } from 'lucide-react'
import { services } from '../../data/services'
import { getCanonicalRouteEntries } from '../../routing'
import { Card } from '../ui/Card'
import Eyebrow from '../ui/Eyebrow'

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
}

const BusinessPillarsSection = () => {
  const { t } = useTranslation('home')

  const pillars: Pillar[] = [
    {
      id: 'diagnostics',
      icon: <Microscope aria-hidden="true" />,
      target: PILLAR_TARGETS.diagnostics,
    },
    { id: 'igloo', icon: <Activity aria-hidden="true" />, target: PILLAR_TARGETS.igloo },
    { id: 'epigenetics', icon: <Dna aria-hidden="true" />, target: PILLAR_TARGETS.epigenetics },
  ]

  return (
    <section
      aria-labelledby="homepage-pillars-title"
      data-home-business-pillars
      className="bg-white py-20 lg:py-24"
    >
      <div className="mx-auto max-w-container px-4 lg:px-0">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{t('business_pillars.eyebrow')}</Eyebrow>
          <h2 id="homepage-pillars-title" className="mt-3 t-h2">
            {t('business_pillars.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl t-body">{t('business_pillars.intro')}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillars.map(({ id, icon, target }) => (
            <Card
              key={id}
              to={target.path}
              data-business-pillar={id}
              data-route-id={target.routeId}
              className="min-h-[300px] border-t-4 border-t-accent p-7"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent [&>svg]:h-6 [&>svg]:w-6">
                {icon}
              </span>
              <h3 className="mt-6 text-2xl font-medium tracking-tight text-heading">
                {t(`business_pillars.pillars.${id}.title`)}
              </h3>
              <p className="mt-3 text-base leading-7 text-gray-700">
                {t(`business_pillars.pillars.${id}.text`)}
              </p>
              <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-accent-strong group-hover:text-brand-deep">
                {t(`business_pillars.pillars.${id}.cta`)}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Card>
          ))}
        </div>

        <div className="mt-16 border-t border-slate-200 pt-12" data-home-core-services>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end">
            <div>
              <Eyebrow>{t('business_pillars.core.eyebrow')}</Eyebrow>
              <h3 className="mt-3 text-2xl font-medium tracking-tight text-heading sm:text-3xl">
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
                className="min-h-[190px]"
              >
                <span className="text-accent [&>svg]:h-7 [&>svg]:w-7" aria-hidden="true">
                  {icon}
                </span>
                <h4 className="mt-4 text-lg font-medium text-heading">
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
