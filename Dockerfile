# =============================================================================
# STAGE 1: BUILDER - Kompiliert die Anwendung
# =============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# 1. Dependencies installieren (Cache-optimiert)
COPY package*.json ./
# Falls .npmrc existiert, auch kopieren
COPY .npmrc* ./
RUN npm ci

# 2. Source Code kopieren
COPY . .

# 3. Client und Server bauen
# - dist/client: Statische Assets + index.html
# - dist/server: SSR Bundle (entry-server.js)
RUN npm run build

# =============================================================================
# STAGE 2: RUNNER - Produktions-Image
# =============================================================================
FROM node:22-alpine AS runner

# curl für Healthcheck installieren
RUN apk add --no-cache curl

WORKDIR /app

# 1. Nur Production Dependencies installieren
COPY package*.json ./
COPY .npmrc* ./
# tsx wird für server.ts benötigt - explizit installieren da es in devDependencies ist
RUN npm ci --omit=dev && npm install tsx

# 2. Build-Artefakte aus Builder-Stage kopieren
COPY --from=builder /app/dist ./dist

# 3. Server-Dateien kopieren (TypeScript - wird von tsx ausgeführt)
COPY server.ts ./

# 4. Public-Ordner für statische Dateien (robots.txt, sitemap.xml, locales)
COPY public ./public

# 5. Environment-Variablen
ENV NODE_ENV=production
ENV PORT=3000

# 6. Port freigeben
EXPOSE 3000

# 7. Healthcheck - prüft ob der Server antwortet
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# 8. Server starten
CMD ["npx", "tsx", "server.ts"]
