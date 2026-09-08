// Test-process-only compatibility for the repository host (Node 18).
// CI/production use Node 22, where Vite 7 receives crypto.hash natively.
const crypto = require('node:crypto')

if (typeof crypto.hash !== 'function') {
  crypto.hash = (algorithm, data, outputEncoding = 'hex') =>
    crypto.createHash(algorithm).update(data).digest(outputEncoding)
}
