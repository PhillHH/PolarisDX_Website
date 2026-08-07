import { Trans, useTranslation } from 'react-i18next'
import { Building2, Target, HeartPulse, ShieldCheck, Zap, Check } from 'lucide-react'
import { SEOHead, organizationSchema, createBreadcrumbSchema } from '../components/seo'
import TeamSection from '../components/sections/TeamSection'
import PageTransition from '../components/ui/PageTransition'
import Reveal, { REVEAL_STAGGER } from '../components/ui/Reveal'
import SubpageHero from '../components/sections/SubpageHero'
import FinalCtaSection from '../components/sections/FinalCtaSection'
import TrustBar from '../components/sections/TrustBar'

const AboutPage = () => {
  const { t } = useTranslation(['about', 'common', 'home'])

  const missionPoints = ['point1', 'point2', 'point3'] as const

  const values = [
    { icon: Target, key: 'precision' },
    { icon: HeartPulse, key: 'proximity' },
    { icon: ShieldCheck, key: 'reliability' },
  ] as const

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
        keywords={[
          'PolarisDX Team',
          'Über uns',
          'POC Diagnostik Unternehmen',
          'Medizintechnik Hamburg',
        ]}
        structuredData={[
          organizationSchema,
          createBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Über uns', url: '/about' },
          ]),
        ]}
      />
      <SubpageHero
        breadcrumbs={[
          { label: t('common:nav.home', 'Home'), href: '/' },
          { label: t('about:hero.caption', 'Über uns') },
        ]}
        eyebrow={t('about:hero.caption', 'Über uns')}
        title={t('about:hero.title', 'Wir definieren Diagnostik neu')}
        subtitle={t(
          'about:hero.description',
          'PolarisDX steht für Innovation, Präzision und Verlässlichkeit in der Medizintechnik. Lernen Sie die Menschen hinter unserer Mission kennen.',
        )}
        primaryCta={{ label: t('about:hero.primary_cta', 'Team kennenlernen'), to: '/contact' }}
        chips={[
          t('about:hero.chips.ivdr', 'IVDR · CE-konform'),
          t('about:hero.chips.partner', 'DX365 Distributionspartner'),
          t('about:hero.chips.reach', 'Standorte London & Hamburg'),
        ]}
        stats={[
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
        icon={<Building2 aria-hidden="true" />}
        valueChips={[
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
        ]}
      />

      <TrustBar />

      {/* Mission — copy + navy highlight tile */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-container items-center gap-8 px-4 lg:grid-cols-2 lg:px-0">
          <Reveal width="100%">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                {t('about:mission.caption', 'Unsere Mission')}
              </span>
              <h2 className="mt-4 text-3xl font-medium tracking-tight text-heading lg:text-[42px]">
                {t(
                  'about:mission.title',
                  'Labordiagnostik dorthin bringen, wo Patienten behandelt werden',
                )}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-700">
                {t(
                  'about:mission.lead',
                  'PolarisDX macht laborgenaue Point-of-Care-Diagnostik für Praxen und Kliniken in ganz Europa zugänglich — herstellerübergreifend, IVDR/CE-konform und einsatzbereit in wenigen Werktagen.',
                )}
              </p>
              <p className="mt-4 leading-relaxed text-gray-700">
                {t(
                  'about:mission.body',
                  'Von unseren Standorten in London und Hamburg begleiten wir Ärztinnen und Ärzte von der Auswahl über die Integration bis zum laufenden Support — damit Diagnostik am Patienten schneller, präziser und wirtschaftlicher wird.',
                )}
              </p>
              <ul className="mt-6 space-y-3">
                {missionPoints.map((p) => (
                  <li key={p} className="flex gap-3 leading-relaxed text-gray-700">
                    <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
                      <Check className="h-3 w-3 text-accent" aria-hidden="true" />
                    </span>
                    <span>{t(`about:mission.${p}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal width="100%" delay={REVEAL_STAGGER}>
            <div className="rounded-2xl bg-brand-deep p-7 text-white lg:p-7">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent-on-dark">
                <Zap className="h-6 w-6" aria-hidden="true" />
              </span>
              <p className="mt-6 text-xs font-medium text-white/60">
                {t('about:mission.highlight_label', 'Point-of-Care first')}
              </p>
              <p className="mt-2 text-2xl font-medium leading-snug">
                {t('about:mission.highlight_title', 'Ergebnisse in Minuten – nicht in Tagen')}
              </p>
              <p className="mt-3 leading-relaxed text-white/80">
                {t(
                  'about:mission.highlight_text',
                  'Der IglooPro POC-Reader liefert laborvergleichbare Werte direkt am Behandlungsort. Weniger Wartezeit, weniger Wege, schnellere Therapieentscheidungen.',
                )}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stat strip */}
      <section className="bg-slate-50 py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 lg:px-0">
          <Reveal width="100%">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 lg:grid-cols-4">
              {statStrip.map((s) => (
                <div key={s.label} className="bg-white p-6 text-center lg:p-8">
                  <div className="text-3xl font-medium tracking-tight text-heading lg:text-4xl">
                    {s.value}
                  </div>
                  <div className="mt-2 text-sm leading-snug text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values — content cards */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-container px-4 lg:px-0">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
              {t('about:values.caption', 'Wofür wir stehen')}
            </span>
            <h2 className="mt-4 text-3xl font-medium tracking-tight text-heading lg:text-[42px]">
              {t('about:values.title', 'Werte, die unsere Arbeit prägen')}
            </h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.key} width="100%" delay={i * REVEAL_STAGGER}>
                <div className="h-full rounded-xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <v.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-medium text-heading">
                    {t(`about:values.items.${v.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {t(`about:values.items.${v.key}.text`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <TeamSection />

      {/* DX365 partner — teal-tint highlight (i18n via Trans for the DX365 link) */}
      <section className="pb-16 lg:pb-24">
        <div className="mx-auto max-w-container px-4 lg:px-0">
          <Reveal width="100%">
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-7 text-center lg:p-7">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                {t('about:dx365_partner.caption', 'Unser Partner')}
              </span>
              <h2 className="mt-4 text-2xl font-medium tracking-tight text-heading lg:text-3xl">
                {t('about:dx365_partner.title', 'Europäischer Distributionspartner von DX365')}
              </h2>
              <p className="mx-auto mt-4 max-w-[61ch] text-lg leading-relaxed text-gray-700">
                <Trans
                  i18nKey="about:dx365_partner.body"
                  components={{
                    dx365: (
                      <a
                        href="https://dx365.world"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-accent underline transition-colors hover:text-accent-strong"
                      />
                    ),
                  }}
                />
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCtaSection roiHref="/#roi-rechner" />
    </PageTransition>
  )
}

export default AboutPage
