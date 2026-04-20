#!/usr/bin/env bash
# ============================================================
# EBIC VPS — Phase 4: Automated Backup Script
# ============================================================
# Run as: ebic user (cron recommended)
# Usage:  bash 05-backup.sh
# Cron:   0 3 * * * /opt/ebic/deploy/05-backup.sh >> /var/log/ebic/backup.log 2>&1
# ============================================================
set -euo pipefail

# --------------------------------------------------
# Configuration
# --------------------------------------------------
APP_DIR="/opt/ebic"
BACKUP_DIR="/opt/ebic/backups"
RETENTION_DAYS=7
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="ebic_backup_${TIMESTAMP}"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"; }
warn()  { echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"; }

# --------------------------------------------------
# Create backup directory
# --------------------------------------------------
mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}"
cd "$APP_DIR"

# --------------------------------------------------
# 1. Database Backup
# --------------------------------------------------
info "Backing up MySQL database..."
DB_CONTAINER="ebic-db"
DB_NAME=$(docker exec "$DB_CONTAINER" sh -c 'echo $MYSQL_DATABASE' 2>/dev/null || echo "citcoder_eitdc")
DB_PASS=$(docker exec "$DB_CONTAINER" sh -c 'echo $MYSQL_ROOT_PASSWORD' 2>/dev/null || echo "root")

docker exec "$DB_CONTAINER" mysqldump \
  -u root \
  -p"${DB_PASS}" \
  --single-transaction \
  --routines \
  --triggers \
  "$DB_NAME" \
  > "${BACKUP_DIR}/${BACKUP_NAME}/database.sql" 2>/dev/null

if [ $? -eq 0 ]; then
  DB_SIZE=$(du -sh "${BACKUP_DIR}/${BACKUP_NAME}/database.sql" | cut -f1)
  info "Database backup complete (${DB_SIZE})"
else
  warn "Database backup failed!"
fi

# --------------------------------------------------
# 2. MinIO Data Backup
# --------------------------------------------------
info "Backing up MinIO data..."
MINIO_VOLUME=$(docker volume inspect ebic_minio-data --format '{{.Mountpoint}}' 2>/dev/null || true)

if [ -n "$MINIO_VOLUME" ] && [ -d "$MINIO_VOLUME" ]; then
  tar -czf "${BACKUP_DIR}/${BACKUP_NAME}/minio-data.tar.gz" \
    -C "$(dirname "$MINIO_VOLUME")" \
    "$(basename "$MINIO_VOLUME")" 2>/dev/null

  MINIO_SIZE=$(du -sh "${BACKUP_DIR}/${BACKUP_NAME}/minio-data.tar.gz" | cut -f1)
  info "MinIO backup complete (${MINIO_SIZE})"
else
  warn "MinIO volume not found. Skipping MinIO backup."
fi

# --------------------------------------------------
# 3. Environment Config Backup
# --------------------------------------------------
info "Backing up configuration..."
if [ -f "${APP_DIR}/.env" ]; then
  cp "${APP_DIR}/.env" "${BACKUP_DIR}/${BACKUP_NAME}/env.bak"
  info "Environment config backed up."
fi

# --------------------------------------------------
# 4. Compress Backup
# --------------------------------------------------
info "Compressing backup archive..."
cd "$BACKUP_DIR"
tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
rm -rf "$BACKUP_NAME"

TOTAL_SIZE=$(du -sh "${BACKUP_NAME}.tar.gz" | cut -f1)
info "Backup archive created: ${BACKUP_NAME}.tar.gz (${TOTAL_SIZE})"

# --------------------------------------------------
# 5. Rotate Old Backups
# --------------------------------------------------
info "Rotating backups older than ${RETENTION_DAYS} days..."
DELETED=$(find "$BACKUP_DIR" -name "ebic_backup_*.tar.gz" -mtime +"$RETENTION_DAYS" -delete -print | wc -l)
info "Deleted ${DELETED} old backup(s)."

# --------------------------------------------------
# 6. Show Backup Status
# --------------------------------------------------
echo ""
info "Current backups:"
ls -lhrt "${BACKUP_DIR}"/ebic_backup_*.tar.gz 2>/dev/null || echo "  (none)"
echo ""

DISK_FREE=$(df -h /opt/ebic | tail -1 | awk '{print $4}')
info "Disk space remaining: ${DISK_FREE}"
info "Backup complete!"
