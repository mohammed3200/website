# ==========================================
# Production Dockerfile for Next.js App
# Optimized for Performance, Security, and Size
# ==========================================

# ------------------------------------------
# Stage 1: Dependencies
# Install dependencies only when needed
# ------------------------------------------
FROM node:20-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies using Bun
RUN npm install -g bun && bun install --frozen-lockfile --ignore-scripts

# ------------------------------------------
# Stage 2: Builder
# Rebuild the source code only when needed
# ------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g bun
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Run Prisma Generate (CRITICAL for Type Safety and Runtime access)
# Generate Prisma Client with dummy DATABASE_URL
# This must run before build
RUN DATABASE_URL=mysql://localhost:3306/dummy npx prisma generate

# Build Next.js app using Bun
RUN DATABASE_URL=mysql://localhost:3306/dummy bun run build

# ------------------------------------------
# Stage 3: Runner
# Production image, copy all the files and run next
# ------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install bun for running seeds/migrations
RUN apk add --no-cache libc6-compat && npm install -g bun

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Include Prisma schema, migrations, and seed scripts for database setup
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma

# Copy entrypoint script
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
