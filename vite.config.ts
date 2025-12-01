// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  
  // Füge den "server"-Block für Docker-Entwicklung hinzu
  server: {
    // 1. host: Bindet den Server an 0.0.0.0. 
    //    Dies ist kritisch, damit der Host-PC (über das Docker-Netzwerk) den Container erreichen kann.
    host: '0.0.0.0', 
    
    // 2. allowedHosts: BEHEBT das Problem der "Blocked request"-Meldung!
    //    Erlaubt Anfragen, die über diesen spezifischen Hostnamen im Browser gestellt werden.
    allowedHosts: [
        'relaunch.polarisdx.net'
    ],
    
    // 3. HMR (Hot Module Replacement) Konfiguration für Windows/Docker.
    hmr: {
      // clientPort: Stellt sicher, dass der Browser die Verbindung zum korrekten Host-Port herstellt.
      // Muss dem extern gemappten Port in docker-compose.yml entsprechen (z.B. 3000:5173).
      clientPort: 3000, 
    },
    
    // 4. Port (Optional, stellt den internen Container-Port fest)
    port: 5173 
  }
})