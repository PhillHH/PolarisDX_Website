import { test, expect, request, type APIRequestContext, type APIResponse } from '@playwright/test'
import { fork, spawn, spawnSync, type ChildProcess } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * AP26 PT26.1 — Security-Header und HTTPS-/Proxy-Semantik, produktionsnah.
 *
 *  1. HTML 200/301/404, gehashte Assets, Locales, robots.txt: Baseline genau einmal, kein
 *     X-Powered-By, HSTS genau einmal, passende Cache-Semantik.
 *  2. API 2xx und geschuetzte Auslieferung (Erfolg + Ablehnung): no-store, nosniff, no-referrer.
 *  3. API 4xx/404/Parserfehler/413/429 ohne Interna; gefaelschtes X-Forwarded-For hinter dem
 *     Proxy umgeht den Limiter nicht.
 *  4. HSTS nur am TLS-Proxy: HTTP → 301 HTTPS ohne HSTS, SSR direkt (localhost) ohne HSTS.
 *  5. Gefaelschte Host-/Forwarded-Header werden nicht in Redirects oder Canonicals reflektiert.
 */

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const BUILD = path.resolve(ROOT, process.env.PERF_BUILD_DIR ?? 'node_modules/.cache/perf-budget')
const PORTS = { backend: 3951, ssr: 3952, http: 3953, https: 3954 }
const HTTPS = `https://127.0.0.1:${PORTS.https}`
const HSTS = 'max-age=31536000'
const BASELINE: Record<string, string> = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'SAMEORIGIN',
  'x-xss-protection': '0',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
}
const GATED_ID = 'rsc-pt261-001'
const RELATIVE_PATH = 'fixture/de/pt261.pdf'
const FILE_BODY = Buffer.from('%PDF-1.4\nPT26.1 protected fixture\n%%EOF\n')
const INTERNALS = /\bat\s+\S+\s+\(|node_modules|\/home\/|\/app\/|Error:|<pre/i

const processes: ChildProcess[] = []
let tmp = ''
let api: APIRequestContext

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const portOpen = (port: number) =>
  new Promise<boolean>((resolve) => {
    const socket = net.connect(port, '127.0.0.1')
    socket.once('connect', () => (socket.destroy(), resolve(true)))
    socket.once('error', () => resolve(false))
  })
async function waitForPort(port: number, label: string) {
  for (let i = 0; i < 240; i++) {
    if (await portOpen(port)) return
    await sleep(250)
  }
  throw new Error(`${label} startet nicht auf :${port}`)
}

const all = (response: APIResponse, name: string) =>
  response.headersArray().filter((h) => h.name.toLowerCase() === name)

function expectHeaderOnce(response: APIResponse, name: string, value: string, label: string) {
  const values = all(response, name).map((h) => h.value)
  expect(values, `${label}: ${name}`).toEqual([value])
}

function expectBaseline(
  response: APIResponse,
  label: string,
  { hsts = true, referrer = BASELINE['referrer-policy'] } = {},
) {
  for (const [name, value] of Object.entries(BASELINE))
    expectHeaderOnce(response, name, name === 'referrer-policy' ? referrer : value, label)
  expect(all(response, 'x-powered-by'), `${label}: x-powered-by`).toEqual([])
  if (hsts) expectHeaderOnce(response, 'strict-transport-security', HSTS, label)
  else expect(all(response, 'strict-transport-security'), `${label}: HSTS`).toEqual([])
}

test.describe.serial('AP26 PT26.1', () => {
  test.beforeAll(async () => {
    for (const [label, port] of Object.entries(PORTS))
      if (await portOpen(port)) throw new Error(`Port ${port} (${label}) ist belegt`)
    for (const tool of ['nginx', 'openssl'])
      if (spawnSync('which', [tool]).status !== 0)
        throw new Error(`${tool} fehlt — die produktionsnahe Kette braucht ihn`)
    if (!fs.existsSync(`${BUILD}/client/index.html`))
      throw new Error(`Produktionsbuild fehlt: ${BUILD} (npm run perf:budget:build)`)

    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt261-'))
    // Fixture fuer die geschuetzte Auslieferung (kein echtes Asset, kein Provider).
    const protectedDir = path.join(tmp, 'protected')
    fs.mkdirSync(path.dirname(path.join(protectedDir, RELATIVE_PATH)), { recursive: true })
    fs.writeFileSync(path.join(protectedDir, RELATIVE_PATH), FILE_BODY)
    const registryPath = path.join(tmp, 'registry.json')
    fs.writeFileSync(
      registryPath,
      JSON.stringify({
        assets: [
          {
            id: GATED_ID,
            deliveryClass: 'GATED',
            lifecycle: 'ACTIVE_VISIBLE',
            variants: [
              {
                language: 'de',
                storage: 'PROTECTED',
                path: RELATIVE_PATH,
                mime: 'application/pdf',
                bytes: FILE_BODY.length,
                sha256: createHash('sha256').update(FILE_BODY).digest('hex'),
              },
            ],
          },
        ],
      }),
    )

    // Backend wie im Compose-Dienst: ohne NODE_ENV. Preview-Kennung erzwingt den Trockenlauf.
    const backendEnv: NodeJS.ProcessEnv = {
      ...process.env,
      PORT: String(PORTS.backend),
      LISTEN_HOST: '127.0.0.1',
      LEAD_DB_PATH: path.join(tmp, 'leads.sqlite3'),
      SUPPORT_UPLOAD_DIR: path.join(tmp, 'uploads'),
      POLARIS_PROTECTED_ASSET_DIR: protectedDir,
      POLARIS_RESOURCE_REGISTRY_PATH: registryPath,
      LEAD_DISPATCHER_DISABLED: '1',
      APP_ENV: 'preview',
    }
    delete backendEnv.NODE_ENV
    delete backendEnv.SENDGRID_API_KEY
    processes.push(
      fork(path.join(ROOT, 'server/server.js'), {
        cwd: path.join(ROOT, 'server'),
        env: backendEnv,
        stdio: 'ignore',
      }),
    )
    await waitForPort(PORTS.backend, 'Backend')

    processes.push(
      spawn('npm', ['run', 'start'], {
        cwd: ROOT,
        env: {
          ...process.env,
          NODE_ENV: 'production',
          PORT: String(PORTS.ssr),
          BACKEND_URL: `http://127.0.0.1:${PORTS.backend}`,
          POLARIS_CLIENT_DIST_DIR: `${BUILD}/client`,
          POLARIS_SERVER_DIST_DIR: `${BUILD}/server`,
        },
        stdio: 'ignore',
        detached: true,
      }),
    )
    await waitForPort(PORTS.ssr, 'SSR')

    const cert = path.join(tmp, 'cert.pem')
    const key = path.join(tmp, 'key.pem')
    const ssl = spawnSync('openssl', [
      'req',
      '-x509',
      '-newkey',
      'rsa:2048',
      '-nodes',
      '-days',
      '1',
      '-subj',
      '/CN=localhost',
      '-keyout',
      key,
      '-out',
      cert,
    ])
    if (ssl.status !== 0) throw new Error('Zertifikat konnte nicht erzeugt werden')
    for (const dir of ['body', 'proxy', 'fastcgi', 'uwsgi', 'scgi'])
      fs.mkdirSync(path.join(tmp, dir))
    // Spiegelt die Host-Konfiguration von polarisdx.net (Forwarded-Direktiven, Upload-Limit,
    // HTTP → HTTPS) und bindet das repository-eigene HSTS-Snippet ein.
    fs.writeFileSync(
      path.join(tmp, 'nginx.conf'),
      `worker_processes 1;
pid ${tmp}/nginx.pid;
error_log ${tmp}/error.log warn;
events { worker_connections 256; }
http {
  access_log off;
  server_tokens off;
  client_body_temp_path ${tmp}/body;
  proxy_temp_path ${tmp}/proxy;
  fastcgi_temp_path ${tmp}/fastcgi;
  uwsgi_temp_path ${tmp}/uwsgi;
  scgi_temp_path ${tmp}/scgi;
  server {
    listen 127.0.0.1:${PORTS.http};
    return 301 https://127.0.0.1:${PORTS.https}$request_uri;
  }
  server {
    listen 127.0.0.1:${PORTS.https} ssl;
    ssl_certificate ${cert};
    ssl_certificate_key ${key};
    client_max_body_size 100M;
    include ${ROOT}deploy/nginx/polarisdx-hsts.conf;
    location / {
      proxy_pass http://127.0.0.1:${PORTS.ssr};
      proxy_http_version 1.1;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
  }
}
`,
    )
    const nginx = spawn(
      'nginx',
      [
        '-p',
        tmp,
        '-c',
        path.join(tmp, 'nginx.conf'),
        '-e',
        path.join(tmp, 'error.log'),
        '-g',
        'daemon off;',
      ],
      { stdio: 'ignore', detached: true },
    )
    processes.push(nginx)
    await waitForPort(PORTS.https, 'TLS-nginx')

    api = await request.newContext({ baseURL: HTTPS, ignoreHTTPSErrors: true })
    // SSR-Warm-up abwarten, damit Kaltstart-Latenzen keine Testbedingung werden.
    for (let i = 0; i < 60; i++) {
      if ((await api.get('/de/', { maxRedirects: 0 })).status() === 200) break
      await sleep(500)
    }
  })

  test.afterAll(async () => {
    await api?.dispose()
    for (const child of processes.reverse()) {
      try {
        if (child.pid) process.kill(-child.pid, 'SIGTERM')
      } catch {
        child.kill('SIGTERM')
      }
    }
    await sleep(500)
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true })
  })

  test('1 HTML 200/301/404, Assets, Locales, robots.txt: Header-Matrix hinter dem TLS-Proxy', async () => {
    const css = fs.readdirSync(`${BUILD}/client/assets`).find((f) => f.endsWith('.css'))!
    const cases: [string, number, string | null][] = [
      ['/de/', 200, 'no-store, no-cache, must-revalidate'],
      ['/', 301, null],
      ['/de/pt26-gibt-es-nicht', 404, 'no-store, no-cache, must-revalidate'],
      [`/assets/${css}`, 200, 'public, max-age=31536000, immutable'],
      ['/locales/de/common.json', 200, 'public, max-age=3600'],
      ['/robots.txt', 200, 'public, max-age=3600'],
    ]
    for (const [urlPath, status, cache] of cases) {
      const response = await api.get(urlPath, { maxRedirects: 0 })
      const label = `${urlPath} ${status}`
      expect(response.status(), label).toBe(status)
      expectBaseline(response, label)
      if (cache) expectHeaderOnce(response, 'cache-control', cache, label)
      if (status === 301) expect(response.headers().location, label).toBe('/de/')
      // AP26 PT26.2: die CSP ist in Produktion durchgesetzt, nicht mehr Report-Only.
      if (urlPath.startsWith('/de/')) {
        expect(all(response, 'content-security-policy'), `${label}: CSP`).toHaveLength(1)
        expect(
          all(response, 'content-security-policy-report-only'),
          `${label}: kein CSP-RO`,
        ).toHaveLength(0)
      }
      // Die Server-Kennung verraet keine Version (Host-nginx: Operator-Aktion server_tokens off).
      expect(response.headers().server ?? '', `${label}: server`).not.toMatch(/\d/)
    }
  })

  test('2 API 2xx und geschuetzte Auslieferung: no-store, nosniff, no-referrer', async () => {
    const submitted = await api.post('/api/content-download', {
      headers: { 'Idempotency-Key': 'pt261-download-1' },
      data: {
        name: 'PT26.1 Header-Matrix',
        email: 'pt261@praxis.example',
        organization: 'Praxis Nord',
        locale: 'de',
        assetId: GATED_ID,
        source: 'resource-center',
        originRoute: '/de/downloads',
        processingConsent: true,
        consentAcceptedAt: '2026-09-15T05:00:00.000Z',
      },
    })
    expect(submitted.status()).toBe(202)
    expectBaseline(submitted, 'API 202')
    expectHeaderOnce(submitted, 'cache-control', 'no-store', 'API 202')
    const { data } = await submitted.json()
    expect(data.downloadUrl).toContain(`/api/content-download/asset/${GATED_ID}`)

    const delivered = await api.get(data.downloadUrl, { maxRedirects: 0 })
    expect(delivered.status()).toBe(200)
    expect(Buffer.from(await delivered.body()).equals(FILE_BODY)).toBe(true)
    expectBaseline(delivered, 'geschuetzt 200', { referrer: 'no-referrer' })
    expectHeaderOnce(delivered, 'cache-control', 'no-store, private', 'geschuetzt 200')
    expectHeaderOnce(delivered, 'x-robots-tag', 'noindex, nofollow', 'geschuetzt 200')
    expect(delivered.headers()['content-disposition']).toMatch(/^attachment;/)

    const url = new URL(data.downloadUrl, HTTPS)
    url.searchParams.set('t', 'x'.repeat(43))
    const rejected = await api.get(url.pathname + url.search, { maxRedirects: 0 })
    expect(rejected.status()).toBe(403)
    expectBaseline(rejected, 'geschuetzt 403', { referrer: 'no-referrer' })
    expectHeaderOnce(rejected, 'cache-control', 'no-store, private', 'geschuetzt 403')
    expect(await rejected.text()).not.toMatch(INTERNALS)
  })

  test('3 API 4xx/404/Parserfehler/413/429 ohne Interna; X-Forwarded-For-Faelschung umgeht den Limiter nicht', async () => {
    const expectSafe = async (response: APIResponse, status: number, label: string) => {
      expect(response.status(), label).toBe(status)
      expectBaseline(response, label)
      expectHeaderOnce(response, 'cache-control', 'no-store', label)
      expect(response.headers()['content-type'], label).toContain('application/json')
      expect(await response.text(), `${label}: Interna`).not.toMatch(INTERNALS)
    }
    await expectSafe(await api.post('/api/contact', { data: {} }), 400, 'API 400 Validierung')
    await expectSafe(await api.get('/api/pt26-unbekannt'), 404, 'API 404')
    await expectSafe(
      await api.post('/api/contact', {
        headers: { 'Content-Type': 'application/json' },
        data: '{"name":',
      }),
      400,
      'API 400 Parserfehler',
    )
    await expectSafe(
      await api.post('/api/contact', {
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ padding: 'a'.repeat(11 * 1024 * 1024) }),
      }),
      413,
      'API 413',
    )

    // Bisher zaehlt der Formular-Limiter 4 Anfragen dieses Clients: 202 aus Test 2, 400 Validierung,
    // 400 Parserfehler und 413. Seit AP26 PT26.3 laeuft der Limiter VOR dem Parser — kaputte und
    // uebergrosse Bodies zaehlen mit (vorher scheiterten sie am globalen Parser, bevor der Limiter
    // sie sah). Jede weitere Anfrage traegt eine andere gefaelschte Absenderadresse; der Proxy haengt
    // die echte an, `trust proxy 1` nimmt den letzten Eintrag — die Faelschung darf keinen neuen
    // Eimer oeffnen: die zweite gefaelschte Anfrage ist bereits die sechste im echten Eimer.
    let limitedAt = -1
    for (let i = 0; i < 6; i++) {
      const response = await api.post('/api/contact', {
        headers: { 'X-Forwarded-For': `198.51.100.${i + 1}` },
        data: {},
      })
      if (response.status() === 429) {
        limitedAt = i
        await expectSafe(response, 429, 'API 429')
        break
      }
    }
    expect(limitedAt, 'Limiter greift trotz gefaelschtem X-Forwarded-For').toBe(1)
  })

  test('4 HTTPS/HSTS: nur am TLS-Proxy; HTTP → 301 HTTPS ohne HSTS; SSR direkt ohne HSTS', async () => {
    const plain = await fetch(`http://127.0.0.1:${PORTS.http}/de/`, { redirect: 'manual' })
    expect(plain.status).toBe(301)
    expect(plain.headers.get('location')).toBe(`${HTTPS}/de/`)
    expect(plain.headers.get('strict-transport-security')).toBeNull()

    const direct = await fetch(`http://127.0.0.1:${PORTS.ssr}/de/`, { redirect: 'manual' })
    expect(direct.status).toBe(200)
    expect(direct.headers.get('strict-transport-security')).toBeNull()
    expect(direct.headers.get('x-content-type-options')).toBe('nosniff')

    const secure = await api.get('/de/', { maxRedirects: 0 })
    const value = all(secure, 'strict-transport-security').map((h) => h.value)
    expect(value).toEqual([HSTS])
    expect(value[0]).not.toMatch(/includeSubDomains|preload/i)
  })

  test('5 Gefaelschte Host-/Forwarded-Header werden nicht reflektiert', async () => {
    const spoof = {
      Host: 'evil.example',
      'X-Forwarded-Host': 'evil.example',
      'X-Forwarded-Proto': 'http',
    }
    const redirect = await api.get('/', { headers: spoof, maxRedirects: 0 })
    expect(redirect.status()).toBe(301)
    expect(redirect.headers().location).toBe('/de/')

    const page = await api.get('/de/contact', { headers: spoof, maxRedirects: 0 })
    expect(page.status()).toBe(200)
    const html = await page.text()
    expect(html).not.toContain('evil.example')
    expect(html).toContain('rel="canonical" href="https://polarisdx.net/de/contact"')
  })
})
