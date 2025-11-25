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
    // 1. Host: Bindet den Server an 0.0.0.0. 
    //    Dies ist kritisch, damit der Host-PC (über das Docker-Netzwerk) den Container erreichen kann.
    host: '0.0.0.0', 
    
    // 2. HMR (Hot Module Replacement) Konfiguration für Windows/Docker.
    hmr: {
      // clientPort: Stellt sicher, dass der Browser die Verbindung zum korrekten Host-Port herstellt.
      // Wir verwenden hier Port 3000, da dieser in der docker-compose.yml gemappt wurde (3000:5173).
      clientPort: 3000, 
    },
    
    // 3. Port (Optional, stellt den internen Container-Port fest)
    // Wenn du den Port 5173 explizit erzwingen willst:
    port: 5173 
  }
})