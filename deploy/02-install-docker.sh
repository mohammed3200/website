#!/usr/bin/env bash
# ============================================================
# EBIC VPS — Phase 1b: Install Docker Engine & Compose
# ============================================================
# Target: Debian 12 (Bookworm)
# Run as: root or sudo user
# Usage:  sudo bash 02-install-docker.sh
# ============================================================
set -euo pipefail

DEPLOY_USER="ebic"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# --------------------------------------------------
# Pre-flight
# --------------------------------------------------
if [ "$(id -u)" -ne 0 ]; then
  error "This script must be run as root or with sudo."
fi

# --------------------------------------------------
# 1. Remove Conflicting Packages
# --------------------------------------------------
info "Removing old Docker packages (if any)..."
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do
  apt remove -y "$pkg" 2>/dev/null || true
done

# --------------------------------------------------
# 2. Add Docker's Official GPG Key & Repository
# --------------------------------------------------
info "Adding Docker's official repository..."
install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/debian/gpg | \
  gpg --dearmor -o /etc/apt/keyrings/docker.gpg

chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

# --------------------------------------------------
# 3. Install Docker Engine
# --------------------------------------------------
info "Installing Docker Engine..."
apt update
apt install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin

# --------------------------------------------------
# 4. Add Deploy User to Docker Group
# --------------------------------------------------
if id "$DEPLOY_USER" &>/dev/null; then
  info "Adding '${DEPLOY_USER}' to docker group..."
  usermod -aG docker "$DEPLOY_USER"
else
  info "User '${DEPLOY_USER}' not found. Run 01-server-setup.sh first."
fi

# --------------------------------------------------
# 5. Enable & Start Docker
# --------------------------------------------------
info "Enabling Docker on boot..."
systemctl enable docker
systemctl start docker

# --------------------------------------------------
# 6. Configure Docker Daemon for Production
# --------------------------------------------------
info "Configuring Docker daemon..."
mkdir -p /etc/docker
cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "live-restore": true,
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 65536,
      "Soft": 32768
    }
  }
}
EOF

systemctl restart docker

# --------------------------------------------------
# 7. Verify Installation
# --------------------------------------------------
info "Verifying Docker installation..."
echo ""
docker version
echo ""
docker compose version
echo ""

# Quick smoke test
info "Running hello-world test..."
docker run --rm hello-world 2>/dev/null && info "Docker smoke test passed!" || error "Docker smoke test failed!"

# Clean up test image
docker rmi hello-world 2>/dev/null || true

# --------------------------------------------------
# Summary
# --------------------------------------------------
echo ""
echo "=========================================="
echo " ✅ Docker Installation Complete"
echo "=========================================="
echo ""
echo " Docker:         $(docker --version)"
echo " Compose:        $(docker compose version)"
echo " User '${DEPLOY_USER}': Added to docker group"
echo ""
echo " ⚠️  Log out and back in for group changes"
echo "    to take effect for user '${DEPLOY_USER}'."
echo ""
echo " Next step: Run 03-setup-nginx-ssl.sh"
echo "=========================================="
