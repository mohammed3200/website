# Docker Deployment Guide

This guide explains how to deploy the Misurata Entrepreneurship Center Next.js application using Docker.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Configuration](#configuration)
4. [Deployment Steps](#deployment-steps)
5. [Production Deployment](#production-deployment)
6. [Maintenance](#maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)

To verify your installation:

```bash
docker --version
docker-compose --version
```

---

## Quick Start

The fastest way to get the application running:

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env and fill in required values (see Configuration section)
# Using your preferred text editor

# 3. Start all services
docker-compose up -d

# 4. Run database migrations
docker-compose exec app npx prisma migrate deploy

# 5. (Optional) Seed RBAC roles and permissions
docker-compose exec app pnpm run seed:rbac

# 6. Access the application
# Open http://localhost:3000 in your browser
```

---

## Configuration

### Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

**Critical variables to configure:**

#### 1. Database Configuration
```env
DATABASE_USER=root
DATABASE_PASSWORD=your_secure_password_here
DATABASE_NAME=citcoder_eitdc
```

#### 2. NextAuth Secret
Generate a secure secret:
```bash
openssl rand -base64 32
```
Then set:
```env
NEXTAUTH_SECRET=<generated_secret>
```

#### 3. Admin Credentials
```env
INIT_ADMIN_USERNAME=eitdc_admin
INIT_ADMIN_PASSWORD=your_secure_admin_password
ADMIN_API_KEY=<generate_random_string>
```

#### 4. Email Configuration (SMTP)
For Gmail/Google Workspace:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ebic@cit.edu.ly
SMTP_PASS=your_app_password_here
EMAIL_FROM=ebic@cit.edu.ly
```

> **Note**: For Gmail, you need to generate an App Password:
> 1. Go to https://myaccount.google.com/
> 2. Enable 2-Step Verification
> 3. Generate App Password at https://myaccount.google.com/apppasswords
> 4. Use the 16-character password in `SMTP_PASS`

#### 5. Production URLs (for production deployment)
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

---

## Deployment Steps

### Step 1: Build the Docker Image

```bash
docker build -t ebic-website:latest .
```

This will:
- Install all dependencies using pnpm
- Generate Prisma client
- Build the Next.js application
- Create a production-optimized image (~200-400MB)

### Step 2: Start Services with Docker Compose

```bash
docker-compose up -d
```

This starts three services:
- **app**: Next.js application (port 3000)
- **mysql**: MySQL database (port 3306)
- **redis**: Redis queue system (port 6379)

Check the status:
```bash
docker-compose ps
```

All services should show as "healthy" after ~30-60 seconds.

### Step 3: Database Migrations

Run Prisma migrations to create database tables:

```bash
docker-compose exec app npx prisma migrate deploy
```

### Step 4: Seed Initial Data (Optional)

Seed RBAC roles and permissions:

```bash
docker-compose exec app pnpm run seed:rbac
```

### Step 5: Verify Deployment

1. **Check application logs**:
   ```bash
   docker-compose logs -f app
   ```

2. **Access the application**:
   - Public site: http://localhost:3000
   - Admin login: http://localhost:3000/admin/login

3. **Test database connection**:
   ```bash
   docker-compose exec mysql mysql -u root -p
   # Enter the password from DATABASE_PASSWORD
   ```

4. **Test Redis connection**:
   ```bash
   docker-compose exec redis redis-cli ping
   # Should respond with "PONG"
   ```

---

## Production Deployment

### Building for Production

1. **Update environment variables** in `.env`:
   ```env
   NEXT_PUBLIC_APP_URL=https://ebic.cit.edu.ly
   NEXTAUTH_URL=https://ebic.cit.edu.ly
   ALLOWED_ORIGINS=https://ebic.cit.edu.ly,https://www.cit.edu.ly
   ```

2. **Build the image**:
   ```bash
   docker build -t ebic-website:production .
   ```

3. **Tag for registry** (if using a container registry):
   ```bash
   docker tag ebic-website:production your-registry.com/ebic-website:latest
   docker push your-registry.com/ebic-website:latest
   ```

### Environment Management

For production, use Docker secrets or environment variable management:

```bash
# Using environment file
docker-compose --env-file .env.production up -d

# Or pass secrets via Docker secrets (recommended)
docker secret create nextauth_secret <(openssl rand -base64 32)
```

### Database Backups

**Regular backup schedule:**

```bash
# Backup database
docker-compose exec mysql mysqldump -u root -p${DATABASE_PASSWORD} ${DATABASE_NAME} > backup-$(date +%Y%m%d).sql

# Restore from backup
docker-compose exec -T mysql mysql -u root -p${DATABASE_PASSWORD} ${DATABASE_NAME} < backup-20260122.sql
```

**Automated backup with cron:**

Create a backup script `scripts/backup-db.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)
docker-compose exec mysql mysqldump -u root -p${DATABASE_PASSWORD} ${DATABASE_NAME} > /backups/ebic-backup-${DATE}.sql
```

### Scaling Considerations

- **Horizontal scaling**: Use a load balancer (nginx, Traefik)
- **Database**: Consider managed MySQL (AWS RDS, Azure Database)
- **Redis**: Consider managed Redis (AWS ElastiCache, Redis Cloud)
- **File storage**: Use object storage (S3, Azure Blob) for media files

---

## Maintenance

### Updating the Application

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild image
docker-compose build app

# 3. Stop and remove old containers
docker-compose down

# 4. Start updated containers
docker-compose up -d

# 5. Run migrations (if any)
docker-compose exec app npx prisma migrate deploy
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mysql
docker-compose logs -f redis

# Last 100 lines
docker-compose logs --tail=100 app
```

### Container Management

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data!)
docker-compose down -v

# Restart specific service
docker-compose restart app

# Execute commands in container
docker-compose exec app sh
```

### Database Management

```bash
# Access MySQL CLI
docker-compose exec mysql mysql -u root -p

# View database size
docker-compose exec mysql mysql -u root -p -e "SELECT table_schema AS 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.tables GROUP BY table_schema;"

# Optimize tables
docker-compose exec mysql mysqlcheck -u root -p --optimize ${DATABASE_NAME}
```

### Cleanup

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove all stopped containers
docker container prune

# Full cleanup (use with caution)
docker system prune -a --volumes
```

---

## Troubleshooting

### Common Issues

#### 1. Application won't start

**Symptom**: Container exits immediately

**Solutions**:
```bash
# Check logs
docker-compose logs app

# Common causes:
# - Missing environment variables
# - Database connection failure
# - Port already in use

# Check if port 3000 is available
netstat -an | grep 3000

# Use different port
# Edit docker-compose.yml: ports: "3001:3000"
```

#### 2. Database connection errors

**Symptom**: `Error: Can't reach database server`

**Solutions**:
```bash
# Verify MySQL is running
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Verify DATABASE_URL format
# Should be: mysql://user:password@mysql:3306/database_name

# Test connection
docker-compose exec app sh -c 'npx prisma db pull'
```

#### 3. Prisma migration issues

**Symptom**: `Migration failed` or `Schema is not in sync`

**Solutions**:
```bash
# Reset database (WARNING: deletes all data)
docker-compose exec app npx prisma migrate reset --force

# Generate Prisma client manually
docker-compose exec app npx prisma generate

# Push schema without migration
docker-compose exec app npx prisma db push
```

#### 4. Redis connection errors

**Symptom**: BullMQ errors, queue not working

**Solutions**:
```bash
# Check Redis logs
docker-compose logs redis

# Test Redis connection
docker-compose exec redis redis-cli ping

# Flush Redis (clears queue)
docker-compose exec redis redis-cli FLUSHALL
```

#### 5. Email not sending

**Symptom**: Emails not being sent

**Solutions**:
```bash
# Check SMTP configuration in .env
# Verify SMTP credentials are correct

# Test email manually
docker-compose exec app node -e "
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});
transport.verify().then(console.log).catch(console.error);
"

# Check Redis queue
docker-compose exec redis redis-cli KEYS '*'
```

#### 6. Image build fails

**Symptom**: Docker build errors

**Solutions**:
```bash
# Clear build cache
docker builder prune

# Build without cache
docker-compose build --no-cache app

# Check disk space
df -h

# Clean up Docker resources
docker system df
docker system prune -a
```

#### 7. Permission errors (Linux)

**Symptom**: Permission denied errors

**Solutions**:
```bash
# Fix file ownership
sudo chown -R $USER:$USER .

# Fix .next directory permissions
sudo chmod -R 755 .next
```

### Health Checks

Monitor service health:

```bash
# Check all service health
docker-compose ps

# Manual health check
curl http://localhost:3000/api/health

# Check database connectivity
docker-compose exec app npx prisma db pull
```

### Getting Help

If you encounter issues:

1. Check application logs: `docker-compose logs -f app`
2. Check database logs: `docker-compose logs mysql`
3. Verify all environment variables are set correctly
4. Ensure ports 3000, 3306, 6379 are not in use
5. Review Docker and Docker Compose versions

---

## Additional Resources

- **Next.js Docker Documentation**: https://nextjs.org/docs/deployment#docker-image
- **Prisma with Docker**: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- **Docker Best Practices**: https://docs.docker.com/develop/dev-best-practices/
- **Docker Compose Reference**: https://docs.docker.com/compose/compose-file/

---

**Last Updated**: 2026-01-22  
**Maintainer**: EBIC Development Team
