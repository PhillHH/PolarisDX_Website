# JANITOR – Schatten-Folder & .gitignore

## translations/ Inhalt

- data/
- global/
- home/
- products/

## public/locales/ Inhalt

- cs/
- da/
- de/
- en/
- es/
- fr/
- it/
- nl/
- pl/
- pt/

## translations/ wird importiert in

nirgends (keine Treffer in `src/`, `server.ts`, `server/`)

## .gitignore aktueller Inhalt

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.env
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

## Fehlende .gitignore-Einträge (nur auflisten)

- test-results/
- playwright-report/
- coverage/
- \*.tsbuildinfo
- Thumbs.db
- .eslintcache
- .vercel/
- \*.pyc
- **pycache**/
