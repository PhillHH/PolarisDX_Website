import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Activity, ArrowRight, Dna, Microscope } from 'lucide-react'
import { getCanonicalRouteEntries } from '../../routing'
import { Card } from '../ui/Card'
import Eyebrow from '../ui/Eyebrow'
import Reveal, { REVEAL_STAGGER } from '../ui/Reveal'

type PillarId = 'diagnostics' | 'igloo' | 'epigenetics'

const registryEntries = getCanonicalRouteEntries()

function requireRegistryPath(routeId: string): string {
  const route = registryEntries.find((entry) => entry.id === routeId)
  if (!route) throw new Error(`About pillar target is missing from the Route Registry: ${routeId}`)
  return route.path
}

const PILLAR_TARGETS: Record<PillarId, { routeId: string; path: string }> = {
  diagnostics: { routeId: 'diagnostics', path: requireRegistryPath('diagnostics') },
  igloo: { routeId: 'igloo-pro', path: requireRegistryPath('igloo-pro') },
  epigenetics: { routeId: 'epigenetics', path: requireRegistryPath('epigenetics') },
}

/**
 * AboutPillarsSection — ordnet die drei Geschaeftssaeulen auf der
 * Unternehmensseite ein: Diagnostik, IglooPro und Epigenetik als
 * eigenstaendige, gleichberechtigte Saeule (Claim Register HCL-007–HCL-009).
 * Copy kommt aus dem about-Namespace (x10, aus der freigegebenen
 * Homepage-Pillar-Wahrheit uebernommen); Ziele sind kanonische Registry-Pfade.
 */
const AboutPillarsSection = () => {
  const { t } = useTranslation('about')

  const pillars: { id: PillarId; icon: ReactNode }[] = [
    { id: 'diagnostics', icon: <Microscope aria-hidden="true" /> },
    { id: 'igloo', icon: <Activity aria-hidden="true" /> },
    { id: 'epigenetics', icon: <Dna aria-hidden="true" /> },
  ]

  return (
    <section
      aria-labelledby="about-pillars-title"
      data-about-pillars
      className="bg-white py-16 lg:py-24"
    >
      <div className="mx-auto max-w-container px-4 lg:px-0">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{t('pillars.caption')}</Eyebrow>
          <h2 id="about-pillars-title" className="mt-3 t-h2">
            {t('pillars.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl t-body">{t('pillars.intro')}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pillars.map(({ id, icon }, i) => (
            <Reveal key={id} width="100%" delay={i * REVEAL_STAGGER}>
              <Card
                to={PILLAR_TARGETS[id].path}
                data-about-pillar={id}
                data-route-id={PILLAR_TARGETS[id].routeId}
                className="h-full min-h-[260px] border-t-4 border-t-accent p-7"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent [&>svg]:h-6 [&>svg]:w-6">
                  {icon}
                </span>
                <h3 className="mt-6 text-2xl font-medium tracking-tight text-heading">
                  {t(`pillars.items.${id}.title`)}
                </h3>
                <p className="mt-3 text-base leading-7 text-gray-700">
                  {t(`pillars.items.${id}.text`)}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-accent-strong group-hover:text-brand-deep">
                  {t(`pillars.items.${id}.cta`)}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AboutPillarsSection
