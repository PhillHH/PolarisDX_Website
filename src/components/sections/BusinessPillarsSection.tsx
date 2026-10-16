import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Activity, ArrowRight, Dna, Microscope } from 'lucide-react'
import { services } from '../../data/services'
import { getCanonicalRouteEntries } from '../../routing'
import { useSpotlight } from '../../lib/spotlight'
import { DETAIL_IMAGE } from '../../assets/home/homeImages'
import IglooExplodeImage from '../../assets/home/igloo-explode-240w.webp'
import ReportPreview400 from '../../assets/home/report-preview-400w.webp'
import ReportPreview800 from '../../assets/home/report-preview-800w.webp'
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

const PILLAR_IDS: readonly PillarId[] = ['diagnostics', 'igloo', 'epigenetics']
const PILLAR_ICONS: Record<PillarId, ReactNode> = {
  diagnostics: <Microscope aria-hidden="true" />,
  igloo: <Activity aria-hidden="true" />,
  epigenetics: <Dna aria-hidden="true" />,
}

const DETAIL_SIZES = '(min-width:1024px) 520px,calc(100vw - 2rem)'
const CARD_SIZES = '(min-width:1024px) 384px,(min-width:768px) 30vw,calc(100vw - 2rem)'

/**
 * Three business pillars and three selected service entry points (PT11.3).
 *
 * SC-005 (2026-10-16, owner: „Agentur-Niveau, lockerer Mix"): each pillar card
 * carries a DIFFERENT kind of visual instead of three look-alike photos —
 * Diagnostics a parameter board built from the existing, localized biomarker
 * lines of the three selected services, IglooPro the exploded product render,
 * Epigenetics a real sample report. The service entry points are a numbered
 * reading list beside ONE detail photograph (4:5). Targets, data attributes,
 * headings and copy keys are unchanged; the route logic is the Registry's.
 *
 * SC-006 „Editorial Motion": the cards answer the pointer (spot light, lift,
 * accent border, the report rising, the render floating) and enter on scroll
 * (`rv`); below `md` the three cards become ONE snap rail (`rail-x`) instead of
 * a 1 400 px stack. Everything is CSS; the only script is the shared
 * `useSpotlight` listener on the grid. Nothing changes without hover, without
 * JavaScript or with reduced motion.
 */
const BusinessPillarsSection = () => {
  const { t } = useTranslation('home')
  const spot = useSpotlight<HTMLDivElement>()

  // Parameter-Tafel: die Biomarker-Zeilen der drei Fachbereiche („Vitamin D · CRP · HbA1c"),
  // in jeder Sprache aus derselben Quelle — keine neue Behauptung, kein neuer Text.
  const parameters = Array.from(
    new Set(
      CORE_SERVICE_IDS.flatMap((id) =>
        t(`segments.${id}.bio`)
          .split('·')
          .map((token) => token.trim())
          .filter(Boolean),
      ),
    ),
  )

  const visuals: Record<PillarId, ReactNode> = {
    // Die Tafel ist nicht interaktiv: kein Hover, sie tritt als Ganzes ein.
    diagnostics: (
      <ul
        aria-label={t('business_pillars.pillars.diagnostics.board_label')}
        className="flex h-full flex-wrap content-center gap-2 p-7"
      >
        {parameters.map((label) => (
          <li
            key={label}
            className="inline-flex items-center gap-2 rounded-full border border-paper-line bg-white px-3.5 py-1.5 text-sm font-semibold"
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-line" />
            {label}
          </li>
        ))}
      </ul>
    ),
    igloo: (
      <img
        src={IglooExplodeImage}
        alt=""
        width={240}
        height={280}
        loading="lazy"
        className="float-slow h-full w-full object-contain p-6"
      />
    ),
    // Der Befund steckt im Kartenfalz; beim Zeigen waechst er vom unteren Rand aus nach oben.
    epigenetics: (
      <div className="h-full px-8 pt-8">
        <img
          src={ReportPreview400}
          srcSet={`${ReportPreview400} 400w, ${ReportPreview800} 800w`}
          sizes={CARD_SIZES}
          alt=""
          width={400}
          height={267}
          loading="lazy"
          className="h-full w-full origin-bottom rounded-t-lg border border-b-0 border-paper-line object-cover shadow-card transition-transform duration-700 group-hover:scale-105"
        />
      </div>
    ),
  }

  return (
    <section
      aria-labelledby="homepage-pillars-title"
      data-home-business-pillars
      className="bg-paper py-20 lg:py-24"
    >
      <div className="mx-auto max-w-container px-4 lg:px-0">
        <div className="rv grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-12">
          <div>
            <Eyebrow>{t('business_pillars.eyebrow')}</Eyebrow>
            <h2 id="homepage-pillars-title" className="mt-3 t-display">
              {t('business_pillars.title')}
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-gray-700">
            {t('business_pillars.intro')}
          </p>
        </div>

        {/* Unter md eine Schnapp-Reihe (.rail-x ueberschreibt grid/gap aus index.css,
            das nach den Utilities steht), ab md das Dreiergitter. Ein Zeiger-Listener
            am Gitter versorgt alle drei Karten mit dem Lichtpunkt. */}
        <div ref={spot} className="rail-x mt-12 grid gap-6 md:grid-cols-3">
          {PILLAR_IDS.map((id) => (
            <Card
              key={id}
              to={PILLAR_TARGETS[id].path}
              padding="none"
              data-business-pillar={id}
              data-route-id={PILLAR_TARGETS[id].routeId}
              data-spot=""
              className="spot rv h-auto overflow-hidden shadow-card hover:border-accent-border"
            >
              <div className="aspect-[3/2] overflow-hidden bg-paper">{visuals[id]}</div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
                  <span className="icon-tile h-9 w-9 [&>svg]:h-4 [&>svg]:w-4">
                    {PILLAR_ICONS[id]}
                  </span>
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
            <p className="mt-4 max-w-xl text-base leading-7 text-gray-700">
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

          <figure className="rv overflow-hidden rounded-card bg-paper-deep lg:order-first lg:row-span-2">
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
