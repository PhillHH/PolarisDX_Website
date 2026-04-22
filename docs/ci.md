# CI Pipeline

Jeder Pull Request durchlaeuft diese Gates:

1. Typecheck (tsc -b --noEmit)
2. ESLint (eslint .)
3. Prettier (prettier --check .)
4. Vitest (npm test)
5. Build (npm run build)

Alle Gates muessen gruen sein, sonst kein Merge.

## Lokale Ausfuehrung

    npm run typecheck
    npm run lint
    npm run format:check
    npm test
    npm run build

## Playwright und Lighthouse

Folgen in Wave 5.
