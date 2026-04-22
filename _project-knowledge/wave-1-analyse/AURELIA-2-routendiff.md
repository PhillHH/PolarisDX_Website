## Routen in App.tsx (SSR)

/
/about
/articles
/articles/:slug
/diagnostics
/diagnostics/:slug
/contact
/support
/privacy
/imprint
/terms
/events
/igloo-pro
/vitamin-d3-implantologie
/s3_leitlinie
/vitamin-d3-spray
/casestudys/32reasons
/shop
/shop/:slug
/downloads
/services
/services/:slug

-

## Routen in App.lazy.tsx (Client)

/
/about
/articles
/articles/:slug
/diagnostics
/diagnostics/:slug
/contact
/support
/privacy
/imprint
/terms
/events
/igloo-pro
/vitamin-d3-implantologie
/s3_leitlinie
/vitamin-d3-spray
/downloads
/services
/services/:slug

-

## Nur in App.tsx

/casestudys/32reasons
/shop
/shop/:slug

## Nur in App.lazy.tsx

keine

## Auskommentierte Routen

```
src/App.tsx:
 8: // import ShopPage from './routes/ShopPage'
 9: // import ProductPage from './routes/ProductPage'
23: // import CaseStudy32Reasons from './routes/CaseStudy32Reasons' // temporarily disabled
56: {/* <Route path="/casestudys/32reasons" element={<CaseStudy32Reasons />} /> */}
58: {/* <Route path="/shop" element={<ShopPage />} /> */}
59: {/* <Route path="/shop/:slug" element={<ProductPage />} /> */}

src/App.lazy.tsx:
(keine Treffer)
```
