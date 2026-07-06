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
PORT=3001                      # 后端端口(3000 常被别的应用占用)

echo ">> 1. 安装 Node 22 / nginx / certbot(已装会跳过)"
if ! command -v node >/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
apt-get update
apt-get install -y nginx certbot rsync openssl

echo ">> 2. 构建前端"
cd "$SRC"
npm install --no-audit --no-fund   # 仓库无 lockfile,用 install 而非 ci
npm run build
mkdir -p "$WEB"
rsync -a --delete "$SRC/dist/" "$WEB/"

echo ">> 3. 部署后端"
mkdir -p "$API"
rsync -a --delete --exclude node_modules --exclude .env "$SRC/server/" "$API/server/"
cd "$API/server"
npm install --omit=dev --no-audit --no-fund
if [ ! -f .env ]; then
  cp .env.example .env
  SECRET=$(openssl rand -hex 32)
  sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$SECRET/" .env
  grep -q '^PORT=' .env && sed -i "s/^PORT=.*/PORT=$PORT/" .env || echo "PORT=$PORT" >> .env
  echo "!! 已生成 .env,请手动填 TELEGRAM_BOT_TOKEN / TON_WALLET_MNEMONIC / TONCENTER_API_KEY"
fi

echo ">> 4. systemd 常驻后端"
NODE_BIN=$(command -v node)
sed "s|ExecStart=.*|ExecStart=$NODE_BIN src/index.js|" "$SRC/deploy/ttearn-server.service" > /etc/systemd/system/ttearn-server.service
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
