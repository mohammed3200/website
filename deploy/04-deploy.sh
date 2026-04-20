#!/usr/bin/env bash
# ============================================================
# EBIC VPS — Phase 3: Application Deployment
# ============================================================
# Run as: ebic user (or any user in docker group)
# Usage:  bash 04-deploy.sh [first|update]
#   first  — Full first-time deployment (clone, build, migrate, seed)
#   update — Pull latest, rebuild, and restart (default)
# ============================================================
set -euo pipefail

# --------------------------------------------------
# Configuration
# --------------------------------------------------
APP_DIR="/opt/ebic"
REPO_URL="https://github.com/mohammed3200/website.git"  # UPDATE THIS
BRANCH="main"
COMPOSE_FILE="docker-compose.yml"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
step()  { echo -e "${BLUE}[STEP]${NC}  $1"; }

MODE="${1:-update}"

# --------------------------------------------------
# Pre-flight Checks
# --------------------------------------------------
if ! command -v docker &> /dev/null; then
  error "Docker is not installed. Run 02-install-docker.sh first."
fi

if ! docker compose version &> /dev/null; then
  error "Docker Compose plugin is not installed."
fi

# --------------------------------------------------
# First-Time Deployment
# --------------------------------------------------
if [ "$MODE" = "first" ]; then
  echo ""
  echo "=========================================="
  echo " 🚀 EBIC — First-Time Deployment"
  echo "=========================================="
  echo ""

  # Clone repository
  if [ ! -d "${APP_DIR}/.git" ]; then
    step "Cloning repository..."
    git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
  else
    info "Repository already exists at ${APP_DIR}"
  fi

  cd "$APP_DIR"

  # Check .env exists
  if [ ! -f ".env" ]; then
    if [ -f ".env.production.example" ]; then
      warn ".env not found. Creating from template..."
      cp .env.production.example .env
      echo ""
      error "Please edit /opt/ebic/.env with your production values, then re-run this script."
    else
      error ".env file not found and no template available."
    fi
  fi

  # Build and start containers
  step "Building Docker images (this may take 5-10 minutes)..."
  docker compose -f "$COMPOSE_FILE" build --no-cache

  step "Starting all services..."
  docker compose -f "$COMPOSE_FILE" up -d

  # Wait for services to be healthy
  step "Waiting for services to become healthy..."
  sleep 10

  MAX_WAIT=120
  ELAPSED=0
  while [ $ELAPSED -lt $MAX_WAIT ]; do
    DB_STATUS=$(docker inspect --format='{{.State.Health.Status}}' ebic-db 2>/dev/null || echo "unknown")
    if [ "$DB_STATUS" = "healthy" ]; then
      info "Database is healthy!"
      break
    fi
    echo "  Waiting for database... (${ELAPSED}s / ${MAX_WAIT}s)"
    sleep 5
    ELAPSED=$((ELAPSED + 5))
  done

  if [ "$DB_STATUS" != "healthy" ]; then
    warn "Database did not become healthy in ${MAX_WAIT}s. Check logs:"
    warn "  docker compose logs db"
  fi

  # Run migrations
  step "Running database migrations..."
  docker compose exec -e RUN_MIGRATIONS=true app ./docker-entrypoint.sh echo "Migrations complete" || {
    warn "Migration via entrypoint failed. Trying direct Prisma..."
    docker compose exec app npx prisma migrate deploy || docker compose exec app npx prisma db push
  }

  # Run seeds (first deploy only)
  step "Running database seeds..."
  docker compose exec -e RUN_SEEDS=true app ./docker-entrypoint.sh echo "Seeds complete" || {
    warn "Seeding via entrypoint failed. Trying direct seed..."
    docker compose exec app bun run prisma/seed-rbac.ts || true
    docker compose exec app bun run prisma/seed-templates.ts || true
    docker compose exec app bun run prisma/seed.ts || true
    docker compose exec app bun run prisma/seed-news-latc.ts || true
  }

  step "Verifying deployment..."
  sleep 5

# --------------------------------------------------
# Update Deployment
# --------------------------------------------------
elif [ "$MODE" = "update" ]; then
  echo ""
  echo "=========================================="
  echo " 🔄 EBIC — Update Deployment"
  echo "=========================================="
  echo ""

  cd "$APP_DIR"

  # Pull latest code
  step "Pulling latest code from ${BRANCH}..."
  git fetch origin
  git reset --hard "origin/${BRANCH}"

  # Rebuild and restart
  step "Rebuilding Docker images..."
  docker compose -f "$COMPOSE_FILE" build

  step "Restarting services (zero-downtime)..."
  docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

  # Run migrations on update
  step "Running database migrations..."
  sleep 10
  docker compose exec -e RUN_MIGRATIONS=true app ./docker-entrypoint.sh echo "Migrations complete" || {
    docker compose exec app npx prisma migrate deploy 2>/dev/null || true
  }

  step "Verifying deployment..."
  sleep 5

else
  error "Unknown mode: ${MODE}. Use 'first' or 'update'."
fi

# --------------------------------------------------
# Health Check
# --------------------------------------------------
step "Running health checks..."
echo ""

# Check container status
echo "Container Status:"
docker compose -f "$COMPOSE_FILE" ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Check health endpoint
HEALTH_STATUS=$(curl -sf http://127.0.0.1:3000/api/health 2>/dev/null || echo "UNREACHABLE")
if [ "$HEALTH_STATUS" != "UNREACHABLE" ]; then
  info "Health endpoint: ✅ OK"
else
  warn "Health endpoint not responding yet. It may still be starting up."
  warn "Check with: docker compose logs -f app"
fi

# Resource usage
echo ""
echo "Resource Usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
echo ""

# --------------------------------------------------
# Summary
# --------------------------------------------------
echo ""
echo "=========================================="
echo " ✅ Deployment Complete"
echo "=========================================="
echo ""
echo " Mode:       ${MODE}"
echo " App:        https://ebic.cit.edu.ly"
echo " Health:     https://ebic.cit.edu.ly/api/health"
echo ""
echo " Useful commands:"
echo "   docker compose logs -f app     # App logs"
echo "   docker compose logs -f worker  # Worker logs"
echo "   docker compose ps              # Container status"
echo "   docker compose restart app     # Restart app"
echo "   docker stats                   # Live resource usage"
echo "=========================================="
