import { defineConfig } from '@playwright/test'

/**
 * AP26 PT26.1 — Security-Header-Matrix gegen eine produktionsnahe Kette:
 *
 *   TLS-nginx (lokal, selbstsigniertes Zertifikat, bindet `deploy/nginx/polarisdx-hsts.conf`
 *   und die Forwarded-Direktiven des Host-nginx ein)
 *     → SSR-Produktionsserver (`server.ts`, Produktionsbuild `PERF_BUILD_DIR`)
 *       → Backend (`server/server.js`, OHNE NODE_ENV wie im Compose-Dienst, Fixture-Registry,
 *         temporaere Datenbank, erzwungener Trockenlauf, Dispatcher aus)
 *
 * Die Kette startet die Suite selbst (beforeAll), weil die Fixtures vor dem Backend entstehen
 * muessen. Keine produktiven Credentials, keine Provider-Aufrufe, keine Browser-Navigation.
 * Kein Retry.
 */
export default defineConfig({
  testDir: '.',
  testMatch: ['pt26.1.spec.ts'],
  timeout: 240_000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
})
