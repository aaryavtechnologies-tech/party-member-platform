#!/bin/bash
# ============================================================
#  Party Member Platform — VPS Update & Deploy Script
#  Node, PM2, Nginx already installed on VPS.
#  Run as: bash deploy.sh  (from inside the app directory)
# ============================================================

set -e  # exit on first error

APP_DIR="/root/party-member-platform"
DOMAIN="rashtriyaannadatavikasparty.org"
APP_PORT=5032

echo "======================================================"
echo "  Party Member Platform — Deploy"
echo "======================================================"

cd "$APP_DIR"

# ── 1. Pull latest code from Git ──────────────────────────
echo "[1/4] Pulling latest updates from Git..."
git pull origin main

# ── 2. Install dependencies ───────────────────────────────
echo "[2/4] Installing dependencies..."
npm ci

# ── 3. Build the app ──────────────────────────────────────
echo "[3/4] Generating Prisma client & building..."
npx prisma generate
npm run build

# ── 4. Restart with PM2 ───────────────────────────────────
echo "[4/4] Restarting app with PM2..."
pm2 restart party-member-platform || pm2 start ecosystem.config.js
pm2 save

echo ""
echo "======================================================"
echo "  ✅  Deployment complete!"
echo "  Site: https://$DOMAIN"
echo "======================================================"
