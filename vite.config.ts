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
  plugins: [react()],

  // =============================================================================
  // DEP-OPTIMIZER-CACHE (opt-in, Default unveraendert)
  // =============================================================================
  // Ohne gesetzte Variable bleibt alles wie bisher (`node_modules/.vite`).
  // Grund fuer die Ausweichmoeglichkeit: auf dieser Maschine laufen
  // Preview-Container als root gegen denselben Repositoriumspfad und legen
  // `node_modules/.vite/deps` root-eigen an. Ein Dev-SSR-Start als normale
  // Nutzerin scheitert dann mit `EACCES: permission denied, unlink
  // .vite/deps/_metadata.json`. Test-/Messlaeufe setzen deshalb
  // `POLARIS_VITE_CACHE_DIR` auf ein eigenes Verzeichnis, statt fremde,
  // moeglicherweise gerade benutzte Container-Artefakte zu veraendern.
  cacheDir: process.env.POLARIS_VITE_CACHE_DIR || undefined,

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
    // Sourcemaps deaktiviert: spürbar schnellerer Build (jeder CMS-Publish baut
    // die Seite neu). Für Prod-Debugging bei Bedarf temporär wieder aktivieren.
    sourcemap: false,

    // ==========================================================================
    // CODE-SPLITTING: Nur für Client-Build, NICHT für SSR
    // Reduziert Initial Load und ermöglicht paralleles Laden
    // ==========================================================================
    rollupOptions: !isSsrBuild
      ? {
          output: {
            manualChunks: {
              // Vendor: React Core (wird auf jeder Seite gebraucht)
              // AP25 PT25.2: `react-dom/client` bleibt bewusst im App-Entry, obwohl die
              // App ihn importiert (173 KB). Gemessen (verschraenkte Ablation, mobil
              // gedrosselt): als modulepreload im Vendor-Chunk verschob er FCP ohne
              // Kompression um +284 bis +352 ms, mit gzip ohne messbaren Gewinn. Der
              // Cache-Vorteil ueber Deploys ist nicht belegt — erst mit Messung aendern.
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],

              // i18n: Internationalisierung (wird auf jeder Seite gebraucht)
              'vendor-i18n': ['i18next', 'react-i18next', 'i18next-http-backend'],

              // Helmet: SEO (relativ klein, aber separiert für Caching)
              'vendor-seo': ['react-helmet-async'],
            },
          },
        }
      : {},

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
    // 0. watch.ignored: `email/` ist der Python-Mailversand, kein Teil der
    //    Anwendung — er wird weder gebaut noch importiert. Er enthaelt aber den
    //    eingecheckten Symlink `email/assets/assets` -> `/home/phillip/01polaris/
    //    email/assets`, also einen Verweis auf sich selbst. Der Dev-Watcher lief
    //    darin in eine Endlosschleife und beendete den Prozess mit
    //    `ELOOP: too many symbolic links encountered`. Ausschliessen statt den
    //    eingecheckten Symlink anzufassen: der gehoert nicht in dieses Paket.
    //    Betrifft nur den Dev-Watcher, nicht `vite build`.
    watch: {
      ignored: ['**/email/**'],
    },

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
        target: process.env.BACKEND_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}))
