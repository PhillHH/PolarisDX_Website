# TOOLBOX – Quality-Gates-Strategie

## Pull-Request-Gates

- **typecheck**: ja — `tsc -b` existiert bereits als Script, muss nur in CI aufgerufen werden.
- **lint**: ja — `eslint .` existiert, ESLint 9 + typescript-eslint sind installiert.
- **format-check**: ja — Prettier muss erst hinzugefügt werden, dann `prettier --check .` als Gate.
- **vitest**: ja — Config und Dependency fehlen, aber Vitest teilt die Vite-Config und ist in 1h aufgesetzt.
- **playwright**: ja — Dependency vorhanden, Config fehlt; benötigt laufenden Dev-Server im CI (`webServer`-Option).
- **build**: ja — `npm run build` (Client + Server) als finaler Gate, fängt SSR-Brüche ab.
- **lighthouse**: später — erst sinnvoll mit Preview-URL (Vercel); bis dahin manuell gegen Staging.
- **axe-core**: später — als Playwright-Plugin (`@axe-core/playwright`) zusammen mit E2E-Tests einführen.

## Main-Branch-Gates

- Alle PR-Gates (typecheck, lint, format, vitest, playwright, build)
- Docker-Image bauen und Healthcheck validieren
- Deploy via `docker compose up` oder Vercel auto-deploy
- Sitemap-Generierung im Build-Step verifizieren
- Sentry-Release erstellen und Source-Maps hochladen (ab Wave 6)

## Pre-Commit

- **Tool**: lefthook (kein npm-postinstall nötig, single binary, schneller als husky+lint-staged)
- Läuft:
  - `prettier --write` auf staged Files
  - `eslint --fix` auf staged `.ts/.tsx`-Files
  - `tsc -b --noEmit` (vollständiger Typecheck, ~3s bei inkrementellem Build)

## Sentry-Vorbereitung jetzt

- Source-Maps werden bereits generiert (`build.sourcemap: true` in `vite.config.ts`)
- `SENTRY_DSN` als Environment-Variable in Docker-Compose und `.env.example` vorbereiten (leer)
- Error-Boundary-Komponente in `App.tsx` einbauen (generisch, ohne Sentry-SDK — wird in Wave 6 verdrahtet)

## Implementierungs-Reihenfolge

1. Prettier hinzufügen + gesamte Codebase einmalig formatieren
2. Lefthook einrichten (format + lint + typecheck auf pre-commit)
3. `playwright.config.ts` erstellen, bestehende Spec lauffähig machen
4. Vitest + jsdom + erster Smoke-Test (z.B. `i18n`-Initialisierung)
5. GitHub Actions Workflow: PR-Gates (typecheck → lint → format → vitest → build → playwright)
6. Main-Branch Workflow: alle Gates + Docker-Build + Deploy-Trigger
