import { Link } from 'react-router-dom'
import PrimaryButton from '../ui/PrimaryButton'

const CtaSection = () => {
  return (
    <section
      id="contact"
      className="overflow-hidden rounded-section bg-secondary px-4 py-12 text-white lg:px-10 lg:py-16"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Looking for professional and reliable diagnostic solutions?
          </h2>
          <p className="text-sm leading-relaxed text-white/90 sm:text-base">
            Contact us for a non-binding consultation and discover the ideal POCT-solution for your needs.
          </p>
          <PrimaryButton as={Link} to="/contact" variant="secondary">
            Request a consultation
          </PrimaryButton>
        </div>

        <div className="relative mx-auto max-w-xs">
          <div className="absolute -left-6 bottom-4 top-10 w-56 rounded-3xl bg-white/10" />
          <div className="relative flex h-64 flex-col justify-between overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/20 via-secondary/40 to-primary/40 p-6 shadow-2xl">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                Expert advice
              </p>
              <p className="mt-2 text-lg font-medium text-white">
                Our specialists are ready to answer your questions about our POCT-systems.
              </p>
            </div>
            <div className="text-sm text-white/90">
              <p>+49 (0) 123 456 7890</p>
              <p className="text-white/70">Response within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaSection


