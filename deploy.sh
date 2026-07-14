#!/bin/bash
# RAVP PPMS - Ubuntu VPS Deployment Script
# Run with: sudo ./deploy.sh

echo "======================================"
echo " Starting RAVP Server Deployment Setup"
echo "======================================"

# 1. Update and install dependencies
echo "Updating packages..."
apt-get update && apt-get upgrade -y
apt-get install -y nginx curl ufw fail2ban certbot python3-certbot-nginx

# 2. Setup Node.js (v22.x)
if ! command -v node &> /dev/null
then
    echo "Installing Node.js 22.x..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi

# 3. Setup PM2
if ! command -v pm2 &> /dev/null
then
    echo "Installing PM2 globally..."
    npm install -g pm2
fi

# 4. Configure UFW Firewall
echo "Configuring UFW Firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
echo "y" | ufw enable

# 5. Build the Application
echo "Building the Next.js application..."
npm install
npx prisma generate
# Optional: npx prisma migrate deploy
npm run build

# 6. Start PM2 Process
echo "Starting Application with PM2..."
pm2 start npm --name "ravp-ppms" -- start
pm2 save
pm2 startup systemd -u root --hp /root

# 7. Setup Nginx Reverse Proxy
echo "Configuring Nginx Reverse Proxy..."
cat > /etc/nginx/sites-available/ravp-ppms << 'EOF'
server {
    listen 80;
    server_name your_domain.com; # Replace with your actual domain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

ln -sf /etc/nginx/sites-available/ravp-ppms /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 8. Fail2Ban Configuration (Basic SSH & Nginx protection)
systemctl enable fail2ban
systemctl start fail2ban

echo "======================================"
echo " Deployment Script Finished! "
echo " Ensure you point your domain to this IP and run:"
echo " sudo certbot --nginx -d your_domain.com"
echo "======================================"
