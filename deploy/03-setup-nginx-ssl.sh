#!/usr/bin/env bash
# ============================================================
# EBIC VPS — Phase 2: Install Nginx + Let's Encrypt SSL
# ============================================================
# Target: Debian 12 (Bookworm)
# Run as: root or sudo user
# Usage:  sudo bash 03-setup-nginx-ssl.sh
# ============================================================
set -euo pipefail

# --------------------------------------------------
# Configuration
# --------------------------------------------------
DOMAIN="ebic.cit.edu.ly"
EMAIL="admin@cit.edu.ly"   # For Let's Encrypt expiry notifications
APP_PORT="3000"             # Docker app container internal port

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# --------------------------------------------------
# Pre-flight
# --------------------------------------------------
if [ "$(id -u)" -ne 0 ]; then
  error "This script must be run as root or with sudo."
fi

# Check DNS resolution
info "Checking DNS for ${DOMAIN}..."
RESOLVED_IP=$(dig +short "$DOMAIN" A 2>/dev/null || true)
SERVER_IP=$(curl -s4 ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

if [ -z "$RESOLVED_IP" ]; then
  warn "Could not resolve ${DOMAIN}. DNS may not be configured yet."
  warn "SSL certificate request may fail. Continuing with HTTP-only setup..."
  SSL_READY=false
elif [ "$RESOLVED_IP" != "$SERVER_IP" ]; then
  warn "DNS mismatch: ${DOMAIN} resolves to ${RESOLVED_IP}, but this server is ${SERVER_IP}"
  warn "SSL certificate request may fail. Continuing with HTTP-only setup..."
  SSL_READY=false
else
  info "DNS OK: ${DOMAIN} → ${RESOLVED_IP}"
  SSL_READY=true
fi

# --------------------------------------------------
# 1. Install Nginx
# --------------------------------------------------
info "Installing Nginx..."
apt update
apt install -y nginx

# --------------------------------------------------
# 2. Install Certbot
# --------------------------------------------------
info "Installing Certbot for Let's Encrypt..."
apt install -y certbot python3-certbot-nginx

# --------------------------------------------------
# 3. Create Nginx HTTP Configuration (pre-SSL)
# --------------------------------------------------
info "Writing Nginx configuration..."
cat > /etc/nginx/sites-available/ebic << NGINX_EOF
# ============================================================
# EBIC — Nginx Reverse Proxy Configuration
# Domain: ${DOMAIN}
# ============================================================

# Rate limiting zone — 10 requests/second per IP for API
limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=10r/s;

# Connection limiting — max 20 concurrent connections per IP
limit_conn_zone \$binary_remote_addr zone=conn_limit:10m;

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    # Let's Encrypt challenge directory
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect all HTTP to HTTPS (enabled after SSL cert is obtained)
    # location / {
    #     return 301 https://\$host\$request_uri;
    # }

    # Temporary: serve directly until SSL is set up
    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX_EOF

# Enable site, disable default
ln -sf /etc/nginx/sites-available/ebic /etc/nginx/sites-enabled/ebic
rm -f /etc/nginx/sites-enabled/default

# Test config
nginx -t || error "Nginx configuration test failed!"

# Reload
systemctl reload nginx
info "Nginx HTTP configuration active."

# --------------------------------------------------
# 4. Obtain SSL Certificate
# --------------------------------------------------
if [ "$SSL_READY" = true ]; then
  info "Requesting SSL certificate from Let's Encrypt..."
  certbot --nginx \
    -d "$DOMAIN" \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --redirect

  if [ $? -eq 0 ]; then
    info "SSL certificate obtained successfully!"

    # --------------------------------------------------
    # 5. Write Production Nginx Config (post-SSL)
    # --------------------------------------------------
    info "Writing production Nginx config with SSL..."
    cat > /etc/nginx/sites-available/ebic << NGINX_SSL_EOF
# ============================================================
# EBIC — Production Nginx (SSL + Reverse Proxy)
# Domain: ${DOMAIN}
# ============================================================

# Rate limiting
limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_conn_zone \$binary_remote_addr zone=conn_limit:10m;

# HTTP → HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};

    # --- SSL Configuration ---
    ssl_certificate     /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_tickets off;

    # Modern TLS only
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    # --- Security Headers ---
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # --- Gzip Compression ---
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 4;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/xml
        image/svg+xml
        font/woff2;

    # --- File Upload Size ---
    client_max_body_size 50M;

    # --- Connection Limits ---
    limit_conn conn_limit 20;

    # --- Static Assets (aggressive caching) ---
    location /_next/static {
        proxy_pass http://127.0.0.1:${APP_PORT};
        expires 365d;
        access_log off;
        add_header Cache-Control "public, immutable";
    }

    # Public assets
    location /images {
        proxy_pass http://127.0.0.1:${APP_PORT};
        expires 30d;
        access_log off;
    }

    location /favicon.ico {
        proxy_pass http://127.0.0.1:${APP_PORT};
        expires 30d;
        access_log off;
    }

    # --- API Rate Limiting ---
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;

        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }

    # --- Main Application ---
    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }

    # --- Block sensitive paths ---
    location ~ /\\.env { deny all; return 404; }
    location ~ /\\.git { deny all; return 404; }
}
NGINX_SSL_EOF

    nginx -t && systemctl reload nginx
    info "Production SSL configuration active!"
  else
    warn "SSL certificate request failed. HTTP config remains active."
    warn "Ensure DNS A-record points to this server and retry:"
    warn "  sudo certbot --nginx -d ${DOMAIN}"
  fi
else
  warn "Skipping SSL — DNS not ready."
  warn "After DNS is configured, run:"
  warn "  sudo certbot --nginx -d ${DOMAIN} --email ${EMAIL} --agree-tos --redirect"
fi

# --------------------------------------------------
# 6. Set Up Auto-Renewal
# --------------------------------------------------
info "Configuring SSL auto-renewal..."
systemctl enable certbot.timer 2>/dev/null || true

# Test renewal (dry run)
certbot renew --dry-run 2>/dev/null && info "Auto-renewal test passed!" || warn "Auto-renewal test failed (expected if no cert yet)."

# --------------------------------------------------
# Summary
# --------------------------------------------------
echo ""
echo "=========================================="
echo " ✅ Nginx + SSL Setup Complete"
echo "=========================================="
echo ""
echo " Domain:     ${DOMAIN}"
echo " HTTP:       Port 80 (redirect to HTTPS)"
echo " HTTPS:      Port 443 (SSL termination)"
echo " Upstream:   127.0.0.1:${APP_PORT}"
echo " SSL:        $(if [ "$SSL_READY" = true ]; then echo 'Let'\''s Encrypt'; else echo 'NOT YET (DNS pending)'; fi)"
echo " Renewal:    Automatic via certbot.timer"
echo ""
echo " Nginx logs: /var/log/nginx/"
echo ""
echo " Next step: Run 04-deploy.sh"
echo "=========================================="
