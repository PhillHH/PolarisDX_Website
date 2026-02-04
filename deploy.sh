#!/bin/bash
# =============================================================================
# PolarisDX Docker Deployment Script
# =============================================================================
# Verwendung:
#   ./deploy.sh build    - Nur bauen
#   ./deploy.sh up       - Bauen und starten
#   ./deploy.sh test     - Bauen, starten und testen
#   ./deploy.sh logs     - Logs anzeigen
#   ./deploy.sh down     - Container stoppen
# =============================================================================

set -e

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funktionen
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Build
build() {
    log_info "Building Docker images..."
    docker compose build --no-cache frontend
    log_info "Build completed!"
}

# Start
up() {
    log_info "Starting containers..."
    docker compose up -d
    log_info "Containers started!"
    log_info "Waiting for services to be ready..."
    sleep 5
}

# Stop
down() {
    log_info "Stopping containers..."
    docker compose down
    log_info "Containers stopped!"
}

# Logs
logs() {
    docker compose logs -f frontend
}

# Test
test_deployment() {
    log_info "Testing deployment..."

    # Test 1: HTTP Status
    log_info "Test 1: Checking HTTP status..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:2026/ 2>/dev/null || echo "000")
    if [ "$HTTP_STATUS" = "200" ]; then
        log_info "✓ Homepage returns HTTP 200"
    else
        log_error "✗ Homepage returns HTTP $HTTP_STATUS"
        return 1
    fi

    # Test 2: SSR Check (Title im HTML)
    log_info "Test 2: Checking SSR rendering..."
    TITLE=$(curl -s http://localhost:2026/ 2>/dev/null | grep -o "<title>[^<]*</title>" | head -1)
    if [ -n "$TITLE" ]; then
        log_info "✓ SSR working - $TITLE"
    else
        log_warn "⚠ Could not extract title tag"
    fi

    # Test 3: Sitemap
    log_info "Test 3: Checking sitemap.xml..."
    SITEMAP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:2026/sitemap.xml 2>/dev/null || echo "000")
    if [ "$SITEMAP_STATUS" = "200" ]; then
        log_info "✓ Sitemap returns HTTP 200"
    else
        log_warn "⚠ Sitemap returns HTTP $SITEMAP_STATUS"
    fi

    # Test 4: Health Check
    log_info "Test 4: Checking container health..."
    HEALTH=$(docker inspect --format='{{.State.Health.Status}}' $(docker compose ps -q frontend) 2>/dev/null || echo "unknown")
    if [ "$HEALTH" = "healthy" ]; then
        log_info "✓ Container is healthy"
    else
        log_warn "⚠ Container health: $HEALTH (may still be starting)"
    fi

    log_info "All tests completed!"
}

# Image-Größe anzeigen
show_size() {
    log_info "Image sizes:"
    docker images | grep -E "polarisdx|frontend" | head -5
}

# Hauptlogik
case "${1:-test}" in
    build)
        build
        show_size
        ;;
    up)
        build
        up
        ;;
    test)
        build
        up
        test_deployment
        show_size
        ;;
    logs)
        logs
        ;;
    down)
        down
        ;;
    size)
        show_size
        ;;
    *)
        echo "Usage: $0 {build|up|test|logs|down|size}"
        exit 1
        ;;
esac
