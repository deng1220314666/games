#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# 服务器端部署 worker(由本地 deploy.sh 通过 ssh 触发,参数=上传的 tar 包)。
# 前端静态站 + 三个后端服务(api/admin/stats,共用 Postgres + Redis)。
# 幂等:解包 -> 前端构建 -> 后端依赖+迁移 -> systemd x3 -> nginx(tg/tgapi/tgadmin)-> 证书。
# ---------------------------------------------------------------------------
set -euo pipefail

TARBALL="${1:?用法: server-deploy.sh <tarball>}"

FRONT_DOMAIN="tg.ttgame.fun"
API_DOMAIN="tgapi.ttgame.fun"
ADMIN_DOMAIN="tgadmin.ttgame.fun"
API_PORT=3001
ADMIN_PORT=3002
STATS_PORT=3003
CERT_EMAIL="admin@ttgame.fun"

SRC=/var/www/ttearn-src
WEB=/var/www/ttearn
BASE=/var/www/ttearn-server        # 含 db.env / cache.env
API=/var/www/ttearn-server/server  # 后端代码
WEBROOT=/var/www/certbot

log() { echo -e "\n==> $*"; }

# ---------- 依赖 ----------
if ! command -v node >/dev/null; then curl -fsSL https://deb.nodesource.com/setup_22.x | bash -; apt-get install -y nodejs; fi
PKGS=(); for p in nginx certbot rsync openssl; do command -v "$p" >/dev/null || PKGS+=("$p"); done
[ "${#PKGS[@]}" -gt 0 ] && { apt-get update -qq; apt-get install -y "${PKGS[@]}"; }

# ---------- 解包 ----------
log "解包源码"
mkdir -p "$SRC"; tar -xzf "$TARBALL" -C "$SRC"; rm -f "$TARBALL"

# ---------- 前端 ----------
log "构建前端"
cd "$SRC"; npm install --no-audit --no-fund; npm run build
mkdir -p "$WEB"; rsync -a --delete "$SRC/dist/" "$WEB/"

# ---------- 后端代码 ----------
log "同步后端代码(保留 .env / db.env / cache.env)"
mkdir -p "$API"
rsync -a --delete --exclude node_modules --exclude .env "$SRC/server/" "$API/"
cd "$API"
npm install --omit=dev --no-audit --no-fund

# ---------- 后端 .env(缺则补,secrets 自动生成) ----------
log "配置后端 .env"
touch .env
ensure_env() { grep -q "^$1=" .env || echo "$1=$2" >> .env; }
ensure_env API_PORT "$API_PORT"
ensure_env ADMIN_PORT "$ADMIN_PORT"
ensure_env STATS_PORT "$STATS_PORT"
ensure_env CORS_ORIGIN "https://$FRONT_DOMAIN"
ensure_env ADMIN_ORIGIN "https://$ADMIN_DOMAIN"
ensure_env JWT_SECRET "$(openssl rand -hex 32)"
ensure_env ADMIN_SECRET "$(openssl rand -hex 32)"
ensure_env ADMIN_USER "admin"
ensure_env ADMIN_PASSWORD "$(openssl rand -base64 12 | tr -d '/+=' )"
ensure_env TELEGRAM_BOT_TOKEN ""
chmod 600 .env

# ---------- 数据库迁移(建表 + 种子)----------
log "数据库迁移"
node src/shared/migrate.js

# ---------- systemd x3 ----------
log "systemd 服务(api/admin/stats)"
NODE_BIN=$(command -v node)
# 停用旧的单体服务
systemctl disable --now ttearn-server 2>/dev/null || true
make_unit() {
  local name="$1" entry="$2"
  cat > /etc/systemd/system/$name.service <<UNIT
[Unit]
Description=TTEarn $name
After=network.target
[Service]
Type=simple
WorkingDirectory=$API
ExecStart=$NODE_BIN $entry
Restart=always
RestartSec=3
User=root
Environment=NODE_ENV=production
[Install]
WantedBy=multi-user.target
UNIT
}
make_unit ttearn-api   src/api/index.js
make_unit ttearn-admin src/admin/index.js
make_unit ttearn-stats src/stats/index.js
systemctl daemon-reload
for s in ttearn-api ttearn-admin ttearn-stats; do systemctl enable "$s" -q || true; systemctl restart "$s"; done

# ---------- nginx ----------
log "nginx 配置"
mkdir -p "$WEBROOT"

