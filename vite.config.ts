import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"), // Alias für einfachere Importe aus dem src-Verzeichnis
    },
  },
  
  // Server-Konfiguration für Docker-Umgebungen
  server: {
    // 1. Host: Bindet den Server an 0.0.0.0. 
    //    Dies ist notwendig, damit der Container von außen (Host-System) erreichbar ist.
    host: '0.0.0.0', 
    
    // 2. HMR (Hot Module Replacement) Konfiguration.
    //    Wichtig für korrekte Live-Updates in Docker/Windows-Setups.
    hmr: {
      // clientPort: Der Port, über den der Browser die WebSocket-Verbindung herstellt.
      // Muss mit dem externen Port in docker-compose.yml übereinstimmen (3000:5173).
      clientPort: 3000, 
    },
    
    // 3. Port (Optional): Legt den internen Port fest, auf dem Vite lauscht.
    port: 5173 
  }
})
