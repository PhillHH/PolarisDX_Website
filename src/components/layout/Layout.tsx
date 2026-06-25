import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation('common')

  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg-heading">
      {/*
        A11y (WCAG 2.4.1 Bypass Blocks): Skip-Link als erstes fokussierbares
        Element. Standardmäßig per sr-only ausgeblendet, beim Tastatur-Fokus
        sichtbar. Springt auf das <main>-Landmark und setzt dort den Fokus.
      */}
      <a
        href="#main-content"
        className="sr-only rounded-md bg-surface px-4 py-2 text-fg-heading shadow-card outline-none focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:ring-2 focus-visible:ring-action-primary"
      >
        {t('a11y.skipToContent', 'Zum Inhalt springen')}
      </a>
      <ScrollToTop />
      <Header />
      {/*
        flex-grow ensures the main content takes up the available space
        and pushes the footer to the bottom. tabIndex={-1} macht das Landmark
        programmatisch fokussierbar (Ziel des Skip-Links), ohne es in die
        Tab-Reihenfolge aufzunehmen.
      */}
      <main id="main-content" tabIndex={-1} className="flex-grow flex flex-col outline-none">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
