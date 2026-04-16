## Client-Entry
Datei: src/entry-client.tsx
Importiert App aus: ./App.lazy

## SSR-Entry
Datei: src/entry-server.tsx
Importiert App aus: ./App

## Vite Entrypoints
```ts
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  ssr: {
    external: ['express', 'http-proxy-middleware'],
    noExternal: ['react-helmet-async'],
  },
  build: {
    sourcemap: true,
    rollupOptions: !isSsrBuild ? {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-http-backend'],
          'vendor-seo': ['react-helmet-async'],
        },
      },
    } : {},
    chunkSizeWarningLimit: 600,
  },
```
(Der Client-Entrypoint wird via `<script type="module" src="/src/entry-client.tsx">` in `index.html` geladen, der SSR-Entrypoint explizit in `build:server` gesetzt.)

## Build Scripts
```json
"dev":           "tsx server.ts",
"dev:vite":      "vite",
"build":         "npm run build:client && npm run build:server",
"build:client":  "tsc -b && vite build --outDir dist/client",
"build:server":  "vite build --ssr src/entry-server.tsx --outDir dist/server",
"start":         "NODE_ENV=production tsx server.ts",
"preview":       "NODE_ENV=production tsx server.ts"
```

## Beobachtung in einem Satz
Im Client-Build ist `src/App.lazy.tsx` aktiv (via `entry-client.tsx` aus `index.html`), im SSR-Build ist `src/App.tsx` aktiv (via `entry-server.tsx` in `build:server`); `src/main.tsx` importiert zwar `App.tsx`, wird aber von keinem Build-Pfad als Entry verwendet.
