import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './routes/HomePage'
import ArticlePage from './routes/ArticlePage'
import ArticlesIndexPage from './routes/ArticlesIndexPage'
import ContactPage from './routes/ContactPage'
// import ShopPage from './routes/ShopPage'
// import ProductPage from './routes/ProductPage'
import ServicePage from './routes/ServicePage'
import ServicesOverviewPage from './routes/ServicesOverviewPage'
import DownloadsPage from './routes/DownloadsPage'
import AboutPage from './routes/AboutPage'
import TermsPage from './routes/TermsPage'
import PrivacyPage from './routes/PrivacyPage'
import ImprintPage from './routes/ImprintPage'
import { CookieBanner } from './components/ui/CookieBanner'
import MobileCallButton from './components/ui/MobileCallButton'
import ScrollToTop from './components/layout/ScrollToTop'

function App() {
  return (
    <Layout>
      <MobileCallButton />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/articles" element={<ArticlesIndexPage />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/services" element={<ServicesOverviewPage />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/imprint" element={<ImprintPage />} />
        <Route path="/terms" element={<TermsPage />} />
        {/* Shop temporarily disabled */}
        {/* <Route path="/shop" element={<ShopPage />} /> */}
        {/* <Route path="/shop/:slug" element={<ProductPage />} /> */}
        <Route path="/downloads" element={<DownloadsPage />} />
      </Routes>
      <CookieBanner />
    </Layout>
  )
}

export default App
