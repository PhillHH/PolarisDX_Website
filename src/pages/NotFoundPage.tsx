import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, Microscope, Activity, Mail } from 'lucide-react'
import { SEOHead } from '../components/seo'
import { Button } from '../components/ui/Button'
import PageTransition from '../components/ui/PageTransition'
import Reveal from '../components/ui/Reveal'

const NotFoundPage = () => {
  const { t } = useTranslation('common')

  const popularPages = [
    { name: t('notFound.links.home', 'Startseite'), path: '/', icon: Home },
    { name: t('notFound.links.iglooPro', 'IglooPro'), path: '/igloo-pro', icon: Microscope },
    { name: t('notFound.links.services', 'Services'), path: '/diagnostics', icon: Activity },
    { name: t('notFound.links.contact', 'Kontakt'), path: '/contact', icon: Mail },
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

      <div className="flex min-h-[80vh] items-center justify-center bg-brand-deep text-white">
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <Reveal width="100%" yOffset={20}>
            {/* 404 Number */}
            <span className="block text-[8rem] font-medium leading-none tracking-tight text-accent sm:text-[10rem]">
              404
            </span>

            {/* Eyebrow */}
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
              {t('notFound.badge', 'Seite nicht gefunden')}
            </p>

            {/* Title */}
            <h1 className="mt-4 text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t('notFound.title', 'Oops! Diese Seite existiert nicht')}
            </h1>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/80">
              {t(
                'notFound.description',
                'Die von Ihnen gesuchte Seite wurde möglicherweise verschoben, gelöscht oder existiert nicht mehr.',
              )}
            </p>

            {/* Primary CTA */}
            <div className="mt-10">
              <Button
                to="/"
                variant="secondary"
                className="!bg-accent !text-white !shadow-accent/20 hover:!bg-accent-strong focus-visible:!ring-accent"
              >
                <Home className="h-5 w-5" />
                {t('notFound.backHome', 'Zurück zur Startseite')}
              </Button>
            </div>
          </Reveal>

          {/* Popular Pages */}
          <Reveal width="100%" delay={0.2}>
            <div className="mt-16 border-t border-white/15 pt-10">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark">
                {t('notFound.popularPages', 'Beliebte Seiten')}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {popularPages.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    className="group inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90 ring-1 ring-white/15 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <page.icon className="h-4 w-4 text-accent-line" aria-hidden />
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
