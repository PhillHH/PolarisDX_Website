#!/usr/bin/env bash
# =============================================================================
# PolarisDX — Deployment, Health-Gate, Rollback, Sicherung (AP28)
# =============================================================================
# Vertrag: building-docs/DEPLOYMENT-CONTRACT.md · Runbook: docs/deploy.md
#
#   ./deploy.sh [--env production|preview] <befehl> [argument]
#
#   build [release]      Images aus dem aktuellen Commit bauen, Tag = Git-SHA
#   up <release>         genau dieses Release starten: Sicherung (Produktion),
#                        Health-Gate, Identitaets- und Smoke-Pruefung; schlaegt
#                        etwas fehl, automatisch zurueck auf das vorige Release
#   rollback [release]   auf das vorige (oder genannte) Release zurueck
#   adopt <name>         laufende Images ohne Tag als Release <name> sichern
#                        (einmalig vor dem ersten Deploy mit diesem Skript)
#   status               laufendes Release, Gesundheit, Historie
#   smoke                Smoke-Pruefung gegen die laufende Umgebung
#   backup               Lead-Datenbank + Anhaenge sichern (.deploy/<env>/backups)
#   restore-test [dir]   Sicherung in einem Wegwerf-Container pruefen
#   restore <dir>        Sicherung zurueckspielen (stoppt das Backend kurz)
#   logs | down
#
# Grundsaetze (DEP-03..DEP-09, DEP-22..DEP-26):
#   - Es wird nur gestartet, was als Image mit Release-Tag existiert; `up` baut
#     nie. Dasselbe Image wandert von Preview nach Produktion.
#   - Ein Deploy gilt erst nach Health-Gate + Smoke als angenommen.
#   - Rollback tauscht Images, nie Quellcode (kein git checkout auf dem Host).
#   - Die Smoke-Pruefung erzeugt keinen Lead und keine Mail (DEP-48).
# =============================================================================

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

ENVIRONMENT=production
if [[ "${1:-}" == "--env" ]]; then
  ENVIRONMENT="${2:-}"
  shift 2
fi

case "$ENVIRONMENT" in
  production)
    # Projektname = bestehendes Produktionsprojekt (Container 01polaris-*).
    # Ausdruecklich gesetzt, damit ein Aufruf aus einem anderen Arbeitsbaum
    # nicht still ein zweites Projekt auf demselben Port anlegt (DD-19).
    PROJECT="${PROD_PROJECT:-01polaris}"
    COMPOSE_FILES=(-f docker-compose.yml)
    export WEB_HOST_PORT="${WEB_HOST_PORT:-2026}" API_HOST_PORT="${API_HOST_PORT:-5000}"
    ;;
  preview)
    PROJECT="${PREVIEW_PROJECT:-polarisdx-preview}"
    COMPOSE_FILES=(-f docker-compose.yml -f docker-compose.preview.yml)
    export WEB_HOST_PORT="${WEB_HOST_PORT:-9100}" API_HOST_PORT="${API_HOST_PORT:-5100}"
    ;;
  *)
    echo "Unbekannte Umgebung: $ENVIRONMENT (production|preview)" >&2
    exit 2
    ;;
esac

STATE_DIR="${DEPLOY_STATE_DIR:-$ROOT/.deploy}/$ENVIRONMENT"
HISTORY="$STATE_DIR/releases"
BACKUP_DIR="$STATE_DIR/backups"
BACKUP_KEEP="${BACKUP_KEEP:-14}"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-180}"
BASE_URL="http://127.0.0.1:${WEB_HOST_PORT}"
mkdir -p "$STATE_DIR" "$BACKUP_DIR"
chmod 700 "$STATE_DIR" "$BACKUP_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
log() { echo -e "${GREEN}[$ENVIRONMENT]${NC} $*"; }
warn() { echo -e "${YELLOW}[$ENVIRONMENT] WARN${NC} $*" >&2; }
fail() { echo -e "${RED}[$ENVIRONMENT] FEHLER${NC} $*" >&2; }

compose() { RELEASE="${RELEASE:-local}" docker compose -p "$PROJECT" "${COMPOSE_FILES[@]}" "$@"; }
container_of() { compose ps -q "$1" 2>/dev/null | head -1; }
current_release() { [[ -s "$HISTORY" ]] && tail -1 "$HISTORY" | awk '{print $2}' || true; }
previous_release() {
  [[ -s "$HISTORY" ]] || return 0
  local current
  current="$(current_release)"
  awk -v cur="$current" '$2 != cur {r=$2} END {print r}' "$HISTORY"
}
record_release() { echo "$(date -u +%FT%TZ) $1 ${2:-deploy}" >>"$HISTORY"; }

