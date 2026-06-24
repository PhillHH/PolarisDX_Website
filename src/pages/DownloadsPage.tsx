import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import { Breadcrumbs, Container, EmptyState, SectionHeader } from '~/design-system'
import { FileText, Download } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

// CMS-managed document list (edited via the PolarisDX CMS, bundled at build time).
// Static import is SSR-safe (no runtime fs read) and rebuilt on publish.
import downloadsData from '../content/downloads.json'

type DownloadItem = {
  id: string
  title: string
  size: string
  format: string
  date?: string
  url: string
  openInBrowser?: boolean
}

// Shape of each entry in downloads.json (CMS-managed). `category` narrows to the union.
type DownloadRecord = {
  id: string
  title: string
  category: 'tech' | 'info'
  file: string
  format: string
  size: string
  date?: string
}

const DownloadsPage = () => {
  const { t } = useTranslation(['downloads', 'common'])

  const records = (downloadsData as { items: DownloadRecord[] }).items

  const toItem = (rec: DownloadRecord): DownloadItem => ({
    id: rec.id,
    title: rec.title,
    size: rec.size,
    format: rec.format,
    date: rec.date,
    // public/ is copied to dist, so the public URL is /downloads/<file>.
    url: '/downloads/' + encodeURIComponent(rec.file),
    openInBrowser: true,
  })

  const techBrochures: DownloadItem[] = records.filter((rec) => rec.category === 'tech').map(toItem)
  const infoMaterials: DownloadItem[] = records.filter((rec) => rec.category === 'info').map(toItem)

  const renderDownloadSection = (title: string, items: DownloadItem[]) => (
    <div className="mb-12 last:mb-0">
      <h3 className="mb-6 text-2xl font-medium text-fg-heading">{title}</h3>
      {items.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
            >
              <div>
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-blue-50 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText className="h-6 w-6" />
                </div>
                <h4 className="mb-2 text-lg font-medium text-fg-heading">{item.title}</h4>
                <div className="flex items-center gap-3 text-sm text-fg-muted">
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-fg">
                    {item.format}
                  </span>
                  <span>{item.size}</span>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={item.url}
                  download={item.openInBrowser ? undefined : true}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-fg transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Download className="h-4 w-4" />
                  {t('downloads:downloadBtn')}
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState variant="outlined" title={t('downloads:comingSoon')} />
      )}
    </div>
  )

  return (
    <PageTransition>
      <SEOHead
        title={t('downloads:seo.title', 'Downloads: Produktdaten IglooPro | PolarisDX')}
        description={t(
          'downloads:seo.description',
          'Technische Datenblätter und Produktinformationen zum IglooPro POC-Reader und POCT-Testkassetten. Kostenlos herunterladen.',
        )}
        keywords={['PolarisDX Downloads', 'Produktdatenblatt', 'POC Diagnostik PDF']}
        structuredData={[
          createBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Downloads', url: '/downloads' },
          ]),
        ]}
      />
      <div className="bg-slate-50 text-fg-heading">
        {/* Hero / Top */}
        <section className="relative overflow-hidden bg-brand-primary text-white">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

          <div className="relative mx-auto flex min-h-[320px] max-w-page flex-col justify-end px-4 pb-10 pt-28 lg:px-10 lg:pb-14 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <div className="max-w-container">
                <Breadcrumbs
                  className="mb-3"
                  items={[
                    { label: t('downloads:home'), href: '/' },
                    { label: t('downloads:title') },
                  ]}
                />
                <p className="mb-2 text-xs font-semibold uppercase tracking-overline text-accent-strong">
                  {t('downloads:subtitle')}
                </p>
                <h1 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
                  {t('downloads:title')}
                </h1>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Main Content */}
        <Container className="py-12 lg:py-16">
          <Reveal width="100%">
            <div className="mb-10">
              <SectionHeader
                caption={t('downloads:title')}
                title={t('downloads:discoverTitle')}
                align="left"
              />
              <p className="mt-4 max-w-2xl text-lg text-fg">{t('downloads:introText')}</p>
            </div>

            <div className="space-y-12">
              {renderDownloadSection(t('downloads:techBrochures'), techBrochures)}
              {renderDownloadSection(t('downloads:infoMaterials'), infoMaterials)}
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <Link
                to="/igloo-pro"
                className="font-semibold text-brand-primary hover:text-brand-deep transition-colors"
              >
                {t('downloads:link_igloo', 'Zum IglooPro System')} →
              </Link>
              <Link
                to="/diagnostics"
                className="font-semibold text-brand-primary hover:text-brand-deep transition-colors"
              >
                {t('downloads:link_services', 'Diagnostik-Services')} →
              </Link>
              <Link
                to="/contact"
                className="font-semibold text-brand-primary hover:text-brand-deep transition-colors"
              >
                {t('downloads:link_contact', 'Beratung anfragen')} →
              </Link>
            </div>
          </Reveal>
        </Container>
      </div>
    </PageTransition>
  )
}

export default DownloadsPage
