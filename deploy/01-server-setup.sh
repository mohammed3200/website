#!/usr/bin/env bash
# ============================================================
# EBIC VPS — Phase 1: Initial Server Setup & Hardening
# ============================================================
# Target: Debian 12 (Bookworm) — ebic.cit.edu.ly
# Run as: root (first-time only, via web console or SSH)
# Usage:  bash 01-server-setup.sh
# ============================================================
set -euo pipefail

# --------------------------------------------------
# Configuration — Edit these before running
# --------------------------------------------------
DEPLOY_USER="ebic"
DEPLOY_USER_SHELL="/bin/bash"
HOSTNAME_TARGET="ebic-cit-edu-ly"
TIMEZONE="Africa/Tripoli"

# Your SSH public key — paste your id_ed25519.pub or id_rsa.pub content here
# Generate one locally with: ssh-keygen -t ed25519 -C "your_email@example.com"
SSH_PUBLIC_KEY="PASTE_YOUR_PUBLIC_KEY_HERE"

# --------------------------------------------------
# Colors for output
# --------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# --------------------------------------------------
# Pre-flight checks
# --------------------------------------------------
if [ "$(id -u)" -ne 0 ]; then
  error "This script must be run as root."
fi

if [ "$SSH_PUBLIC_KEY" = "PASTE_YOUR_PUBLIC_KEY_HERE" ]; then
  warn "SSH_PUBLIC_KEY not set. Password login will remain enabled."
  warn "Generate a key locally with: ssh-keygen -t ed25519"
  SKIP_SSH_KEY=true
else
  SKIP_SSH_KEY=false
fi

# --------------------------------------------------
# 1. System Update & Upgrade
# --------------------------------------------------
info "Updating system packages..."
apt update && apt upgrade -y

# --------------------------------------------------
# 2. Install Essential Packages
# --------------------------------------------------
info "Installing essential tools..."
apt install -y \
  curl \
  wget \
  git \
  htop \
  ufw \
  fail2ban \
  unzip \
  nano \
  ncdu \
  net-tools \
  ca-certificates \
  gnupg \
  lsb-release \
  sudo \
  logrotate \
  cron

# --------------------------------------------------
# 3. Set Timezone & Hostname
# --------------------------------------------------
info "Setting timezone to ${TIMEZONE}..."
timedatectl set-timezone "$TIMEZONE"

info "Setting hostname to ${HOSTNAME_TARGET}..."
hostnamectl set-hostname "$HOSTNAME_TARGET"

# --------------------------------------------------
# 4. Create Non-Root Deploy User
# --------------------------------------------------
if id "$DEPLOY_USER" &>/dev/null; then
  info "User '${DEPLOY_USER}' already exists, skipping creation."
else
  info "Creating deploy user '${DEPLOY_USER}'..."
  adduser --disabled-password --gecos "EBIC Deploy" "$DEPLOY_USER"
  usermod -aG sudo "$DEPLOY_USER"

  # Allow passwordless sudo for deploy user (for automated scripts)
  echo "${DEPLOY_USER} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/${DEPLOY_USER}
  chmod 440 /etc/sudoers.d/${DEPLOY_USER}
fi

# --------------------------------------------------
# 5. Configure SSH Key Authentication
# --------------------------------------------------
if [ "$SKIP_SSH_KEY" = false ]; then
  info "Setting up SSH key for ${DEPLOY_USER}..."
  DEPLOY_HOME=$(eval echo ~${DEPLOY_USER})
  mkdir -p "${DEPLOY_HOME}/.ssh"
  echo "$SSH_PUBLIC_KEY" > "${DEPLOY_HOME}/.ssh/authorized_keys"
  chmod 700 "${DEPLOY_HOME}/.ssh"
  chmod 600 "${DEPLOY_HOME}/.ssh/authorized_keys"
  chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${DEPLOY_HOME}/.ssh"

  # Also set up for root as backup
  mkdir -p /root/.ssh
  echo "$SSH_PUBLIC_KEY" >> /root/.ssh/authorized_keys
  chmod 700 /root/.ssh
  chmod 600 /root/.ssh/authorized_keys
fi

# --------------------------------------------------
# 6. Harden SSH Configuration
# --------------------------------------------------
info "Hardening SSH configuration..."
SSHD_CONFIG="/etc/ssh/sshd_config"
cp "$SSHD_CONFIG" "${SSHD_CONFIG}.bak"

# Apply security settings
sed -i 's/^#\?PermitRootLogin .*/PermitRootLogin prohibit-password/' "$SSHD_CONFIG"
sed -i 's/^#\?MaxAuthTries .*/MaxAuthTries 3/' "$SSHD_CONFIG"
sed -i 's/^#\?ClientAliveInterval .*/ClientAliveInterval 300/' "$SSHD_CONFIG"
sed -i 's/^#\?ClientAliveCountMax .*/ClientAliveCountMax 2/' "$SSHD_CONFIG"

if [ "$SKIP_SSH_KEY" = false ]; then
  sed -i 's/^#\?PasswordAuthentication .*/PasswordAuthentication no/' "$SSHD_CONFIG"
  info "Password authentication DISABLED. Use SSH key only."
else
  warn "Password authentication kept ENABLED (no SSH key provided)."
fi

systemctl restart sshd

# --------------------------------------------------
# 7. Configure Firewall (UFW)
# --------------------------------------------------
info "Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# Enable without prompt
echo "y" | ufw enable
ufw status verbose

# --------------------------------------------------
# 8. Configure Fail2Ban
# --------------------------------------------------
info "Configuring Fail2Ban for SSH protection..."
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port    = ssh
logpath = %(sshd_log)s
maxretry = 3
bantime = 7200
EOF

systemctl enable fail2ban
systemctl restart fail2ban

# --------------------------------------------------
# 9. Create Application Directory
# --------------------------------------------------
info "Creating application directory..."
mkdir -p /opt/ebic
chown "${DEPLOY_USER}:${DEPLOY_USER}" /opt/ebic

# Mark the directory as safe for git to prevent "dubious ownership" errors
sudo git config --global --add safe.directory /opt/ebic

# Create log directory
mkdir -p /var/log/ebic
chown "${DEPLOY_USER}:${DEPLOY_USER}" /var/log/ebic

# Create backup directory
mkdir -p /opt/ebic/backups
chown "${DEPLOY_USER}:${DEPLOY_USER}" /opt/ebic/backups

# --------------------------------------------------
# Summary
# --------------------------------------------------
echo ""
echo "=========================================="
echo " ✅ Server Setup Complete"
echo "=========================================="
echo ""
echo " Hostname:     $(hostname)"
echo " Timezone:     $(timedatectl show --property=Timezone --value)"
echo " Deploy User:  ${DEPLOY_USER}"
echo " SSH Key Auth: $(if [ "$SKIP_SSH_KEY" = false ]; then echo 'ENABLED'; else echo 'SKIPPED'; fi)"
echo " Firewall:     ACTIVE (22, 80, 443)"
echo " Fail2Ban:     ACTIVE"
echo " App Dir:      /opt/ebic"
echo ""
if [ "$SKIP_SSH_KEY" = false ]; then
  echo " You can now SSH in as:"
  echo "   ssh ${DEPLOY_USER}@$(hostname -I | awk '{print $1}')"
else
  echo " ⚠️  Set up SSH keys, then re-run to disable password auth."
fi
echo ""
echo " Next step: Run 02-install-docker.sh"
echo "=========================================="
