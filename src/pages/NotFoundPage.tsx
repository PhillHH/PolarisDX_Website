import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { SEOHead } from '../components/seo'
import SubPage from '../components/sub/SubPage'
import SubStage from '../components/sub/SubStage'
import PageTransition from '../components/ui/PageTransition'

const NotFoundPage = () => {
  const { t } = useTranslation('common')

  const popularPages = [
    { name: t('notFound.links.home', 'Startseite'), path: '/' },
    { name: t('notFound.links.iglooPro', 'IglooPro'), path: '/igloo-pro' },
    { name: t('notFound.links.services', 'Services'), path: '/diagnostics' },
    { name: t('notFound.links.contact', 'Kontakt'), path: '/contact' },
  ]

  return (
    <PageTransition>
      {/* notFound (statt noindex) sagt SEOHead: robots noindex, KEIN canonical
          und KEINE hreflang-Alternates. Vorher warb die Fehlerseite unter z.B.
          /de/agb per canonical und elf Alternates fuer sich selbst als
          gueltige zehnsprachige Seite. Der Marker im Head laesst server.ts
          ausserdem einen echten HTTP 404 senden statt 200. */}
      <SEOHead
        title={t('notFound.seo.title', 'Seite nicht gefunden (404)')}
        description={t(
          'notFound.seo.description',
          'Die angeforderte Seite konnte nicht gefunden werden.',
        )}
        notFound
      />

      <SubPage>
        {/* SC-028: dieselbe Bühne wie die übrigen Unterseiten; die Zahl steht rechts, die
            beliebten Seiten als Verweise unter der Aktion. */}
        <SubStage
          className="sc028-stage-404"
          eyebrow={t('notFound.badge', 'Seite nicht gefunden')}
          title={t('notFound.title', 'Oops! Diese Seite existiert nicht')}
          lead={
            <p>
              {t(
                'notFound.description',
                'Die von Ihnen gesuchte Seite wurde möglicherweise verschoben, gelöscht oder existiert nicht mehr.',
              )}
            </p>
          }
          actions={
            <Link
              to="/"
              className="sc025-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-dark focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
            >
              {t('notFound.backHome', 'Zurück zur Startseite')}
              <ArrowRight aria-hidden="true" />
            </Link>
          }
          note={
            <>
              <p>
                <b>{t('notFound.popularPages', 'Beliebte Seiten')}</b>
              </p>
              <div className="sc028-links">
                {popularPages.map((page) => (
                  <Link key={page.path} to={page.path} className="sc025-underlink">
                    <span>{page.name}</span>
                  </Link>
                ))}
              </div>
            </>
          }
          aside={
            <p className="sc028-aside-big" aria-hidden="true">
              404
            </p>
          }
        />
      </SubPage>
    </PageTransition>
  )
}

export default NotFoundPage
