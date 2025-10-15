#!/bin/bash
# scripts/server-bootstrap.sh - One-time server setup
# Run this once on a new server to install all dependencies

set -e

echo "🔧 Server Bootstrap - One-time Setup"
echo "====================================="
echo ""

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y
echo "✓ System updated"

# Install Node.js 20.x
echo ""
echo "📦 Installing Node.js 20.x..."
if ! command -v node &> /dev/null || [ "$(node -v | cut -d. -f1 | sed 's/v//')" -lt 20 ]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✓ Node.js installed: $(node -v)"
else
    echo "✓ Node.js already installed: $(node -v)"
fi

# Install build tools
echo ""
echo "📦 Installing build tools..."
sudo apt-get install -y build-essential git curl wget
echo "✓ Build tools installed"

# Install PM2 globally
echo ""
echo "📦 Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    echo "✓ PM2 installed: $(pm2 -v)"
else
    echo "✓ PM2 already installed: $(pm2 -v)"
fi

# Configure PM2 to start on boot
echo ""
echo "⚙️  Configuring PM2 startup..."
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
echo "✓ PM2 startup configured"

# Install Nginx
echo ""
echo "📦 Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt-get install -y nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
    echo "✓ Nginx installed"
else
    echo "✓ Nginx already installed"
fi

# Install Certbot for Let's Encrypt
echo ""
echo "📦 Installing Certbot..."
if ! command -v certbot &> /dev/null; then
    sudo apt-get install -y certbot python3-certbot-nginx
    echo "✓ Certbot installed"
else
    echo "✓ Certbot already installed"
fi

# Configure firewall
echo ""
echo "🔥 Configuring firewall (UFW)..."
sudo apt-get install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
echo "✓ Firewall configured"

# Install fail2ban for SSH security
echo ""
echo "🔒 Installing fail2ban..."
sudo apt-get install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
echo "✓ fail2ban installed"

# Create application directory structure
echo ""
echo "📁 Creating application directories..."
sudo mkdir -p /var/www
sudo mkdir -p /var/log/valt-hr-suite
sudo mkdir -p /var/backups/valt-hr-suite
sudo chown -R $USER:$USER /var/www
sudo chown -R $USER:$USER /var/log/valt-hr-suite
sudo chown -R $USER:$USER /var/backups/valt-hr-suite
echo "✓ Directories created"

# Set SSH key permissions
echo ""
echo "🔑 Securing SSH keys..."
chmod 700 ~/.ssh 2>/dev/null || true
chmod 600 ~/.ssh/authorized_keys 2>/dev/null || true
echo "✓ SSH keys secured"

# Display versions
echo ""
echo "✨ Bootstrap complete!"
echo ""
echo "📊 Installed versions:"
echo "  Node.js: $(node -v)"
echo "  npm: $(npm -v)"
echo "  PM2: $(pm2 -v)"
echo "  Nginx: $(nginx -v 2>&1 | grep -o 'nginx/[0-9.]*')"
echo "  Certbot: $(certbot --version 2>&1 | head -n1)"
echo ""
echo "🎯 Next steps:"
echo "  1. Configure DNS A records to point to this server"
echo "  2. Run deploy script to upload and deploy application"
echo "  3. Run SSL certificate setup after DNS propagates"
echo ""
