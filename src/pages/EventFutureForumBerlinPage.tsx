/**
 * Future Forum Berlin — The Future Patient (02.10.2026, NIO House Berlin)
 *
 * Veranstaltungsseite mit Programm, Sessions, Partnern und Anmeldung. Inhalt
 * folgt dem Event-Deck (Diagnostics × AI × Implantology); alle Texte liegen im
 * Namensraum `events` unter `futureForum`, damit de/en gepflegt werden koennen
 * und die acht Fallback-Sprachen den englischen Stand mit `_translationStatus`
 * tragen (dann `lang="en"` am Inhalt, wie auf der Epigenetik-Strecke).
 *
 * Keine Sprecherportraets: die Bilder im Deck sind KI-generiert und gehoeren
 * nicht auf die Live-Seite. Sobald freigegebene Fotos vorliegen, gehoeren sie
 * in die Session-Karten.
 *
 * Termin, Slug und Link stehen in src/data/events.ts (FUTURE_FORUM_BERLIN);
 * die Anmeldung geht ueber /api/event-registration (server/server.js).
 */

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from 'lucide-react'
import { SEOHead, createBreadcrumbSchema, createEventSchema } from '../components/seo'
import { Breadcrumbs } from '../components/ui/Breadcrumbs'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'
import Eyebrow from '../components/ui/Eyebrow'
import { EventRegistrationForm } from '../components/sections/EventRegistrationForm'
import { isEnglishFallback } from '../lib/translationStatus'
import { FUTURE_FORUM_BERLIN } from '../data/events'
import heroImage from '../assets/events/future-forum-berlin/nio-house-berlin-exterior.webp'
import talkImage from '../assets/events/future-forum-berlin/nio-house-talk.webp'
import forumImage from '../assets/events/future-forum-berlin/nio-house-forum.webp'
import audienceImage from '../assets/events/future-forum-berlin/nio-house-audience.webp'
import mediaAlleyImage from '../assets/events/future-forum-berlin/nio-house-media-alley.webp'
import afterHoursImage from '../assets/events/future-forum-berlin/nio-house-after-hours.webp'
import loungeImage from '../assets/events/future-forum-berlin/nio-house-lounge.webp'
import logoNobel from '../assets/events/future-forum-berlin/logo-nobel-biocare.webp'
import logoNio from '../assets/events/future-forum-berlin/logo-nio-house-berlin.webp'
import logoLsn from '../assets/events/future-forum-berlin/logo-life-science-nord.webp'
import logoPolaris from '../assets/polarisdx_logo.webp'

const EVENT_SLUG = 'future-forum-berlin-2026'
const OG_IMAGE = '/og-future-forum-berlin.jpg'
const CONTACT_EMAIL = 'contact@polarisdx.net'
const CONTACT_PHONE = '+49 151 75011699'