require_images() {
  local release="$1"
  for image in polarisdx-frontend polarisdx-backend; do
    if ! docker image inspect "$image:$release" >/dev/null 2>&1; then
      fail "Image $image:$release fehlt. Erst ./deploy.sh build ausfuehren (oder Release pruefen)."
      return 1
    fi
  done
}

# -----------------------------------------------------------------------------
# Build — einmal, aus einem sauberen Commit (DEP-03/04/06)
# -----------------------------------------------------------------------------
cmd_build() {
  local release="${1:-}"
  if [[ -z "$release" ]]; then
    if [[ -n "$(git status --porcelain --untracked-files=no)" && "${ALLOW_DIRTY:-0}" != "1" ]]; then
      fail "Arbeitsbaum hat uncommittete Aenderungen — ein Release muss genau einem Commit entsprechen."
      return 1
    fi
    release="$(git rev-parse --short=12 HEAD)"
  fi
  log "Baue Release $release …"
  RELEASE="$release" compose build
  log "Fertig: polarisdx-frontend:$release, polarisdx-backend:$release"
  echo "$release"
}

# -----------------------------------------------------------------------------
# Health-Gate (DEP-08/DEP-46, §5.3) und Smoke (D-T14) — ohne Nebenwirkung
# -----------------------------------------------------------------------------
wait_healthy() {
  local deadline=$((SECONDS + HEALTH_TIMEOUT))
  for service in backend frontend; do
    local id status
    while :; do
      id="$(container_of "$service")"
      status="$( [[ -n "$id" ]] && docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$id" || echo missing)"
      [[ "$status" == "healthy" ]] && break
      if [[ "$status" == "unhealthy" || $SECONDS -ge $deadline ]]; then
        fail "$service ist nicht gesund (Status: $status)"
        [[ -n "$id" ]] && docker logs --tail 30 "$id" >&2 || true
        return 1
      fi
      sleep 3
    done
    log "$service: healthy"
  done
}

check_identity() {
  local release="$1"
  for service in frontend backend; do
    local id revision
    id="$(container_of "$service")"
    revision="$(docker inspect -f '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$id")"
    if [[ "$revision" != "$release" ]]; then
      fail "$service laeuft mit Revision '$revision', erwartet '$release' (D-T2)"
      return 1
    fi
  done
  log "Artefaktidentitaet: beide Dienste = $release"
}

expect_status() {
  local expected="$1" path="$2" actual
  actual="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$BASE_URL$path")"
  if [[ "$actual" != "$expected" ]]; then
    fail "GET $path → $actual (erwartet $expected)"
    return 1
  fi
}

cmd_smoke() {
  local failed=0
  # Ueber den Host-Port, also denselben Weg wie der Reverse Proxy (D-T24).
  for path in /de/ /en/ /de/diagnostics /de/igloo-pro /de/epigenetics /de/contact \
    /sitemap.xml /robots.txt; do
    expect_status 200 "$path" || failed=1
  done
  expect_status 301 / || failed=1
  expect_status 404 /de/ap28-smoke-gibt-es-nicht || failed=1
  # API-Bereitschaft durch den SSR-Proxy — liest nur (DEP-48).
  expect_status 200 /api/health || failed=1
  # Geschuetzte Lead-Magnet-Dateien sind im Backend-Image und aufloesbar (gemessen 2026-10-16:
  # ohne sie scheitert der gegatete Download im Container mit UNCLASSIFIED_ERROR).
  if ! docker exec "$(container_of backend)" node -e "
    const r = require('./protected-assets').createAssetResolver()
    let n = 0
    for (const [id, a] of r.assets) if (a.deliveryClass === 'GATED')
      for (const v of a.variants) { r.resolve(id, v.language); n++ }
    console.log('geschuetzte Dateien aufloesbar: ' + n)" ; then
    fail "geschuetzte Lead-Magnet-Dateien fehlen im Backend-Image"
    failed=1
  fi
  # Echtes Markup statt Fehlerbild.
  if ! curl -s --max-time 15 "$BASE_URL/de/" | grep -q '<h1'; then
    fail "/de/ liefert kein gerendertes Markup"
    failed=1
  fi
  if [[ "$ENVIRONMENT" == "production" ]] &&
    curl -s --max-time 15 "$BASE_URL/de/" | grep -q 'preview\.polarisdx\.net'; then
    fail "Produktion verweist auf die Preview-Domain"
    failed=1
  fi
  [[ $failed -eq 0 ]] && log "Smoke: gruen" || return 1
}

