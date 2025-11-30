import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.tsx'

// Initialisiert die React-Anwendung und bindet sie an das DOM-Element mit der ID 'root'.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Router-Provider für Client-Side-Routing */}
    <BrowserRouter>
      {/* Suspense fängt Ladezustände ab, insbesondere für das asynchrone Laden von Übersetzungen via i18next */}
      <Suspense fallback="Loading...">
        <App />
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
