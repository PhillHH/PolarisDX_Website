import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import IglooWidgetSection from '../components/sections/IglooWidgetSection'
import DoctorsSection from '../components/sections/DoctorsSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'
import BlogSection from '../components/sections/BlogSection'

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <main className="mx-auto flex max-w-container flex-col gap-16 px-4 pt-24 lg:px-0 lg:gap-16 lg:pt-16">
        <AboutSection />
        <IglooWidgetSection />
        <DoctorsSection />
      </main>

      {/* Testimonials section is po be full-width */}
      <div className="mt-32 lg:mt-32">
        <TestimonialsSection />
      </div>

      <main className="mx-auto flex max-w-container flex-col gap-32 px-4 py-32 lg:px-0 lg:gap-32 lg:py-32">
        <BlogSection />
      </main>
    </>
  )
}

export default HomePage
