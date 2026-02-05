Virtuozzo Deployment Analysis & Implementation Plan
Overview
Your Next.js project is compatible with Virtuozzo Application Platform custom container deployment, but there are critical architectural issues that must be addressed before production deployment.

Current Project Status
✅ Good: Docker-Ready Configuration
Your project already has:

Dockerfile: Multi-stage build optimized for production with Next.js standalone mode
docker-compose.yml: Local development setup with MariaDB and Redis
next.config.ts: Configured with output: 'standalone' for Docker optimization
Environment variables: Properly structured in 
.env
⚠️ Critical Issues Found
Based on your existing 
Deployment And Verdict.md
, there are serious architectural problems:

CAUTION

Database Architecture Problem: The project stores media files as BLOBs in the database, which will cause PaaS database nodes to run out of RAM and storage quickly. Do not deploy to production until Task 22 (S3 migration) is complete.

WARNING

Security Issue: The NEXTAUTH_SECRET in 
.env
 is committed to the repository. This must be rotated immediately before deployment.

WARNING

Over-Engineering: Redis/BullMQ are implemented but without proper worker processes, adding unnecessary complexity and cost.

Proposed Changes
1. Pre-Deployment Security Fixes
[MODIFY] 
.env
Required Changes:

Generate new NEXTAUTH_SECRET
Update NEXTAUTH_URL to production domain
Update NEXT_PUBLIC_APP_URL to production domain
Configure production database connection string
Verify SMTP credentials for production
Action: Create a new .env.production file with production values (not committed to git)

2. Docker Registry Preparation
[MODIFY] 
Dockerfile
Current Status: Your Dockerfile is already optimized with:

Multi-stage build
Standalone Next.js output
Non-root user (security best practice)
Proper port exposure (3000)
Prisma generation during build
Recommendation: No changes needed to Dockerfile itself, but verify the image tag naming convention matches your Docker registry.

3. Environment Variable Configuration for Virtuozzo
Create a production environment variables file that includes:

bash
# Database Connection (from Virtuozzo MariaDB node)
DATABASE_URL=mysql://[user]:[password]@[host]:3306/[database]
# Application URLs
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
# Authentication
NEXTAUTH_SECRET=[generate-new-secret-here]
# Redis Connection (from Virtuozzo Redis node)
REDIS_HOST=[virtuozzo-redis-host]
REDIS_PORT=6379
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ebic@cit.edu.ly
SMTP_PASS=[app-password]
EMAIL_FROM=ebic@cit.edu.ly
# Admin Configuration
INIT_ADMIN_USERNAME=eitdc_admin
INIT_ADMIN_EMAIL=ebic@cit.edu.ly
INIT_ADMIN_PASSWORD=[secure-password]
ADMIN_API_KEY=[generate-new-key]
# Security & Monitoring
ALLOWED_ORIGINS=https://your-domain.com,https://ebic.cit.edu.ly
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
# Feature Flags
ENABLE_EMAIL_QUEUE=true
ENABLE_TWO_FACTOR_AUTH=true
ENABLE_DISPOSABLE_EMAIL_CHECK=true
Deployment Steps
Step 1: Build and Push Docker Image
bash
# 1. Login to Docker Hub (or your private registry)
docker login
# 2. Build the image with production tag
docker build -t [your-username]/website-app:latest .
# 3. Push to registry
docker push [your-username]/website-app:latest
Step 2: Create Virtuozzo Environment
Login to Virtuozzo Dashboard

Create New Environment:

Click "New Environment"
Switch to "Custom" tab
Select "Docker Engine" or "Docker Swarm"
Add Database Node:

Add MariaDB 10.11+ node
Note the connection credentials provided by platform
Important: Use PaaS-provided database, not containerized database
Add Redis Node (if using email queue):

Add Redis 7+ node
Note the connection details
Configure Custom Container:

Image: [your-username]/website-app:latest
Port: 3000 (internal)
Expose via Load Balancer: 80/443 → 3000
Step 3: Configure Environment Variables
In Virtuozzo Dashboard:

Go to your application node
Navigate to Settings → Variables
Add all production environment variables listed above
Ensure sensitive values are not exposed in logs
Step 4: Database Migration
Option A (Recommended): Manual migration via SSH

