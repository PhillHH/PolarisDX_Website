#!/usr/bin/env bash
# PolarisDX Relaunch — Host-nginx-Cutover (AP31, 2026-10-16). Braucht sudo (Operator/Owner).
#   1. Early-Access-Locations entfernen (SC-004, docs/deploy.md §3)
#   2. HSTS am 443-Block einbinden (SECURITY-CONTRACT §4.1, OA-1)
# Rueckweg: sudo cp /etc/nginx/sites-available/polarisdx.net.bak-pre-relaunch-20261016 /etc/nginx/sites-available/polarisdx.net && sudo nginx -t && sudo systemctl reload nginx
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO=/home/phillip/01polaris-preview
sudo cp -a /etc/nginx/sites-available/polarisdx.net /etc/nginx/sites-available/polarisdx.net.bak-pre-relaunch-20261016
sudo install -d -m 755 /etc/nginx/snippets
sudo install -m 644 "$REPO/deploy/nginx/polarisdx-hsts.conf" /etc/nginx/snippets/polarisdx-hsts.conf
sudo install -m 644 "$REPO/deploy/nginx/polarisdx.net.conf" /etc/nginx/sites-available/polarisdx.net
sudo nginx -t
sudo systemctl reload nginx
echo "--- Pruefung:"
curl -sI https://polarisdx.net/de/ | grep -i 'strict-transport-security' || echo "HSTS FEHLT"
printf '/early -> %s (erwartet 404)\n' "$(curl -s -o /dev/null -w '%{http_code}' https://polarisdx.net/early)"
printf '/api/early-access -> %s (erwartet 404)\n' "$(curl -s -o /dev/null -w '%{http_code}' -X POST -H 'content-type: application/json' --data '{}' https://polarisdx.net/api/early-access)"
