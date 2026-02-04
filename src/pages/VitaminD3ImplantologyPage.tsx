import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { SEOHead, createArticleSchema, createBreadcrumbSchema, createFAQSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

const VitaminD3ImplantologyPage = () => {
  // FAQ data for schema and rendering
  const faqItems = [
    {
      question: 'Beeinflusst Vitamin-D-Mangel die Implantateinheilung?',
      answer:
        'Ja. Aktuelle systematische Reviews zeigen, dass Vitamin-D-Mangel mit einem bis zu vierfach erhöhten Risiko für frühe Implantatverluste assoziiert ist. Präoperative D3-Supplementierung verbesserte in Studien die Osseointegration und den Knochen-Implantat-Kontakt – auch bei Hochrisikopatienten.',
    },
    {
      question: 'Warum D3 zusammen mit K2 supplementieren?',
      answer:
        'Vitamin K2 steuert die Calcium-Verwertung im Körper: Es aktiviert Osteocalcin, das Calcium in die Knochenmatrix einlagert, und Matrix-GLA-Protein, das Calcium-Ablagerungen in Weichgewebe verhindert. Gerade bei implantologischen Patienten, bei denen gezielte Knochenbildung erwünscht ist, ist die Kombination D3+K2 physiologisch sinnvoll.',
    },
    {
      question: 'Wie häufig ist Vitamin-D-Mangel in Deutschland?',
      answer:
        'Laut RKI-Daten sind rund 30 % der Erwachsenen in Deutschland mangelhaft mit Vitamin D versorgt (unter 30 nmol/l). Nur etwa 38 % erreichen eine ausreichende Versorgung. In den Wintermonaten liegen die Werte noch deutlich niedriger – der durchschnittliche Serumspiegel liegt im März bei etwa 12 ng/ml.',
    },
  ]

  return (
    <PageTransition>
      <SEOHead
        title="Vitamin-D-Mangel vor Implantation? So schließen Sie die Lücke im Behandlungspfad | PolarisDX"
        description="30 % Ihrer Implantations-Patienten haben einen Vitamin-D-Mangel mit messbaren Folgen für die Osseointegration. Erfahren Sie, wie Sie diese Lücke direkt in der Praxis schließen."
        canonical="https://polarisdx.net/vitamin-d3-implantologie"
        ogType="article"
        keywords={[
          'Vitamin D Implantologie',
          'Vitamin D3 Zahnarzt',
          'Vitamin D Mangel Implantat',
          'D3 K2 Supplementierung',
          'Osseointegration Vitamin D',
          'Implantatverlust Vitamin D',
        ]}
        article={{
          publishedTime: '2026-02-01',
          author: 'PolarisDX',
          section: 'Praxiswissen',
        }}
        structuredData={[
          createArticleSchema({
            headline: 'Vitamin-D-Mangel vor Implantation? So schließen Sie die Lücke im Behandlungspfad',
            description:
              '30 % Ihrer Implantations-Patienten haben einen Vitamin-D-Mangel mit messbaren Folgen für die Osseointegration.',
            image: '/og-image.jpg',
            url: '/vitamin-d3-implantologie',
            datePublished: '2026-02-01',
            dateModified: '2026-02-01',
            authorName: 'PolarisDX',
          }),
          createBreadcrumbSchema([
            { name: 'PolarisDX', url: '/' },
            { name: 'Praxiswissen', url: '/articles' },
            { name: 'Vitamin D3 & Implantologie', url: '/vitamin-d3-implantologie' },
          ]),
          createFAQSchema(faqItems),
        ]}
      />

      {/* Article Container */}
      <div className="bg-slate-50">
        {/* Hero / Above the Fold */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-deep to-gray-900 text-white">
          <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

          <div className="relative mx-auto flex min-h-[380px] max-w-page flex-col justify-end px-4 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <div className="max-w-[720px] mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
                  <Link to="/" className="hover:text-brand-secondary transition-colors">
                    PolarisDX
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <Link to="/articles" className="hover:text-brand-secondary transition-colors">
                    Praxiswissen
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="text-white/80">Vitamin D3 & Implantologie</span>
                </nav>

                {/* Category Label */}
                <p className="mb-4 text-xs font-semibold uppercase tracking-[1.2px] text-brand-secondary">
                  Praxistipp Implantologie
                </p>

                {/* H1 */}
                <h1 className="mb-5 text-2xl font-medium tracking-tight sm:text-3xl lg:text-[2.25rem] lg:leading-[1.2]">
                  Vitamin-D-Mangel vor Implantation? So schließen Sie die Lücke im Behandlungs&shy;pfad
                </h1>

                {/* Subtitle */}
                <p className="mb-6 text-base text-white/80 sm:text-lg lg:text-xl">
                  Warum Testen allein nicht reicht – und wie D3+K2-Supplementierung Ihre Implantations&shy;ergebnisse
                  und Ihren Praxisumsatz verbessert.
                </p>

                {/* Meta */}
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <span>Lesezeit: 4 Minuten</span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span>Aktualisiert: Februar 2026</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Main Content */}
        <article className="mx-auto max-w-[720px] px-4 py-12 lg:py-16">
          <Reveal width="100%">
            {/* Problem Section */}
            <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
              <p>
                Alles lief nach Plan: saubere Augmentation, präzise Insertion, gute Primärstabilität. Und trotzdem
                meldet sich der Patient sechs Wochen später mit Lockerung. Implantatverlust trotz einwandfreier Technik
                ist frustrierend – für Sie und für den Patienten. Doch bevor Sie den Fehler im chirurgischen Protokoll
                suchen, lohnt sich ein Blick auf einen Faktor, der in den wenigsten Praxen routinemäßig erhoben wird:
                den <strong>Vitamin-D-Status</strong>.
              </p>
            </div>

            {/* Evidence Section */}
            <section className="mt-12">
              <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                Was die Studienlage zeigt
              </h2>

              <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                <p>
                  Ein aktueller systematischer Review in <em>Periodontology 2000</em> (Miron et al., 2025) hat 27
                  Humanstudien zur Beziehung zwischen Vitamin D und Implantat-Osseointegration ausgewertet. Das Ergebnis
                  ist deutlich: 22 der 27 Studien bestätigen einen positiven Zusammenhang zwischen ausreichendem
                  Vitamin-D-Spiegel und erfolgreicher Einheilung.
                </p>
              </div>

              {/* Evidence Box */}
              <div className="my-8 rounded-lg border-l-4 border-brand-primary bg-blue-50/70 p-6">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-primary">Kernbefunde</p>
                <ul className="space-y-2 text-[15px] leading-relaxed text-gray-700">
                  <li>
                    Vitamin-D-Mangel wurde mit einem{' '}
                    <strong className="text-gray-900">bis zu vierfach erhöhten Risiko</strong> für frühe
                    Implantatverluste assoziiert.
                  </li>
                  <li>
                    Präoperative D3-Supplementierung verbesserte den Knochen-Implantat-Kontakt und reduzierte
                    Frühverluste – auch bei Risikopatienten (Diabetes, Osteoporose).
                  </li>
                </ul>
                <p className="mt-4 text-xs text-gray-500">
                  Quelle: Miron et al., Periodontol 2000, 2025; Kwiatek et al. (signifikant höhere Knochendichte nach 12
                  Wochen D3-Supplementierung)
                </p>
              </div>

              <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                <p>
                  Gleichzeitig zeigen RKI-Daten, dass rund <strong>30 % der Erwachsenen</strong> in Deutschland
                  mangelhaft mit Vitamin D versorgt sind – nur etwa 38 % erreichen ausreichende Werte. In den
                  Wintermonaten liegt der durchschnittliche Serumspiegel bei gerade einmal 12 ng/ml. Statistisch gesehen
                  sitzt also bei <strong>jedem dritten Patienten auf Ihrem Behandlungsstuhl</strong> ein Risikofaktor,
                  den Sie mit einer einfachen Maßnahme adressieren können.
                </p>
              </div>
            </section>

            {/* Mid-CTA: Diagnostics System */}
            <Link
              to="/igloo-pro"
              className="group my-10 block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-primary/30 hover:shadow-card"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-primary">
                Vitamin-D-Diagnostik in der Praxis
              </p>
              <p className="text-base font-medium text-gray-900 group-hover:text-brand-primary transition-colors">
                Sie möchten den Vitamin-D-Status Ihrer Patienten direkt am Behandlungsstuhl bestimmen?
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary">
                Zum Igloo Pro Diagnostik-System
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            {/* Spray Solution Section */}
            <section id="spray-section" className="mt-12 scroll-mt-24">
              <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                Sie testen bereits – aber was empfehlen Sie danach?
              </h2>

              <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                <p>
                  Viele Praxen, die den Vitamin-D-Spiegel vor Implantationen bestimmen, stehen vor derselben Situation:
                  Der Test zeigt einen Mangel, die Empfehlung lautet „bitte supplementieren" – und dann? Der Patient
                  nickt, verlässt die Praxis und kauft irgendein Präparat in der Apotheke. Oder auch nicht.
                </p>

                <p>
                  Das Ergebnis: Keine Kontrolle über die Compliance, keine Sicherheit über das Präparat, und die Praxis
                  verschenkt den therapeutischen Abschluss ihres eigenen Befundes an Dritte. Der Behandlungspfad{' '}
                  <span className="whitespace-nowrap font-medium text-gray-900">Testen → Erkennen → Handeln</span> bricht
                  nach Schritt zwei ab.
                </p>
              </div>

              <h3 className="mt-10 mb-4 text-lg font-semibold text-gray-900">
                Den Behandlungspfad in der Praxis schließen
              </h3>

              <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                <p>
                  Mit einem <strong>Vitamin D3+K2 Spray</strong> als Praxis-Dispensierprodukt schließen Sie genau diese
                  Lücke. Sublingual appliziert, hohe Bioverfügbarkeit, sofort beim Befundgespräch aushändigen. Der
                  Patient geht mit der Lösung nach Hause – nicht nur mit der Diagnose.
                </p>

                <p>
                  Die Kombination D3+K2 ist dabei kein Marketing-Zusatz, sondern physiologisch begründet: Vitamin K2
                  aktiviert Osteocalcin, das Calcium gezielt in die Knochenmatrix einlagert. Gerade bei Patienten, bei
                  denen Sie aktiv Knochen aufbauen wollen, ist diese gerichtete Mineralisation entscheidend.
                </p>

                <p>
                  Als Dispensierprodukt generiert das Spray wiederkehrende Einnahmen pro Patient – bei null zusätzlichen
                  Arbeitsschritten, weil es direkt an den bestehenden Testprozess anschließt.
                </p>
              </div>
            </section>

            {/* Main CTA */}
            <div className="my-12 rounded-xl bg-gradient-to-br from-brand-deep to-gray-900 p-8 text-center shadow-xl sm:p-10">
              <div className="relative z-10">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-secondary">
                  D3+K2 Spray für Ihre Praxis
                </p>
                <h3 className="mb-4 text-xl font-semibold text-white sm:text-2xl">
                  Erfahren Sie, wie Sie das Vitamin D3+K2 Spray als Dispensierprodukt in Ihren Praxisalltag integrieren.
                </h3>
                <Link
                  to="/contact?ref=blog-vitd3-spray"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-8 py-4 text-base font-semibold text-brand-deep shadow-lg transition-all hover:scale-[1.02] hover:bg-gray-50"
                >
                  Jetzt Spray-Konditionen anfragen
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <p className="mt-4 text-sm text-white/60">Unverbindlich · Antwort innerhalb von 24 Stunden</p>
              </div>
            </div>

            {/* Social Proof */}
            <p className="my-10 text-center text-sm text-gray-500">
              Über 100 Praxen in 15+ Ländern arbeiten bereits mit dem PolarisDX Diagnostik-Ökosystem.
            </p>

            {/* FAQ Section */}
            <section className="mt-12 border-t border-gray-200 pt-10">
              <h2 className="mb-8 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">Häufige Fragen</h2>

              <div className="space-y-8">
                {faqItems.map((faq, index) => (
                  <div key={index}>
                    <h3 className="mb-3 text-base font-semibold text-gray-900">{faq.question}</h3>
                    <p className="text-[15px] leading-relaxed text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Back Link */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Zurück zur Übersicht
              </Link>
            </div>
          </Reveal>
        </article>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white p-4 shadow-lg md:hidden">
        <Link
          to="/contact?ref=blog-vitd3-spray-sticky"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-deep px-6 py-3.5 text-sm font-semibold text-white shadow-lg"
        >
          Spray-Konditionen anfragen
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Mobile bottom padding for sticky CTA */}
      <div className="h-20 md:hidden" />
    </PageTransition>
  )
}

export default VitaminD3ImplantologyPage
