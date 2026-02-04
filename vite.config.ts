import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

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
})
