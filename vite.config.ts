import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// =============================================================================
// HINWEIS: asyncCssPlugin wurde entfernt
// =============================================================================
// Das async CSS-Loading hat FCP von 4.5s auf 1.7s reduziert, ABER:
// CLS ist von 0 auf 0.996 gestiegen (katastrophal).
//
// Das Critical CSS konnte nicht alle Layout-Klassen (space-y-*, gap-*, etc.)
// abdecken ohne selbst 20-30 KB groß zu werden.
//
// Google bestraft CLS stärker als langsamen FCP:
// - FCP 4.5s mit CLS 0 → Score 67
// - FCP 1.7s mit CLS 0.996 → Score 57
//
// Bei nur 74 KB CSS (12 KB gzip) ist blocking CSS die bessere Wahl.
// =============================================================================

// https://vite.dev/config/
// Verwende Funktion um SSR/Client Build zu unterscheiden
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
  ],

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
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-http-backend'],

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
