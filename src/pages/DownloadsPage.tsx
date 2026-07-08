import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SEOHead, createBreadcrumbSchema } from '../components/seo'
import { FileText, Download, Calendar } from 'lucide-react'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import SubpageHero from '../components/sections/SubpageHero'

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
    <div className="mb-14 last:mb-0">
      <h2 className="mb-6 text-2xl font-medium tracking-tight text-heading">{title}</h2>
      {items.length > 0 ? (
        <Reveal width="100%">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-card"
              >
                <div>
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-white">
                    <FileText className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mb-3 text-lg font-medium leading-snug text-heading">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-medium text-accent">
                      {item.format}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 font-medium text-gray-600">
                      {item.size}
                    </span>
                    {item.date && (
                      <span className="inline-flex items-center gap-1 text-gray-500">
                        <Calendar className="h-3.5 w-3.5" aria-hidden />
                        {item.date}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href={item.url}
                    download={item.openInBrowser ? undefined : true}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  >
                    <Download className="h-4 w-4" aria-hidden />
                    {t('downloads:downloadBtn')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-slate-50 p-8 text-center text-gray-500">
          <p>{t('downloads:comingSoon')}</p>
        </div>
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

      <SubpageHero
        breadcrumbs={[
          { label: t('downloads:home', 'Home'), href: '/' },
          { label: t('downloads:title') },
        ]}
        eyebrow={t('downloads:subtitle')}
        title={t('downloads:title')}
        subtitle={t('downloads:introText')}
        primaryCta={{ label: t('downloads:hero_cta', 'Beratung anfragen'), to: '/contact' }}
        chips={[
          t('downloads:chip_free', 'Kostenlos & ohne Anmeldung'),
          t('downloads:chip_pdf', 'PDF-Format'),
          t('downloads:chip_updated', 'Regelmäßig aktualisiert'),
        ]}
        icon={<Download />}
        valueChips={[
          { value: String(records.length), label: t('downloads:vc_docs_label', 'Dokumente') },
          { value: 'PDF', label: t('downloads:vc_format_label', 'Format') },
          {
            value: t('downloads:vc_free_value', 'Kostenlos'),
            label: t('downloads:vc_free_label', 'Download'),
          },
        ]}
      />

      <div className="bg-slate-50">
        <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
          <div className="space-y-14">
            {renderDownloadSection(t('downloads:techBrochures'), techBrochures)}
            {renderDownloadSection(t('downloads:infoMaterials'), infoMaterials)}
          </div>

          {/* Dezente Schluss-CTA (Teal-Band) */}
          <Reveal width="100%">
            <div className="mt-14 flex flex-col gap-4 rounded-2xl bg-accent p-6 text-white md:flex-row md:items-center md:justify-between lg:p-8">
              <div>
                <p className="text-lg font-medium">
                  {t('downloads:cta_title', 'Unterlage nicht gefunden?')}
                </p>
                <p className="mt-1 text-sm text-white/85">
                  {t(
                    'downloads:cta_text',
                    'Unser Team stellt Ihnen weitere Datenblätter, Zertifikate oder eine individuelle Produktberatung bereit.',
                  )}
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-white px-5 py-3 font-medium text-brand-deep transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-accent"
              >
                {t('downloads:cta_button', 'Beratung anfragen')}
              </Link>
            </div>
          </Reveal>

          {/* Quick-Links */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link
              to="/igloo-pro"
              className="font-semibold text-accent transition-colors hover:text-accent-strong"
            >
              {t('downloads:link_igloo', 'Zum IglooPro System')} →
            </Link>
            <Link
              to="/diagnostics"
              className="font-semibold text-accent transition-colors hover:text-accent-strong"
            >
              {t('downloads:link_services', 'Diagnostik-Services')} →
            </Link>
            <Link
              to="/contact"
              className="font-semibold text-accent transition-colors hover:text-accent-strong"
            >
              {t('downloads:link_contact', 'Beratung anfragen')} →
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default DownloadsPage
