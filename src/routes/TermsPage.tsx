import { agbData } from '../data/agbContent'

const TermsPage = () => {
  return (
    <>
      <div className="pt-32 pb-16 lg:pt-48 lg:pb-32 bg-primary text-white">
        <div className="mx-auto max-w-container px-4 text-center lg:px-0">
          <div className="inline-block rounded p-[1px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-2">
            <div className="rounded-sm bg-slate-50 px-3 py-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-900">
                AGB
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl text-white">
            {agbData.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            {agbData.subtitle}
          </p>
          <p className="mt-4 text-sm text-white/60">{agbData.date}</p>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-16 lg:px-0 lg:py-24 prose prose-slate dark:prose-invert">
        {agbData.sections.map((section) => (
          <section key={section.id} id={section.id} className="mb-10">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-3">
              {section.title}
            </h2>
            {section.content.map((paragraph, idx) => (
              <p key={idx} className="text-slate-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </main>
    </>
  )
}

export default TermsPage


