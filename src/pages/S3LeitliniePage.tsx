import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  ChevronRight,
  Phone,
  FileText,
  BookOpen,
  Clock,
  Shield,
  BarChart3,
} from 'lucide-react'
import {
  SEOHead,
  createArticleSchema,
  createBreadcrumbSchema,
  createFAQSchema,
} from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import Eyebrow from '../components/ui/Eyebrow'
import iglooProImage from '../assets/Igloo-pro-frontal.webp'
import FinalCtaSection from '../components/sections/FinalCtaSection'

const S3LeitliniePage = () => {
  const { t } = useTranslation('specialty')
  // Author data for E-E-A-T
  const author = {
    name: t('s3_leitlinie.copy_001'),
    type: 'Organization' as const,
    url: 'https://polarisdx.net/about',
  }

  // FAQ data
  const faqItems = [
    {
      question: t('s3_leitlinie.copy_002'),
      answer: t('s3_leitlinie.copy_003'),
    },
    {
      question: t('s3_leitlinie.copy_004'),
      answer: t('s3_leitlinie.copy_005'),
    },
    {
      question: t('s3_leitlinie.copy_006'),
      answer: t('s3_leitlinie.copy_007'),
    },
    {
      question: t('s3_leitlinie.copy_008'),
      answer: t('s3_leitlinie.copy_009'),
    },
    {
      question: t('s3_leitlinie.copy_010'),
      answer: t('s3_leitlinie.copy_011'),
    },
  ]

  // HowTo schema
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('s3_leitlinie.copy_012'),
    description: t('s3_leitlinie.copy_013'),
    totalTime: 'PT5M',
    supply: [
      { '@type': 'HowToSupply', name: t('s3_leitlinie.copy_014') },
      { '@type': 'HowToSupply', name: t('s3_leitlinie.copy_015') },
      { '@type': 'HowToSupply', name: t('s3_leitlinie.copy_016') },
    ],
    tool: [{ '@type': 'HowToTool', name: t('s3_leitlinie.copy_017') }],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: t('s3_leitlinie.copy_018'),
        text: t('s3_leitlinie.copy_019'),
        url: 'https://polarisdx.net/s3_leitlinie#workflow',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: t('s3_leitlinie.copy_020'),
        text: t('s3_leitlinie.copy_021'),
        url: 'https://polarisdx.net/s3_leitlinie#workflow',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: t('s3_leitlinie.copy_022'),
        text: t('s3_leitlinie.copy_023'),
        url: 'https://polarisdx.net/s3_leitlinie#workflow',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: t('s3_leitlinie.copy_024'),
        text: t('s3_leitlinie.copy_025'),
        url: 'https://polarisdx.net/s3_leitlinie#workflow',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: t('s3_leitlinie.copy_026'),
        text: t('s3_leitlinie.copy_027'),
        url: 'https://polarisdx.net/s3_leitlinie#workflow',
      },
    ],
  }

  return (
    <PageTransition>
      <SEOHead
        title={t('s3_leitlinie.copy_028')}
        description={t('s3_leitlinie.copy_029')}
        ogType="article"
        keywords={[
          t('s3_leitlinie.copy_030'),
          t('s3_leitlinie.copy_031'),
          t('s3_leitlinie.copy_032'),
          t('s3_leitlinie.copy_033'),
          t('s3_leitlinie.copy_034'),
          t('s3_leitlinie.copy_035'),
          t('s3_leitlinie.copy_036'),
          t('s3_leitlinie.copy_037'),
          t('s3_leitlinie.copy_038'),
          t('s3_leitlinie.copy_039'),
        ]}
        article={{
          publishedTime: '2026-02-26',
          author: 'PolarisDX Redaktionsteam',
          section: 'Dentale Diagnostik',
        }}
        structuredData={[
          createArticleSchema({
            headline: t('s3_leitlinie.copy_040'),
            description: t('s3_leitlinie.copy_041'),
            image: '/og-image.jpg',
            url: '/s3_leitlinie',
            datePublished: '2026-02-26',
            dateModified: '2026-02-26',
            articleType: 'MedicalWebPage',
            author: author,
          }),
          createBreadcrumbSchema([
            { name: t('s3_leitlinie.copy_042'), url: '/' },
            { name: t('s3_leitlinie.copy_043'), url: '/articles' },
            { name: t('s3_leitlinie.copy_044'), url: '/s3_leitlinie' },
          ]),
          createFAQSchema(faqItems),
          howToSchema,
        ]}
      />

      {/* Article Container */}
      <div className="bg-slate-50">
        {/* Hero / Above the Fold */}
        <section className="relative overflow-hidden bg-brand-deep text-white">
          <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />

          <div className="relative mx-auto flex min-h-[380px] max-w-page flex-col justify-end px-4 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <div className="max-w-[900px] mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
                  <Link to="/" className="hover:text-brand-secondary transition-colors">
                    {t('s3_leitlinie.copy_042')}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <Link to="/articles" className="hover:text-brand-secondary transition-colors">
                    {t('s3_leitlinie.copy_043')}
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="text-white/80">{t('s3_leitlinie.copy_045')}</span>
                </nav>

                {/* Category Label */}
                <Eyebrow tone="dark" className="mb-4">
                  {t('s3_leitlinie.copy_046')}
                </Eyebrow>

                {/* H1 */}
                <h1 className="mb-5 text-2xl font-medium tracking-tight sm:text-3xl lg:text-[2.25rem] lg:leading-[1.2]">
                  {t('s3_leitlinie.copy_047')}
                </h1>

                {/* Subtitle */}
                <p className="mb-6 text-base text-white/80 sm:text-lg lg:text-xl">
                  {t('s3_leitlinie.copy_048')}
                </p>

                {/* Meta with E-E-A-T */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60">
                  <span>{t('s3_leitlinie.copy_049')}</span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span>{t('s3_leitlinie.copy_050')}</span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span>{t('s3_leitlinie.copy_001')}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <div className="mx-auto max-w-[1200px] px-4 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
            {/* Main Article Column */}
            <article className="article-col">
              <Reveal width="100%">
                {/* Author Box - E-E-A-T Signal */}
                <div className="mb-10 flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary font-semibold text-lg">
                    {t('s3_leitlinie.copy_051')}
                  </div>
                  <p className="text-sm font-medium text-heading">{t('s3_leitlinie.copy_001')}</p>
                </div>

                {/* Section 1: Einleitung */}
                <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                  <p>
                    {t('s3_leitlinie.copy_052')} <strong>{t('s3_leitlinie.copy_053')}</strong>{' '}
                    {t('s3_leitlinie.copy_054')}
                  </p>
                  <p>
                    {t('s3_leitlinie.copy_055')} <strong>{t('s3_leitlinie.copy_056')}</strong>{' '}
                    {t('s3_leitlinie.copy_057')}
                  </p>
                  <p>{t('s3_leitlinie.copy_058')}</p>
                </div>

                {/* Section 2: S3-Leitlinie */}
                <section className="mt-12">
                  <h2 className="mb-6 t-h2-sub">{t('s3_leitlinie.copy_059')}</h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      {t('s3_leitlinie.copy_060')} <strong>{t('s3_leitlinie.copy_061')}</strong>{' '}
                      {t('s3_leitlinie.copy_062')}
                    </p>
                    <p>
                      {t('s3_leitlinie.copy_063')} <strong>{t('s3_leitlinie.copy_064')}</strong>
                      {t('s3_leitlinie.copy_065')}
                    </p>
                  </div>

                  {/* Evidence Box: 3 Kernempfehlungen */}
                  <div className="my-8 rounded-lg border-l-4 border-brand-primary bg-brand-primary/5 p-7">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                      {t('s3_leitlinie.copy_066')}
                    </p>
                    <ol className="space-y-3 text-[15px] leading-relaxed text-gray-700 list-decimal list-inside">
                      <li>
                        <strong>{t('s3_leitlinie.copy_067')}</strong> {t('s3_leitlinie.copy_068')}
                      </li>
                      <li>
                        <strong>{t('s3_leitlinie.copy_069')}</strong> {t('s3_leitlinie.copy_070')}
                      </li>
                      <li>
                        <strong>{t('s3_leitlinie.copy_071')}</strong> {t('s3_leitlinie.copy_072')}
                      </li>
                    </ol>
                    <p className="mt-4 text-xs text-gray-500">{t('s3_leitlinie.copy_073')}</p>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>{t('s3_leitlinie.copy_074')}</p>
                  </div>
                </section>

                {/* Section 3: POC vs. Labor */}
                <section className="mt-12">
                  <h2 className="mb-6 t-h2-sub">{t('s3_leitlinie.copy_075')}</h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      {t('s3_leitlinie.copy_076')} <strong>{t('s3_leitlinie.copy_077')}</strong>{' '}
                      {t('s3_leitlinie.copy_078')}
                    </p>
                    <p>
                      {t('s3_leitlinie.copy_079')} <strong>{t('s3_leitlinie.copy_080')}</strong>{' '}
                      {t('s3_leitlinie.copy_081')}
                    </p>
                  </div>

                  {/* Vergleichstabelle. .table-scroll blendet Rand-Fade und
                      Hinweiszeile ein, solange seitlich noch Inhalt folgt; bei
                      375px waren 127px der dritten Spalte verdeckt, ohne jede
                      Andeutung. -slate setzt die Deckfarbe auf die Flaeche
                      dieser Seite (slate-50). Siehe src/index.css. */}
                  <div className="table-scroll table-scroll-slate my-8 rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-heading">
                            {t('s3_leitlinie.copy_082')}
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-heading">
                            {t('s3_leitlinie.copy_083')}
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-heading">
                            {t('s3_leitlinie.copy_084')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-gray-700">{t('s3_leitlinie.copy_085')}</td>
                          <td className="px-4 py-3 text-gray-700">{t('s3_leitlinie.copy_086')}</td>
                          <td className="px-4 py-3 font-medium text-heading">
                            {t('s3_leitlinie.copy_087')}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">{t('s3_leitlinie.copy_088')}</td>
                          <td className="px-4 py-3 text-gray-700">{t('s3_leitlinie.copy_089')}</td>
                          <td className="px-4 py-3 font-medium text-heading">
                            {t('s3_leitlinie.copy_090')}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">{t('s3_leitlinie.copy_091')}</td>
                          <td className="px-4 py-3 text-gray-700">{t('s3_leitlinie.copy_092')}</td>
                          <td className="px-4 py-3 font-medium text-heading">
                            {t('s3_leitlinie.copy_093')}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">{t('s3_leitlinie.copy_094')}</td>
                          <td className="px-4 py-3 text-gray-700">{t('s3_leitlinie.copy_095')}</td>
                          <td className="px-4 py-3 font-medium text-heading">
                            {t('s3_leitlinie.copy_096')}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">{t('s3_leitlinie.copy_097')}</td>
                          <td className="px-4 py-3 text-gray-700">{t('s3_leitlinie.copy_098')}</td>
                          <td className="px-4 py-3 font-medium text-heading">
                            {t('s3_leitlinie.copy_099')}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">{t('s3_leitlinie.copy_100')}</td>
                          <td className="px-4 py-3 text-gray-700">{t('s3_leitlinie.copy_101')}</td>
                          <td className="px-4 py-3 font-medium text-heading">
                            {t('s3_leitlinie.copy_102')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>{t('s3_leitlinie.copy_103')}</p>
                  </div>
                </section>

                {/* Section 4: Igloo Reader Pro */}
                <section className="mt-12">
                  <h2 className="mb-6 t-h2-sub">{t('s3_leitlinie.copy_104')}</h2>

                  <h3 className="mt-8 mb-4 t-h3">{t('s3_leitlinie.copy_105')}</h3>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      {t('s3_leitlinie.copy_106')} <strong>{t('s3_leitlinie.copy_107')}</strong>
                      {t('s3_leitlinie.copy_108')}
                    </p>
                  </div>

                  {/* Feature Grid */}
                  <div className="my-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-brand-primary" />
                        <p className="text-sm font-semibold text-heading">
                          {t('s3_leitlinie.copy_109')}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600">{t('s3_leitlinie.copy_110')}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-brand-primary" />
                        <p className="text-sm font-semibold text-heading">
                          {t('s3_leitlinie.copy_111')}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600">{t('s3_leitlinie.copy_112')}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-brand-primary" />
                        <p className="text-sm font-semibold text-heading">
                          {t('s3_leitlinie.copy_113')}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600">{t('s3_leitlinie.copy_114')}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-brand-primary" />
                        <p className="text-sm font-semibold text-heading">
                          {t('s3_leitlinie.copy_115')}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600">{t('s3_leitlinie.copy_116')}</p>
                    </div>
                  </div>

                  <h3 className="mt-10 mb-4 t-h3">{t('s3_leitlinie.copy_117')}</h3>

                  {/* DEQAS Metrics Box */}
                  <div className="my-6 rounded-lg border-l-4 border-success bg-success-soft/70 p-7">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                      {t('s3_leitlinie.copy_118')}
                    </p>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-heading">#2</p>
                        <p className="text-xs text-gray-600">{t('s3_leitlinie.copy_119')}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-heading">±3–8 %</p>
                        <p className="text-xs text-gray-600">{t('s3_leitlinie.copy_120')}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-heading">
                          {t('s3_leitlinie.copy_121')}
                        </p>
                        <p className="text-xs text-gray-600">{t('s3_leitlinie.copy_122')}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-500">{t('s3_leitlinie.copy_123')}</p>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>{t('s3_leitlinie.copy_124')}</p>
                    <p>
                      <Link
                        to="/igloo-pro"
                        className="font-semibold text-brand-primary hover:underline"
                      >
                        {t('s3_leitlinie.copy_125')}
                      </Link>
                    </p>
                  </div>
                </section>

                {/* Mid-CTA: Diagnostiksystem mit Bild */}
                <div className="my-10 overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-2/5">
                      <img
                        src={iglooProImage}
                        alt={t('s3_leitlinie.copy_126')}
                        width={400}
                        height={400}
                        className="h-48 w-full object-contain bg-gray-50 p-4 sm:h-full"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-6 sm:w-3/5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                        {t('s3_leitlinie.copy_127')}
                      </p>
                      <p className="mb-3 text-base font-medium text-heading">
                        {t('s3_leitlinie.copy_128')}
                      </p>
                      <Link
                        to="/igloo-pro"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
                      >
                        {t('s3_leitlinie.copy_129')}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Section 5: Wirtschaftlichkeit */}
                <section className="mt-12">
                  <h2 className="mb-6 t-h2-sub">{t('s3_leitlinie.copy_130')}</h2>

                  <h3 className="mt-8 mb-4 t-h3">{t('s3_leitlinie.copy_131')}</h3>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      {t('s3_leitlinie.copy_132')} <strong>{t('s3_leitlinie.copy_133')}</strong>{' '}
                      {t('s3_leitlinie.copy_134')}
                    </p>
                  </div>

                  <h3 className="mt-10 mb-4 t-h3">{t('s3_leitlinie.copy_135')}</h3>

                  {/* ROI Box */}
                  <div className="my-6 rounded-lg border border-gray-200 bg-white p-7">
                    <div className="grid gap-4 sm:grid-cols-3 text-center">
                      <div>
                        <p className="text-2xl font-semibold text-brand-primary">
                          {t('s3_leitlinie.copy_136')}
                        </p>
                        <p className="text-xs text-gray-600">{t('s3_leitlinie.copy_137')}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-brand-primary">
                          {t('s3_leitlinie.copy_138')}
                        </p>
                        <p className="text-xs text-gray-600">{t('s3_leitlinie.copy_139')}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-brand-primary">
                          {t('s3_leitlinie.copy_140')}
                        </p>
                        <p className="text-xs text-gray-600">{t('s3_leitlinie.copy_141')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>{t('s3_leitlinie.copy_142')}</p>
                    <p>
                      {t('s3_leitlinie.copy_143')}{' '}
                      <Link
                        to="/diagnostics/dental"
                        className="font-semibold text-brand-primary hover:underline"
                      >
                        {t('s3_leitlinie.copy_144')}
                      </Link>
                      .
                    </p>
                  </div>
                </section>

                {/* Section 6: 5-Schritte-Workflow */}
                <section id="workflow" className="mt-12 scroll-mt-24">
                  <h2 className="mb-6 t-h2-sub">{t('s3_leitlinie.copy_145')}</h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700 mb-8">
                    <p>
                      {t('s3_leitlinie.copy_146')} <strong>{t('s3_leitlinie.copy_147')}</strong>{' '}
                      {t('s3_leitlinie.copy_148')}
                    </p>
                  </div>

                  {/* 5-Schritte-Karten */}
                  <div className="space-y-4">
                    {[
                      {
                        step: 1,
                        title: t('s3_leitlinie.copy_018'),
                        description: t('s3_leitlinie.copy_019'),
                      },
                      {
                        step: 2,
                        title: t('s3_leitlinie.copy_020'),
                        description: t('s3_leitlinie.copy_149'),
                      },
                      {
                        step: 3,
                        title: t('s3_leitlinie.copy_022'),
                        description: t('s3_leitlinie.copy_023'),
                      },
                      {
                        step: 4,
                        title: t('s3_leitlinie.copy_024'),
                        description: t('s3_leitlinie.copy_025'),
                      },
                      {
                        step: 5,
                        title: t('s3_leitlinie.copy_026'),
                        description: t('s3_leitlinie.copy_027'),
                      },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className="flex gap-4 rounded-lg border border-gray-200 bg-white p-5"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white font-semibold text-sm">
                          {item.step}
                        </div>
                        <div>
                          <h3 className="mb-1 text-base font-semibold text-heading">
                            {item.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      {t('s3_leitlinie.copy_150')} <strong>{t('s3_leitlinie.copy_080')}</strong>{' '}
                      {t('s3_leitlinie.copy_151')}
                    </p>
                  </div>
                </section>

                {/* Section 7: D3-Spray */}
                <section className="mt-12">
                  <h2 className="mb-6 t-h2-sub">{t('s3_leitlinie.copy_152')}</h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      {t('s3_leitlinie.copy_153')}{' '}
                      <Link
                        to="/vitamin-d3-implantologie"
                        className="font-semibold text-brand-primary hover:underline"
                      >
                        {t('s3_leitlinie.copy_154')}
                      </Link>{' '}
                      {t('s3_leitlinie.copy_155')}
                    </p>
                    <p>{t('s3_leitlinie.copy_156')}</p>
                  </div>
                </section>

                {/* Section 8: Validierung & Partner */}
                <section className="mt-12">
                  <h2 className="mb-6 t-h2-sub">{t('s3_leitlinie.copy_157')}</h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>{t('s3_leitlinie.copy_158')}</p>
                  </div>

                  {/* Partner Grid */}
                  <div className="my-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="text-sm font-semibold text-heading">
                        {t('s3_leitlinie.copy_159')}
                      </p>
                      <p className="text-xs text-gray-600">{t('s3_leitlinie.copy_160')}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="text-sm font-semibold text-heading">
                        {t('s3_leitlinie.copy_161')}
                      </p>
                      <p className="text-xs text-gray-600">{t('s3_leitlinie.copy_162')}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="text-sm font-semibold text-heading">
                        {t('s3_leitlinie.copy_163')}
                      </p>
                      <p className="text-xs text-gray-600">{t('s3_leitlinie.copy_164')}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="text-sm font-semibold text-heading">
                        {t('s3_leitlinie.copy_165')}
                      </p>
                      <p className="text-xs text-gray-600">{t('s3_leitlinie.copy_166')}</p>
                    </div>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>{t('s3_leitlinie.copy_167')}</p>
                  </div>
                </section>

                {/* Section 9: CTA */}
                <section className="mt-12">
                  <div className="rounded-xl bg-brand-deep p-7 text-white">
                    <h2 className="mb-4 text-xl font-semibold sm:text-2xl">
                      {t('s3_leitlinie.copy_168')}
                    </h2>
                    <p className="mb-6 text-base text-white/90">{t('s3_leitlinie.copy_169')}</p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link
                        to="/contact"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-deep transition-colors hover:bg-gray-50"
                      >
                        {t('s3_leitlinie.copy_170')}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <a
                        href="tel:+4915175011699"
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                      >
                        <Phone className="h-4 w-4" />
                        +49 151 75011699
                      </a>
                    </div>
                    <p className="mt-4 text-xs text-white/60">{t('s3_leitlinie.copy_171')}</p>
                  </div>
                </section>

                {/* Section 10: FAQ */}
                <section className="mt-12 border-t border-gray-200 pt-10">
                  <h2 className="mb-8 t-h2-sub">{t('s3_leitlinie.copy_172')}</h2>

                  <div className="space-y-8">
                    {faqItems.map((faq, index) => (
                      <div key={index}>
                        <h3 className="mb-3 text-base font-semibold text-heading">
                          {faq.question}
                        </h3>
                        <p className="text-[15px] leading-relaxed text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Zurück-Link */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                  <Link
                    to="/articles"
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    {t('s3_leitlinie.copy_173')}
                  </Link>
                </div>
              </Reveal>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Telefon-Kontaktbox */}
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10">
                      <Phone className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-heading">
                        {t('s3_leitlinie.copy_174')}
                      </p>
                      <p className="text-xs text-gray-500">{t('s3_leitlinie.copy_175')}</p>
                    </div>
                  </div>
                  <a
                    href="tel:+4915175011699"
                    className="flex items-center justify-center gap-2 rounded-md bg-brand-primary/10 px-4 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/20"
                  >
                    <Phone className="h-4 w-4" />
                    +49 151 75011699
                  </a>
                  <p className="mt-2 text-center text-xs text-gray-500">
                    {t('s3_leitlinie.copy_176')}
                  </p>
                </div>

                {/* CTA Box */}
                <div className="rounded-xl bg-brand-deep p-5 text-white">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                    {t('s3_leitlinie.copy_177')}
                  </p>
                  <p className="mb-4 text-sm">{t('s3_leitlinie.copy_178')}</p>
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-brand-deep transition-colors hover:bg-gray-50"
                  >
                    {t('s3_leitlinie.copy_170')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Verwandte Artikel */}
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-heading">
                    <BookOpen className="h-4 w-4 text-brand-primary" />
                    {t('s3_leitlinie.copy_179')}
                  </p>
                  <div className="space-y-3">
                    <Link
                      to="/vitamin-d3-implantologie"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-heading group-hover:text-brand-primary">
                          {t('s3_leitlinie.copy_180')}
                        </p>
                        <p className="text-xs text-gray-500">{t('s3_leitlinie.copy_181')}</p>
                      </div>
                    </Link>
                    <Link
                      to="/igloo-pro"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-heading group-hover:text-brand-primary">
                          {t('s3_leitlinie.copy_182')}
                        </p>
                        <p className="text-xs text-gray-500">{t('s3_leitlinie.copy_183')}</p>
                      </div>
                    </Link>
                    <Link
                      to="/diagnostics/dental"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-success-soft text-success-strong">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-heading group-hover:text-brand-primary">
                          {t('s3_leitlinie.copy_184')}
                        </p>
                        <p className="text-xs text-gray-500">{t('s3_leitlinie.copy_185')}</p>
                      </div>
                    </Link>
                    <Link
                      to="/articles/die-5-minuten-diagnose"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-success-soft text-success-strong">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-heading group-hover:text-brand-primary">
                          {t('s3_leitlinie.copy_186')}
                        </p>
                        <p className="text-xs text-gray-500">{t('s3_leitlinie.copy_187')}</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Trust Signal */}
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <p className="text-xs text-gray-500">
                    {t('s3_leitlinie.copy_188')}{' '}
                    <span className="font-semibold text-gray-700">
                      {t('s3_leitlinie.copy_189')}
                    </span>{' '}
                    {t('s3_leitlinie.copy_190')}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 shadow-lg border-t border-gray-200 bg-white p-4 lg:hidden">
        <Link
          to="/contact"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-6 py-3.5 text-sm font-semibold text-white"
        >
          {t('s3_leitlinie.copy_170')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Mobile bottom padding for sticky CTA */}
      <div className="h-20 lg:hidden" />
      <FinalCtaSection roiHref="/#roi-rechner" />
    </PageTransition>
  )
}

export default S3LeitliniePage
