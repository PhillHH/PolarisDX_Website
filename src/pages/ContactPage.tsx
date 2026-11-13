import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SEOHead, organizationSchema, createBreadcrumbSchema } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import SubHead from '../components/sub/SubHead'
import SubPage from '../components/sub/SubPage'
import SubStage from '../components/sub/SubStage'
import TrustBar from '../components/sections/TrustBar'
import { ContactForm } from '../components/sections/ContactForm'

const PHONE_HREF = 'tel:+4915175011699'
const EMAIL_HREF = 'mailto:contact@polarisdx.net'
const FORM_ANCHOR = '#kontaktformular'

type Channel = {
  key: string
  href: string
  external?: boolean
}

const ContactPage = () => {
  const { t, i18n } = useTranslation(['contact', 'common'])

  // (b) Sichtbare Breadcrumb und BreadcrumbList aus derselben Quelle speisen.
  const crumbHome = t('common:nav.home', 'Startseite')
  const crumbContact = t('contact.hero.breadcrumb')

  const channels: Channel[] = [
    { key: 'email', href: EMAIL_HREF, external: true },
    { key: 'phone', href: PHONE_HREF, external: true },
    { key: 'demo', href: FORM_ANCHOR },
  ]

  const offices = [
    {
      key: 'london',
      city: 'London',
      role: t('contact.locations.london_role'),
      lines: ['Polaris Diagnostics Ltd', '262A Fulham Road', 'London SW10 9EL'],
      phone: '+44 7879 433019',
    },
    {
      key: 'hamburg',
      city: 'Hamburg',
      role: t('contact.locations.hamburg_role'),
      lines: ['Polaris Diagnostics Europe GmbH', 'Willy-Brandt-Straße 49', '20457 Hamburg'],
      phone: '+49 151 75011699',
    },
  ]

  return (
    <PageTransition>
      <SEOHead
        title={t('contact:seo.title', 'Kontakt & Demo-Termin zum IglooPro vereinbaren')}
        description={t(
          'contact:seo.description',
          'Vereinbaren Sie eine kostenlose IglooPro Demo. POC-Diagnostik live erleben — Beratung zu Integration, Abrechnung & Praxislabor. Schnelle Antwort.',
        )}
        structuredData={[
          organizationSchema,
          createBreadcrumbSchema(
            [
              { name: crumbHome, url: '/' },
              { name: crumbContact, url: '/contact' },
            ],
            i18n.language,
          ),
        ]}
      />

      <SubPage>
        {/* Bühne: eine Aufgabe (zum Formular), die drei Zusagen als Eckdaten */}
        <SubStage
          breadcrumbs={[{ label: crumbHome, href: '/' }, { label: crumbContact }]}
          eyebrow={t('contact.hero.kicker')}
          title={t('contact.hero.title')}
          lead={<p>{t('contact.hero.subtitle')}</p>}
          fold
          chips={[
            t('contact.hero.chips.free'),
            t('contact.hero.chips.fast'),
            t('contact.hero.chips.time'),
          ]}
          actions={
            <>
              <a href={FORM_ANCHOR} className="sc025-button">
                {t('contact.hero.cta_primary')}
                <ArrowRight aria-hidden="true" />
              </a>
              <a href={PHONE_HREF} className="sc025-underlink">
                <span>{t('contact.hero.cta_secondary')}</span>
                <ArrowRight aria-hidden="true" />
              </a>
            </>
          }
          facts={(['answer', 'conform', 'locations'] as const).map((key) => ({
            label: t(`contact.hero.value.${key}_label`),
            value: t(`contact.hero.value.${key}_value`),
          }))}
        />

        <TrustBar />

        {/* Begleitspalte + Formular */}
        <div className="sc025-s sc025-tint" data-sub-section>
          <div className="sc025-inner sc028-form-grid sc028-form-grid-wide">
            <Reveal width="100%">
              <span className="sc025-kicker">{t('contact.form_aside.caption')}</span>
              <h2 className="sc025-h2 sc028-side-h2">{t('contact.form_aside.title')}</h2>
              <p className="sc028-lead">{t('contact.form_aside.subtitle')}</p>

              <ul className="sc028-flat sc028-flat-sm sc028-points">
                {['one', 'two', 'three'].map((p) => (
                  <li key={p}>{t(`contact.form_aside.points.${p}`)}</li>
                ))}
              </ul>

              <div className="sc028-channels">
                {channels.map(({ key, href, external }) => (
                  <a
                    key={key}
                    href={href}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                    {...(external ? {} : { 'aria-label': t(`contact.channels.${key}.label`) })}
                  >
                    <span className="sc028-label">{t(`contact.channels.${key}.label`)}</span>
                    <b>{t(`contact.channels.${key}.value`)}</b>
                    <span className="sc025-text">{t(`contact.channels.${key}.desc`)}</span>
                  </a>
                ))}
              </div>
            </Reveal>

            {/* Formular — die Konversion der Seite */}
            <Reveal width="100%">
              <section
                id="kontaktformular"
                aria-label={t('contact.form_aside.title')}
                className="sc028-form scroll-mt-28"
              >
                <ContactForm />
              </section>
            </Reveal>
          </div>
        </div>

        {/* So geht es nach dem Absenden weiter */}
        <section className="sc025-s" data-sub-section>
          <div className="sc025-inner">
            <SubHead
              kicker={t('contact.process.caption')}
              title={t('contact.process.title')}
              lead={t('contact.process.subtitle')}
            />
            <div className="sc028-cols grid gap-12 md:grid-cols-3">
              {['one', 'two', 'three'].map((step, i) => (
                <div key={step} className="rv">
                  <span className="sc028-n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3>{t(`contact.process.steps.${step}.title`)}</h3>
                  <p className="sc025-text">{t(`contact.process.steps.${step}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Standorte */}
        <section className="sc025-s sc025-dark" data-sub-section>
          <div className="sc025-inner">
            <SubHead kicker={t('contact.locations.caption')} title={t('contact.locations.title')} />
            <div className="sc028-cols grid gap-12 md:grid-cols-2">
              {offices.map((office) => (
                <div key={office.key} className="rv sc028-office">
                  <p className="sc025-label">{office.role}</p>
                  <h3 className="sc025-mid">{office.city}</h3>
                  <address>
                    <b>{office.lines[0]}</b>
                    {office.lines.slice(1).map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </address>
                  <div className="sc028-links sc028-links-col">
                    <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="sc025-underlink">
                      <span>{office.phone}</span>
                    </a>
                    <a href={EMAIL_HREF} className="sc025-underlink">
                      <span>contact@polarisdx.net</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Abschlussblock: genau EINE gefüllte Aktion — zurück zum Formular, der Konversion dieser
            Seite — plus die Vertrauens-Chips aus der Bühne. Alle Texte stammen aus bereits
            vorhandenen Keys (in allen zehn Sprachen belegt). */}
        <section className="sc025-s sc025-tint sc028-final sc028-final-light">
          <div className="sc025-inner">
            <span className="sc025-kicker">{t('contact.form_aside.caption')}</span>
            <h2 className="sc025-h2">{t('contact.form_aside.title')}</h2>
            <p className="sc025-text">{t('contact.form.microcopy')}</p>
            <div className="sc028-actions">
              <a
                href={FORM_ANCHOR}
                className="sc025-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                {t('contact.hero.cta_primary')}
                <ArrowRight aria-hidden="true" />
              </a>
            </div>
            <ul className="sc028-chips sc028-chips-light">
              {[
                t('contact.hero.chips.free'),
                t('contact.hero.chips.fast'),
                t('contact.hero.chips.time'),
              ].map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          </div>
        </section>
      </SubPage>
    </PageTransition>
  )
}

export default ContactPage
