# PAYLOAD-1 — Inventar backend/

## backend/ File-Tree (max 30 Files)
- backend/Dockerfile
- backend/docker-compose.yml
- backend/docker-compose.yml.init
- backend/package.json
- backend/package-lock.json
- backend/hallo.txt
- backend/cms/Dockerfile
- backend/cms/docker-compose.yml
- backend/cms/README.md
- backend/cms/package.json
- backend/cms/package-lock.json
- backend/cms/next.config.mjs
- backend/cms/tsconfig.json
- backend/cms/eslint.config.mjs
- backend/cms/playwright.config.ts
- backend/cms/vitest.config.mts
- backend/cms/vitest.setup.ts
- backend/cms/.env.example
- backend/cms/test.env
- backend/cms/.gitignore
- backend/cms/cms.db
- backend/cms/src/payload.config.ts
- backend/cms/src/payload-types.ts
- backend/cms/src/collections/Users.ts
- backend/cms/src/collections/Media.ts
- backend/cms/src/collections/Posts.ts
- backend/cms/src/app/(frontend)/layout.tsx
- backend/cms/src/app/(frontend)/page.tsx
- backend/cms/src/app/(payload)/layout.tsx
- backend/cms/src/app/(payload)/admin/importMap.js

## package.json
- name: `app` (backend/package.json) / `cms` (backend/cms/package.json)
- version: `1.0.0` / `1.0.0`
- Hinweis: `backend/package.json` ist ein leerer Stub. Die real genutzten Deps liegen in `backend/cms/package.json`.

## Dependencies
```
@payloadcms/next            3.65.0
@payloadcms/richtext-lexical 3.65.0
@payloadcms/ui              3.65.0
@payloadcms/db-sqlite       3.65.0
payload                     3.65.0
next                        15.4.7
react                       19.1.0
react-dom                   19.1.0
graphql                     ^16.8.1
sharp                       0.34.2
cross-env                   ^7.0.3
dotenv                      16.4.7
```

## DevDependencies
```
@playwright/test            1.56.1
@testing-library/react      16.3.0
@types/node                 ^22.5.4
@types/react                19.1.8
@types/react-dom            19.1.6
@vitejs/plugin-react        4.5.2
eslint                      ^9.16.0
eslint-config-next          15.4.7
jsdom                       26.1.0
playwright                  1.56.1
playwright-core             1.56.1
prettier                    ^3.4.2
typescript                  5.7.3
vite-tsconfig-paths         5.1.4
vitest                      3.2.3
```

## Konfigurationsdateien vorhanden
- Dockerfile: ja (`backend/Dockerfile` und `backend/cms/Dockerfile`)
- docker-compose.yml: ja (`backend/docker-compose.yml`, `backend/docker-compose.yml.init`, `backend/cms/docker-compose.yml`)
- .env oder .env.example: ja (`backend/cms/.env.example`, `backend/cms/test.env`; keine `.env` getrackt)

## LOC pro Code-Datei
```
  38  backend/cms/eslint.config.mjs
  12  backend/cms/vitest.config.mts
   4  backend/cms/vitest.setup.ts
  20  backend/cms/tests/int/api.int.spec.ts
  20  backend/cms/tests/e2e/frontend.e2e.spec.ts
  17  backend/cms/next.config.mjs
  40  backend/cms/src/payload.config.ts
  19  backend/cms/src/app/(frontend)/layout.tsx
  59  backend/cms/src/app/(frontend)/page.tsx
  19  backend/cms/src/app/(payload)/api/[...slug]/route.ts
   7  backend/cms/src/app/(payload)/api/graphql-playground/route.ts
   8  backend/cms/src/app/(payload)/api/graphql/route.ts
  49  backend/cms/src/app/(payload)/admin/importMap.js
  24  backend/cms/src/app/(payload)/admin/[[...segments]]/not-found.tsx
  24  backend/cms/src/app/(payload)/admin/[[...segments]]/page.tsx
  31  backend/cms/src/app/(payload)/layout.tsx
  12  backend/cms/src/app/my-route/route.ts
  16  backend/cms/src/collections/Media.ts
  13  backend/cms/src/collections/Users.ts
  61  backend/cms/src/collections/Posts.ts
 369  backend/cms/src/payload-types.ts
  41  backend/cms/playwright.config.ts
 903  total
```
