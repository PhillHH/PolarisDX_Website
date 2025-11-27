import { socialLinks } from '../../data/social'
import logo from '../../assets/polarisdx_logo.png'
import CtaSection from '../sections/CtaSection'

const Footer = () => {
  return (
    <footer className="mt-24 bg-primary text-white lg:mt-32">
      <div className="relative">
        {/* CTA-Karte in Content-Breite, die in den Footer hineinragt */}
        <div className="mx-auto max-w-container px-4 lg:px-0">
          <div className="-translate-y-1/2">
            <CtaSection />
          </div>
        </div>

        {/* Footer-Inhalte, mit zusätzlichem Padding oben für die überlagernde Karte */}
        <div className="mx-auto flex max-w-container flex-col gap-10 px-4 pb-12 pt-20 lg:flex-row lg:justify-between lg:px-0 lg:pb-16 lg:pt-24">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="PolarisDX logo"
                className="h-10 w-auto sm:h-12"
              />
            </div>
            <p className="max-w-sm text-sm text-white/70">
              Care and compassion provided in bulk. Modern healthcare services for you and your
              family, 24/7.
            </p>
            <p className="text-sm text-white/60">
              2022 Medhealth – All rights reserved
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-8 text-sm lg:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-tight">Links</h3>
              <ul className="space-y-2 text-white/70">
                <li><a href="#hero" className="hover:text-secondary">Home</a></li>
                <li><a href="#about" className="hover:text-secondary">About</a></li>
                <li><a href="#services" className="hover:text-secondary">Service</a></li>
                <li><a href="#blog" className="hover:text-secondary">Blog</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-tight">Explore</h3>
              <ul className="space-y-2 text-white/70">
                <li><a href="#doctors" className="hover:text-secondary">Our Doctors</a></li>
                <li><a href="#testimonials" className="hover:text-secondary">Testimonials</a></li>
                <li><a href="#faq" className="hover:text-secondary">FAQ</a></li>
                <li><a href="/contact" className="hover:text-secondary">Make Appointment</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold tracking-tight">Contact</h3>
              <div className="space-y-1 text-sm text-white/80">
                <p>medhealth@gmail.com</p>
                <p>+123 456 789</p>
              </div>
              <div className="mt-2 flex gap-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-secondary hover:text-primary"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

