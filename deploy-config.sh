#!/bin/bash
# deploy-config.sh - Deployment configuration variables
# Source this file in other deployment scripts: source ./deploy-config.sh

# ===== DEPLOYMENT VARIABLES - EDIT THESE FOR EACH SITE =====

# Domain configuration
export DOMAIN="hr-suite.valtara.ai"
export WWW_DOMAIN="www.hr-suite.valtara.ai"  # Optional: set to "" if not using www
export EMAIL="ops@valtara.ai"  # For Let's Encrypt notifications

# Server configuration
export SERVER_IP="91.98.203.231"
export SSH_USER="ubuntu"
export SSH_KEY="./ubuntu-ky.pem"

# Application configuration
export APP_NAME="valt-hr-suite"
export APP_DIR="/var/www/${APP_NAME}"
export PM2_NAME="${APP_NAME}"
export APP_PORT="3000"  # Next.js default port

# Build configuration
export NODE_VERSION="20"  # Minimum Node.js version required
export BUILD_DIR="./dist"
export ARTIFACT_NAME="${APP_NAME}-$(date +%Y%m%d-%H%M%S).tar.gz"

# Backup configuration
export BACKUP_DIR="/var/backups/${APP_NAME}"
export BACKUP_RETENTION_DAYS="30"

# ===== DERIVED VARIABLES (DO NOT EDIT) =====
export NGINX_SITE_FILE="/etc/nginx/sites-available/${DOMAIN}"
export NGINX_SITE_LINK="/etc/nginx/sites-enabled/${DOMAIN}"
export SSL_CERT_PATH="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
export SSL_KEY_PATH="/etc/letsencrypt/live/${DOMAIN}/privkey.pem"

echo "✓ Deployment configuration loaded"
echo "  Domain: ${DOMAIN}"
echo "  Server: ${SSH_USER}@${SERVER_IP}"
echo "  App: ${APP_NAME} on port ${APP_PORT}"
