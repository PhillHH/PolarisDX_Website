import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './routes/HomePage'
import ArticlePage from './routes/ArticlePage'
import ContactPage from './routes/ContactPage'
import ShopPage from './routes/ShopPage'
import ProductPage from './routes/ProductPage'
import ServicePage from './routes/ServicePage'
import DownloadsPage from './routes/DownloadsPage'
import AboutPage from './routes/AboutPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:slug" element={<ProductPage />} />
        <Route path="/downloads" element={<DownloadsPage />} />
      </Routes>
    </Layout>
  )
}

export default App
