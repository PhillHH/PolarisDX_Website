import PrimaryButton from '../components/ui/PrimaryButton'
import SectionHeader from '../components/ui/SectionHeader'
import { useTranslation } from 'react-i18next'

const ContactPage = () => {
  const { t } = useTranslation('contact')

  return (
    <div className="bg-slate-50 text-gray-900">
      {/* Hero / Top */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

        <div className="relative mx-auto flex min-h-[340px] max-w-[1440px] flex-col justify-end px-4 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
          <div className="max-w-container">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accentBlue">
              {t('contact.hero.kicker')}
            </p>
            <h1 className="mb-3 text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
              {t('contact.hero.title')}
            </h1>
            <p className="text-sm text-white/80 sm:text-base">{t('contact.hero.breadcrumb')}</p>
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <main className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)] lg:items-start">
          {/* Form-Card */}
          <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm lg:p-8">
            <SectionHeader
              caption={t('contact.hero.kicker')}
              title={t('contact.hero.title')}
              align="left"
            />

            {/* Kontakt-Kanäle */}
            <div className="mt-2 flex flex-col gap-4 text-sm text-gray-600 sm:flex-row sm:gap-8">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-secondary">
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
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-secondary">
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
            <form className="mt-4 space-y-5">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {t('contact.form.company_label')}
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  placeholder={t('contact.form.company_placeholder')}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">{t('contact.form.name')}</label>
                  <input
                    type="text"
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                    placeholder={t('contact.form.name_placeholder')}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('contact.form.phone')}
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                    placeholder={t('contact.form.phone_placeholder')}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">{t('contact.form.email')}</label>
                <input
                  type="email"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  placeholder={t('contact.form.email_placeholder')}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {t('contact.form.area_label')}
                </label>
                <select className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40">
                  <option value="pharmacy">{t('contact.form.area_options.pharmacy')}</option>
                  <option value="practice">{t('contact.form.area_options.practice')}</option>
                  <option value="vet">{t('contact.form.area_options.vet')}</option>
                  <option value="lab">{t('contact.form.area_options.lab')}</option>
                  <option value="other">{t('contact.form.area_options.other')}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {t('contact.form.requirements_label')}
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  placeholder={t('contact.form.requirements_placeholder')}
                />
              </div>

              <div className="pt-2">
                <PrimaryButton type="submit" className="w-full justify-center md:w-auto">
                  {t('contact.form.submit')}
                </PrimaryButton>
              </div>
            </form>
          </section>

          {/* Info-Spalte / Desktop-Sidebar */}
          <aside className="space-y-6">
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
          </aside>
        </div>
      </main>
    </div>
  )
}

export default ContactPage
