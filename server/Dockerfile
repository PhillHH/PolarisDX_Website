# =============================================================================
# Backend-Image (Lead-API) — AP26 PT26.5 gehaertet
# =============================================================================
# Vorher (gemessen mit Trivy auf dem gebauten Image): `node:20` (volles Debian,
# Node 20 seit 2026-04 EOL) mit 71 CRITICAL / 1269 HIGH OS-Paketen, Compiler, git,
# ssh und Python im Laufzeit-Image, `npm install` statt Lockfile, Prozess als root.
#
# Jetzt: Abhaengigkeiten werden in einer eigenen Stufe exakt nach Lockfile
# installiert; das Laufzeit-Image ist `bookworm-slim` ohne npm/yarn und laeuft als
# `node`. Beschreibbar ist nur `/var/lib/polarisdx` (Lead-Datenbank und
# Support-Anhaenge ueber LEAD_DB_PATH / SUPPORT_UPLOAD_DIR, Volume in Compose).
# NODE_ENV wird hier bewusst NICHT gesetzt: der Compose-Dienst lief bisher ohne,
# und `APP_ENV` bestimmt die Umgebung (AP22 PT22.8). Secrets kommen ausschliesslich
# zur Laufzeit (env_file), nie ueber ARG/ENV.

FROM node:22-bookworm-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force


FROM node:22-bookworm-slim AS runner

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Sicherheitsupdates des Basis-Images (gemessen: HIGH mit verfuegbarem Debian-Fix).
# Paketmanager werden zur Laufzeit nicht gebraucht und bringen eigene Schwachstellen mit.
RUN apt-get update \
  && apt-get upgrade -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \
    /usr/local/bin/corepack /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg \
  && mkdir -p /var/lib/polarisdx \
  && chown node:node /var/lib/polarisdx

USER node

EXPOSE 5000

# AP28 PT28.4 (DEP-04, D-T2): Release-Identitaet bis zum Git-SHA.
ARG GIT_SHA=local
LABEL org.opencontainers.image.revision=${GIT_SHA} \
      org.opencontainers.image.title=polarisdx-backend
ENV RELEASE_SHA=${GIT_SHA}

# AP28 PT28.2 (DD-6, DEP-46/48): anwendungsnah, ohne Nebenwirkung — Anfrage-
# verarbeitung plus lesbare Lead-Datenbank (`GET /api/health`).
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:5000/api/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "server.js"]
