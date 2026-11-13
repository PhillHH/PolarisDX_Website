import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SEOHead, organizationSchema, createBreadcrumbSchema } from '../components/seo'
import TeamSection from '../components/sections/TeamSection'
import PageTransition from '../components/ui/PageTransition'
import Reveal, { REVEAL_STAGGER } from '../components/ui/Reveal'
import SubHead from '../components/sub/SubHead'
import SubPage from '../components/sub/SubPage'
import SubStage from '../components/sub/SubStage'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import TrustBar from '../components/sections/TrustBar'
import AboutPillarsSection from '../components/sections/AboutPillarsSection'
import EventBand from '../components/events/EventBand'

const AboutPage = () => {
  const { t, i18n } = useTranslation(['about', 'common', 'home'])

  const missionPoints = ['point1', 'point2', 'point3'] as const

  const values = [{ key: 'precision' }, { key: 'proximity' }, { key: 'reliability' }] as const

  const statStrip = [
    {
      value: t('about:stats_strip.s1.value', '2'),
      label: t('about:stats_strip.s1.label', 'Standorte: London & Hamburg'),
    },
    {
      value: t('about:stats_strip.s2.value', '15+'),
      label: t('about:stats_strip.s2.label', 'Länder mit aktiven Installationen'),
    },
    {
      value: t('about:stats_strip.s3.value', '100+'),
      label: t('about:stats_strip.s3.label', 'Installierte IglooPro-Reader'),
    },
    {
      value: t('about:stats_strip.s4.value', '< 24 h'),
      label: t('about:stats_strip.s4.label', 'Reaktionszeit im Support'),
    },
  ]

  return (
    <PageTransition>
      <SEOHead
        title={t('about:seo.title', 'Über uns: POC-Diagnostik Partner für Europa | PolarisDX')}
        description={t(
          'about:seo.description',
          'PolarisDX bringt patientennahe Labordiagnostik in Praxen und Kliniken. IVDR-konform, 100+ Geräte in 15+ Ländern. Lernen Sie unser Team kennen.',
        )}
        structuredData={[
          organizationSchema,
          createBreadcrumbSchema(
            [
              { name: t('common:nav.home'), url: '/' },
              { name: t('about:hero.caption'), url: '/about' },
            ],
            i18n.language,
          ),
        ]}
      />
      <SubPage>
        <SubStage
          breadcrumbs={[
            { label: t('common:nav.home', 'Home'), href: '/' },
            { label: t('about:hero.caption', 'Über uns') },
          ]}
          eyebrow={t('about:hero.caption', 'Über uns')}
          title={t('about:hero.title', 'Wir definieren Diagnostik neu')}
          lead={
            <p>
              {t(
                'about:hero.description',
                'PolarisDX steht für Innovation, Präzision und Verlässlichkeit in der Medizintechnik. Lernen Sie die Menschen hinter unserer Mission kennen.',
              )}
            </p>
          }
          fold
          chips={[
            t('about:hero.chips.ivdr', 'IVDR · CE-konform'),
            t('about:hero.chips.partner', 'DX365 Distributionspartner'),
            t('about:hero.chips.reach', 'Standorte London & Hamburg'),
          ]}
          actions={
            <Link
              to="/contact"
              className="sc025-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-dark focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
            >
              {t('about:hero.primary_cta', 'Angebot anfragen')}
              <ArrowRight aria-hidden="true" />
            </Link>
          }
          aside={
            <dl className="sc028-aside-list">
              {[
                {
                  value: t('about:hero.visual.c1.value', '2 Standorte'),
                  label: t('about:hero.visual.c1.label', 'London & Hamburg'),
                },
                {
                  value: t('about:hero.visual.c2.value', '15+ Länder'),
                  label: t('about:hero.visual.c2.label', 'Aktive Märkte'),
                },
                {
                  value: t('about:hero.visual.c3.value', '100+ Geräte'),
                  label: t('about:hero.visual.c3.label', 'Installiert'),
                },
              ].map((chip) => (
                <div key={chip.label}>
                  <dt>{chip.label}</dt>
                  <dd>{chip.value}</dd>
                </div>
              ))}
            </dl>
          }
          facts={[
            {
              value: t('about:hero.stats.locations.value', '2'),
              label: t('about:hero.stats.locations.label', 'Standorte'),
            },
            {
              value: t('about:hero.stats.countries.value', '15+'),
              label: t('about:hero.stats.countries.label', 'Länder'),
            },
            {
              value: t('about:hero.stats.devices.value', '100+'),
              label: t('about:hero.stats.devices.label', 'Installierte Geräte'),
            },
          ]}
        />

        <TrustBar />
        <EventBand />

        <div className="sc028-body">
          <AboutPillarsSection />
        </div>

        {/* Mission — Text links, Kernaussage auf Nacht-Navy rechts */}
        <section className="sc025-s" data-sub-section>
          <div className="sc025-inner sc028-two">
            <Reveal width="100%">
              <span className="sc025-kicker">{t('about:mission.caption', 'Unsere Mission')}</span>
              <h2 className="sc025-h2 sc028-side-h2">
                {t(
                  'about:mission.title',
                  'Labordiagnostik dorthin bringen, wo Patienten behandelt werden',
                )}
              </h2>
              <p className="sc028-lead">
                {t(
                  'about:mission.lead',
                  'PolarisDX macht laborgenaue Point-of-Care-Diagnostik für Praxen und Kliniken in ganz Europa zugänglich — herstellerübergreifend, IVDR/CE-konform und einsatzbereit in wenigen Werktagen.',
                )}
              </p>
              <p className="sc025-text sc028-gap-top">
                {t(
                  'about:mission.body',
                  'Von unseren Standorten in London und Hamburg begleiten wir Ärztinnen und Ärzte von der Auswahl über die Integration bis zum laufenden Support — damit Diagnostik am Patienten schneller, präziser und wirtschaftlicher wird.',
                )}
              </p>
              <ul className="sc028-flat sc028-flat-sm sc028-points">
                {missionPoints.map((p) => (
                  <li key={p}>{t(`about:mission.${p}`)}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal width="100%" delay={REVEAL_STAGGER}>
              <div className="sc028-card">
                <p className="sc025-label">
                  {t('about:mission.highlight_label', 'Point-of-Care first')}
                </p>
                <h3>
                  {t('about:mission.highlight_title', 'Ergebnisse in Minuten – nicht in Tagen')}
                </h3>
                <p className="sc025-text">
                  {t(
                    'about:mission.highlight_text',
                    'Der IglooPro POC-Reader liefert laborvergleichbare Werte direkt am Behandlungsort. Weniger Wartezeit, weniger Wege, schnellere Therapieentscheidungen.',
                  )}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Kennzahlen */}
        <section className="sc025-s sc025-tint" data-sub-section>
          <div className="sc025-inner">
            <div className="sc028-figures">
              {statStrip.map((s) => (
                <div key={s.label} className="rv">
                  <b>{s.value}</b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Werte */}
        <section className="sc025-s" data-sub-section>
          <div className="sc025-inner">
            <SubHead
              kicker={t('about:values.caption', 'Wofür wir stehen')}
              title={t('about:values.title', 'Werte, die unsere Arbeit prägen')}
            />
            <div className="sc028-cols grid gap-12 md:grid-cols-3">
              {values.map((v, i) => (
                <div key={v.key} className="rv">
                  <span className="sc028-n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3>{t(`about:values.items.${v.key}.title`)}</h3>
                  <p className="sc025-text">{t(`about:values.items.${v.key}.text`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="sc028-body">
          <TeamSection />
        </div>

        {/* DX365-Partner — i18n über Trans (Link im Text) */}
        <section className="sc025-s sc025-tint sc028-final sc028-final-light" data-sub-section>
          <div className="sc025-inner">
            <span className="sc025-kicker">
              {t('about:dx365_partner.caption', 'Unser Partner')}
            </span>
            <h2 className="sc025-h2">
              {t('about:dx365_partner.title', 'Europäischer Distributionspartner von DX365')}
            </h2>
            <p className="sc025-text">
              <Trans
                i18nKey="about:dx365_partner.body"
                components={{
                  dx365: (
                    // eslint-disable-next-line jsx-a11y/anchor-has-content -- Link-Text kommt aus about:dx365_partner.body (i18next Trans, x10 lokalisiert)
                    <a
                      href="https://dx365.world"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-heading underline transition-colors hover:text-accent-strong"
                    />
                  ),
                }}
              />
            </p>
          </div>
        </section>

        <FinalCtaSection />
      </SubPage>
    </PageTransition>
  )
}

export default AboutPage
