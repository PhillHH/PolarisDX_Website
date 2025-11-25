import SectionHeader from '../ui/SectionHeader'

const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="relative -mx-4 bg-primary py-16 text-white lg:mx-0 lg:rounded-section"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-80 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-80 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

      <div className="relative mx-auto flex max-w-container flex-col gap-12 px-4 lg:px-0">
        <div className="flex flex-col items-center gap-6 text-center">
          <SectionHeader
            caption="Testimoni"
            title="Our Customers & Clients"
          />
          <p className="max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            Sit tincidunt commodo tincidunt. Mattis metus purus quam fames in vitae fringilla
            tempor. Non in in sodales suspendisse egestas integer iaculis semper ultrices.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
          <div className="space-y-6 rounded-2xl bg-white/5 p-8 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/20" />
              <div className="text-left">
                <p className="text-base font-medium">Robert Fox</p>
                <p className="text-sm text-white/70">Happy Patient</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className="text-yellow-400">
                  ★
                </span>
              ))}
            </div>

            <p className="text-center text-sm leading-relaxed text-white/90 sm:text-base">
              “Sit tincidunt commodo tincidunt. Mattis metus purus quam fames in vitae fringilla
              tempor. Non in in sodales suspendisse egestas integer iaculis semper ultrices.
              Lectus dui in pulvinar orci ut fermentum tortor mi, at.”
            </p>

            <div className="flex justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
            </div>
          </div>

          <div className="space-y-6 text-center lg:text-left">
            <div className="flex justify-center gap-10 text-left lg:justify-start">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-medium tracking-tight">4.9</span>
                </div>
                <p className="mt-1 text-sm text-white/80">
                  Overall Rating
                  <br />
                  based on 3500+ reviews
                </p>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-medium tracking-tight">99</span>
                  <span className="text-2xl font-medium text-secondary">%</span>
                </div>
                <p className="mt-1 text-sm text-white/80">Positive Review</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection


