#!/usr/bin/env bash
# PolarisDX Relaunch — Host-nginx-Cutover (AP31, 2026-10-16). Braucht sudo (Operator/Owner).
#   1. Early-Access-Locations entfernen (SC-004, docs/deploy.md §3)
#   2. HSTS am 443-Block einbinden (SECURITY-CONTRACT §4.1, OA-1)
# Auf diesem Host ist /etc/nginx/sites-enabled/polarisdx.net eine REGULAERE Datei (keine Verknuepfung
# nach sites-available); nginx.conf laedt sites-enabled/*. Die Sicherung liegt deshalb AUSSERHALB von
# sites-enabled (eine .bak dort wuerde als zweiter Server-Block geladen, vgl. growento.conf.bak-claude).
# Rueckweg: sudo cp /etc/nginx/backup-relaunch-20261016-polarisdx.net /etc/nginx/sites-enabled/polarisdx.net \
#           && sudo nginx -t && sudo systemctl reload nginx
set -euo pipefail
REPO=/home/phillip/01polaris-preview
ACTIVE=/etc/nginx/sites-enabled/polarisdx.net
TARGET="$(readlink -f "$ACTIVE")"          # Verknuepfung oder Datei — es wird das Ziel ersetzt
BACKUP=/etc/nginx/backup-relaunch-20261016-polarisdx.net
[[ -f "$BACKUP" ]] || sudo cp -a "$TARGET" "$BACKUP"
sudo install -d -m 755 /etc/nginx/snippets
sudo install -m 644 "$REPO/deploy/nginx/polarisdx-hsts.conf" /etc/nginx/snippets/polarisdx-hsts.conf
sudo install -m 644 "$REPO/deploy/nginx/polarisdx.net.conf" "$TARGET"
# Kopie in sites-available angleichen, damit beide Staende gleich sind (nur falls getrennte Datei).
[[ "$TARGET" == /etc/nginx/sites-available/polarisdx.net ]] || sudo install -m 644 "$REPO/deploy/nginx/polarisdx.net.conf" /etc/nginx/sites-available/polarisdx.net
if ! sudo nginx -t; then
  echo "nginx -t FEHLGESCHLAGEN — alter vhost wird zurueckgespielt, nginx bleibt unveraendert." >&2
  sudo cp -a "$BACKUP" "$TARGET"
  sudo nginx -t
  exit 1
fi
sudo systemctl reload nginx
sleep 1
echo "--- Pruefung:"
curl -sI https://polarisdx.net/de/ | grep -i 'strict-transport-security' || echo "HSTS FEHLT"
printf '/early -> %s (erwartet 404)\n' "$(curl -s -o /dev/null -w '%{http_code}' https://polarisdx.net/early)"
printf '/api/early-access -> %s (erwartet 404; bis zum up antwortet das Alt-Backend ueber den SSR-Proxy mit 4xx)\n' "$(curl -s -o /dev/null -w '%{http_code}' -X POST -H 'content-type: application/json' --data '{}' https://polarisdx.net/api/early-access)"
