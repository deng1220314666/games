#!/usr/bin/env bash
# 在服务器上执行的一键部署脚本(Ubuntu/Debian)。
# 假设:代码已在 /var/www/ttearn-src(git clone 或上传),你已用 root/sudo 登录。
# 用法:sudo bash deploy/setup.sh
set -euo pipefail

SRC=/var/www/ttearn-src        # 仓库根(含前端 + server/)
WEB=/var/www/ttearn            # 前端静态目录
API=/var/www/ttearn-server     # 后端目录
FRONT_DOMAIN=tg.ttgame.fun
API_DOMAIN=tgapi.ttgame.fun

echo ">> 1. 安装 Node 20 / nginx / certbot(已装会跳过)"
if ! command -v node >/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
apt-get install -y nginx certbot python3-certbot-nginx rsync

echo ">> 2. 构建前端"
cd "$SRC"
npm ci
npm run build
mkdir -p "$WEB"
rsync -a --delete "$SRC/dist/" "$WEB/"

echo ">> 3. 部署后端"
mkdir -p "$API"
rsync -a --delete --exclude node_modules --exclude .env "$SRC/server/" "$API/server/"
cd "$API/server"
npm ci --omit=dev
if [ ! -f .env ]; then
  cp .env.example .env
  # 自动生成 JWT_SECRET
  SECRET=$(openssl rand -hex 32)
  sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$SECRET/" .env
  echo "!! 已生成 .env,请手动填 TELEGRAM_BOT_TOKEN / TON_WALLET_MNEMONIC / TONCENTER_API_KEY"
fi
chown -R www-data:www-data "$API"

echo ">> 4. systemd 常驻后端"
cp "$SRC/deploy/ttearn-server.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now ttearn-server
systemctl restart ttearn-server

echo ">> 5. nginx 站点"
cp "$SRC/deploy/nginx-$FRONT_DOMAIN.conf" /etc/nginx/sites-available/$FRONT_DOMAIN
cp "$SRC/deploy/nginx-$API_DOMAIN.conf"  /etc/nginx/sites-available/$API_DOMAIN
ln -sf /etc/nginx/sites-available/$FRONT_DOMAIN /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/$API_DOMAIN  /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

echo ">> 6. 申请 HTTPS 证书"
certbot --nginx -d $FRONT_DOMAIN -d $API_DOMAIN --non-interactive --agree-tos -m admin@ttgame.fun || \
  echo "!! certbot 失败,确认 DNS 已解析到本机后重跑:certbot --nginx -d $FRONT_DOMAIN -d $API_DOMAIN"

echo ">> 完成。自检:"
echo "   curl https://$API_DOMAIN/health"
echo "   打开 https://$FRONT_DOMAIN 和 https://$FRONT_DOMAIN/tonconnect-manifest.json"
