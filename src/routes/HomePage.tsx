import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import IglooWidgetSection from '../components/sections/IglooWidgetSection'
import DoctorsSection from '../components/sections/DoctorsSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import BlogSection from '../components/sections/BlogSection'
import Reveal from '../components/ui/Reveal'

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <main className="mx-auto flex max-w-container flex-col gap-16 px-4 pt-16 lg:px-0 lg:gap-16 lg:pt-8">
        <Reveal width="100%">
          <AboutSection />
        </Reveal>
        <Reveal width="100%">
          <IglooWidgetSection />
        </Reveal>
        <Reveal width="100%">
          <DoctorsSection />
        </Reveal>
      </main>

      {/* Testimonials section is po be full-width */}
      <div className="mt-32 lg:mt-32">
        <Reveal width="100%">
          <TestimonialsSection />
        </Reveal>
      </div>

      <main className="mx-auto flex max-w-container flex-col gap-32 px-4 py-32 lg:px-0 lg:gap-32 lg:py-32">
        <Reveal width="100%">
          <BlogSection />
        </Reveal>
      </main>
    </>
  )
}

export default HomePage
