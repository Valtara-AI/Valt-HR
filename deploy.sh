#!/bin/bash
# deploy.sh - Local deployment script for Valt HR Suite
# Run this from your local machine (Windows: use Git Bash or WSL)

set -e

# Configuration - EDIT THESE
DOCKER_USERNAME="YOUR_DOCKERHUB_USERNAME"  # e.g., shivam123
IMAGE_NAME="valt-hr-suite"
IMAGE_TAG="latest"
FULL_IMAGE="${DOCKER_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "🚀 Valt HR Suite - Deployment Script"
echo "===================================="
echo "Image: ${FULL_IMAGE}"
echo ""

# Step 1: Pre-deployment checks
echo "📋 Step 1: Running pre-deployment checks..."
npm run typecheck
if [ $? -ne 0 ]; then
    echo "❌ TypeScript check failed. Fix errors before deploying."
    exit 1
fi
echo "✅ TypeScript check passed"

npm test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Fix errors before deploying."
    exit 1
fi
echo "✅ Tests passed"

# Step 2: Build Next.js production bundle
echo ""
echo "🏗️  Step 2: Building Next.js production bundle..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Production build failed."
    exit 1
fi
echo "✅ Production build successful"

# Step 3: Docker login
echo ""
echo "🔐 Step 3: Docker Hub login..."
docker login
if [ $? -ne 0 ]; then
    echo "❌ Docker login failed."
    exit 1
fi

# Step 4: Build Docker image
echo ""
echo "🐳 Step 4: Building Docker image..."
docker build -t ${FULL_IMAGE} .
if [ $? -ne 0 ]; then
    echo "❌ Docker build failed."
    exit 1
fi
echo "✅ Docker image built: ${FULL_IMAGE}"

# Step 5: Test Docker image locally
echo ""
echo "🧪 Step 5: Testing Docker image locally..."
docker run --rm -d --name valt-hr-test -p 3001:3000 ${FULL_IMAGE}
sleep 5
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
    docker stop valt-hr-test
else
    echo "❌ Health check failed"
    docker stop valt-hr-test
    exit 1
fi

# Step 6: Push to Docker Hub
echo ""
echo "📤 Step 6: Pushing to Docker Hub..."
docker push ${FULL_IMAGE}
if [ $? -ne 0 ]; then
    echo "❌ Docker push failed."
    exit 1
fi
echo "✅ Image pushed successfully: ${FULL_IMAGE}"

# Step 7: Tag with timestamp for rollback capability
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
TIMESTAMPED_IMAGE="${DOCKER_USERNAME}/${IMAGE_NAME}:${TIMESTAMP}"
docker tag ${FULL_IMAGE} ${TIMESTAMPED_IMAGE}
docker push ${TIMESTAMPED_IMAGE}
echo "✅ Timestamped backup created: ${TIMESTAMPED_IMAGE}"

echo ""
echo "✨ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Copy server-setup.sh to your server or run it via SSH"
echo "2. On server: ./server-setup.sh ${FULL_IMAGE}"
echo ""
echo "To deploy now, run:"
echo "  ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'bash -s' < server-setup.sh ${FULL_IMAGE}"
