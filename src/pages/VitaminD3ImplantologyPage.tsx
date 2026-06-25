import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChevronRight,
  Send,
  CheckCircle,
  Phone,
  FileText,
  BookOpen,
} from 'lucide-react'
import {
  SEOHead,
  createArticleSchema,
  createBreadcrumbSchema,
  createFAQSchema,
} from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import { AuthorByline, ContactCallout, Eyebrow, MediaLink, Panel } from '~/design-system'
import iglooProImage from '../assets/Igloo-pro-frontal.webp'
import { sendContactEmail } from '../api/contact'

const VitaminD3ImplantologyPage = () => {
  // Order form state
  const [formData, setFormData] = useState({
    praxisName: '',
    ansprechpartner: '',
    email: '',
    phone: '',
    quantity: '10',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
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

      {/* Article Container */}
      <div className="bg-bg">
        {/* Hero / Above the Fold */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-deep to-brand-heading text-white">
          <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-60 bg-gradient-to-br from-white/30 to-transparent opacity-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-60 bg-gradient-to-tl from-white/30 to-transparent opacity-10" />

          <div className="relative mx-auto flex min-h-[380px] max-w-page flex-col justify-end px-4 pb-12 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
            <Reveal width="100%" yOffset={20}>
              <div className="max-w-4xl mx-auto">
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
                <Eyebrow size="sm" className="mb-4">
                  Praxistipp Implantologie
                </Eyebrow>

                {/* H1 */}
                <h1 className="mb-5 text-display-sm font-medium tracking-tight">
                  Vitamin-D-Mangel vor Implantation? So schließen Sie die Lücke im
                  Behandlungs&shy;pfad
                </h1>

                {/* Subtitle */}
                <p className="mb-6 text-base text-white/80 sm:text-lg lg:text-xl">
                  Warum Testen allein nicht reicht – und wie D3+K2-Supplementierung Ihre
                  Implantations&shy;ergebnisse und Ihren Praxisumsatz verbessert.
                </p>

                {/* Meta with E-E-A-T */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60">
                  <span>Lesezeit: 5 Minuten</span>
                  <span className="h-1 w-1 rounded-full bg-surface/40" />
                  <span>Aktualisiert: Februar 2026</span>
                  <span className="h-1 w-1 rounded-full bg-surface/40" />
                  <span>Fachredaktion PolarisDX</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <div className="mx-auto max-w-container px-4 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">
            {/* Main Article Column */}
            <article>
              <Reveal width="100%">
                {/* Author Box - E-E-A-T Signal */}
                <AuthorByline className="mb-10" initials="FP" name="Fachredaktion PolarisDX" />

                {/* Problem Section */}
                <div className="space-y-6 text-lg leading-body text-fg">
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
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-fg-heading sm:text-2xl">
                    Was die Studienlage zur Osseointegration zeigt
                  </h2>

                  <div className="space-y-6 text-lg leading-body text-fg">
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
                  <div className="my-8 rounded-lg border-l-4 border-brand-primary bg-primary/5 p-6">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-primary">
                      Kernbefunde
                    </p>
                    <ul className="space-y-2 text-base leading-body text-fg">
                      <li>
                        <strong>Vitamin D Zahnimplantat</strong>: Mangel wurde mit einem{' '}
                        <strong className="text-fg-heading">bis zu vierfach erhöhten Risiko</strong>{' '}
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
                    <p className="mt-4 text-xs text-fg-muted">
                      Quelle: Miron et al., Periodontol 2000, 2025; Javed et al., Implant Dent 2016;
                      Mangano et al., J Craniofac Surg 2018
                    </p>
                  </div>

                  <div className="space-y-6 text-lg leading-body text-fg">
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
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-fg-heading sm:text-2xl">
                    Präoperatives Protokoll: Zielwerte und Dosierung
                  </h2>

                  <div className="space-y-6 text-lg leading-body text-fg">
                    <p>
                      Für einen optimalen <strong>Vitamin D Implantaterfolg</strong> empfiehlt die
                      aktuelle Literatur einen <strong>25-OH-Vitamin-D-Spiegel</strong> von
                      mindestens 30 ng/ml (75 nmol/l), idealerweise 40–60 ng/ml. Bei Patienten mit
                      einem Ausgangswert unter 20 ng/ml sollte die Implantation nach Möglichkeit
                      verschoben werden, bis adäquate Werte erreicht sind.
                    </p>
                  </div>

                  {/* Dosing Table */}
                  <div className="my-8 overflow-hidden rounded-lg border border-[var(--color-border)]">
                    <table className="w-full text-sm">
                      <thead className="bg-bg-subtle">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-fg-heading">
                            Ausgangsspiegel
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-fg-heading">
                            Empfohlene Tagesdosis
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-fg-heading">
                            Dauer bis Kontrolle
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-border)]">
                        <tr>
                          <td className="px-4 py-3 text-fg">&lt; 10 ng/ml (schwerer Mangel)</td>
                          <td className="px-4 py-3 text-fg">5.000–10.000 IE D3 + 200 µg K2</td>
                          <td className="px-4 py-3 text-fg">8 Wochen</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-fg">10–20 ng/ml (Mangel)</td>
                          <td className="px-4 py-3 text-fg">4.000–5.000 IE D3 + 200 µg K2</td>
                          <td className="px-4 py-3 text-fg">6–8 Wochen</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-fg">20–30 ng/ml (suboptimal)</td>
                          <td className="px-4 py-3 text-fg">2.000–4.000 IE D3 + 100 µg K2</td>
                          <td className="px-4 py-3 text-fg">4–6 Wochen</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-fg">&gt; 30 ng/ml (ausreichend)</td>
                          <td className="px-4 py-3 text-fg">1.000–2.000 IE D3 (Erhaltung)</td>
                          <td className="px-4 py-3 text-fg">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-6 text-lg leading-body text-fg">
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
                <div className="my-10 overflow-hidden rounded-xl border border-[var(--color-border)] bg-surface shadow-sm">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-2/5">
                      <img
                        src={iglooProImage}
                        alt="IglooPro POC-Reader für Vitamin-D-Diagnostik am Behandlungsstuhl in der Zahnarztpraxis"
                        width={400}
                        height={400}
                        className="h-48 w-full object-contain bg-bg-subtle p-4 sm:h-full"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-6 sm:w-3/5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-primary">
                        Vitamin-D-Diagnostik in der Praxis
                      </p>
                      <p className="mb-3 text-base font-medium text-fg-heading">
                        Den 25-OH-Vitamin-D-Spiegel direkt am Behandlungsstuhl bestimmen – in unter
                        15 Minuten.
                      </p>
                      <Link
                        to="/igloo-pro"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
                      >
                        Zum Igloo Pro Diagnostik-System
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Spray Solution Section */}
                <section id="spray-section" className="mt-12 scroll-mt-24">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-fg-heading sm:text-2xl">
                    Sie testen bereits – aber was empfehlen Sie danach?
                  </h2>

                  <div className="space-y-6 text-lg leading-body text-fg">
                    <p>
                      Viele Praxen, die{' '}
                      <Link
                        to="/diagnostics/dental"
                        className="font-semibold text-brand-primary hover:underline"
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
                      <span className="whitespace-nowrap font-medium text-fg-heading">
                        Testen → Erkennen → Handeln
                      </span>{' '}
                      bricht nach Schritt zwei ab.
                    </p>
                  </div>

                  <h3 className="mt-10 mb-4 text-lg font-semibold text-fg-heading">
                    Den Behandlungspfad in der Praxis schließen
                  </h3>

                  <div className="space-y-6 text-lg leading-body text-fg">
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

                {/* Order Form */}
                <section id="bestellformular" className="my-12 scroll-mt-24">
                  <div className="rounded-xl border-2 border-brand-primary/20 bg-surface p-6 shadow-lg sm:p-8">
                    <div className="mb-6">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-primary">
                        Vitamin D3+K2 Spray
                      </p>
                      <h3 className="text-xl font-semibold text-fg-heading sm:text-2xl">
                        Jetzt bestellen
                      </h3>
                      <p className="mt-2 text-sm text-fg">
                        Füllen Sie das Formular aus und wir senden Ihnen eine Auftragsbestätigung
                        mit Rechnung per E-Mail.
                      </p>
                    </div>

                    {submitStatus === 'success' ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <CheckCircle className="mb-4 h-12 w-12 text-success" />
                        <h4 className="mb-2 text-lg font-semibold text-fg-heading">
                          Vielen Dank für Ihre Bestellung!
                        </h4>
                        <p className="text-sm text-fg">
                          Wir haben Ihre Bestellung erhalten und senden Ihnen in Kürze eine
                          Bestätigung per E-Mail.
                        </p>
                      </div>
                    ) : (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault()
                          setIsSubmitting(true)
                          setSubmitStatus('idle')

                          const success = await sendContactEmail({
                            name: formData.ansprechpartner,
                            email: formData.email,
                            phone: formData.phone,
                            company: formData.praxisName,
                            area: 'Vitamin D3+K2 Spray BESTELLUNG',
                            message: `BESTELLUNG Vitamin D3+K2 Spray\n\nMenge: ${formData.quantity} Sprays\n\nLieferadresse:\n${formData.praxisName}\n${formData.ansprechpartner}\n\nAnmerkungen:\n${formData.message || 'Keine'}`,
                            // Server now hard-requires consent === true (400 otherwise).
                            // Submitting this order constitutes the agreement to be contacted.
                            consent: true,
                          })

                          setIsSubmitting(false)
                          setSubmitStatus(success ? 'success' : 'error')
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <label
                            htmlFor="quantity"
                            className="mb-1 block text-sm font-medium text-fg"
                          >
                            Bestellmenge *
                          </label>
                          <select
                            id="quantity"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="w-full rounded-md border border-[var(--color-border-strong)] px-3 py-2.5 text-sm font-medium focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                          >
                            <option value="5">5 Sprays – Starterpaket</option>
                            <option value="10">10 Sprays</option>
                            <option value="25">25 Sprays – Praxispaket</option>
                            <option value="50">50 Sprays</option>
                            <option value="100">100+ Sprays – Großbestellung</option>
                          </select>
                        </div>

                        <div className="border-t border-[var(--color-border)] pt-4">
                          <p className="mb-3 text-sm font-medium text-fg-heading">
                            Rechnungs- & Lieferadresse
                          </p>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="praxisName" className="mb-1 block text-sm text-fg">
                                Praxis / Firma *
                              </label>
                              <input
                                type="text"
                                id="praxisName"
                                required
                                value={formData.praxisName}
                                onChange={(e) =>
                                  setFormData({ ...formData, praxisName: e.target.value })
                                }
                                className="w-full rounded-md border border-[var(--color-border-strong)] px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                placeholder="Zahnarztpraxis Musterpraxis"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="ansprechpartner"
                                className="mb-1 block text-sm text-fg"
                              >
                                Name *
                              </label>
                              <input
                                type="text"
                                id="ansprechpartner"
                                required
                                value={formData.ansprechpartner}
                                onChange={(e) =>
                                  setFormData({ ...formData, ansprechpartner: e.target.value })
                                }
                                className="w-full rounded-md border border-[var(--color-border-strong)] px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                placeholder="Ihr Name"
                              />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <label htmlFor="email" className="mb-1 block text-sm text-fg">
                                  E-Mail *
                                </label>
                                <input
                                  type="email"
                                  id="email"
                                  required
                                  value={formData.email}
                                  onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                  }
                                  className="w-full rounded-md border border-[var(--color-border-strong)] px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                  placeholder="praxis@beispiel.de"
                                />
                              </div>
                              <div>
                                <label htmlFor="phone" className="mb-1 block text-sm text-fg">
                                  Telefon
                                </label>
                                <input
                                  type="tel"
                                  id="phone"
                                  value={formData.phone}
                                  onChange={(e) =>
                                    setFormData({ ...formData, phone: e.target.value })
                                  }
                                  className="w-full rounded-md border border-[var(--color-border-strong)] px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                  placeholder="Für Rückfragen"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="message" className="mb-1 block text-sm text-fg">
                            Anmerkungen zur Bestellung
                          </label>
                          <textarea
                            id="message"
                            rows={2}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full rounded-md border border-[var(--color-border-strong)] px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                            placeholder="Optional: Lieferhinweise, abweichende Adresse, etc."
                          />
                        </div>

                        {submitStatus === 'error' && (
                          <p className="text-sm text-danger">
                            Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder rufen
                            Sie uns an.
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            'Bestellung wird gesendet...'
                          ) : (
                            <>
                              Jetzt verbindlich bestellen
                              <Send className="h-4 w-4" />
                            </>
                          )}
                        </button>

                        <p className="text-center text-xs text-fg-muted">
                          Mit Absenden erhalten Sie eine Auftragsbestätigung per E-Mail. Zahlung auf
                          Rechnung.
                        </p>
                      </form>
                    )}
                  </div>
                </section>

                {/* FAQ Section */}
                <section className="mt-12 border-t border-[var(--color-border)] pt-10">
                  <h2 className="mb-8 text-xl font-semibold tracking-tight text-fg-heading sm:text-2xl">
                    Häufige Fragen
                  </h2>

                  <div className="space-y-8">
                    {faqItems.map((faq, index) => (
                      <div key={index}>
                        <h3 className="mb-3 text-base font-semibold text-fg-heading">
                          {faq.question}
                        </h3>
                        <p className="text-base leading-body text-fg">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Back Link */}
                <div className="mt-12 border-t border-[var(--color-border)] pt-8">
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

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Phone Contact Box */}
                <ContactCallout
                  icon={<Phone className="h-5 w-5" />}
                  title="Fragen zur Bestellung?"
                  subtitle="Wir beraten Sie gerne"
                  phoneHref="tel:+4915175011699"
                  phoneLabel={
                    <>
                      <Phone className="h-4 w-4" />
                      +49 151 75011699
                    </>
                  }
                  note="Mo–Fr 9:00–17:00 Uhr"
                />

                {/* Quick Order CTA */}
                <div className="rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep p-5 text-white">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-secondary">
                    Schnellbestellung
                  </p>
                  <p className="mb-4 text-sm">
                    Direkt zum Bestellformular und D3+K2 Spray für Ihre Praxis sichern.
                  </p>
                  <a
                    href="#bestellformular"
                    className="flex items-center justify-center gap-2 rounded-md bg-surface px-4 py-2.5 text-sm font-semibold text-brand-deep transition-colors hover:bg-bg-subtle"
                  >
                    Jetzt bestellen
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                {/* Related Articles */}
                <Panel as="div" bordered padding="sm" radius="md">
                  <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-fg-heading">
                    <BookOpen className="h-4 w-4 text-brand-primary" />
                    Weiterführende Inhalte
                  </p>
                  <div className="space-y-3">
                    <MediaLink
                      to="/igloo-pro"
                      icon={<FileText className="h-4 w-4" />}
                      title="Igloo Pro System"
                      description="Vitamin-D-Diagnostik am Behandlungsstuhl"
                    />
                    <MediaLink
                      to="/services/dental"
                      accent="success"
                      icon={<FileText className="h-4 w-4" />}
                      title="POC-Diagnostik für Zahnarztpraxen"
                      description="Vitamin D und Implantologie in der Praxis"
                    />
                    <MediaLink
                      to="/articles/die-gruene-praxis"
                      accent="success"
                      icon={<FileText className="h-4 w-4" />}
                      title="Die grüne Praxis"
                      description="Nachhaltigkeit in der Zahnarztpraxis"
                    />
                  </div>
                </Panel>

                {/* Trust Signal */}
                <div className="rounded-lg bg-bg-subtle p-4 text-center">
                  <p className="text-xs text-fg-muted">
                    Über <span className="font-semibold text-fg">100 Praxen</span> in 15+ Ländern
                    vertrauen auf PolarisDX
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-surface p-4 shadow-lg lg:hidden">
        <a
          href="#bestellformular"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg"
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
