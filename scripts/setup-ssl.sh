#!/bin/bash
# scripts/setup-ssl.sh - Configure SSL certificate with Let's Encrypt
# Run this AFTER DNS records are pointing to the server

set -e

DOMAIN="hr-suite.valtara.ai"
WWW_DOMAIN="www.hr-suite.valtara.ai"
EMAIL="ops@valtara.ai"
NGINX_SITE="/etc/nginx/sites-available/${DOMAIN}"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}"

echo "🔒 SSL Certificate Setup"
echo "========================="
echo "Domain: ${DOMAIN}"
echo "Email: ${EMAIL}"
echo ""

# Step 1: Verify DNS
echo "🔍 Step 1: Verifying DNS configuration..."
echo ""
echo "Checking A record for ${DOMAIN}..."
DNS_IP=$(dig +short ${DOMAIN} | tail -n1)
SERVER_IP=$(curl -s ifconfig.me)

if [ "$DNS_IP" = "$SERVER_IP" ]; then
    echo "✓ DNS configured correctly"
    echo "  ${DOMAIN} → ${SERVER_IP}"
else
    echo "⚠️  DNS mismatch!"
    echo "  Domain resolves to: ${DNS_IP}"
    echo "  Server IP: ${SERVER_IP}"
    echo ""
    echo "Please ensure your DNS A record points to ${SERVER_IP}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 2: Configure nginx (without SSL first)
echo ""
echo "⚙️  Step 2: Configuring nginx..."

# Check if site config exists
if [ ! -f "${NGINX_SITE}" ]; then
    echo "⚠️  Nginx site config not found at ${NGINX_SITE}"
    echo "  Copying from uploaded config..."
    sudo cp /tmp/nginx-site.conf ${NGINX_SITE}
fi

# Enable site
sudo ln -sf ${NGINX_SITE} ${NGINX_ENABLED}

# Test nginx configuration
echo "  → Testing nginx configuration..."
sudo nginx -t

# Reload nginx
echo "  → Reloading nginx..."
sudo systemctl reload nginx
echo "✓ Nginx configured"

# Step 3: Create certbot directory
echo ""
echo "📁 Step 3: Preparing certbot..."
sudo mkdir -p /var/www/certbot
echo "✓ Certbot directory ready"

# Step 4: Obtain SSL certificate
echo ""
echo "🔒 Step 4: Obtaining SSL certificate..."
echo "  This will request a certificate from Let's Encrypt"
echo ""

# Build certbot command
CERTBOT_CMD="sudo certbot --nginx"
CERTBOT_CMD="${CERTBOT_CMD} -d ${DOMAIN}"

# Add www subdomain if specified
if [ ! -z "$WWW_DOMAIN" ]; then
    CERTBOT_CMD="${CERTBOT_CMD} -d ${WWW_DOMAIN}"
fi

# Add email and agreement flags
CERTBOT_CMD="${CERTBOT_CMD} --email ${EMAIL}"
CERTBOT_CMD="${CERTBOT_CMD} --agree-tos"
CERTBOT_CMD="${CERTBOT_CMD} --no-eff-email"
CERTBOT_CMD="${CERTBOT_CMD} --redirect"

# Execute certbot
echo "Running: ${CERTBOT_CMD}"
echo ""
eval ${CERTBOT_CMD}

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ SSL certificate obtained successfully!"
else
    echo ""
    echo "❌ Failed to obtain SSL certificate"
    echo "   Check the error messages above"
    exit 1
fi

# Step 5: Verify certificate
echo ""
echo "🔍 Step 5: Verifying SSL certificate..."
if sudo test -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"; then
    echo "✓ Certificate files exist"
    echo ""
    echo "Certificate details:"
    sudo openssl x509 -in /etc/letsencrypt/live/${DOMAIN}/fullchain.pem -noout -dates -subject
else
    echo "⚠️  Certificate files not found"
fi

# Step 6: Test automatic renewal
echo ""
echo "🔄 Step 6: Testing automatic renewal..."
sudo certbot renew --dry-run

if [ $? -eq 0 ]; then
    echo "✓ Automatic renewal is configured correctly"
else
    echo "⚠️  Automatic renewal test failed"
fi

# Step 7: Verify renewal timer
echo ""
echo "⏰ Step 7: Checking renewal timer..."
sudo systemctl status certbot.timer --no-pager || echo "ℹ️  Certbot timer not found (this is OK on some systems)"

# Step 8: Final nginx reload
echo ""
echo "🔄 Step 8: Final nginx reload..."
sudo nginx -t
sudo systemctl reload nginx
echo "✓ Nginx reloaded with SSL configuration"

# Step 9: Display summary
echo ""
echo "✨ SSL Setup Complete!"
echo ""
echo "🔒 Certificate Information:"
echo "  Domain: ${DOMAIN}"
echo "  Certificate: /etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
echo "  Private Key: /etc/letsencrypt/live/${DOMAIN}/privkey.pem"
echo "  Expires: $(sudo openssl x509 -in /etc/letsencrypt/live/${DOMAIN}/fullchain.pem -noout -enddate | cut -d= -f2)"
echo ""
echo "🌐 Your site is now available at:"
echo "  https://${DOMAIN}"
if [ ! -z "$WWW_DOMAIN" ]; then
    echo "  https://${WWW_DOMAIN} (redirects to main domain)"
fi
echo ""
echo "🔄 Certificate auto-renewal:"
echo "  Certbot will automatically renew certificates before expiry"
echo "  Test renewal: sudo certbot renew --dry-run"
echo "  Force renewal: sudo certbot renew --force-renewal"
echo ""
echo "🔍 Test your SSL configuration:"
echo "  https://www.ssllabs.com/ssltest/analyze.html?d=${DOMAIN}"
echo ""
