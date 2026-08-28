import { createServer } from 'vite'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

const ROUTES = [
  '/s3_leitlinie',
  '/vitamin-d3-implantologie',
  '/consumer/vitamin-d3-spray',
  '/consumer/hydrating-masks',
  '/consumer/inside-out-duo',
] as const

const vite = await createServer({
  server: {
    middlewareMode: true,
    // The repository-local email tooling can contain host-specific asset
    // symlinks. It is outside this SSR smoke and must not enter Vite's watcher.
    watch: { ignored: ['**/email/**'] },
  },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true },
})

try {
  const { render } = (await vite.ssrLoadModule(
    '/src/entry-server.tsx',
  )) as typeof import('../src/entry-server')
  let checked = 0
  for (const language of SUPPORTED_LANGUAGES) {
    for (const route of ROUTES) {
      const target = `/${language}${route}`
      const { html } = await render(target, language)
      if (html.length < 2_000) throw new Error(`${target}: incomplete SSR output`)
      if (/(?:copy_\d{3}|consumer\.|specialty\.)/.test(html)) {
        throw new Error(`${target}: visible translation key`)
      }
      checked += 1
    }
  }
  console.log(`PT08.2 render smoke PASS: ${checked}/${checked} routes (5 × 10 locales)`)
} finally {
  await vite.close()
}
