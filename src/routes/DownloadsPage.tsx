import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SectionHeader from '../components/ui/SectionHeader'
import { FileText, Download } from 'lucide-react'

// Placeholder data structure for downloads
type DownloadItem = {
  id: string
  title: string
  size: string
  format: string
  date: string
}

const DownloadsPage = () => {
  const { t } = useTranslation(['downloads', 'common'])

  // Placeholder data - in a real app this might come from a prop or API
  const priceLists: DownloadItem[] = [
    { id: 'pl-1', title: 'IglooPro Pricing 2024 (EU)', size: '1.2 MB', format: 'PDF', date: '2024-01-15' },
    { id: 'pl-2', title: 'Service Packages Pricing', size: '0.8 MB', format: 'PDF', date: '2024-02-01' },
    { id: 'pl-3', title: 'Accessories & Consumables', size: '1.5 MB', format: 'PDF', date: '2024-01-20' },
  ]

  const techBrochures: DownloadItem[] = [
    { id: 'tb-1', title: 'IglooPro Technical Specifications', size: '2.4 MB', format: 'PDF', date: '2023-11-10' },
    { id: 'tb-2', title: 'Connectivity & Integration Guide', size: '3.1 MB', format: 'PDF', date: '2023-12-05' },
    { id: 'tb-3', title: 'Lab Validation Report', size: '4.5 MB', format: 'PDF', date: '2024-01-08' },
    { id: 'tb-4', title: 'Quick Start Guide', size: '1.8 MB', format: 'PDF', date: '2023-10-15' },
  ]

  const infoMaterials: DownloadItem[] = [
    { id: 'im-1', title: 'Company Overview Presentation', size: '5.2 MB', format: 'PPTX', date: '2024-01-10' },
    { id: 'im-2', title: 'Case Study: Hospital Implementation', size: '1.1 MB', format: 'PDF', date: '2023-09-22' },
    { id: 'im-3', title: 'Patient Information Leaflet', size: '0.5 MB', format: 'PDF', date: '2023-08-15' },
  ]

  const renderDownloadSection = (title: string, items: DownloadItem[]) => (
    <div className="mb-12 last:mb-0">
      <h3 className="mb-6 text-2xl font-medium text-gray-900">{title}</h3>
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
              <h4 className="mb-2 text-lg font-medium text-gray-900">{item.title}</h4>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-600">{item.format}</span>
                <span>{item.size}</span>
              </div>
            </div>

            <div className="mt-6">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600">
                <Download className="h-4 w-4" />
                {t('downloads:downloadBtn')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="bg-slate-50 text-gray-900">
      {/* Hero / Top */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

        <div className="relative mx-auto flex min-h-[320px] max-w-[1440px] flex-col justify-end px-4 pb-10 pt-28 lg:px-10 lg:pb-14 lg:pt-32">
          <div className="max-w-container">
            <div className="mb-3 text-sm text-white/70">
              <Link to="/" className="hover:text-secondary">
                {t('downloads:home')}
              </Link>{' '}
              / <span>{t('downloads:title')}</span>
            </div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accentBlue">
              {t('downloads:subtitle')}
            </p>
            <h1 className="text-[40px] leading-[47px] font-medium tracking-[-0.02em] sm:text-[48px] sm:leading-[58px] lg:text-[58px] lg:leading-[69px]">
              {t('downloads:title')}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">
        <div className="mb-10">
          <SectionHeader
            caption={t('downloads:title')}
            title={t('downloads:discoverTitle')}
            align="left"
          />
        </div>

        <div className="space-y-12">
          {renderDownloadSection(t('downloads:priceLists'), priceLists)}
          {renderDownloadSection(t('downloads:techBrochures'), techBrochures)}
          {renderDownloadSection(t('downloads:infoMaterials'), infoMaterials)}
        </div>
      </main>
    </div>
  )
}

export default DownloadsPage
