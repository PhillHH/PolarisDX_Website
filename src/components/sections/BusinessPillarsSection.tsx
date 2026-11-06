import { useTranslation } from 'react-i18next'
import { ChevronRight, HeartPulse, Sparkles, Stethoscope, type LucideIcon } from 'lucide-react'
import { services } from '../../data/services'
import { getCanonicalRouteEntries } from '../../routing'
import { PILLAR_PRAXIS, PILLAR_READER, PILLAR_SAMPLE } from '../../assets/home/homeImages'
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

/** Die beiden Foto-Kacheln: Praxisfoto (Diagnostik) und Probenentnahme (Epigenetik). */
const CORE_SERVICE_IDS = [
  'dental',
  'beauty',
  'longevity',
] as const satisfies readonly CoreServiceId[]
const CORE_ICONS: Record<CoreServiceId, LucideIcon> = {
  dental: Stethoscope,
  beauty: Sparkles,
  longevity: HeartPulse,
}

const CORE_SERVICES = CORE_SERVICE_IDS.map((sourceId) => {
  const service = services.find(({ id }) => id === sourceId)
  if (!service) throw new Error(`Homepage core service is missing from services.tsx: ${sourceId}`)

  const routeId = `service-detail:${sourceId}`
  return { sourceId, routeId, path: requireRegistryPath(routeId), icon: CORE_ICONS[sourceId] }
})

const PHOTO_PILLARS = [
  { id: 'diagnostics', image: PILLAR_PRAXIS, position: 'object-right' },
  { id: 'epigenetics', image: PILLAR_SAMPLE, position: 'object-left' },
] as const satisfies readonly { id: PillarId; image: unknown; position: string }[]

/**
 * Three business pillars and three selected service entry points (PT11.3). Die Fachbereiche stehen
 * seit SC-021 Nachtrag 11 (Owner 2026-11-06, Entwurf F4) als ruhiges Papier-Band ohne Foto.
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

        {/* Fachbereichs-Einstiege (PT11.3 §4.2) — SC-021 Nachtrag 11 (Owner 2026-11-06, Entwurf F4,
            dann „moderner“): Kopfzeile wie die Sektionen, darunter drei weiße Karten mit Icon-Kachel,
            Titel, Parameter-Chips und Linkzeile — jede Karte ein Link. */}
        <div data-home-core-services className="mt-20 lg:mt-24">
          <div className="rv grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-12">
            <div>
              <Eyebrow>{t('business_pillars.core.eyebrow')}</Eyebrow>
              <h3 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-heading lg:text-4xl">
                {t('business_pillars.core.title')}
              </h3>
            </div>
            <p className="hidden max-w-xl text-base leading-7 text-gray-700 md:block">
              {t('business_pillars.core.intro')}
            </p>
          </div>

          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {CORE_SERVICES.map(({ sourceId, routeId, path, icon: Icon }) => (
              <li key={sourceId} className="rv">
                <Card
                  to={path}
                  data-core-service={sourceId}
                  data-route-id={routeId}
                  className="group flex h-full flex-col p-7 shadow-card hover:border-accent-border"
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h4 className="mt-6 text-2xl font-semibold tracking-tight text-heading">
                    {t(`segments.${sourceId}.title`)}
                  </h4>
                  <span className="mt-4 flex flex-wrap gap-2">
                    {t(`segments.${sourceId}.bio`)
                      .split('·')
                      .map((token) => token.trim())
                      .filter(Boolean)
                      .map((label) => (
                        <span
                          key={label}
                          className="rounded-full bg-paper px-3 py-1 text-sm font-semibold text-heading"
                        >
                          {label}
                        </span>
                      ))}
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-7 text-sm font-semibold text-accent-strong group-hover:text-brand-deep">
                    {t(`segments.${sourceId}.cta`)}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default BusinessPillarsSection
