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

# Build-time args for NEXT_PUBLIC_* variables
# These are baked into the client JS bundle at build time
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

# Expose build args as env vars for Next.js build
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

# Install bun and openssl (required for Prisma)
RUN apk add --no-cache libc6-compat openssl && npm install -g bun prisma

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

# Include Prisma config, schema, migrations, and seed scripts for database setup
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# Copy src so seed-rbac.ts can import from ../src/lib/rbac
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
# Copy all node_modules so seed scripts have access to mysql2, bcryptjs, @prisma/adapter-mysql2, etc.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

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
