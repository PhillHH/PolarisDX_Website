import { type ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-gray-900">
      <ScrollToTop />
      <Header />
      {/*
        flex-grow ensures the main content takes up the available space
        and pushes the footer to the bottom.
      */}
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
