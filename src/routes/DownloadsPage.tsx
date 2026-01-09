import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SectionHeader from '../components/ui/SectionHeader'
import { FileText, Download } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

// Import documents directly to get the hashed URL from Vite
import PriceListDE from '../assets/downloads/Polaris Price List A4_ €_DE 18.09.25.pdf'
import PriceListEN from '../assets/downloads/Polaris Price List A4_€_EN 23.06.25.pdf'
import PriceListGBP from '../assets/downloads/PolarixDX Price List A5_£_EN 202507.pdf'
import IglooProSystemFlyerDE from '../assets/downloads/igloo-pro-flyer.pdf'

type DownloadItem = {
  id: string
  title: string
  size: string
  format: string
  date?: string
  url: string
  openInBrowser?: boolean
}

const DownloadsPage = () => {
  const { t } = useTranslation(['downloads', 'common'])

  const priceLists: DownloadItem[] = [
    {
      id: 'pl-de',
      title: 'Polaris Preisliste (DE)',
      size: '210 KB',
      format: 'PDF',
      date: '2025-09-18',
      url: PriceListDE,
    },
    {
      id: 'pl-en',
      title: 'Polaris Price List (EU)',
      size: '280 KB',
      format: 'PDF',
      date: '2025-06-23',
      url: PriceListEN,
    },
    {
      id: 'pl-gbp',
      title: 'PolarisDX Price List (UK)',
      size: '205 KB',
      format: 'PDF',
      date: '2025-07-01',
      url: PriceListGBP,
    },
  ]

  const techBrochures: DownloadItem[] = []
  const infoMaterials: DownloadItem[] = [
    {
      id: 'im-de-igloo-pro',
      title: 'Igloo Pro System Flyer (DE)',
      size: '3.5 MB',
      format: 'PDF',
      url: IglooProSystemFlyerDE,
      openInBrowser: true,
    },
  ]

  const renderDownloadSection = (title: string, items: DownloadItem[]) => (
    <div className="mb-12 last:mb-0">
      <h3 className="mb-6 text-2xl font-medium text-gray-900">{title}</h3>
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
                <h4 className="mb-2 text-lg font-medium text-gray-900">{item.title}</h4>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-600">
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
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Download className="h-4 w-4" />
                  {t('downloads:downloadBtn')}
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-slate-50 p-8 text-center text-gray-500">
          <p>{t('downloads:comingSoon')}</p>
        </div>
      )}
    </div>
  )

  return (
    <PageTransition>
      <div className="bg-slate-50 text-gray-900">
        {/* Hero / Top */}
        <section className="relative overflow-hidden bg-brand-primary text-white">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

          <div className="relative mx-auto flex min-h-[320px] max-w-page flex-col justify-end px-4 pb-10 pt-28 lg:px-10 lg:pb-14 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <div className="max-w-container">
                <div className="mb-3 text-sm text-white/70">
                  <Link to="/" className="hover:text-brand-secondary">
                    {t('downloads:home')}
                  </Link>{' '}
                  / <span>{t('downloads:title')}</span>
                </div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accentBlue">
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
        <main className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">
          <Reveal width="100%">
            <div className="mb-10">
              <SectionHeader
                caption={t('downloads:title')}
                title={t('downloads:discoverTitle')}
                align="left"
              />
              <p className="mt-4 max-w-2xl text-lg text-gray-600">
                {t('downloads:introText')}
              </p>
            </div>

            <div className="space-y-12">
              {renderDownloadSection(t('downloads:priceLists'), priceLists)}
              {renderDownloadSection(t('downloads:techBrochures'), techBrochures)}
              {renderDownloadSection(t('downloads:infoMaterials'), infoMaterials)}
            </div>
          </Reveal>
        </main>
      </div>
    </PageTransition>
  )
}

export default DownloadsPage
