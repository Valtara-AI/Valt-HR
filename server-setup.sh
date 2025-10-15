#!/bin/bash
# server-setup.sh - Server-side setup and deployment script
# Run this on your server (91.98.203.231) as ubuntu user

set -e

IMAGE="${1:-shivam/valt-hr-suite:latest}"
CONTAINER_NAME="valt-hr-suite"
ENV_FILE="/home/ubuntu/.env.production"

echo "🚀 Valt HR Suite - Server Setup"
echo "================================"
echo "Image: ${IMAGE}"
echo ""

# Step 1: Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "📦 Docker not found. Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    
    # Add Docker's official GPG key
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Set up repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    echo "✅ Docker installed. You may need to log out and back in for group changes to take effect."
else
    echo "✅ Docker is already installed"
fi

# Step 2: Create environment file if it doesn't exist
if [ ! -f "${ENV_FILE}" ]; then
    echo ""
    echo "📝 Creating environment file at ${ENV_FILE}..."
    cat > ${ENV_FILE} << 'EOF'
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_NAME=Valt HR Suite
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
LEADCONNECTOR_WIDGET_ID=67ff121f119caa7e6578236b
# Add your secrets below:
# DATABASE_URL=
# API_KEY=
# JWT_SECRET=
EOF
    chmod 600 ${ENV_FILE}
    echo "✅ Environment file created. Please edit ${ENV_FILE} with your secrets."
    echo "⚠️  Required: Update the secrets in ${ENV_FILE} before proceeding!"
    read -p "Press Enter when you've updated the environment file..."
else
    echo "✅ Environment file exists at ${ENV_FILE}"
fi

# Step 3: Pull latest image
echo ""
echo "📥 Pulling Docker image..."
docker pull ${IMAGE}
if [ $? -ne 0 ]; then
    echo "❌ Failed to pull image. Check Docker Hub credentials and image name."
    exit 1
fi
echo "✅ Image pulled successfully"

# Step 4: Stop and remove existing container
echo ""
echo "🛑 Stopping existing container (if any)..."
docker stop ${CONTAINER_NAME} 2>/dev/null || true
docker rm ${CONTAINER_NAME} 2>/dev/null || true
echo "✅ Old container removed"

# Step 5: Run new container
echo ""
echo "🚀 Starting new container..."
docker run -d \
  --name ${CONTAINER_NAME} \
  --env-file ${ENV_FILE} \
  -p 3000:3000 \
  --restart unless-stopped \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  ${IMAGE}

if [ $? -ne 0 ]; then
    echo "❌ Failed to start container"
    exit 1
fi
echo "✅ Container started"

# Step 6: Wait and check health
echo ""
echo "⏳ Waiting for application to start..."
sleep 10

if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "⚠️  Health check failed. Checking logs..."
    docker logs --tail 50 ${CONTAINER_NAME}
    exit 1
fi

# Step 7: Display status
echo ""
echo "✨ Deployment successful!"
echo ""
echo "Container status:"
docker ps --filter name=${CONTAINER_NAME}
echo ""
echo "To view logs:"
echo "  docker logs -f ${CONTAINER_NAME}"
echo ""
echo "To restart:"
echo "  docker restart ${CONTAINER_NAME}"
echo ""
echo "To stop:"
echo "  docker stop ${CONTAINER_NAME}"
echo ""
echo "Application is running on:"
echo "  http://localhost:3000"
echo "  http://91.98.203.231:3000 (external)"
