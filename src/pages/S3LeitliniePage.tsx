import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Phone, FileText, BookOpen, Clock, Shield, BarChart3 } from 'lucide-react'
import { SEOHead, createArticleSchema, createBreadcrumbSchema, createFAQSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import iglooProImage from '../assets/Igloo-pro-frontal.webp'

const S3LeitliniePage = () => {
  // Author data for E-E-A-T
  const author = {
    name: 'PolarisDX Redaktionsteam',
    type: 'Organization' as const,
    url: 'https://polarisdx.net/about',
  }

  // FAQ data
  const faqItems = [
    {
      question: 'Ist der Vitamin-D-Schnelltest genauso genau wie ein Labortest?',
      answer:
        'Der Igloo Reader Pro erreicht im DEQAS-Ringversuch Klasse A und belegt weltweit Platz 2 mit einer Abweichung von ±3 bis 8 Prozent gegenüber der Referenzmethode. Diese Ergebnisse sind peer-reviewed und publiziert (Tseneva & Perić Kačarević, 2023). Ein POC-Test ist methodisch zwar nicht identisch mit der zentralen Laboranalytik, die S3-Leitlinie stuft validierte Schnelltests jedoch als klinisch gleichwertige Diagnostikoption ein.',
    },
    {
      question: 'Wer darf den Vitamin-D-Test in der Zahnarztpraxis durchführen?',
      answer:
        'Die kapilläre Blutentnahme aus der Fingerbeere und die Bedienung des Igloo Reader Pro sind vollständig an zahnmedizinische Fachangestellte (ZFA) oder Dentalhygienikerinnen (DH) delegierbar. Für den Test selbst ist keine Arztbeteiligung erforderlich. Die Interpretation der Ergebnisse und die daraus abgeleiteten Therapieentscheidungen obliegen selbstverständlich dem Zahnarzt.',
    },
    {
      question: 'Wie wird der Vitamin-D-Test als IGeL abgerechnet?',
      answer:
        'Die Vitamin-D-Bestimmung in der Zahnarztpraxis ist keine GKV-Leistung und wird als individuelle Gesundheitsleistung (IGeL) nach §6 Abs. 1 GOÄ als Verlangensleistung abgerechnet. Die Bruttomarge liegt bei ca. 50 € pro Test. Vor der Testdurchführung sind eine schriftliche Patienteneinwilligung und die Aufklärung über den Selbstzahlercharakter erforderlich.',
    },
    {
      question: 'Was empfiehlt die S3-Leitlinie zu POC-Tests vor einer Implantation?',
      answer:
        'Die S3-Leitlinie „Vitamin D in der Implantologie" (AWMF 083-055, August 2025) empfiehlt eine individualisierte Diagnostik bei Risikopatienten vor Implantation. Quantitative In-Office-Schnelltests werden als gleichwertige Option zur Labordiagnostik eingestuft, sofern sie anerkannte Qualitätskriterien wie die DEQAS-Klasse-A-Einstufung erfüllen. Ein generelles Screening aller Patienten wird nicht empfohlen.',
    },
    {
      question: 'Welche weiteren Biomarker kann der Igloo Reader Pro messen?',
      answer:
        'Neben 25-OH-Vitamin-D stehen über 140 kalibrierte Tests zur Verfügung, darunter HbA1c für das Diabetes-Screening vor PA-Therapie, CRP als Entzündungsmarker, Ferritin, Cortisol, TSH, ein Lipidpanel (5-in-1), Testosteron und aMMP-8 als spezifischer Parodontitis-Marker. Die offene Plattform mit Tests von über 30 Herstellern macht den Igloo Reader Pro zu einem erweiterbaren diagnostischen Profit-Center für Ihre Praxis.',
    },
  ]

  // HowTo schema
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Vitamin-D-Diagnostik in der Zahnarztpraxis – 5 Schritte',
    description:
      'Schritt-für-Schritt-Anleitung zur Integration der Vitamin-D-Bestimmung vor Implantation in Ihren Praxisablauf.',
    totalTime: 'PT5M',
    supply: [
      { '@type': 'HowToSupply', name: 'Vitamin-D-Testkassette (25-OH-D)' },
      { '@type': 'HowToSupply', name: 'Igloo Reader Pro POC-Gerät' },
      { '@type': 'HowToSupply', name: 'Lanzette für kapilläre Blutentnahme' },
    ],
    tool: [{ '@type': 'HowToTool', name: 'Igloo Reader Pro' }],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Risikoeinschätzung',
        text: 'Identifizieren Sie bei der Anamneseerhebung relevante Risikofaktoren: Osteoporose, Malabsorptionssyndrome, saisonaler Mangel bei geringer Sonnenexposition, dunkler Hauttyp, Diabetes mellitus oder bekannte Vitamin-D-Mangel-Anamnese.',
        url: 'https://polarisdx.net/s3_leitlinie#workflow',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Kapilläre Blutentnahme',
        text: 'Die ZFA entnimmt einen Tropfen Kapillarblut aus der Fingerbeere – ca. 10 Mikroliter genügen. Vollständig an ZFA oder DH delegierbar.',
        url: 'https://polarisdx.net/s3_leitlinie#workflow',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Testkassette einlegen',
        text: 'Die befüllte Testkassette wird in den Igloo Reader Pro eingelegt. Das Gerät erkennt den Testtyp automatisch und startet die Messung.',
        url: 'https://polarisdx.net/s3_leitlinie#workflow',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Ergebnis in unter 3 Minuten',
        text: 'Der quantitative 25-OH-Vitamin-D-Wert erscheint auf dem Display und wird gleichzeitig in die Cloud-App übertragen. Besprechen Sie das Ergebnis direkt am Behandlungsstuhl mit dem Patienten.',
        url: 'https://polarisdx.net/s3_leitlinie#workflow',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Therapieentscheidung dokumentieren',
        text: 'Bei ausreichenden Werten kann die Implantation wie geplant erfolgen. Bei Mangel wird eine Supplementierung eingeleitet und ein Kontrolltermin in 3–6 Monaten vor dem Eingriff vereinbart.',
        url: 'https://polarisdx.net/s3_leitlinie#workflow',
      },
    ],
  }

  return (
    <PageTransition>
      <SEOHead
        title="Vitamin D in der Implantologie – S3-Leitlinie & POC-Diagnostik | PolarisDX"
        description="S3-leitlinienkonforme Vitamin-D-Schnelldiagnostik für die Zahnarztpraxis: Evidenz, Indikation vor Implantation & POC-Diagnostik mit Ergebnis in unter 3 Minuten."
        ogType="article"
        keywords={[
          'Vitamin D Implantologie',
          'S3-Leitlinie Vitamin D Implantologie',
          'Vitamin-D-Mangel Zahnimplantat',
          'Vitamin-D-Schnelltest Zahnarzt',
          'POC-Diagnostik Zahnarztpraxis',
          'Vitamin-D-Test vor Implantation',
          'Vitamin D Osseointegration',
          'Chairside-Bluttest Zahnarzt',
          'IGeL Vitamin-D-Test Zahnarzt',
          'Vitamin D Parodontitis',
        ]}
        article={{
          publishedTime: '2026-02-26',
          author: 'PolarisDX Redaktionsteam',
          section: 'Dentale Diagnostik',
        }}
        structuredData={[
          createArticleSchema({
            headline: 'Vitamin D in der Implantologie – S3-Leitlinie & POC-Diagnostik für die Zahnarztpraxis',
            description:
              'S3-leitlinienkonforme Vitamin-D-Schnelldiagnostik für die Zahnarztpraxis: Evidenz, Indikation vor Implantation & POC-Diagnostik mit Ergebnis in unter 3 Minuten.',
            image: '/og-image.jpg',
            url: '/s3_leitlinie',
            datePublished: '2026-02-26',
            dateModified: '2026-02-26',
            articleType: 'MedicalWebPage',
            author: author,
          }),
          createBreadcrumbSchema([
            { name: 'PolarisDX', url: '/' },
            { name: 'Artikel', url: '/articles' },
            { name: 'Vitamin D & Implantologie – S3-Leitlinie', url: '/s3_leitlinie' },
          ]),
          createFAQSchema(faqItems),
          howToSchema,
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
              <div className="max-w-[900px] mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
                  <Link to="/" className="hover:text-brand-secondary transition-colors">
                    PolarisDX
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <Link to="/articles" className="hover:text-brand-secondary transition-colors">
                    Artikel
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="text-white/80">Vitamin D & Implantologie</span>
                </nav>

                {/* Category Label */}
                <p className="mb-4 text-xs font-semibold uppercase tracking-[1.2px] text-brand-secondary">
                  Dentale Diagnostik
                </p>

                {/* H1 */}
                <h1 className="mb-5 text-2xl font-medium tracking-tight sm:text-3xl lg:text-[2.25rem] lg:leading-[1.2]">
                  Vitamin D in der Implantologie – S3-Leitlinie &amp; POC-Diagnostik für die Zahnarzt&shy;praxis
                </h1>

                {/* Subtitle */}
                <p className="mb-6 text-base text-white/80 sm:text-lg lg:text-xl">
                  Warum Testen allein nicht reicht – und wie Chairside-Diagnostik mit leitlinienkonformer POC-Analytik Ihre Implantatergebnisse verbessert.
                </p>

                {/* Meta with E-E-A-T */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60">
                  <span>Lesezeit: 7 Minuten</span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span>Aktualisiert: Februar 2026</span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span>PolarisDX Redaktionsteam</span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Main Content with Sidebar */}
        <div className="mx-auto max-w-[1200px] px-4 py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">
            {/* Main Article Column */}
            <article>
              <Reveal width="100%">
                {/* Author Box - E-E-A-T Signal */}
                <div className="mb-10 flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary font-semibold text-lg">
                    PX
                  </div>
                  <p className="text-sm font-medium text-gray-900">PolarisDX Redaktionsteam</p>
                </div>

                {/* Section 1: Einleitung */}
                <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                  <p>
                    Rund 30 Prozent der Erwachsenen in Deutschland sind unzureichend mit Vitamin D versorgt – entsprechend
                    einem 25-OH-Vitamin-D-Spiegel unter 30 nmol/l (12 ng/ml). In den Wintermonaten verschärft sich die Lage
                    erheblich: Etwa 60 Prozent erreichen keine ausreichenden Serumwerte (Quelle: Robert Koch-Institut, DEGS1).
                    Für die <strong>Vitamin-D-Diagnostik in der Implantologie</strong> hat das direkte Konsequenzen.
                  </p>
                  <p>
                    Vitamin D reguliert den Kalzium-Phosphat-Stoffwechsel und damit die Knochenmineralisation – genau den
                    Prozess, von dem eine erfolgreiche Osseointegration abhängt. Studien zeigen, dass ein{' '}
                    <strong>Vitamin-D-Mangel bei Zahnimplantaten</strong> mit einem signifikant erhöhten Risiko für
                    Frühverluste assoziiert ist. Patienten mit Serumwerten unter 20 ng/ml verlieren Implantate bis zu viermal
                    häufiger als Patienten mit ausreichenden Werten (Mangano et al., J Craniofac Surg 2018). Auch in der
                    Parodontologie spielt Vitamin D eine Rolle: Es moduliert die Immunantwort im Parodont und beeinflusst den
                    Attachmentverlust.
                  </p>
                  <p>
                    Trotz dieser Evidenz ist die Vitamin-D-Bestimmung in den meisten Zahnarztpraxen kein Standardbestandteil
                    des Protokolls vor Implantation. Das liegt weniger am fehlenden Willen als an praktischen Hürden:
                    Die konventionelle Labordiagnostik dauert zwei bis fünf Werktage, unterbricht den Planungsworkflow und
                    erfordert einen zusätzlichen Patiententermin. Seit August 2025 hat jedoch eine neue Leitlinie diese
                    Ausgangslage grundlegend verändert.
                  </p>
                </div>

                {/* Section 2: S3-Leitlinie */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Die S3-Leitlinie „Vitamin D und Zahnimplantologie" – Was sie für Ihre Praxis bedeutet
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Im August 2025 wurde unter Federführung der Deutschen Gesellschaft für Implantologie (DGI) und der
                      Deutschen Gesellschaft für Zahn-, Mund- und Kieferheilkunde (DGZMK) die erste{' '}
                      <strong>S3-Leitlinie zu Vitamin D in der Implantologie</strong> veröffentlicht (AWMF-Registernummer
                      083-055, Version 1.0). Neun weitere Fachgesellschaften waren an der Erstellung beteiligt. Eine
                      S3-Leitlinie repräsentiert die höchste Stufe der evidenzbasierten Leitlinienentwicklung in Deutschland:
                      Sie basiert auf einer systematischen Literaturrecherche, strukturierter Konsensfindung und gibt konkrete
                      Handlungsempfehlungen für die klinische Praxis.
                    </p>
                    <p>
                      Die Kernaussage: <strong>Differenziertes Vorgehen statt Routine-Screening</strong>. Nicht jeder Patient
                      benötigt vor einer Implantation einen Vitamin-D-Test. Risikopatienten profitieren jedoch eindeutig von
                      einer individualisierten Diagnostik.
                    </p>
                  </div>

                  {/* Evidence Box: 3 Kernempfehlungen */}
                  <div className="my-8 rounded-lg border-l-4 border-brand-primary bg-blue-50/70 p-6">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-primary">
                      Drei Kernempfehlungen
                    </p>
                    <ol className="space-y-3 text-[15px] leading-relaxed text-gray-700 list-decimal list-inside">
                      <li>
                        <strong>Individualisierte Diagnostik:</strong> Bestimmung des 25-OH-Vitamin-D-Status vor Implantation
                        bei Patienten mit definierten Risikofaktoren – Osteoporose, Diabetes mellitus, Malabsorptionssyndrome,
                        Bisphosphonat-Therapie, dunkler Hauttyp bei geringer Sonnenexposition und geriatrische Patienten.
                      </li>
                      <li>
                        <strong>In-Office-Schnelltests als gleichwertige Option:</strong> Die Leitlinie stuft quantitative
                        Point-of-Care-Tests mit nachgewiesener analytischer Qualität als gleichwertig zur konventionellen
                        Labordiagnostik ein – vorausgesetzt, das Testsystem erfüllt anerkannte Qualitätskriterien wie die
                        DEQAS-Klassifizierung.
                      </li>
                      <li>
                        <strong>Monitoring bei Supplementierung:</strong> Bei Einleitung einer Supplementierung nach
                        Mangelbefund empfiehlt die Leitlinie eine Serumspiegelkontrolle alle drei bis sechs Monate.
                        Zielwert: mindestens 30 ng/ml (75 nmol/l), idealerweise 40–60 ng/ml vor geplanter Implantatsetzung.
                      </li>
                    </ol>
                    <p className="mt-4 text-xs text-gray-500">
                      Quelle: AWMF-Leitlinie 083-055, Version 1.0 (Aug. 2025). Konsensusempfehlungen der DGI/DGZMK.
                    </p>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Die Frage ist nicht mehr, ob Vitamin-D-Diagnostik in der Implantologie sinnvoll ist – die Leitlinie
                      beantwortet das eindeutig. Die Frage ist, wie sich diese Diagnostik effizient in den Praxisalltag
                      integrieren lässt.
                    </p>
                  </div>
                </section>

                {/* Section 3: POC vs. Labor */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Warum POC statt Labor? Der Zeitvorteil am Behandlungsstuhl
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Der konventionelle Weg für die Vitamin-D-Bestimmung umfasst venöse Blutentnahme, Versand an ein externes
                      Labor und eine Wartezeit von zwei bis fünf Werktagen. Für den Praxisalltag bedeutet das: ein separater
                      Termin für die Blutentnahme, Warten auf Ergebnisse, dann Wiedereinbestellung des Patienten zur
                      Therapieentscheidung. Der <strong>Vitamin-D-Test in der Zahnarztpraxis</strong> scheitert oft nicht am
                      fehlenden klinischen Willen, sondern an der Logistik.
                    </p>
                    <p>
                      Ein Point-of-Care-Test (POC) verändert diesen Workflow grundlegend. Der{' '}
                      <strong>Vitamin-D-Schnelltest beim Zahnarzt</strong> liefert ein quantitatives Ergebnis in unter drei
                      Minuten – direkt am Behandlungsstuhl, aus einem Tropfen Kapillarblut. Statt Laborversand, Wartezeit und
                      Folgeterminen liegt das Ergebnis bereits während des Planungsgesprächs vor.
                    </p>
                  </div>

                  {/* Vergleichstabelle */}
                  <div className="my-8 overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">Kriterium</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">Labortest</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">POC-Schnelltest (Igloo Reader Pro)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Zeit bis zum Ergebnis</td>
                          <td className="px-4 py-3 text-gray-700">2–5 Werktage</td>
                          <td className="px-4 py-3 font-medium text-gray-900">&lt; 3 Minuten</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Probenversand</td>
                          <td className="px-4 py-3 text-gray-700">Ja (Blutentnahme → Kurier)</td>
                          <td className="px-4 py-3 font-medium text-gray-900">Nein (Chairside)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Therapieentscheidung</td>
                          <td className="px-4 py-3 text-gray-700">Verzögert (Folgetermin)</td>
                          <td className="px-4 py-3 font-medium text-gray-900">Sofort am Behandlungsstuhl</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Delegation</td>
                          <td className="px-4 py-3 text-gray-700">Blutentnahme durch Arzt/MFA</td>
                          <td className="px-4 py-3 font-medium text-gray-900">Delegierbar an ZFA/DH</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Genauigkeit (Bias)</td>
                          <td className="px-4 py-3 text-gray-700">±5–10 % (laborabhängig)</td>
                          <td className="px-4 py-3 font-medium text-gray-900">±3–8 % (DEQAS Klasse A)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Patienten-Compliance</td>
                          <td className="px-4 py-3 text-gray-700">Laborbesuch erforderlich</td>
                          <td className="px-4 py-3 font-medium text-gray-900">Kein zusätzlicher Termin</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Ein weiterer Vorteil für die Praxisorganisation: Das gesamte Testverfahren ist an zahnmedizinische
                      Fachangestellte oder Dentalhygienikerinnen delegierbar. Die ZFA entnimmt die Probe und startet die
                      Messung, während Sie den nächsten Patienten behandeln. Kein Workflow-Unterbruch, kein Logistik-Overhead,
                      kein Informationsverlust zwischen Labor und Praxis.
                    </p>
                  </div>
                </section>

                {/* Section 4: Igloo Reader Pro */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Igloo Reader Pro – Das POC-Diagnostiksystem für Zahnarztpraxen
                  </h2>

                  <h3 className="mt-8 mb-4 text-lg font-semibold text-gray-900">
                    Technologie & Spezifikationen
                  </h3>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Der Igloo Reader Pro ist ein kompaktes <strong>POC-Diagnostikgerät für Zahnarztpraxen</strong>,
                      entwickelt speziell für den Einsatz in Arztpraxen und dezentralen Behandlungsumgebungen. Mit nur
                      87,5 × 87,5 × 91 mm und 290 Gramm passt er auf jeden Behandlungstisch.
                    </p>
                  </div>

                  {/* Feature Grid */}
                  <div className="my-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-brand-primary" />
                        <p className="text-sm font-semibold text-gray-900">5 Messtechnologien</p>
                      </div>
                      <p className="text-xs text-gray-600">Kolorimetrie, Immunfluoreszenz, Mikrofluide, Quantenpunkte, Trockenchemie</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-brand-primary" />
                        <p className="text-sm font-semibold text-gray-900">140+ kalibrierte Tests</p>
                      </div>
                      <p className="text-xs text-gray-600">Von über 30 Herstellern, kompatibel mit ca. 90 % aller Lateral-Flow-Tests</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-brand-primary" />
                        <p className="text-sm font-semibold text-gray-900">24 Stunden Akkulaufzeit</p>
                      </div>
                      <p className="text-xs text-gray-600">Mobil einsetzbar für Hausbesuche oder Zweigpraxen</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-brand-primary" />
                        <p className="text-sm font-semibold text-gray-900">CE- & IVDR-konform</p>
                      </div>
                      <p className="text-xs text-gray-600">WiFi, Bluetooth, USB-C, API-Integration (PVS/LIS-kompatibel)</p>
                    </div>
                  </div>

                  <h3 className="mt-10 mb-4 text-lg font-semibold text-gray-900">
                    DEQAS-validierte Messqualität
                  </h3>

                  {/* DEQAS Metrics Box */}
                  <div className="my-6 rounded-lg border-l-4 border-emerald-500 bg-emerald-50/70 p-6">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">
                      Zentrale Leistungskennzahlen
                    </p>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">#2</p>
                        <p className="text-xs text-gray-600">Weltweit im DEQAS-Ranking (Klasse A)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">±3–8 %</p>
                        <p className="text-xs text-gray-600">Bias vs. Referenzmethode</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">&lt;2 %</p>
                        <p className="text-xs text-gray-600">VK Inter-Reader-Präzision</p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-500">
                      Peer-reviewed: Tseneva &amp; Perić Kačarević, Int. Journal of Dental Biomaterials Research, 2023,
                      DOI: 10.56939/DBR23136t
                    </p>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Im DEQAS-Ringversuch – dem internationalen Referenzprogramm für Vitamin-D-Analytik – belegt der Igloo
                      Reader Pro weltweit Platz 2 und erreicht die Klasse-A-Einstufung. Damit liegt er direkt hinter LC-MS/MS,
                      dem Goldstandard der Laboranalytik. Diese Werte befinden sich auf klinischem Laborniveau und erfüllen die
                      Qualitätsanforderungen, die die S3-Leitlinie an In-Office-Testsysteme stellt.
                    </p>
                    <p>
                      <Link to="/igloo-pro" className="font-semibold text-brand-primary hover:underline">
                        Alle Igloo Reader Pro Spezifikationen ansehen
                      </Link>
                    </p>
                  </div>
                </section>

                {/* Mid-CTA: Diagnostiksystem mit Bild */}
                <div className="my-10 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-2/5">
                      <img
                        src={iglooProImage}
                        alt="IglooPro POC-Reader für Vitamin-D-Diagnostik am Behandlungsstuhl in der Zahnarztpraxis"
                        width={400}
                        height={400}
                        className="h-48 w-full object-contain bg-gray-50 p-4 sm:h-full"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-6 sm:w-3/5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-primary">
                        Vitamin-D-Diagnostik in der Praxis
                      </p>
                      <p className="mb-3 text-base font-medium text-gray-900">
                        Bestimmen Sie den 25-OH-Vitamin-D-Spiegel direkt am Behandlungsstuhl – in unter 15 Minuten.
                      </p>
                      <Link
                        to="/igloo-pro"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
                      >
                        Mehr zum Igloo Pro System erfahren
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Section 5: Wirtschaftlichkeit */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Wirtschaftlichkeit: IGeL-Abrechnung und ROI für Ihre Praxis
                  </h2>

                  <h3 className="mt-8 mb-4 text-lg font-semibold text-gray-900">
                    Vitamin-D-Bestimmung als IGeL abrechnen
                  </h3>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Die Vitamin-D-Bestimmung in der Zahnarztpraxis ist keine GKV-Leistung. Sie wird als individuelle
                      Gesundheitsleistung (IGeL) nach §6 Abs. 1 GOÄ als Verlangensleistung abgerechnet. Für Sie als
                      Praxisinhaber bedeutet das: Volle Erstattung ohne Budgetdeckelung, kein Regressrisiko und eine
                      Bruttomarge von ca. <strong>50 € pro Test</strong> bei Standardkalkulation. Das sind rund 15 € über
                      der Marge vergleichbarer Wettbewerbsprodukte – eine Differenz, die sich über das Jahr summiert.
                    </p>
                  </div>

                  <h3 className="mt-10 mb-4 text-lg font-semibold text-gray-900">
                    ROI-Kalkulation: Amortisation in 8–12 Wochen
                  </h3>

                  {/* ROI Box */}
                  <div className="my-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="grid gap-4 sm:grid-cols-3 text-center">
                      <div>
                        <p className="text-2xl font-bold text-brand-primary">3 Tests/Woche</p>
                        <p className="text-xs text-gray-600">Konservative Annahme</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-brand-primary">600 €/Monat</p>
                        <p className="text-xs text-gray-600">Zusätzlicher Bruttoumsatz</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-brand-primary">8–12 Wochen</p>
                        <p className="text-xs text-gray-600">Amortisationsdauer</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Der eigentliche Treiber ist nicht nur der Ersttest, sondern das Monitoring: Patienten unter
                      Supplementierung kommen gemäß Leitlinienempfehlung alle drei bis sechs Monate zur Kontrollmessung.
                      Das generiert einen wiederkehrenden Umsatzstrom aus Ihrem bestehenden Patientenstamm – ohne
                      Neupatientenakquise. Die Vitamin-D-Diagnostik in der Implantologie wird so zu einer der wenigen
                      IGeL-Leistungen, die klinischen Nutzen mit nachhaltigem wirtschaftlichem Ertrag verbindet.
                    </p>
                    <p>
                      Mit weiteren Biomarkern (HbA1c, CRP, Ferritin, Cortisol, TSH) entwickelt sich das POC-Gerät zum{' '}
                      <Link to="/diagnostics/dental" className="font-semibold text-brand-primary hover:underline">
                        erweiterbaren diagnostischen Profit-Center für Ihre Praxis
                      </Link>.
                    </p>
                  </div>
                </section>

                {/* Section 6: 5-Schritte-Workflow */}
                <section id="workflow" className="mt-12 scroll-mt-24">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Praxis-Workflow: Vitamin-D-Diagnostik in 5 Schritten
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700 mb-8">
                    <p>
                      Die Integration der <strong>Vitamin-D-Bestimmung vor Implantation</strong> in den Praxisalltag ist
                      unkompliziert und vollständig an ZFA oder DH delegierbar.
                    </p>
                  </div>

                  {/* 5-Schritte-Karten */}
                  <div className="space-y-4">
                    {[
                      {
                        step: 1,
                        title: 'Risikoeinschätzung',
                        description:
                          'Identifizieren Sie bei der Anamneseerhebung relevante Risikofaktoren: Osteoporose, Malabsorptionssyndrome, saisonaler Mangel bei geringer Sonnenexposition, dunkler Hauttyp, Diabetes mellitus oder bekannte Vitamin-D-Mangel-Anamnese.',
                      },
                      {
                        step: 2,
                        title: 'Kapilläre Blutentnahme',
                        description:
                          'Die ZFA entnimmt einen Tropfen Kapillarblut aus der Fingerbeere – ca. 10 Mikroliter genügen.',
                      },
                      {
                        step: 3,
                        title: 'Testkassette einlegen',
                        description:
                          'Die befüllte Testkassette wird in den Igloo Reader Pro eingelegt. Das Gerät erkennt den Testtyp automatisch und startet die Messung.',
                      },
                      {
                        step: 4,
                        title: 'Ergebnis in unter 3 Minuten',
                        description:
                          'Der quantitative 25-OH-Vitamin-D-Wert erscheint auf dem Display und wird gleichzeitig in die Cloud-App übertragen. Besprechen Sie das Ergebnis direkt am Behandlungsstuhl mit dem Patienten.',
                      },
                      {
                        step: 5,
                        title: 'Therapieentscheidung dokumentieren',
                        description:
                          'Bei ausreichenden Werten kann die Implantation wie geplant erfolgen. Bei Mangel wird eine Supplementierung eingeleitet und ein Kontrolltermin in 3–6 Monaten vor dem Eingriff vereinbart.',
                      },
                    ].map((item) => (
                      <div key={item.step} className="flex gap-4 rounded-lg border border-gray-200 bg-white p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white font-bold text-sm">
                          {item.step}
                        </div>
                        <div>
                          <h3 className="mb-1 text-base font-semibold text-gray-900">{item.title}</h3>
                          <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Der gesamte <strong>Vitamin-D-Schnelltest beim Zahnarzt</strong> – von der kapillären Blutentnahme
                      bis zum dokumentierten Ergebnis – dauert unter fünf Minuten und integriert sich nahtlos in den
                      Planungstermin oder das Erstgespräch.
                    </p>
                  </div>
                </section>

                {/* Section 7: D3-Spray */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Polaris Vitamin D3 Spray – Diagnostik und Therapie aus einer Hand
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Zeigt der Test einen Mangel an, endet der Therapiepfad in vielen Praxen mit einer mündlichen
                      Supplementierungsempfehlung. Der Patient beschafft sich dann eigenständig ein Präparat – oder eben nicht.
                      Mit dem{' '}
                      <Link to="/vitamin-d3-implantologie" className="font-semibold text-brand-primary hover:underline">
                        Polaris Vitamin D3+K2 Mundspray
                      </Link>{' '}
                      schließen Sie diese Lücke direkt im Beratungsgespräch. Das Spray kombiniert hochdosiertes Vitamin D3 mit
                      Vitamin K2 (MK-7), das über die Osteocalcin-Aktivierung die gezielte Kalziumeinlagerung in die
                      Knochenmatrix fördert.
                    </p>
                    <p>
                      Als Praxis-Dispensierprodukt generiert das Spray zusätzlichen Umsatz pro Patient bei null zusätzlichen
                      Arbeitsschritten. Die Kombination aus Diagnostik und Supplementierung aus einer Hand erhöht die
                      Patientenbindung und stellt sicher, dass der Therapieplan auch tatsächlich umgesetzt wird.
                    </p>
                  </div>
                </section>

                {/* Section 8: Validierung & Partner */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Klinische Validierung und Partnerpraxen in der Implantologie
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Das Igloo Pro System ist bereits in über 100 Praxen in mehr als 15 Ländern im Einsatz.
                      Zu den Kooperationspartnern zählen renommierte Institutionen der Implantologie und Forschung:
                    </p>
                  </div>

                  {/* Partner Grid */}
                  <div className="my-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="text-sm font-semibold text-gray-900">Nobel Biocare / Envista</p>
                      <p className="text-xs text-gray-600">Weltmarktführer in der Implantologie – Kooperation für Chairside-Diagnostik-Workflows</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="text-sm font-semibold text-gray-900">Swiss Dental Solutions & Imperial College London</p>
                      <p className="text-xs text-gray-600">Gemeinsame Forschung zu POC-Diagnostik in der Zahnmedizin</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="text-sm font-semibold text-gray-900">ndu Clinic, 22 Harley Street, London</p>
                      <p className="text-xs text-gray-600">Klinischer Einsatz im Segment der biologischen Premium-Zahnmedizin</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="text-sm font-semibold text-gray-900">100+ Praxen in 15+ Ländern</p>
                      <p className="text-xs text-gray-600">Etablierte Präsenz in Europa, Nahost und Asien</p>
                    </div>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Diese Partnerschaften zeigen, dass leitlinienkonforme POC-Diagnostik in der implantologischen Praxis
                      angekommen ist.
                    </p>
                  </div>
                </section>

                {/* Section 9: CTA */}
                <section className="mt-12">
                  <div className="rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep p-8 text-white">
                    <h2 className="mb-4 text-xl font-semibold sm:text-2xl">
                      Bereit für leitlinienkonforme Diagnostik in Ihrer Praxis?
                    </h2>
                    <p className="mb-6 text-base text-white/90">
                      Die Vitamin-D-Diagnostik in der Implantologie steht auf einem soliden Fundament: Die S3-Leitlinie gibt
                      den Rahmen vor, der Igloo Reader Pro liefert die Technologie und das IGeL-Modell sichert die
                      Wirtschaftlichkeit. Vereinbaren Sie ein kostenloses Beratungsgespräch und erfahren Sie, wie sich das
                      System in Ihren spezifischen Praxisablauf integriert.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link
                        to="/contact"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-deep transition-colors hover:bg-gray-50"
                      >
                        Kostenlose Beratung vereinbaren
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <a
                        href="tel:+4915175011699"
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                      >
                        <Phone className="h-4 w-4" />
                        +49 151 75011699
                      </a>
                    </div>
                    <p className="mt-4 text-xs text-white/60">
                      Kostenlose Beratung – unverbindlich – ca. 15 Minuten
                    </p>
                  </div>
                </section>

                {/* Section 10: FAQ */}
                <section className="mt-12 border-t border-gray-200 pt-10">
                  <h2 className="mb-8 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Häufige Fragen zur Vitamin-D-Diagnostik in der Zahnarztpraxis
                  </h2>

                  <div className="space-y-8">
                    {faqItems.map((faq, index) => (
                      <div key={index}>
                        <h3 className="mb-3 text-base font-semibold text-gray-900">{faq.question}</h3>
                        <p className="text-[15px] leading-relaxed text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Zurück-Link */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                  <Link
                    to="/articles"
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    Zurück zu den Artikeln
                  </Link>
                </div>
              </Reveal>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Telefon-Kontaktbox */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10">
                      <Phone className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Fragen?</p>
                      <p className="text-xs text-gray-500">Wir helfen gerne weiter</p>
                    </div>
                  </div>
                  <a
                    href="tel:+4915175011699"
                    className="flex items-center justify-center gap-2 rounded-md bg-brand-primary/10 px-4 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/20"
                  >
                    <Phone className="h-4 w-4" />
                    +49 151 75011699
                  </a>
                  <p className="mt-2 text-center text-xs text-gray-500">Mo–Fr 9:00–17:00 MEZ</p>
                </div>

                {/* CTA Box */}
                <div className="rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep p-5 text-white">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-secondary">
                    Kostenlose Beratung
                  </p>
                  <p className="mb-4 text-sm">
                    Erfahren Sie, wie sich der Igloo Reader Pro in Ihren Implantologie-Workflow integriert.
                  </p>
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-brand-deep transition-colors hover:bg-gray-50"
                  >
                    Demo vereinbaren
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Verwandte Artikel */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <BookOpen className="h-4 w-4 text-brand-primary" />
                    Verwandte Inhalte
                  </p>
                  <div className="space-y-3">
                    <Link
                      to="/vitamin-d3-implantologie"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-brand-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-brand-primary">
                          Vitamin D3 & Implantologie
                        </p>
                        <p className="text-xs text-gray-500">D3+K2-Supplementierungsevidenz</p>
                      </div>
                    </Link>
                    <Link
                      to="/igloo-pro"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-brand-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-brand-primary">
                          Igloo Pro System
                        </p>
                        <p className="text-xs text-gray-500">Vitamin-D-Diagnostik am Behandlungsstuhl</p>
                      </div>
                    </Link>
                    <Link
                      to="/diagnostics/dental"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-green-50 text-green-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-brand-primary">
                          POC-Diagnostik für Zahnarztpraxen
                        </p>
                        <p className="text-xs text-gray-500">Vollständiges Biomarker-Portfolio</p>
                      </div>
                    </Link>
                    <Link
                      to="/articles/die-5-minuten-diagnose"
                      className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-brand-primary">
                          Die 5-Minuten-Diagnose
                        </p>
                        <p className="text-xs text-gray-500">Wirtschaftlichkeit der Schnelldiagnostik</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Trust Signal */}
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <p className="text-xs text-gray-500">
                    Über <span className="font-semibold text-gray-700">100 Praxen</span> in 15+ Ländern vertrauen PolarisDX
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white p-4 shadow-lg lg:hidden">
        <Link
          to="/contact"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg"
        >
          Kostenlose Beratung vereinbaren
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Mobile bottom padding for sticky CTA */}
      <div className="h-20 lg:hidden" />
    </PageTransition>
  )
}

export default S3LeitliniePage
