// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

/**
 * AP26 PT26.3 — der Download-Token landet nicht im Access-Log.
 *
 * Laeuft gegen ein echtes nginx mit `deploy/nginx/polarisdx-download-log-redaction.conf`.
 * Gegenprobe im selben Server: das Standardformat `combined` schreibt den Token — sonst
 * bewiese ein leeres Log nichts. Ohne nginx im PATH wird der Test uebersprungen (sichtbar).
 */

const here = path.dirname(fileURLToPath(import.meta.url))
const SNIPPET = path.resolve(here, '..', 'deploy', 'nginx', 'polarisdx-download-log-redaction.conf')
const hasNginx = spawnSync('which', ['nginx']).status === 0
const TOKEN = 'pt263-log-probe-token-0123456789abcdef'
const ENTITLEMENT = 'pt263-entitlement-probe'

const freePort = () =>
  new Promise((resolve) => {
    const server = net.createServer().listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })

describe.skipIf(!hasNginx)('PT26.3 — nginx Access-Log ohne Query-String', () => {
  let tmp
  let nginx
  let redactedPort
  let combinedPort

  beforeAll(async () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt263-nginx-'))
    for (const dir of ['body', 'proxy', 'fastcgi', 'uwsgi', 'scgi'])
      fs.mkdirSync(path.join(tmp, dir))
    redactedPort = await freePort()
    combinedPort = await freePort()
    fs.writeFileSync(
      path.join(tmp, 'nginx.conf'),
      `worker_processes 1;
pid ${tmp}/nginx.pid;
error_log ${tmp}/error.log warn;
events { worker_connections 64; }
http {
  include ${SNIPPET};
  client_body_temp_path ${tmp}/body;
  proxy_temp_path ${tmp}/proxy;
  fastcgi_temp_path ${tmp}/fastcgi;
  uwsgi_temp_path ${tmp}/uwsgi;
  scgi_temp_path ${tmp}/scgi;
  server {
    listen 127.0.0.1:${redactedPort};
    access_log ${tmp}/redacted.log polarisdx_redacted;
    location / { return 204; }
  }
  server {
    listen 127.0.0.1:${combinedPort};
    access_log ${tmp}/combined.log combined;
    location / { return 204; }
  }
}
`,
    )
    const check = spawnSync('nginx', [
      '-t',
      '-p',
      tmp,
      '-c',
      path.join(tmp, 'nginx.conf'),
      '-e',
      path.join(tmp, 'error.log'),
    ])
    if (check.status !== 0) throw new Error(`nginx -t fehlgeschlagen: ${check.stderr}`)
    nginx = spawn(
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
      {
        stdio: 'ignore',
      },
    )
    const deadline = Date.now() + 10_000
    for (;;) {
      try {
        await fetch(`http://127.0.0.1:${redactedPort}/`)
        break
      } catch {
        if (Date.now() > deadline) throw new Error('nginx did not start')
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }
  }, 20_000)

  afterAll(async () => {
    nginx?.kill('SIGQUIT')
    await new Promise((resolve) => setTimeout(resolve, 300))
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true })
  })

  it('schreibt Pfad und Status, aber weder Token noch Entitlement-ID', async () => {
    const url = `/api/content-download/asset/rsc-epi-019?e=${ENTITLEMENT}&t=${TOKEN}`
    expect((await fetch(`http://127.0.0.1:${redactedPort}${url}`)).status).toBe(204)
    expect((await fetch(`http://127.0.0.1:${combinedPort}${url}`)).status).toBe(204)
    // nginx schreibt das Access-Log synchron beim Abschluss der Anfrage; kurz warten genuegt.
    await new Promise((resolve) => setTimeout(resolve, 200))

    const redacted = fs.readFileSync(path.join(tmp, 'redacted.log'), 'utf8')
    expect(redacted).toContain('GET /api/content-download/asset/rsc-epi-019 HTTP/1.1')
    expect(redacted).toContain(' 204 ')
    expect(redacted).not.toContain(TOKEN)
    expect(redacted).not.toContain(ENTITLEMENT)
    expect(redacted).not.toContain('?')

    // Gegenprobe: das Standardformat haette den Token geschrieben.
    expect(fs.readFileSync(path.join(tmp, 'combined.log'), 'utf8')).toContain(TOKEN)
  })
})
