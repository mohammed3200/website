#!/bin/sh
set -e

# Run database migrations automatically on startup
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "🔄 Running Prisma migrations..."
  npx prisma migrate deploy
  echo "✅ Migrations complete!"
fi

# Run seeds if requested
if [ "$RUN_SEEDS" = "true" ]; then
  echo "🌱 Running database seeds..."
  bun prisma/seed-rbac.ts
  bun prisma/seed-templates.ts
  bun prisma/seed.ts
  echo "✅ Seeds complete!"
fi

# Execute the main command (e.g., node server.js)
exec "$@"
