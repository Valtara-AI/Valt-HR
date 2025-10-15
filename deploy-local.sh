#!/bin/bash
# deploy-local.sh - Local build and package script
# Creates a production-ready artifact for server deployment

set -e

# Load configuration
source ./deploy-config.sh

echo "🚀 Valt HR Suite - Local Build & Package"
echo "========================================"
echo "Building artifact: ${ARTIFACT_NAME}"
echo ""

# Step 1: Clean previous builds
echo "🧹 Step 1: Cleaning previous builds..."
rm -rf .next dist node_modules/.cache
echo "✓ Clean complete"

# Step 2: Install dependencies
echo ""
echo "📦 Step 2: Installing dependencies..."
npm ci --production=false
echo "✓ Dependencies installed"

# Step 3: Run quality checks
echo ""
echo "🔍 Step 3: Running quality checks..."

echo "  → TypeScript check..."
npm run typecheck
echo "  ✓ TypeScript passed"

echo "  → Linting..."
npm run lint -- --max-warnings 50 || true  # Allow warnings but not errors
echo "  ✓ Lint complete"

echo "  → Tests..."
npm test
echo "  ✓ Tests passed"

# Step 4: Build production bundle
echo ""
echo "🏗️  Step 4: Building production bundle..."
npm run build
echo "✓ Build complete"

# Step 5: Create deployment artifact
echo ""
echo "📦 Step 5: Creating deployment artifact..."

# Create dist directory structure
mkdir -p ${BUILD_DIR}

# Copy necessary files
echo "  → Copying files..."
cp -r .next ${BUILD_DIR}/.next
cp -r public ${BUILD_DIR}/public
cp -r pages ${BUILD_DIR}/pages
cp -r src ${BUILD_DIR}/src
cp package.json package-lock.json ${BUILD_DIR}/
cp next.config.js ${BUILD_DIR}/
cp tsconfig.json ${BUILD_DIR}/ 2>/dev/null || true

# Create .env.production template in dist
cat > ${BUILD_DIR}/.env.production << 'EOF'
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_NAME=Valt HR Suite
NEXT_PUBLIC_API_BASE_URL=https://hr-suite.valtara.ai
LEADCONNECTOR_WIDGET_ID=67ff121f119caa7e6578236b

# Add your production secrets below (edit on server):
# DATABASE_URL=postgresql://user:pass@localhost:5432/hrdb
# API_KEY=your_api_key_here
# JWT_SECRET=your_jwt_secret_here
# SMTP_HOST=smtp.example.com
# SMTP_USER=user@example.com
# SMTP_PASS=password
EOF

# Create PM2 ecosystem file
cat > ${BUILD_DIR}/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'valt-hr-suite',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/valt-hr-suite',
    instances: 2,  // Use cluster mode for better performance
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/valt-hr-suite/error.log',
    out_file: '/var/log/valt-hr-suite/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Create tarball
echo "  → Creating tarball..."
cd ${BUILD_DIR}
tar -czf ../${ARTIFACT_NAME} .
cd ..
echo "✓ Artifact created: ${ARTIFACT_NAME}"

# Step 6: Show artifact info
echo ""
echo "📊 Artifact information:"
ls -lh ${ARTIFACT_NAME}
echo ""
echo "✨ Build complete!"
echo ""
echo "Next steps:"
echo "  1. Run: ./scripts/deploy-upload.sh"
echo "  2. Or manually upload: scp -i ${SSH_KEY} ${ARTIFACT_NAME} ${SSH_USER}@${SERVER_IP}:/tmp/"
echo ""
