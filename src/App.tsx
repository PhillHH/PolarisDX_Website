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
import EventsPage from './pages/EventsPage'
import IglooProPage from './pages/IglooProPage'
import NotFoundPage from './pages/NotFoundPage'
// import CaseStudy32Reasons from './routes/CaseStudy32Reasons' // temporarily disabled
import { CookieBanner } from './components/ui/CookieBanner'
import MobileCallButton from './components/ui/MobileCallButton'
import ChatWidget from './components/ui/ChatWidget'

function App() {
  return (
    <Layout>
      <MobileCallButton />
      <ChatWidget />
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
        <Route path="/events" element={<EventsPage />} />
        <Route path="/igloo-pro" element={<IglooProPage />} />
        {/* <Route path="/casestudys/32reasons" element={<CaseStudy32Reasons />} /> */}
        {/* Shop temporarily disabled */}
        {/* <Route path="/shop" element={<ShopPage />} /> */}
        {/* <Route path="/shop/:slug" element={<ProductPage />} /> */}
        <Route path="/downloads" element={<DownloadsPage />} />
        {/* Catch-all 404 route - must be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <CookieBanner />
    </Layout>
  )
}

export default App
