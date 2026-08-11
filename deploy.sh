#!/bin/bash
# ============================================================
#  Party Member Platform — VPS Update Script
#  Node, PM2, Nginx already installed on VPS.
#  Run as : sudo bash deploy.sh
# ============================================================

set -e  # exit on first error

APP_DIR="/root/party-member-platform"
DOMAIN="rashtriyaannadatavikasparty.org"
APP_PORT=5032

echo "======================================================"
echo "  Party Member Platform — VPS Deployment"
echo "======================================================"

# ── 7. Install deps & build ───────────────────────────────
echo "[7/9] Installing dependencies & building..."
cd "$APP_DIR"
npm ci
npx prisma generate
npx prisma migrate deploy   # safe for NeonDB; applies pending migrations
npm run build

# ── 8. PM2 process ────────────────────────────────────────
echo "[8/9] Restarting application with PM2..."
pm2 restart party-member-platform || pm2 start ecosystem.config.js
pm2 save

# ── 9. Nginx reverse proxy ────────────────────────────────
echo "[9/9] Configuring Nginx..."
cat > /etc/nginx/sites-available/party-member-platform <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

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

echo ""
echo "======================================================"
echo "  ✅  Deployment complete!"
echo ""
echo "  If SSL not set up yet, run:"
echo "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "======================================================"
