#!/bin/bash
# scripts/deploy-remote.sh - Server-side deployment script (idempotent)
# Run this on the server after uploading the artifact

set -e

ARTIFACT_NAME="${1}"
APP_NAME="valt-hr-suite"
APP_DIR="/var/www/${APP_NAME}"
APP_PORT="3000"
PM2_NAME="${APP_NAME}"

if [ -z "$ARTIFACT_NAME" ]; then
    echo "❌ Usage: $0 <artifact-name.tar.gz>"
    exit 1
fi

echo "🚀 Remote Deployment - ${APP_NAME}"
echo "=================================="
echo "Artifact: ${ARTIFACT_NAME}"
echo ""

# Step 1: Backup current deployment
if [ -d "${APP_DIR}" ]; then
    echo "💾 Step 1: Backing up current deployment..."
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    BACKUP_DIR="${APP_DIR}.backup-${TIMESTAMP}"
    cp -r ${APP_DIR} ${BACKUP_DIR}
    echo "✓ Backup created: ${BACKUP_DIR}"
    echo "  Keep this for quick rollback if needed"
else
    echo "ℹ️  Step 1: No existing deployment found (first deploy)"
fi

# Step 2: Create/clean app directory
echo ""
echo "📁 Step 2: Preparing app directory..."
mkdir -p ${APP_DIR}
rm -rf ${APP_DIR}/*
echo "✓ Directory ready: ${APP_DIR}"

# Step 3: Extract artifact
echo ""
echo "📦 Step 3: Extracting artifact..."
tar -xzf /tmp/${ARTIFACT_NAME} -C ${APP_DIR}
echo "✓ Artifact extracted"

# Step 4: Install production dependencies
echo ""
echo "📦 Step 4: Installing production dependencies..."
cd ${APP_DIR}
npm ci --production --ignore-scripts
echo "✓ Dependencies installed"

# Step 5: Ensure .env.production exists with user prompt
echo ""
echo "⚙️  Step 5: Checking environment configuration..."
if [ ! -f "${APP_DIR}/.env.production" ] || [ ! -s "${APP_DIR}/.env.production" ]; then
    echo "⚠️  .env.production is missing or empty"
    echo "   A template has been created. Please edit it with your secrets:"
    echo "   nano ${APP_DIR}/.env.production"
    echo ""
    read -p "Press Enter after you've configured the environment file..."
fi
chmod 600 ${APP_DIR}/.env.production
echo "✓ Environment configuration ready"

# Step 6: Create log directory
echo ""
echo "📝 Step 6: Setting up logging..."
sudo mkdir -p /var/log/${APP_NAME}
sudo chown -R $USER:$USER /var/log/${APP_NAME}
echo "✓ Log directory ready"

# Step 7: PM2 deployment
echo ""
echo "🔄 Step 7: Deploying with PM2..."

# Check if app is already running
if pm2 describe ${PM2_NAME} > /dev/null 2>&1; then
    echo "  → Reloading existing PM2 process..."
    pm2 reload ${PM2_NAME} --update-env
else
    echo "  → Starting new PM2 process..."
    pm2 start ecosystem.config.js --env production
fi

pm2 save
echo "✓ PM2 deployment complete"

# Step 8: Wait and health check
echo ""
echo "⏳ Step 8: Waiting for application startup..."
sleep 5

if curl -f http://localhost:${APP_PORT}/api/health > /dev/null 2>&1; then
    echo "✓ Health check passed!"
else
    echo "⚠️  Health check failed. Checking logs..."
    pm2 logs ${PM2_NAME} --lines 30 --nostream
    echo ""
    echo "❌ Deployment may have issues. Check logs above."
    exit 1
fi

# Step 9: Display status
echo ""
echo "✨ Deployment successful!"
echo ""
echo "📊 Application status:"
pm2 status
echo ""
echo "🔗 Application URLs:"
echo "  Local: http://localhost:${APP_PORT}"
echo "  External: http://$(curl -s ifconfig.me):${APP_PORT}"
echo ""
echo "📝 View logs:"
echo "  pm2 logs ${PM2_NAME}"
echo "  pm2 logs ${PM2_NAME} --lines 100"
echo ""
echo "🔄 Management commands:"
echo "  pm2 restart ${PM2_NAME}  - Restart app"
echo "  pm2 stop ${PM2_NAME}     - Stop app"
echo "  pm2 reload ${PM2_NAME}   - Zero-downtime reload"
echo "  pm2 monit                - Monitor resources"
echo ""
echo "🎯 Next steps:"
echo "  1. Configure nginx reverse proxy (if not done)"
echo "  2. Set up SSL certificate with certbot"
echo "  3. Test domain access"
echo ""
