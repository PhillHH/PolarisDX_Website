import { ArrowRight, Cable, FileText, Headphones, ListChecks, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCanonicalRouteEntries } from '../../routing/routeRegistry'
import Eyebrow from '../ui/Eyebrow'

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
 */
export default function IglooCompatibilitySection() {
  const { t } = useTranslation('products')

  return (
    <section
      aria-labelledby="igloo-compatibility-title"
      data-igloo-compatibility
      className="bg-white"
    >
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="max-w-xl">
            <Eyebrow>{t('compatibility.eyebrow')}</Eyebrow>
            <h2 id="igloo-compatibility-title" className="mt-3 t-h2">
              {t('compatibility.title')}
            </h2>
            <p className="mt-4 text-gray-700">{t('compatibility.description')}</p>
            <p className="mt-6 rounded-lg bg-slate-50 px-5 py-4 text-sm leading-relaxed text-gray-700">
              {t('compatibility.boundary')}
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {compatibilityItems.map(({ key, icon: Icon }) => (
              <li
                key={key}
                data-compatibility-check={key}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6"
              >
                <Icon className="h-5 w-5 text-accent-strong" aria-hidden="true" />
                <h3 className="mt-4 text-base font-medium text-heading">
                  {t(`compatibility.items.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">
                  {t(`compatibility.items.${key}.text`)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label={t('compatibility.links_label')} className="mt-14 border-t pt-10">
          <h3 className="text-lg font-medium text-heading">{t('compatibility.links_title')}</h3>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {relatedRoutes.map(({ key, routeId, path }) => (
              <li key={routeId}>
                <Link
                  to={path}
                  data-related-route-id={routeId}
                  className="group flex min-h-[52px] h-full items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-heading transition hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  <span className="flex items-center gap-2">
                    {key === 'downloads' && <FileText className="h-4 w-4" aria-hidden="true" />}
                    {t(`compatibility.links.${key}`)}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-accent-strong transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}
