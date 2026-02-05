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
        description={t('notFound.seo.description', 'Die angeforderte Seite konnte nicht gefunden werden.')}
        noindex={true}
      />

      <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-brand-primary via-brand-deep to-gray-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
          <Reveal width="100%" yOffset={20}>
            {/* 404 Number */}
            <div className="mb-8">
              <span className="text-[10rem] sm:text-[12rem] font-bold leading-none bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent opacity-80">
                404
              </span>
            </div>

            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-block rounded p-px bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                <div className="rounded-sm bg-slate-50 px-4 py-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-900">
                    {t('notFound.badge', 'Seite nicht gefunden')}
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl text-white mb-6">
              {t('notFound.title', 'Oops! Diese Seite existiert nicht')}
            </h1>

            {/* Description */}
            <p className="mx-auto max-w-lg text-lg text-white/80 mb-10">
              {t('notFound.description', 'Die von Ihnen gesuchte Seite wurde möglicherweise verschoben, gelöscht oder existiert nicht mehr.')}
            </p>

            {/* Primary CTA */}
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-brand-primary shadow-lg shadow-white/20 transition-all hover:bg-gray-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <Home className="h-5 w-5" />
              {t('notFound.backHome', 'Zurück zur Startseite')}
            </Link>
          </Reveal>

          {/* Popular Pages */}
          <Reveal width="100%" delay={0.2}>
            <div className="mt-16 pt-10 border-t border-white/20">
              <p className="text-sm text-white/60 mb-6 uppercase tracking-wider">
                {t('notFound.popularPages', 'Beliebte Seiten')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {popularPages.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    className="group flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white/90 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
                  >
                    <page.icon className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
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
