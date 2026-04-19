#!/bin/sh
set -e

# ============================================
# EBIC Production Entrypoint
# Handles DB readiness, migrations, and seeding
# ============================================

# --- DB Readiness Wait Loop ---
# Waits for MySQL to accept connections before proceeding.
# Required because docker-compose `depends_on` only waits for container start,
# not for the service inside to be ready.
wait_for_db() {
  if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set, skipping database readiness check."
    return 0
  fi

  # Extract host and port from DATABASE_URL
  # Supports: mysql://user:pass@host:port/dbname
  DB_HOST=$(echo "$DATABASE_URL" | sed -n 's|.*@\([^:/]*\).*|\1|p')
  DB_PORT=$(echo "$DATABASE_URL" | sed -n 's|.*:\([0-9]*\)/.*|\1|p')
  DB_PORT=${DB_PORT:-3306}

  echo "⏳ Waiting for database at ${DB_HOST}:${DB_PORT}..."

  MAX_RETRIES=30
  RETRY_INTERVAL=2
  RETRY_COUNT=0

  while [ "$RETRY_COUNT" -lt "$MAX_RETRIES" ]; do
    if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
      echo "✅ Database is reachable at ${DB_HOST}:${DB_PORT}"
      # Extra grace period for MySQL to finish initialization
      sleep 2
      return 0
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "   Attempt ${RETRY_COUNT}/${MAX_RETRIES} - database not ready, retrying in ${RETRY_INTERVAL}s..."
    sleep "$RETRY_INTERVAL"
  done

  echo "❌ Database at ${DB_HOST}:${DB_PORT} not reachable after ${MAX_RETRIES} attempts."
  exit 1
}

# --- Run Database Migrations ---
if [ "$RUN_MIGRATIONS" = "true" ]; then
  wait_for_db

  echo "🔄 Ensuring Prisma engines are ready..."
  prisma generate

  echo "🔄 Running Prisma migrations..."
  if [ -d "prisma/migrations" ]; then
    prisma migrate deploy || npx prisma migrate deploy
  else
    echo "⚠️  No migrations directory found. Running safe schema push..."
    prisma db push || npx prisma db push
  fi
  echo "✅ Database schema sync complete!"
fi

# --- Run Seeds ---
if [ "$RUN_SEEDS" = "true" ]; then
  wait_for_db

  echo "🌱 Running database seeds..."
  bun run prisma/seed-rbac.ts
  bun run prisma/seed-templates.ts
  bun run prisma/seed.ts
  bun run prisma/seed-news-latc.ts
  echo "✅ Seeds complete!"
fi

# Execute the main command (e.g., node server.js)
exec "$@"
