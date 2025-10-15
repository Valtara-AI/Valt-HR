#!/bin/bash
# scripts/deploy-upload.sh - Upload artifact and configs to server

set -e

# Load configuration
source ./deploy-config.sh

echo "📤 Upload Deployment Artifact"
echo "=============================="
echo "Target: ${SSH_USER}@${SERVER_IP}"
echo ""

# Find the latest artifact
LATEST_ARTIFACT=$(ls -t ${APP_NAME}-*.tar.gz 2>/dev/null | head -n1)

if [ -z "$LATEST_ARTIFACT" ]; then
    echo "❌ No artifact found. Run ./deploy-local.sh first."
    exit 1
fi

echo "📦 Using artifact: ${LATEST_ARTIFACT}"
echo ""

# Secure SSH key permissions
chmod 600 ${SSH_KEY}

# Upload artifact
echo "📤 Uploading artifact..."
scp -i ${SSH_KEY} -o StrictHostKeyChecking=no ${LATEST_ARTIFACT} ${SSH_USER}@${SERVER_IP}:/tmp/
echo "✓ Artifact uploaded"

# Upload deployment scripts
echo ""
echo "📤 Uploading deployment scripts..."
scp -i ${SSH_KEY} -o StrictHostKeyChecking=no scripts/deploy-remote.sh ${SSH_USER}@${SERVER_IP}:/tmp/
scp -i ${SSH_KEY} -o StrictHostKeyChecking=no scripts/health-check.sh ${SSH_USER}@${SERVER_IP}:/tmp/
scp -i ${SSH_KEY} -o StrictHostKeyChecking=no scripts/backup.sh ${SSH_USER}@${SERVER_IP}:/tmp/
scp -i ${SSH_KEY} -o StrictHostKeyChecking=no scripts/rollback.sh ${SSH_USER}@${SERVER_IP}:/tmp/
echo "✓ Scripts uploaded"

# Upload nginx configuration
echo ""
echo "📤 Uploading nginx configuration..."
scp -i ${SSH_KEY} -o StrictHostKeyChecking=no nginx/site.conf ${SSH_USER}@${SERVER_IP}:/tmp/nginx-site.conf
echo "✓ Nginx config uploaded"

echo ""
echo "✨ Upload complete!"
echo ""
echo "🎯 Next steps:"
echo "  Run remote deployment:"
echo "    ssh -i ${SSH_KEY} ${SSH_USER}@${SERVER_IP} \"bash /tmp/deploy-remote.sh ${LATEST_ARTIFACT}\""
echo ""
echo "  Or use the one-liner:"
echo "    ./scripts/deploy-run.sh"
echo ""
