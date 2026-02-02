# --- STAGE 1: BUILDER (Zum Kompilieren der Anwendung) ---
FROM node:22-alpine AS builder
WORKDIR /app

# 1. OPTIMIERUNG FÜR CACHING (Ändert sich selten)
# Kopiert nur die Dateien, die die Abhängigkeiten definieren.
# Solange diese Dateien unverändert sind, wird der Cache für 'npm ci' verwendet.
COPY package*.json .npmrc ./
RUN npm ci

# 2. ANWENDUNGSCODE KOPIEREN (Ändert sich häufig)
# Kopiert den Rest des Quellcodes.
COPY . .

# 3. BUILD
# Erstellt die produktionsbereiten statischen Dateien (z.B. in /app/dist)
RUN npm run build

# --- STAGE 2: RUNNER (Zum Ausliefern der fertigen App mit Nginx) ---
FROM nginx:1.27-alpine AS runner

# Kopiert die gebauten statischen Dateien aus dem "builder"-Stage
# Stellt sicher, dass der Pfad /app/dist der korrekte Build-Ausgabeordner ist.
COPY --from=builder /app/dist /usr/share/nginx/html

# Entfernt die Standard-Nginx-Konfiguration
RUN rm /etc/nginx/conf.d/default.conf
# Kopiert deine eigene nginx.conf (mit SPA-Fallback-Regeln)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Informiert Docker, dass der Container auf Port 80 lauscht
EXPOSE 80

# KORRIGIERTE SYNTAX: Startbefehl für Nginx (Exec-Form)
# Stellt sicher, dass Nginx im Vordergrund läuft und der Container nicht abstürzt.
CMD ["nginx", "-g", "daemon off;"]