import Header from './Header'
import Footer from './Footer'

type LayoutProps = {
  children: React.ReactNode
}

/**
 * Layout-Komponente.
 * Dient als Wrapper für alle Seiten und stellt Header und Footer bereit.
 * @param children Der Inhalt der Seite, der zwischen Header und Footer gerendert wird.
 */
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
