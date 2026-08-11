#!/bin/bash
# ============================================================
#  Party Member Platform — VPS Deployment Script
#  Domain : rashtriyaannadatavikasparty.org
#  OS     : Ubuntu 20.04 / 22.04 / 24.04
#  Run as : sudo bash deploy.sh
# ============================================================

set -e  # exit on first error

APP_DIR="/var/www/party-member-platform"
DOMAIN="rashtriyaannadatavikasparty.org"
APP_PORT=5032

echo "======================================================"
echo "  Party Member Platform — VPS Deployment"
echo "======================================================"

# ── 1. System update ──────────────────────────────────────
echo "[1/9] Updating system packages..."
apt-get update -y && apt-get upgrade -y
apt-get install -y git curl nginx ufw fail2ban certbot python3-certbot-nginx

# ── 2. Node.js 22 ─────────────────────────────────────────
if ! command -v node &> /dev/null; then
    echo "[2/9] Installing Node.js 22.x..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
else
    echo "[2/9] Node.js $(node -v) already installed — skipping."
fi

# ── 3. PM2 ────────────────────────────────────────────────
if ! command -v pm2 &> /dev/null; then
    echo "[3/9] Installing PM2..."
    npm install -g pm2
else
    echo "[3/9] PM2 already installed — skipping."
fi

# ── 4. Firewall ───────────────────────────────────────────
echo "[4/9] Configuring UFW firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
echo "y" | ufw enable || true

# ── 5. Clone / pull code ──────────────────────────────────
echo "[5/9] Deploying application code to $APP_DIR..."
if [ -d "$APP_DIR/.git" ]; then
    echo "   Repository exists — pulling latest changes..."
    cd "$APP_DIR"
    git pull origin main
else
    echo "   Cloning repository..."
    # Replace the URL below with your actual GitHub repo URL
    git clone https://github.com/YOUR_ORG/party-member-platform.git "$APP_DIR"
    cd "$APP_DIR"
fi

# ── 6. Environment file ───────────────────────────────────
echo "[6/9] Setting up .env..."
if [ ! -f "$APP_DIR/.env" ]; then
    echo "   ⚠  No .env found at $APP_DIR/.env"
    echo "   Please create it manually (see .env.example) and re-run."
    exit 1
else
    echo "   .env already present — skipping."
fi

# ── 7. Install deps & build ───────────────────────────────
echo "[7/9] Installing dependencies & building..."
cd "$APP_DIR"
npm ci --omit=dev
npx prisma generate
npx prisma migrate deploy   # safe for NeonDB; applies pending migrations
npm run build

# ── 8. PM2 process ────────────────────────────────────────
echo "[8/9] Starting application with PM2..."
pm2 delete party-member-platform 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash || true

# ── 9. Nginx reverse proxy ────────────────────────────────
echo "[9/9] Configuring Nginx..."
cat > /etc/nginx/sites-available/party-member-platform <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Security headers already set by Next.js — Nginx adds a few extras
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Max upload size for images, documents, etc.
    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 120s;
        proxy_connect_timeout 10s;
    }

    # Static assets — served directly by Nginx for speed
    location /_next/static/ {
        proxy_pass http://127.0.0.1:$APP_PORT;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /public/ {
        proxy_pass http://127.0.0.1:$APP_PORT;
        expires 30d;
        add_header Cache-Control "public";
    }
}
EOF

ln -sf /etc/nginx/sites-available/party-member-platform /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# ── Fail2Ban ──────────────────────────────────────────────
systemctl enable fail2ban
systemctl start fail2ban

echo ""
echo "======================================================"
echo "  ✅  Deployment complete!"
echo ""
echo "  Next step — obtain SSL certificate:"
echo "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "  After certbot, verify at:"
echo "  https://$DOMAIN"
echo "======================================================"
