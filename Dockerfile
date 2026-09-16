# =============================================================================
# STAGE 1: BUILDER - Kompiliert die Anwendung
# =============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# 1. Dependencies installieren (Cache-optimiert)
COPY package*.json ./
# Falls .npmrc existiert, auch kopieren
COPY .npmrc* ./

# "prepare" entfernen: ruft lefthook (Git-Hooks) auf — im Container weder
# vorhanden noch sinnvoll (kein .git im Build-Context).
RUN npm pkg delete scripts.prepare && npm ci

# 2. Source Code kopieren
COPY . .

# 3. Analytics-/Environment-Konfiguration fuer den Vite-Build
#
# Diese Werte muessen waehrend des Builds vorhanden sein, weil Vite
# VITE_* Variablen in die gebauten Client-Artefakte uebernimmt.
#
# Preview:
#   VITE_APP_ENV=preview
#   VITE_GTM_CONTAINER_ID_PREVIEW=GTM-PL26PFFH
#
# Production:
#   VITE_APP_ENV=production
#   VITE_GTM_CONTAINER_ID=GTM-TW6JFX7K
#
ARG VITE_APP_ENV
ARG VITE_GTM_CONTAINER_ID
ARG VITE_GTM_CONTAINER_ID_PREVIEW

ENV VITE_APP_ENV=${VITE_APP_ENV}
ENV VITE_GTM_CONTAINER_ID=${VITE_GTM_CONTAINER_ID}
ENV VITE_GTM_CONTAINER_ID_PREVIEW=${VITE_GTM_CONTAINER_ID_PREVIEW}

# 4. Client und Server bauen
# - dist/client: Statische Assets + index.html
# - dist/server: SSR Bundle (entry-server.js)
RUN npm run build


# =============================================================================
# STAGE 2: RUNNER - Produktions-Image
# =============================================================================
FROM node:22-alpine AS runner

# AP26 PT26.5: OS-Sicherheitsupdates des Basis-Images einspielen (gemessen: OpenSSL HIGH
# mit verfuegbarem Fix). curl entfaellt — der Healthcheck nutzt Node selbst.
RUN apk upgrade --no-cache

WORKDIR /app

# 1. Nur Production Dependencies installieren
COPY package*.json ./
COPY .npmrc* ./

# "prepare" entfernen: ruft lefthook (devDependency) auf und schlaegt mit
# --omit=dev fehl.
#
# AP26 PT26.5: vorher `npm ci --omit=dev && npm install tsx` — der zweite Befehl installierte
# nachtraeglich den KOMPLETTEN Dev-Baum (vite, rollup, sharp, lefthook-Binary, esbuild) ins
# Produktions-Image (Trivy: 46 HIGH / 1 CRITICAL in Node-Paketen). tsx fuehrt `server.ts` in
# Produktion aus und ist deshalb jetzt eine Laufzeitabhaengigkeit; `npm ci --omit=dev` bringt
# es exakt nach Lockfile mit. Danach werden die Paketmanager entfernt, die zur Laufzeit
# niemand braucht.
RUN npm pkg delete scripts.prepare && npm ci --omit=dev \
  && npm cache clean --force \
  && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \
    /usr/local/bin/corepack /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg

# 2. Build-Artefakte aus Builder-Stage kopieren
COPY --from=builder /app/dist ./dist

# 3. Server-Dateien kopieren (TypeScript - wird von tsx ausgefuehrt)
COPY server.ts ./
COPY src ./src
COPY tsconfig*.json ./

# 4. Public-Ordner fuer statische Dateien (robots.txt, sitemap.xml, locales)
COPY public ./public

# 5. Runtime-Environment-Variablen
ENV NODE_ENV=production
ENV TSX_TSCONFIG_PATH=tsconfig.app.json
ENV PORT=3000

# 6. Port freigeben
EXPOSE 3000

# 7. Healthcheck - prueft, ob der Server antwortet (ohne curl, AP26 PT26.5)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/de/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

# 8. Server starten — als unprivilegierter Benutzer, ohne npx (AP26 PT26.5)
USER node
CMD ["node", "node_modules/tsx/dist/cli.mjs", "server.ts"]