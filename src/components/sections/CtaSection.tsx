import { Link } from 'react-router-dom'
import PrimaryButton from '../ui/PrimaryButton'
import avatar from '../../assets/avatar.png'

const CtaSection = () => {
  return (
    <section
      id="contact"
      className="relative mt-52 rounded-3xl bg-secondary px-6 py-6 text-white shadow-xl shadow-black/10 sm:px-8 sm:py-8 lg:px-10 lg:py-8"
    >
      <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
        {/* Bild links */}
        <div className="relative mx-auto lg:h-full lg:w-full">
          <img
            src={avatar}
            alt="Doctor ready to help"
            className="mx-auto w-48 sm:w-64 lg:absolute lg:bottom-[-32px] lg:left-0 lg:w-80 lg:max-w-none xl:w-96"
          />
        </div>

        {/* Text rechts */}
        <div className="space-y-4 text-center lg:text-left">
          <h2 className="text-2xl font-medium leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            Sie suchen nach garantierter Performance und POC-Expertise?
          </h2>
          <p className="text-sm leading-relaxed text-white/90 sm:text-base">
            Sprechen Sie direkt mit unseren IglooPro-Spezialisten. Unser Team ist bereit, Ihre
            individuellen Workflow-Anforderungen zu analysieren und Ihnen den schnellsten Weg zur
            validierten Diagnostik zu zeigen. Bei uns erhalten Sie eine maßgeschneiderte Lösung,
            keine Standard-Lieferung.
          </p>
          <PrimaryButton as={Link} to="/contact" variant="secondary">
            Jetzt Experten-Analyse buchen
          </PrimaryButton>
        </div>
      </div>
    </section>
  )
}

export default CtaSection
