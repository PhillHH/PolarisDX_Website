import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEOHead } from '../seo'
import { serviceDetailContextRoutes } from '../../data/serviceDetail'

export function ServiceDetailNotFound() {
  const { t } = useTranslation(['common', 'services'])
  return (
    <>
      <SEOHead
        title={t('common:notFound.seo.title')}
        description={t('common:notFound.seo.description')}
        notFound
      />
      <div className="mx-auto flex max-w-container flex-col items-center gap-5 px-4 py-24 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
          {t('common:notFound.badge')}
        </span>
        <h1 className="text-2xl font-medium tracking-tight text-heading lg:text-3xl">
          {t('common:notFound.title')}
        </h1>
        <p className="max-w-xl leading-relaxed text-gray-700">{t('common:notFound.description')}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to={serviceDetailContextRoutes.diagnostics.path}
            className="rounded-md bg-accent-strong px-5 py-3 font-medium text-white transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {t('services:overview.hero.title')}
          </Link>
          <Link
            to={serviceDetailContextRoutes.home.path}
            className="rounded-md border border-slate-200 bg-white px-5 py-3 font-medium text-heading transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {t('common:notFound.backHome')}
          </Link>
        </div>
      </div>
    </>
  )
}

export default ServiceDetailNotFound
