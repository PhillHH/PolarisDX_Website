import { type ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import SkipLink, { MAIN_CONTENT_ID } from './SkipLink'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-heading">
      {/* Erstes fokussierbares Element im Dokument — sonst greift der Sprung
          ins Leere (WCAG 2.4.1). */}
      <SkipLink />
      <ScrollToTop />
      <Header />
      {/*
        flex-grow ensures the main content takes up the available space
        and pushes the footer to the bottom.
      */}
      {/* `tabIndex={-1}`: ohne ihn setzt der Browser den Fokus beim Sprung
          NICHT auf das <main>, sondern scrollt nur — die naechste Tab-Taste
          landete dann wieder oben in der Navigation. */}
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className="flex flex-grow flex-col focus:outline-none"
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
