# HR Suite Deployment Guide
**Server:** 91.98.203.231  
**Domain:** hr-suite.valtara.ai  
**SSH Key:** ubuntu-ky.pem  
**App Port:** 3000

## Prerequisites Checklist
- [ ] DNS A record created (hr-suite.valtara.ai → 91.98.203.231)
- [ ] SSH key permissions set correctly
- [ ] Git repository accessible or local files ready

---

## Step 1: DNS Configuration
Create an A record in your DNS provider:
```
Type: A
Name: hr-suite
Value: 91.98.203.231
TTL: 3600 (or auto)
```
**Verify DNS propagation:**
```cmd
nslookup hr-suite.valtara.ai
```

---

## Step 2: Prepare SSH Key (Windows)
**Set correct permissions on your .pem file:**
```cmd
cd C:\Users\SHIVAM\Downloads\Francis
icacls ubuntu-ky.pem /inheritance:r
icacls ubuntu-ky.pem /grant:r "%USERNAME%:R"
```

**Test SSH connection:**
```cmd
ssh -i C:\Users\SHIVAM\Downloads\Francis\ubuntu-ky.pem ubuntu@91.98.203.231
```

---

## Step 3: Initial Server Setup
**SSH into server and run:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install required packages
sudo apt install -y nginx git build-essential python3-certbot-nginx ufw

# Install PM2 globally
sudo npm install -g pm2@latest

# Verify installations
node --version
npm --version
pm2 --version
nginx -v
```

---

## Step 4: Upload Your Application

### Option A: Using SCP (from Windows)
**From PowerShell or CMD on your Windows machine:**
```cmd
cd d:\hrwas

REM Create deployment package (exclude node_modules)
tar -czf hr-suite-deploy.tar.gz --exclude=node_modules --exclude=.git --exclude=*.log *

REM Upload to server
scp -i C:\Users\SHIVAM\Downloads\Francis\ubuntu-ky.pem hr-suite-deploy.tar.gz ubuntu@91.98.203.231:/home/ubuntu/

REM SSH and extract
ssh -i C:\Users\SHIVAM\Downloads\Francis\ubuntu-ky.pem ubuntu@91.98.203.231
```

**On the server:**
```bash
mkdir -p /home/ubuntu/hr-suite
tar -xzf hr-suite-deploy.tar.gz -C /home/ubuntu/hr-suite
cd /home/ubuntu/hr-suite
npm ci --production
npm run build
```

### Option B: Using Git
**On the server:**
```bash
cd /home/ubuntu
git clone https://github.com/YOUR_USERNAME/hr-suite.git
cd hr-suite
npm ci --production
npm run build
```

---

## Step 5: Create Environment File
**On the server, create `.env` file:**
```bash
cd /home/ubuntu/hr-suite
nano .env
```

**Add your environment variables:**
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your_database_url
API_KEY=your_api_key
JWT_SECRET=your_jwt_secret
# Add other secrets here
```

**Secure the file:**
```bash
chmod 600 .env
```

---

## Step 6: PM2 Configuration
**Create PM2 ecosystem file:**
```bash
cd /home/ubuntu/hr-suite
nano ecosystem.config.js
```

**Paste this configuration:**
```javascript
module.exports = {
  apps: [{
    name: 'hr-suite',
    cwd: '/home/ubuntu/hr-suite',
    script: 'npm',
    args: 'start',
    instances: 2,
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/ubuntu/logs/hr-suite-error.log',
    out_file: '/home/ubuntu/logs/hr-suite-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
```

**Create logs directory and start app:**
```bash
mkdir -p /home/ubuntu/logs

# Start the application
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
sudo pm2 startup systemd -u ubuntu --hp /home/ubuntu

# IMPORTANT: Copy and run the command PM2 outputs above
```

**Verify app is running:**
```bash
pm2 status
pm2 logs hr-suite --lines 50
curl http://localhost:3000
```

---

## Step 7: Nginx Configuration
**Create Nginx site configuration:**
```bash
sudo nano /etc/nginx/sites-available/hr-suite
```

