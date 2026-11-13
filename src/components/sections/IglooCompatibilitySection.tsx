import { Cable, Headphones, ListChecks, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCanonicalRouteEntries } from '../../routing/routeRegistry'

const compatibilityItems = [
  { key: 'portfolio', icon: ListChecks },
  { key: 'setting', icon: Workflow },
  { key: 'data', icon: Cable },
  { key: 'service', icon: Headphones },
] as const

const relatedRouteIds = [
  { key: 'poc', routeId: 'service-detail:poc-systemloesungen' },
  { key: 'compatibility', routeId: 'service-detail:kompatibilitaet-integration' },
  { key: 'downloads', routeId: 'downloads' },
  { key: 'support', routeId: 'support' },
  { key: 'contact', routeId: 'contact' },
] as const

const canonicalRoutes = getCanonicalRouteEntries()
const relatedRoutes = relatedRouteIds.map((item) => {
  const route = canonicalRoutes.find((entry) => entry.id === item.routeId)
  if (!route) throw new Error(`Missing canonical IglooPro related route: ${item.routeId}`)
  return { ...item, path: route.path }
})

/**
 * Compatibility is presented as a validation checklist. No interface, test,
 * SLA or maintenance capability is inferred from legacy marketing copy.
 *
 * SC-028: Kopf links, die vier Prüfpunkte rechts als Zeilen; die Verweise als Raster darunter.
 */
export default function IglooCompatibilitySection() {
  const { t } = useTranslation('products')

  return (
    <section
      aria-labelledby="igloo-compatibility-title"
      data-igloo-compatibility
      data-sub-section
      className="sc025-s"
    >
      <div className="sc025-inner">
        <div className="sc028-two">
          <div>
            <span className="sc025-kicker">{t('compatibility.eyebrow')}</span>
            <h2 id="igloo-compatibility-title" className="sc025-h2 sc028-side-h2">
              {t('compatibility.title')}
            </h2>
            <p className="sc028-lead">{t('compatibility.description')}</p>
            <p className="sc025-note">{t('compatibility.boundary')}</p>
          </div>

          <ul className="sc028-cols grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {compatibilityItems.map(({ key, icon: Icon }) => (
              <li key={key} data-compatibility-check={key} className="rv">
                <Icon aria-hidden="true" />
                <h3>{t(`compatibility.items.${key}.title`)}</h3>
                <p className="sc025-text">{t(`compatibility.items.${key}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label={t('compatibility.links_label')}>
          <h3 className="sc028-h3">{t('compatibility.links_title')}</h3>
          <ul className="sc028-rel">
            {relatedRoutes.map(({ key, routeId, path }) => (
              <li key={routeId}>
                <Link
                  to={path}
                  data-related-route-id={routeId}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                >
                  {t(`compatibility.links.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
