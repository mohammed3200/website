# ==========================================
# Production Dockerfile for Next.js App
# Optimized for standalone output
# ==========================================

# Use build args for version pinning to ensure deterministic builds
ARG BUN_VERSION=1.3.10
ARG PRISMA_VERSION=7.4.0

# ------------------------------------------
# Stage 1: Dependencies
# ------------------------------------------
FROM node:20-alpine AS deps
ARG BUN_VERSION
RUN apk add --no-cache libc6-compat python3 make g++
RUN npm install -g bun@${BUN_VERSION}
WORKDIR /app

COPY package.json bun.lock ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN bun install --frozen-lockfile

# ------------------------------------------
# Stage 2: Builder
# ------------------------------------------
FROM node:20-alpine AS builder
ARG BUN_VERSION
RUN npm install -g bun@${BUN_VERSION}
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma Client
RUN DATABASE_URL=mysql://localhost:3306/dummy npx prisma generate

# Build Next.js app (Standalone output enabled in next.config.ts)
RUN DATABASE_URL=mysql://localhost:3306/dummy bun run build

# ------------------------------------------
# Stage 3: Runner
# ------------------------------------------
FROM node:20-alpine AS runner
ARG BUN_VERSION
ARG PRISMA_VERSION
WORKDIR /app

# openssl required by Prisma query engine.
# bun and prisma CLI required for entrypoint (migrations/seeds)
RUN apk add --no-cache libc6-compat openssl
RUN npm install -g bun@${BUN_VERSION} prisma@${PRISMA_VERSION}

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output and static assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Include Prisma artifacts for migrations in entrypoint
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/bun.lock ./
COPY --from=builder --chown=nextjs:nodejs /app/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
