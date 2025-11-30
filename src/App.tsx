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

/**
 * Hauptkomponente der Anwendung.
 * Definiert die Routing-Struktur und umschließt alle Seiten mit dem globalen Layout.
 */
function App() {
  return (
    <Layout>
      <Routes>
        {/* Startseite */}
        <Route path="/" element={<HomePage />} />

        {/* Über Uns Seite */}
        <Route path="/about" element={<AboutPage />} />

        {/* Detailseite für Artikel/Blogposts (dynamischer Slug) */}
        <Route path="/articles/:slug" element={<ArticlePage />} />

        {/* Detailseite für Dienstleistungen (dynamischer Slug) */}
        <Route path="/services/:slug" element={<ServicePage />} />

        {/* Kontaktseite */}
        <Route path="/contact" element={<ContactPage />} />

        {/* Shop-Übersicht */}
        <Route path="/shop" element={<ShopPage />} />

        {/* Produkt-Detailseite (dynamischer Slug) */}
        <Route path="/shop/:slug" element={<ProductPage />} />

        {/* Download-Bereich */}
        <Route path="/downloads" element={<DownloadsPage />} />
      </Routes>
    </Layout>
  )
}

export default App
