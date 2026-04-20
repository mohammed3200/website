#!/usr/bin/env bash
# ============================================================
# EBIC VPS — Health Monitoring & Alerting
# ============================================================
# Run as: ebic user (cron recommended)
# Usage:  bash monitoring.sh
# Cron:   */5 * * * * /opt/ebic/deploy/monitoring.sh >> /var/log/ebic/monitor.log 2>&1
# ============================================================
set -uo pipefail

# --------------------------------------------------
# Configuration
# --------------------------------------------------
APP_DIR="/opt/ebic"
HEALTH_URL="http://127.0.0.1:3000/api/health"
DISK_THRESHOLD=90    # Alert if disk usage > 90%
MEMORY_THRESHOLD=90  # Alert if memory usage > 90%
LOG_FILE="/var/log/ebic/monitor.log"

# Optional: Webhook URL for alerts (Discord, Slack, etc.)
# ALERT_WEBHOOK=""

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
PROBLEMS=0

# --------------------------------------------------
# Helper Functions
# --------------------------------------------------
ok()    { echo "[${TIMESTAMP}] ✅ $1"; }
fail()  { echo "[${TIMESTAMP}] ❌ $1"; PROBLEMS=$((PROBLEMS + 1)); }
warn()  { echo "[${TIMESTAMP}] ⚠️  $1"; }

# --------------------------------------------------
# 1. Check Docker Daemon
# --------------------------------------------------
if docker info &>/dev/null; then
  ok "Docker daemon is running"
else
  fail "Docker daemon is NOT running"
fi

# --------------------------------------------------
# 2. Check Container Status
# --------------------------------------------------
cd "$APP_DIR" 2>/dev/null || true

CONTAINERS=("ebic-app" "ebic-worker" "ebic-db" "ebic-redis" "ebic-minio")

for CONTAINER in "${CONTAINERS[@]}"; do
  STATUS=$(docker inspect --format='{{.State.Status}}' "$CONTAINER" 2>/dev/null || echo "not_found")
  HEALTH=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}no_healthcheck{{end}}' "$CONTAINER" 2>/dev/null || echo "unknown")

  if [ "$STATUS" = "running" ]; then
    if [ "$HEALTH" = "healthy" ] || [ "$HEALTH" = "no_healthcheck" ]; then
      ok "${CONTAINER}: running (${HEALTH})"
    else
      fail "${CONTAINER}: running but ${HEALTH}"
    fi
  else
    fail "${CONTAINER}: ${STATUS}"
  fi
done

# --------------------------------------------------
# 3. Check Application Health Endpoint
# --------------------------------------------------
HTTP_CODE=$(curl -sf -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
  ok "Health endpoint: HTTP ${HTTP_CODE}"
else
  fail "Health endpoint: HTTP ${HTTP_CODE} (expected 200)"
fi

# --------------------------------------------------
# 4. Check SSL Certificate Expiry
# --------------------------------------------------
CERT_EXPIRY=$(echo | openssl s_client -servername ebic.cit.edu.ly -connect ebic.cit.edu.ly:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

if [ -n "$CERT_EXPIRY" ]; then
  EXPIRY_EPOCH=$(date -d "$CERT_EXPIRY" +%s 2>/dev/null || echo "0")
  NOW_EPOCH=$(date +%s)
  DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

  if [ "$DAYS_LEFT" -gt 14 ]; then
    ok "SSL certificate: ${DAYS_LEFT} days remaining"
  elif [ "$DAYS_LEFT" -gt 0 ]; then
    warn "SSL certificate: ${DAYS_LEFT} days remaining (renewal needed soon)"
  else
    fail "SSL certificate: EXPIRED"
  fi
else
  warn "Could not check SSL certificate"
fi

# --------------------------------------------------
# 5. Check Disk Space
# --------------------------------------------------
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | tr -d '%')

if [ "$DISK_USAGE" -lt "$DISK_THRESHOLD" ]; then
  ok "Disk usage: ${DISK_USAGE}%"
else
  fail "Disk usage: ${DISK_USAGE}% (threshold: ${DISK_THRESHOLD}%)"
fi

# Docker volume sizes
DOCKER_SIZE=$(docker system df --format '{{.Size}}' 2>/dev/null | head -1 || echo "unknown")
ok "Docker disk usage: ${DOCKER_SIZE}"

# --------------------------------------------------
# 6. Check Memory Usage
# --------------------------------------------------
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')

if [ "$MEMORY_USAGE" -lt "$MEMORY_THRESHOLD" ]; then
  ok "Memory usage: ${MEMORY_USAGE}%"
else
  fail "Memory usage: ${MEMORY_USAGE}% (threshold: ${MEMORY_THRESHOLD}%)"
fi

# --------------------------------------------------
# 7. Check CPU Load
# --------------------------------------------------
LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}' | cut -d',' -f1 | xargs)
CPU_COUNT=$(nproc)

# Compare 1-min load avg to CPU count
LOAD_INT=$(echo "$LOAD_AVG" | cut -d'.' -f1)
if [ "${LOAD_INT:-0}" -le "$CPU_COUNT" ]; then
  ok "CPU load: ${LOAD_AVG} (${CPU_COUNT} cores)"
else
  warn "CPU load: ${LOAD_AVG} (high for ${CPU_COUNT} cores)"
fi

# --------------------------------------------------
# Summary
# --------------------------------------------------
echo ""
if [ "$PROBLEMS" -eq 0 ]; then
  echo "[${TIMESTAMP}] ========== ALL CHECKS PASSED =========="
else
  echo "[${TIMESTAMP}] ========== ${PROBLEMS} PROBLEM(S) DETECTED =========="

  # Send alert if webhook is configured
  if [ -n "${ALERT_WEBHOOK:-}" ]; then
    ALERT_MSG="🚨 EBIC Monitor: ${PROBLEMS} problem(s) detected on $(hostname) at ${TIMESTAMP}"
    curl -sf -X POST "$ALERT_WEBHOOK" \
      -H "Content-Type: application/json" \
      -d "{\"content\": \"${ALERT_MSG}\"}" 2>/dev/null || true
  fi
fi
echo ""