# -----------------------------------------------------------------------------
# Deploy und Rollback
# -----------------------------------------------------------------------------
start_release() {
  local release="$1"
  require_images "$release"
  RELEASE="$release" compose up -d --no-build --remove-orphans
  wait_healthy && check_identity "$release" && cmd_smoke
}

cmd_up() {
  local release="${1:-}"
  [[ -n "$release" ]] || { fail "Release fehlt: ./deploy.sh up <release>"; return 2; }
  require_images "$release"
  if [[ "$ENVIRONMENT" == "production" && -n "$(container_of backend)" ]]; then
    # Erster Wechsel vom Altstand (main, vor AP28): dessen Image kennt weder ops/backup.js noch
    # eine Lead-Datenbank (Daten liegen in Host-Bind-Mounts, docs/deploy.md §3). Dort gibt es
    # nichts zu sichern — ein Abbruch waere falsch. Jedes Release ab AP28 wird gesichert.
    if docker exec "$(container_of backend)" test -f ops/backup.js 2>/dev/null; then
      log "Sicherung vor dem Deploy (DEP-15) …"
      cmd_backup
    else
      warn "Laufendes Backend ohne Sicherungswerkzeug (Altstand vor AP28): Sicherung uebersprungen; Altdaten bleiben in den Host-Verzeichnissen (docs/deploy.md §3)."
    fi
  fi
  local previous
  previous="$(current_release)"
  log "Starte Release $release (vorher: ${previous:-keins})"
  if start_release "$release"; then
    record_release "$release" deploy
    log "Release $release angenommen."
    return 0
  fi
  fail "Release $release NICHT angenommen."
  if [[ -n "$previous" && "$previous" != "$release" ]]; then
    warn "Automatischer Rollback auf $previous (DEP-09) …"
    if start_release "$previous"; then
      record_release "$previous" auto-rollback
      warn "Rollback auf $previous erfolgreich. Vorfall dokumentieren (DEP-25)."
    else
      fail "Auch der Rollback auf $previous ist nicht gesund — manuell eingreifen!"
    fi
  fi
  return 1
}

cmd_rollback() {
  local target="${1:-$(previous_release)}"
  [[ -n "$target" ]] || { fail "Kein vorheriges Release in $HISTORY"; return 1; }
  log "Rollback auf $target …"
  start_release "$target"
  record_release "$target" rollback
  log "Rollback auf $target angenommen. Vorfall dokumentieren (DEP-25)."
}

cmd_adopt() {
  local name="${1:-}"
  [[ -n "$name" ]] || { fail "Name fehlt: ./deploy.sh adopt <name>"; return 2; }
  for service in frontend backend; do
    local id image
    id="$(container_of "$service")"
    [[ -n "$id" ]] || { fail "$service laeuft nicht"; return 1; }
    image="$(docker inspect -f '{{.Image}}' "$id")"
    docker tag "$image" "polarisdx-$service:$name"
    log "$service: Image ${image:7:12} → polarisdx-$service:$name"
  done
  warn "Hinweis: uebernommene Images tragen kein Revisions-Label; ein Rollback darauf prueft die Identitaet nicht."
  record_release "$name" adopt
}

cmd_status() {
  log "Projekt $PROJECT · Web $BASE_URL · laufendes Release: $(current_release || echo unbekannt)"
  compose ps
  for service in frontend backend; do
    local id
    id="$(container_of "$service")"
    [[ -n "$id" ]] && echo "  $service: $(docker inspect -f '{{index .Config.Labels "org.opencontainers.image.revision"}} · {{if .State.Health}}{{.State.Health.Status}}{{end}} · Neustarts {{.RestartCount}}' "$id")"
  done
  echo "Historie (letzte 10):"
  tail -10 "$HISTORY" 2>/dev/null || echo "  (leer)"
}

