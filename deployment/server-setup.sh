#!/bin/bash
# Complete server setup script for HR Suite
# Run this on the Ubuntu server: bash server-setup.sh

set -e  # Exit on error

echo "========================================="
echo "HR Suite Server Setup"
echo "========================================="
echo ""

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18 LTS
echo "📦 Installing Node.js 18 LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install essential packages
echo "📦 Installing essential packages..."
sudo apt install -y nginx git build-essential python3-certbot-nginx ufw

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2@latest

# Create directories
echo "📁 Creating directories..."
mkdir -p /home/ubuntu/hr-suite
mkdir -p /home/ubuntu/logs
mkdir -p /home/ubuntu/backups

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
echo "y" | sudo ufw enable

# Setup Nginx
echo "🌐 Configuring Nginx..."
sudo rm -f /etc/nginx/sites-enabled/default

# Create Nginx config
sudo tee /etc/nginx/sites-available/hr-suite > /dev/null <<'EOF'
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
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

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

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        proxy_pass http://hr_suite_backend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api/health {
        limit_req off;
        proxy_pass http://hr_suite_backend;
    }
}
EOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/hr-suite /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Create health check script
echo "🏥 Creating health check script..."
tee /home/ubuntu/health-check.sh > /dev/null <<'EOF'
#!/bin/bash
HEALTH_URL="http://localhost:3000/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "$(date): Health check passed"
else
    echo "$(date): Health check failed (HTTP $RESPONSE), restarting app..."
    pm2 restart hr-suite
fi
EOF

chmod +x /home/ubuntu/health-check.sh

# Add health check to crontab
(crontab -l 2>/dev/null; echo "*/5 * * * * /home/ubuntu/health-check.sh >> /home/ubuntu/logs/health-check.log 2>&1") | crontab -

# Create backup script
echo "💾 Creating backup script..."
tee /home/ubuntu/backup.sh > /dev/null <<'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

tar -czf $BACKUP_DIR/hr-suite-$DATE.tar.gz \
    /home/ubuntu/hr-suite \
    --exclude=node_modules \
    --exclude=.next

sudo cp /etc/nginx/sites-available/hr-suite $BACKUP_DIR/nginx-hr-suite-$DATE.conf

find $BACKUP_DIR -name "hr-suite-*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/hr-suite-$DATE.tar.gz"
EOF

chmod +x /home/ubuntu/backup.sh

# Add backup to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /home/ubuntu/backup.sh >> /home/ubuntu/logs/backup.log 2>&1") | crontab -

# Print versions
echo ""
echo "========================================="
echo "✅ Server setup complete!"
echo "========================================="
echo "Installed versions:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "PM2: $(pm2 --version)"
echo "Nginx: $(nginx -v 2>&1)"
echo ""
echo "Next steps:"
echo "1. Upload your application files to /home/ubuntu/hr-suite"
echo "2. Create .env file with your environment variables"
echo "3. Run: cd /home/ubuntu/hr-suite && npm ci --production && npm run build"
echo "4. Create and start PM2 ecosystem: pm2 start ecosystem.config.js"
echo "5. Setup SSL: sudo certbot --nginx -d hr-suite.valtara.ai"
echo "========================================="
