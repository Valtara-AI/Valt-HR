# Deployment Quick Reference

## Your Configuration

```
Domain:      hr-suite.valtara.ai
Server IP:   91.98.203.231
SSH User:    ubuntu
SSH Key:     ubuntu-ky.pem
App Port:    3000
Email:       ops@valtara.ai
```

---

## Step-by-Step Deployment Commands

### 1. One-Time Server Bootstrap

Run this once to install Node.js, nginx, PM2, Certbot, etc:

```bash
# From your local machine (project root)
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'bash -s' < scripts/server-bootstrap.sh
```

**What it does:**
- Installs Node.js 20, npm, PM2, nginx, Certbot
- Configures firewall (UFW)
- Installs fail2ban for SSH protection
- Creates app directories

---

### 2. Configure DNS (Do Before SSL Setup)

In your DNS provider, add these A records:

| Type | Name | Value |
|------|------|-------|
| A | hr-suite.valtara.ai | 91.98.203.231 |
| A | www.hr-suite.valtara.ai | 91.98.203.231 |

**Verify DNS propagation:**

```bash
dig +short hr-suite.valtara.ai
# Should return: 91.98.203.231

# Wait 5-10 minutes for propagation
```

---

### 3. Build & Deploy Application

#### Build locally:

```bash
# Make scripts executable
chmod +x deploy-local.sh deploy-config.sh
chmod +x scripts/*.sh

# Build production artifact
./deploy-local.sh
```

#### Upload to server:

```bash
./scripts/deploy-upload.sh
```

#### Deploy on server:

```bash
# Find the artifact name from deploy-local.sh output
# Example: valt-hr-suite-20251015-103045.tar.gz

ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'bash /tmp/deploy-remote.sh valt-hr-suite-20251015-103045.tar.gz'
```

**During first deploy, you'll be prompted to configure `.env.production`:**

```bash
# On the server, edit the file:
nano /var/www/valt-hr-suite/.env.production

# Add your secrets:
DATABASE_URL=postgresql://...
JWT_SECRET=...
API_KEY=...

# Save and exit (Ctrl+X, Y, Enter)

# Restart app:
pm2 restart valt-hr-suite
```

---

### 4. Setup SSL Certificate

**Prerequisites:** DNS must be configured and propagated first!

```bash
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'bash /tmp/setup-ssl.sh'
```

**This will:**
- Verify DNS is pointing to the server
- Configure nginx
- Obtain Let's Encrypt SSL certificate
- Enable HTTPS redirect
- Test auto-renewal

---

### 5. Verify Deployment

```bash
# Check PM2 status
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'pm2 status'

# Check health endpoint
curl https://hr-suite.valtara.ai/api/health

# View logs
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'pm2 logs valt-hr-suite --lines 50'
```

---

### 6. Setup Automated Monitoring (Optional but Recommended)

```bash
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'bash /tmp/setup-cron-jobs.sh'
```

**This sets up:**
- Health checks every 5 minutes
- Daily backups at 2 AM
- Weekly system updates
- SSL certificate auto-renewal

---

## Subsequent Deployments

After the initial setup, deploying updates is simple:

```bash
# 1. Build new version
./deploy-local.sh

# 2. Upload
./scripts/deploy-upload.sh

# 3. Deploy
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'bash /tmp/deploy-remote.sh valt-hr-suite-YYYYMMDD-HHMMSS.tar.gz'
```

**Or use the one-liner:**

```bash
./deploy-local.sh && ./scripts/deploy-upload.sh && ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'bash /tmp/deploy-remote.sh $(ls -t valt-hr-suite-*.tar.gz | head -n1)'
```

---

## Common Operations

### View Logs

```bash
# PM2 logs
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'pm2 logs valt-hr-suite'

# nginx access log
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'sudo tail -f /var/log/nginx/hr-suite.valtara.ai.access.log'

# nginx error log
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'sudo tail -f /var/log/nginx/hr-suite.valtara.ai.error.log'
```

### Restart Application

```bash
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'pm2 restart valt-hr-suite'
```

### Create Manual Backup

```bash
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'bash /var/www/valt-hr-suite/scripts/backup.sh'
```

### Rollback to Previous Version

```bash
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'bash /var/www/valt-hr-suite/scripts/rollback.sh'
```

### Run Health Check

```bash
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'bash /var/www/valt-hr-suite/scripts/health-check.sh'
```

### Renew SSL Certificate Manually

```bash
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'sudo certbot renew --force-renewal && sudo systemctl reload nginx'
```

---

## GitHub Actions CI/CD (Optional)

To enable automated deployments on every push to `main`:

### 1. Add GitHub Secrets

In your repository: Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

| Name | Value |
|------|-------|
| SSH_PRIVATE_KEY | (Contents of ubuntu-ky.pem) |
| SERVER_IP | 91.98.203.231 |
| DEPLOY_USER | ubuntu |

### 2. Push to Main Branch

```bash
git add .
git commit -m "Deploy with CI/CD"
git push origin main
```

The workflow will automatically:
1. Run tests
2. Build production bundle
3. Upload to server
4. Deploy application
5. Run health check
6. Rollback on failure

---

## Troubleshooting

### Application won't start

```bash
# Check PM2 logs
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'pm2 logs valt-hr-suite --lines 100'

# Restart PM2
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'pm2 restart valt-hr-suite'
```

### nginx 502 Bad Gateway

```bash
# Check if app is running
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'pm2 status'

# Test app directly
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'curl http://localhost:3000/api/health'

# Restart nginx
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'sudo systemctl restart nginx'
```

### SSL certificate issues

```bash
# Check certificate
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'sudo certbot certificates'

# Renew
ssh -i ubuntu-ky.pem ubuntu@91.98.203.231 'sudo certbot renew --force-renewal'
```

### Can't SSH to server

```bash
# Verify key permissions
ls -l ubuntu-ky.pem
chmod 600 ubuntu-ky.pem

# Test connection
ssh -v -i ubuntu-ky.pem ubuntu@91.98.203.231
```

---

## Security Checklist

- [ ] SSH key has correct permissions (600)
- [ ] Firewall (UFW) is enabled
- [ ] fail2ban is running
- [ ] `.env.production` has secure secrets
- [ ] SSL certificate is active
- [ ] Automated backups are scheduled
- [ ] Health checks are running
- [ ] Private keys are NOT committed to git

---

## Support

For detailed documentation, see:
- [README-DEPLOY-OPS.md](./README-DEPLOY-OPS.md) - Complete deployment guide
- [README.md](./README.md) - Project overview

---

**Last Updated:** October 2025  
**Deployment Method:** nginx + PM2  
**Target:** hr-suite.valtara.ai (91.98.203.231)
