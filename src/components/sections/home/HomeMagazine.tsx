import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import BlogCard from '../../ui/BlogCard'
import { blogPosts } from '../../../data/blogPosts'
import { getArticleImageUrl } from '../../../assets/articleImages'
import SectionIntro from './SectionIntro'

/**
 * HomeMagazine — Magazin/Fachartikel (§NEWLOOK-HOME §4.8).
 *
 * Ein hervorgehobener Fachartikel (Vitamin-D3-Implantologie) plus drei
 * `BlogCard` aus `blogPosts`. Heller, ruhiger Auftritt; Abschluss-Link in die
 * Artikelübersicht. Inhalt unverändert (Teaser aus der Artikel-DB).
 */
const HomeMagazine = () => {
  const { t } = useTranslation('home')

  return (
    <section id="blog" className="bg-bg">
      <div className="mx-auto max-w-container px-4 py-24 lg:px-0 lg:py-32">
        <SectionIntro
          eyebrow={t('blog.caption', 'Magazin')}
          title={t('blog.title', 'Fachartikel und Aktuelles zur Point-of-Care-Diagnostik')}
        />

        {/* Featured */}
        <Link
          to="/vitamin-d3-implantologie"
          className="group mt-12 block overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-1 transition-all duration-300 hover:border-brand-blue/30 hover:shadow-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus-ring)] sm:p-10"
        >
          <span className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-overline text-brand-blue-bright">
            <span aria-hidden="true" className="h-px w-8 bg-brand-blue-bright/50" />
            {t('blog.featured', 'Fachartikel')}
          </span>
          <h3 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight text-fg-heading transition-colors group-hover:text-brand-blue sm:text-3xl">
            Vitamin D3 und Implantologie — Evidenz und Praxisleitfaden
          </h3>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-fg-muted">
            Wissenschaftlich fundierte Erkenntnisse zur Rolle von Vitamin D bei der
            Osseointegration.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue">
            {t('common:read_more', 'Weiterlesen')}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              strokeWidth={2}
              aria-hidden="true"
            />
          </span>
        </Link>

        {/* Article grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {blogPosts.slice(0, 3).map((post) => (
            <BlogCard
              key={post.id}
              id={post.id}
              to={`/articles/${post.slug}`}
              imageUrl={getArticleImageUrl(post.image)}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/articles"
            className="inline-flex min-h-[var(--tap-target-min)] items-center gap-2 rounded-md px-2 text-sm font-semibold text-fg-heading transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
          >
            {t('blog.all_articles', 'Alle Fachartikel anzeigen')}
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HomeMagazine
