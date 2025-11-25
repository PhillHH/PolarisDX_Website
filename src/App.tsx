import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './routes/HomePage'
import ArticlePage from './routes/ArticlePage'
import ContactPage from './routes/ContactPage'
import ShopPage from './routes/ShopPage'
import ProductPage from './routes/ProductPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:slug" element={<ProductPage />} />
      </Routes>
    </Layout>
  )
}

export default App
