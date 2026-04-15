import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowRight,
  ChevronRight,
  Send,
  CheckCircle,
  Phone,
  Download,
  BookOpen,
  FileText,
  Sparkles,
  Shield,
  Leaf,
} from 'lucide-react'
import { SEOHead, createBreadcrumbSchema, createFAQSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import sprayImage from '../assets/VITAMIND_D3_SPRAY.jpg'
import sprayPdfDE from '../assets/downloads/Polaris Vitamin D Spray  A4zuA5_DE_2025-01-20.pdf'
import sprayPdfEN from '../assets/downloads/Polaris Vitamin D Spray  A4zuA5_EN(8).pdf'
import { sendContactEmail } from '../api/contact'

const VitaminD3SprayPage = () => {
  const { t, i18n } = useTranslation(['vitd3spray', 'common'])
  const sprayPdf = i18n.language === 'de' ? sprayPdfDE : sprayPdfEN

  const [formData, setFormData] = useState({
    praxisName: '',
    ansprechpartner: '',
    email: '',
    phone: '',
    quantity: '12',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const pricingRowsRaw = t('vitd3spray:pricing.rows', { returnObjects: true })
  const pricingRows = Array.isArray(pricingRowsRaw) ? pricingRowsRaw as Array<{ quantity: string; price: string }> : []

  const benefitItemsRaw = t('vitd3spray:benefits.items', { returnObjects: true })
  const benefitItems = Array.isArray(benefitItemsRaw) ? benefitItemsRaw as string[] : []

  const faqItemsRaw = t('vitd3spray:faq.items', { returnObjects: true })
  const faqItems = Array.isArray(faqItemsRaw) ? faqItemsRaw as Array<{ question: string; answer: string }> : []

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

      <div className="bg-slate-50">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-deep to-gray-900 text-white">
          <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

          <div className="relative mx-auto max-w-page px-4 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
                {/* Text */}
                <div className="flex-1">
                  <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
                    <Link to="/" className="hover:text-brand-secondary transition-colors">
                      {t('vitd3spray:hero.breadcrumb_home')}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="text-white/80">{t('vitd3spray:hero.breadcrumb_current')}</span>
                  </nav>

                  <p className="mb-4 text-xs font-semibold uppercase tracking-[1.2px] text-brand-secondary">
                    {t('vitd3spray:hero.caption')}
                  </p>

                  <h1 className="mb-5 text-2xl font-medium tracking-tight sm:text-3xl lg:text-[2.5rem] lg:leading-[1.15]">
                    {t('vitd3spray:hero.title')}
                  </h1>

                  <p className="mb-8 text-base text-white/80 sm:text-lg lg:text-xl">
                    {t('vitd3spray:hero.subtitle')}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href="#bestellformular"
                      className="inline-flex items-center gap-2 rounded-md bg-brand-secondary px-6 py-3 text-sm font-semibold text-brand-deep transition-colors hover:bg-brand-secondary/90"
                    >
                      {t('vitd3spray:hero.cta')}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <a
                      href={sprayPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      <Download className="h-4 w-4" />
                      {t('vitd3spray:hero.download')}
                    </a>
                  </div>
                </div>

                {/* Product Image */}
                <div className="w-full max-w-sm lg:w-[380px]">
                  <img
                    src={sprayImage}
                    alt="PolarisDX Vitamin D3+K2 Sublingual Spray"
                    width={380}
                    height={500}
                    className="rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-[1200px] px-4 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">
            {/* Main Column */}
            <div>
              <Reveal width="100%">
                {/* Intro */}
                <section className="mb-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    {t('vitd3spray:intro.title')}
                  </h2>
                  <div className="space-y-4 text-[17px] leading-[1.75] text-gray-700">
                    <p>{t('vitd3spray:intro.text1')}</p>
                    <p>
                      <strong>{t('vitd3spray:intro.text2')}</strong>
                    </p>
                  </div>
                </section>

                {/* USP: Tiny Technology */}
                <section className="mb-12 rounded-xl border border-sky-200 bg-sky-50/50 p-6 sm:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">
                      <Sparkles className="h-5 w-5 text-sky-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{t('vitd3spray:usp.title')}</h3>
                  </div>
                  <p className="mb-4 text-[15px] leading-relaxed text-gray-700">{t('vitd3spray:usp.text')}</p>
                  <div className="border-t border-sky-200 pt-4">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-sky-700">
                      {t('vitd3spray:usp.dosing_label')}
                    </p>
                    <p className="text-[15px] text-gray-800">{t('vitd3spray:usp.dosing_text')}</p>
                    <p className="mt-1 text-sm text-gray-500">{t('vitd3spray:usp.dosing_note')}</p>
                  </div>
                </section>

                {/* Product Specs */}
                <section className="mb-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    {t('vitd3spray:product.title')}
                  </h2>
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    {[
                      { label: t('vitd3spray:product.composition_label'), value: t('vitd3spray:product.composition_value') },
                      { label: t('vitd3spray:product.form_label'), value: t('vitd3spray:product.form_value') },
                      { label: t('vitd3spray:product.dosing_label'), value: t('vitd3spray:product.dosing_value') },
                      { label: t('vitd3spray:product.content_label'), value: t('vitd3spray:product.content_value') },
                      { label: t('vitd3spray:product.properties_label'), value: t('vitd3spray:product.properties_value') },
                    ].map((spec, i) => (
                      <div
                        key={i}
                        className={`flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-center sm:gap-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}
                      >
                        <span className="min-w-[200px] text-sm font-medium text-gray-500">{spec.label}</span>
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
                        className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Health Benefits */}
                <section className="mb-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    {t('vitd3spray:benefits.title')}
                  </h2>
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <ul className="space-y-3">
                      {benefitItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-gray-700">
                          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* Pricing Table */}
                <section className="mb-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    {t('vitd3spray:pricing.title')}
                  </h2>
                  <div className="overflow-hidden rounded-xl border border-gray-200">
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
                          <tr key={i} className={i === pricingRows.length - 1 ? 'bg-brand-primary/5' : ''}>
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
                  <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-6 sm:flex-row sm:gap-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-50">
                      <FileText className="h-7 w-7 text-red-500" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="font-semibold text-gray-900">{t('vitd3spray:sidebar.download_caption')}</p>
                      <p className="text-sm text-gray-500">{t('vitd3spray:sidebar.download_text')}</p>
                    </div>
                    <a
                      href={sprayPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
                    >
                      <Download className="h-4 w-4" />
                      {t('vitd3spray:sidebar.download_cta')}
                    </a>
                  </div>
                </section>

                {/* Order Form */}
                <section id="bestellformular" className="mb-12 scroll-mt-24">
                  <div className="rounded-xl border-2 border-brand-primary/20 bg-white p-6 shadow-lg sm:p-8">
                    <div className="mb-6">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-primary">
                        {t('vitd3spray:order.caption')}
                      </p>
                      <h3 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                        {t('vitd3spray:order.title')}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">{t('vitd3spray:order.description')}</p>
                    </div>

                    {submitStatus === 'success' ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <CheckCircle className="mb-4 h-12 w-12 text-green-500" />
                        <h4 className="mb-2 text-lg font-semibold text-gray-900">
                          {t('vitd3spray:order.success_title')}
                        </h4>
                        <p className="text-sm text-gray-600">{t('vitd3spray:order.success_text')}</p>
                      </div>
                    ) : (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault()
                          setIsSubmitting(true)
                          setSubmitStatus('idle')

                          const success = await sendContactEmail({
                            name: formData.ansprechpartner,
                            email: formData.email,
                            phone: formData.phone,
                            company: formData.praxisName,
                            area: 'Vitamin D3+K2 Spray BESTELLUNG',
                            message: `BESTELLUNG Vitamin D3+K2 Spray\n\nMenge: ${formData.quantity} Sprays\n\nLieferadresse:\n${formData.praxisName}\n${formData.ansprechpartner}\n\nAnmerkungen:\n${formData.message || t('vitd3spray:order_message_none')}`,
                          })

                          setIsSubmitting(false)
                          setSubmitStatus(success ? 'success' : 'error')
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-gray-700">
                            {t('vitd3spray:order.quantity_label')} *
                          </label>
                          <select
                            id="quantity"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm font-medium focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                          >
                            {Object.entries(
                              t('vitd3spray:order.quantity_options', { returnObjects: true }) as Record<string, string>
                            ).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                          <p className="mb-3 text-sm font-medium text-gray-900">
                            {t('vitd3spray:order.address_heading')}
                          </p>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="praxisName" className="mb-1 block text-sm text-gray-600">
                                {t('vitd3spray:order.practice_label')} *
                              </label>
                              <input
                                type="text"
                                id="praxisName"
                                required
                                value={formData.praxisName}
                                onChange={(e) => setFormData({ ...formData, praxisName: e.target.value })}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                placeholder={t('vitd3spray:order.practice_placeholder')}
                              />
                            </div>
                            <div>
                              <label htmlFor="ansprechpartner" className="mb-1 block text-sm text-gray-600">
                                {t('vitd3spray:order.name_label')} *
                              </label>
                              <input
                                type="text"
                                id="ansprechpartner"
                                required
                                value={formData.ansprechpartner}
                                onChange={(e) => setFormData({ ...formData, ansprechpartner: e.target.value })}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                placeholder={t('vitd3spray:order.name_placeholder')}
                              />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <label htmlFor="email" className="mb-1 block text-sm text-gray-600">
                                  {t('vitd3spray:order.email_label')} *
                                </label>
                                <input
                                  type="email"
                                  id="email"
                                  required
                                  value={formData.email}
                                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                  placeholder={t('vitd3spray:order.email_placeholder')}
                                />
                              </div>
                              <div>
                                <label htmlFor="phone" className="mb-1 block text-sm text-gray-600">
                                  {t('vitd3spray:order.phone_label')}
                                </label>
                                <input
                                  type="tel"
                                  id="phone"
                                  value={formData.phone}
                                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                  placeholder={t('vitd3spray:order.phone_placeholder')}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="message" className="mb-1 block text-sm text-gray-600">
                            {t('vitd3spray:order.message_label')}
                          </label>
                          <textarea
                            id="message"
                            rows={2}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                            placeholder={t('vitd3spray:order.message_placeholder')}
                          />
                        </div>

                        {submitStatus === 'error' && (
                          <p className="text-sm text-red-600">{t('vitd3spray:order.error_text')}</p>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            t('vitd3spray:order.submitting')
                          ) : (
                            <>
                              {t('vitd3spray:order.submit')}
                              <Send className="h-4 w-4" />
                            </>
                          )}
                        </button>

                        <p className="text-center text-xs text-gray-500">{t('vitd3spray:order.submit_note')}</p>
                      </form>
                    )}
                  </div>
                </section>

                {/* FAQ */}
                <section className="mb-12 border-t border-gray-200 pt-10">
                  <h2 className="mb-8 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    {t('vitd3spray:faq.title')}
                  </h2>
                  <div className="space-y-8">
                    {faqItems.map((faq, i) => (
                      <div key={i}>
                        <h3 className="mb-3 text-base font-semibold text-gray-900">{faq.question}</h3>
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
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
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
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10">
                      <Phone className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t('vitd3spray:contact.question')}</p>
                      <p className="text-xs text-gray-500">{t('vitd3spray:contact.advice')}</p>
                    </div>
                  </div>
                  <a
                    href="tel:+4915159878599"
                    className="flex items-center justify-center gap-2 rounded-md bg-brand-primary/10 px-4 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/20"
                  >
                    <Phone className="h-4 w-4" />
                    {t('vitd3spray:contact.phone')}
                  </a>
                  <p className="mt-1 text-center text-xs text-gray-500">
                    {t('vitd3spray:contact.name')} · {t('vitd3spray:contact.hours')}
                  </p>
                </div>

                {/* Quick Order CTA */}
                <div className="rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep p-5 text-white">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-secondary">
                    {t('vitd3spray:sidebar.quick_order_caption')}
                  </p>
                  <p className="mb-4 text-sm">{t('vitd3spray:sidebar.quick_order_text')}</p>
                  <a
                    href="#bestellformular"
                    className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-brand-deep transition-colors hover:bg-gray-50"
                  >
                    {t('vitd3spray:sidebar.quick_order_cta')}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                {/* PDF Download */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="mb-2 text-sm font-semibold text-gray-900">{t('vitd3spray:sidebar.download_caption')}</p>
                  <p className="mb-4 text-xs text-gray-500">{t('vitd3spray:sidebar.download_text')}</p>
                  <a
                    href={sprayPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-md border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
                  >
                    <Download className="h-4 w-4" />
                    {t('vitd3spray:sidebar.download_cta')}
                  </a>
                </div>

                {/* Related */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <BookOpen className="h-4 w-4 text-brand-primary" />
                    {t('vitd3spray:related.title')}
                  </p>
                  <div className="space-y-3">
                    <Link
                      to="/vitamin-d3-implantologie"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-brand-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-brand-primary">
                          {t('vitd3spray:related.implantology_title')}
                        </p>
                        <p className="text-xs text-gray-500">{t('vitd3spray:related.implantology_desc')}</p>
                      </div>
                    </Link>
                    <Link
                      to="/igloo-pro"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-brand-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-brand-primary">
                          {t('vitd3spray:related.igloo_title')}
                        </p>
                        <p className="text-xs text-gray-500">{t('vitd3spray:related.igloo_desc')}</p>
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
          className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg"
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
