import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  Phone,
  FileText,
  BookOpen,
  Microscope,
  BarChart3,
  BadgeCheck,
  ShieldCheck,
} from 'lucide-react'
import {
  SEOHead,
  createArticleSchema,
  createBreadcrumbSchema,
  createFAQSchema,
} from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import SubpageHero from '../components/sections/SubpageHero'
import PraxisOrderForm from '../components/sections/PraxisOrderForm'
import { Tooth } from '../components/ui/icons/Tooth'
import iglooProImage from '../assets/Igloo-pro-frontal.webp'
import FinalCtaSection from '../components/sections/FinalCtaSection'

const VitaminD3ImplantologyPage = () => {
  const { t } = useTranslation('specialty')
  // Author data for E-E-A-T
  const author = {
    name: t('vitamin_d3_implantology.copy_001'),
    type: 'Organization' as const,
    url: 'https://polarisdx.net/about',
  }

  // FAQ data - rewritten to complement (not repeat) main text
  const faqItems = [
    {
      question: t('vitamin_d3_implantology.copy_002'),
      answer: t('vitamin_d3_implantology.copy_003'),
    },
    {
      question: t('vitamin_d3_implantology.copy_004'),
      answer: t('vitamin_d3_implantology.copy_005'),
    },
    {
      question: t('vitamin_d3_implantology.copy_006'),
      answer: t('vitamin_d3_implantology.copy_007'),
    },
    {
      question: t('vitamin_d3_implantology.copy_008'),
      answer: t('vitamin_d3_implantology.copy_009'),
    },
  ]

  return (
    <PageTransition>
      <SEOHead
        title={t('vitamin_d3_implantology.copy_010')}
        description={t('vitamin_d3_implantology.copy_011')}
        ogType="article"
        keywords={[
          t('s3_leitlinie.copy_030'),
          t('vitamin_d3_implantology.copy_012'),
          t('vitamin_d3_implantology.copy_013'),
          t('vitamin_d3_implantology.copy_014'),
          t('vitamin_d3_implantology.copy_015'),
          t('vitamin_d3_implantology.copy_016'),
          t('vitamin_d3_implantology.copy_017'),
          t('vitamin_d3_implantology.copy_018'),
          t('vitamin_d3_implantology.copy_019'),
        ]}
        article={{
          publishedTime: '2026-02-01',
          author: 'Fachredaktion PolarisDX',
          section: 'Praxiswissen',
        }}
        structuredData={[
          createArticleSchema({
            headline: t('vitamin_d3_implantology.copy_020'),
            description: t('vitamin_d3_implantology.copy_021'),
            image: '/og-image.jpg',
            url: '/vitamin-d3-implantologie',
            datePublished: '2026-02-01',
            dateModified: '2026-02-04',
            articleType: 'MedicalWebPage',
            author: author,
          }),
          createBreadcrumbSchema([
            { name: t('s3_leitlinie.copy_042'), url: '/' },
            { name: t('vitamin_d3_implantology.copy_022'), url: '/articles' },
            { name: t('s3_leitlinie.copy_180'), url: '/vitamin-d3-implantologie' },
          ]),
          createFAQSchema(faqItems),
        ]}
      />

      <SubpageHero
        breadcrumbs={[
          { label: t('s3_leitlinie.copy_042'), href: '/' },
          { label: t('vitamin_d3_implantology.copy_022'), href: '/articles' },
          { label: t('s3_leitlinie.copy_180') },
        ]}
        eyebrow={t('vitamin_d3_implantology.copy_023')}
        title={t('vitamin_d3_implantology.copy_020')}
        subtitle={t('vitamin_d3_implantology.copy_021')}
        primaryCta={{ label: t('vitamin_d3_implantology.copy_024'), href: '#bestellformular' }}
        secondaryCta={{ label: t('vitamin_d3_implantology.copy_025'), to: '/igloo-pro' }}
        chips={[
          t('vitamin_d3_implantology.copy_026'),
          t('s3_leitlinie.copy_050'),
          t('vitamin_d3_implantology.copy_001'),
        ]}
        stats={[
          { value: '30 %', label: t('vitamin_d3_implantology.copy_027') },
          {
            value: t('vitamin_d3_implantology.copy_052'),
            label: t('vitamin_d3_implantology.copy_028'),
          },
          { value: '22/27', label: t('vitamin_d3_implantology.copy_029') },
        ]}
        valueChips={[
          { value: '≥ 30 ng/ml', label: t('vitamin_d3_implantology.copy_030') },
          {
            value: t('vitamin_d3_implantology.copy_052'),
            label: t('vitamin_d3_implantology.copy_031'),
          },
          { value: '30 %', label: t('vitamin_d3_implantology.copy_032') },
        ]}
        icon={<Tooth />}
      />

      {/* Evidenz-Leiste direkt unter dem Hero */}
      <section
        aria-label={t('vitamin_d3_implantology.copy_033')}
        className="border-b border-slate-200 bg-slate-50"
      >
        <div className="mx-auto max-w-container px-4 py-7 lg:px-0">
          <ul className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            {[
              { icon: Microscope, label: t('vitamin_d3_implantology.copy_034') },
              { icon: BarChart3, label: t('vitamin_d3_implantology.copy_035') },
              { icon: BadgeCheck, label: t('vitamin_d3_implantology.copy_036') },
              { icon: ShieldCheck, label: t('vitamin_d3_implantology.copy_037') },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2">
                <Icon size={18} className="text-accent" aria-hidden="true" />
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Article Container */}
      <div className="bg-slate-50">
        {/* Main Content with Sidebar */}
        <div className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
            {/* Main Article Column */}
            <article className="article-col">
              <Reveal width="100%">
                {/* Author Box - E-E-A-T Signal */}
                <div className="mb-10 flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-lg font-semibold text-accent">
                    {t('vitamin_d3_implantology.copy_038')}
                  </div>
                  <p className="text-sm font-medium text-heading">
                    {t('vitamin_d3_implantology.copy_001')}
                  </p>
                </div>

                {/* Problem Section */}
                <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                  <p>
                    {t('vitamin_d3_implantology.copy_039')}{' '}
                    <strong>{t('vitamin_d3_implantology.copy_040')}</strong>.
                  </p>
                  <p>
                    {t('vitamin_d3_implantology.copy_041')}{' '}
                    <strong>{t('vitamin_d3_implantology.copy_042')}</strong>{' '}
                    {t('vitamin_d3_implantology.copy_043')}
                  </p>
                </div>

                {/* Evidence Section */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-medium tracking-tight text-heading sm:text-2xl">
                    {t('vitamin_d3_implantology.copy_044')}
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      {t('vitamin_d3_implantology.copy_045')}{' '}
                      <em>{t('vitamin_d3_implantology.copy_046')}</em>{' '}
                      {t('vitamin_d3_implantology.copy_047')}{' '}
                      <strong>{t('vitamin_d3_implantology.copy_048')}</strong>{' '}
                      {t('vitamin_d3_implantology.copy_049')}
                    </p>
                  </div>

                  {/* Evidence Box */}
                  <div className="my-8 rounded-lg border-l-4 border-accent bg-accent/5 p-7">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                      {t('vitamin_d3_implantology.copy_050')}
                    </p>
                    <ul className="space-y-2 text-[15px] leading-relaxed text-gray-700">
                      <li>
                        <strong>{t('vitamin_d3_implantology.copy_017')}</strong>
                        {t('vitamin_d3_implantology.copy_051')}{' '}
                        <strong className="text-heading">
                          {t('vitamin_d3_implantology.copy_052')}
                        </strong>{' '}
                        {t('vitamin_d3_implantology.copy_053')}
                      </li>
                      <li>
                        {t('vitamin_d3_implantology.copy_054')}{' '}
                        <strong>{t('vitamin_d3_implantology.copy_055')}</strong>{' '}
                        {t('vitamin_d3_implantology.copy_056')}
                      </li>
                      <li>
                        {t('vitamin_d3_implantology.copy_057')}{' '}
                        <strong>{t('vitamin_d3_implantology.copy_058')}</strong>
                        {t('vitamin_d3_implantology.copy_059')}
                      </li>
                    </ul>
                    <p className="mt-4 text-xs text-gray-500">
                      {t('vitamin_d3_implantology.copy_060')}
                    </p>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      {t('vitamin_d3_implantology.copy_061')}{' '}
                      <strong>{t('vitamin_d3_implantology.copy_062')}</strong>{' '}
                      {t('vitamin_d3_implantology.copy_063')}{' '}
                      <strong>{t('vitamin_d3_implantology.copy_064')}</strong>{' '}
                      {t('vitamin_d3_implantology.copy_065')}
                    </p>
                  </div>
                </section>

                {/* Dosing Protocol Section - NEW for SEO */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-medium tracking-tight text-heading sm:text-2xl">
                    {t('vitamin_d3_implantology.copy_066')}
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      {t('vitamin_d3_implantology.copy_067')}{' '}
                      <strong>{t('vitamin_d3_implantology.copy_019')}</strong>{' '}
                      {t('vitamin_d3_implantology.copy_068')}{' '}
                      <strong>{t('vitamin_d3_implantology.copy_042')}</strong>{' '}
                      {t('vitamin_d3_implantology.copy_069')}
                    </p>
                  </div>

                  {/* Dosing Table */}
                  <div className="my-8 overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-heading">
                            {t('vitamin_d3_implantology.copy_070')}
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-heading">
                            {t('vitamin_d3_implantology.copy_071')}
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-heading">
                            {t('vitamin_d3_implantology.copy_072')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-gray-700">
                            {t('vitamin_d3_implantology.copy_073')}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {t('vitamin_d3_implantology.copy_074')}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {t('vitamin_d3_implantology.copy_075')}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">
                            {t('vitamin_d3_implantology.copy_076')}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {t('vitamin_d3_implantology.copy_077')}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {t('vitamin_d3_implantology.copy_078')}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">
                            {t('vitamin_d3_implantology.copy_079')}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {t('vitamin_d3_implantology.copy_080')}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {t('vitamin_d3_implantology.copy_081')}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">
                            {t('vitamin_d3_implantology.copy_082')}
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {t('vitamin_d3_implantology.copy_083')}
                          </td>
                          <td className="px-4 py-3 text-gray-700">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      {t('vitamin_d3_implantology.copy_084')}{' '}
                      <strong>{t('vitamin_d3_implantology.copy_085')}</strong>{' '}
                      {t('vitamin_d3_implantology.copy_086')}
                    </p>
                    <p>
                      <em>{t('vitamin_d3_implantology.copy_087')}</em>{' '}
                      {t('vitamin_d3_implantology.copy_088')}
                    </p>
                  </div>
                </section>

                {/* Mid-CTA: Diagnostics System with Image */}
                <div className="my-10 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-2/5">
                      <img
                        src={iglooProImage}
                        alt={t('s3_leitlinie.copy_126')}
                        width={400}
                        height={400}
                        className="h-48 w-full bg-gray-50 object-contain p-4 sm:h-full"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-6 sm:w-3/5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                        {t('s3_leitlinie.copy_127')}
                      </p>
                      <p className="mb-3 text-base font-medium text-heading">
                        {t('vitamin_d3_implantology.copy_089')}
                      </p>
                      <Link
                        to="/igloo-pro"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-strong"
                      >
                        {t('vitamin_d3_implantology.copy_090')}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Spray Solution Section */}
                <section id="spray-section" className="mt-12 scroll-mt-24">
                  <h2 className="mb-6 text-xl font-medium tracking-tight text-heading sm:text-2xl">
                    {t('vitamin_d3_implantology.copy_091')}
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      {t('vitamin_d3_implantology.copy_092')}{' '}
                      <Link
                        to="/diagnostics/dental"
                        className="font-semibold text-accent hover:underline"
                      >
                        {t('vitamin_d3_implantology.copy_093')}
                      </Link>
                      {t('vitamin_d3_implantology.copy_094')}
                    </p>

                    <p>
                      {t('vitamin_d3_implantology.copy_095')}{' '}
                      <span className="whitespace-nowrap font-medium text-heading">
                        {t('vitamin_d3_implantology.copy_096')}
                      </span>{' '}
                      {t('vitamin_d3_implantology.copy_097')}
                    </p>
                  </div>

                  <h3 className="mb-4 mt-10 text-lg font-medium text-heading">
                    {t('vitamin_d3_implantology.copy_098')}
                  </h3>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      {t('vitamin_d3_implantology.copy_099')}{' '}
                      <strong>{t('vitamin_d3_implantology.copy_100')}</strong>{' '}
                      {t('vitamin_d3_implantology.copy_101')}
                    </p>

                    <p>
                      {t('vitamin_d3_implantology.copy_102')}{' '}
                      <strong>{t('vitamin_d3_implantology.copy_103')}</strong>.
                    </p>

                    <p>{t('vitamin_d3_implantology.copy_104')}</p>
                  </div>
                </section>

                {/* Order Form (finale Conversion) */}
                <div className="my-12">
                  <PraxisOrderForm
                    area="Vitamin D3+K2 Spray BESTELLUNG"
                    orderName="Vitamin D3+K2 Spray"
                    messageNoneLabel={t('vitd3spray:order_message_none')}
                    defaultQuantity="10"
                    quantityOptions={[
                      { value: '5', label: t('vitamin_d3_implantology.copy_105') },
                      { value: '10', label: t('vitamin_d3_implantology.copy_106') },
                      { value: '25', label: t('vitamin_d3_implantology.copy_107') },
                      { value: '50', label: t('vitamin_d3_implantology.copy_108') },
                      { value: '100', label: t('vitamin_d3_implantology.copy_109') },
                    ]}
                    texts={{
                      caption: t('vitamin_d3_implantology.copy_100'),
                      title: t('vitamin_d3_implantology.copy_110'),
                      description: t('vitd3spray:order.description'),
                      quantityLabel: t('vitd3spray:order.quantity_label'),
                      addressHeading: t('vitd3spray:order.address_heading'),
                      practiceLabel: t('vitd3spray:order.practice_label'),
                      practicePlaceholder: t('vitd3spray:order.practice_placeholder'),
                      nameLabel: t('vitd3spray:order.name_label'),
                      namePlaceholder: t('vitd3spray:order.name_placeholder'),
                      emailLabel: t('vitd3spray:order.email_label'),
                      emailPlaceholder: t('vitd3spray:order.email_placeholder'),
                      phoneLabel: t('vitd3spray:order.phone_label'),
                      phonePlaceholder: t('vitd3spray:order.phone_placeholder'),
                      messageLabel: t('vitd3spray:order.message_label'),
                      messagePlaceholder: t('vitd3spray:order.message_placeholder'),
                      submit: t('vitd3spray:order.submit'),
                      submitting: t('vitd3spray:order.submitting'),
                      submitNote: t('vitd3spray:order.submit_note'),
                      reassurance: t('vitd3spray:order.reassurance'),
                      errorText: t('vitd3spray:order.error_text'),
                      successTitle: t('vitd3spray:order.success_title'),
                      successText: t('vitd3spray:order.success_text'),
                    }}
                  />
                </div>

                {/* FAQ Section */}
                <section className="mt-12 border-t border-gray-200 pt-10">
                  <h2 className="mb-8 text-xl font-medium tracking-tight text-heading sm:text-2xl">
                    {t('vitamin_d3_implantology.copy_112')}
                  </h2>

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

                {/* Back Link */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                  <Link
                    to="/articles"
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-strong"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    {t('vitamin_d3_implantology.copy_113')}
                  </Link>
                </div>
              </Reveal>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Phone Contact Box */}
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-heading">
                        {t('vitamin_d3_implantology.copy_114')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t('vitamin_d3_implantology.copy_115')}
                      </p>
                    </div>
                  </div>
                  <a
                    href="tel:+4915175011699"
                    className="flex items-center justify-center gap-2 rounded-md bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
                  >
                    <Phone className="h-4 w-4" />
                    +49 151 75011699
                  </a>
                  <p className="mt-2 text-center text-xs text-gray-500">
                    {t('vitamin_d3_implantology.copy_116')}
                  </p>
                </div>

                {/* Quick Order CTA — flaches Teal-Band */}
                <div className="rounded-xl bg-accent-strong p-7 text-white">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    {t('vitamin_d3_implantology.copy_117')}
                  </p>
                  <p className="mb-4 text-sm text-white">{t('vitamin_d3_implantology.copy_118')}</p>
                  <a
                    href="#bestellformular"
                    className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-medium text-brand-deep transition-colors hover:bg-gray-50"
                  >
                    {t('vitamin_d3_implantology.copy_110')}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                {/* Related Articles */}
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-heading">
                    <BookOpen className="h-4 w-4 text-accent" />
                    {t('vitamin_d3_implantology.copy_119')}
                  </p>
                  <div className="space-y-3">
                    <Link
                      to="/igloo-pro"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-heading group-hover:text-accent">
                          {t('s3_leitlinie.copy_182')}
                        </p>
                        <p className="text-xs text-gray-500">{t('s3_leitlinie.copy_183')}</p>
                      </div>
                    </Link>
                    <Link
                      to="/diagnostics/dental"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-heading group-hover:text-accent">
                          {t('s3_leitlinie.copy_184')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t('vitamin_d3_implantology.copy_120')}
                        </p>
                      </div>
                    </Link>
                    <Link
                      to="/articles/die-gruene-praxis"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-heading group-hover:text-accent">
                          {t('vitamin_d3_implantology.copy_121')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t('vitamin_d3_implantology.copy_122')}
                        </p>
                      </div>
                    </Link>
                    <Link
                      to="/s3_leitlinie"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-heading group-hover:text-accent">
                          {t('s3_leitlinie.copy_061')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t('vitamin_d3_implantology.copy_123')}
                        </p>
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
                    {t('vitamin_d3_implantology.copy_124')}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 shadow-lg border-t border-gray-200 bg-white p-4 lg:hidden">
        <a
          href="#bestellformular"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-accent-strong px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:brightness-110"
        >
          {t('vitamin_d3_implantology.copy_125')}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {/* Mobile bottom padding for sticky CTA */}
      <div className="h-20 lg:hidden" />
      <FinalCtaSection roiHref="/#roi-rechner" />
    </PageTransition>
  )
}

export default VitaminD3ImplantologyPage
