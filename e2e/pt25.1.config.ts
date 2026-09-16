import { defineConfig } from '@playwright/test'

/**
 * PT25.1 — Performance-Baseline: Browser-Collector + Mess-Integritaet.
 *
 * Gemessen wird gegen einen PRODUKTIONSBUILD, nicht gegen Dev-SSR: Bundle-Groessen,
 * Chunk-Wasserfall und Hydration sind im Dev-Modus (unbundled ESM, HMR) nicht
 * aussagekraeftig. Der Build liegt ausserhalb von `dist/`, damit kein fremder
 * Stand ueberschrieben wird:
 *
 *   npm run perf:build
 *
 * `PERF_ORIGIN` waehlt die Umgebung. Ohne Angabe startet die Konfiguration den
 * isolierten LAB-Origin (Produktionsmodus, eigener Port). Mit
 * `PERF_ORIGIN=https://preview.polarisdx.net PERF_ENV=PREVIEW` wird die Preview
 * gemessen — ohne Consent, also ohne Analytics-Provider (AP23).
 *
 * Kein Retry: ein Messlauf, der nur beim zweiten Mal gruen wird, ist keine Baseline.
 */
const port = Number(process.env.E2E_PORT ?? 3960)
const origin = process.env.PERF_ORIGIN ?? `http://127.0.0.1:${port}`
const isLab = !process.env.PERF_ORIGIN
// PT25.2+: `PERF_BUILD_DIR` misst einen anderen Build mit demselben Collector.
const buildDir = process.env.PERF_BUILD_DIR ?? 'node_modules/.cache/pt25.1'

export default defineConfig({
  testDir: '.',
  testMatch: ['pt25.1.spec.ts'],
  timeout: 600_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    baseURL: origin,
    channel: 'chromium',
  },
  webServer: isLab
    ? {
        command: `cd .. && NODE_ENV=production PORT=${port} POLARIS_CLIENT_DIST_DIR=${buildDir}/client POLARIS_SERVER_DIST_DIR=${buildDir}/server npm run start`,
        url: `${origin}/de/`,
        reuseExistingServer: !!process.env.POLARIS_REUSE_SERVER,
        timeout: 120_000,
      }
    : undefined,
})