interface Pillar {
  num: string
  title: string
  subtitle: string
  text: string
}
interface ProgrammeItem {
  time: string
  title: string
  text: string
}
interface Session {
  time: string
  speaker: string
  role: string
  title: string
  claim: string
  text: string
  tags: string[]
}
interface Station {
  num: string
  title: string
  text: string
  tag: string
}
interface Partner {
  name: string
  role: string
  text: string
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

/** Logo-Kachel: weisses Feld, damit farbige Wort-Bild-Marken auf jedem Grund lesbar bleiben. */
const LogoChip = ({
  src,
  alt,
  imgClassName = 'max-h-9',
}: {
  src: string
  alt: string
  /** Hochformatige Marken (Life Science Nord) brauchen mehr Hoehe als Wortmarken. */
  imgClassName?: string
}) => (
  <div className="flex h-[72px] items-center justify-center rounded-xl bg-white px-5 py-3 shadow-sm ring-1 ring-black/5">
    <img
      src={src}
      alt={alt}
      className={`w-auto max-w-[160px] object-contain ${imgClassName}`}
      loading="lazy"
    />
  </div>
)

const PARTNER_LOGOS: Record<string, string> = {
  PolarisDX: logoPolaris,
  'Nobel Biocare': logoNobel,
  'NIO House Berlin': logoNio,
}

const EventFutureForumBerlinPage = () => {
  const { t } = useTranslation('events')
  const ff = (key: string, options?: Record<string, unknown>) => t(`futureForum.${key}`, options)

  const englishFallback = isEnglishFallback(ff('_translationStatus', { defaultValue: '' }))
  const contentLang = englishFallback ? 'en' : undefined

  const pillars = asArray<Pillar>(ff('claim.pillars', { returnObjects: true }))
  const programme = asArray<ProgrammeItem>(ff('programme.items', { returnObjects: true }))
  const sessions = asArray<Session>(ff('sessions.items', { returnObjects: true }))
  const stations = asArray<Station>(ff('live.stations', { returnObjects: true }))
  const partners = asArray<Partner>(ff('partners.items', { returnObjects: true }))
  const afterHoursItems = asArray<string>(ff('afterHours.items', { returnObjects: true }))

  const structuredData = useMemo(
    () => [
      createBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Events', url: '/events' },
        { name: 'Future Forum Berlin', url: FUTURE_FORUM_BERLIN.link ?? '/events' },
      ]),
      createEventSchema({
        name: FUTURE_FORUM_BERLIN.title,
        description: ff('seo_description'),
        startDate: '2026-10-02T16:30:00+02:00',
        endDate: '2026-10-02T22:00:00+02:00',
        location: 'NIO House Berlin, Kurfürstendamm 11, 10719 Berlin',
        url: FUTURE_FORUM_BERLIN.link,
        image: OG_IMAGE,
      }),
    ],
    // ff ist pro Render neu; der Inhalt haengt nur an der Sprache.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  )

  const facts = [
    { icon: Calendar, label: ff('hero.date_label'), value: ff('hero.date') },
    { icon: Clock, label: ff('hero.time_label'), value: ff('hero.time') },
    {
      icon: MapPin,
      label: ff('hero.venue_label'),
      value: `${ff('hero.venue')} · ${ff('hero.address')}`,
    },
  ]

