import Header from './Header'
import Footer from './Footer'

type LayoutProps = {
  children: React.ReactNode
}

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


