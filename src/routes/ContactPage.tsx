import PrimaryButton from '../components/ui/PrimaryButton'
import SectionHeader from '../components/ui/SectionHeader'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { sendContactEmail } from '../api/contact'
import type { ContactFormData } from '../api/contact'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

const ContactPage = () => {
  const { t } = useTranslation('contact')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    const formData = new FormData(e.currentTarget)

    const company = formData.get('company')
    const name = formData.get('name')
    const phone = formData.get('phone')
    const email = formData.get('email')
    const area = formData.get('area')
    const requirements = formData.get('requirements')

    if (
      typeof company !== 'string' ||
      typeof name !== 'string' ||
      typeof phone !== 'string' ||
      typeof email !== 'string' ||
      typeof area !== 'string' ||
      typeof requirements !== 'string'
    ) {
      console.error('Invalid form data types')
      setSubmitStatus('error')
      setIsSubmitting(false)
      return
    }

    const data: ContactFormData = {
      company,
      name,
      phone,
      email,
      area,
      requirements,
      // Mapping requirements to message if needed or keeping separate
      message: requirements
    }

    const success = await sendContactEmail(data)

    setIsSubmitting(false)
    if (success) {
      setSubmitStatus('success')
      e.currentTarget.reset()
    } else {
      setSubmitStatus('error')
    }
  }

  return (
    <PageTransition>
      <div className="bg-slate-50 text-gray-900">
        {/* Hero / Top */}
        <section className="relative overflow-hidden bg-brand-primary text-white">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

          <div className="relative mx-auto flex min-h-[340px] max-w-page flex-col justify-end px-4 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <div className="max-w-container">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accentBlue">
                  {t('contact.hero.kicker')}
                </p>
                <h1 className="mb-3 text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
                  {t('contact.hero.title')}
                </h1>
                <p className="text-sm text-white/80 sm:text-base">{t('contact.hero.breadcrumb')}</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Form + Info */}
        <div className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)] lg:items-start">
            {/* Form-Card */}
            <Reveal width="100%">
              <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm lg:p-8">
                <SectionHeader
                  caption={t('contact.hero.kicker')}
                  title={t('contact.hero.title')}
                  align="left"
                />

            {/* Kontakt-Kanäle */}
            <div className="mt-2 flex flex-col gap-4 text-sm text-gray-600 sm:flex-row sm:gap-8">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-secondary/20 text-brand-secondary">
                  ✉
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                    {t('contact.info.email_label')}
                  </p>
                  <p>contact@polarisdx.net</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-secondary/20 text-brand-secondary">
                  ☎
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                    {t('contact.info.phone_label')}
                  </p>
                  <p>+49 151 75011699</p>
                </div>
              </div>
            </div>

            {/* Formular */}
            <form className="mt-4 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  {t('contact.form.company_label')}
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  required
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/40"
                  placeholder={t('contact.form.company_placeholder')}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('contact.form.name')}</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/40"
                    placeholder={t('contact.form.name_placeholder')}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    {t('contact.form.phone')}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/40"
                    placeholder={t('contact.form.phone_placeholder')}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('contact.form.email')}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/40"
                  placeholder={t('contact.form.email_placeholder')}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                  {t('contact.form.area_label')}
                </label>
                <select
                  id="area"
                  name="area"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/40"
                >
                  <option value="pharmacy">{t('contact.form.area_options.pharmacy')}</option>
                  <option value="practice">{t('contact.form.area_options.practice')}</option>
                  <option value="vet">{t('contact.form.area_options.vet')}</option>
                  <option value="lab">{t('contact.form.area_options.lab')}</option>
                  <option value="other">{t('contact.form.area_options.other')}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                  {t('contact.form.requirements_label')}
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  rows={4}
                  required
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/40"
                  placeholder={t('contact.form.requirements_placeholder')}
                />
              </div>

              {submitStatus === 'success' && (
                <div className="rounded bg-green-50 p-3 text-sm text-green-700">
                  {t('contact.form.success', 'Vielen Dank! Ihre Nachricht wurde gesendet.')}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="rounded bg-red-50 p-3 text-sm text-red-700">
                  {t('contact.form.error', 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.')}
                </div>
              )}

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      required
                      className="h-4 w-4 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary"
                    />
                  </div>
                  <label htmlFor="consent" className="text-sm text-gray-600">
                    {t('contact.form.consent', 'Ich stimme zu, dass meine Angaben zur Kontaktaufnahme und für Rückfragen bis zu 12 Monate gespeichert werden.')}
                  </label>
                </div>

                <PrimaryButton type="submit" className="w-full justify-center md:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? 'Sende...' : t('contact.form.submit')}
                </PrimaryButton>
              </div>
            </form>
          </section>
          </Reveal>

          {/* Info-Spalte / Desktop-Sidebar */}
          <aside className="space-y-6">
            <Reveal width="100%" delay={0.2}>
              <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                  {t('contact.info.title')}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {t('contact.info.text')}
                </p>
                <div className="mt-4 space-y-1 text-sm text-gray-800">
                  <p>contact@polarisdx.net</p>
                  <p>+49 151 75011699</p>
                </div>
              </section>
            </Reveal>
          </aside>
        </div>
      </div>
      </div>
    </PageTransition>
  )
}

export default ContactPage
