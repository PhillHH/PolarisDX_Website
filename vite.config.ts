import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// =============================================================================
// CRITICAL CSS - Inline styles für above-the-fold Content (~4KB)
// Verhindert render-blocking CSS und eliminiert FOUC
// =============================================================================
const CRITICAL_CSS = `
/* Box-sizing Reset */
*,::before,::after{box-sizing:border-box}

/* Base */
html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji"}
body{margin:0;line-height:inherit;background-color:#fff}
img,svg{display:block;max-width:100%;height:auto}
button{font-family:inherit;font-size:100%;line-height:inherit;color:inherit;margin:0;padding:0;background-color:transparent;cursor:pointer}
a{color:inherit;text-decoration:inherit}
h1,h2,h3,p{margin:0}

/* Layout */
.relative{position:relative}
.absolute{position:absolute}
.fixed{position:fixed}
.inset-0{inset:0}
.inset-x-0{left:0;right:0}
.top-0{top:0}
.bottom-0{bottom:0}
.right-0{right:0}
.left-0{left:0}
.z-10{z-index:10}
.z-20{z-index:20}
.z-30{z-index:30}
.z-50{z-index:50}

/* Flex */
.flex{display:flex}
.inline-flex{display:inline-flex}
.flex-col{flex-direction:column}
.flex-row{flex-direction:row}
.flex-1{flex:1 1 0%}
.flex-shrink-0{flex-shrink:0}
.items-center{align-items:center}
.items-start{align-items:flex-start}
.items-end{align-items:flex-end}
.justify-center{justify-content:center}
.justify-between{justify-content:space-between}
.justify-end{justify-content:flex-end}
.gap-2{gap:.5rem}
.gap-3{gap:.75rem}
.gap-4{gap:1rem}
.gap-6{gap:1.5rem}
.gap-8{gap:2rem}

/* Grid */
.grid{display:grid}
.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}

/* Sizing */
.h-full{height:100%}
.h-10{height:2.5rem}
.h-12{height:3rem}
.w-full{width:100%}
.w-auto{width:auto}
.min-h-screen{min-height:100vh}
.max-w-container{max-width:1200px}
.overflow-hidden{overflow:hidden}

/* Spacing */
.mx-auto{margin-left:auto;margin-right:auto}
.px-4{padding-left:1rem;padding-right:1rem}
.py-2{padding-top:.5rem;padding-bottom:.5rem}
.py-3{padding-top:.75rem;padding-bottom:.75rem}
.py-4{padding-top:1rem;padding-bottom:1rem}
.pt-16{padding-top:4rem}
.pt-20{padding-top:5rem}
.pb-8{padding-bottom:2rem}
.mb-4{margin-bottom:1rem}
.mb-6{margin-bottom:1.5rem}
.mt-auto{margin-top:auto}
.space-y-4>:not([hidden])~:not([hidden]){margin-top:1rem}
.space-y-6>:not([hidden])~:not([hidden]){margin-top:1.5rem}

/* Typography */
.text-xs{font-size:.75rem;line-height:1rem}
.text-sm{font-size:.875rem;line-height:1.25rem}
.text-base{font-size:1rem;line-height:1.5rem}
.text-lg{font-size:1.125rem;line-height:1.75rem}
.text-xl{font-size:1.25rem;line-height:1.75rem}
.text-2xl{font-size:1.5rem;line-height:2rem}
.text-3xl{font-size:1.875rem;line-height:2.25rem}
.text-4xl{font-size:2.25rem;line-height:2.5rem}
.text-5xl{font-size:3rem;line-height:1}
.font-medium{font-weight:500}
.font-semibold{font-weight:600}
.font-bold{font-weight:700}
.tracking-tight{letter-spacing:-.025em}
.leading-tight{line-height:1.25}
.leading-relaxed{line-height:1.625}
.text-center{text-align:center}
.uppercase{text-transform:uppercase}

/* Colors */
.text-white{color:#fff}
.text-white\\/70{color:rgba(255,255,255,.7)}
.text-white\\/80{color:rgba(255,255,255,.8)}
.text-white\\/90{color:rgba(255,255,255,.9)}
.text-gray-600{color:#4b5563}
.text-gray-700{color:#374151}
.text-gray-900{color:#111827}
.bg-white{background-color:#fff}
.bg-white\\/95{background-color:rgba(255,255,255,.95)}
.bg-gray-50{background-color:#f9fafb}

/* Brand Colors */
.text-brand-primary{color:#1e3a5f}
.text-brand-secondary{color:#14b8a6}
.bg-brand-primary{background-color:#1e3a5f}
.bg-brand-secondary{background-color:#14b8a6}
.bg-brand-deep{background-color:#0f2942}

/* Hero Gradient */
.bg-gradient-to-br{background-image:linear-gradient(to bottom right,var(--tw-gradient-stops))}
.from-brand-primary{--tw-gradient-from:#1e3a5f;--tw-gradient-to:rgba(30,58,95,0);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
.via-brand-deep{--tw-gradient-to:rgba(15,41,66,0);--tw-gradient-stops:var(--tw-gradient-from),#0f2942,var(--tw-gradient-to)}
.to-brand-primary{--tw-gradient-to:#1e3a5f}

/* Borders & Shadows */
.rounded-lg{border-radius:.5rem}
.rounded-xl{border-radius:.75rem}
.rounded-full{border-radius:9999px}
.border{border-width:1px}
.shadow-sm{box-shadow:0 1px 2px 0 rgba(0,0,0,.05)}
.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1)}

/* Visibility */
.hidden{display:none}
.block{display:block}
.invisible{visibility:hidden}
.opacity-0{opacity:0}
.opacity-100{opacity:1}

/* Transitions */
.transition{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:150ms}
.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:150ms}
.duration-300{transition-duration:300ms}

/* Responsive - lg breakpoint (1024px) */
@media(min-width:1024px){
.lg\\:flex{display:flex}
.lg\\:hidden{display:none}
.lg\\:flex-row{flex-direction:row}
.lg\\:items-center{align-items:center}
.lg\\:justify-between{justify-content:space-between}
.lg\\:gap-8{gap:2rem}
.lg\\:gap-16{gap:4rem}
.lg\\:px-0{padding-left:0;padding-right:0}
.lg\\:pt-8{padding-top:2rem}
.lg\\:text-5xl{font-size:3rem;line-height:1}
.lg\\:text-6xl{font-size:3.75rem;line-height:1}
.lg\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}
}

/* Responsive - md breakpoint (768px) */
@media(min-width:768px){
.md\\:flex{display:flex}
.md\\:hidden{display:none}
.md\\:flex-row{flex-direction:row}
.md\\:text-center{text-align:center}
}

/* Responsive - sm breakpoint (640px) */
@media(min-width:640px){
.sm\\:h-12{height:3rem}
.sm\\:text-4xl{font-size:2.25rem;line-height:2.5rem}
}

/* Object fit */
.object-cover{object-fit:cover}
.object-contain{object-fit:contain}
`.trim()

