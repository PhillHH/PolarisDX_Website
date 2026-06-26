import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, ArrowLeft, Search, FileQuestion } from 'lucide-react'
import { SEOHead } from '../components/seo'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

const NotFoundPage = () => {
  const { t } = useTranslation('common')

  const popularPages = [
    { name: t('notFound.links.home', 'Startseite'), path: '/', icon: Home },
    { name: t('notFound.links.iglooPro', 'IglooPro'), path: '/igloo-pro', icon: Search },
    { name: t('notFound.links.services', 'Services'), path: '/diagnostics', icon: FileQuestion },
    { name: t('notFound.links.contact', 'Kontakt'), path: '/contact', icon: ArrowLeft },
  ]

  return (
    <PageTransition>
      <SEOHead
        title={t('notFound.seo.title', 'Seite nicht gefunden | PolarisDX')}
        description={t(
          'notFound.seo.description',
          'Die angeforderte Seite konnte nicht gefunden werden.',
        )}
        noindex={true}
      />

      <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-brand-primary via-brand-deep to-brand-heading text-fg-on-dark overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />

        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
          <Reveal width="100%" yOffset={20}>
            {/* 404 Number */}
            <div className="mb-8">
              {/* ASSUMPTION — needs human confirmation: dekorativer Rainbow-Gradient
                  ohne DS-Rolle; auf helle Cool-Brand-Stops (accent→blue-bright→teal-300)
                  tokenisiert, damit der Clip-Text auf dem Navy-Hero sichtbar bleibt. */}
              <span className="text-display-xl font-bold leading-none bg-gradient-to-r from-accent via-brand-secondary to-accent-on-dark bg-clip-text text-transparent opacity-80">
                404
              </span>
            </div>

            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-block rounded p-px bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-heading">
                <div className="rounded-sm bg-bg px-4 py-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-fg-heading">
                    {t('notFound.badge', 'Seite nicht gefunden')}
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-display-sm font-medium tracking-tight text-fg-on-dark mb-6">
              {t('notFound.title', 'Diese Seite konnte nicht gefunden werden')}
            </h1>

            {/* Description */}
            <p className="mx-auto max-w-lg text-lg text-fg-on-dark/80 mb-10">
              {t(
                'notFound.description',
                'Die von Ihnen gesuchte Seite wurde möglicherweise verschoben, gelöscht oder existiert nicht mehr.',
              )}
            </p>

            {/* Primary CTA */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg bg-surface px-6 py-3 text-base font-semibold text-brand-primary shadow-2 transition-all hover:bg-bg-subtle hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]"
            >
              <Home className="h-5 w-5" />
              {t('notFound.backHome', 'Zurück zur Startseite')}
            </Link>
          </Reveal>

          {/* Popular Pages */}
          <Reveal width="100%" delay={0.2}>
            <div className="mt-16 pt-10 border-t border-fg-on-dark/20">
              <p className="text-sm text-fg-on-dark/60 mb-6 uppercase tracking-wider">
                {t('notFound.popularPages', 'Beliebte Seiten')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {popularPages.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    className="group flex items-center gap-2 min-h-[var(--tap-target-min)] rounded-lg bg-fg-on-dark/10 px-4 py-2.5 text-sm font-medium text-fg-on-dark/90 backdrop-blur-sm transition-all hover:bg-fg-on-dark/20 hover:text-fg-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring-on-dark)]"
                  >
                    <page.icon className="h-4 w-4 text-fg-on-dark/60 group-hover:text-fg-on-dark transition-colors" />
                    {page.name}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  )
}

export default NotFoundPage