**Paste this configuration:**
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=hr_suite_limit:10m rate=10r/s;

upstream hr_suite_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name hr-suite.valtara.ai;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/hr-suite-access.log;
    error_log /var/log/nginx/hr-suite-error.log;

    # Client body size
    client_max_body_size 10M;

    # Apply rate limiting
    limit_req zone=hr_suite_limit burst=20 nodelay;

    location / {
        proxy_pass http://hr_suite_backend;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static file caching (if you serve static files)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        proxy_pass http://hr_suite_backend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable site and test:**
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/hr-suite /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx
```

**Test domain (should work now over HTTP):**
```bash
curl http://hr-suite.valtara.ai
```

---

## Step 8: SSL/TLS with Let's Encrypt
**Install and configure SSL certificate:**
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate (interactive)
sudo certbot --nginx -d hr-suite.valtara.ai

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose: Redirect HTTP to HTTPS (option 2)

# Verify auto-renewal
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer
```

**Test HTTPS:**
```bash
curl https://hr-suite.valtara.ai
```

---

## Step 9: Firewall Configuration
**Setup UFW firewall:**
```bash
# Allow SSH (IMPORTANT - do this first!)
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

---

## Step 10: Monitoring & Health Checks
**Create a health check script:**
```bash
nano /home/ubuntu/health-check.sh
```

**Paste this:**
```bash
#!/bin/bash
HEALTH_URL="http://localhost:3000/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "$(date): Health check passed"
else
    echo "$(date): Health check failed (HTTP $RESPONSE), restarting app..."
    pm2 restart hr-suite
fi
```

**Make executable and add to cron:**
```bash
chmod +x /home/ubuntu/health-check.sh

# Add to crontab (runs every 5 minutes)
crontab -e

# Add this line:
*/5 * * * * /home/ubuntu/health-check.sh >> /home/ubuntu/logs/health-check.log 2>&1
```

---

## Verification Commands
**Check everything is working:**
```bash
# PM2 process
pm2 status
pm2 logs hr-suite --lines 20

# Nginx status
sudo systemctl status nginx
sudo nginx -t

# Check if app is listening
sudo netstat -tlnp | grep :3000

# Check Nginx logs
sudo tail -f /var/log/nginx/hr-suite-access.log
sudo tail -f /var/log/nginx/hr-suite-error.log

# Test endpoints
curl -I https://hr-suite.valtara.ai
curl https://hr-suite.valtara.ai/api/health

# Check SSL certificate
curl -vI https://hr-suite.valtara.ai 2>&1 | grep -i 'ssl\|tls'
```

---

## Troubleshooting Guide

### Problem: 502 Bad Gateway
```bash
# Check if app is running
pm2 status
pm2 logs hr-suite --lines 50

# Check if port 3000 is listening
sudo netstat -tlnp | grep :3000

# Restart app
pm2 restart hr-suite

# Check Nginx error logs
sudo tail -n 100 /var/log/nginx/hr-suite-error.log
```

### Problem: App crashes on start
```bash
# Check PM2 logs
pm2 logs hr-suite --lines 100

# Check environment variables
pm2 env 0

# Try starting manually
cd /home/ubuntu/hr-suite
npm start

# Check for missing dependencies
npm ci
```

### Problem: DNS not resolving
```bash
# Check DNS from server
nslookup hr-suite.valtara.ai

# Check from Windows
nslookup hr-suite.valtara.ai

# Clear local DNS cache (Windows)
ipconfig /flushdns
```

### Problem: SSL certificate renewal fails
```bash
# Check certificate status
sudo certbot certificates

# Manually renew
sudo certbot renew --force-renewal

# Check Nginx config
sudo nginx -t
```

---

## Maintenance Commands

### Update Application
```bash
# From Windows (upload new version)
cd d:\hrwas
scp -i C:\Users\SHIVAM\Downloads\Francis\ubuntu-ky.pem -r src pages public package.json ubuntu@91.98.203.231:/home/ubuntu/hr-suite/

# On server
cd /home/ubuntu/hr-suite
npm ci --production
npm run build
pm2 reload ecosystem.config.js
pm2 save
```

### View Logs
```bash
# PM2 logs
pm2 logs hr-suite
pm2 logs hr-suite --lines 200

# Nginx logs
sudo tail -f /var/log/nginx/hr-suite-access.log
sudo tail -f /var/log/nginx/hr-suite-error.log

# System logs
sudo journalctl -u nginx -f
```

### Restart Services
```bash
# Restart app (zero downtime)
pm2 reload hr-suite

# Restart app (with downtime)
pm2 restart hr-suite

# Restart Nginx
sudo systemctl restart nginx

# Restart everything
pm2 restart all
sudo systemctl restart nginx
```

### Backup
```bash
# Create backup script
nano /home/ubuntu/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup application
tar -czf $BACKUP_DIR/hr-suite-$DATE.tar.gz \
    /home/ubuntu/hr-suite \
    --exclude=node_modules \
    --exclude=.next

# Backup Nginx config
sudo cp /etc/nginx/sites-available/hr-suite $BACKUP_DIR/nginx-hr-suite-$DATE.conf

# Keep only last 7 backups
find $BACKUP_DIR -name "hr-suite-*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/hr-suite-$DATE.tar.gz"
```

```bash
chmod +x /home/ubuntu/backup.sh

# Add to daily cron
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup.sh >> /home/ubuntu/logs/backup.log 2>&1
```

---

## Quick Reference

### SSH into server
```cmd
ssh -i C:\Users\SHIVAM\Downloads\Francis\ubuntu-ky.pem ubuntu@91.98.203.231
```

### Upload files from Windows
```cmd
scp -i C:\Users\SHIVAM\Downloads\Francis\ubuntu-ky.pem -r d:\hrwas\* ubuntu@91.98.203.231:/home/ubuntu/hr-suite/
```

### Key paths
- **App directory:** `/home/ubuntu/hr-suite`
- **Nginx config:** `/etc/nginx/sites-available/hr-suite`
- **SSL certificates:** `/etc/letsencrypt/live/hr-suite.valtara.ai/`
- **Logs:** `/home/ubuntu/logs/`
- **Environment:** `/home/ubuntu/hr-suite/.env`

### PM2 commands
```bash
pm2 start ecosystem.config.js  # Start app
pm2 stop hr-suite              # Stop app
pm2 restart hr-suite           # Restart app
pm2 reload hr-suite            # Reload (zero downtime)
pm2 logs hr-suite              # View logs
pm2 monit                      # Monitor resources
pm2 status                     # List all processes
pm2 save                       # Save process list
```

---

## Security Checklist
- [ ] Firewall enabled (UFW)
- [ ] SSH key-only authentication
- [ ] SSL/TLS certificate installed
- [ ] Environment variables secured (chmod 600 .env)
- [ ] Nginx security headers configured
- [ ] Rate limiting enabled
- [ ] Regular updates scheduled
- [ ] Automated backups configured
- [ ] Non-root user running app
- [ ] Fail2ban installed (optional but recommended)

---

## Performance Optimization

### Enable Nginx caching
```bash
sudo nano /etc/nginx/nginx.conf
```

Add inside `http` block:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=hr_suite_cache:10m max_size=100m inactive=60m use_temp_path=off;
```

### Enable Gzip compression
Already in default Nginx config, verify:
```bash
sudo nano /etc/nginx/nginx.conf
```

Ensure these lines are uncommented:
```nginx
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
```

### PM2 monitoring
```bash
# Install PM2 web dashboard
pm2 install pm2-server-monit

# Or use keymetrics (PM2 Plus)
pm2 link <secret_key> <public_key>
```

---

## Post-Deployment Checklist
- [ ] App accessible via https://hr-suite.valtara.ai
- [ ] SSL certificate valid and auto-renewal working
- [ ] PM2 starts on system reboot
- [ ] Health checks running
- [ ] Logs rotating properly
- [ ] Backups scheduled
- [ ] Firewall active
- [ ] Monitoring setup
- [ ] Error pages configured
- [ ] Documentation updated

---

**Deployment Date:** October 15, 2025  
**Last Updated:** October 15, 2025
