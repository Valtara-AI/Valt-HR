#!/bin/bash
# scripts/deploy-run.sh - One-command deploy from local to server

set -e

# Load configuration
source ./deploy-config.sh

echo "🚀 Full Deployment Pipeline"
echo "============================"
echo ""

# Find latest artifact
LATEST_ARTIFACT=$(ls -t ${APP_NAME}-*.tar.gz 2>/dev/null | head -n1)

if [ -z "$LATEST_ARTIFACT" ]; then
    echo "❌ No artifact found. Run ./deploy-local.sh first."
    exit 1
fi

echo "📦 Using: ${LATEST_ARTIFACT}"
echo "🎯 Target: ${SSH_USER}@${SERVER_IP}"
echo ""

# Secure SSH key
chmod 600 ${SSH_KEY}

# Upload and deploy in one command
echo "🚀 Deploying..."
echo ""

ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${SSH_USER}@${SERVER_IP} "bash -s" <<EOF
set -e

# Upload artifact
echo "📤 Receiving artifact..."
cat > /tmp/${LATEST_ARTIFACT}
echo "✓ Artifact received"

# Make deploy script executable and run it
chmod +x /tmp/deploy-remote.sh
bash /tmp/deploy-remote.sh ${LATEST_ARTIFACT}
EOF < ${LATEST_ARTIFACT}

echo ""
echo "✨ Deployment complete!"
echo ""
