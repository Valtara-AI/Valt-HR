#!/bin/bash
# scripts/health-check.sh - Application health check script
# Can be run via cron or monitoring service

set -e

APP_NAME="valt-hr-suite"
APP_PORT="3000"
PM2_NAME="${APP_NAME}"
HEALTH_ENDPOINT="http://localhost:${APP_PORT}/api/health"
MAX_RETRIES=3
RETRY_DELAY=5

echo "🏥 Health Check - ${APP_NAME}"
echo "=============================="
date
echo ""

# Function to check health endpoint
check_health() {
    if curl -f -s --max-time 10 ${HEALTH_ENDPOINT} > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to check PM2 process
check_pm2() {
    if pm2 describe ${PM2_NAME} > /dev/null 2>&1; then
        STATUS=$(pm2 jlist | jq -r ".[] | select(.name==\"${PM2_NAME}\") | .pm2_env.status")
        if [ "$STATUS" = "online" ]; then
            return 0
        fi
    fi
    return 1
}

# Check PM2 process status
echo "📊 Checking PM2 process..."
if check_pm2; then
    echo "✓ PM2 process is online"
else
    echo "❌ PM2 process is not running!"
    echo "  Attempting to start..."
    cd /var/www/${APP_NAME}
    pm2 start ecosystem.config.js --env production
    pm2 save
    sleep 5
fi

# Check health endpoint with retries
echo ""
echo "🔍 Checking health endpoint..."
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if check_health; then
        echo "✓ Health check passed!"
        echo ""
        echo "📊 PM2 Status:"
        pm2 status ${PM2_NAME}
        exit 0
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo "⚠️  Health check failed (attempt $RETRY_COUNT/$MAX_RETRIES)"
            echo "  Waiting ${RETRY_DELAY}s before retry..."
            sleep $RETRY_DELAY
        fi
    fi
done

# Health check failed after retries
echo "❌ Health check failed after $MAX_RETRIES attempts!"
echo ""
echo "🔄 Attempting automatic recovery..."

# Try restarting PM2 process
echo "  → Restarting PM2 process..."
pm2 restart ${PM2_NAME}
sleep 10

# Final health check
if check_health; then
    echo "✓ Recovery successful!"
    echo ""
    echo "📧 Sending recovery notification..."
    # Add notification logic here (email, Slack, etc.)
    exit 0
else
    echo "❌ Recovery failed!"
    echo ""
    echo "📝 Recent logs:"
    pm2 logs ${PM2_NAME} --lines 50 --nostream
    echo ""
    echo "⚠️  ALERT: Manual intervention required!"
    echo ""
    # Add critical alert notification here
    exit 1
fi
