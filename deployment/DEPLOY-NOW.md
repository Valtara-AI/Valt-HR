# 🚀 DEPLOY NOW - Step-by-Step Instructions

## ⚠️ SSH Key Issue Detected

The SSH private key `ubuntu-ky.pem` is not matching the public key on the server. You have two options:

---

## Option A: Connect with Password & Install Key (RECOMMENDED)

### Step 1: SSH with password
```cmd
ssh ubuntu@91.98.203.231
```
**Enter your server password when prompted**

### Step 2: Once connected, install your public key
```bash
# Extract the public key from your private key (on your Windows machine first)
# Run this in PowerShell or WSL:
ssh-keygen -y -f C:\Users\SHIVAM\Downloads\Francis\ubuntu-ky.pem > ubuntu-ky.pub

# Then copy the content and add to authorized_keys on server:
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the public key, save (Ctrl+X, Y, Enter)
chmod 600 ~/.ssh/authorized_keys
```

---

## Option B: Manual Deployment (If SSH key doesn't work)

I'll guide you through each command to run on the server.

### Step 1: Connect to server
```cmd
ssh ubuntu@91.98.203.231
```
*Enter password*

### Step 2: Update system & install packages
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx git build-essential python3-certbot-nginx ufw
sudo npm install -g pm2@latest
```

### Step 3: Create directories
```bash
mkdir -p /home/ubuntu/hr-suite
mkdir -p /home/ubuntu/logs
mkdir -p /home/ubuntu/backups
```

### Step 4: Configure firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Step 5: Setup Nginx
```bash
sudo tee /etc/nginx/sites-available/hr-suite > /dev/null << 'EOF'
limit_req_zone $binary_remote_addr zone=hr_suite_limit:10m rate=10r/s;

upstream hr_suite_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name hr-suite.valtara.ai;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    access_log /var/log/nginx/hr-suite-access.log;
    error_log /var/log/nginx/hr-suite-error.log;

    client_max_body_size 10M;
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
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/hr-suite /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Upload files from Windows
**Open another terminal on your Windows machine** and run:

```cmd
cd d:\hrwas

REM Upload application files
scp -r src pages public package.json package-lock.json next.config.js tsconfig.json ubuntu@91.98.203.231:/home/ubuntu/hr-suite/

REM Upload deployment files
scp deployment/ecosystem.config.js ubuntu@91.98.203.231:/home/ubuntu/hr-suite/
```

### Step 7: Back on the server - Build the app
```bash
cd /home/ubuntu/hr-suite

# Create .env file
nano .env
```

**Paste this and modify with your actual values:**
```env
NODE_ENV=production
PORT=3000
# Add your database URL, API keys, etc.
```

Save with `Ctrl+X`, `Y`, `Enter`

```bash
# Secure .env
chmod 600 .env

# Install and build
npm ci --production
npm run build
```

### Step 8: Start with PM2
```bash
cd /home/ubuntu/hr-suite
pm2 start ecosystem.config.js
pm2 save
sudo pm2 startup systemd -u ubuntu --hp /home/ubuntu
# Copy and run the command that PM2 outputs
```

### Step 9: Setup SSL
```bash
sudo certbot --nginx -d hr-suite.valtara.ai
```
Follow the prompts:
- Enter your email
- Agree to terms
- Choose option 2 (Redirect HTTP to HTTPS)

### Step 10: Verify
```bash
pm2 status
pm2 logs hr-suite --lines 20
curl http://localhost:3000
curl https://hr-suite.valtara.ai
```

---

## ✅ Verification Checklist

Run these commands to verify everything:

```bash
# Check PM2
pm2 status

# Check Nginx
sudo systemctl status nginx

# Check if app is listening
sudo netstat -tlnp | grep :3000

# View logs
pm2 logs hr-suite
sudo tail -f /var/log/nginx/hr-suite-error.log

# Test the site
curl -I https://hr-suite.valtara.ai
```

---

## 🆘 Troubleshooting

### 502 Bad Gateway
```bash
pm2 restart hr-suite
pm2 logs hr-suite
```

### App won't start
```bash
cd /home/ubuntu/hr-suite
npm ci
npm run build
pm2 restart hr-suite
pm2 logs hr-suite --lines 50
```

### SSL not working
```bash
sudo certbot certificates
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

---

## 📝 Quick Commands

```bash
# Restart app
pm2 reload hr-suite

# Restart nginx
sudo systemctl reload nginx

# View live logs
pm2 logs hr-suite -f

# Check status
pm2 status && sudo systemctl status nginx
```

---

## 🎯 Final Test

Open browser and visit:
- http://hr-suite.valtara.ai (should redirect to HTTPS)
- https://hr-suite.valtara.ai (should show your app)

---

**Need help?** Check the full documentation in `deployment/deploy.md`
