import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  MonitorSmartphone,
  ShieldCheck,
  Flame,
  HeartPulse,
  Dna,
  Puzzle,
} from 'lucide-react'
import type { ReactNode } from 'react'
import Eyebrow from '../ui/Eyebrow'

type FocusCard = {
  id: string
  tkey: string
  fkey: string
  icon: ReactNode
}

const cards: FocusCard[] = [
  { id: 'poc-systemloesungen', tkey: 'poc_systemloesungen', fkey: 'poc', icon: <MonitorSmartphone /> },
  { id: 'praeventions-checks', tkey: 'praeventions_checks', fkey: 'checks', icon: <ShieldCheck /> },
  { id: 'infektion-entzuendung', tkey: 'infektion_entzuendung', fkey: 'infection', icon: <Flame /> },
  { id: 'stoffwechsel-herz', tkey: 'stoffwechsel_herz', fkey: 'metabolism', icon: <HeartPulse /> },
  { id: 'hormon-tests', tkey: 'hormon_tests', fkey: 'hormone', icon: <Dna /> },
  { id: 'kompatibilitaet-integration', tkey: 'kompatibilitaet_integration', fkey: 'compat', icon: <Puzzle /> },
]

const DiagnosticsFocusSection = () => {
  const { t } = useTranslation(['home', 'services'])

  return (
    <>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-container px-4 lg:px-0 py-24 lg:py-28">
          <div className="mb-14 text-center">
            <Eyebrow>{t('home:services.caption', 'DIAGNOSTIK-FOKUS')}</Eyebrow>
            <h2 className="mt-3 text-3xl lg:text-[42px] font-medium tracking-tight text-heading">
              {t('home:services.title', 'Schlüsselbereiche der Präventivdiagnostik')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-gray-700">
              {t('services:overview.focus.subtitle')}
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {cards.map(({ id, tkey, fkey, icon }) => {
              const raw = t(`services:overview.focus.${fkey}.tags`, { returnObjects: true })
              const tags = Array.isArray(raw) ? raw : []

              return (
                <Link
                  key={id}
                  to={`/diagnostics/${id}`}
                  className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-card"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <span className="[&>svg]:h-5 [&>svg]:w-5">{icon}</span>
                  </span>
                  <h3 className="mt-5 text-lg font-medium text-heading">
                    {t(`home:services.${tkey}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {t(`home:services.${tkey}.description`)}
                  </p>
                  {tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="mt-auto pt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:text-accent-strong">
                    {t(`services:overview.focus.${fkey}.cta`) + ' →'}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-container px-4 lg:px-0 pb-24 lg:pb-28">
          <div className="rounded-2xl bg-accent p-6 lg:p-8 text-white flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium">{t('home:igloo_widget.help_title')}</p>
              <p className="text-sm text-white/85">{t('home:igloo_widget.help_text')}</p>
            </div>
            <Link
              to="/contact"
              className="whitespace-nowrap rounded-md bg-white px-5 py-3 font-medium text-brand-deep"
            >
              {t('home:igloo_widget.help_cta', 'Termin wählen')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default DiagnosticsFocusSection
