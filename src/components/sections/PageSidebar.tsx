import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Reveal from '../ui/Reveal'
import { Button } from '../ui/Button'

/**
 * PageSidebar — EINE geteilte rechte Sidebar für ServicePage und ArticlePage.
 *
 * Faithful Refactor (Slice 1 / G3): reproduziert das bisherige, pro Seite von Hand
 * kopierte Markup 1:1 — keine visuelle Änderung. Jede Seite gibt ihre Reihenfolge und
 * die Widget-Optionen vor (die beiden Seiten unterschieden sich in Reihenfolge, Icon-Quelle,
 * Artikel-Darstellung und Slice; diese Divergenzen bleiben über Props exakt erhalten).
 *
 * Abstand: das erste Widget hat keinen `mt-8`, alle folgenden `mt-8` — genau wie zuvor.
 */

export type SidebarServiceItem = {
  id: string
  translationKey: string
  title: string
  /** Fertig dimensioniertes Icon (ServicePage berechnet es aus der id, ArticlePage nimmt s.icon). */
  icon: ReactNode
}

export type SidebarArticleItem = {
  id: string
  slug: string
  category: string
  readTime: string
  date: string
}

export type SidebarWidget =
  | { kind: 'services'; titleKey: string; titleFallback?: string; items: SidebarServiceItem[] }
  | {
      kind: 'articles'
      titleKey: string
      titleFallback?: string
      items: SidebarArticleItem[]
      /** 'plain' = ServicePage (block group), 'card' = ArticlePage (hover-card). */
      variant?: 'plain' | 'card'
      limit?: number
      hideOnMobile?: boolean
    }
  | { kind: 'contact' }
  /** Querverweis auf die Epigenetik-Strecke — die zweite Saeule neben Point-of-Care. */
  | { kind: 'epigenetics' }

const sectionBase = 'rounded-2xl border border-gray-100 bg-white p-5 '

export function PageSidebar({ widgets }: { widgets: SidebarWidget[] }) {
  const { t } = useTranslation(['home', 'articles', 'common', 'epigenetics'])

  return (
    <aside className="space-y-8 lg:sticky lg:top-32">
      <Reveal width="100%" delay={0.2}>
        {widgets.map((w, i) => {
          const spacing = i > 0 ? ' mt-8' : ''

          if (w.kind === 'services') {
            return (
              <section key={`services-${i}`} className={sectionBase + spacing}>
                <h2 className="mb-4 text-xs font-medium text-gray-500">
                  {t(w.titleKey, w.titleFallback ?? '')}
                </h2>
                <div className="space-y-3">
                  {w.items.map((s) => (
                    <Link
                      key={s.id}
                      to={`/diagnostics/${s.id}`}
                      className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 transition-all duration-300 hover:border-brand-primary/30 hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-secondary transition-colors group-hover:bg-brand-secondary group-hover:text-white">
                          {s.icon}
                        </div>
                        <span className="font-medium text-heading group-hover:text-brand-secondary">
                          {t(`home:services.${s.translationKey}.title`, s.title)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )
          }

          if (w.kind === 'articles') {
            const variant = w.variant ?? 'plain'
            const items = typeof w.limit === 'number' ? w.items.slice(0, w.limit) : w.items
            const hide = w.hideOnMobile ? ' hidden lg:block' : ''
            return (
              <section key={`articles-${i}`} className={sectionBase + spacing + hide}>
                <h2 className="mb-4 text-xs font-medium text-gray-500">
                  {t(w.titleKey, w.titleFallback ?? '')}
                </h2>
                <div className="space-y-4">
                  {items.map((post) => (
                    <Link
                      key={post.id}
                      to={`/articles/${post.slug}`}
                      className={
                        variant === 'card'
                          ? 'block rounded-lg p-3 transition hover:bg-slate-50'
                          : 'block group'
                      }
                    >
                      <p
                        className={
                          variant === 'card'
                            ? 'text-xs font-medium text-gray-500'
                            : 'text-xs font-medium text-gray-500 mb-1'
                        }
                      >
                        {t(`common:category.${post.category}`, post.category)}
                      </p>
                      <p
                        className={
                          variant === 'card'
                            ? 'mt-1 text-sm font-semibold text-heading'
                            : 'text-sm font-semibold text-heading group-hover:text-brand-secondary transition-colors'
                        }
                      >
                        {t(`articles:${post.id}.title`)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {post.readTime} · {post.date}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )
          }

          if (w.kind === 'epigenetics') {
            return (
              <section key={`epigenetics-${i}`} className={sectionBase + spacing}>
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent-strong" aria-hidden="true" />
                  <h3 className="text-sm font-semibold tracking-tight text-heading">
                    {t('epigenetics:sidebar.title')}
                  </h3>
                </div>
                <p className="mb-3 text-xs leading-relaxed text-gray-500">
                  {t('epigenetics:sidebar.text')}
                </p>
                <Link
                  to="/epigenetics"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent-strong"
                >
                  {t('epigenetics:sidebar.cta')}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </section>
            )
          }

          // kind === 'contact'
          return (
            <section key={`contact-${i}`} className={sectionBase + spacing}>
              <h3 className="mb-2 text-sm font-semibold tracking-tight text-heading">
                {t('articles:ui.needHelp')}
              </h3>
              <p className="mb-3 text-xs leading-relaxed text-gray-500">
                {t('articles:ui.contactText')}
              </p>
              <Button to="/contact" variant="secondary" className="w-full justify-center">
                {t('common:nav.contact', 'Kontakt aufnehmen')}
              </Button>
            </section>
          )
        })}
      </Reveal>
    </aside>
  )
}

export default PageSidebar
