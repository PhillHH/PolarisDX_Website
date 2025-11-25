import { Link } from 'react-router-dom'
import SectionHeader from '../components/ui/SectionHeader'
import PrimaryButton from '../components/ui/PrimaryButton'

const ContactPage = () => {
  return (
    <div className="bg-slate-50 text-gray-900">
      {/* Hero / Top */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

        <div className="relative mx-auto flex min-h-[340px] max-w-[1440px] flex-col justify-end px-4 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
          <div className="max-w-container">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accentBlue">
              Appointment
            </p>
            <h1 className="mb-3 text-[40px] leading-[47px] font-medium tracking-[-0.02em] sm:text-[48px] sm:leading-[58px] lg:text-[58px] lg:leading-[69px]">
              Make Appointment
            </h1>
            <p className="text-sm text-white/80 sm:text-base">
              Home / Contact Us
            </p>
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <main className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.3fr)] lg:items-start">
          {/* Form-Card */}
          <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm lg:p-8">
            <SectionHeader
              caption="Appointment"
              title="Book Appointment"
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
                    Email
                  </p>
                  <p>medhealth@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/20 text-secondary">
                  ☎
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
                    Phone
                  </p>
                  <p>+123 456 789</p>
                </div>
              </div>
            </div>

            {/* Formular */}
            <form className="mt-4 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Medical Specialties
                  </label>
                  <select className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40">
                    <option>General Check-up</option>
                    <option>Internal Medicine</option>
                    <option>Dental</option>
                    <option>Emergency</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Doctor
                  </label>
                  <select className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40">
                    <option>Any available doctor</option>
                    <option>Dr. Amelia Carter</option>
                    <option>Dr. Robert Fox</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Select Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                    placeholder="+123 456 789"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  placeholder="Tell us more about your needs..."
                />
              </div>

              <div className="pt-2">
                <PrimaryButton type="submit" className="w-full justify-center md:w-auto">
                  Make Appointment
                </PrimaryButton>
              </div>
            </form>
          </section>

          {/* Info-Spalte / Desktop-Sidebar */}
          <aside className="space-y-6">
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">
                Contact Information
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Our team will get back to you within one business day. For urgent
                questions, please use the phone number below.
              </p>
              <div className="mt-4 space-y-1 text-sm text-gray-800">
                <p>medhealth@gmail.com</p>
                <p>+123 456 789</p>
              </div>
            </section>
          </aside>
        </div>

        {/* Abschluss-CTA wie Figma-Card */}
        <section className="mt-12 rounded-section bg-secondary px-6 py-10 text-white lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] lg:items-center">
            <div className="space-y-4">
              <h2 className="text-[40px] leading-[47px] font-medium tracking-[-0.02em] lg:text-[48px] lg:leading-[57px]">
                Looking for professional &amp; trusted medical healthcare?
              </h2>
              <p className="text-sm leading-[32px] text-white/90 sm:text-base">
                Don&apos;t hesitate to contact us. Our coordinators are ready to help you
                choose the right doctor and time.
              </p>
              <PrimaryButton as={Link} to="/contact" variant="secondary">
                Make Appointment
              </PrimaryButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ContactPage


