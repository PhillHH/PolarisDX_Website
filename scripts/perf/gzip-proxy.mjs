// PT25.2 — Messwerkzeug: gzip-Reverse-Proxy vor dem LAB-Origin, damit Transfergroessen dem
// Produktionspfad (Host-nginx mit gzip, siehe PERFORMANCE-CONTRACT §3.2) entsprechen.
// Komprimiert text/html, text/css, application/javascript, application/json ab 1 KB (gzip -6).
// Aufruf: node scripts/perf/gzip-proxy.mjs <listenPort> <upstreamPort>
import http from 'node:http'
import { gzipSync } from 'node:zlib'

const listenPort = Number(process.argv[2] || 3970)
const upstreamPort = Number(process.argv[3] || 3960)
const COMPRESSIBLE =
  /^(text\/html|text\/css|application\/javascript|text\/javascript|application\/json)/

http
  .createServer((req, res) => {
    const headers = { ...req.headers, host: `127.0.0.1:${upstreamPort}` }
    delete headers['accept-encoding']
    const upstream = http.request(
      { host: '127.0.0.1', port: upstreamPort, path: req.url, method: req.method, headers },
      (up) => {
        const chunks = []
        up.on('data', (c) => chunks.push(c))
        up.on('end', () => {
          const body = Buffer.concat(chunks)
          const out = { ...up.headers }
          const type = String(up.headers['content-type'] || '')
          if (
            /gzip/.test(String(req.headers['accept-encoding'] || '')) &&
            COMPRESSIBLE.test(type) &&
            body.length >= 1024
          ) {
            const gz = gzipSync(body, { level: 6 })
            out['content-encoding'] = 'gzip'
            out['content-length'] = String(gz.length)
            out.vary = 'Accept-Encoding'
            delete out['transfer-encoding']
            res.writeHead(up.statusCode || 200, out)
            res.end(gz)
          } else {
            res.writeHead(up.statusCode || 200, out)
            res.end(body)
          }
        })
      },
    )
    upstream.on('error', () => {
      res.writeHead(502)
      res.end()
    })
    req.pipe(upstream)
  })
  .listen(listenPort, '127.0.0.1', () =>
    console.error(`gzip-proxy :${listenPort} -> :${upstreamPort}`),
  )
