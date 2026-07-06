#!/usr/bin/env bash
# =====================================================================
# TTEarn 一键部署脚本(幂等:首次部署 & 日常更新都跑这个)
# 用法:在服务器上  sudo bash /var/www/ttearn-src/deploy/deploy.sh
# 首次可先:  git clone -b ttearn <repo> /var/www/ttearn-src
#            然后 sudo bash /var/www/ttearn-src/deploy/deploy.sh
# =====================================================================
set -euo pipefail

# ---------- 可配置 ----------
REPO="https://github.com/deng1220314666/games.git"
BRANCH="ttearn"
FRONT_DOMAIN="tg.ttgame.fun"
API_DOMAIN="tgapi.ttgame.fun"
BACKEND_PORT="3001"                 # 3000 被同机 ai-project 占用
CERT_EMAIL="admin@ttgame.fun"
ENABLE_HTTPS="${ENABLE_HTTPS:-1}"   # 源站签证书上 443;若纯靠 Cloudflare Flexible 可设 0

SRC=/var/www/ttearn-src
WEB=/var/www/ttearn
API=/var/www/ttearn-server/server
WEBROOT=/var/www/certbot

log() { echo -e "\n>> $*"; }

# ---------- 1. 依赖(缺什么装什么,不动已有服务) ----------
log "检查依赖"
if ! command -v node >/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
PKGS=()
for p in nginx certbot rsync openssl git; do command -v "$p" >/dev/null || PKGS+=("$p"); done
if [ "${#PKGS[@]}" -gt 0 ]; then apt-get update -qq; apt-get install -y "${PKGS[@]}"; fi

# ---------- 2. 同步代码 ----------
log "同步代码($BRANCH)"
if [ -d "$SRC/.git" ]; then
  git -C "$SRC" fetch origin -q
  git -C "$SRC" checkout "$BRANCH" -q
  git -C "$SRC" reset --hard "origin/$BRANCH" -q
else
  mkdir -p "$SRC"
  git clone -b "$BRANCH" "$REPO" "$SRC" -q
fi

# ---------- 3. 前端 ----------
log "构建前端"
cd "$SRC"
npm install --no-audit --no-fund           # 仓库无 lockfile,用 install
npm run build
mkdir -p "$WEB"
rsync -a --delete "$SRC/dist/" "$WEB/"

# ---------- 4. 后端 ----------
log "部署后端"
mkdir -p "$API"
rsync -a --delete --exclude node_modules --exclude .env "$SRC/server/" "$API/"
cd "$API"
npm install --omit=dev --no-audit --no-fund
if [ ! -f .env ]; then
  cp .env.example .env
  sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$(openssl rand -hex 32)/" .env
  sed -i "s|^CORS_ORIGIN=.*|CORS_ORIGIN=https://$FRONT_DOMAIN|" .env
  echo "!! 已生成 .env,请手动填 TELEGRAM_BOT_TOKEN / TON_WALLET_MNEMONIC / TONCENTER_API_KEY"
fi
grep -q '^PORT=' .env && sed -i "s/^PORT=.*/PORT=$BACKEND_PORT/" .env || echo "PORT=$BACKEND_PORT" >> .env

# ---------- 5. systemd 常驻 ----------
log "配置 systemd 服务"
NODE_BIN=$(command -v node)
cat > /etc/systemd/system/ttearn-server.service <<UNIT
[Unit]
Description=TTEarn backend API
After=network.target

[Service]
Type=simple
WorkingDirectory=$API
ExecStart=$NODE_BIN src/index.js
Restart=always
RestartSec=3
User=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable ttearn-server -q || true
systemctl restart ttearn-server

# ---------- 6. nginx 配置(80,含 acme 验证路径) ----------
log "写 nginx 配置"
mkdir -p "$WEBROOT"

write_nginx() {
  local with_https="$1"

  # 前端站
  {
    cat <<CONF
server {
    listen 80;
    server_name $FRONT_DOMAIN;
    root $WEB;
    index index.html;
    location /.well-known/acme-challenge/ { root $WEBROOT; }
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
    location = /tonconnect-manifest.json { add_header Access-Control-Allow-Origin *; default_type application/json; }
    location / { try_files \$uri \$uri/ /index.html; }
}
CONF
    if [ "$with_https" = 1 ]; then
      cat <<CONF
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $FRONT_DOMAIN;
    ssl_certificate     /etc/letsencrypt/live/$FRONT_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$FRONT_DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    root $WEB;
    index index.html;
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
    location = /tonconnect-manifest.json { add_header Access-Control-Allow-Origin *; default_type application/json; }
    location / { try_files \$uri \$uri/ /index.html; }
}
CONF
    fi
  } > /etc/nginx/sites-available/$FRONT_DOMAIN

  # 后端反代
  {
    cat <<CONF
server {
    listen 80;
    server_name $API_DOMAIN;
    location /.well-known/acme-challenge/ { root $WEBROOT; }
    client_max_body_size 2m;
    location / {
        proxy_pass http://127.0.0.1:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
CONF
    if [ "$with_https" = 1 ]; then
      cat <<CONF
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $API_DOMAIN;
    ssl_certificate     /etc/letsencrypt/live/$API_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$API_DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    client_max_body_size 2m;
    location / {
        proxy_pass http://127.0.0.1:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
CONF
    fi
  } > /etc/nginx/sites-available/$API_DOMAIN

  ln -sf /etc/nginx/sites-available/$FRONT_DOMAIN /etc/nginx/sites-enabled/
  ln -sf /etc/nginx/sites-available/$API_DOMAIN  /etc/nginx/sites-enabled/
}

# 先写 80,验证并 reload(让 acme 能验证)
write_nginx 0
nginx -t && systemctl reload nginx

# ---------- 7. HTTPS 证书(webroot,兼容 Cloudflare 代理) ----------
if [ "$ENABLE_HTTPS" = 1 ]; then
  log "申请/复用证书"
  for d in "$FRONT_DOMAIN" "$API_DOMAIN"; do
    if [ ! -d "/etc/letsencrypt/live/$d" ]; then
      certbot certonly --webroot -w "$WEBROOT" -d "$d" \
        --non-interactive --agree-tos -m "$CERT_EMAIL" || \
        echo "!! $d 证书申请失败(确认 DNS 已指向本机 / Cloudflare 已代理)"
    fi
  done
  # 证书就绪后写入 443 并 reload
  if [ -d "/etc/letsencrypt/live/$FRONT_DOMAIN" ] && [ -d "/etc/letsencrypt/live/$API_DOMAIN" ]; then
    write_nginx 1
    nginx -t && systemctl reload nginx
  fi
fi

# ---------- 8. 自检 ----------
log "自检"
echo -n "backend  : "; curl -s http://127.0.0.1:$BACKEND_PORT/health || echo FAIL
echo
echo -n "service  : "; systemctl is-active ttearn-server
echo ">> 完成。公网验证:"
echo "   https://$FRONT_DOMAIN"
echo "   https://$FRONT_DOMAIN/tonconnect-manifest.json"
echo "   https://$API_DOMAIN/health"
