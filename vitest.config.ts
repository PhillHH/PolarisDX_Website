import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// AP27 PT27.1 — Tests laufen immer im Testmodus. Eine Shell mit `NODE_ENV=production` laedt
// sonst die Produktionsbuilds von React ohne `act`: gemessen scheiterten lokal 233 von 590
// src-Tests an `React.act is not a function`, waehrend dieselben Dateien ohne die Variable
// 590/590 gruen sind. CI setzt `NODE_ENV` nicht (vitest setzt dann selbst `test`) — damit ist
// lokal und CI derselbe Modus.
process.env.NODE_ENV = 'test'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    watch: false,
    exclude: ['**/node_modules/**', 'dist', 'scripts/**', 'tests-e2e/**'],
    // AP27 PT27.1 — benannte Teststufen (TESTING-CONTRACT §3). `vitest run` fuehrt weiterhin
    // alle drei aus; zusammen decken sie exakt die fruehere Include-Liste ab.
    projects: [
      { extends: true, test: { name: 'unit', include: ['src/**/*.{test,spec}.ts'] } },
      { extends: true, test: { name: 'component', include: ['src/**/*.{test,spec}.tsx'] } },
      { extends: true, test: { name: 'server', include: ['server/**/*.{test,spec}.{js,ts}'] } },
    ],
  },
})
