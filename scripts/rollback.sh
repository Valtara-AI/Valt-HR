#!/bin/bash
# scripts/rollback.sh - Quick rollback to previous deployment

set -e

APP_NAME="valt-hr-suite"
APP_DIR="/var/www/${APP_NAME}"
PM2_NAME="${APP_NAME}"

echo "⏪ Rollback - ${APP_NAME}"
echo "========================="
date
echo ""

# Find latest backup
LATEST_BACKUP=$(ls -td ${APP_DIR}.backup-* 2>/dev/null | head -n1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ No backup found to rollback to!"
    echo ""
    echo "Available backups in /var/backups/${APP_NAME}:"
    ls -lh /var/backups/${APP_NAME}/*-app.tar.gz 2>/dev/null || echo "  (none)"
    exit 1
fi

echo "📦 Found backup: ${LATEST_BACKUP}"
echo ""
read -p "⚠️  Are you sure you want to rollback to this backup? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Rollback cancelled"
    exit 0
fi

# Stop current application
echo ""
echo "🛑 Stopping current application..."
pm2 stop ${PM2_NAME} || true

# Create backup of current state
echo ""
echo "💾 Backing up current state..."
CURRENT_BACKUP="${APP_DIR}.backup-before-rollback-$(date +%Y%m%d-%H%M%S)"
cp -r ${APP_DIR} ${CURRENT_BACKUP}
echo "✓ Current state backed up to: ${CURRENT_BACKUP}"

# Remove current deployment
echo ""
echo "🗑️  Removing current deployment..."
rm -rf ${APP_DIR}/*

# Restore from backup
echo ""
echo "📥 Restoring from backup..."
cp -r ${LATEST_BACKUP}/* ${APP_DIR}/
cp -r ${LATEST_BACKUP}/.* ${APP_DIR}/ 2>/dev/null || true

# Reinstall dependencies
echo ""
echo "📦 Reinstalling dependencies..."
cd ${APP_DIR}
npm ci --production --ignore-scripts

# Restart application
echo ""
echo "🚀 Starting application..."
pm2 restart ${PM2_NAME}
pm2 save

# Wait and health check
echo ""
echo "⏳ Waiting for application startup..."
sleep 10

if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✓ Health check passed!"
else
    echo "⚠️  Health check failed. Check logs:"
    pm2 logs ${PM2_NAME} --lines 30 --nostream
fi

echo ""
echo "✨ Rollback complete!"
echo ""
echo "📊 Current status:"
pm2 status ${PM2_NAME}
echo ""
echo "📝 Rolled back from: ${LATEST_BACKUP}"
echo "💾 Previous version saved to: ${CURRENT_BACKUP}"
echo ""
echo "To undo this rollback:"
echo "  rm -rf ${APP_DIR}/*"
echo "  cp -r ${CURRENT_BACKUP}/* ${APP_DIR}/"
echo "  pm2 restart ${PM2_NAME}"
echo ""
