# HR Suite - Quick Deploy Guide

## 🚀 Fast Track Deployment (30 minutes)

### Prerequisites
- ✅ DNS: Point `hr-suite.valtara.ai` → `91.98.203.231`
- ✅ SSH Key: `C:\Users\SHIVAM\Downloads\Francis\ubuntu-ky.pem`
- ✅ Server: Ubuntu at `91.98.203.231`

---

## Step 1: SSH into Server (2 min)
```cmd
ssh -i C:\Users\SHIVAM\Downloads\Francis\ubuntu-ky.pem ubuntu@91.98.203.231
```

---

## Step 2: Run Setup Script (5 min)
```bash
# Download and run setup script
curl -fsSL https://raw.githubusercontent.com/YOUR_REPO/main/deployment/server-setup.sh -o setup.sh
bash setup.sh

# Or manually copy the server-setup.sh content and run it
```

---

## Step 3: Upload Application (5 min)

### Option A: From Windows (Quick)
```cmd
cd d:\hrwas
.\deployment\deploy.cmd
```

### Option B: Manual Upload
```cmd
cd d:\hrwas
scp -i C:\Users\SHIVAM\Downloads\Francis\ubuntu-ky.pem -r * ubuntu@91.98.203.231:/home/ubuntu/hr-suite/
```

---

## Step 4: Configure Environment (3 min)
```bash
# On server
cd /home/ubuntu/hr-suite
nano .env
# Copy from .env.example and fill in your values
# Press Ctrl+X, Y, Enter to save

chmod 600 .env
```

---

## Step 5: Install & Build (5 min)
```bash
cd /home/ubuntu/hr-suite
npm ci --production
npm run build
```

---

## Step 6: Start with PM2 (2 min)
```bash
# Copy ecosystem config
cp deployment/ecosystem.config.js .

# Start app
pm2 start ecosystem.config.js
pm2 save

# Setup startup
sudo pm2 startup systemd -u ubuntu --hp /home/ubuntu
# Run the command PM2 prints
```

---

## Step 7: Setup SSL (5 min)
```bash
sudo certbot --nginx -d hr-suite.valtara.ai
# Follow prompts, choose redirect to HTTPS
```

---

## Step 8: Verify (3 min)
```bash
# Check PM2
pm2 status

# Check logs
pm2 logs hr-suite --lines 20

# Test locally
curl http://localhost:3000

# Test domain
curl https://hr-suite.valtara.ai
```

---

## ✅ Done!
Visit: **https://hr-suite.valtara.ai**

---

## Quick Commands Reference

### Deploy Updates
```cmd
REM From Windows
cd d:\hrwas
.\deployment\deploy.cmd
```

### Check Status
```bash
pm2 status
pm2 logs hr-suite
sudo systemctl status nginx
```

### Restart
```bash
pm2 reload hr-suite
sudo systemctl reload nginx
```

### View Logs
```bash
pm2 logs hr-suite --lines 50
sudo tail -f /var/log/nginx/hr-suite-error.log
```

---

## Troubleshooting

### 502 Bad Gateway
```bash
pm2 restart hr-suite
sudo systemctl restart nginx
```

### App Won't Start
```bash
cd /home/ubuntu/hr-suite
npm ci
npm run build
pm2 restart hr-suite
pm2 logs hr-suite
```

### SSL Issues
```bash
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

---

## Need Help?
- Check full guide: `deployment/deploy.md`
- PM2 logs: `pm2 logs hr-suite`
- Nginx logs: `sudo tail -f /var/log/nginx/hr-suite-error.log`
