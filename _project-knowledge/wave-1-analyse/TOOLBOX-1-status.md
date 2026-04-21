# TOOLBOX – IST-Stand Tooling

## Konfigurationsdateien

- `eslint.config.js` — vorhanden (Repo-Root)
- `.eslintrc*` — nicht vorhanden
- `.prettierrc*` — nicht vorhanden
- `prettier.config.*` — nicht vorhanden
- `.husky/` — nicht vorhanden
- `.lintstagedrc*` — nicht vorhanden
- `lefthook.yml` — nicht vorhanden
- `vitest.config.*` — nicht vorhanden
- `playwright.config.*` — nicht vorhanden
- `.github/workflows/` — nicht vorhanden

## package.json scripts

```json
{
  "dev": "tsx server.ts",
  "dev:vite": "vite",
  "build": "npm run build:client && npm run build:server",
  "build:client": "tsc -b && vite build --outDir dist/client",
  "build:server": "vite build --ssr src/entry-server.tsx --outDir dist/server",
  "build:prerender": "tsc -b && vite build && node scripts/prerender.mjs",
  "prerender": "node scripts/prerender.mjs",
  "start": "NODE_ENV=production tsx server.ts",
  "preview": "NODE_ENV=production tsx server.ts",
  "lint": "eslint .",
  "typecheck": "tsc -b",
  "server": "cd server && npm install && npm start"
}
```

## Tool-Dependencies

```json
{
  "@eslint/js": "^9.39.1",
  "@playwright/test": "^1.57.0",
  "eslint": "^9.39.1",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.4.24",
  "typescript-eslint": "^8.46.4",
  "globals": "^16.5.0"
}
```

Keine Einträge für: `prettier`, `vitest`, `husky`, `lefthook`, `lint-staged`,
`@testing-library/*`, `jsdom`, `@axe-core/playwright`, `@lhci/cli`.

## CI Workflows

keine vorhanden (`.github/workflows/` existiert nicht)

## Playwright Config

keine vorhanden

## Test Files

- `verify_changes.spec.ts`
- `backend/cms/tests/int/api.int.spec.ts`
- `backend/cms/tests/e2e/frontend.e2e.spec.ts`
