
# Valt HR Suite

AI-powered HR and recruitment platform built with Next.js, TypeScript, and React.

## Quick Start

### Development

```bash
# Install dependencies
npm ci

# Run development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Deployment

**📖 Full deployment guide:** See [README-DEPLOY-OPS.md](./README-DEPLOY-OPS.md)

### Recommended: nginx + PM2 Deployment

This is the **official production deployment method** using nginx as reverse proxy and PM2 for process management.

**Quick deployment:**

```bash
# 1. Configure deployment variables
nano deploy-config.sh

# 2. Build artifact
./deploy-local.sh

# 3. Bootstrap server (one-time)
ssh -i ./ubuntu-ky.pem ubuntu@91.98.203.231 'bash -s' < scripts/server-bootstrap.sh

# 4. Deploy
./scripts/deploy-upload.sh
ssh -i ./ubuntu-ky.pem ubuntu@91.98.203.231 'bash /tmp/deploy-remote.sh valt-hr-suite-*.tar.gz'

# 5. Setup SSL (after DNS)
ssh -i ./ubuntu-ky.pem ubuntu@91.98.203.231 'bash /tmp/setup-ssl.sh'
```

**Features:**
- ✅ Zero-downtime deployments with PM2 cluster mode
- ✅ Automatic SSL certificate management (Let's Encrypt)
- ✅ nginx reverse proxy with optimized caching
- ✅ Automated health checks and auto-restart
- ✅ Built-in backup and rollback procedures
- ✅ GitHub Actions CI/CD workflow included

## Health Check

The application exposes a health endpoint for load balancers and monitoring:

```bash
# Local
curl http://localhost:3000/api/health

# Production
curl https://hr-suite.valtara.ai/api/health
```