# -----------------------------------------------------------------------------
# Sicherung, Restore-Test, Restore (PT28.5, DEP-15..DEP-21)
# -----------------------------------------------------------------------------
cmd_backup() {
  local id stamp target
  id="$(container_of backend)"
  [[ -n "$id" ]] || { fail "Backend laeuft nicht"; return 1; }
  stamp="$(date -u +%Y%m%dT%H%M%SZ)"
  target="/var/lib/polarisdx/backups/$stamp"
  docker exec "$id" node ops/backup.js create "$target" >/dev/null
  docker cp "$id:$target" "$BACKUP_DIR/$stamp" >/dev/null
  docker exec "$id" rm -rf "$target"
  chmod -R go-rwx "$BACKUP_DIR/$stamp"
  log "Sicherung: $BACKUP_DIR/$stamp ($(du -sh "$BACKUP_DIR/$stamp" | cut -f1))"
  # Aufbewahrung (DEP-18): die juengsten $BACKUP_KEEP Sicherungen bleiben.
  ls -1d "$BACKUP_DIR"/*/ 2>/dev/null | sort | head -n -"$BACKUP_KEEP" | xargs -r rm -rf
  cmd_restore_test "$BACKUP_DIR/$stamp"
}

latest_backup() { ls -1d "$BACKUP_DIR"/*/ 2>/dev/null | sort | tail -1 | sed 's:/$::'; }

cmd_restore_test() {
  local dir="${1:-$(latest_backup)}" image
  [[ -n "$dir" && -f "$dir/manifest.json" ]] || { fail "Keine Sicherung gefunden"; return 1; }
  image="polarisdx-backend:$(current_release)"
  docker image inspect "$image" >/dev/null 2>&1 || image="$(docker inspect -f '{{.Image}}' "$(container_of backend)")"
  # Wegwerf-Container ohne Netz, Sicherung nur lesbar eingehaengt: beweist,
  # dass die Sicherung mit dem laufenden Code oeffnet und vollstaendig ist (D-T6).
  if docker run --rm --network none --user "$(id -u):$(id -g)" -v "$dir:/restore:ro" "$image" \
    node ops/backup.js verify /restore; then
    log "Restore-Test gruen: $dir"
    date -u +%FT%TZ >"$STATE_DIR/last-restore-test"
  else
    fail "Restore-Test FEHLGESCHLAGEN: $dir — Sicherung gilt nicht als wirksam (DEP-17)"
    return 1
  fi
}

cmd_restore() {
  local dir="${1:-}" id volume
  [[ -n "$dir" && -f "$dir/manifest.json" ]] || { fail "Aufruf: ./deploy.sh restore <sicherungsordner>"; return 2; }
  cmd_restore_test "$dir"
  log "Sicherung des aktuellen Stands vor dem Restore …"
  cmd_backup
  id="$(container_of backend)"
  volume="$(docker inspect -f '{{range .Mounts}}{{if eq .Destination "/var/lib/polarisdx"}}{{.Name}}{{end}}{{end}}' "$id")"
  [[ -n "$volume" ]] || { fail "Lead-Volume nicht gefunden"; return 1; }
  compose stop frontend backend
  docker run --rm --network none -v "$volume:/data" -v "$dir:/restore:ro" --entrypoint sh \
    "$(docker inspect -f '{{.Image}}' "$id")" -c '
      rm -f /data/leads.sqlite3 /data/leads.sqlite3-wal /data/leads.sqlite3-shm &&
      cp /restore/leads.sqlite3 /data/leads.sqlite3 &&
      rm -rf /data/support-uploads &&
      if [ -d /restore/support-uploads ]; then cp -r /restore/support-uploads /data/support-uploads; fi'
  RELEASE="$(current_release)" compose up -d --no-build
  wait_healthy && cmd_smoke
  log "Restore aus $dir abgeschlossen."
}

case "${1:-}" in
  build) cmd_build "${2:-}" ;;
  up) cmd_up "${2:-}" ;;
  rollback) cmd_rollback "${2:-}" ;;
  adopt) cmd_adopt "${2:-}" ;;
  status) cmd_status ;;
  smoke | test) cmd_smoke ;;
  backup) cmd_backup ;;
  restore-test) cmd_restore_test "${2:-}" ;;
  restore) cmd_restore "${2:-}" ;;
  logs) compose logs -f --tail 100 ;;
  down) compose down ;;
  *)
    sed -n '2,24p' "$0"
    exit 2
    ;;
esac