bash
# 1. SSH into the container via Virtuozzo Web SSH
# 2. Run Prisma migrations
npx prisma migrate deploy
Option B: Automated (risky with multiple containers)

Modify Dockerfile to run migrations on startup
Only suitable for single-container deployments
Step 5: Domain Configuration
Add Custom Domain in Virtuozzo
Configure SSL Certificate (Let's Encrypt or custom)
Update DNS Records:
A record pointing to Virtuozzo IP
CNAME for www subdomain
Step 6: Verification
After deployment:

Test application access via HTTPS
Verify database connection
Test authentication flow
Verify email sending functionality
Check Redis connection (if applicable)
Monitor application logs for errors
Verification Plan
Automated Tests
Build Verification

bash
# Verify Docker image builds successfully
docker build -t test-build .
Container Health Check

bash
# Run container locally to verify it starts
docker run -p 3000:3000 --env-file .env.production [your-username]/website-app:latest
# Access http://localhost:3000 and verify homepage loads
Manual Verification
Post-Deployment Checks (to be performed by user after deployment):

 Access application via production URL
 Test user registration and login
 Verify admin dashboard access
 Submit a test form (innovator/collaborator)
 Verify email notifications are sent
 Check database connectivity via admin dashboard
 Test Arabic/English language switching
 Verify static assets load correctly
Performance Monitoring:

Monitor memory usage in Virtuozzo dashboard
Check database storage consumption
Monitor application response times
Virtuozzo-Specific Requirements
Port Configuration
Internal Port: 3000 (Next.js default)
External Port: 80 (HTTP) and 443 (HTTPS) via Load Balancer
Database Port: 3306 (internal to PaaS network)
Redis Port: 6379 (internal to PaaS network)
Environment Variables Management
Virtuozzo allows setting environment variables via Dashboard UI
Variables are encrypted and not exposed in logs
Can be updated without rebuilding the container
Resource Allocation
Based on your application:

Minimum RAM: 2GB (recommended 4GB for production)
CPU: 2 cores minimum
Storage: 20GB minimum (but see warning about BLOB storage)
Networking
Application containers communicate with database via internal network
No need to expose database publicly
Use Virtuozzo's internal DNS for service discovery
Important Recommendations
IMPORTANT

Before Production Deployment:

Migrate media storage from database BLOBs to S3 (or compatible object storage)
Rotate all secrets (NEXTAUTH_SECRET, ADMIN_API_KEY)
Remove 
.env
 from version control (add to 
.gitignore
)
Set up database backups in Virtuozzo
Configure monitoring and alerting
NOTE

Cost Optimization:

PaaS storage is expensive for BLOB data
Consider removing Redis/BullMQ if not actively used
Start with minimal resources and scale up based on monitoring
Architecture Recommendations for Production
Immediate (Before Deployment)
✅ Docker containerization (already complete)
⚠️ Rotate all secrets
⚠️ Create production environment variables file
⚠️ Test Docker image locally with production-like environment
Short-term (Within 1 month)
🔴 CRITICAL: Migrate media storage to S3/Minio/compatible object storage
Review and optimize Redis usage or remove if unnecessary
Implement proper database backup strategy
Set up monitoring (Sentry, LogRocket, or similar)
Long-term (Future enhancements)
Implement CDN for static assets
Set up staging environment
Implement CI/CD pipeline for automated deployments
Consider horizontal scaling if traffic increases
Troubleshooting Guide
Common Issues
Issue: Container fails to start

Check logs in Virtuozzo dashboard
Verify all required environment variables are set
Ensure database connection string is correct
Issue: Database connection timeout

Verify database node is running
Check internal network connectivity
Ensure DATABASE_URL uses internal hostname
Issue: Static assets not loading

Verify public folder is copied in Dockerfile (✅ already configured)
Check CDN/Load Balancer configuration
Verify file permissions
Issue: Email sending fails

Test SMTP credentials locally first
Verify firewall allows outbound SMTP connections
Check SMTP logs in application
Next Steps
Review this plan and confirm deployment timeline
Generate new secrets for production
Set up Docker Hub account (or private registry)
Coordinate with Virtuozzo hosting provider for account setup
Plan database migration strategy (especially for media files)
Schedule deployment window (recommend off-peak hours)
