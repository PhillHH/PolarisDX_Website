import { Link } from 'react-router-dom'
import PrimaryButton from '../ui/PrimaryButton'
import heroDoctor from '../../assets/hero_doctor.png'

const CtaSection = () => {
  return (
    <section
      id="contact"
      className="overflow-hidden rounded-3xl bg-secondary px-6 py-6 text-white shadow-xl shadow-black/10 sm:px-8 sm:py-8 lg:px-10 lg:py-8"
    >
      <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
        {/* Bild links */}
        <div className="relative mx-auto h-40 w-40 max-w-full sm:h-48 sm:w-48">
          <div className="absolute inset-0 rounded-3xl bg-white/10" />
          <img
            src={heroDoctor}
            alt="Doctor ready to help"
            className="relative h-full w-full object-cover"
          />
        </div>

        {/* Text rechts */}
        <div className="space-y-4 text-center lg:text-left">
          <h2 className="text-2xl font-medium leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            Looking for professional &amp; trusted{' '}
            <span className="font-semibold">medical healthcare?</span>
          </h2>
          <p className="text-sm leading-relaxed text-white/90 sm:text-base">
            Don&apos;t hesitate to contact us. Our team is ready to support you and help schedule
            the right appointment.
          </p>
          <PrimaryButton as={Link} to="/contact" variant="secondary">
            Make Appointment
          </PrimaryButton>
        </div>
      </div>
    </section>
  )
}

export default CtaSection