# 静态前端
write_static() {
  local domain="$1" https="$2"
  { cat <<CONF
server {
    listen 80; server_name $domain;
    root $WEB; index index.html;
    location /.well-known/acme-challenge/ { root $WEBROOT; }
    add_header Permissions-Policy "accelerometer=*, gyroscope=*, magnetometer=*, autoplay=*" always;
    gzip on; gzip_types text/css application/javascript application/json image/svg+xml;
    location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
    location = /tonconnect-manifest.json { add_header Access-Control-Allow-Origin *; default_type application/json; }
    location / { try_files \$uri \$uri/ /index.html; }
}
CONF
  [ "$https" = 1 ] && cat <<CONF
server {
    listen 443 ssl http2; listen [::]:443 ssl http2; server_name $domain;
    ssl_certificate /etc/letsencrypt/live/$domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$domain/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3; ssl_ciphers HIGH:!aNULL:!MD5;
    root $WEB; index index.html;
    add_header Permissions-Policy "accelerometer=*, gyroscope=*, magnetometer=*, autoplay=*" always;
    gzip on; gzip_types text/css application/javascript application/json image/svg+xml;
    location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
    location = /tonconnect-manifest.json { add_header Access-Control-Allow-Origin *; default_type application/json; }
    location / { try_files \$uri \$uri/ /index.html; }
}
CONF
  } > /etc/nginx/sites-available/$domain
}
# 反向代理(后端服务)
write_proxy() {
  local domain="$1" port="$2" https="$3"
  { cat <<CONF
server {
    listen 80; server_name $domain;
    location /.well-known/acme-challenge/ { root $WEBROOT; }
    client_max_body_size 2m;
    location / { proxy_pass http://127.0.0.1:$port; proxy_http_version 1.1; proxy_set_header Host \$host; proxy_set_header X-Real-IP \$remote_addr; proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto \$scheme; }
}
CONF
  [ "$https" = 1 ] && cat <<CONF
server {
    listen 443 ssl http2; listen [::]:443 ssl http2; server_name $domain;
    ssl_certificate /etc/letsencrypt/live/$domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$domain/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3; ssl_ciphers HIGH:!aNULL:!MD5;
    client_max_body_size 2m;
    location / { proxy_pass http://127.0.0.1:$port; proxy_http_version 1.1; proxy_set_header Host \$host; proxy_set_header X-Real-IP \$remote_addr; proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for; proxy_set_header X-Forwarded-Proto \$scheme; }
}
CONF
  } > /etc/nginx/sites-available/$domain
}

gen_nginx() {
  local https="$1"
  write_static "$FRONT_DOMAIN" "$https"
  write_proxy  "$API_DOMAIN"   "$API_PORT"   "$https"
  write_proxy  "$ADMIN_DOMAIN" "$ADMIN_PORT" "$https"
  ln -sf /etc/nginx/sites-available/$FRONT_DOMAIN /etc/nginx/sites-enabled/
  ln -sf /etc/nginx/sites-available/$API_DOMAIN   /etc/nginx/sites-enabled/
  ln -sf /etc/nginx/sites-available/$ADMIN_DOMAIN /etc/nginx/sites-enabled/
}

gen_nginx 0
nginx -t && systemctl reload nginx

# ---------- 证书 ----------
log "申请/复用证书"
for d in "$FRONT_DOMAIN" "$API_DOMAIN" "$ADMIN_DOMAIN"; do
  [ -d "/etc/letsencrypt/live/$d" ] || certbot certonly --webroot -w "$WEBROOT" -d "$d" --non-interactive --agree-tos -m "$CERT_EMAIL" || echo "!! $d 证书失败(确认 DNS 已解析)"
done
if [ -d "/etc/letsencrypt/live/$FRONT_DOMAIN" ] && [ -d "/etc/letsencrypt/live/$API_DOMAIN" ] && [ -d "/etc/letsencrypt/live/$ADMIN_DOMAIN" ]; then
  gen_nginx 1; nginx -t && systemctl reload nginx
fi

# ---------- 自检 ----------
log "自检"
for pair in "api:$API_PORT" "admin:$ADMIN_PORT" "stats:$STATS_PORT"; do
  name="${pair%%:*}"; port="${pair##*:}"
  echo -n "$name($port): "
  for i in $(seq 1 8); do curl -sf "http://127.0.0.1:$port/health" && break || sleep 1; done; echo
done
echo "==> 完成:https://$FRONT_DOMAIN | https://$API_DOMAIN | https://$ADMIN_DOMAIN"
