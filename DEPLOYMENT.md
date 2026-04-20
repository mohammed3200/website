# EBIC Platform — Deployment Guide

> Complete guide for deploying the EBIC (Entrepreneurship & Business Innovation Center) platform
> on a Debian 12 Linux VPS with Docker, Nginx, and Let's Encrypt SSL.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Server Specifications](#server-specifications)
3. [Prerequisites](#prerequisites)
4. [First-Time Deployment](#first-time-deployment)
5. [Updating the Application](#updating-the-application)
6. [SSH Access](#ssh-access)
7. [Working with Docker](#working-with-docker)
8. [Viewing Logs](#viewing-logs)
9. [Backups & Restore](#backups--restore)
10. [Monitoring](#monitoring)
11. [Rollback](#rollback)
12. [SSL Certificate Management](#ssl-certificate-management)
13. [Environment Variables](#environment-variables)
14. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
Internet (HTTPS :443)
  │
  ▼
┌─────────────────────────────────────────────┐
│         Debian 12 VPS (8 GB RAM)            │
│         ebic.cit.edu.ly                     │
│         102.213.182.106                     │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  Nginx (Host)                         │  │
│  │  :80 → redirect → :443               │  │
│  │  :443 SSL → proxy → 127.0.0.1:3000   │  │
│  └──────────────────┬────────────────────┘  │
│                     │                       │
│  ┌──────────────────▼────────────────────┐  │
│  │  Docker Compose (app-network)         │  │
│  │                                       │  │
│  │  ┌───────────┐   ┌────────────────┐   │  │
│  │  │ ebic-app  │   │  ebic-worker   │   │  │
│  │  │ Next.js   │   │  BullMQ Jobs   │   │  │
│  │  │ :3000     │   │                │   │  │
│  │  └─────┬─────┘   └───────┬────────┘   │  │
│  │        │                  │            │  │
│  │  ┌─────▼─────┐  ┌───────▼────────┐   │  │
│  │  │  MySQL 8  │  │  Redis 7       │   │  │
│  │  │  :3306    │  │  :6379         │   │  │
│  │  └───────────┘  └────────────────┘   │  │
│  │        ┌───────────────┐              │  │
│  │        │    MinIO       │              │  │
│  │        │  S3 Storage    │              │  │
│  │        │  :9000/:9001   │              │  │
│  │        └───────────────┘              │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  UFW Firewall: Only 22, 80, 443 open        │
│  Fail2Ban: SSH brute-force protection       │
└─────────────────────────────────────────────┘
```

**Components:**

| Service | Container | Purpose | Port |
|---|---|---|---|
| **Next.js App** | `ebic-app` | Web application & API | 3000 (internal) |
| **Background Worker** | `ebic-worker` | Email queue, async jobs | — |
| **MySQL 8** | `ebic-db` | Primary database | 3306 (internal) |
| **Redis 7** | `ebic-redis` | Caching, BullMQ queues | 6379 (internal) |
| **MinIO** | `ebic-minio` | S3-compatible file storage | 9000/9001 (internal) |
| **Nginx** | Host process | SSL termination, reverse proxy | 80, 443 (public) |

---

## Server Specifications

| Parameter | Value |
|---|---|
| **Hostname** | `ebic.cit.edu.ly` |
| **OS** | Debian 12 (Bookworm) |
| **RAM** | 8 GB |
| **vCPUs** | 2 |
| **Disk** | 80 GB |
| **IPv4** | `102.213.182.106` |
| **IPv6** | `2c0f:14c0:2005::5f2` |

### Resource Allocation (Docker Limits)

| Container | Memory Limit | CPU Limit |
|---|---|---|
| ebic-app | 512 MB | 1.0 |
| ebic-worker | 256 MB | 0.5 |
| ebic-db (MySQL) | 512 MB | 1.0 |
| ebic-redis | 128 MB | 0.25 |
| ebic-minio | 256 MB | 0.5 |
| **Total Reserved** | **~1.7 GB** | **3.25** |
| **Available for OS/Nginx** | **~6.3 GB** | — |

---

## Prerequisites

Before starting deployment, ensure you have:

- [ ] **SSH access** to the server (password or key)
- [ ] **DNS A-record**: `ebic.cit.edu.ly` → `102.213.182.106`
- [ ] **Git repository** accessible from the server
- [ ] **Production credentials** ready (see [Environment Variables](#environment-variables))

### Generate SSH Key (on your local machine)

```bash
# Generate a new SSH key pair
ssh-keygen -t ed25519 -C "your_email@cit.edu.ly"

# View your public key (paste this into 01-server-setup.sh)
cat ~/.ssh/id_ed25519.pub
```

---

## First-Time Deployment

### Step 1: Server Hardening

Connect to the server via the web console (or SSH with password) and upload the setup script:

```bash
# From your local machine — upload the script
scp deploy/01-server-setup.sh root@102.213.182.106:/root/

# SSH into the server
ssh root@102.213.182.106

# Edit the script to paste your SSH public key
nano /root/01-server-setup.sh
# Find SSH_PUBLIC_KEY="PASTE_YOUR_PUBLIC_KEY_HERE" and replace

# Run the script
bash /root/01-server-setup.sh
```

**What this does:**
- Creates a non-root `ebic` user with sudo
- Configures SSH key authentication
- Enables UFW firewall (ports 22, 80, 443 only)
- Installs fail2ban for brute-force protection
- Creates `/opt/ebic` application directory

### Step 2: Install Docker

```bash
# SSH as the new deploy user
ssh ebic@102.213.182.106

# Upload and run Docker install script
sudo bash deploy/02-install-docker.sh

# Log out and back in for group changes
exit
ssh ebic@102.213.182.106

# Verify Docker works without sudo
docker ps
```

### Step 3: Set Up Nginx + SSL

```bash
sudo bash deploy/03-setup-nginx-ssl.sh
```

**What this does:**
- Installs Nginx on the host
- Obtains a free SSL certificate from Let's Encrypt
- Configures HTTPS with security headers
- Sets up automatic certificate renewal
- Proxies traffic to Docker app on `127.0.0.1:3000`

### Step 4: Deploy the Application

```bash
# First-time deployment
bash deploy/04-deploy.sh first
```

**What this does:**
- Clones the repository to `/opt/ebic`
- Creates `.env` from template (you **must** edit this)
- Builds all Docker images
- Starts all containers
- Runs database migrations and seeds
- Verifies health endpoint

### Step 5: Configure Environment

```bash
# Edit production environment variables
nano /opt/ebic/.env
```

See [Environment Variables](#environment-variables) for all required values.

After editing, restart the app:

```bash
cd /opt/ebic
docker compose restart app worker
```

---

## Updating the Application

After pushing code changes to the `main` branch:

```bash
ssh ebic@102.213.182.106
cd /opt/ebic
bash deploy/04-deploy.sh update
```

This pulls the latest code, rebuilds containers, runs migrations, and verifies health.

---

## SSH Access

### Connect to the Server

```bash
# As deploy user (recommended)
ssh ebic@102.213.182.106

# As root (emergency only)
ssh root@102.213.182.106
```

### SSH Config (add to ~/.ssh/config on your local machine)

```
Host ebic
    HostName 102.213.182.106
    User ebic
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60
```

Then simply: `ssh ebic`

### Upload Files

```bash
# Single file
scp ./file.txt ebic@102.213.182.106:/opt/ebic/

# Entire directory
scp -r ./deploy ebic@102.213.182.106:/opt/ebic/
```

---

## Working with Docker

### Common Commands

```bash
cd /opt/ebic

# View all container status
docker compose ps

# Restart a specific service
docker compose restart app
docker compose restart worker

# Stop everything
docker compose down

# Start everything
docker compose up -d

# Rebuild a single service
docker compose build app
docker compose up -d app

# Enter a container shell
docker exec -it ebic-app sh
docker exec -it ebic-db mysql -u root -p

# Check resource usage
docker stats
```

### Database Access

```bash
# Open MySQL CLI
docker exec -it ebic-db mysql -u root -p${MYSQL_ROOT_PASSWORD} citcoder_eitdc

# Run a query
docker exec ebic-db mysql -u root -pYOUR_PASSWORD -e "SELECT COUNT(*) FROM User;" citcoder_eitdc

# Run Prisma Studio (for visual DB browsing)
docker exec -it ebic-app npx prisma studio
```

---

## Viewing Logs

```bash
cd /opt/ebic

# All services (live)
docker compose logs -f

# Specific service (last 100 lines)
docker compose logs --tail=100 app
docker compose logs --tail=100 worker
docker compose logs --tail=100 db

# Nginx logs (on host)
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u docker -f
```

---

## Backups & Restore

### Create a Backup

```bash
bash /opt/ebic/deploy/05-backup.sh
```

This creates a timestamped archive in `/opt/ebic/backups/` containing:
- MySQL database dump
- MinIO file storage
- Environment configuration

### Automate Backups (Cron)

```bash
# Edit crontab
crontab -e

# Add: Run backup daily at 3 AM
0 3 * * * /opt/ebic/deploy/05-backup.sh >> /var/log/ebic/backup.log 2>&1
```

### Restore from Backup

```bash
# Extract backup
cd /opt/ebic/backups
tar -xzf ebic_backup_20260420_030000.tar.gz

# Restore database
docker exec -i ebic-db mysql -u root -pYOUR_PASSWORD citcoder_eitdc < database.sql

# Restore MinIO data (stop MinIO first)
docker compose stop minio
sudo tar -xzf minio-data.tar.gz -C /var/lib/docker/volumes/
docker compose start minio

# Restore environment
cp env.bak /opt/ebic/.env
docker compose restart app worker
```

### Download Backup to Local Machine

```bash
scp ebic@102.213.182.106:/opt/ebic/backups/ebic_backup_*.tar.gz ./
```

---

## Monitoring

### Manual Check

```bash
bash /opt/ebic/deploy/monitoring.sh
```

### Automate Monitoring (Cron)

```bash
crontab -e

# Run health check every 5 minutes
*/5 * * * * /opt/ebic/deploy/monitoring.sh >> /var/log/ebic/monitor.log 2>&1
```

### What It Monitors

- Docker daemon status
- All 5 container health states
- Application health endpoint (`/api/health`)
- SSL certificate expiry
- Disk usage (alert > 90%)
- Memory usage (alert > 90%)
- CPU load average

---

## Rollback

### Rollback to Previous Version

```bash
cd /opt/ebic

# See recent commits
git log --oneline -10

# Reset to a specific commit
git reset --hard <commit-hash>

# Rebuild and restart
docker compose build app worker
docker compose up -d
```

### Rollback Database

If a migration caused issues:

```bash
# Restore from the most recent backup
bash /opt/ebic/deploy/05-backup.sh  # Take current backup first!

# Then restore the old backup
tar -xzf /opt/ebic/backups/ebic_backup_PREVIOUS.tar.gz
docker exec -i ebic-db mysql -u root -pYOUR_PASSWORD citcoder_eitdc < database.sql
```

---

## SSL Certificate Management

SSL certificates are managed automatically by Let's Encrypt via Certbot.

```bash
# Check certificate status
sudo certbot certificates

# Force renewal (normally automatic)
sudo certbot renew

# Test auto-renewal
sudo certbot renew --dry-run
```

Certificates auto-renew every 60-90 days via systemd timer.

---

## Environment Variables

All environment variables are documented in `.env.production.example`. Critical ones:

| Variable | Example | Description |
|---|---|---|
| `DATABASE_URL` | `mysql://user:pass@db:3306/citcoder_eitdc` | MySQL connection string |
| `NEXTAUTH_SECRET` | (generate with `openssl rand -hex 32`) | Auth session encryption |
| `NEXTAUTH_URL` | `https://ebic.cit.edu.ly` | Public URL |
| `AUTH_TRUST_HOST` | `true` | **Required** behind Nginx proxy |
| `SMTP_HOST` | `smtp.gmail.com` | Email server |
| `SMTP_USER` | `ebic@cit.edu.ly` | Email username |
| `GOOGLE_CLIENT_ID` | (from Google Cloud Console) | OAuth login |
| `INIT_ADMIN_EMAIL` | `admin@cit.edu.ly` | First admin account |
| `REDIS_URL` | `redis://redis:6379` | Redis connection |
| `S3_ENDPOINT` | `http://minio:9000` | MinIO endpoint |

Generate secrets:
```bash
# NEXTAUTH_SECRET
openssl rand -hex 32

# ADMIN_API_KEY
openssl rand -hex 24

# EMAIL_TOKEN_SECRET
openssl rand -hex 32
```

---

## Troubleshooting

### App Won't Start

```bash
# Check container logs
docker compose logs --tail=50 app

# Common issues:
# - DATABASE_URL wrong → check .env
# - Port conflict → check if another process uses 3000
# - Build failed → docker compose build --no-cache app
```

### Database Connection Issues

```bash
# Check DB container health
docker inspect --format='{{.State.Health.Status}}' ebic-db

# Test connection from app container
docker exec ebic-app nc -z db 3306 && echo "OK" || echo "FAIL"

# Check MySQL logs
docker compose logs --tail=50 db
```

### SSL Certificate Failed

```bash
# Check DNS
dig ebic.cit.edu.ly A

# Ensure port 80 is open
sudo ufw status
curl -I http://ebic.cit.edu.ly

# Re-request certificate
sudo certbot --nginx -d ebic.cit.edu.ly --agree-tos --email admin@cit.edu.ly
```

### High Memory Usage

```bash
# Check per-container usage
docker stats --no-stream

# Check system memory
free -h

# Restart a heavy container
docker compose restart app
```

### Disk Full

```bash
# Check disk usage
df -h
ncdu /opt/ebic

# Clean Docker artifacts
docker system prune -f
docker volume prune -f  # WARNING: removes unused volumes

# Check backup size
du -sh /opt/ebic/backups/
```

---

## File Structure

```
deploy/
├── 01-server-setup.sh      # Server hardening (run once)
├── 02-install-docker.sh     # Docker installation (run once)
├── 03-setup-nginx-ssl.sh    # Nginx + SSL (run once)
├── 04-deploy.sh             # Deploy/update app (run on each update)
├── 05-backup.sh             # Database & storage backup
└── monitoring.sh            # Health monitoring
```

---

## Quick Reference Card

| Task | Command |
|---|---|
| **SSH in** | `ssh ebic@102.213.182.106` |
| **Deploy update** | `bash deploy/04-deploy.sh update` |
| **View logs** | `docker compose logs -f app` |
| **Restart app** | `docker compose restart app` |
| **Check status** | `docker compose ps` |
| **Backup** | `bash deploy/05-backup.sh` |
| **Monitor** | `bash deploy/monitoring.sh` |
| **DB shell** | `docker exec -it ebic-db mysql -u root -p` |
| **App shell** | `docker exec -it ebic-app sh` |
| **SSL renew** | `sudo certbot renew` |
| **Disk usage** | `docker system df` |
