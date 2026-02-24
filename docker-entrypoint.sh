#!/bin/sh
set -e

# Run database migrations automatically on startup
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "🔄 Ensuring Prisma engines are ready..."
  prisma generate
  echo "🔄 Running Prisma migrations..."
  if [ -d "prisma/migrations" ]; then
    prisma migrate deploy || npx prisma migrate deploy
  else
    echo "⚠️ No migrations found. Pushing schema directly..."
    prisma db push --accept-data-loss || npx prisma db push --accept-data-loss
  fi
  echo "✅ Database schema sync complete!"
fi

# Run seeds if requested
if [ "$RUN_SEEDS" = "true" ]; then
  echo "🌱 Running database seeds..."
  bun run prisma/seed-rbac.ts
  bun run prisma/seed-templates.ts
  bun run prisma/seed.ts
  echo "✅ Seeds complete!"
fi

# Execute the main command (e.g., node server.js)
exec "$@"
