import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  Phone,
  Download,
  BookOpen,
  FileText,
  Sparkles,
  Shield,
  Leaf,
  Droplet,
  Stethoscope,
  Zap,
  Bone,
  Activity,
  ShieldCheck,
} from 'lucide-react'
import { SEOHead, createBreadcrumbSchema, createFAQSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import SubpageHero from '../components/sections/SubpageHero'
import PraxisOrderForm from '../components/sections/PraxisOrderForm'
import sprayImage from '../assets/VITAMIND_D3_SPRAY.jpg'
import sprayPdfDE from '../assets/downloads/Polaris Vitamin D Spray  A4zuA5_DE_2025-01-20.pdf'
import sprayPdfEN from '../assets/downloads/Polaris Vitamin D Spray  A4zuA5_EN(8).pdf'

const VitaminD3SprayPage = () => {
  const { t, i18n } = useTranslation(['vitd3spray', 'common'])
  const sprayPdf = i18n.language === 'de' ? sprayPdfDE : sprayPdfEN

  const pricingRowsRaw = t('vitd3spray:pricing.rows', { returnObjects: true })
  const pricingRows = Array.isArray(pricingRowsRaw)
    ? (pricingRowsRaw as Array<{ quantity: string; price: string }>)
    : []

  const benefitItemsRaw = t('vitd3spray:benefits.items', { returnObjects: true })
  const benefitItems = Array.isArray(benefitItemsRaw) ? (benefitItemsRaw as string[]) : []

  const benefitTitlesRaw = t('vitd3spray:benefit_titles', { returnObjects: true })
  const benefitTitles = Array.isArray(benefitTitlesRaw) ? (benefitTitlesRaw as string[]) : []
  const benefitIcons = [Bone, Activity, ShieldCheck]

  const heroStatsRaw = t('vitd3spray:hero_stats', { returnObjects: true })
  const heroStats = Array.isArray(heroStatsRaw)
    ? (heroStatsRaw as Array<{ value: string; label: string }>)
    : []

  const visualChipsRaw = t('vitd3spray:visual_chips', { returnObjects: true })
  const visualChips = Array.isArray(visualChipsRaw)
    ? (visualChipsRaw as Array<{ value: string; label: string }>)
    : []

  const statStripRaw = t('vitd3spray:stats', { returnObjects: true })
  const statStrip = Array.isArray(statStripRaw)
    ? (statStripRaw as Array<{ value: string; label: string }>)
    : []

  const trustItems = [
    { icon: Stethoscope, label: t('vitd3spray:trustbar.exclusive') },
    { icon: Leaf, label: t('vitd3spray:badges.vegan') },
    { icon: Shield, label: t('vitd3spray:badges.made_in') },
    { icon: Zap, label: t('vitd3spray:trustbar.bio') },
  ]

  const faqItemsRaw = t('vitd3spray:faq.items', { returnObjects: true })
  const faqItems = Array.isArray(faqItemsRaw)
    ? (faqItemsRaw as Array<{ question: string; answer: string }>)
    : []

  const quantityOptions = Object.entries(
    t('vitd3spray:order.quantity_options', { returnObjects: true }) as Record<string, string>,
  ).map(([value, label]) => ({ value, label }))

  return (
    <PageTransition>
      <SEOHead
        title={t('vitd3spray:seo.title')}
        description={t('vitd3spray:seo.description')}
        ogImage="/og-vitd3-spray.jpg"
        keywords={[
          'Vitamin D3 K2 Spray',
          'Vitamin D3 Praxis',
          'Vitamin D Supplementierung',
          'D3 K2 Sublingualspray',
          'Tiny-Technologie',
          'PolarisDX Vitamin D',
        ]}
        structuredData={[
          createBreadcrumbSchema([
            { name: 'PolarisDX', url: '/' },
            { name: t('vitd3spray:hero.breadcrumb_products'), url: '/downloads' },
            { name: 'Vitamin D3+K2 Spray', url: '/vitamin-d3-spray' },
          ]),
          ...(faqItems.length > 0 ? [createFAQSchema(faqItems)] : []),
        ]}
      />

      <SubpageHero
        breadcrumbs={[
          { label: t('vitd3spray:hero.breadcrumb_home'), href: '/' },
          { label: t('vitd3spray:hero.breadcrumb_current') },
        ]}
        eyebrow={t('vitd3spray:hero.caption')}
        title={t('vitd3spray:hero.title')}
        subtitle={t('vitd3spray:hero.subtitle')}
        primaryCta={{ label: t('vitd3spray:hero.cta'), href: '#bestellformular' }}
        secondaryCta={{ label: t('vitd3spray:hero.download'), href: sprayPdf }}
        chips={[
          t('vitd3spray:badges.vegan'),
          t('vitd3spray:badges.made_in'),
          t('vitd3spray:product.content_value'),
        ]}
        stats={heroStats}
        valueChips={visualChips}
        icon={<Droplet />}
      />

      {/* Trust-Signal-Leiste direkt unter dem Hero */}
      <section
        aria-label={t('vitd3spray:trustbar.aria')}
        className="border-b border-slate-200 bg-slate-50"
      >
        <div className="mx-auto max-w-container px-4 py-7 lg:px-0">
          <ul className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            {trustItems.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2">
                <Icon size={18} className="text-accent" aria-hidden="true" />
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="bg-slate-50">
        {/* Main Content */}
        <div className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">
            {/* Main Column */}
            <div>
              <Reveal width="100%">
                {/* Intro + Product image */}
                <section className="mb-12 grid gap-8 lg:grid-cols-2 lg:items-center">
                  <div>
                    <h2 className="mb-6 text-xl font-medium tracking-tight text-heading sm:text-2xl">
                      {t('vitd3spray:intro.title')}
                    </h2>
                    <div className="space-y-4 text-[17px] leading-[1.75] text-gray-700">
                      <p>{t('vitd3spray:intro.text1')}</p>
                      <p>
                        <strong>{t('vitd3spray:intro.text2')}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <img
                      src={sprayImage}
                      alt="PolarisDX Vitamin D3+K2 Sublingual Spray"
                      width={380}
                      height={500}
                      className="mx-auto max-h-80 w-auto object-contain"
                    />
                  </div>
                </section>

                {/* USP: Tiny Technology */}
                <section className="mb-12 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-medium text-heading">{t('vitd3spray:usp.title')}</h3>
                  </div>
                  <p className="mb-4 text-[15px] leading-relaxed text-gray-700">
                    {t('vitd3spray:usp.text')}
                  </p>
                  <div className="border-t border-slate-100 pt-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">
                      {t('vitd3spray:usp.dosing_label')}
                    </p>
                    <p className="text-[15px] text-gray-800">{t('vitd3spray:usp.dosing_text')}</p>
                    <p className="mt-1 text-sm text-gray-500">{t('vitd3spray:usp.dosing_note')}</p>
                  </div>
                </section>

                {/* Kennzahlen-Streifen */}
                {statStrip.length > 0 && (
                  <section className="mb-12">
                    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-4">
                      {statStrip.map((s) => (
                        <div key={s.label} className="bg-white p-5 text-center">
                          <div className="text-2xl font-medium text-heading sm:text-3xl">
                            {s.value}
                          </div>
                          <div className="mt-1 text-xs leading-snug text-gray-500">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Product Specs */}
                <section className="mb-12">
                  <h2 className="mb-6 text-xl font-medium tracking-tight text-heading sm:text-2xl">
                    {t('vitd3spray:product.title')}
                  </h2>
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    {[
                      {
                        label: t('vitd3spray:product.composition_label'),
                        value: t('vitd3spray:product.composition_value'),
                      },
                      {
                        label: t('vitd3spray:product.form_label'),
                        value: t('vitd3spray:product.form_value'),
                      },
                      {
                        label: t('vitd3spray:product.dosing_label'),
                        value: t('vitd3spray:product.dosing_value'),
                      },
                      {
                        label: t('vitd3spray:product.content_label'),
                        value: t('vitd3spray:product.content_value'),
                      },
                      {
                        label: t('vitd3spray:product.properties_label'),
                        value: t('vitd3spray:product.properties_value'),
                      },
                    ].map((spec, i) => (
                      <div
                        key={i}
                        className={`flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-center sm:gap-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}
                      >
                        <span className="min-w-[200px] text-sm font-medium text-gray-500">
                          {spec.label}
                        </span>
                        <span className="text-[15px] font-medium text-gray-900">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Property Badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[
                      { icon: Leaf, label: t('vitd3spray:badges.vegan') },
                      { icon: Shield, label: t('vitd3spray:badges.made_in') },
                    ].map(({ icon: Icon, label }) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-success-strong"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Health Benefits — reiche Teal-Tint-Karten */}
                <section className="mb-12">
                  <h2 className="mb-6 text-xl font-medium tracking-tight text-heading sm:text-2xl">
                    {t('vitd3spray:benefits.title')}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {benefitItems.map((item, i) => {
                      const Icon = benefitIcons[i] ?? ShieldCheck
                      return (
                        <div
                          key={i}
                          className="rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-card"
                        >
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <Icon className="h-5 w-5" aria-hidden />
                          </span>
                          {benefitTitles[i] && (
                            <h3 className="mt-4 text-base font-medium text-heading">
                              {benefitTitles[i]}
                            </h3>
                          )}
                          <p className="mt-2 text-sm leading-relaxed text-gray-700">{item}</p>
                        </div>
                      )
                    })}
                  </div>
                </section>

                {/* Pricing Table */}
                <section className="mb-12">
                  <h2 className="mb-6 text-xl font-medium tracking-tight text-heading sm:text-2xl">
                    {t('vitd3spray:pricing.title')}
                  </h2>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-5 py-3.5 text-left font-semibold text-gray-900">
                            {t('vitd3spray:pricing.header_quantity')}
                          </th>
                          <th className="px-5 py-3.5 text-left font-semibold text-gray-900">
                            {t('vitd3spray:pricing.header_price')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {pricingRows.map((row, i) => (
                          <tr key={i} className={i === pricingRows.length - 1 ? 'bg-accent/5' : ''}>
                            <td className="px-5 py-3.5 text-gray-700">{row.quantity}</td>
                            <td className="px-5 py-3.5 font-semibold text-gray-900">{row.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* PDF Download CTA */}
                <section className="mb-12">
                  <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:gap-6">
                    <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <FileText className="h-7 w-7" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="font-medium text-heading">
                        {t('vitd3spray:sidebar.download_caption')}
                      </p>
                      <p className="text-sm text-gray-700">
                        {t('vitd3spray:sidebar.download_text')}
                      </p>
                    </div>
                    <a
                      href={sprayPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-strong"
                    >
                      <Download className="h-4 w-4" />
                      {t('vitd3spray:sidebar.download_cta')}
                    </a>
                  </div>
                </section>

                {/* Order Form (finale Conversion) */}
                <div className="mb-12">
                  <PraxisOrderForm
                    area="Vitamin D3+K2 Spray BESTELLUNG"
                    orderName="Vitamin D3+K2 Spray"
                    quantityUnit="Sprays"
                    messageNoneLabel={t('vitd3spray:order_message_none')}
                    defaultQuantity="12"
                    quantityOptions={quantityOptions}
                    texts={{
                      caption: t('vitd3spray:order.caption'),
                      title: t('vitd3spray:order.title'),
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

                {/* FAQ */}
                <section className="mb-12 border-t border-gray-200 pt-10">
                  <h2 className="mb-8 text-xl font-medium tracking-tight text-heading sm:text-2xl">
                    {t('vitd3spray:faq.title')}
                  </h2>
                  <div className="space-y-8">
                    {faqItems.map((faq, i) => (
                      <div key={i}>
                        <h3 className="mb-3 text-base font-semibold text-gray-900">
                          {faq.question}
                        </h3>
                        <p className="text-[15px] leading-relaxed text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Disclaimer */}
                <p className="text-xs text-gray-400">{t('vitd3spray:disclaimer')}</p>

                {/* Back Link */}
                <div className="mt-8 border-t border-gray-200 pt-8">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-strong"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    {t('vitd3spray:back')}
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Phone Contact */}
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {t('vitd3spray:contact.question')}
                      </p>
                      <p className="text-xs text-gray-500">{t('vitd3spray:contact.advice')}</p>
                    </div>
                  </div>
                  <a
                    href="tel:+4915159878599"
                    className="flex items-center justify-center gap-2 rounded-md bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
                  >
                    <Phone className="h-4 w-4" />
                    {t('vitd3spray:contact.phone')}
                  </a>
                  <p className="mt-1 text-center text-xs text-gray-500">
                    {t('vitd3spray:contact.name')} · {t('vitd3spray:contact.hours')}
                  </p>
                </div>

                {/* Quick Order CTA — flaches Teal-Band */}
                <div className="rounded-xl bg-accent p-6 text-white">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                    {t('vitd3spray:sidebar.quick_order_caption')}
                  </p>
                  <p className="mb-4 text-sm text-white/90">
                    {t('vitd3spray:sidebar.quick_order_text')}
                  </p>
                  <a
                    href="#bestellformular"
                    className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-medium text-brand-deep transition-colors hover:bg-gray-50"
                  >
                    {t('vitd3spray:sidebar.quick_order_cta')}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                {/* PDF Download */}
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="mb-2 text-sm font-semibold text-gray-900">
                    {t('vitd3spray:sidebar.download_caption')}
                  </p>
                  <p className="mb-4 text-xs text-gray-500">
                    {t('vitd3spray:sidebar.download_text')}
                  </p>
                  <a
                    href={sprayPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-accent hover:text-accent"
                  >
                    <Download className="h-4 w-4" />
                    {t('vitd3spray:sidebar.download_cta')}
                  </a>
                </div>

                {/* Related */}
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <BookOpen className="h-4 w-4 text-accent" />
                    {t('vitd3spray:related.title')}
                  </p>
                  <div className="space-y-3">
                    <Link
                      to="/vitamin-d3-implantologie"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-accent">
                          {t('vitd3spray:related.implantology_title')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t('vitd3spray:related.implantology_desc')}
                        </p>
                      </div>
                    </Link>
                    <Link
                      to="/igloo-pro"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-accent">
                          {t('vitd3spray:related.igloo_title')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t('vitd3spray:related.igloo_desc')}
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Trust */}
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <p className="text-xs text-gray-500">{t('vitd3spray:sidebar.trust')}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white p-4 shadow-lg lg:hidden">
        <a
          href="#bestellformular"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-accent-strong"
        >
          {t('vitd3spray:mobile_cta')}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-20 lg:hidden" />
    </PageTransition>
  )
}

export default VitaminD3SprayPage
