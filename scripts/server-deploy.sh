#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# 服务器端部署 worker(由本地 deploy.sh 通过 ssh 触发,参数=上传的 tar 包)。
# 幂等:解包 -> 构建前端 -> 部署后端(保留 .env)-> systemd -> nginx(80+443)
#       -> 证书(webroot,兼容 Cloudflare)-> 重启 -> 健康检查。
# 首次和更新都能跑。
# ---------------------------------------------------------------------------
set -euo pipefail

TARBALL="${1:?用法: server-deploy.sh <tarball>}"

FRONT_DOMAIN="tg.ttgame.fun"
API_DOMAIN="tgapi.ttgame.fun"
BACKEND_PORT="3001"
CERT_EMAIL="admin@ttgame.fun"
ENABLE_HTTPS="${ENABLE_HTTPS:-1}"

SRC=/var/www/ttearn-src
WEB=/var/www/ttearn
API=/var/www/ttearn-server/server
WEBROOT=/var/www/certbot

log() { echo -e "\n==> $*"; }

# ---------- 依赖 ----------
if ! command -v node >/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -; apt-get install -y nodejs
fi
PKGS=(); for p in nginx certbot rsync openssl; do command -v "$p" >/dev/null || PKGS+=("$p"); done
[ "${#PKGS[@]}" -gt 0 ] && { apt-get update -qq; apt-get install -y "${PKGS[@]}"; }

# ---------- 解包 ----------
log "解包源码"
mkdir -p "$SRC"
tar -xzf "$TARBALL" -C "$SRC"
rm -f "$TARBALL"

# ---------- 前端 ----------
log "构建前端"
cd "$SRC"
npm install --no-audit --no-fund
npm run build
mkdir -p "$WEB"
rsync -a --delete "$SRC/dist/" "$WEB/"

# ---------- 后端 ----------
log "部署后端(保留 .env)"
mkdir -p "$API"
rsync -a --delete --exclude node_modules --exclude .env "$SRC/server/" "$API/"
cd "$API"
if [ ! -f .env ]; then
  cp .env.example .env
  sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$(openssl rand -hex 32)/" .env
  sed -i "s|^CORS_ORIGIN=.*|CORS_ORIGIN=https://$FRONT_DOMAIN|" .env
  echo "!! 已生成 .env,请手动填 TELEGRAM_BOT_TOKEN / TON_WALLET_MNEMONIC / TONCENTER_API_KEY"
fi
grep -q '^PORT=' .env && sed -i "s/^PORT=.*/PORT=$BACKEND_PORT/" .env || echo "PORT=$BACKEND_PORT" >> .env
npm install --omit=dev --no-audit --no-fund

# ---------- systemd ----------
log "systemd 服务"
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

# ---------- nginx ----------
log "nginx 配置"
mkdir -p "$WEBROOT"
write_nginx() {
  local https="$1"
  { cat <<CONF
server {
    listen 80;
    server_name $FRONT_DOMAIN;
    root $WEB;
    index index.html;
    add_header Permissions-Policy "accelerometer=*, gyroscope=*, magnetometer=*, autoplay=*" always;
    location /.well-known/acme-challenge/ { root $WEBROOT; }
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
    location = /tonconnect-manifest.json { add_header Access-Control-Allow-Origin *; default_type application/json; }
    location / { try_files \$uri \$uri/ /index.html; }
}
CONF
  [ "$https" = 1 ] && cat <<CONF
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
    add_header Permissions-Policy "accelerometer=*, gyroscope=*, magnetometer=*, autoplay=*" always;
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
    location = /tonconnect-manifest.json { add_header Access-Control-Allow-Origin *; default_type application/json; }
    location / { try_files \$uri \$uri/ /index.html; }
}
CONF
  } > /etc/nginx/sites-available/$FRONT_DOMAIN

  { cat <<CONF
server {
    listen 80;
    server_name $API_DOMAIN;
    location /.well-known/acme-challenge/ { root $WEBROOT; }
    client_max_body_size 2m;
    location / { proxy_pass http://127.0.0.1:$BACKEND_PORT; proxy_http_version 1.1; proxy_set_header Host \$host; proxy_set_header X-Real-IP \$remote_addr; proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto \$scheme; }
}
CONF
  [ "$https" = 1 ] && cat <<CONF
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $API_DOMAIN;
    ssl_certificate     /etc/letsencrypt/live/$API_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$API_DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    client_max_body_size 2m;
    location / { proxy_pass http://127.0.0.1:$BACKEND_PORT; proxy_http_version 1.1; proxy_set_header Host \$host; proxy_set_header X-Real-IP \$remote_addr; proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto \$scheme; }
}
CONF
  } > /etc/nginx/sites-available/$API_DOMAIN

  ln -sf /etc/nginx/sites-available/$FRONT_DOMAIN /etc/nginx/sites-enabled/
  ln -sf /etc/nginx/sites-available/$API_DOMAIN  /etc/nginx/sites-enabled/
}

write_nginx 0
nginx -t && systemctl reload nginx

if [ "$ENABLE_HTTPS" = 1 ]; then
  for d in "$FRONT_DOMAIN" "$API_DOMAIN"; do
    [ -d "/etc/letsencrypt/live/$d" ] || certbot certonly --webroot -w "$WEBROOT" -d "$d" \
      --non-interactive --agree-tos -m "$CERT_EMAIL" || echo "!! $d 证书失败(检查 DNS/Cloudflare)"
  done
  if [ -d "/etc/letsencrypt/live/$FRONT_DOMAIN" ] && [ -d "/etc/letsencrypt/live/$API_DOMAIN" ]; then
    write_nginx 1
    nginx -t && systemctl reload nginx
  fi
fi

# ---------- 健康检查 ----------
log "健康检查"
for i in $(seq 1 8); do curl -sf "http://127.0.0.1:$BACKEND_PORT/health" && break || sleep 1; done
echo
echo "==> 完成:https://$FRONT_DOMAIN  |  https://$API_DOMAIN/health"
