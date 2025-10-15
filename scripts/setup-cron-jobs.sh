#!/bin/bash
# scripts/setup-cron-jobs.sh - Configure automated monitoring and backups

set -e

APP_NAME="valt-hr-suite"
APP_DIR="/var/www/${APP_NAME}"

echo "⏰ Setting up cron jobs"
echo "======================="
echo ""

# Backup existing crontab
crontab -l > /tmp/crontab.backup 2>/dev/null || true

# Create new crontab entries
cat > /tmp/crontab.new << 'EOF'
# Valt HR Suite - Automated Jobs

# Health check every 5 minutes
*/5 * * * * /var/www/valt-hr-suite/scripts/health-check.sh >> /var/log/valt-hr-suite/health-check.log 2>&1

# Daily backup at 2 AM
0 2 * * * /var/www/valt-hr-suite/scripts/backup.sh >> /var/log/valt-hr-suite/backup.log 2>&1

# Weekly system updates (Sunday at 3 AM)
0 3 * * 0 sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get autoremove -y >> /var/log/system-update.log 2>&1

# PM2 log rotation (daily)
0 0 * * * pm2 flush

# SSL certificate renewal check (twice daily)
0 0,12 * * * sudo certbot renew --quiet --post-hook "systemctl reload nginx"

EOF

# Merge with existing crontab if it exists
if [ -s /tmp/crontab.backup ]; then
    echo "📋 Existing crontab found. Merging..."
    cat /tmp/crontab.backup /tmp/crontab.new | sort -u > /tmp/crontab.merged
    crontab /tmp/crontab.merged
else
    echo "📋 Installing new crontab..."
    crontab /tmp/crontab.new
fi

# Cleanup
rm -f /tmp/crontab.new /tmp/crontab.backup /tmp/crontab.merged

echo ""
echo "✓ Cron jobs installed"
echo ""
echo "📊 Current crontab:"
crontab -l
echo ""
echo "✨ Setup complete!"
echo ""
echo "To verify:"
echo "  crontab -l                    # List all cron jobs"
echo "  tail -f /var/log/valt-hr-suite/health-check.log"
echo "  tail -f /var/log/valt-hr-suite/backup.log"
echo ""
