import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Phone,
  FileText,
  BookOpen,
  Microscope,
  BarChart3,
  BadgeCheck,
  ShieldCheck,
} from 'lucide-react'
import {
  SEOHead,
  createArticleSchema,
  createBreadcrumbSchema,
  createFAQSchema,
} from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import SubpageHero from '../components/sections/SubpageHero'
import PraxisOrderForm from '../components/sections/PraxisOrderForm'
import { Tooth } from '../components/ui/icons/Tooth'
import iglooProImage from '../assets/Igloo-pro-frontal.webp'

const VitaminD3ImplantologyPage = () => {
  // Author data for E-E-A-T
  const author = {
    name: 'Fachredaktion PolarisDX',
    type: 'Organization' as const,
    url: 'https://polarisdx.net/about',
  }

  // FAQ data - rewritten to complement (not repeat) main text
  const faqItems = [
    {
      question: 'Beeinflusst Vitamin-D-Mangel die Implantateinheilung?',
      answer:
        'Ja, ein niedriger 25-OH-Vitamin-D-Spiegel kann die Knochenheilung nach Implantatinsertion negativ beeinflussen. Studien zeigen, dass Patienten mit Serumwerten unter 20 ng/ml signifikant häufiger Frühverluste erleiden als Patienten mit ausreichenden Werten über 30 ng/ml.',
    },
    {
      question: 'Warum D3 zusammen mit K2 supplementieren?',
      answer:
        'Vitamin K2 (MK-7) lenkt das durch D3 vermehrt aufgenommene Calcium gezielt in die Knochen, indem es Osteocalcin aktiviert. Ohne K2 besteht theoretisch ein Risiko für Gefäßverkalkungen. Die Kombination ist besonders bei längerer Supplementierung und höheren D3-Dosen sinnvoll.',
    },
    {
      question: 'Wie häufig ist Vitamin-D-Mangel in Deutschland?',
      answer:
        'Das Robert Koch-Institut stuft etwa 30 % der erwachsenen Bevölkerung als mangelhaft versorgt ein (unter 30 nmol/l bzw. 12 ng/ml). In den Wintermonaten verschärft sich die Situation deutlich – rund 60 % erreichen dann keine adäquaten Spiegel.',
    },
    {
      question: 'Welcher Vitamin-D-Spiegel wird vor Implantation empfohlen?',
      answer:
        'Für eine optimale Osseointegration empfehlen aktuelle Studien einen 25-OH-D-Serumspiegel von mindestens 30 ng/ml (75 nmol/l), idealerweise 40–60 ng/ml. Bei Risikopatienten mit Diabetes oder Osteoporose kann ein höherer Zielwert sinnvoll sein.',
    },
  ]

  return (
    <PageTransition>
      <SEOHead
        title="Vitamin-D-Mangel vor Implantation erkennen"
        description="Rund 30 % der Implantat-Patienten haben Vitamin-D-Mangel. Chairside 25-OH-D-Test vor Implantation und D3+K2-Protokoll für bessere Osseointegration. Evidenz & Praxisleitfaden."
        ogType="article"
        keywords={[
          'Vitamin D Implantologie',
          'Vitamin D3 Zahnarzt',
          'Vitamin D Mangel Implantat',
          'D3 K2 Supplementierung',
          'Osseointegration Vitamin D',
          'Implantatverlust Vitamin D',
          'Vitamin D Zahnimplantat',
          '25-OH-Vitamin-D Spiegel Implantologie',
          'Vitamin D Implantaterfolg',
        ]}
        article={{
          publishedTime: '2026-02-01',
          author: 'Fachredaktion PolarisDX',
          section: 'Praxiswissen',
        }}
        structuredData={[
          createArticleSchema({
            headline:
              'Vitamin-D-Mangel vor Implantation? So schließen Sie die Lücke im Behandlungspfad',
            description:
              '30 % Ihrer Implantations-Patienten haben einen Vitamin-D-Mangel mit messbaren Folgen für die Osseointegration. Erfahren Sie, wie präoperative D3+K2-Supplementierung den Implantaterfolg verbessert.',
            image: '/og-image.jpg',
            url: '/vitamin-d3-implantologie',
            datePublished: '2026-02-01',
            dateModified: '2026-02-04',
            articleType: 'MedicalWebPage',
            author: author,
          }),
          createBreadcrumbSchema([
            { name: 'PolarisDX', url: '/' },
            { name: 'Praxiswissen', url: '/articles' },
            { name: 'Vitamin D3 & Implantologie', url: '/vitamin-d3-implantologie' },
          ]),
          createFAQSchema(faqItems),
        ]}
      />

      <SubpageHero
        breadcrumbs={[
          { label: 'PolarisDX', href: '/' },
          { label: 'Praxiswissen', href: '/articles' },
          { label: 'Vitamin D3 & Implantologie' },
        ]}
        eyebrow="Praxistipp Implantologie"
        title="Vitamin-D-Mangel vor Implantation? So schließen Sie die Lücke im Behandlungspfad"
        subtitle="Warum Testen allein nicht reicht – und wie D3+K2-Supplementierung Ihre Implantationsergebnisse und Ihren Praxisumsatz verbessert."
        primaryCta={{ label: 'D3+K2 Spray bestellen', href: '#bestellformular' }}
        secondaryCta={{ label: 'Diagnostik-System ansehen', to: '/igloo-pro' }}
        chips={['Lesezeit: 5 Minuten', 'Aktualisiert: Februar 2026', 'Fachredaktion PolarisDX']}
        stats={[
          { value: '30 %', label: 'Patienten mit Vitamin-D-Mangel' },
          { value: 'bis 4×', label: 'Risiko für Frühverluste' },
          { value: '22/27', label: 'Studien mit positivem Effekt' },
        ]}
        valueChips={[
          { value: '≥ 30 ng/ml', label: 'Zielwert vor OP' },
          { value: 'bis 4×', label: 'Frühverlust-Risiko' },
          { value: '30 %', label: 'Mangel-Prävalenz' },
        ]}
        icon={<Tooth />}
      />

      {/* Evidenz-Leiste direkt unter dem Hero */}
      <section aria-label="Evidenz und Vertrauen" className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-container px-4 py-7 lg:px-0">
          <ul className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
            {[
              { icon: Microscope, label: '27 Humanstudien ausgewertet' },
              { icon: BarChart3, label: 'RKI-Daten: 30 % Mangel' },
              { icon: BadgeCheck, label: 'Systematischer Review 2025' },
              { icon: ShieldCheck, label: 'D3+K2 evidenzbasiert' },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2">
                <Icon size={18} className="text-accent" aria-hidden="true" />
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Article Container */}
      <div className="bg-slate-50">
        {/* Main Content with Sidebar */}
        <div className="mx-auto max-w-container px-4 py-12 lg:px-0 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">
            {/* Main Article Column */}
            <article className="article-col">
              <Reveal width="100%">
                {/* Author Box - E-E-A-T Signal */}
                <div className="mb-10 flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-lg font-semibold text-accent">
                    FP
                  </div>
                  <p className="text-sm font-medium text-heading">Fachredaktion PolarisDX</p>
                </div>

                {/* Problem Section */}
                <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                  <p>
                    Alles lief nach Plan: saubere Augmentation, präzise Insertion, gute
                    Primärstabilität. Und trotzdem meldet sich der Patient sechs Wochen später mit
                    Lockerung. Implantatverlust trotz einwandfreier Technik ist frustrierend – für
                    Sie und für den Patienten. Doch bevor Sie den Fehler im chirurgischen Protokoll
                    suchen, lohnt sich ein Blick auf einen Faktor, der in den wenigsten Praxen
                    routinemäßig erhoben wird: den <strong>Vitamin-D-Status</strong>.
                  </p>
                  <p>
                    Der Zusammenhang zwischen Vitamin D und erfolgreicher Osseointegration ist
                    mittlerweile gut belegt. Dennoch wird der{' '}
                    <strong>25-OH-Vitamin-D-Spiegel</strong> vor Zahnimplantaten nur selten bestimmt
                    – ein Versäumnis, das messbare Konsequenzen für den Implantaterfolg haben kann.
                  </p>
                </div>

                {/* Evidence Section */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-medium tracking-tight text-heading sm:text-2xl">
                    Was die Studienlage zur Osseointegration zeigt
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Ein aktueller systematischer Review in <em>Periodontology 2000</em> (Miron et
                      al., 2025) hat 27 Humanstudien zur Beziehung zwischen{' '}
                      <strong>Vitamin D und Implantat-Osseointegration</strong> ausgewertet. Das
                      Ergebnis ist deutlich: 22 der 27 Studien bestätigen einen positiven
                      Zusammenhang zwischen ausreichendem Vitamin-D-Spiegel und erfolgreicher
                      Einheilung.
                    </p>
                  </div>

                  {/* Evidence Box */}
                  <div className="my-8 rounded-lg border-l-4 border-accent bg-accent/5 p-6">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                      Kernbefunde
                    </p>
                    <ul className="space-y-2 text-[15px] leading-relaxed text-gray-700">
                      <li>
                        <strong>Vitamin D Zahnimplantat</strong>: Mangel wurde mit einem{' '}
                        <strong className="text-heading">bis zu vierfach erhöhten Risiko</strong>{' '}
                        für frühe Implantatverluste assoziiert.
                      </li>
                      <li>
                        Präoperative <strong>D3-Supplementierung</strong> verbesserte den
                        Knochen-Implantat-Kontakt (BIC) und reduzierte Frühverluste – auch bei
                        Risikopatienten (Diabetes, Osteoporose).
                      </li>
                      <li>
                        Kwiatek et al. dokumentierten signifikant höhere Knochendichte nach 12
                        Wochen <strong>Vitamin D Supplementierung vor Implantologie</strong>
                        -Eingriffen.
                      </li>
                    </ul>
                    <p className="mt-4 text-xs text-gray-500">
                      Quelle: Miron et al., Periodontol 2000, 2025; Javed et al., Implant Dent 2016;
                      Mangano et al., J Craniofac Surg 2018
                    </p>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Gleichzeitig zeigen RKI-Daten, dass rund <strong>30 % der Erwachsenen</strong>{' '}
                      in Deutschland mangelhaft mit Vitamin D versorgt sind – nur etwa 38 %
                      erreichen ausreichende Werte. In den Wintermonaten liegt der durchschnittliche
                      Serumspiegel bei gerade einmal 12 ng/ml. Statistisch gesehen sitzt also bei{' '}
                      <strong>jedem dritten Patienten auf Ihrem Behandlungsstuhl</strong> ein
                      Risikofaktor, den Sie mit einer einfachen Maßnahme adressieren können.
                    </p>
                  </div>
                </section>

                {/* Dosing Protocol Section - NEW for SEO */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-medium tracking-tight text-heading sm:text-2xl">
                    Präoperatives Protokoll: Zielwerte und Dosierung
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Für einen optimalen <strong>Vitamin D Implantaterfolg</strong> empfiehlt die
                      aktuelle Literatur einen <strong>25-OH-Vitamin-D-Spiegel</strong> von
                      mindestens 30 ng/ml (75 nmol/l), idealerweise 40–60 ng/ml. Bei Patienten mit
                      einem Ausgangswert unter 20 ng/ml sollte die Implantation nach Möglichkeit
                      verschoben werden, bis adäquate Werte erreicht sind.
                    </p>
                  </div>

                  {/* Dosing Table */}
                  <div className="my-8 overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-heading">
                            Ausgangsspiegel
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-heading">
                            Empfohlene Tagesdosis
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-heading">
                            Dauer bis Kontrolle
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-gray-700">
                            &lt; 10 ng/ml (schwerer Mangel)
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            5.000–10.000 IE D3 + 200 µg K2
                          </td>
                          <td className="px-4 py-3 text-gray-700">8 Wochen</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">10–20 ng/ml (Mangel)</td>
                          <td className="px-4 py-3 text-gray-700">4.000–5.000 IE D3 + 200 µg K2</td>
                          <td className="px-4 py-3 text-gray-700">6–8 Wochen</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">20–30 ng/ml (suboptimal)</td>
                          <td className="px-4 py-3 text-gray-700">2.000–4.000 IE D3 + 100 µg K2</td>
                          <td className="px-4 py-3 text-gray-700">4–6 Wochen</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">&gt; 30 ng/ml (ausreichend)</td>
                          <td className="px-4 py-3 text-gray-700">1.000–2.000 IE D3 (Erhaltung)</td>
                          <td className="px-4 py-3 text-gray-700">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Die Kombination mit <strong>Vitamin K2 (MK-7)</strong> ist bei höheren Dosen
                      empfehlenswert: K2 aktiviert das Osteocalcin, das für die gezielte Einlagerung
                      von Calcium in die Knochenmatrix verantwortlich ist – genau der Prozess, der
                      bei der Osseointegration entscheidend ist.
                    </p>
                    <p>
                      <em>Hinweis:</em> Die Dosierungsempfehlungen dienen als Orientierung. Bei
                      Patienten mit Niereninsuffizienz, Sarkoidose oder anderen Kontraindikationen
                      ist eine individuelle Anpassung erforderlich.
                    </p>
                  </div>
                </section>

                {/* Mid-CTA: Diagnostics System with Image */}
                <div className="my-10 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-2/5">
                      <img
                        src={iglooProImage}
                        alt="IglooPro POC-Reader für Vitamin-D-Diagnostik am Behandlungsstuhl in der Zahnarztpraxis"
                        width={400}
                        height={400}
                        className="h-48 w-full bg-gray-50 object-contain p-4 sm:h-full"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-6 sm:w-3/5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                        Vitamin-D-Diagnostik in der Praxis
                      </p>
                      <p className="mb-3 text-base font-medium text-heading">
                        Den 25-OH-Vitamin-D-Spiegel direkt am Behandlungsstuhl bestimmen – in unter
                        15 Minuten.
                      </p>
                      <Link
                        to="/igloo-pro"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-strong"
                      >
                        Zum Igloo Pro Diagnostik-System
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Spray Solution Section */}
                <section id="spray-section" className="mt-12 scroll-mt-24">
                  <h2 className="mb-6 text-xl font-medium tracking-tight text-heading sm:text-2xl">
                    Sie testen bereits – aber was empfehlen Sie danach?
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Viele Praxen, die{' '}
                      <Link
                        to="/diagnostics/dental"
                        className="font-semibold text-accent hover:underline"
                      >
                        den Vitamin-D-Spiegel vor Implantationen bestimmen
                      </Link>
                      , stehen vor derselben Situation: Der Test zeigt einen Mangel, die Empfehlung
                      lautet „bitte supplementieren" – und dann? Der Patient nickt, verlässt die
                      Praxis und kauft irgendein Präparat in der Apotheke. Oder auch nicht.
                    </p>

                    <p>
                      Das Ergebnis: Keine Kontrolle über die Compliance, keine Sicherheit über das
                      Präparat, und die Praxis verschenkt den therapeutischen Abschluss ihres
                      eigenen Befundes an Dritte. Der Behandlungspfad{' '}
                      <span className="whitespace-nowrap font-medium text-heading">
                        Testen → Erkennen → Handeln
                      </span>{' '}
                      bricht nach Schritt zwei ab.
                    </p>
                  </div>

                  <h3 className="mb-4 mt-10 text-lg font-medium text-heading">
                    Den Behandlungspfad in der Praxis schließen
                  </h3>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Mit einem <strong>Vitamin D3+K2 Spray</strong> als Praxis-Dispensierprodukt
                      schließen Sie genau diese Lücke. Sublingual appliziert, hohe Bioverfügbarkeit,
                      sofort beim Befundgespräch aushändigen. Der Patient geht mit der Lösung nach
                      Hause – nicht nur mit der Diagnose.
                    </p>

                    <p>
                      Die Kombination D3+K2 ist dabei kein Marketing-Zusatz, sondern physiologisch
                      begründet: Vitamin K2 aktiviert Osteocalcin, das Calcium gezielt in die
                      Knochenmatrix einlagert. Gerade bei Patienten, bei denen Sie aktiv Knochen
                      aufbauen wollen, ist diese gerichtete Mineralisation entscheidend für den{' '}
                      <strong>Implantaterfolg</strong>.
                    </p>

                    <p>
                      Als Dispensierprodukt generiert das Spray wiederkehrende Einnahmen pro Patient
                      – bei null zusätzlichen Arbeitsschritten, weil es direkt an den bestehenden
                      Testprozess anschließt.
                    </p>
                  </div>
                </section>

                {/* Order Form (finale Conversion) */}
                <div className="my-12">
                  <PraxisOrderForm
                    area="Vitamin D3+K2 Spray BESTELLUNG"
                    orderName="Vitamin D3+K2 Spray"
                    quantityUnit="Sprays"
                    messageNoneLabel="Keine"
                    defaultQuantity="10"
                    quantityOptions={[
                      { value: '5', label: '5 Sprays – Starterpaket' },
                      { value: '10', label: '10 Sprays' },
                      { value: '25', label: '25 Sprays – Praxispaket' },
                      { value: '50', label: '50 Sprays' },
                      { value: '100', label: '100+ Sprays – Großbestellung' },
                    ]}
                    texts={{
                      caption: 'Vitamin D3+K2 Spray',
                      title: 'Jetzt bestellen',
                      description:
                        'Füllen Sie das Formular aus und wir senden Ihnen eine Auftragsbestätigung mit Rechnung per E-Mail.',
                      quantityLabel: 'Bestellmenge',
                      addressHeading: 'Rechnungs- & Lieferadresse',
                      practiceLabel: 'Praxis / Firma',
                      practicePlaceholder: 'Zahnarztpraxis Musterpraxis',
                      nameLabel: 'Name',
                      namePlaceholder: 'Ihr Name',
                      emailLabel: 'E-Mail',
                      emailPlaceholder: 'praxis@beispiel.de',
                      phoneLabel: 'Telefon',
                      phonePlaceholder: 'Für Rückfragen',
                      messageLabel: 'Anmerkungen zur Bestellung',
                      messagePlaceholder: 'Optional: Lieferhinweise, abweichende Adresse, etc.',
                      submit: 'Jetzt verbindlich bestellen',
                      submitting: 'Bestellung wird gesendet...',
                      submitNote:
                        'Mit Absenden erhalten Sie eine Auftragsbestätigung per E-Mail. Zahlung auf Rechnung.',
                      reassurance: 'Kostenlos & unverbindlich · Antwort < 24 h',
                      errorText:
                        'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen Sie uns an.',
                      successTitle: 'Vielen Dank für Ihre Bestellung!',
                      successText:
                        'Wir haben Ihre Bestellung erhalten und senden Ihnen in Kürze eine Bestätigung per E-Mail.',
                    }}
                  />
                </div>

                {/* FAQ Section */}
                <section className="mt-12 border-t border-gray-200 pt-10">
                  <h2 className="mb-8 text-xl font-medium tracking-tight text-heading sm:text-2xl">
                    Häufige Fragen
                  </h2>

                  <div className="space-y-8">
                    {faqItems.map((faq, index) => (
                      <div key={index}>
                        <h3 className="mb-3 text-base font-semibold text-heading">
                          {faq.question}
                        </h3>
                        <p className="text-[15px] leading-relaxed text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Back Link */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                  <Link
                    to="/articles"
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-strong"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    Zurück zur Übersicht
                  </Link>
                </div>
              </Reveal>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Phone Contact Box */}
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-heading">Fragen zur Bestellung?</p>
                      <p className="text-xs text-gray-500">Wir beraten Sie gerne</p>
                    </div>
                  </div>
                  <a
                    href="tel:+4915175011699"
                    className="flex items-center justify-center gap-2 rounded-md bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
                  >
                    <Phone className="h-4 w-4" />
                    +49 151 75011699
                  </a>
                  <p className="mt-2 text-center text-xs text-gray-500">Mo–Fr 9:00–17:00 Uhr</p>
                </div>

                {/* Quick Order CTA — flaches Teal-Band */}
                <div className="rounded-xl bg-accent-strong p-6 text-white">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    Schnellbestellung
                  </p>
                  <p className="mb-4 text-sm text-white">
                    Direkt zum Bestellformular und D3+K2 Spray für Ihre Praxis sichern.
                  </p>
                  <a
                    href="#bestellformular"
                    className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-medium text-brand-deep transition-colors hover:bg-gray-50"
                  >
                    Jetzt bestellen
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                {/* Related Articles */}
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-heading">
                    <BookOpen className="h-4 w-4 text-accent" />
                    Weiterführende Inhalte
                  </p>
                  <div className="space-y-3">
                    <Link
                      to="/igloo-pro"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-heading group-hover:text-accent">
                          Igloo Pro System
                        </p>
                        <p className="text-xs text-gray-500">
                          Vitamin-D-Diagnostik am Behandlungsstuhl
                        </p>
                      </div>
                    </Link>
                    <Link
                      to="/services/dental"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-heading group-hover:text-accent">
                          POC-Diagnostik für Zahnarztpraxen
                        </p>
                        <p className="text-xs text-gray-500">
                          Vitamin D und Implantologie in der Praxis
                        </p>
                      </div>
                    </Link>
                    <Link
                      to="/articles/die-gruene-praxis"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-heading group-hover:text-accent">
                          Die grüne Praxis
                        </p>
                        <p className="text-xs text-gray-500">
                          Nachhaltigkeit in der Zahnarztpraxis
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Trust Signal */}
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <p className="text-xs text-gray-500">
                    Über <span className="font-semibold text-gray-700">100 Praxen</span> in 15+
                    Ländern vertrauen auf PolarisDX
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white p-4 shadow-lg lg:hidden">
        <a
          href="#bestellformular"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-accent-strong px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-brand-deep"
        >
          Jetzt D3+K2 Spray bestellen
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {/* Mobile bottom padding for sticky CTA */}
      <div className="h-20 lg:hidden" />
    </PageTransition>
  )
}

export default VitaminD3ImplantologyPage
