# ==========================================
# Production Dockerfile for Next.js App
# Optimized for Performance, Security, and Size
# ==========================================

# ------------------------------------------
# Stage 1: Dependencies
# Install dependencies only when needed.
# Uses oven/bun:alpine for native lockfile support.
# This is the ONLY stage that downloads packages.
# ------------------------------------------
FROM oven/bun:alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts

# ------------------------------------------
# Stage 2: Builder
# Builds the Next.js app. Copies node_modules
# from deps (no network access needed here).
# ------------------------------------------
FROM oven/bun:alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Build-time args for NEXT_PUBLIC_* variables
ARG NEXT_PUBLIC_APP_URL=https://ebic.cit.edu.ly
ARG NEXT_PUBLIC_APP_NAME="Misurata Entrepreneurship Center"
ARG NEXT_PUBLIC_CONTACT_EMAIL=ebic@cit.edu.ly
ARG NEXT_PUBLIC_CONTACT_PHONE="+218 91 0000000"
ARG NEXT_PUBLIC_CONTACT_LOCATION="Industrial Technical College, Misurata, Libya"
ARG NEXT_PUBLIC_WORKING_HOURS="Sun-Thu, 9am-3pm"
ARG NEXT_PUBLIC_MAP_EMBED_URL=""
ARG NEXT_PUBLIC_INNOVATORS_THRESHOLD=3
ARG NEXT_PUBLIC_COLLABORATORS_THRESHOLD=3
ARG NEXT_PUBLIC_FAQ_THRESHOLD=1

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_CONTACT_EMAIL=$NEXT_PUBLIC_CONTACT_EMAIL
ENV NEXT_PUBLIC_CONTACT_PHONE=$NEXT_PUBLIC_CONTACT_PHONE
ENV NEXT_PUBLIC_CONTACT_LOCATION=$NEXT_PUBLIC_CONTACT_LOCATION
ENV NEXT_PUBLIC_WORKING_HOURS=$NEXT_PUBLIC_WORKING_HOURS
ENV NEXT_PUBLIC_MAP_EMBED_URL=$NEXT_PUBLIC_MAP_EMBED_URL
ENV NEXT_PUBLIC_INNOVATORS_THRESHOLD=$NEXT_PUBLIC_INNOVATORS_THRESHOLD
ENV NEXT_PUBLIC_COLLABORATORS_THRESHOLD=$NEXT_PUBLIC_COLLABORATORS_THRESHOLD
ENV NEXT_PUBLIC_FAQ_THRESHOLD=$NEXT_PUBLIC_FAQ_THRESHOLD

# Generate Prisma Client (prisma CLI comes from node_modules)
RUN DATABASE_URL=mysql://localhost:3306/dummy npx prisma generate

# Build Next.js app
RUN DATABASE_URL=mysql://localhost:3306/dummy bun run build

# ------------------------------------------
# Stage 3: Runner
# Minimal production image.
# NO package manager installs. NO network access.
# Only copies pre-built artifacts from builder.
# ------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# openssl is required by Prisma's query engine at runtime
RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Include Prisma config, schema, migrations, and seed scripts
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Copy src so seed-rbac.ts can import from ../src/lib/rbac
COPY --from=builder --chown=nextjs:nodejs /app/src ./src

# Copy node_modules (prisma CLI, seed deps, @prisma/client all live here)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Add node_modules/.bin to PATH so bare "prisma" and "bun" commands work
ENV PATH="/app/node_modules/.bin:$PATH"

# Copy bun binary from builder for seed scripts (bun run prisma/seed-rbac.ts)
COPY --from=oven/bun:alpine /usr/local/bin/bun /usr/local/bin/bun

# Copy entrypoint script
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
