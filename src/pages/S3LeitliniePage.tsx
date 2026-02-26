import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Phone, FileText, BookOpen, Clock, Shield, BarChart3 } from 'lucide-react'
import { SEOHead, createArticleSchema, createBreadcrumbSchema, createFAQSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import iglooProImage from '../assets/Igloo-pro-frontal.webp'

const S3LeitliniePage = () => {
  // Author data for E-E-A-T
  const author = {
    name: 'PolarisDX Editorial Team',
    type: 'Organization' as const,
    url: 'https://polarisdx.net/about',
  }

  // FAQ data
  const faqItems = [
    {
      question: 'Is the vitamin D rapid test as accurate as a laboratory test?',
      answer:
        'The Igloo Reader Pro achieves Class A in the DEQAS proficiency testing scheme and ranks 2nd worldwide with a bias of ±3 to 8 percent compared to the reference method. These results are peer-reviewed and published (Tseneva & Perić Kačarević, 2023). While a POC test is methodologically not identical to central laboratory analytics, the S3 guideline classifies validated rapid tests as a clinically equivalent diagnostic option.',
    },
    {
      question: 'Who is allowed to perform the vitamin D test in the dental practice?',
      answer:
        'Capillary blood collection from the fingertip and operation of the Igloo Reader Pro can be fully delegated to dental assistants or dental hygienists. No physician involvement is required for the test itself. The interpretation of results and subsequent treatment decisions naturally remain with the dentist.',
    },
    {
      question: 'How is the vitamin D test billed as a private health service (IGeL)?',
      answer:
        'Vitamin D testing in the dental practice is not covered by statutory health insurance and is billed as an individual health service (IGeL) under §6 para. 1 GOÄ (fee schedule for physicians). The gross margin is approximately €50 per test. Written patient consent and disclosure of the self-pay nature are required prior to testing.',
    },
    {
      question: 'What does the S3 guideline recommend regarding POC tests before implantation?',
      answer:
        'The S3 guideline "Vitamin D in Implantology" (AWMF 083-055, August 2025) recommends individualized diagnostics for at-risk patients before implantation. Quantitative in-office rapid tests are classified as an equivalent option to laboratory testing, provided they meet recognized quality criteria such as DEQAS Class A. Routine screening of all patients is not recommended.',
    },
    {
      question: 'What other biomarkers can the Igloo Reader Pro measure?',
      answer:
        'In addition to 25-OH vitamin D, over 140 calibrated tests are available, including HbA1c for diabetes screening before periodontal therapy, CRP as an inflammation marker, ferritin, cortisol, TSH, a lipid panel (5-in-1), testosterone, and aMMP-8 as a specific periodontitis marker. The open platform with tests from 30+ manufacturers makes the Igloo Reader Pro an expandable diagnostic profit center for your practice.',
    },
  ]

  // HowTo schema (no helper exists, so inline)
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Vitamin D Diagnostics in the Dental Practice – 5 Steps',
    description:
      'Step-by-step guide for integrating vitamin D testing before implantation into your practice workflow.',
    totalTime: 'PT5M',
    supply: [
      { '@type': 'HowToSupply', name: 'Vitamin D test cassette (25-OH-D)' },
      { '@type': 'HowToSupply', name: 'Igloo Reader Pro POC device' },
      { '@type': 'HowToSupply', name: 'Lancet for capillary blood collection' },
    ],
    tool: [{ '@type': 'HowToTool', name: 'Igloo Reader Pro' }],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Risk Assessment',
        text: 'During medical history intake, identify relevant risk factors: osteoporosis, malabsorption syndromes, seasonal deficiency with limited sun exposure, dark skin type, diabetes mellitus, or known vitamin D deficiency history.',
        url: 'https://polarisdx.net/s3_leitlinie#workflow',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Capillary Blood Collection',
        text: 'The dental assistant collects a drop of capillary blood from the fingertip – approximately 10 microliters is sufficient. Fully delegable to dental assistants or hygienists.',
        url: 'https://polarisdx.net/s3_leitlinie#workflow',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Insert Test Cassette',
        text: 'The filled test cassette is inserted into the Igloo Reader Pro. The device automatically recognizes the test type and starts the measurement.',
        url: 'https://polarisdx.net/s3_leitlinie#workflow',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Result in Under 3 Minutes',
        text: 'The quantitative 25-OH vitamin D value appears on the display and is simultaneously transferred to the cloud app. Discuss the result with the patient chairside.',
        url: 'https://polarisdx.net/s3_leitlinie#workflow',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Document Treatment Decision',
        text: 'If levels are sufficient, implantation can proceed as planned. If deficient, initiate supplementation and schedule a monitoring appointment in 3–6 months before performing the procedure.',
        url: 'https://polarisdx.net/s3_leitlinie#workflow',
      },
    ],
  }

  return (
    <PageTransition>
      <SEOHead
        title="Vitamin D in Implantology – S3 Guideline & POC Testing | PolarisDX"
        description="S3-guideline-compliant vitamin D rapid test for the dental practice: evidence, indication before implantation & POC diagnostics with results in under 3 minutes."
        ogType="article"
        keywords={[
          'vitamin D implantology',
          'S3 guideline vitamin D implantology',
          'vitamin D deficiency dental implant',
          'vitamin D rapid test dentist',
          'POC diagnostics dental practice',
          'vitamin D testing before implantation',
          'vitamin D osseointegration',
          'chairside blood test dentist',
          'IGeL vitamin D test dentist',
          'vitamin D periodontitis',
        ]}
        article={{
          publishedTime: '2026-02-26',
          author: 'PolarisDX Editorial Team',
          section: 'Dental Diagnostics',
        }}
        structuredData={[
          createArticleSchema({
            headline: 'Vitamin D in Implantology – S3 Guideline & POC Diagnostics for the Dental Practice',
            description:
              'S3-guideline-compliant vitamin D rapid test for the dental practice: evidence, indication before implantation & POC diagnostics with results in under 3 minutes.',
            image: '/og-image.jpg',
            url: '/s3_leitlinie',
            datePublished: '2026-02-26',
            dateModified: '2026-02-26',
            articleType: 'MedicalWebPage',
            author: author,
          }),
          createBreadcrumbSchema([
            { name: 'PolarisDX', url: '/' },
            { name: 'Articles', url: '/articles' },
            { name: 'Vitamin D & Implantology – S3 Guideline', url: '/s3_leitlinie' },
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
                    Articles
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="text-white/80">Vitamin D & Implantology</span>
                </nav>

                {/* Category Label */}
                <p className="mb-4 text-xs font-semibold uppercase tracking-[1.2px] text-brand-secondary">
                  Dental Diagnostics
                </p>

                {/* H1 */}
                <h1 className="mb-5 text-2xl font-medium tracking-tight sm:text-3xl lg:text-[2.25rem] lg:leading-[1.2]">
                  Vitamin D in Implantology – S3 Guideline &amp; POC Diagnostics for the Dental&nbsp;Practice
                </h1>

                {/* Subtitle */}
                <p className="mb-6 text-base text-white/80 sm:text-lg lg:text-xl">
                  Why testing alone isn't enough – and how chairside diagnostics with guideline-compliant POC testing improves your implant outcomes.
                </p>

                {/* Meta with E-E-A-T */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60">
                  <span>Reading time: 7 minutes</span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span>Updated: February 2026</span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span>PolarisDX Editorial Team</span>
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
                  <p className="text-sm font-medium text-gray-900">PolarisDX Editorial Team</p>
                </div>

                {/* Section 1: Introduction */}
                <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                  <p>
                    Around 30 percent of adults in Germany are insufficiently supplied with vitamin D – corresponding to a
                    25-OH vitamin D level below 30 nmol/l (12 ng/ml). During winter months, the situation worsens considerably:
                    approximately 60 percent fail to reach adequate serum levels (Source: Robert Koch Institute, DEGS1).
                    For <strong>vitamin D diagnostics in implantology</strong>, this has direct consequences.
                  </p>
                  <p>
                    Vitamin D regulates calcium-phosphate metabolism and thereby bone mineralization – precisely the process
                    that successful osseointegration depends on. Studies show that a <strong>vitamin D deficiency with dental
                    implants</strong> is associated with a significantly increased risk of early failures. Patients with serum
                    levels below 20 ng/ml lose implants up to four times more frequently than patients with adequate levels
                    (Mangano et al., J Craniofac Surg 2018). Vitamin D also plays a role in periodontology: it modulates
                    the immune response in the periodontium and influences attachment loss.
                  </p>
                  <p>
                    Despite this evidence, vitamin D testing is rarely part of the standard protocol before implantation in
                    most dental practices. This is less about willingness than practical barriers: conventional laboratory
                    diagnostics take two to five working days, interrupt the planning workflow, and require an additional
                    patient appointment. Since August 2025, however, a new guideline has fundamentally changed this landscape.
                  </p>
                </div>

                {/* Section 2: S3 Guideline */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    The S3 Guideline "Vitamin D and Dental Implantology" – What It Means for Your Practice
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      In August 2025, the first <strong>S3 guideline on vitamin D in implantology</strong> was published under
                      the leadership of the German Association for Implantology (DGI) and the German Society for Dental,
                      Oral and Maxillofacial Medicine (DGZMK) (AWMF Registry Number 083-055, Version 1.0). Nine additional
                      professional societies participated in its development. An S3 guideline represents the highest level
                      of evidence-based guideline development in Germany: it is based on a systematic literature review,
                      structured consensus-building, and provides concrete recommendations for clinical practice.
                    </p>
                    <p>
                      The core message: <strong>differentiated approach instead of routine screening</strong>. Not every
                      patient requires a vitamin D test before implantation. But at-risk patients clearly benefit from
                      individualized diagnostics.
                    </p>
                  </div>

                  {/* Evidence Box: 3 Key Recommendations */}
                  <div className="my-8 rounded-lg border-l-4 border-brand-primary bg-blue-50/70 p-6">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-primary">
                      Three Key Recommendations
                    </p>
                    <ol className="space-y-3 text-[15px] leading-relaxed text-gray-700 list-decimal list-inside">
                      <li>
                        <strong>Individualized diagnostics:</strong> Determine 25-OH vitamin D status before implantation in
                        patients with defined risk factors – osteoporosis, diabetes mellitus, malabsorption syndromes,
                        bisphosphonate therapy, dark skin type with limited sun exposure, and geriatric patients.
                      </li>
                      <li>
                        <strong>In-office rapid tests as an equivalent option:</strong> The guideline classifies quantitative
                        point-of-care tests with proven analytical quality as equivalent to conventional laboratory diagnostics
                        – provided the test system meets recognized quality criteria such as DEQAS classification.
                      </li>
                      <li>
                        <strong>Monitoring during supplementation:</strong> When supplementation is initiated following a
                        deficiency finding, the guideline recommends serum level monitoring every three to six months.
                        Target: at least 30 ng/ml (75 nmol/l), ideally 40–60 ng/ml before planned implant insertion.
                      </li>
                    </ol>
                    <p className="mt-4 text-xs text-gray-500">
                      Source: AWMF Guideline 083-055, Version 1.0 (Aug. 2025). Consensus recommendations of DGI/DGZMK.
                    </p>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      The question is no longer whether vitamin D diagnostics in implantology is meaningful – the guideline
                      answers that clearly. The question is how to efficiently integrate this diagnostics into your daily
                      practice routine.
                    </p>
                  </div>
                </section>

                {/* Section 3: POC vs. Lab */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Why POC Instead of Lab? The Time Advantage at the Chairside
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      The conventional path for vitamin D testing involves venous blood collection, shipment to an external
                      laboratory, and a waiting period of two to five working days. For daily practice, this means: a separate
                      appointment for blood collection, waiting for results, then recalling the patient to discuss the treatment
                      decision. The <strong>vitamin D test in the dental practice</strong> often fails not due to lack of clinical
                      conviction, but due to logistics.
                    </p>
                    <p>
                      A point-of-care test (POC) fundamentally changes this workflow. The <strong>vitamin D rapid test at the
                      dentist</strong> delivers a quantitative result in under three minutes – directly chairside, from a drop of
                      capillary blood. Instead of lab shipment, waiting time, and follow-up appointments, the result is
                      available during the planning consultation.
                    </p>
                  </div>

                  {/* Comparison Table */}
                  <div className="my-8 overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">Criterion</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">Laboratory Test</th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-900">POC Rapid Test (Igloo Reader Pro)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Time to result</td>
                          <td className="px-4 py-3 text-gray-700">2–5 working days</td>
                          <td className="px-4 py-3 font-medium text-gray-900">&lt; 3 minutes</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Sample shipment</td>
                          <td className="px-4 py-3 text-gray-700">Yes (blood draw → courier)</td>
                          <td className="px-4 py-3 font-medium text-gray-900">No (chairside)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Treatment decision</td>
                          <td className="px-4 py-3 text-gray-700">Delayed (follow-up appointment)</td>
                          <td className="px-4 py-3 font-medium text-gray-900">Immediate at the chairside</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Delegation</td>
                          <td className="px-4 py-3 text-gray-700">Blood draw by physician/MFA</td>
                          <td className="px-4 py-3 font-medium text-gray-900">Delegable to dental assistant/DH</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Accuracy (bias)</td>
                          <td className="px-4 py-3 text-gray-700">±5–10% (varies by lab)</td>
                          <td className="px-4 py-3 font-medium text-gray-900">±3–8% (DEQAS Class A)</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-gray-700">Patient compliance</td>
                          <td className="px-4 py-3 text-gray-700">Lab visit required</td>
                          <td className="px-4 py-3 font-medium text-gray-900">No additional appointment</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Another advantage for practice organization: the entire test procedure can be delegated to dental assistants
                      or dental hygienists. The assistant collects the sample and starts the measurement while you treat
                      the next patient. No workflow interruption, no logistics overhead, no information loss between lab and practice.
                    </p>
                  </div>
                </section>

                {/* Section 4: Igloo Reader Pro */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Igloo Reader Pro – The POC Diagnostics System for Dental Practices
                  </h2>

                  <h3 className="mt-8 mb-4 text-lg font-semibold text-gray-900">
                    Technology & Specifications
                  </h3>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      The Igloo Reader Pro is a compact <strong>POC diagnostics device for dental practices</strong>, developed
                      specifically for use in medical practices and decentralized treatment environments. At just 87.5 × 87.5 × 91 mm
                      and 290 grams, it fits on any treatment table.
                    </p>
                  </div>

                  {/* Feature Grid */}
                  <div className="my-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-brand-primary" />
                        <p className="text-sm font-semibold text-gray-900">5 Measurement Technologies</p>
                      </div>
                      <p className="text-xs text-gray-600">Colorimetry, immunofluorescence, microfluids, quantum dots, dry chemistry</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-brand-primary" />
                        <p className="text-sm font-semibold text-gray-900">140+ Calibrated Tests</p>
                      </div>
                      <p className="text-xs text-gray-600">From 30+ manufacturers, compatible with ~90% of all lateral-flow tests</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-brand-primary" />
                        <p className="text-sm font-semibold text-gray-900">24-Hour Battery Life</p>
                      </div>
                      <p className="text-xs text-gray-600">Mobile-ready for house calls or satellite offices</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-brand-primary" />
                        <p className="text-sm font-semibold text-gray-900">CE & IVDR Compliant</p>
                      </div>
                      <p className="text-xs text-gray-600">WiFi, Bluetooth, USB-C, API integration (PMS/LIS compatible)</p>
                    </div>
                  </div>

                  <h3 className="mt-10 mb-4 text-lg font-semibold text-gray-900">
                    DEQAS-Validated Measurement Quality
                  </h3>

                  {/* DEQAS Metrics Box */}
                  <div className="my-6 rounded-lg border-l-4 border-emerald-500 bg-emerald-50/70 p-6">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">
                      Key Performance Metrics
                    </p>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">#2</p>
                        <p className="text-xs text-gray-600">Worldwide DEQAS ranking (Class A)</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">±3–8%</p>
                        <p className="text-xs text-gray-600">Bias vs. reference method</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">&lt;2%</p>
                        <p className="text-xs text-gray-600">CV inter-reader precision</p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-500">
                      Peer-reviewed: Tseneva &amp; Perić Kačarević, Int. Journal of Dental Biomaterials Research, 2023,
                      DOI: 10.56939/DBR23136t
                    </p>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      In the DEQAS proficiency testing scheme – the international reference program for vitamin D analytics –
                      the Igloo Reader Pro ranks 2nd worldwide and achieves Class A classification. This places it directly
                      behind LC-MS/MS, the gold standard of laboratory analytics. These values are at clinical laboratory level
                      and meet the quality requirements that the S3 guideline sets for in-office test systems.
                    </p>
                    <p>
                      <Link to="/igloo-pro" className="font-semibold text-brand-primary hover:underline">
                        View all Igloo Reader Pro specifications
                      </Link>
                    </p>
                  </div>
                </section>

                {/* Mid-CTA: Diagnostics System with Image */}
                <div className="my-10 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-2/5">
                      <img
                        src={iglooProImage}
                        alt="IglooPro POC reader for vitamin D diagnostics at the chairside in the dental practice"
                        width={400}
                        height={400}
                        className="h-48 w-full object-contain bg-gray-50 p-4 sm:h-full"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-6 sm:w-3/5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-primary">
                        Vitamin D Diagnostics in Practice
                      </p>
                      <p className="mb-3 text-base font-medium text-gray-900">
                        Determine the 25-OH vitamin D level directly at the chairside – in under 15 minutes.
                      </p>
                      <Link
                        to="/igloo-pro"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
                      >
                        Learn more about the Igloo Pro System
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Section 5: Economics */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Economics: IGeL Billing and ROI for Your Practice
                  </h2>

                  <h3 className="mt-8 mb-4 text-lg font-semibold text-gray-900">
                    Billing Vitamin D Testing as a Private Health Service
                  </h3>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      Vitamin D testing in the dental practice is not covered by statutory health insurance. It is billed as an
                      individual health service (IGeL) under §6 para. 1 GOÄ as an on-demand service. For you as a practice owner,
                      this means: full reimbursement without budget caps, no recourse risk, and a gross margin of approximately
                      <strong> €50 per test</strong> at standard calculation. That is roughly €15 above the margin of comparable
                      competitor products – a difference that adds up over the year.
                    </p>
                  </div>

                  <h3 className="mt-10 mb-4 text-lg font-semibold text-gray-900">
                    ROI Calculation: Payback in 8–12 Weeks
                  </h3>

                  {/* ROI Box */}
                  <div className="my-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="grid gap-4 sm:grid-cols-3 text-center">
                      <div>
                        <p className="text-2xl font-bold text-brand-primary">3 tests/week</p>
                        <p className="text-xs text-gray-600">Conservative assumption</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-brand-primary">€600/month</p>
                        <p className="text-xs text-gray-600">Additional gross revenue</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-brand-primary">8–12 weeks</p>
                        <p className="text-xs text-gray-600">Payback period</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      The key driver is not just the initial test, but monitoring: patients on supplementation return every three
                      to six months for follow-up testing per guideline recommendation. This creates a recurring revenue stream from
                      your existing patient base – without new patient acquisition. Vitamin D diagnostics in implantology becomes
                      one of the few IGeL services that combines clinical benefit with sustainable economic returns.
                    </p>
                    <p>
                      With additional biomarkers (HbA1c, CRP, ferritin, cortisol, TSH), the POC device evolves into an{' '}
                      <Link to="/diagnostics/dental" className="font-semibold text-brand-primary hover:underline">
                        expandable diagnostic profit center for your practice
                      </Link>.
                    </p>
                  </div>
                </section>

                {/* Section 6: 5-Step Workflow */}
                <section id="workflow" className="mt-12 scroll-mt-24">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Practice Workflow: Vitamin D Diagnostics in 5 Steps
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700 mb-8">
                    <p>
                      Integrating <strong>vitamin D testing before implantation</strong> into daily practice is straightforward
                      and fully delegable to dental assistants or dental hygienists.
                    </p>
                  </div>

                  {/* 5-Step Cards */}
                  <div className="space-y-4">
                    {[
                      {
                        step: 1,
                        title: 'Risk Assessment',
                        description:
                          'During medical history intake, identify relevant risk factors: osteoporosis, malabsorption syndromes, seasonal deficiency with limited sun exposure, dark skin type, diabetes mellitus, or known vitamin D deficiency history.',
                      },
                      {
                        step: 2,
                        title: 'Capillary Blood Collection',
                        description:
                          'The dental assistant collects a drop of capillary blood from the fingertip – approximately 10 microliters is sufficient.',
                      },
                      {
                        step: 3,
                        title: 'Insert Test Cassette',
                        description:
                          'The filled test cassette is inserted into the Igloo Reader Pro. The device automatically recognizes the test type and starts the measurement.',
                      },
                      {
                        step: 4,
                        title: 'Result in Under 3 Minutes',
                        description:
                          'The quantitative 25-OH vitamin D value appears on the display and is simultaneously transferred to the cloud app. Discuss the result directly at the chairside with the patient.',
                      },
                      {
                        step: 5,
                        title: 'Document Treatment Decision',
                        description:
                          'If levels are sufficient, implantation proceeds as planned. If deficient, initiate supplementation and schedule a monitoring appointment in 3–6 months before the procedure.',
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
                      The entire <strong>vitamin D rapid test at the dentist</strong> – from capillary blood collection to the
                      documented result – takes under five minutes and integrates seamlessly into the planning appointment or
                      initial consultation.
                    </p>
                  </div>
                </section>

                {/* Section 7: D3 Spray */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Polaris Vitamin D3 Spray – Diagnostics and Therapy from a Single Source
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      When the test shows a deficiency, the treatment pathway in many practices ends with a verbal supplementation
                      recommendation. The patient then independently purchases a product – or doesn't. With the{' '}
                      <Link to="/vitamin-d3-implantologie" className="font-semibold text-brand-primary hover:underline">
                        Polaris Vitamin D3+K2 oral spray
                      </Link>, you close this gap directly during the consultation. The spray combines high-dose vitamin D3 with
                      vitamin K2 (MK-7), which promotes targeted calcium deposition in the bone matrix through osteocalcin activation.
                    </p>
                    <p>
                      As a practice dispensing product, the spray generates additional revenue per patient with zero additional
                      work steps. The combination of diagnostics and supplementation from a single source increases patient
                      retention and ensures the treatment plan is actually implemented.
                    </p>
                  </div>
                </section>

                {/* Section 8: Validation & Partners */}
                <section className="mt-12">
                  <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Clinical Validation and Partner Practices in Implantology
                  </h2>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      The Igloo Pro system is already deployed in over 100 practices across more than 15 countries.
                      Cooperation partners include renowned institutions in implantology and research:
                    </p>
                  </div>

                  {/* Partner Grid */}
                  <div className="my-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="text-sm font-semibold text-gray-900">Nobel Biocare / Envista</p>
                      <p className="text-xs text-gray-600">World leader in implantology – cooperation for chairside diagnostics workflows</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="text-sm font-semibold text-gray-900">Swiss Dental Solutions & Imperial College London</p>
                      <p className="text-xs text-gray-600">Joint research on POC diagnostics in dentistry</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="text-sm font-semibold text-gray-900">ndu Clinic, 22 Harley Street, London</p>
                      <p className="text-xs text-gray-600">Clinical application in the premium biological dentistry segment</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-4">
                      <p className="text-sm font-semibold text-gray-900">100+ Practices in 15+ Countries</p>
                      <p className="text-xs text-gray-600">Established footprint across Europe, Middle East, and Asia</p>
                    </div>
                  </div>

                  <div className="space-y-6 text-[17px] leading-[1.75] text-gray-700">
                    <p>
                      These partnerships demonstrate that guideline-compliant POC diagnostics has arrived in implantological practice.
                    </p>
                  </div>
                </section>

                {/* Section 9: CTA */}
                <section className="mt-12">
                  <div className="rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep p-8 text-white">
                    <h2 className="mb-4 text-xl font-semibold sm:text-2xl">
                      Ready for Guideline-Compliant Diagnostics in Your Practice?
                    </h2>
                    <p className="mb-6 text-base text-white/90">
                      Vitamin D diagnostics in implantology stands on a solid foundation: the S3 guideline provides the framework,
                      the Igloo Reader Pro delivers the technology, and the IGeL model secures the economics. Schedule a
                      complimentary consultation to learn how the system fits into your specific practice workflow.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link
                        to="/contact"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-deep transition-colors hover:bg-gray-50"
                      >
                        Schedule a Free Consultation
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
                      Free consultation – no obligation – approximately 15 minutes
                    </p>
                  </div>
                </section>

                {/* Section 10: FAQ */}
                <section className="mt-12 border-t border-gray-200 pt-10">
                  <h2 className="mb-8 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                    Frequently Asked Questions About Vitamin D Diagnostics in the Dental Practice
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

                {/* Back Link */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                  <Link
                    to="/articles"
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-deep transition-colors"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    Back to Articles
                  </Link>
                </div>
              </Reveal>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Phone Contact Box */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10">
                      <Phone className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Questions?</p>
                      <p className="text-xs text-gray-500">We're happy to help</p>
                    </div>
                  </div>
                  <a
                    href="tel:+4915175011699"
                    className="flex items-center justify-center gap-2 rounded-md bg-brand-primary/10 px-4 py-2.5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-primary/20"
                  >
                    <Phone className="h-4 w-4" />
                    +49 151 75011699
                  </a>
                  <p className="mt-2 text-center text-xs text-gray-500">Mon–Fri 9:00–17:00 CET</p>
                </div>

                {/* CTA Box */}
                <div className="rounded-xl bg-gradient-to-br from-brand-primary to-brand-deep p-5 text-white">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-secondary">
                    Free Consultation
                  </p>
                  <p className="mb-4 text-sm">
                    Learn how the Igloo Reader Pro integrates into your implantology workflow.
                  </p>
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-brand-deep transition-colors hover:bg-gray-50"
                  >
                    Schedule Demo
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {/* Related Articles */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <BookOpen className="h-4 w-4 text-brand-primary" />
                    Related Content
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
                          Vitamin D3 & Implantology
                        </p>
                        <p className="text-xs text-gray-500">D3+K2 supplementation evidence</p>
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
                        <p className="text-xs text-gray-500">Vitamin D diagnostics at the chairside</p>
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
                          POC Diagnostics for Dental Practices
                        </p>
                        <p className="text-xs text-gray-500">Full biomarker portfolio</p>
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
                          The 5-Minute Diagnosis
                        </p>
                        <p className="text-xs text-gray-500">Economics of rapid diagnostics</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Trust Signal */}
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <p className="text-xs text-gray-500">
                    Over <span className="font-semibold text-gray-700">100 practices</span> in 15+ countries trust PolarisDX
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
          Schedule Free Consultation
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Mobile bottom padding for sticky CTA */}
      <div className="h-20 lg:hidden" />
    </PageTransition>
  )
}

export default S3LeitliniePage
