## Deployment & Operations Guide

Complete guide for deploying and maintaining the Valt HR Suite application using nginx + PM2 (Docker-free deployment).

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Configuration](#configuration)
4. [Initial Server Setup](#initial-server-setup)
5. [DNS Configuration](#dns-configuration)
6. [Application Deployment](#application-deployment)
7. [SSL Certificate Setup](#ssl-certificate-setup)
8. [Monitoring & Health Checks](#monitoring--health-checks)
9. [Backup & Restore](#backup--restore)
10. [Rollback Procedures](#rollback-procedures)
11. [CI/CD Automation](#cicd-automation)
12. [Troubleshooting](#troubleshooting)
13. [Security Hardening](#security-hardening)

---

## Quick Start

For experienced operators, here's the express deployment flow:

```bash
# 1. Configure deployment variables
nano deploy-config.sh  # Edit DOMAIN, SERVER_IP, EMAIL

# 2. Build locally
./deploy-local.sh

# 3. Bootstrap server (one-time)
ssh -i ./ubuntu-ky.pem ubuntu@91.98.203.231 'bash -s' < scripts/server-bootstrap.sh

# 4. Deploy
./scripts/deploy-upload.sh
ssh -i ./ubuntu-ky.pem ubuntu@91.98.203.231 'bash /tmp/deploy-remote.sh valt-hr-suite-*.tar.gz'

# 5. Setup SSL (after DNS)
ssh -i ./ubuntu-ky.pem ubuntu@91.98.203.231 'bash /tmp/setup-ssl.sh'
```

---

## Prerequisites

### Local Machine
- Node.js 20+ (`node -v`)
- npm 9+ (`npm -v`)
- Git
- SSH client
- Bash shell (Git Bash for Windows, native for Linux/Mac)

### Server Requirements
- Ubuntu 20.04 LTS or 22.04 LTS
- 2+ GB RAM
- 20+ GB disk space
- Public IP address
- Root or sudo access
- SSH access with private key

---

## Configuration

### 1. Edit Deployment Variables

Edit `deploy-config.sh` with your site-specific values:

```bash
# Domain configuration
export DOMAIN="hr-suite.valtara.ai"
export WWW_DOMAIN="www.hr-suite.valtara.ai"
export EMAIL="ops@valtara.ai"

# Server configuration
export SERVER_IP="91.98.203.231"
export SSH_USER="ubuntu"
export SSH_KEY="./ubuntu-ky.pem"

# Application configuration
export APP_NAME="valt-hr-suite"
export APP_PORT="3000"
```

### 2. Secure SSH Key

```bash
# Windows (Git Bash)
chmod 600 ubuntu-ky.pem

# Verify key works
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 echo "Connection successful"
```

---

## Initial Server Setup

Run this **once per server** to install all required dependencies:

```bash
# Option 1: Run remotely via SSH
ssh -i ./ubuntu-ky.pem ubuntu@91.98.203.231 'bash -s' < scripts/server-bootstrap.sh

# Option 2: Copy and run on server
scp -i ./ubuntu-ky.pem scripts/server-bootstrap.sh ubuntu@91.98.203.231:~/
ssh -i ./ubuntu-ky.pem ubuntu@91.98.203.231
chmod +x server-bootstrap.sh
./server-bootstrap.sh
```

**What it installs:**
- Node.js 20.x
- npm
- PM2 (process manager)
- Nginx (reverse proxy)
- Certbot (SSL certificates)
- UFW (firewall)
- fail2ban (security)

**Post-bootstrap verification:**
```bash
ssh -i ./ubuntu-ky.pem ubuntu@91.98.203.231

# Check versions
node -v        # Should be v20.x
pm2 -v         # Should be installed
nginx -v       # Should be installed
certbot --version  # Should be installed

# Check firewall
sudo ufw status  # Should show: Status: active
```

---

## DNS Configuration

**CRITICAL:** Configure DNS **before** requesting SSL certificates.

### 1. Add DNS Records

In your DNS provider (Cloudflare, Route53, etc.), add:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | hr-suite.valtara.ai | 91.98.203.231 | 300 |
| A | www.hr-suite.valtara.ai | 91.98.203.231 | 300 |

### 2. Verify DNS Propagation

```bash
# Check from local machine
dig +short hr-suite.valtara.ai
# Should return: 91.98.203.231

nslookup hr-suite.valtara.ai
# Should show your server IP

# Online tools
# https://dnschecker.org
```

**Wait 5-10 minutes** for DNS to propagate before proceeding to SSL setup.

---

## Application Deployment

### Step 1: Build Locally

```bash
# From project root
./deploy-local.sh
```

This will:
1. Clean previous builds
2. Install dependencies
3. Run typecheck, lint, tests
4. Build Next.js production bundle
5. Create deployment artifact (`.tar.gz`)
6. Generate PM2 ecosystem config
7. Create `.env.production` template

**Expected output:**
```
✨ Build complete!
📊 Artifact information:
-rw-r--r-- 1 user user 45M Oct 15 10:30 valt-hr-suite-20251015-103045.tar.gz
```

### Step 2: Upload to Server

```bash
./scripts/deploy-upload.sh
```

This uploads:
- Application artifact
- Deployment scripts
- Nginx configuration

### Step 3: Deploy on Server

```bash
# Using the uploaded remote script
ssh -i ./ubuntu-ky.pem ubuntu@91.98.203.231 'bash /tmp/deploy-remote.sh valt-hr-suite-20251015-103045.tar.gz'

# Or one-command deploy (combines upload + deploy)
./scripts/deploy-run.sh
```

**The deploy script will:**
1. ✅ Backup current deployment
2. ✅ Extract artifact
3. ✅ Install production dependencies
4. ✅ Prompt for `.env.production` configuration
5. ✅ Start/reload PM2 process
6. ✅ Run health check

### Step 4: Configure Environment

On **first deployment**, edit production secrets on the server:

```bash
ssh -i ./ubuntu-ky.pem ubuntu@91.98.203.231
nano /var/www/valt-hr-suite/.env.production
```

Add your secrets:
```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_NAME=Valt HR Suite
NEXT_PUBLIC_API_BASE_URL=https://hr-suite.valtara.ai
LEADCONNECTOR_WIDGET_ID=67ff121f119caa7e6578236b

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/hrdb

# Authentication
JWT_SECRET=your_secure_random_string_here
API_KEY=your_api_key_here

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

Save and restart:
```bash
pm2 restart valt-hr-suite
```

### Step 5: Configure Nginx

```bash
# Copy nginx config
sudo cp /tmp/nginx-site.conf /etc/nginx/sites-available/hr-suite.valtara.ai
sudo ln -sf /etc/nginx/sites-available/hr-suite.valtara.ai /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Step 6: Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs valt-hr-suite --lines 50

# Test locally
curl http://localhost:3000/api/health

# Test externally (HTTP, before SSL)
curl http://91.98.203.231:3000/api/health
```

---

## SSL Certificate Setup

**Prerequisites:**
- DNS records configured and propagated
- Nginx running
- Application responding on localhost:3000

### 1. Run SSL Setup Script

```bash
ssh -i ./ubuntu-ky.pem ubuntu@91.98.203.231 'bash /tmp/setup-ssl.sh'
```

This will:
1. ✅ Verify DNS configuration
2. ✅ Configure nginx
3. ✅ Obtain Let's Encrypt certificate
4. ✅ Enable HTTPS redirect
5. ✅ Test automatic renewal
6. ✅ Reload nginx with SSL

### 2. Verify SSL Certificate

```bash
# Test HTTPS
curl -I https://hr-suite.valtara.ai

# Check certificate
openssl s_client -connect hr-suite.valtara.ai:443 -servername hr-suite.valtara.ai < /dev/null | openssl x509 -noout -dates

# Online SSL test
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=hr-suite.valtara.ai
```

### 3. Verify Auto-Renewal

```bash
# Test renewal (dry-run)
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer

# Manually renew (if needed)
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

**Certificate expires after 90 days.** Certbot auto-renews at day 60.

---

## Monitoring & Health Checks

### Manual Health Check

```bash
ssh -i ./ubuntu-ky.pem ubuntu@91.98.203.231
bash /var/www/valt-hr-suite/scripts/health-check.sh
```

### Automated Health Check (Cron)

```bash
# Add to crontab
crontab -e

# Check every 5 minutes
*/5 * * * * /var/www/valt-hr-suite/scripts/health-check.sh >> /var/log/valt-hr-suite/health-check.log 2>&1
```

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs valt-hr-suite

# Follow logs
pm2 logs valt-hr-suite -f

# Check memory/CPU
pm2 status
pm2 show valt-hr-suite
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/hr-suite.valtara.ai.access.log

# Error logs
sudo tail -f /var/log/nginx/hr-suite.valtara.ai.error.log

# Analyze traffic
sudo cat /var/log/nginx/hr-suite.valtara.ai.access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -20
```

---

## Backup & Restore

### Manual Backup

```bash
ssh -i ./ubuntu-ky.pem ubuntu@91.98.203.231
bash /var/www/valt-hr-suite/scripts/backup.sh
```

**Backs up:**
- Application files
- `.env.production`
- PM2 configuration
- (Optionally) Database

### Automated Backups (Cron)

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /var/www/valt-hr-suite/scripts/backup.sh >> /var/log/valt-hr-suite/backup.log 2>&1
```

### Restore from Backup

```bash
# List available backups
ls -lh /var/backups/valt-hr-suite/

# Extract specific backup
cd /var/www/valt-hr-suite
tar -xzf /var/backups/valt-hr-suite/valt-hr-suite-backup-20251015-020000-app.tar.gz

# Restore environment
cp /var/backups/valt-hr-suite/valt-hr-suite-backup-20251015-020000-env.production .env.production

# Reinstall dependencies
npm ci --production

# Restart
pm2 restart valt-hr-suite
```

---

## Rollback Procedures

### Quick Rollback (Last Deployment)

```bash
ssh -i ./ubuntu-ky.pem ubuntu@91.98.203.231
bash /var/www/valt-hr-suite/scripts/rollback.sh
```

This automatically:
1. Stops current application
2. Backs up current state
3. Restores previous deployment
4. Reinstalls dependencies
5. Restarts application
6. Runs health check

### Manual Rollback

```bash
# Find backup directories
ls -ltd /var/www/valt-hr-suite.backup-*

# Choose backup
BACKUP_DIR="/var/www/valt-hr-suite.backup-20251015-103000"

# Stop app
pm2 stop valt-hr-suite

# Backup current (just in case)
cp -r /var/www/valt-hr-suite /var/www/valt-hr-suite.backup-before-rollback

# Rollback
rm -rf /var/www/valt-hr-suite/*
cp -r ${BACKUP_DIR}/* /var/www/valt-hr-suite/
cd /var/www/valt-hr-suite
npm ci --production

# Restart
pm2 restart valt-hr-suite
pm2 save

# Verify
curl http://localhost:3000/api/health
```

---

## CI/CD Automation

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: |
          npm run typecheck
          npm run lint
          npm test
          
      - name: Build production
        run: npm run build
        
      - name: Create deployment artifact
        run: |
          mkdir -p dist
          cp -r .next dist/
          cp -r public dist/
          cp -r pages dist/
          cp -r src dist/
          cp package*.json dist/
          cp next.config.js dist/
          cd dist && tar -czf ../valt-hr-suite-${{ github.sha }}.tar.gz .
          
      - name: Configure SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H ${{ secrets.SERVER_IP }} >> ~/.ssh/known_hosts
          
      - name: Upload artifact
        run: |
          scp -i ~/.ssh/deploy_key valt-hr-suite-${{ github.sha }}.tar.gz ${{ secrets.DEPLOY_USER }}@${{ secrets.SERVER_IP }}:/tmp/
          
      - name: Deploy on server
        run: |
          ssh -i ~/.ssh/deploy_key ${{ secrets.DEPLOY_USER }}@${{ secrets.SERVER_IP }} << 'EOF'
            cd /var/www/valt-hr-suite
            pm2 stop valt-hr-suite
            tar -xzf /tmp/valt-hr-suite-${{ github.sha }}.tar.gz
            npm ci --production
            pm2 restart valt-hr-suite
            pm2 save
          EOF
          
      - name: Health check
        run: |
          sleep 10
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://hr-suite.valtara.ai/api/health)
          if [ $STATUS -ne 200 ]; then
            echo "Health check failed with status $STATUS"
            exit 1
          fi
```

### Required GitHub Secrets

Add these to your repository settings → Secrets:

- `SSH_PRIVATE_KEY`: Content of `ubuntu-ky.pem`
- `SERVER_IP`: `91.98.203.231`
- `DEPLOY_USER`: `ubuntu`

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs valt-hr-suite --lines 100

# Common issues:
# 1. Port 3000 already in use
sudo lsof -i :3000
# Kill process: sudo kill -9 <PID>

# 2. Missing dependencies
cd /var/www/valt-hr-suite
npm ci --production

# 3. Environment variables
cat .env.production  # Verify file exists and has content
```

### Nginx 502 Bad Gateway

```bash
# Check if app is running
pm2 status valt-hr-suite

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Test app directly
curl http://localhost:3000/api/health

# Restart nginx
sudo systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Check certificate
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal
sudo systemctl reload nginx

# If expired, delete and recreate
sudo certbot delete --cert-name hr-suite.valtara.ai
bash /tmp/setup-ssl.sh
```

### High Memory Usage

```bash
# Check PM2 processes
pm2 status

# Restart specific app
pm2 restart valt-hr-suite

# Reduce PM2 instances
nano /var/www/valt-hr-suite/ecosystem.config.js
# Change: instances: 1
pm2 reload ecosystem.config.js
```

### Can't SSH to Server

```bash
# Verify key permissions
ls -l ubuntu-ky.pem
chmod 600 ubuntu-ky.pem

# Test connection
ssh -v -i ubuntu-ky.pem ubuntu@91.98.203.231

# Check firewall (from server console/VNC)
sudo ufw status
sudo ufw allow ssh
```

---

## Security Hardening

### 1. SSH Security

```bash
# Disable password authentication
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
# Set: PermitRootLogin no
sudo systemctl restart sshd

# Change SSH port (optional)
# Set: Port 2222
sudo ufw allow 2222/tcp
sudo systemctl restart sshd
```

### 2. Firewall Rules

```bash
# Review current rules
sudo ufw status verbose

# Only allow necessary ports
sudo ufw default deny incoming
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 3. fail2ban Configuration

```bash
# Check status
sudo systemctl status fail2ban

# View banned IPs
sudo fail2ban-client status sshd

# Unban IP
sudo fail2ban-client set sshd unbanip 1.2.3.4
```

### 4. Regular Updates

```bash
# Create update script
cat > /home/ubuntu/update-system.sh << 'EOF'
#!/bin/bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get autoremove -y
sudo npm update -g pm2
sudo certbot renew --quiet
EOF

chmod +x /home/ubuntu/update-system.sh

# Schedule weekly updates
crontab -e
# Add: 0 3 * * 0 /home/ubuntu/update-system.sh >> /var/log/system-update.log 2>&1
```

### 5. Environment Secrets

```bash
# Never commit .env files
# Ensure .gitignore includes:
.env*
!.env.example
*.pem
*.key
```

---

## Summary Checklist

### Initial Setup (One-time)
- [ ] Configure `deploy-config.sh`
- [ ] Secure SSH key (`chmod 600`)
- [ ] Run `server-bootstrap.sh` on server
- [ ] Configure DNS A records
- [ ] Verify DNS propagation

### Each Deployment
- [ ] Run `./deploy-local.sh` (build artifact)
- [ ] Run `./scripts/deploy-upload.sh` (upload to server)
- [ ] SSH and run `/tmp/deploy-remote.sh <artifact>`
- [ ] Configure `.env.production` (first time only)
- [ ] Run health check
- [ ] Monitor logs

### SSL Setup (One-time, after DNS)
- [ ] Run `setup-ssl.sh`
- [ ] Verify HTTPS access
- [ ] Test SSL grade (ssllabs.com)
- [ ] Verify auto-renewal

### Ongoing Operations
- [ ] Set up automated backups (cron)
- [ ] Set up health checks (cron)
- [ ] Monitor PM2 logs
- [ ] Review nginx logs weekly
- [ ] Test rollback procedure
- [ ] Update system packages monthly

---

## Quick Reference Commands

```bash
# Build & deploy (full flow)
./deploy-local.sh && ./scripts/deploy-upload.sh && ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'bash /tmp/deploy-remote.sh valt-hr-suite-*.tar.gz'

# Check status
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'pm2 status && curl http://localhost:3000/api/health'

# View logs
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'pm2 logs valt-hr-suite --lines 50'

# Restart app
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'pm2 restart valt-hr-suite'

# Rollback
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'bash /var/www/valt-hr-suite/scripts/rollback.sh'

# Backup
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'bash /var/www/valt-hr-suite/scripts/backup.sh'

# SSL renew
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'sudo certbot renew && sudo systemctl reload nginx'
```

---

## Support & Maintenance

For issues or questions:
1. Check logs first: `pm2 logs`, nginx logs
2. Review troubleshooting section above
3. Verify DNS/SSL configuration
4. Test health endpoint
5. Check server resources (disk, memory, CPU)

---

**Last Updated:** October 2025  
**Deployment Method:** nginx + PM2 (Docker-free)  
**Target Domain:** hr-suite.valtara.ai  
**Server:** 91.98.203.231