// =============================================================================
// VITE PLUGIN: Async CSS Loading
// Ersetzt render-blocking <link rel="stylesheet"> durch async loading
// =============================================================================
function asyncCssPlugin(): Plugin {
  return {
    name: 'async-css-critical',
    enforce: 'post',
    transformIndexHtml(html: string) {
      // Nur im Production Build (nicht im Dev-Server)
      // Im Dev-Modus enthält das HTML keinen <link rel="stylesheet"> Tag
      const cssRegex = /<link rel="stylesheet"[^>]*href="([^"]*\.css)"[^>]*>/g
      const match = cssRegex.exec(html)

      if (!match) {
        // Kein CSS-Link gefunden (Development-Modus)
        return html
      }

      const fullMatch = match[0]
      const cssHref = match[1]

      // Ersetze blocking CSS durch:
      // 1. Critical CSS inline
      // 2. Preload für async loading
      // 3. Noscript fallback
      const replacement = `<!-- Critical CSS (inline) -->
    <style id="critical-css">${CRITICAL_CSS}</style>
    <!-- Main CSS (async loaded) -->
    <link rel="preload" href="${cssHref}" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="${cssHref}"></noscript>`

      return html.replace(fullMatch, replacement)
    }
  }
}

// https://vite.dev/config/
// Verwende Funktion um SSR/Client Build zu unterscheiden
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    // Nur im Client-Build: Async CSS + Critical CSS
    !isSsrBuild && asyncCssPlugin(),
  ].filter(Boolean),

  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },

  // =============================================================================
  // SSR CONFIGURATION
  // =============================================================================
  ssr: {
    // Packages die NICHT gebundelt werden sollen (Node.js native modules)
    external: ['express', 'http-proxy-middleware'],

    // Packages die gebundelt werden MÜSSEN (haben keine ESM exports)
    noExternal: ['react-helmet-async'],
  },

  // =============================================================================
  // BUILD CONFIGURATION
  // =============================================================================
  build: {
    // Sourcemaps für besseres Debugging
    sourcemap: true,

    // ==========================================================================
    // CODE-SPLITTING: Nur für Client-Build, NICHT für SSR
    // Reduziert Initial Load und ermöglicht paralleles Laden
    // ==========================================================================
    rollupOptions: !isSsrBuild ? {
      output: {
        manualChunks: {
          // Vendor: React Core (wird auf jeder Seite gebraucht)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // i18n: Internationalisierung (wird auf jeder Seite gebraucht)
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-http-backend', 'i18next-browser-languagedetector'],

          // Framer Motion: Nur für Animationen (kann parallel geladen werden)
          'vendor-motion': ['framer-motion'],

          // Helmet: SEO (relativ klein, aber separiert für Caching)
          'vendor-seo': ['react-helmet-async'],
        },
      },
    } : {},

    // Erhöhe das Limit um Warnungen zu vermeiden
    chunkSizeWarningLimit: 600,
  },

  // =============================================================================
  // CSS CONFIGURATION
  // =============================================================================
  css: {
    devSourcemap: true,
  },

  // =============================================================================
  // SERVER CONFIGURATION (für Vite Dev Server / HMR im SSR-Modus)
  // =============================================================================
  server: {
    // 1. host: Bindet den Server an 0.0.0.0, damit er innerhalb des Docker-Netzwerks erreichbar ist.
    host: '0.0.0.0',

    // 2. allowedHosts: Erlaubt den Zugriff über diesen spezifischen Hostnamen (behebt 403 Forbidden).
    allowedHosts: ['relaunch.polarisdx.net'],

    // 3. HMR (Hot Module Replacement) Konfiguration
    hmr: {
      // WICHTIG: Setze das Protokoll explizit auf WSS (Secure WebSocket).
      // Dies behebt den Fehler, da der Browser WSS erwartet, wenn die Seite über HTTPS geladen wird.
      protocol: 'wss',

      // Definiert den Hostnamen, den der Browser für die HMR-Verbindung verwenden soll.
      host: 'relaunch.polarisdx.net',
    },

    // 4. Port (Interner Container-Port, den Vite nutzt)
    port: 5173,

    // 5. Proxy Configuration for API (nur für reinen Vite dev mode, nicht SSR)
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}))
