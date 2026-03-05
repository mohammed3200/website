# ==========================================
# Production Dockerfile for Next.js App
# Optimized for standalone output
# ==========================================

# ------------------------------------------
# Stage 1: Dependencies
# ------------------------------------------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
RUN npm install -g bun
WORKDIR /app

COPY package.json bun.lock ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN bun install --frozen-lockfile

# ------------------------------------------
# Stage 2: Builder
# ------------------------------------------
FROM node:20-alpine AS builder
RUN npm install -g bun
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
WORKDIR /app

# openssl required by Prisma query engine
RUN apk add --no-cache libc6-compat openssl
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output and static assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Include Prisma for migrations in entrypoint
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
