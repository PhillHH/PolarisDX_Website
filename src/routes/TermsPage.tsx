import { useTranslation } from 'react-i18next'
import { SEOHead } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

interface AgbSection {
  id: string;
  title: string;
  content: string[];
}

const TermsPage = () => {
  const { t } = useTranslation('legal')
  const sections = t('agb.sections', { returnObjects: true }) as AgbSection[]

  return (
    <PageTransition>
      <SEOHead
        title={t('agb.seo.title', 'Allgemeine Geschäftsbedingungen (AGB)')}
        description={t('agb.seo.description', 'Allgemeine Geschäftsbedingungen der Polaris Diagnostics Europe UG für den Verkauf von POC-Diagnostik Produkten.')}
        noindex={true}
      />
      <div className="pt-32 pb-16 lg:pt-48 lg:pb-32 bg-brand-primary text-white">
        <div className="mx-auto max-w-container px-4 text-center lg:px-0">
          <Reveal width="100%" yOffset={20}>
            <div className="flex justify-center">
              <div className="inline-block rounded p-px bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-2">
                <div className="rounded-sm bg-slate-50 px-3 py-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-900">
                    {t('agb.title', 'AGB')}
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl text-white">
              {t('agb.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
              {t('agb.subtitle')}
            </p>
            <p className="mt-4 text-sm text-white/60">{t('agb.date')}</p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto max-w-container px-4 py-16 lg:px-0 lg:py-24">
        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          {/* Main Content - Left side on desktop */}
          <div className="lg:col-span-3 prose prose-slate max-w-none dark:prose-invert">
            <Reveal width="100%">
              {Array.isArray(sections) && sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="mb-10 scroll-mt-32"
                >
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-3">
                    {section.title}
                  </h2>
                  {Array.isArray(section.content) && section.content.map((paragraph, idx) => (
                    <p key={idx} className="text-slate-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </Reveal>
          </div>

          {/* Sidebar - Right side */}
          <aside className="hidden lg:block lg:col-span-1">
             <Reveal width="100%" delay={0.2}>
               <div className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
                 <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-4 border-b pb-2">
                   Inhalt
                 </h3>
                 <nav className="flex flex-col space-y-2">
                   {Array.isArray(sections) && sections.map((section) => (
                     <a
                       key={section.id}
                       href={`#${section.id}`}
                       className="text-sm text-slate-600 hover:text-brand-primary hover:translate-x-1 transition-all block truncate"
                       title={section.title}
                     >
                       {section.title}
                     </a>
                   ))}
                 </nav>
               </div>
             </Reveal>
          </aside>
        </div>
      </div>
    </PageTransition>
  )
}

export default TermsPage
