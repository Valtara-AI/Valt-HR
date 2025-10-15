#!/bin/bash
# scripts/backup.sh - Application and database backup script
# Schedule via cron: 0 2 * * * /var/www/valt-hr-suite/backup.sh

set -e

APP_NAME="valt-hr-suite"
APP_DIR="/var/www/${APP_NAME}"
BACKUP_DIR="/var/backups/${APP_NAME}"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_NAME="${APP_NAME}-backup-${TIMESTAMP}"

echo "💾 Backup - ${APP_NAME}"
echo "========================"
date
echo ""

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Step 1: Backup application files
echo "📦 Step 1: Backing up application files..."
tar -czf ${BACKUP_DIR}/${BACKUP_NAME}-app.tar.gz \
    -C ${APP_DIR} \
    --exclude='node_modules' \
    --exclude='.next/cache' \
    --exclude='*.log' \
    .

APP_SIZE=$(du -sh ${BACKUP_DIR}/${BACKUP_NAME}-app.tar.gz | cut -f1)
echo "✓ Application backup created: ${BACKUP_NAME}-app.tar.gz (${APP_SIZE})"

# Step 2: Backup .env files
echo ""
echo "🔐 Step 2: Backing up environment configuration..."
if [ -f "${APP_DIR}/.env.production" ]; then
    cp ${APP_DIR}/.env.production ${BACKUP_DIR}/${BACKUP_NAME}-env.production
    chmod 600 ${BACKUP_DIR}/${BACKUP_NAME}-env.production
    echo "✓ Environment backup created"
else
    echo "⚠️  No .env.production file found"
fi

# Step 3: Backup database (if applicable)
echo ""
echo "🗄️  Step 3: Backing up database..."
# Uncomment and customize for your database:
#
# PostgreSQL example:
# if [ ! -z "$DATABASE_URL" ]; then
#     pg_dump $DATABASE_URL > ${BACKUP_DIR}/${BACKUP_NAME}-db.sql
#     gzip ${BACKUP_DIR}/${BACKUP_NAME}-db.sql
#     echo "✓ Database backup created"
# fi
#
# MySQL example:
# mysqldump -u user -p'password' database > ${BACKUP_DIR}/${BACKUP_NAME}-db.sql
# gzip ${BACKUP_DIR}/${BACKUP_NAME}-db.sql
#
echo "ℹ️  Database backup not configured (add DB dump commands if needed)"

# Step 4: Backup PM2 configuration
echo ""
echo "⚙️  Step 4: Backing up PM2 configuration..."
pm2 save > /dev/null 2>&1
if [ -f "${HOME}/.pm2/dump.pm2" ]; then
    cp ${HOME}/.pm2/dump.pm2 ${BACKUP_DIR}/${BACKUP_NAME}-pm2.dump
    echo "✓ PM2 configuration backed up"
fi

# Step 5: Create backup manifest
echo ""
echo "📝 Step 5: Creating backup manifest..."
cat > ${BACKUP_DIR}/${BACKUP_NAME}-manifest.txt <<EOF
Backup Manifest
===============
Backup Name: ${BACKUP_NAME}
Timestamp: $(date)
Hostname: $(hostname)
Application: ${APP_NAME}

Files:
- ${BACKUP_NAME}-app.tar.gz (${APP_SIZE})
- ${BACKUP_NAME}-env.production
- ${BACKUP_NAME}-pm2.dump

Application Info:
- Directory: ${APP_DIR}
- PM2 Status:
$(pm2 jlist | jq -r ".[] | select(.name==\"${APP_NAME}\") | {name, status: .pm2_env.status, uptime: .pm2_env.pm_uptime, memory: .monit.memory}")

Disk Usage:
$(df -h ${APP_DIR})

To restore:
1. Extract: tar -xzf ${BACKUP_NAME}-app.tar.gz -C /var/www/${APP_NAME}
2. Restore env: cp ${BACKUP_NAME}-env.production /var/www/${APP_NAME}/.env.production
3. Install deps: cd /var/www/${APP_NAME} && npm ci --production
4. Restart: pm2 restart ${APP_NAME}
EOF
echo "✓ Manifest created"

# Step 6: Clean old backups
echo ""
echo "🧹 Step 6: Cleaning old backups (retention: ${RETENTION_DAYS} days)..."
find ${BACKUP_DIR} -type f -name "${APP_NAME}-backup-*" -mtime +${RETENTION_DAYS} -delete
REMAINING=$(find ${BACKUP_DIR} -type f -name "${APP_NAME}-backup-*" | wc -l)
echo "✓ Old backups cleaned (${REMAINING} backups remaining)"

# Step 7: Display summary
echo ""
echo "✨ Backup complete!"
echo ""
echo "📊 Backup summary:"
ls -lh ${BACKUP_DIR}/${BACKUP_NAME}-* 2>/dev/null || echo "  (files listed above)"
echo ""
echo "📁 Backup location: ${BACKUP_DIR}"
echo "💾 Total backup size: $(du -sh ${BACKUP_DIR} | cut -f1)"
echo ""

# Optional: Upload to remote storage
# Uncomment and customize for your backup strategy:
# echo "☁️  Uploading to remote storage..."
# aws s3 cp ${BACKUP_DIR}/${BACKUP_NAME}-app.tar.gz s3://your-bucket/backups/
# rclone copy ${BACKUP_DIR}/${BACKUP_NAME}-app.tar.gz remote:backups/
# echo "✓ Remote backup uploaded"

exit 0