  return (
    <PageTransition>
      <SEOHead
        title={ff('seo_title')}
        description={ff('seo_description')}
        keywords={[
          'Future Forum Berlin',
          'The Future Patient',
          'NIO House Berlin',
          'Nobel Biocare',
          'Implantologie Fortbildung Berlin',
          'Vitamin D HbA1c chairside',
          'aMMP-8',
          'AI Implant Planning',
        ]}
        ogImage={OG_IMAGE}
        structuredData={structuredData}
        preloadImages={[heroImage]}
      />

      <div lang={contentLang}>
        {/* ------------------------------------------------------------------ */}
        {/* HERO                                                                */}
        {/* ------------------------------------------------------------------ */}
        <section className="relative overflow-hidden bg-brand-deep text-white">
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center opacity-45"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-deep via-brand-deep/90 to-brand-primary/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />

          <div className="relative mx-auto max-w-container px-4 pb-16 pt-32 lg:px-0 lg:pb-24 lg:pt-44">
            <Reveal width="100%" yOffset={20}>
              <Breadcrumbs
                variant="dark"
                items={[
                  { label: 'Home', href: '/' },
                  { label: t('title'), href: '/events' },
                  { label: ff('breadcrumb') },
                ]}
              />

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-accent-on-dark sm:text-sm">
                {ff('hero.eyebrow')}
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
                {ff('hero.title')}
              </h1>
              <p className="mt-4 text-base font-medium uppercase tracking-[0.18em] text-white/85 sm:text-lg">
                {ff('hero.subtitle')}
              </p>
              <p className="mt-6 max-w-[62ch] text-lg leading-8 text-white/80">{ff('hero.lead')}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="#anmeldung"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-semibold text-brand-deep transition-colors hover:bg-accent-soft"
                >
                  {ff('hero.cta_register')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="#programm"
                  className="inline-flex items-center justify-center rounded-full border border-white/60 px-7 py-4 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                >
                  {ff('hero.cta_programme')}
                </Link>
              </div>

              {/* Eckdaten */}
              <dl className="mt-10 grid gap-3 sm:grid-cols-3">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 backdrop-blur-sm"
                  >
                    <Icon
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent-on-dark"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                        {label}
                      </dt>
                      <dd className="mt-0.5 text-sm font-medium text-white">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              {/* Partner-Leiste */}
              <div className="mt-10 flex flex-col gap-6 border-t border-white/15 pt-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                    {ff('hero.partners_label')}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <LogoChip src={logoPolaris} alt="PolarisDX" />
                    <LogoChip src={logoNobel} alt="Nobel Biocare" />
                    <LogoChip src={logoNio} alt="NIO House Berlin" />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                    {ff('hero.supported_label')}
                  </p>
                  <div className="mt-3">
                    <LogoChip src={logoLsn} alt="Life Science Nord" imgClassName="max-h-12" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* CLAIM + DREI SAEULEN                                                */}
        {/* ------------------------------------------------------------------ */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-container px-4 lg:px-0">
            <Reveal width="100%">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
                <div>
                  <Eyebrow>{ff('claim.eyebrow')}</Eyebrow>
                  <h2 className="mt-4 text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl lg:text-[44px] lg:leading-[52px]">
                    {ff('claim.title')}
                  </h2>
                  <p className="mt-5 max-w-[60ch] text-base leading-7 text-gray-600 lg:text-[17px] lg:leading-8">
                    {ff('claim.text')}
                  </p>
                </div>
                <div className="overflow-hidden rounded-3xl shadow-lg">
                  <img
                    src={forumImage}
                    alt="Future Forum im NIO House Berlin"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {pillars.map((pillar, index) => (
                <Reveal key={pillar.num} width="100%" delay={index * 0.1}>
                  <div className="h-full rounded-2xl border border-ui-border bg-slate-50 p-6 lg:p-8">
                    <span className="text-4xl font-semibold text-brand-secondary/60">
                      {pillar.num}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">{pillar.title}</h3>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-accent-strong">
                      {pillar.subtitle}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{pillar.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* PROGRAMM                                                            */}
        {/* ------------------------------------------------------------------ */}
        <section id="programm" className="scroll-mt-28 bg-slate-50 py-20 lg:py-28">
          <div className="mx-auto max-w-container px-4 lg:px-0">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
              <Reveal width="100%">
                <div className="lg:sticky lg:top-32">
                  <Eyebrow>{ff('programme.eyebrow')}</Eyebrow>
                  <h2 className="mt-4 text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
                    {ff('programme.title')}
                  </h2>
                  <p className="mt-5 max-w-[52ch] text-base leading-7 text-gray-600">
                    {ff('programme.text')}
                  </p>
                  <div className="mt-8 overflow-hidden rounded-3xl shadow-md">
                    <img
                      src={talkImage}
                      alt="Vortrag im NIO House Berlin"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal width="100%">
                <ol className="relative border-l border-brand-secondary/30 pl-8">
                  {programme.map((item, index) => {
                    const isLast = index === programme.length - 1
                    return (
                      <li key={item.time} className={`relative ${isLast ? '' : 'pb-8'}`}>
                        <span
                          className={`absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-slate-50 ${
                            isLast ? 'bg-accent' : 'bg-brand-primary'
                          }`}
                          aria-hidden="true"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        </span>
                        <div className="rounded-2xl border border-ui-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                            <time className="text-sm font-semibold tabular-nums text-brand-primary">
                              {item.time}
                            </time>
                            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{item.text}</p>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* SESSIONS                                                            */}
        {/* ------------------------------------------------------------------ */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-container px-4 lg:px-0">
            <Reveal width="100%">
              <div className="flex flex-col items-center text-center">
                <Eyebrow>{ff('sessions.eyebrow')}</Eyebrow>
                <h2 className="mt-4 max-w-[24ch] text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
                  {ff('sessions.title')}
                </h2>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {sessions.map((session, index) => (
                <Reveal key={session.time} width="100%" delay={index * 0.1}>
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-ui-border bg-white shadow-md">
                    <div className="h-1 bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-deep" />
                    <div className="flex flex-1 flex-col p-6 lg:p-7">
                      <div className="flex items-center justify-between gap-3">
                        <time className="text-sm font-semibold tabular-nums text-brand-primary">
                          {session.time}
                        </time>
                        <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-primary">
                          {session.role}
                        </span>
                      </div>
                      <p className="mt-4 text-lg font-semibold text-gray-900">{session.speaker}</p>
                      <h3 className="mt-3 text-xl font-medium tracking-tight text-brand-deep">
                        {session.title}
                      </h3>
                      <p className="mt-2 text-sm font-semibold italic text-accent-strong">
                        {session.claim}
                      </p>
                      <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">{session.text}</p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {session.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border border-accent-border bg-accent-soft px-3 py-1 text-xs font-medium text-accent-strong"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* LIVE: TEST · PLAN · NAVIGATE · DECIDE                                */}
        {/* ------------------------------------------------------------------ */}
        <section className="bg-white pb-20 lg:pb-28">
          <div className="mx-auto max-w-container px-4 lg:px-0">
            <Reveal width="100%">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary via-brand-deep to-[#203864] px-7 py-12 text-white lg:px-14 lg:py-16">
                <div className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full bg-brand-secondary/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 left-1/3 h-[280px] w-[280px] rounded-full bg-accent/20 blur-3xl" />

                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
                    {ff('live.eyebrow')}
                  </p>
                  <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
                    {ff('live.title')}
                  </h2>
                  <p className="mt-4 max-w-[60ch] text-base leading-7 text-white/80">
                    {ff('live.text')}
                  </p>

                  <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stations.map((station) => (
                      <div
                        key={station.num}
                        className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-semibold text-accent-on-dark">
                            {station.num}
                          </span>
                          <span className="rounded-full border border-white/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">
                            {station.tag}
                          </span>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold">{station.title}</h3>
                        <p className="mt-1 text-sm text-white/75">{station.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-accent-on-dark/30 bg-accent/10 p-5 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <Sparkles
                        className="h-6 w-6 shrink-0 text-accent-on-dark"
                        aria-hidden="true"
                      />
                      <time className="text-sm font-semibold tabular-nums text-accent-on-dark">
                        {ff('live.challenge_time')}
                      </time>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{ff('live.challenge_title')}</h3>
                      <p className="mt-1 text-sm text-white/80">{ff('live.challenge_text')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* PARTNER                                                             */}
        {/* ------------------------------------------------------------------ */}
        <section className="bg-slate-50 py-20 lg:py-28">
          <div className="mx-auto max-w-container px-4 lg:px-0">
            <Reveal width="100%">
              <div className="flex flex-col items-center text-center">
                <Eyebrow>{ff('partners.eyebrow')}</Eyebrow>
                <h2 className="mt-4 text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
                  {ff('partners.title')}
                </h2>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {partners.map((partner, index) => (
                <Reveal key={partner.name} width="100%" delay={index * 0.1}>
                  <div className="flex h-full flex-col items-center rounded-2xl border border-ui-border bg-white p-6 text-center shadow-sm lg:p-8">
                    {PARTNER_LOGOS[partner.name] ? (
                      <img
                        src={PARTNER_LOGOS[partner.name]}
                        alt={partner.name}
                        className="h-10 w-auto max-w-[180px] object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-gray-900">{partner.name}</span>
                    )}
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
                      {partner.role}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{partner.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal width="100%">
              <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-brand-secondary/30 bg-white/60 px-6 py-6 sm:flex-row">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-gray-500">
                  <Award className="h-4 w-4 text-brand-secondary" aria-hidden="true" />
                  {ff('partners.supported_label')}
                </div>
                <img
                  src={logoLsn}
                  alt="Life Science Nord"
                  className="h-12 w-auto object-contain"
                  loading="lazy"
                />
                <p className="text-sm text-gray-600">{ff('partners.supporter')}</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* AFTER HOURS                                                         */}
        {/* ------------------------------------------------------------------ */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-container px-4 lg:px-0">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
              <Reveal width="100%">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 overflow-hidden rounded-3xl shadow-lg">
                    <img
                      src={afterHoursImage}
                      alt="NIO House Berlin am Abend"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-md">
                    <img
                      src={loungeImage}
                      alt="Lounge im NIO House Berlin"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="overflow-hidden rounded-2xl shadow-md">
                    <img
                      src={mediaAlleyImage}
                      alt="Media Alley im NIO House Berlin"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </Reveal>
              <Reveal width="100%">
                <div>
                  <Eyebrow>{ff('afterHours.eyebrow')}</Eyebrow>
                  <h2 className="mt-4 text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
                    {ff('afterHours.title')}
                  </h2>
                  <p className="mt-5 max-w-[56ch] text-base leading-7 text-gray-600">
                    {ff('afterHours.text')}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {afterHoursItems.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base text-gray-800">
                        <CheckCircle2
                          className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="#anmeldung"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-deep px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-deep/20 transition-colors hover:bg-brand-navy-hover"
                  >
                    {ff('hero.cta_register')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* ANMELDUNG                                                           */}
        {/* ------------------------------------------------------------------ */}
        <section id="anmeldung" className="scroll-mt-28 bg-slate-50 py-20 lg:py-28">
          <div className="mx-auto max-w-container px-4 lg:px-0">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
              <Reveal width="100%">
                <div className="rounded-3xl border border-ui-border bg-white p-6 shadow-md lg:p-10">
                  <Eyebrow>{ff('register.eyebrow')}</Eyebrow>
                  <h2 className="mt-4 text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
                    {ff('register.title')}
                  </h2>
                  <p className="mt-4 max-w-[60ch] text-base leading-7 text-gray-600">
                    {ff('register.text')}
                  </p>
                  <div className="mt-8">
                    <EventRegistrationForm
                      eventSlug={EVENT_SLUG}
                      textKey="futureForum.register"
                      lang={contentLang}
                    />
                  </div>
                </div>
              </Reveal>

              <Reveal width="100%" delay={0.1}>
                <aside className="overflow-hidden rounded-3xl bg-brand-deep text-white shadow-md">
                  <img
                    src={audienceImage}
                    alt=""
                    className="h-44 w-full object-cover opacity-90"
                    loading="lazy"
                  />
                  <div className="p-6 lg:p-8">
                    <h3 className="text-xl font-semibold">{ff('register.info_title')}</h3>
                    <dl className="mt-5 space-y-4">
                      {facts.map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-start gap-3">
                          <Icon
                            className="mt-0.5 h-5 w-5 shrink-0 text-accent-on-dark"
                            aria-hidden="true"
                          />
                          <div>
                            <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                              {label}
                            </dt>
                            <dd className="mt-0.5 text-sm text-white">{value}</dd>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-start gap-3">
                        <Award
                          className="mt-0.5 h-5 w-5 shrink-0 text-accent-on-dark"
                          aria-hidden="true"
                        />
                        <div>
                          <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                            {ff('register.info_organizer_label')}
                          </dt>
                          <dd className="mt-0.5 text-sm text-white">
                            {ff('register.info_organizer')}
                          </dd>
                        </div>
                      </div>
                    </dl>

                    <p className="mt-6 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs leading-5 text-white/80">
                      {ff('register.cme_note')}
                    </p>

                    <div className="mt-6 border-t border-white/15 pt-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                        {ff('register.info_contact_label')}
                      </p>
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="mt-2 flex items-center gap-2 text-sm text-white transition-colors hover:text-accent-on-dark"
                      >
                        <Mail className="h-4 w-4" aria-hidden="true" />
                        {CONTACT_EMAIL}
                      </a>
                      <a
                        href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`}
                        className="mt-1.5 flex items-center gap-2 text-sm text-white transition-colors hover:text-accent-on-dark"
                      >
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        {CONTACT_PHONE}
                      </a>
                    </div>
                  </div>
                </aside>
              </Reveal>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default EventFutureForumBerlinPage
